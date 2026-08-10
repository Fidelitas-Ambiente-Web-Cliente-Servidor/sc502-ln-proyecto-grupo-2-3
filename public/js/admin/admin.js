function normalizarEstado(estado){
    return String(estado || '').trim() === 'Activo' ? 'Activo' : 'Inactivo';
}

async function cargarAdminBackend(){
    const [dashboard, users, reservas, parqueos, solicitudes] = await Promise.all([
        window.backendRequest('admin.dashboard'),
        window.backendRequest('admin.users'),
        window.backendRequest('admin.reservas'),
        window.backendRequest('admin.parkings'),
        window.backendRequest('admin.requests')
    ]);
    return {
        dashboard: dashboard.data || {},
        users: Array.isArray(users.data) ? users.data : [],
        reservas: Array.isArray(reservas.data) ? reservas.data : [],
        parqueos: Array.isArray(parqueos.data) ? parqueos.data : [],
        solicitudes: Array.isArray(solicitudes.data) ? solicitudes.data : []
    };
}

function actualizarCardsAdmin(dashboard){
    const valores = {
        totalUsuarios: dashboard.usuarios || 0,
        totalEspacios: dashboard.espacios || 0,
        totalDisponibles: dashboard.disponibles || 0,
        totalReservasAdmin: dashboard.reservas || 0
    };
    Object.entries(valores).forEach(([id, valor])=>{
        const elemento = document.getElementById(id);
        if(elemento) elemento.textContent = String(valor);
    });
}

function renderUsuariosAdmin(usuarios){
    const tabla = document.getElementById('tablaUsuariosAdmin');
    if(!tabla) return;
    tabla.innerHTML = usuarios.map(usuario=>`
        <tr>
            <td><strong>${usuario.nombre}</strong></td><td>${usuario.correo}</td><td>${usuario.telefono || '-'}</td>
            <td>${usuario.rol}</td><td><span class="badge ${usuario.estado==='Activo' ? 'bg-success' : 'bg-danger'}">${usuario.estado}</span></td>
            <td class="text-nowrap">
                <button class="btn btn-sm btn-outline-parkeate btn-editar-usuario" data-id="${usuario.id}">Editar</button>
                <button class="btn btn-sm btn-outline-danger btn-eliminar-usuario" data-id="${usuario.id}" data-nombre="${usuario.nombre}">Eliminar</button>
            </td>
        </tr>`).join('') || '<tr><td colspan="6" class="text-center">No hay usuarios.</td></tr>';
}

function renderParqueosAdmin(parqueos){
    const tabla = document.getElementById('tablaParqueosAdmin');
    if(!tabla) return;
    tabla.innerHTML = parqueos.map(parqueo=>`
        <tr>
            <td><img class="admin-parking-image" src="${parqueo.imagen}" alt="${parqueo.nombre}"></td>
            <td><strong>${parqueo.nombre}</strong><br><small>${parqueo.ubicacion}</small></td>
            <td>${parqueo.provincia}<br><small>${parqueo.zona}</small></td>
            <td class="precio">₡${Number(parqueo.precio).toLocaleString('es-CR')}</td>
            <td>${parqueo.espacios}</td>
            <td><span class="badge ${parqueo.disponible ? 'bg-success' : 'bg-danger'}">${parqueo.disponible ? 'Disponible' : 'Completo'}</span></td>
            <td class="text-nowrap">
                <button class="btn btn-sm btn-outline-parkeate btn-editar-parqueo" data-id="${parqueo.id}">Editar</button>
                <button class="btn btn-sm btn-outline-danger btn-eliminar-parqueo" data-id="${parqueo.id}" data-nombre="${parqueo.nombre}">Eliminar</button>
            </td>
        </tr>`).join('') || '<tr><td colspan="7" class="text-center">No hay parqueos registrados.</td></tr>';
}

function renderReservasAdmin(reservas){
    const tabla = document.getElementById('tablaReservasAdmin');
    if(!tabla) return;
    tabla.innerHTML = reservas.map(reserva=>`
        <tr><td>${reserva.usuario}</td><td>${reserva.parqueo}</td><td>${reserva.espacio}</td><td>${reserva.fecha}</td>
        <td><span class="badge ${reserva.estado==='Cancelada' ? 'bg-danger' : 'bg-success'}">${reserva.estado}</span></td>
        <td><button class="btn btn-sm btn-outline-danger btn-cancelar-admin" data-id="${reserva.id}">Cancelar</button></td></tr>`).join('') || '<tr><td colspan="6" class="text-center">No hay reservas.</td></tr>';
}

function llenarFormularioUsuario(usuario){
    document.getElementById('usuarioId').value = usuario?.id || '';
    document.getElementById('usuarioNombre').value = usuario?.nombre || '';
    document.getElementById('usuarioCorreo').value = usuario?.correo || '';
    document.getElementById('usuarioTelefono').value = usuario?.telefono || '';
    document.getElementById('usuarioRol').value = usuario?.rol || 'Usuario';
    document.getElementById('usuarioEstado').value = usuario?.estado || 'Activo';
    document.getElementById('usuarioPassword').value = '';
    document.getElementById('tituloFormularioUsuario').textContent = usuario ? 'Editar usuario' : 'Agregar usuario';
}

function llenarFormularioParqueo(parqueo){
    document.getElementById('parqueoIdAdmin').value = parqueo?.id || '';
    document.getElementById('parqueoNombreAdmin').value = parqueo?.nombre || '';
    document.getElementById('parqueoProvinciaAdmin').value = parqueo?.provincia || 'San José';
    document.getElementById('parqueoZonaAdmin').value = parqueo?.zona || '';
    document.getElementById('parqueoUbicacionAdmin').value = parqueo?.ubicacion || '';
    document.getElementById('parqueoPrecioAdmin').value = parqueo?.precio || '';
    document.getElementById('parqueoEspaciosAdmin').value = parqueo?.espacios || '';
    document.getElementById('parqueoImagenAdmin').value = parqueo?.imagen || '';
    document.getElementById('tituloFormularioParqueo').textContent = parqueo ? 'Editar parqueo' : 'Agregar parqueo';
}

function escucharAccionesAdmin(data){
    document.querySelectorAll('.btn-editar-usuario').forEach(btn=>btn.addEventListener('click',()=>{
        llenarFormularioUsuario(data.users.find(usuario=>String(usuario.id)===btn.dataset.id));
        document.getElementById('gestionUsuarios').scrollIntoView({behavior:'smooth'});
    }));
    document.querySelectorAll('.btn-eliminar-usuario').forEach(btn=>btn.addEventListener('click',async ()=>{
        if(!confirm(`¿Eliminar a ${btn.dataset.nombre}? Esta acción no se puede deshacer.`)) return;
        await window.backendRequest('admin.user-delete',{method:'POST',body:JSON.stringify({id:btn.dataset.id})});
        await inicializarAdmin();
    }));
    document.querySelectorAll('.btn-editar-parqueo').forEach(btn=>btn.addEventListener('click',()=>{
        llenarFormularioParqueo(data.parqueos.find(parqueo=>String(parqueo.id)===btn.dataset.id));
        document.getElementById('gestionParqueos').scrollIntoView({behavior:'smooth'});
    }));
    document.querySelectorAll('.btn-eliminar-parqueo').forEach(btn=>btn.addEventListener('click',async ()=>{
        if(!confirm(`¿Eliminar ${btn.dataset.nombre}?`)) return;
        await window.backendRequest('admin.parking-delete',{method:'POST',body:JSON.stringify({id:btn.dataset.id})});
        await inicializarAdmin();
    }));
    document.querySelectorAll('.btn-cancelar-admin').forEach(btn=>btn.addEventListener('click',async ()=>{
        await window.backendRequest('admin.reserva-cancel',{method:'POST',body:JSON.stringify({id:btn.dataset.id})});
        await inicializarAdmin();
    }));
}

function activarFormulariosAdmin(){
    const formUsuario = document.getElementById('formUsuarioAdmin');
    const formParqueo = document.getElementById('formParqueoAdmin');
    if(formUsuario && !formUsuario.dataset.ready){
        formUsuario.dataset.ready = 'true';
        formUsuario.addEventListener('submit',async event=>{
            event.preventDefault();
            const payload = Object.fromEntries(new FormData(formUsuario).entries());
            await window.backendRequest('admin.user-save',{method:'POST',body:JSON.stringify(payload)});
            llenarFormularioUsuario(null);
            await inicializarAdmin();
        });
        document.getElementById('limpiarUsuarioAdmin').addEventListener('click',()=>llenarFormularioUsuario(null));
    }
    if(formParqueo && !formParqueo.dataset.ready){
        formParqueo.dataset.ready = 'true';
        formParqueo.addEventListener('submit',async event=>{
            event.preventDefault();
            const payload = Object.fromEntries(new FormData(formParqueo).entries());
            await window.backendRequest('admin.parking-save',{method:'POST',body:JSON.stringify(payload)});
            llenarFormularioParqueo(null);
            await inicializarAdmin();
        });
        document.getElementById('limpiarParqueoAdmin').addEventListener('click',()=>llenarFormularioParqueo(null));
    }
}

async function inicializarAdmin(){
    const tablaUsuarios = document.getElementById('tablaUsuariosAdmin');
    if(!tablaUsuarios) return;
    const usuario = obtenerUsuarioActivo();
    if(!usuario || String(usuario.rol || '') !== 'Administrador'){
        window.location.href = usuario ? '../index.html' : 'login.html';
        return;
    }
    try{
        const data = await cargarAdminBackend();
        actualizarCardsAdmin(data.dashboard);
        renderUsuariosAdmin(data.users);
        renderParqueosAdmin(data.parqueos);
        renderReservasAdmin(data.reservas);
        escucharAccionesAdmin(data);
        activarFormulariosAdmin();
    }catch(error){
        alert(error.message || 'No fue posible cargar la administración.');
    }
}
