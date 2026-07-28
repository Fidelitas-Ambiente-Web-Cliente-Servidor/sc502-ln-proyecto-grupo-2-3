/* Punto único de inicialización de los módulos cargados por cada página. */
document.addEventListener("DOMContentLoaded",()=>{
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
