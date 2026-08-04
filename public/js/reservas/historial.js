async function inicializarHistorial(){
    const tabla = document.getElementById("tablaHistorial");
    if(!tabla) return;
    try{
        if(typeof window.backendRequest === "function"){
            const respuesta = await window.backendRequest("reservas.history");
            if(Array.isArray(respuesta?.data)){
                guardarReservas(respuesta.data);
            }
        }
    }catch(error){
        // Fallback local.
    }
    const reservas = obtenerReservas();
    tabla.innerHTML = "";
    reservas.forEach(reserva=>{
        tabla.innerHTML += `             <tr>                 <td>${reserva.fecha}</td>                 <td>${reserva.parqueo || "Parqueo no asignado"}</td>                 <td>${reserva.espacio}</td>                 <td>${reserva.placa}</td>                 <td><span class="badge bg-success">${reserva.estado}</span></td>                 <td class="precio">₡${reserva.monto}</td>                 <td>                     <button class="btn btn-parkeate btn-cancelar-reserva" data-id="${reserva.id}">                         Cancelar                     </button>                 </td>             </tr>         `;
    });
    activarCancelacionReservas();
}
