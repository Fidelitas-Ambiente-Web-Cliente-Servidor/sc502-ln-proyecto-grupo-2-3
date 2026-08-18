function generarId(prefijo){ return `${prefijo}-${Date.now()}-${Math.floor(Math.random()*1000)}`; }
function obtenerUsuarios(){ return leerDatos(DB_KEYS.usuarios,[]); }
function guardarUsuarios(usuarios){ guardarDatos(DB_KEYS.usuarios,usuarios); }
function obtenerSolicitudesParqueo(){ return leerDatos(DB_KEYS.solicitudesParqueo,[]); }
function obtenerParqueos(){ const datos = leerDatos(DB_KEYS.parqueos,null); return Array.isArray(datos) && datos.length ? datos : []; }
function guardarParqueosAprobados(parqueosAprobados){ guardarDatos(DB_KEYS.parqueosAprobados,parqueosAprobados); }
function guardarSolicitudesParqueo(solicitudes){ guardarDatos(DB_KEYS.solicitudesParqueo,solicitudes); }
function generarEstrellas(calificacion){
    let estrellas = '';
    for(let i=1;i<=5;i++) estrellas += `<i class="bi bi-star${i<=Math.round(calificacion) ? '-fill' : ''} text-warning"></i>`;
    return estrellas;
}
function generarBadge(disponible){ return disponible ? '<span class="badge bg-success">Disponible</span>' : '<span class="badge bg-danger">Completo</span>'; }
function crearTarjetaCard(parqueo){
    const enPages = window.location.pathname.includes('/pages/');
    const rutaDetalle = enPages ? `detalle.html?parqueo=${parqueo.id}` : `pages/detalle.html?parqueo=${parqueo.id}`;
    return `<div class="card tarjeta-parqueo h-100">
        <img src="${parqueo.imagen}" class="card-img-top" alt="${parqueo.nombre}">
        <div class="card-body"><div class="d-flex justify-content-between align-items-center mb-2">${generarBadge(parqueo.disponible)}<i class="bi bi-heart favorito fs-4 text-secondary" data-id="${parqueo.id}"></i></div>
        <h5 class="fw-bold">${parqueo.nombre}</h5><p class="text-muted"><i class="bi bi-geo-alt-fill"></i> ${parqueo.ubicacion}</p>
        <div class="mb-2">${generarEstrellas(parqueo.calificacion)}<span class="ms-2">${parqueo.calificacion}</span></div>
        <p>🚗 ${parqueo.espacios} espacios disponibles</p><h4 class="precio">₡${parqueo.precio}/hora</h4></div>
        <div class="card-footer bg-white border-0 d-flex gap-2"><a href="${rutaDetalle}" class="btn btn-outline-parkeate flex-grow-1">Detalles</a><button data-parqueo-id="${parqueo.id}" class="btn btn-parkeate btn-reservar flex-grow-1"><i class="bi bi-calendar-check"></i> Reservar</button></div>
    </div>`;
}
function crearTarjetaParqueo(parqueo){
    return `<div class="col-lg-3 col-md-6 mb-4">${crearTarjetaCard(parqueo)}</div>`;
}
function crearTarjetaParqueoCarousel(parqueo){
    return `<div class="carousel-slide">${crearTarjetaCard(parqueo)}</div>`;
}
function activarBotonesReserva(){
    document.querySelectorAll('.btn-reservar').forEach(boton=>boton.addEventListener('click',()=>{
        const ruta = window.location.pathname.includes('/pages/') ? 'reservar.html' : 'pages/reservar.html';
        window.location.href = `${ruta}?parqueo=${encodeURIComponent(boton.dataset.parqueoId)}`;
    }));
}
