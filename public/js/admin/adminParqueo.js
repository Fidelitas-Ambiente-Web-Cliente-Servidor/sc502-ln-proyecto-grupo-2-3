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

