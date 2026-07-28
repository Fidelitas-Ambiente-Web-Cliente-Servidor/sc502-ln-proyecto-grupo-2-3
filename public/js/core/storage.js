function leerDatos(clave, respaldo){
    const datos = localStorage.getItem(clave);
    if(!datos) return respaldo;
    return JSON.parse(datos);
}
function guardarDatos(clave, datos){
    localStorage.setItem(clave,JSON.stringify(datos));
}
