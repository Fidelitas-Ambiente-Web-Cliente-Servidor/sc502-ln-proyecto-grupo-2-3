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
async function cargarReservasBackend(){
    if(typeof window.backendRequest !== "function") return;
    try{
        const respuesta = await window.backendRequest("reservas.list");
        if(Array.isArray(respuesta?.data)){
            guardarReservas(respuesta.data);
        }
    }catch(error){
        // Fallback local.
    }
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
async function cancelarReserva(id){
    try{
        if(typeof window.backendRequest === "function"){
            await window.backendRequest("reservas.cancel", {
                method:"POST",
                body: JSON.stringify({id})
            });
            await cargarReservasBackend();
        }
    }catch(error){
        // Fallback local.
    }

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
        boton.addEventListener("click",async ()=>{
            await cancelarReserva(boton.dataset.id);
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
async function inicializarReservas(){
    const formReserva = document.getElementById("formReserva");
    if(!formReserva) return;
    await cargarReservasBackend();
    cargarParqueosReserva();
    renderReservas();
    formReserva.addEventListener("submit",async (e)=>{
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
        const nuevaReserva = {
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
        };

        try{
            if(typeof window.backendRequest === "function"){
                await window.backendRequest("reservas.create", {
                    method:"POST",
                    body: JSON.stringify(nuevaReserva)
                });
                await cargarReservasBackend();
            }else{
                const reservas = obtenerReservas();
                reservas.push(nuevaReserva);
                guardarReservas(reservas);
            }
        }catch(error){
            alert((error && error.message) ? error.message : "No fue posible registrar la reserva.");
            return;
        }

        renderReservas();
        formReserva.reset();
        alert("Reserva registrada correctamente.");
    });
}
