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
            titulo:"Favorito guar…1612 tokens truncated…in();
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

