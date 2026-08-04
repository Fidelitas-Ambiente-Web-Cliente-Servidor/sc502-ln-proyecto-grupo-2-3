/* Punto único de inicialización de los módulos cargados por cada página. */
function obtenerUsuarioActivo(){
    try{
        const usuario = localStorage.getItem("usuario-activo-parkeate");
        return usuario ? JSON.parse(usuario) : null;
    }catch(error){
        return null;
    }
}

function baseApi(){
    const path = window.location.pathname;
    const enPages = path.includes("/pages/") || path.includes("/public/pages/");
    const enPublic = path.includes("/public/");

    if(enPublic){
        return enPages ? "../api/" : "api/";
    }
    return enPages ? "../public/api/" : "public/api/";
}

function resolverRutaApi(action){
    const mapa = {
        "bootstrap":"auth.php?action=bootstrap",
        "auth.login":"auth.php?action=login",
        "auth.register":"auth.php?action=register",
        "auth.session":"auth.php?action=session",
        "auth.logout":"auth.php?action=logout",
        "auth.update-profile":"auth.php?action=update-profile",
        "favorite.set":"favoritos.php?action=set",
        "sync.set":"admin.php?action=state-set",
        "parkings.list":"parqueos.php?action=list",
        "reservas.list":"reservas.php?action=list",
        "reservas.history":"reservas.php?action=history",
        "reservas.create":"reservas.php?action=create",
        "reservas.cancel":"reservas.php?action=cancel",
        "alertas.list":"alertas.php?action=list",
        "alertas.config":"alertas.php?action=config",
        "alertas.mark-read":"alertas.php?action=mark-read",
        "admin.dashboard":"admin.php?action=dashboard",
        "admin.users":"admin.php?action=users",
        "admin.user-status":"admin.php?action=user-status",
        "admin.reservas":"admin.php?action=reservas",
        "admin.reserva-cancel":"admin.php?action=reserva-cancel",
        "admin.parkings":"admin.php?action=parkings",
        "admin.parking-save":"admin.php?action=parking-save",
        "admin.parking-delete":"admin.php?action=parking-delete",
        "admin.requests":"admin.php?action=requests",
        "admin.request-approve":"admin.php?action=request-approve",
        "admin.request-reject":"admin.php?action=request-reject",
        "admin.state-set":"admin.php?action=state-set"
    };
    return mapa[action] || `auth.php?action=${encodeURIComponent(action)}`;
}

window.backendRequest = async function backendRequest(action, opciones={}){
    const ruta = resolverRutaApi(action);
    const bases = [baseApi(), "api/", "../api/", "public/api/", "../public/api/"];
    let respuesta = null;

    for(const base of Array.from(new Set(bases))){
        try{
            const tentativa = await fetch(base + ruta, {
                credentials: "same-origin",
                headers: {
                    "Content-Type":"application/json",
                    ...(opciones.headers || {})
                },
                ...opciones
            });
            if(tentativa.status !== 404){
                respuesta = tentativa;
                break;
            }
            respuesta = tentativa;
        }catch(error){
            // Intenta siguiente base.
        }
    }

    if(!respuesta){
        throw new Error("No fue posible contactar el backend.");
    }

    const texto = await respuesta.text();
    let contenido = {};
    if(texto && texto.trim()){
        try{
            contenido = JSON.parse(texto);
        }catch(error){
            contenido = {};
        }
    }

    if(!respuesta.ok){
        throw new Error((contenido && contenido.message) || "No fue posible completar la solicitud.");
    }
    return contenido;
};

window.syncBackendState = function syncBackendState(key, data){
    if(typeof window.backendRequest !== "function") return;

    // Las reservas/favoritos/parqueos admin se sincronizan por endpoints específicos.
    if(key===DB_KEYS.reservas || key===DB_KEYS.parqueosAprobados || key===DB_KEYS.usuarios){
        return;
    }

    if(key===DB_KEYS.configAlertas){
        window.backendRequest("alertas.config", {
            method: "POST",
            body: JSON.stringify(data)
        }).catch(()=>{});
        return;
    }

    window.backendRequest("admin.state-set", {
        method: "POST",
        body: JSON.stringify({key, data})
    }).catch(()=>{});
};

window.syncFavorite = function syncFavorite(parkingId, active){
    if(typeof window.backendRequest !== "function") return;
    window.backendRequest("favorite.set", {
        method: "POST",
        body: JSON.stringify({parkingId:Number(parkingId), active:!!active})
    }).catch(()=>{});
};

function actualizarBotonSesionNavbar(usuario){
    const usuarioActual = usuario ?? obtenerUsuarioActivo();
    const enPages = window.location.pathname.includes("/pages/");
    const rutaLogin = enPages ? "login.html" : "pages/login.html";
    const rutaPerfil = enPages ? "perfil.html" : "pages/perfil.html";

    document.querySelectorAll('a.btn.btn-parkeate[href*="login.html"], a.btn.btn-parkeate[href*="perfil.html"]').forEach((boton)=>{
        if(usuarioActual){
            boton.setAttribute("href", rutaPerfil);
            boton.innerHTML = '<i class="bi bi-person-circle"></i> Mi Perfil';
            return;
        }
        boton.setAttribute("href", rutaLogin);
        boton.innerHTML = '<i class="bi bi-person-circle"></i> Iniciar Sesión';
    });
}

function actualizarAccesoAdmin(usuario){
    const rol = String(usuario?.rol || "").trim().toLowerCase();
    const esAdmin = rol === "administrador";
    const enPages = window.location.pathname.includes("/pages/");
    const rutaAdmin = enPages ? "admin.html" : "pages/admin.html";

    document.querySelectorAll("nav .navbar-nav, nav ul").forEach((lista)=>{
        const enlaces = Array.from(lista.querySelectorAll("a"));
        const existente = enlaces.find((a)=>{
            const href = a.getAttribute("href") || "";
            return href.includes("admin.html") || (a.textContent || "").toLowerCase().includes("admin");
        });

        if(esAdmin && !existente){
            const item = document.createElement("li");
            item.className = "nav-item";
            item.innerHTML = `<a class="nav-link" href="${rutaAdmin}">Administración</a>`;
            lista.appendChild(item);
            return;
        }

        if(!esAdmin && existente){
            const item = existente.closest("li");
            if(item) item.remove();
        }
    });
}

async function hidratarDesdeBackend(){
    if(typeof window.backendRequest !== "function") return;
    try{
        const respuesta = await window.backendRequest("bootstrap");
        if(respuesta && respuesta.keys && typeof respuesta.keys === "object"){
            Object.entries(respuesta.keys).forEach(([clave, valor])=>{
                localStorage.setItem(clave, JSON.stringify(valor));
            });
        }

        Object.keys(localStorage).forEach((clave)=>{
            if(clave.startsWith("favorito-")){
                localStorage.removeItem(clave);
            }
        });

        if(Array.isArray(respuesta?.favoritos)){
            respuesta.favoritos.forEach((id)=>{
                localStorage.setItem(`favorito-${id}`, "true");
            });
        }

        if(respuesta?.user){
            localStorage.setItem("usuario-activo-parkeate", JSON.stringify(respuesta.user));
            return respuesta.user;
        }
        localStorage.removeItem("usuario-activo-parkeate");
        return null;
    }catch(error){
        return obtenerUsuarioActivo();
    }
}

document.addEventListener("DOMContentLoaded", async ()=>{
    const usuario = await hidratarDesdeBackend();
    actualizarBotonSesionNavbar(usuario);
    actualizarAccesoAdmin(usuario);

    [
        "renderParqueos", "animarContadores", "efectoNavbar", "activarBuscador",
        "activarBusquedaRapida", "inicializarLogin", "inicializarRegistro",
        "inicializarRecuperacion", "inicializarPerfil", "formatoTelefono",
        "inicializarFavoritos", "inicializarReservas", "inicializarHistorial",
        "inicializarAlertas", "inicializarAdmin", "inicializarAdminParqueo",
        "inicializarAyuda", "inicializarDetalleParqueo"
    ].forEach(nombre=>{
        if(typeof window[nombre] === "function") window[nombre]();
    });
});
