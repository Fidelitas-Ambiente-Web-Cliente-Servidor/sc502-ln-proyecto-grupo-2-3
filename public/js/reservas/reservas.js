let reservasActuales = [];
let parqueoSeleccionadoReserva = null;

function obtenerReservas(){ return reservasActuales; }
function guardarReservas(reservas){ reservasActuales = Array.isArray(reservas) ? reservas : []; }

async function cargarReservasBackend(){
    const respuesta = await window.backendRequest('reservas.list');
    guardarReservas(respuesta?.data || []);
    return reservasActuales;
}

async function cargarParqueosPorNombre(){
    const parqueos = await window.cargarParqueosDesdeApi();
    return new Map(parqueos.map(parqueo=>[String(parqueo.nombre), parqueo]));
}

function crearTarjetaParqueoSeleccionado(parqueo){
    return `<div class="card tarjeta-parqueo h-100">
        <img src="${parqueo.imagen}" class="card-img-top" alt="${parqueo.nombre}">
        <div class="card-body p-4"><span class="badge ${parqueo.disponible ? 'bg-success' : 'bg-danger'} mb-3">${parqueo.disponible ? 'Disponible' : 'Completo'}</span>
            <h3>${parqueo.nombre}</h3><p class="text-muted"><i class="bi bi-geo-alt-fill"></i> ${parqueo.ubicacion}</p>
            <p>${generarEstrellas(parqueo.calificacion)} <span class="ms-2">${parqueo.calificacion}</span></p>
            <p><i class="bi bi-car-front-fill"></i> ${parqueo.espacios} espacios disponibles</p>
            <h4 class="precio">₡${Number(parqueo.precio).toLocaleString('es-CR')}/hora</h4>
        </div>
    </div>`;
}

function crearTarjetaReservaRealizada(reserva, parqueo){
    const imagen = parqueo?.imagen || 'https://images.unsplash.com/photo-1506521781263-d8422e82f27a?w=800';
    const ubicacion = parqueo?.ubicacion || 'Ubicación registrada';
    const estadoClase = reserva.estado === 'Cancelada' ? 'bg-danger' : 'bg-success';
    return `<article class="col-lg-6 col-xl-4"><div class="card tarjeta-reserva-realizada h-100">
        <img src="${imagen}" alt="${reserva.parqueo}">
        <div class="card-body p-4"><div class="d-flex justify-content-between gap-2"><h4>${reserva.parqueo}</h4><span class="badge ${estadoClase}">${reserva.estado}</span></div>
            <p class="text-muted"><i class="bi bi-geo-alt-fill"></i> ${ubicacion}</p><p class="mb-2"><i class="bi bi-person"></i> ${reserva.usuario}</p>
            <div class="reserva-detalle"><span><i class="bi bi-calendar3"></i> ${reserva.fecha}</span><span><i class="bi bi-clock"></i> ${reserva.hora} - ${reserva.horaSalida}</span>
            <span><i class="bi bi-p-circle"></i> Espacio ${reserva.espacio}</span><span><i class="bi bi-car-front"></i> ${reserva.placa}</span></div>
            <div class="d-flex justify-content-between align-items-center mt-4"><strong class="precio">₡${Number(reserva.monto).toLocaleString('es-CR')}</strong>
            <button class="btn btn-outline-danger btn-cancelar-reserva" data-id="${reserva.id}" ${reserva.estado==='Cancelada' ? 'disabled' : ''}>Cancelar</button></div>
        </div>
    </div></article>`;
}

async function cancelarReserva(id){
    try{
        await window.backendRequest('reservas.cancel',{method:'POST',body:JSON.stringify({id})});
        await inicializarReservas();
        if(typeof inicializarHistorial === 'function') inicializarHistorial();
    }catch(error){ alert(error.message || 'No fue posible cancelar la reserva.'); }
}

function activarCancelacionReservas(){ document.querySelectorAll('.btn-cancelar-reserva').forEach(boton=>boton.addEventListener('click',()=>cancelarReserva(boton.dataset.id))); }
function eliminarReserva(id){ cancelarReserva(id); }

async function inicializarReservas(){
    const contenedor = document.getElementById('contenedorReservasRealizadas');
    if(!contenedor) return;
    const usuarioActivo = obtenerUsuarioActivo();
    if(!usuarioActivo){ window.location.href='login.html'; return; }
    try{
        const [reservas, parqueos] = await Promise.all([cargarReservasBackend(), cargarParqueosPorNombre()]);
        contenedor.innerHTML = reservas.length
            ? reservas.map(reserva=>crearTarjetaReservaRealizada(reserva, parqueos.get(reserva.parqueo))).join('')
            : '<div class="col-12 text-center py-5"><i class="bi bi-calendar-x display-4 text-muted"></i><h3 class="mt-3">Aún no tienes reservas</h3><a class="btn btn-parkeate mt-2" href="buscar.html">Buscar parqueos</a></div>';
        activarCancelacionReservas();
    }catch(error){ contenedor.innerHTML = '<div class="col-12"><div class="alert alert-danger">No fue posible cargar sus reservas.</div></div>'; }
}

async function cargarParqueoSeleccionado(){
    const contenedor = document.getElementById('tarjetaParqueoReserva');
    const id = Number(new URLSearchParams(window.location.search).get('parqueo'));
    if(!id){ contenedor.innerHTML = '<div class="alert alert-warning">Seleccione un parqueo desde Buscar para continuar.</div>'; return null; }
    const parqueos = await window.cargarParqueosDesdeApi();
    const parqueo = parqueos.find(item=>Number(item.id)===id);
    if(!parqueo){ contenedor.innerHTML = '<div class="alert alert-danger">El parqueo seleccionado ya no está disponible.</div>'; return null; }
    parqueoSeleccionadoReserva = parqueo;
    contenedor.innerHTML = crearTarjetaParqueoSeleccionado(parqueo);
    return parqueo;
}

async function cargarEspaciosDisponibles(){
    const select = document.getElementById('espacioReserva');
    const fecha = document.getElementById('fechaReserva')?.value;
    const ayuda = document.getElementById('ayudaEspacios');
    if(!select || !parqueoSeleccionadoReserva) return;
    select.innerHTML = '<option value="">Seleccione un espacio</option>';
    select.disabled = true;
    if(!fecha){
        select.innerHTML = '<option value="">Seleccione una fecha primero</option>';
        if(ayuda) ayuda.textContent = 'Seleccione la fecha para consultar disponibilidad real.';
        return;
    }
    try{
        const espacios = await window.cargarEspaciosDesdeApi(parqueoSeleccionadoReserva.id, fecha);
        select.innerHTML = espacios.length
            ? '<option value="">Seleccione un espacio</option>' + espacios.map(espacio=>`<option value="${espacio.codigo}">${espacio.codigo} · Zona ${espacio.zona}</option>`).join('')
            : '<option value="">No hay espacios disponibles</option>';
        select.disabled = espacios.length === 0;
        if(ayuda) ayuda.textContent = espacios.length ? 'Espacios disponibles según la base de datos.' : 'No hay espacios disponibles para la fecha elegida.';
    }catch(error){
        select.innerHTML = '<option value="">No fue posible cargar espacios</option>';
        if(ayuda) ayuda.textContent = error.message || 'No fue posible consultar disponibilidad.';
    }
}

async function inicializarReservar(){
    const formReserva = document.getElementById('formReserva');
    if(!formReserva) return;
    const usuarioActivo = obtenerUsuarioActivo();
    if(!usuarioActivo){ window.location.href='login.html'; return; }
    const nombre = document.getElementById('nombreReserva');
    if(nombre){ nombre.value=usuarioActivo.nombre || ''; nombre.readOnly=true; }
    try{ if(!await cargarParqueoSeleccionado()) return; }
    catch(error){ alert(error.message || 'No fue posible cargar el parqueo.'); return; }
    document.getElementById('fechaReserva').addEventListener('change', cargarEspaciosDisponibles);
    if(formReserva.dataset.ready) return;
    formReserva.dataset.ready='true';
    formReserva.addEventListener('submit',async event=>{
        event.preventDefault();
        const nuevaReserva={usuario:usuarioActivo.nombre, placa:document.getElementById('placaReserva').value.trim(), parqueo:parqueoSeleccionadoReserva.nombre, espacio:document.getElementById('espacioReserva').value, fecha:document.getElementById('fechaReserva').value, hora:document.getElementById('horaReserva').value, horaSalida:document.getElementById('horaSalidaReserva').value, monto:parqueoSeleccionadoReserva.precio};
        if(Object.values(nuevaReserva).some(valor=>valor==='')){ alert('Debe completar todos los campos.'); return; }
        try{
            await window.backendRequest('reservas.create',{method:'POST',body:JSON.stringify(nuevaReserva)});
            formReserva.reset(); nombre.value=usuarioActivo.nombre || '';
            alert('Reserva registrada correctamente.');
            window.location.href='reservas.html';
        }catch(error){ alert(error.message || 'No fue posible registrar la reserva.'); }
    });
}
