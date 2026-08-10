function mostrarUsuarioPerfil(usuario){
    document.getElementById('nombrePerfil').value = usuario.nombre || '';
    document.getElementById('correoPerfil').value = usuario.correo || '';
    document.getElementById('telefonoPerfil').value = usuario.telefono || '';
    document.getElementById('rolPerfil').value = usuario.rol || 'Usuario';
    document.getElementById('nombreEncabezadoPerfil').textContent = usuario.nombre || 'Mi perfil';
}

async function cargarSesionPerfil(){
    const respuesta = await window.backendRequest('auth.session');
    if(!respuesta?.user){
        localStorage.removeItem('usuario-activo-parkeate');
        window.location.href = 'login.html';
        return null;
    }
    localStorage.setItem('usuario-activo-parkeate', JSON.stringify(respuesta.user));
    mostrarUsuarioPerfil(respuesta.user);
    return respuesta.user;
}

async function inicializarPerfil(){
    const perfilForm = document.getElementById('perfilForm');
    if(!perfilForm) return;
    try{
        if(!await cargarSesionPerfil()) return;
    }catch(error){
        window.location.href = 'login.html';
        return;
    }

    document.getElementById('btnCerrarSesion').addEventListener('click', async ()=>{
        try{ await window.backendRequest('auth.logout', {method:'POST'}); }
        catch(error){ /* Se limpia la sesión local aun si falla la conexión. */ }
        localStorage.removeItem('usuario-activo-parkeate');
        window.location.href = 'login.html';
    });
    document.getElementById('recargarPerfil').addEventListener('click',()=>cargarSesionPerfil().catch(()=>{}));

    perfilForm.addEventListener('submit', async event=>{
        event.preventDefault();
        const nueva = document.getElementById('nuevaPassword').value;
        const confirmar = document.getElementById('confirmarNuevaPassword').value;
        if(nueva || confirmar){
            if(nueva.length < 8){ alert('La nueva contraseña debe tener al menos 8 caracteres.'); return; }
            if(nueva !== confirmar){ alert('Las nuevas contraseñas no coinciden.'); return; }
        }
        try{
            const respuesta = await window.backendRequest('auth.update-profile', {
                method:'POST',
                body:JSON.stringify({
                    nombre:document.getElementById('nombrePerfil').value.trim(),
                    correo:document.getElementById('correoPerfil').value.trim(),
                    telefono:document.getElementById('telefonoPerfil').value.trim(),
                    password:nueva || ''
                })
            });
            if(respuesta?.user){
                localStorage.setItem('usuario-activo-parkeate', JSON.stringify(respuesta.user));
                mostrarUsuarioPerfil(respuesta.user);
            }
            document.getElementById('nuevaPassword').value = '';
            document.getElementById('confirmarNuevaPassword').value = '';
            document.getElementById('mensajePerfil').classList.remove('d-none');
        }catch(error){ alert(error.message || 'No fue posible actualizar el perfil.'); }
    });
}
