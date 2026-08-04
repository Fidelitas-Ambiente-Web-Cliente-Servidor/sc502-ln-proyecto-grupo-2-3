function normalizarEstado(estado){
    const value = String(estado || '').trim();
    return value === 'Activo' ? 'Activo' : 'Inactivo';
}

async function cargarAdminBackend(){
    if(typeof window.backendRequest !== 'function') return null;
    try{
        const [dashboard, users, reservas, solicitudes] = await Promise.all([
            window.backendRequest('admin.dashboard').catch(()=>({data:{usuarios:0,espacios:0,disponibles:0,reservas:0}})),
            window.backendRequest('admin.users').catch(()=>({data:[]})),
            window.backendRequest('admin.reservas').catch(()=>({data:[]})),
            window.backendRequest('admin.requests').catch(()=>({data:[]}))
        ]);

        return {
            dashboard: dashboard?.data || {usuarios:0,espacios:0,disponibles:0,reservas:0},
            users: Array.isArray(users?.data) ? users.data : [],
            reservas: Array.isArray(reservas?.data) ? reservas.data : [],
            solicitudes: Array.isArray(solicitudes?.data) ? solicitudes.data : []
        };
    }catch(error){
        return null;
    }
}

function renderUsuariosAdmin(usuarios){
    const tabla = document.getElementById('tablaUsuariosAdmin');
    if(!tabla) return;

    tabla.innerHTML = usuarios.map((usuario)=>`
        <tr>
            <td>${usuario.nombre}</td>
            <td>${usuario.correo}</td>
            <td>${usuario.rol}</td>
            <td><span class="badge ${usuario.estado==='Activo' ? 'bg-success' : 'bg-danger'}">${usuario.estado}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-parkeate btn-toggle-usuario" data-id="${usuario.id}" data-next="${usuario.estado==='Activo' ? 'Inactivo' : 'Activo'}">
                    ${usuario.estado==='Activo' ? 'Desactivar' : 'Activar'}
                </button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="5" class="text-center">No hay usuarios.</td></tr>';
}

function renderReservasAdmin(reservas){
    const tabla = document.getElementById('tablaReservasAdmin');
    if(!tabla) return;

    tabla.innerHTML = reservas.map((reserva)=>`
        <tr>
            <td>${reserva.usuario}</td>
            <td>${reserva.parqueo}</td>
            <td>${reserva.espacio}</td>
            <td>${reserva.fecha}</td>
            <td><span class="badge ${reserva.estado==='Cancelada' ? 'bg-danger' : 'bg-success'}">${reserva.estado}</span></td>
            <td>
                <button class="btn btn-sm btn-outline-danger btn-cancelar-admin" data-id="${reserva.id}">Cancelar</button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="6" class="text-center">No hay reservas.</td></tr>';
}

function renderSolicitudesAdmin(solicitudes){
    const tabla = document.getElementById('tablaSolicitudesParqueo');
    if(!tabla) return;

    tabla.innerHTML = solicitudes.map((solicitud)=>`
        <tr>
            <td>${solicitud.nombre}</td>
            <td>${solicitud.provincia}</td>
            <td>${solicitud.zona}</td>
            <td><span class="badge bg-warning text-dark">${solicitud.estado || 'Pendiente'}</span></td>
            <td class="d-flex gap-2">
                <button class="btn btn-sm btn-success btn-aprobar-admin" data-id="${solicitud.id}">Aprobar</button>
                <button class="btn btn-sm btn-outline-danger btn-rechazar-admin" data-id="${solicitud.id}">Rechazar</button>
            </td>
        </tr>
    `).join('') || '<tr><td colspan="5" class="text-center">No hay solicitudes pendientes.</td></tr>';
}

function actualizarCardsAdmin(dashboard){
    const totalUsuarios = document.getElementById('totalUsuarios');
    const totalEspacios = document.getElementById('totalEspacios');
    const totalDisponibles = document.getElementById('totalDisponibles');
    const totalReservas = document.getElementById('totalReservasAdmin');

    if(totalUsuarios) totalUsuarios.textContent = String(dashboard.usuarios || 0);
    if(totalEspacios) totalEspacios.textContent = String(dashboard.espacios || 0);
    if(totalDisponibles) totalDisponibles.textContent = String(dashboard.disponibles || 0);
    if(totalReservas) totalReservas.textContent = String(dashboard.reservas || 0);
}

async function inicializarAdmin(){
    const tablaUsuarios = document.getElementById('tablaUsuariosAdmin');
    if(!tablaUsuarios) return;

    const usuario = obtenerUsuarioActivo();
    if(!usuario){
        window.location.href = 'login.html';
        return;
    }

    if(String(usuario.rol || '').trim() !== 'Administrador'){
        alert('No tiene permisos para acceder al panel administrativo.');
        window.location.href = '../index.html';
        return;
    }

    const dataBackend = await cargarAdminBackend();
    const usuarios = dataBackend?.users || obtenerUsuarios();
    const reservas = dataBackend?.reservas || obtenerReservas();
    const solicitudes = dataBackend?.solicitudes || obtenerSolicitudesParqueo();

    if(dataBackend?.dashboard){
        actualizarCardsAdmin(dataBackend.dashboard);
    }else{
        actualizarCardsAdmin({
            usuarios: usuarios.length,
            espacios: obtenerParqueos().reduce((acum, p)=>acum + Number(p.espacios || 0), 0),
            disponibles: obtenerParqueos().filter((p)=>p.disponible).reduce((acum, p)=>acum + Number(p.espacios || 0), 0),
            reservas: reservas.length
        });
    }

    renderUsuariosAdmin(usuarios);
    renderReservasAdmin(reservas);
    renderSolicitudesAdmin(solicitudes);

    document.querySelectorAll('.btn-toggle-usuario').forEach((btn)=>{
        btn.addEventListener('click', async ()=>{
            const id = btn.dataset.id;
            const next = normalizarEstado(btn.dataset.next);
            try{
                if(typeof window.backendRequest === 'function'){
                    await window.backendRequest('admin.user-status', {
                        method: 'POST',
                        body: JSON.stringify({id, estado: next})
                    });
                }
                await inicializarAdmin();
            }catch(error){
                alert((error && error.message) ? error.message : 'No fue posible actualizar el usuario.');
            }
        });
    });

    document.querySelectorAll('.btn-cancelar-admin').forEach((btn)=>{
        btn.addEventListener('click', async ()=>{
            try{
                if(typeof window.backendRequest === 'function'){
                    await window.backendRequest('admin.reserva-cancel', {
                        method: 'POST',
                        body: JSON.stringify({id: btn.dataset.id})
                    });
                }
                await inicializarAdmin();
            }catch(error){
                alert((error && error.message) ? error.message : 'No fue posible cancelar la reserva.');
            }
        });
    });

    document.querySelectorAll('.btn-aprobar-admin').forEach((btn)=>{
        btn.addEventListener('click', async ()=>{
            try{
                if(typeof window.backendRequest === 'function'){
                    await window.backendRequest('admin.request-approve', {
                        method: 'POST',
                        body: JSON.stringify({id: btn.dataset.id})
                    });
                }
                await inicializarAdmin();
            }catch(error){
                alert((error && error.message) ? error.message : 'No fue posible aprobar la solicitud.');
            }
        });
    });

    document.querySelectorAll('.btn-rechazar-admin').forEach((btn)=>{
        btn.addEventListener('click', async ()=>{
            try{
                if(typeof window.backendRequest === 'function'){
                    await window.backendRequest('admin.request-reject', {
                        method: 'POST',
                        body: JSON.stringify({id: btn.dataset.id})
                    });
                }
                await inicializarAdmin();
            }catch(error){
                alert((error && error.message) ? error.message : 'No fue posible rechazar la solicitud.');
            }
        });
    });
}
