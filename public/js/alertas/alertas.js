function tarjetaAlerta(alerta){
    return `
        <div class="col">
            <div class="card alert-card h-100">
                <div class="card-body d-flex flex-column gap-3">
                    <div class="d-flex align-items-start gap-3">
                        <div class="alert-card-icon bg-light rounded-circle d-inline-flex align-items-center justify-content-center">
                            <i class="bi ${alerta.icono || 'bi-bell-fill text-warning'} fs-3"></i>
                        </div>
                        <div>
                            <h5 class="mb-1">${alerta.titulo || 'Notificación'}</h5>
                            <small class="text-muted">${alerta.tiempo || 'Reciente'}</small>
                        </div>
                    </div>
                    <p class="mb-0 text-muted">${alerta.mensaje || ''}</p>
                </div>
            </div>
        </div>
    `;
}

async function cargarConfigAlertas(){
    if(typeof window.backendRequest !== 'function') return null;
    try{
        const respuesta = await window.backendRequest('alertas.config');
        return respuesta?.config || null;
    }catch(error){
        return null;
    }
}

async function guardarConfigAlertas(config){
    if(typeof window.backendRequest !== 'function') return false;
    try{
        await window.backendRequest('alertas.config', {
            method: 'POST',
            body: JSON.stringify(config)
        });
        return true;
    }catch(error){
        return false;
    }
}

async function cargarAlertasBackend(){
    if(typeof window.backendRequest !== 'function') return [];
    try{
        const respuesta = await window.backendRequest('alertas.list');
        return Array.isArray(respuesta?.data) ? respuesta.data : [];
    }catch(error){
        return [];
    }
}

async function inicializarAlertas(){
    const contenedor = document.getElementById('contenedor-alertas');
    if(!contenedor) return;

    const formConfig = document.getElementById('formConfigAlertas');
    const selectParqueo = document.getElementById('alertaParqueo');
    const inputZona = document.getElementById('alertaZona');
    const mensajeConfig = document.getElementById('mensajeConfigAlertas');

    if(selectParqueo && selectParqueo.options.length === 1){
        obtenerParqueos().forEach((parqueo)=>{
            const option = document.createElement('option');
            option.value = parqueo.nombre;
            option.textContent = parqueo.nombre;
            selectParqueo.appendChild(option);
        });
    }

    const configBackend = await cargarConfigAlertas();
    const configLocal = leerDatos(DB_KEYS.configAlertas, {zona:'', parqueo:''});
    const config = configBackend || configLocal;

    if(inputZona) inputZona.value = config.zona || '';
    if(selectParqueo) selectParqueo.value = config.parqueo || '';

    if(formConfig && !formConfig.dataset.inicializado){
        formConfig.dataset.inicializado = 'true';
        formConfig.addEventListener('submit', async (e)=>{
            e.preventDefault();
            const nuevo = {
                zona: inputZona ? inputZona.value.trim() : '',
                parqueo: selectParqueo ? selectParqueo.value : ''
            };
            guardarDatos(DB_KEYS.configAlertas, nuevo);
            await guardarConfigAlertas(nuevo);
            if(mensajeConfig){
                mensajeConfig.classList.remove('d-none');
            }
            await inicializarAlertas();
        });
    }

    const alertas = await cargarAlertasBackend();
    if(alertas.length){
        contenedor.innerHTML = alertas.map(tarjetaAlerta).join('');
        return;
    }

    const reservas = obtenerReservas().slice(-2).reverse();
    const fallback = reservas.map((r, index)=>({
        id: `local-${index}`,
        icono: 'bi-check-circle-fill text-success',
        titulo: 'Reserva Confirmada',
        tiempo: 'Reciente',
        mensaje: `Tu reserva en ${r.parqueo || 'Parqueo'} para el ${r.fecha} a las ${r.hora} fue registrada.`
    }));

    contenedor.innerHTML = fallback.length
        ? fallback.map(tarjetaAlerta).join('')
        : '<div class="col-12"><div class="alert alert-info">No hay alertas disponibles por el momento.</div></div>';
}
