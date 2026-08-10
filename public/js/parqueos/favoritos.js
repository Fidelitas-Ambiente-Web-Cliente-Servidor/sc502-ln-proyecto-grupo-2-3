async function obtenerParqueosBaseDatos(){
    try{
        return await window.cargarParqueosDesdeApi();
    }catch(error){
        return [];
    }
}

function esFavorito(parqueoId){
    return Array.isArray(window.favoritosActuales) && window.favoritosActuales.includes(Number(parqueoId));
}

async function cargarFavoritosBaseDatos(){
    if(!obtenerUsuarioActivo()){
        window.favoritosActuales = [];
        return [];
    }
    const respuesta = await window.backendRequest('favorite.list');
    window.favoritosActuales = Array.isArray(respuesta?.data) ? respuesta.data.map(Number) : [];
    return window.favoritosActuales;
}

async function renderParqueos(){
    const contenedor = document.getElementById('contenedor-parqueos');
    if(!contenedor) return;
    await cargarFavoritosBaseDatos().catch(()=>{});
    const parqueos = await obtenerParqueosBaseDatos();
    contenedor.innerHTML = parqueos.map(crearTarjetaParqueo).join('');
    activarFavoritos();
    activarBotonesReserva();
}

function activarFavoritos(){
    document.querySelectorAll('.favorito').forEach(favorito=>{
        const id = Number(favorito.dataset.id);
        favorito.classList.toggle('bi-heart-fill', esFavorito(id));
        favorito.classList.toggle('bi-heart', !esFavorito(id));
        favorito.classList.toggle('text-danger', esFavorito(id));
        favorito.classList.toggle('text-secondary', !esFavorito(id));
        favorito.addEventListener('click', async ()=>{
            if(!obtenerUsuarioActivo()){
                alert('Debe iniciar sesión para guardar favoritos.');
                return;
            }
            const activo = !esFavorito(id);
            try{
                await window.backendRequest('favorite.set', {method:'POST', body:JSON.stringify({parkingId:id, active:activo})});
                window.favoritosActuales = activo
                    ? [...(window.favoritosActuales || []), id]
                    : (window.favoritosActuales || []).filter(favoritoId=>favoritoId!==id);
                favorito.classList.toggle('bi-heart-fill', activo);
                favorito.classList.toggle('bi-heart', !activo);
                favorito.classList.toggle('text-danger', activo);
                favorito.classList.toggle('text-secondary', !activo);
                if(document.getElementById('contenedor-favoritos')) inicializarFavoritos();
            }catch(error){
                alert(error.message || 'No fue posible actualizar el favorito.');
            }
        });
    });
}

async function inicializarFavoritos(){
    const contenedor = document.getElementById('contenedor-favoritos');
    if(!contenedor) return;
    if(!obtenerUsuarioActivo()){
        contenedor.innerHTML = '<div class="col-12 text-center py-5"><h4>Inicie sesión para ver sus favoritos.</h4></div>';
        return;
    }
    try{
        await cargarFavoritosBaseDatos();
        const parqueos = await obtenerParqueosBaseDatos();
        const favoritos = parqueos.filter(parqueo=>esFavorito(parqueo.id));
        contenedor.innerHTML = favoritos.length
            ? favoritos.map(crearTarjetaParqueo).join('')
            : '<div class="col-12 text-center py-5"><i class="bi bi-heart display-4 text-muted"></i><h4 class="mt-3">No tienes parqueos favoritos todavía.</h4><a href="buscar.html" class="btn btn-parkeate">Buscar parqueos</a></div>';
        activarFavoritos();
        activarBotonesReserva();
    }catch(error){
        contenedor.innerHTML = '<div class="col-12 text-center py-5"><p>No fue posible cargar los favoritos.</p></div>';
    }
}
