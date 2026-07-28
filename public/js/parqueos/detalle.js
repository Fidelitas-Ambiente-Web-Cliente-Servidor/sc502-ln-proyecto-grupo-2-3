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

