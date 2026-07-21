const parqueos = [
    {
        id:1,
        nombre:"Parqueo Central",
        provincia:"San José",
        zona:"Escazú",
        ubicacion:"Escazú Centro",
        precio:1500,
        espacios:18,
        calificacion:4.9,
        disponible:true,
        imagen:"https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800"
    },
    {
        id:2,
        nombre:"City Parking",
        provincia:"Heredia",
        zona:"Belén",
        ubicacion:"Belén",
        precio:1200,
        espacios:0,
        calificacion:4.7,
        disponible:false,
        imagen:"https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800"
    },
    {
        id:3,
        nombre:"Parking Plaza",
        provincia:"Alajuela",
        zona:"Centro",
        ubicacion:"Alajuela Centro",
        precio:1000,
        espacios:8,
        calificacion:4.8,
        disponible:true,
        imagen:"https://images.unsplash.com/photo-1511818966892-d7d671e672a2?w=800"
    },
    {
        id:4,
        nombre:"Safe Parking",
        provincia:"Cartago",
        zona:"Centro",
        ubicacion:"Cartago Centro",
        precio:1800,
        espacios:5,
        calificacion:5.0,
        disponible:true,
        imagen:"https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=800"
    },
    {
        id:5,
        nombre:"Pacific Parking",
        provincia:"Puntarenas",
        zona:"Puntarenas",
        ubicacion:"Paseo de los Turistas",
        precio:1400,
        espacios:14,
        calificacion:4.6,
        disponible:true,
        imagen:"https://images.unsplash.com/photo-1494526585095-c41746248156?w=800"
    },
    {
        id:6,
        nombre:"Limon Parking",
        provincia:"Limón",
        zona:"Centro",
        ubicacion:"Puerto Limón",
        precio:1100,
        espacios:9,
        calificacion:4.5,
        disponible:true,
        imagen:"https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800"
    },
    {
        id:7,
        nombre:"Liberia Park",
        provincia:"Guanacaste",
        zona:"Liberia",
        ubicacion:"Liberia Centro",
        precio:1300,
        espacios:12,
        calificacion:4.7,
        disponible:true,
        imagen:"https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800"
    },
    {
        id:8,
        nombre:"Atenas Parking",
        provincia:"Alajuela",
        zona:"Atenas",
        ubicacion:"Atenas Centro",
        precio:900,
        espacios:21,
        calificacion:4.8,
        disponible:true,
        imagen:"https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=800"
    },
    {
        id:9,
        nombre:"Airport Parking",
        provincia:"Alajuela",
        zona:"Río Segundo",
        ubicacion:"Aeropuerto Juan Santamaría",
        precio:2500,
        espacios:30,
        calificacion:5.0,
        disponible:true,
        imagen:"https://images.unsplash.com/photo-1503736334956-4c8f8e92946d?w=800"
    },
    {
        id:10,
        nombre:"Mall Parking",
        provincia:"San José",
        zona:"Curridabat",
        ubicacion:"Multiplaza Curridabat",
        precio:1700,
        espacios:11,
        calificacion:4.9,
        disponible:true,
        imagen:"https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800"
    },
    {
        id:11,
        nombre:"Premium Parking",
        provincia:"Heredia",
        zona:"San Pablo",
        ubicacion:"San Pablo",
        precio:2000,
        espacios:4,
        calificacion:5.0,
        disponible:true,
        imagen:"https://images.unsplash.com/photo-1511919884226-fd3cad34687c?w=800"
    },
    {
        id:12,
        nombre:"Eco Parking",
        provincia:"Cartago",
        zona:"Paraíso",
        ubicacion:"Paraíso",
        precio:950,
        espacios:16,
        calificacion:4.6,
        disponible:true,
        imagen:"https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=800"
    }
];
const DB_KEYS = {
    usuarios:"parkeate-usuarios",
    parqueosAprobados:"parkeate-parqueos-aprobados",
    reservas:"reservas-parkeate",
    espacios:"espacios-admin-parkeate",
    solicitudesParqueo:"parkeate-solicitudes-parqueo",
    resenas:"parkeate-resenas",
    incidentes:"parkeate-incidentes",
    configAlertas:"parkeate-config-alertas"
};
function leerDatos(clave, respaldo){
    const datos = localStorage.getItem(clave);
    if(!datos) return respaldo;
    return JSON.parse(datos);
}
function guardarDatos(clave, datos){
    localStorage.setItem(clave,JSON.stringify(datos));
}
function generarId(prefijo){
    return `${prefijo}-${Date.now()}-${Math.floor(Math.random()*1000)}`;
}
function obtenerUsuarios(){
    return leerDatos(DB_KEYS.usuarios,[
        {id:"usr-1", nombre:"Santiago Mora", correo:"santiago@parkeate.com", telefono:"8888-8888", rol:"Administrador", estado:"Activo"},
        {id:"usr-2", nombre:"María González", correo:"maria@email.com", telefono:"8888-1111", rol:"Usuario", estado:"Activo"},
        {id:"usr-3", nombre:"Daniel Vargas", correo:"daniel@email.com", telefono:"8888-2222", rol:"Usuario", estado:"Activo"}
    ]);
}
function guardarUsuarios(usuarios){
    guardarDatos(DB_KEYS.usuarios,usuarios);
}
function obtenerSolicitudesParqueo(){
    return leerDatos(DB_KEYS.solicitudesParqueo,[
        {id:"sol-1", nombre:"Parqueo La Sabana", provincia:"San José", zona:"Sabana", estado:"Pendiente"},
        {id:"sol-2", nombre:"Heredia Centro Park", provincia:"Heredia", zona:"Centro", estado:"Pendiente"}
    ]);
}
function obtenerParqueos(){
    return [...parqueos,...leerDatos(DB_KEYS.parqueosAprobados,[])];
}
function guardarParqueosAprobados(parqueosAprobados){
    guardarDatos(DB_KEYS.parqueosAprobados,parqueosAprobados);
}
function guardarSolicitudesParqueo(solicitudes){
    guardarDatos(DB_KEYS.solicitudesParqueo,solicitudes);
}
function generarEstrellas(calificacion){
    let estrellas = "";
    for(let i = 1; i <= 5; i++){
        if(i <= Math.round(calificacion)){
            estrellas += `<i class="bi bi-star-fill text-warning"></i>`;
        }else{
            estrellas += `<i class="bi bi-star text-warning"></i>`;
        }
    }
    return estrellas;
}
function generarBadge(disponible){
    return disponible
        ? `<span class="badge bg-success">Disponible</span>`
        : `<span class="badge bg-danger">Completo</span>`;
}
function crearTarjetaParqueo(parqueo){
    return `     <div class="col-lg-3 col-md-6 mb-4">         <div class="card tarjeta-parqueo h-100">             <img                 src="${parqueo.imagen}"                 class="card-img-top"                 alt="${parqueo.nombre}">             <div class="card-body">                 <div class="d-flex justify-content-between align-items-center mb-2">                     ${generarBadge(parqueo.disponible)}                     <i                         class="bi bi-heart favorito fs-4 text-secondary"                         data-id="${parqueo.id}">                     </i>                 </div>                 <h5 class="fw-bold">                     ${parqueo.nombre}                 </h5>                 <p class="text-muted">                     <i class="bi bi-geo-alt-fill"></i>                     ${parqueo.ubicacion}                 </p>                 <div class="mb-2">                     ${generarEstrellas(parqueo.calificacion)}                     <span class="ms-2">                         ${parqueo.calificacion}                     </span>                 </div>                 <p>                     🚗 ${parqueo.espacios} espacios disponibles                 </p>                 <h4 class="precio">                     ₡${parqueo.precio}/hora                 </h4>             </div>             <div class="card-footer bg-white border-0">                 <button                     class="btn btn-parkeate btn-reservar w-100">                     <i class="bi bi-calendar-check"></i>                     Reservar                 </button>             </div>         </div>     </div>     `;
}
function renderParqueos(){
    const contenedor = document.getElementById("contenedor-parqueos");
    if(!contenedor) return;
    contenedor.innerHTML = "";
    obtenerParqueos().forEach(parqueo=>{
        contenedor.innerHTML += crearTarjetaParqueo(parqueo);
    });
    activarFavoritos();
    activarBotonesReserva();
}
function activarFavoritos(){
    const favoritos = document.querySelectorAll(".favorito");
    favoritos.forEach(favorito=>{
        const id = favorito.dataset.id;
        if(localStorage.getItem("favorito-"+id)==="true"){
            favorito.classList.remove("bi-heart","text-secondary");
            favorito.classList.add("bi-heart-fill","text-danger");
        }
        favorito.addEventListener("click",()=>{
            favorito.classList.toggle("bi-heart");
            favorito.classList.toggle("bi-heart-fill");
            favorito.classList.toggle("text-secondary");
            favorito.classList.toggle("text-danger");
            const activo = favorito.classList.contains("bi-heart-fill");
            localStorage.setItem("favorito-"+id,activo);
            if(document.getElementById("contenedor-favoritos")){
                inicializarFavoritos();
            }
        });
    });
}
function inicializarFavoritos(){
    const contenedor = document.getElementById("contenedor-favoritos");
    if(!contenedor) return;
    const favoritosGuardados = obtenerParqueos().filter(parqueo=>{
        return localStorage.getItem("favorito-"+parqueo.id)==="true";
    });
    contenedor.innerHTML = "";
    if(favoritosGuardados.length===0){
        contenedor.innerHTML = `             <div class="col-12">                 <div class="card-beneficio">                     <i class="bi bi-heart"></i>                     <h4>                         No tienes parqueos favoritos todavía.                     </h4>                     <p>                         Marca parqueos como favoritos desde Inicio o Buscar para verlos aquí.                     </p>                     <a href="buscar.html" class="btn btn-parkeate">                         Buscar Parqueos                     </a>                 </div>             </div>         `;
        return;
    }
    favoritosGuardados.forEach(parqueo=>{
        contenedor.innerHTML += crearTarjetaParqueo(parqueo);
    });
    activarFavoritos();
    activarBotonesReserva();
}
function activarBotonesReserva(){
    const botones = document.querySelectorAll(".btn-reservar");
    botones.forEach(boton=>{
        boton.addEventListener("click",()=>{
            const ruta = window.location.pathname.includes("/pages/")
                ? "reservas.html"
                : "pages/reservas.html";
            window.location.href = ruta;
        });
    });
}
function obtenerReservas(){
    const reservas = localStorage.getItem(DB_KEYS.reservas);
    if(reservas){
        const normalizadas = JSON.parse(reservas).map(reserva=>{
            return {
                ...reserva,
                id:reserva.id || generarId("res"),
                parqueo:reserva.parqueo || "Parqueo Central",
                horaSalida:reserva.horaSalida || reserva.salida || "10:00",
                estado:reserva.estado || "Activa"
            };
        });
        guardarReservas(normalizadas);
        return normalizadas;
    }
    return [
        {
            usuario:"Juan Pérez",
            placa:"ABC-123",
            id:"res-1",
            parqueo:"Parqueo Central",
            espacio:"A-01",
            fecha:"2026-07-07",
            hora:"08:00",
            horaSalida:"10:00",
            estado:"Confirmada",
            monto:1500
        },
        {
            usuario:"María González",
            placa:"XYZ-789",
            id:"res-2",
            parqueo:"City Parking",
            espacio:"B-02",
            fecha:"2026-07-08",
            hora:"10:30",
            horaSalida:"12:30",
            estado:"Activa",
            monto:1200
        }
    ];
}
function guardarReservas(reservas){
    guardarDatos(DB_KEYS.reservas,reservas);
}
function renderReservas(){
    const tabla = document.getElementById("tablaReservas");
    if(!tabla) return;
    const reservas = obtenerReservas();
    tabla.innerHTML = "";
    reservas.forEach(reserva=>{
        tabla.innerHTML += `             <tr>                 <td>${reserva.usuario}</td>                 <td>${reserva.placa}</td>                 <td>${reserva.parqueo || "Parqueo no asignado"}</td>                 <td>${reserva.espacio}</td>                 <td>${reserva.fecha}</td>                 <td>${reserva.hora}</td>                 <td>${reserva.horaSalida}</td>                 <td><span class="badge bg-success">${reserva.estado}</span></td>                 <td>                     <button class="btn btn-parkeate btn-cancelar-reserva" data-id="${reserva.id}">                         Cancelar                     </button>                 </td>             </tr>         `;
    });
    activarCancelacionReservas();
}
function cancelarReserva(id){
    const reservas = obtenerReservas().map(reserva=>{
        if(reserva.id===id){
            return {
                ...reserva,
                estado:"Cancelada"
            };
        }
        return reserva;
    });
    guardarReservas(reservas);
    renderReservas();
    inicializarHistorial();
    inicializarAdmin();
}
function eliminarReserva(id){
    const reservas = obtenerReservas().filter(reserva=>reserva.id!==id);
    guardarReservas(reservas);
    renderReservas();
    inicializarHistorial();
    inicializarAdmin();
}
function activarCancelacionReservas(){
    document.querySelectorAll(".btn-cancelar-reserva").forEach(boton=>{
        boton.addEventListener("click",()=>{
            cancelarReserva(boton.dataset.id);
        });
    });
}
function cargarParqueosReserva(){
    const select = document.getElementById("parqueoReserva");
    if(!select) return;
    obtenerParqueos().forEach(parqueo=>{
        const option = document.createElement("option");
        option.value = parqueo.nombre;
        option.textContent = `${parqueo.nombre} - ${parqueo.ubicacion}`;
        select.appendChild(option);
    });
}
function inicializarReservas(){
    const formReserva = document.getElementById("formReserva");
    if(!formReserva) return;
    cargarParqueosReserva();
    renderReservas();
    formReserva.addEventListener("submit",(e)=>{
        e.preventDefault();
        const usuario = document.getElementById("nombreReserva").value.trim();
        const placa = document.getElementById("placaReserva").value.trim();
        const parqueo = document.getElementById("parqueoReserva").value;
        const espacio = document.getElementById("espacioReserva").value;
        const fecha = document.getElementById("fechaReserva").value;
        const hora = document.getElementById("horaReserva").value;
        const horaSalida = document.getElementById("horaSalidaReserva").value;
        if(!usuario || !placa || !parqueo || !espacio || !fecha || !hora || !horaSalida){
            alert("Debe completar todos los campos.");
            return;
        }
        const reservas = obtenerReservas();
        reservas.push({
            id:generarId("res"),
            usuario,
            placa,
            parqueo,
            espacio,
            fecha,
            hora,
            horaSalida,
            estado:"Activa",
            monto:1500
        });
        guardarReservas(reservas);
        renderReservas();
        formReserva.reset();
        alert("Reserva registrada correctamente.");
    });
}
function inicializarHistorial(){
    const tabla = document.getElementById("tablaHistorial");
    if(!tabla) return;
    const reservas = obtenerReservas();
    tabla.innerHTML = "";
    reservas.forEach(reserva=>{
        tabla.innerHTML += `             <tr>                 <td>${reserva.fecha}</td>                 <td>${reserva.parqueo || "Parqueo no asignado"}</td>                 <td>${reserva.espacio}</td>                 <td>${reserva.placa}</td>                 <td><span class="badge bg-success">${reserva.estado}</span></td>                 <td class="precio">₡${reserva.monto}</td>                 <td>                     <button class="btn btn-parkeate btn-cancelar-reserva" data-id="${reserva.id}">                         Cancelar                     </button>                 </td>             </tr>         `;
    });
    activarCancelacionReservas();
}
function inicializarAlertas(){
    const contenedor = document.getElementById("contenedor-alertas");
    if(!contenedor) return;
    const formConfig = document.getElementById("formConfigAlertas");
    const selectParqueo = document.getElementById("alertaParqueo");
    const inputZona = document.getElementById("alertaZona");
    const mensajeConfig = document.getElementById("mensajeConfigAlertas");
    const configActual = leerDatos(DB_KEYS.configAlertas,{zona:"", parqueo:""});
    if(selectParqueo && selectParqueo.options.length===1){
        obtenerParqueos().forEach(parqueo=>{
            const option = document.createElement("option");
            option.value = parqueo.nombre;
            option.textContent = parqueo.nombre;
            selectParqueo.appendChild(option);
        });
        selectParqueo.value = configActual.parqueo || "";
    }
    if(inputZona){
        inputZona.value = configActual.zona || "";
    }
    if(formConfig && !formConfig.dataset.inicializado){
        formConfig.dataset.inicializado = "true";
        formConfig.addEventListener("submit",(e)=>{
            e.preventDefault();
            guardarDatos(DB_KEYS.configAlertas,{
                zona:inputZona.value.trim(),
                parqueo:selectParqueo.value
            });
            if(mensajeConfig){
                mensajeConfig.classList.remove("d-none");
            }
            inicializarAlertas();
        });
    }
    const alertasLeidas = JSON.parse(localStorage.getItem("alertas-leidas-parkeate")) || [];
    const reservas = obtenerReservas();
    const favoritosGuardados = obtenerParqueos().filter(parqueo=>{
        return localStorage.getItem("favorito-"+parqueo.id)==="true";
    });
    const alertas = [];
    reservas.slice(-3).reverse().forEach((reserva,index)=>{
        alertas.push({
            id:`reserva-${reserva.fecha}-${reserva.hora}-${reserva.espacio}-${index}`,
            icono:"bi-check-circle-fill text-success",
            titulo:"Reserva Confirmada",
            tiempo:"Reciente",
            mensaje:`Tu reserva en ${reserva.parqueo || "Parqueo no asignado"}, espacio ${reserva.espacio}, fue confirmada para el ${reserva.fecha} a las ${reserva.hora}.`
        });
        alertas.push({
            id:`recordatorio-${reserva.fecha}-${reserva.hora}-${reserva.espacio}-${index}`,
            icono:"bi-bell-fill text-warning",
            titulo:"Recordatorio",
            tiempo:"Pendiente",
            mensaje:`Recuerda tu reserva en ${reserva.parqueo || "Parqueo no asignado"} para el ${reserva.fecha} a las ${reserva.hora}.`
        });
    });
    const parqueosConAlerta = obtenerParqueos().filter(parqueo=>{
        const coincideParqueo = !configActual.parqueo || parqueo.nombre===configActual.parqueo;
        const coincideZona = !configActual.zona || parqueo.zona.toLowerCase().includes(configActual.zona.toLowerCase());
        return coincideParqueo && coincideZona && parqueo.disponible;
    });
    parqueosConAlerta.slice(0,2).forEach(parqueo=>{
        alertas.push({
            id:`favorito-${parqueo.id}`,
            icono:"bi-car-front-fill text-primary",
            titulo:"Favorito Disponible",
            tiempo:"Disponible",
            mensaje:`${parqueo.nombre} tiene ${parqueo.espacios} espacios disponibles.`
        });
    });
    favoritosGuardados.slice(0,2).forEach(parqueo=>{
        alertas.push({
            id:`favorito-${parqueo.id}`,
            icono:"bi-heart-fill text-danger",
            titulo:"Favorito guardado",
            tiempo:"Disponible",
            mensaje:`${parqueo.nombre} sigue guardado en tus favoritos frecuentes.`
        });
    });
    alertas.push({
        id:"promo-general",
        icono:"bi-percent text-danger",
        titulo:"Promoción",
        tiempo:"Disponible",
        mensaje:"Obtén un 20% de descuento en tu próxima reserva utilizando Parkeate."
    });
    const alertasPendientes = alertas.filter(alerta=>!alertasLeidas.includes(alerta.id));
    contenedor.innerHTML = "";
    if(alertasPendientes.length===0){
        contenedor.innerHTML = `             <div class="col-12">                 <div class="card-beneficio">                     <i class="bi bi-bell"></i>                     <h4>                         No tienes alertas pendientes.                     </h4>                     <p>                         Las nuevas reservas y avisos aparecerán aquí.                     </p>                 </div>             </div>         `;
        return;
    }
    alertasPendientes.forEach(alerta=>{
        contenedor.innerHTML += `             <div class="col-lg-6">                 <div class="card h-100">                     <div class="card-body">                         <div class="d-flex align-items-center mb-3">                             <i class="bi ${alerta.icono} fs-1 me-3"></i>                             <div>                                 <h4 class="mb-1">                                     ${alerta.titulo}                                 </h4>                                 <small class="text-muted">                                     ${alerta.tiempo}                                 </small>                             </div>                         </div>                         <p>                             ${alerta.mensaje}                         </p>                         <button class="btn btn-parkeate btn-alerta-leida" data-id="${alerta.id}">                             Marcar como leída                         </button>                     </div>                 </div>             </div>         `;
    });
    document.querySelectorAll(".btn-alerta-leida").forEach(boton=>{
        boton.addEventListener("click",()=>{
            const id = boton.dataset.id;
            const leidas = JSON.parse(localStorage.getItem("alertas-leidas-parkeate")) || [];
            if(!leidas.includes(id)){
                leidas.push(id);
            }
            localStorage.setItem("alertas-leidas-parkeate",JSON.stringify(leidas));
            inicializarAlertas();
        });
    });
}
function inicializarAdmin(){
    const tablaUsuarios = document.getElementById("tablaUsuariosAdmin");
    if(!tablaUsuarios) return;
    const usuarios = obtenerUsuarios();
    const reservas = obtenerReservas();
    const solicitudes = obtenerSolicitudesParqueo();
    const tablaReservasAdmin = document.getElementById("tablaReservasAdmin");
    const tablaSolicitudes = document.getElementById("tablaSolicitudesParqueo");
    tablaUsuarios.innerHTML = "";
    usuarios.forEach(usuario=>{
        tablaUsuarios.innerHTML += `             <tr>                 <td>${usuario.nombre}</td>                 <td>${usuario.correo}</td>                 <td>${usuario.rol}</td>                 <td><span class="badge bg-success">${usuario.estado}</span></td>                 <td>                     <button class="btn btn-parkeate btn-toggle-usuario" data-id="${usuario.id}">                         ${usuario.estado==="Activo" ? "Desactivar" : "Activar"}                     </button>                     <button class="btn btn-parkeate btn-eliminar-usuario" data-id="${usuario.id}">                         Eliminar                     </button>                 </td>             </tr>         `;
    });
    document.getElementById("totalUsuarios").textContent = usuarios.length;
    document.getElementById("totalEspacios").textContent = obtenerParqueos().length;
    document.getElementById("totalDisponibles").textContent = obtenerParqueos().filter(parqueo=>parqueo.disponible).length;
    document.getElementById("totalReservasAdmin").textContent = reservas.length;
    if(tablaReservasAdmin){
        tablaReservasAdmin.innerHTML = "";
        reservas.forEach(reserva=>{
            tablaReservasAdmin.innerHTML += `                 <tr>                     <td>${reserva.usuario}</td>                     <td>${reserva.parqueo}</td>                     <td>${reserva.espacio}</td>                     <td>${reserva.fecha}</td>                     <td><span class="badge bg-success">${reserva.estado}</span></td>                     <td>                         <button class="btn btn-parkeate btn-cancelar-reserva" data-id="${reserva.id}">                             Cancelar                         </button>                         <button class="btn btn-parkeate btn-eliminar-reserva" data-id="${reserva.id}">                             Eliminar                         </button>                     </td>                 </tr>             `;
        });
    }
    if(tablaSolicitudes){
        tablaSolicitudes.innerHTML = "";
        solicitudes.forEach(solicitud=>{
            tablaSolicitudes.innerHTML += `                 <tr>                     <td>${solicitud.nombre}</td>                     <td>${solicitud.provincia}</td>                     <td>${solicitud.zona}</td>                     <td><span class="badge bg-danger">${solicitud.estado}</span></td>                     <td>                         <button class="btn btn-parkeate btn-aprobar-parqueo" data-id="${solicitud.id}">                             Aprobar                         </button>                         <button class="btn btn-parkeate btn-rechazar-parqueo" data-id="${solicitud.id}">                             Rechazar                         </button>                     </td>                 </tr>             `;
        });
    }
    document.querySelectorAll(".btn-toggle-usuario").forEach(boton=>{
        boton.addEventListener("click",()=>{
            const actualizados = obtenerUsuarios().map(usuario=>{
                if(usuario.id===boton.dataset.id){
                    return {
                        ...usuario,
                        estado:usuario.estado==="Activo" ? "Inactivo" : "Activo"
                    };
                }
                return usuario;
            });
            guardarUsuarios(actualizados);
            inicializarAdmin();
        });
    });
    document.querySelectorAll(".btn-eliminar-usuario").forEach(boton=>{
        boton.addEventListener("click",()=>{
            guardarUsuarios(obtenerUsuarios().filter(usuario=>usuario.id!==boton.dataset.id));
            inicializarAdmin();
        });
    });
    document.querySelectorAll(".btn-eliminar-reserva").forEach(boton=>{
        boton.addEventListener("click",()=>{
            eliminarReserva(boton.dataset.id);
        });
    });
    activarCancelacionReservas();
    document.querySelectorAll(".btn-aprobar-parqueo").forEach(boton=>{
        boton.addEventListener("click",()=>{
            const solicitudesActuales = obtenerSolicitudesParqueo();
            const aprobada = solicitudesActuales.find(solicitud=>solicitud.id===boton.dataset.id);
            if(aprobada){
                const aprobados = leerDatos(DB_KEYS.parqueosAprobados,[]);
                aprobados.push({
                    id:obtenerParqueos().length+1,
                    nombre:aprobada.nombre,
                    provincia:aprobada.provincia,
                    zona:aprobada.zona,
                    ubicacion:`${aprobada.zona}, ${aprobada.provincia}`,
                    precio:1200,
                    espacios:10,
                    calificacion:4.5,
                    disponible:true,
                    imagen:"https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800"
                });
                guardarParqueosAprobados(aprobados);
            }
            guardarSolicitudesParqueo(solicitudesActuales.filter(solicitud=>solicitud.id!==boton.dataset.id));
            inicializarAdmin();
        });
    });
    document.querySelectorAll(".btn-rechazar-parqueo").forEach(boton=>{
        boton.addEventListener("click",()=>{
            guardarSolicitudesParqueo(obtenerSolicitudesParqueo().filter(solicitud=>solicitud.id!==boton.dataset.id));
            inicializarAdmin();
        });
    });
}
function inicializarAdminParqueo(){
    const tabla = document.getElementById("tablaParqueosAdmin");
    const form = document.getElementById("formParqueo");
    const filtro = document.getElementById("filtroParqueo");
    if(!tabla) return;
    let espacios = JSON.parse(localStorage.getItem("espacios-admin-parkeate")) || [
        {zona:"A", espacio:"A-01", estado:"Disponible", placa:"-", tarifa:1500},
        {zona:"A", espacio:"A-02", estado:"Reservado", placa:"ABC-123", tarifa:1500},
        {zona:"B", espacio:"B-01", estado:"Ocupado", placa:"XYZ-789", tarifa:1200},
        {zona:"C", espacio:"C-01", estado:"Mantenimiento", placa:"-", tarifa:1000}
    ];
    function guardarEspacios(){
        localStorage.setItem("espacios-admin-parkeate",JSON.stringify(espacios));
    }
    function renderEspacios(){
        const estado = filtro ? filtro.value : "Todos";
        const lista = estado==="Todos"
            ? espacios
            : espacios.filter(espacio=>espacio.estado===estado);
        tabla.innerHTML = "";
        lista.forEach(espacio=>{
            tabla.innerHTML += `                 <tr>                     <td>${espacio.zona}</td>                     <td>${espacio.espacio}</td>                     <td>                         <select class="form-select estado-espacio" data-espacio="${espacio.espacio}">                             <option ${espacio.estado==="Disponible" ? "selected" : ""}>Disponible</option>                             <option ${espacio.estado==="Ocupado" ? "selected" : ""}>Ocupado</option>                             <option ${espacio.estado==="Reservado" ? "selected" : ""}>Reservado</option>                             <option ${espacio.estado==="Mantenimiento" ? "selected" : ""}>Mantenimiento</option>                         </select>                     </td>                     <td>${espacio.placa}</td>                     <td class="precio">₡${espacio.tarifa}</td>                     <td>                         <button class="btn btn-parkeate btn-eliminar-espacio" data-espacio="${espacio.espacio}">                             Eliminar                         </button>                     </td>                 </tr>             `;
        });
        actualizarEstadisticasEspacios();
        document.querySelectorAll(".estado-espacio").forEach(select=>{
            select.addEventListener("change",()=>{
                espacios = espacios.map(espacio=>{
                    if(espacio.espacio===select.dataset.espacio){
                        return {
                            ...espacio,
                            estado:select.value
                        };
                    }
                    return espacio;
                });
                guardarEspacios();
                renderEspacios();
            });
        });
        document.querySelectorAll(".btn-eliminar-espacio").forEach(boton=>{
            boton.addEventListener("click",()=>{
                espacios = espacios.filter(espacio=>espacio.espacio!==boton.dataset.espacio);
                guardarEspacios();
                renderEspacios();
            });
        });
    }
    function actualizarEstadisticasEspacios(){
        const total = espacios.length;
        const disponibles = espacios.filter(espacio=>espacio.estado==="Disponible").length;
        const ocupados = espacios.filter(espacio=>espacio.estado==="Ocupado").length;
        const reservados = espacios.filter(espacio=>espacio.estado==="Reservado").length;
        document.getElementById("estadisticaTotalEspacios").textContent = total;
        document.getElementById("estadisticaDisponibles").textContent = disponibles;
        document.getElementById("estadisticaOcupados").textContent = ocupados;
        document.getElementById("estadisticaReservados").textContent = reservados;
    }
    renderEspacios();
    if(filtro){
        filtro.addEventListener("change",renderEspacios);
    }
    if(form){
        form.addEventListener("submit",(e)=>{
            e.preventDefault();
            const zona = document.getElementById("zonaParqueo").value.trim();
            const espacio = document.getElementById("numeroParqueo").value.trim();
            const tarifa = document.getElementById("tarifaParqueo").value.trim();
            if(!zona || !espacio || !tarifa){
                alert("Debe completar todos los campos.");
                return;
            }
            espacios.push({
                zona,
                espacio,
                estado:"Disponible",
                placa:"-",
                tarifa:Number(tarifa)
            });
            guardarEspacios();
            renderEspacios();
            form.reset();
            alert("Espacio registrado correctamente.");
        });
    }
}
function inicializarAyuda(){
    const formAyuda = document.getElementById("formAyuda");
    if(!formAyuda) return;
    formAyuda.addEventListener("submit",(e)=>{
        e.preventDefault();
        const nombre = document.getElementById("nombreAyuda").value.trim();
        const correo = document.getElementById("correoAyuda").value.trim();
        const consulta = document.getElementById("consultaAyuda").value.trim();
        if(!nombre || !correo || !consulta){
            alert("Debe completar todos los campos.");
            return;
        }
        document.getElementById("mensajeAyuda").classList.remove("d-none");
        formAyuda.reset();
    });
}
function inicializarDetalleParqueo(){
    const formResena = document.getElementById("formResena");
    const formIncidente = document.getElementById("formIncidente");
    const listaResenas = document.getElementById("listaResenas");
    const listaIncidentes = document.getElementById("listaIncidentes");
    if(!formResena && !formIncidente) return;
    function renderResenas(){
        if(!listaResenas) return;
        const resenas = leerDatos(DB_KEYS.resenas,[
            {id:"rev-1", calificacion:5, comentario:"Muy seguro y bien ubicado.", fecha:"2026-07-07"},
            {id:"rev-2", calificacion:4, comentario:"Buen precio y entrada rápida.", fecha:"2026-07-08"}
        ]);
        listaResenas.innerHTML = "";
        resenas.forEach(resena=>{
            listaResenas.innerHTML += `                 <div class="card mb-3">                     <div class="card-body">                         <div>${generarEstrellas(Number(resena.calificacion))}</div>                         <p class="mb-1">${resena.comentario}</p>                         <small class="text-muted">${resena.fecha}</small>                     </div>                 </div>             `;
        });
    }
    function renderIncidentes(){
        if(!listaIncidentes) return;
        const incidentes = leerDatos(DB_KEYS.incidentes,[
            {id:"inc-1", tipo:"Iluminación", descripcion:"Zona B con poca iluminación.", fecha:"2026-07-07", estado:"Publicado"}
        ]);
        listaIncidentes.innerHTML = "";
        incidentes.forEach(incidente=>{
            listaIncidentes.innerHTML += `                 <div class="card mb-3">                     <div class="card-body">                         <h5>${incidente.tipo}</h5>                         <p class="mb-1">${incidente.descripcion}</p>                         <small class="text-muted">${incidente.fecha} | ${incidente.estado}</small>                     </div>                 </div>             `;
        });
    }
    renderResenas();
    renderIncidentes();
    if(formResena){
        formResena.addEventListener("submit",(e)=>{
            e.preventDefault();
            const calificacion = document.getElementById("calificacionResena").value;
            const comentario = document.getElementById("comentarioResena").value.trim();
            if(!calificacion || !comentario){
                alert("Debe completar la calificación y el comentario.");
                return;
            }
            const resenas = leerDatos(DB_KEYS.resenas,[]);
            resenas.push({
                id:generarId("rev"),
                calificacion:Number(calificacion),
                comentario,
                fecha:new Date().toISOString().slice(0,10)
            });
            guardarDatos(DB_KEYS.resenas,resenas);
            formResena.reset();
            renderResenas();
        });
    }
    if(formIncidente){
        formIncidente.addEventListener("submit",(e)=>{
            e.preventDefault();
            const tipo = document.getElementById("tipoIncidente").value;
            const descripcion = document.getElementById("descripcionIncidente").value.trim();
            if(!tipo || !descripcion){
                alert("Debe completar el tipo y la descripción del incidente.");
                return;
            }
            const incidentes = leerDatos(DB_KEYS.incidentes,[]);
            incidentes.push({
                id:generarId("inc"),
                tipo,
                descripcion,
                fecha:new Date().toISOString().slice(0,10),
                estado:"Publicado"
            });
            guardarDatos(DB_KEYS.incidentes,incidentes);
            formIncidente.reset();
            renderIncidentes();
        });
    }
}
function animarContadores(){
    const contadores = document.querySelectorAll(".contador");
    if(contadores.length===0) return;
    contadores.forEach(contador=>{
        const objetivo = Number(contador.dataset.valor);
        if(!Number.isFinite(objetivo)) return;
        let actual = 0;
        const incremento = Math.ceil(objetivo/100);
        const intervalo = setInterval(()=>{
            actual += incremento;
            if(actual>=objetivo){
                contador.textContent = objetivo;
                clearInterval(intervalo);
            }else{
                contador.textContent = actual;
            }
        },20);
    });
}
function efectoNavbar(){
    const navbar = document.querySelector(".navbar");
    if(!navbar) return;
    window.addEventListener("scroll",()=>{
        if(window.scrollY>40){
            navbar.classList.add("shadow");
        }else{
            navbar.classList.remove("shadow");
        }
    });
}
function renderBusqueda(lista){
    const contenedor = document.getElementById("contenedor-busqueda");
    if(!contenedor) return;
    const cantidad = document.getElementById("cantidadResultados");
    contenedor.innerHTML = "";
    if(lista.length===0){
        contenedor.innerHTML = `             <div class="col-12 text-center py-5">                 <i class="bi bi-search display-3 text-muted"></i>                 <h4 class="mt-3">                     No se encontraron parqueos                 </h4>                 <p class="text-muted">                     Intenta realizar una búsqueda diferente.                 </p>             </div>         `;
        if(cantidad){
            cantidad.textContent="Se encontraron 0 parqueos.";
        }
        return;
    }
    lista.forEach(parqueo=>{
        contenedor.innerHTML += crearTarjetaParqueo(parqueo);
    });
    if(cantidad){
        cantidad.textContent=`Se encontraron ${lista.length} parqueo(s).`;
    }
    activarFavoritos();
    activarBotonesReserva();
}
function activarBuscador(){
    const boton=document.getElementById("btnBuscar");
    if(!boton) return;
    renderBusqueda(obtenerParqueos());
    boton.addEventListener("click",()=>{
        const provincia=document
            .getElementById("filtroProvincia")
            .value
            .trim()
            .toLowerCase();
        const zona=document
            .getElementById("filtroZona")
            .value
            .trim()
            .toLowerCase();
        const nombre=document
            .getElementById("filtroNombre")
            .value
            .trim()
            .toLowerCase();
        const resultados=obtenerParqueos().filter(parqueo=>{
            const coincideProvincia=
                provincia==="" ||
                parqueo.provincia.toLowerCase()===provincia;
            const coincideZona=
                parqueo.zona.toLowerCase().includes(zona);
            const coincideNombre=
                parqueo.nombre.toLowerCase().includes(nombre);
            return coincideProvincia &&
                   coincideZona &&
                   coincideNombre;
        });
        renderBusqueda(resultados);
    });
}
function activarBusquedaRapida(){
    const boton=document.getElementById("btnHeroBuscar");
    if(!boton) return;
    boton.addEventListener("click",()=>{
        const ubicacion=document.getElementById("ubicacion");
        const fecha=document.getElementById("fecha");
        const vehiculo=document.getElementById("vehiculo");
        if(
            !ubicacion.value.trim() ||
            !fecha.value ||
            !vehiculo.value
        ){
            alert("Complete todos los campos antes de continuar.");
            return;
        }
        window.location.href="pages/buscar.html";
    });
}
function inicializarLogin(){
    const loginForm = document.getElementById("loginForm");
    if(!loginForm) return;
    loginForm.addEventListener("submit",(e)=>{
        e.preventDefault();
        const correo = document.getElementById("correo").value.trim();
        const password = document.getElementById("password").value.trim();
        if(!correo || !password){
            alert("Debe completar todos los campos.");
            return;
        }
        const usuario = obtenerUsuarios().find(usuario=>{
            return usuario.correo.toLowerCase()===correo.toLowerCase();
        });
        if(!usuario){
            alert("El usuario no existe. Debe registrarse primero.");
            return;
        }
        if(usuario.estado!=="Activo"){
            alert("El usuario se encuentra inactivo. Contacte al administrador.");
            return;
        }
        localStorage.setItem("usuario-activo-parkeate",JSON.stringify(usuario));
        alert("Inicio de sesión exitoso.");
        window.location.href = "perfil.html";
    });
}
function inicializarRegistro(){
    const registroForm = document.getElementById("registroForm");
    if(!registroForm) return;
    registroForm.addEventListener("submit",(e)=>{
        e.preventDefault();
        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correoRegistro").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const password = document.getElementById("passwordRegistro").value;
        const confirmar = document.getElementById("confirmarPassword").value;
        if(!nombre || !correo || !telefono || !password || !confirmar){
            alert("Todos los campos son obligatorios.");
            return;
        }
        if(password.length < 8){
            alert("La contraseña debe tener al menos 8 caracteres.");
            return;
        }
        if(password !== confirmar){
            alert("Las contraseñas no coinciden.");
            return;
        }
        const usuarios = obtenerUsuarios();
        const existe = usuarios.some(usuario=>{
            return usuario.correo.toLowerCase()===correo.toLowerCase();
        });
        if(existe){
            alert("Ya existe un usuario registrado con ese correo.");
            return;
        }
        usuarios.push({
            id:generarId("usr"),
            nombre,
            correo,
            telefono,
            rol:"Usuario",
            estado:"Activo"
        });
        guardarUsuarios(usuarios);
        alert("Usuario registrado correctamente.");
        window.location.href = "login.html";
    });
}
function inicializarRecuperacion(){
    const recuperarForm = document.getElementById("recuperarForm");
    if(!recuperarForm) return;
    recuperarForm.addEventListener("submit",(e)=>{
        e.preventDefault();
        const correo = document.getElementById("correoRecuperacion").value.trim();
        if(!correo){
            alert("Ingrese un correo electrónico.");
            return;
        }
        document
            .getElementById("mensajeRecuperacion")
            .classList.remove("d-none");
        recuperarForm.reset();
    });
}
function inicializarPerfil(){
    const perfilForm = document.getElementById("perfilForm");
    if(!perfilForm) return;
    perfilForm.addEventListener("submit",(e)=>{
        e.preventDefault();
        const nueva = document.getElementById("nuevaPassword").value;
        const confirmar = document.getElementById("confirmarNuevaPassword").value;
        if(nueva || confirmar){
            if(nueva.length < 8){
                alert("La nueva contraseña debe tener al menos 8 caracteres.");
                return;
            }
            if(nueva !== confirmar){
                alert("Las nuevas contraseñas no coinciden.");
                return;
            }
        }
        document
            .getElementById("mensajePerfil")
            .classList.remove("d-none");
        setTimeout(()=>{
            document
                .getElementById("mensajePerfil")
                .classList.add("d-none");
        },3000);
    });
}
function formatoTelefono(){
    const telefono = document.getElementById("telefono");
    if(!telefono) return;
    telefono.addEventListener("input",()=>{
        let valor = telefono.value.replace(/\D/g,"");
        if(valor.length > 4){
            valor = valor.substring(0,4) + "-" + valor.substring(4,8);
        }
        telefono.value = valor;
    });
}
document.addEventListener("DOMContentLoaded",()=>{
    renderParqueos();
    activarFavoritos();
    activarBotonesReserva();
    animarContadores();
    efectoNavbar();
    activarBuscador();
    activarBusquedaRapida();
    inicializarLogin();
    inicializarRegistro();
    inicializarRecuperacion();
    inicializarPerfil();
    formatoTelefono();
    inicializarFavoritos();
    inicializarReservas();
    inicializarHistorial();
    inicializarAlertas();
    inicializarAdmin();
    inicializarAdminParqueo();
    inicializarAyuda();
    inicializarDetalleParqueo();
});
