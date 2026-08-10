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
async function activarBuscador(){
    const boton=document.getElementById("btnBuscar");
    if(!boton) return;
    let parqueos=[];
    try{
        parqueos=await window.cargarParqueosDesdeApi();
    }catch(error){
        parqueos=[];
    }
    renderBusqueda(parqueos);
    boton.addEventListener("click",async ()=>{
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
        try{
            parqueos=await window.cargarParqueosDesdeApi();
        }catch(error){
            parqueos=[];
        }
        const resultados=parqueos.filter(parqueo=>{
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

