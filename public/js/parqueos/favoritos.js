function renderParqueos(){
    const contenedor = document.getElementById("contenedor-parqueos");
    if(!contenedor) return;
    contenedor.innerHTML = "";
    obtenerParqueos().forEach(parqueo=>{
        contenedor.innerHTML += crearTarjetaParqueo(parqueo);
    });
    activarFavoritos();
    activarBotonesReserva();
}
function activarFavoritos(){
    const favoritos = document.querySelectorAll(".favorito");
    favoritos.forEach(favorito=>{
        const id = favorito.dataset.id;
        if(localStorage.getItem("favorito-"+id)==="true"){
            favorito.classList.remove("bi-heart","text-secondary");
            favorito.classList.add("bi-heart-fill","text-danger");
        }
        favorito.addEventListener("click",()=>{
            favorito.classList.toggle("bi-heart");
            favorito.classList.toggle("bi-heart-fill");
            favorito.classList.toggle("text-secondary");
            favorito.classList.toggle("text-danger");
            const activo = favorito.classList.contains("bi-heart-fill");
            localStorage.setItem("favorito-"+id,activo);
            if(typeof window.syncFavorite === "function"){
                window.syncFavorite(id, activo);
            }
            if(document.getElementById("contenedor-favoritos")){
                inicializarFavoritos();
            }
        });
    });
}
function inicializarFavoritos(){
    const contenedor = document.getElementById("contenedor-favoritos");
    if(!contenedor) return;
    const favoritosGuardados = obtenerParqueos().filter(parqueo=>{
        return localStorage.getItem("favorito-"+parqueo.id)==="true";
    });
    contenedor.innerHTML = "";
    if(favoritosGuardados.length===0){
        contenedor.innerHTML = `             <div class="col-12">                 <div class="card-beneficio">                     <i class="bi bi-heart"></i>                     <h4>                         No tienes parqueos favoritos todavía.                     </h4>                     <p>                         Marca parqueos como favoritos desde Inicio o Buscar para verlos aquí.                     </p>                     <a href="buscar.html" class="btn btn-parkeate">                         Buscar Parqueos                     </a>                 </div>             </div>         `;
        return;
    }
    favoritosGuardados.forEach(parqueo=>{
        contenedor.innerHTML += crearTarjetaParqueo(parqueo);
    });
    activarFavoritos();
    activarBotonesReserva();
}
