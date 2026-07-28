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
