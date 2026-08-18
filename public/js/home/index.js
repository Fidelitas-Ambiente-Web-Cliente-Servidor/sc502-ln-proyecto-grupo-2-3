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
    lista = Array.from(new Map(lista.map(parqueo=>[
        String(parqueo.nombre || parqueo.id || '').trim().toLowerCase(),
        parqueo
    ])).values());
    const cantidad = document.getElementById("cantidadResultados");
    if(lista.length===0){
        contenedor.innerHTML = `             <div class="col-12 text-center py-5">                 <i class="bi bi-search display-3 text-muted"></i>                 <h4 class="mt-3">                     No se encontraron parqueos                 </h4>                 <p class="text-muted">                     Intenta realizar una búsqueda diferente.                 </p>             </div>         `;
        if(cantidad){
            cantidad.textContent="Se encontraron 0 parqueos.";
        }
        return;
    }

    contenedor.innerHTML = `<div class="parqueo-carousel" role="region" aria-label="Carrusel de parqueos">
        <button type="button" class="carousel-control prev" aria-label="Anterior"><i class="bi bi-chevron-left"></i></button>
        <div class="carousel-viewport"><div class="carousel-track">${lista.map(crearTarjetaParqueoCarousel).join('')}</div></div>
        <button type="button" class="carousel-control next" aria-label="Siguiente"><i class="bi bi-chevron-right"></i></button>
    </div>`;

    if(cantidad){
        cantidad.textContent=`Se encontraron ${lista.length} parqueo(s).`;
    }
    activarFavoritos();
    activarBotonesReserva();
    inicializarCarrusel(contenedor.querySelector('.parqueo-carousel'));
}
async function activarParqueosInicio(){
    const contenedor = document.getElementById("contenedor-parqueos");
    if(!contenedor) return;

    let parqueos=[];
    try{
        parqueos = await window.cargarParqueosDesdeApi();
    }catch(error){
        parqueos = [];
    }

    parqueos = Array.from(new Map(parqueos.map(parqueo=>[
        String(parqueo.nombre || parqueo.id || '').trim().toLowerCase(),
        parqueo
    ])).values());

    if(parqueos.length === 0){
        contenedor.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="bi bi-info-circle display-3 text-muted"></i>
                <h4 class="mt-3">No se encontraron parqueos</h4>
                <p class="text-muted">Intenta nuevamente más tarde.</p>
            </div>
        `;
        return;
    }

    contenedor.innerHTML = `<div class="parqueo-carousel" role="region" aria-label="Carrusel de parqueos">
        <button type="button" class="carousel-control prev" aria-label="Anterior"><i class="bi bi-chevron-left"></i></button>
        <div class="carousel-viewport"><div class="carousel-track">${parqueos.map(crearTarjetaParqueoCarousel).join('')}</div></div>
        <button type="button" class="carousel-control next" aria-label="Siguiente"><i class="bi bi-chevron-right"></i></button>
    </div>`;
    activarFavoritos();
    activarBotonesReserva();
    inicializarCarrusel(contenedor.querySelector('.parqueo-carousel'));
}

function inicializarCarrusel(carrusel){
    if(!carrusel) return;
    const track = carrusel.querySelector('.carousel-track');
    const prev = carrusel.querySelector('.carousel-control.prev');
    const next = carrusel.querySelector('.carousel-control.next');
    const items = Array.from(track.children);
    if(items.length===0){
        prev.disabled = true;
        next.disabled = true;
        return;
    }

    let index = 0;
    const gap = parseFloat(getComputedStyle(track).gap) || 0;

    const visibleCount = ()=>{
        const width = window.innerWidth;
        if(width >= 1200) return 4;
        if(width >= 992) return 3;
        if(width >= 768) return 2;
        return 1;
    };

    const maxIndex = ()=> Math.max(0, items.length - visibleCount());
    const update = ()=>{
        const slideWidth = items[0].getBoundingClientRect().width;
        index = Math.min(index, maxIndex());
        const offset = index * (slideWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
        prev.disabled = index <= 0;
        next.disabled = index >= maxIndex();
    };

    prev.addEventListener('click', ()=>{ index = Math.max(0, index - 1); update(); });
    next.addEventListener('click', ()=>{ index = Math.min(maxIndex(), index + 1); update(); });
    window.addEventListener('resize', update);
    update();
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
        if(!ubicacion.value.trim()){
            alert("Complete todos los campos antes de continuar.");
            return;
        }
        window.location.href="pages/buscar.html";
    });
}

