function inicializarPerfil(){
    const perfilForm = document.getElementById("perfilForm");
    if(!perfilForm) return;
    const inputNombre = document.getElementById("nombrePerfil");
    const inputCorreo = document.getElementById("correoPerfil");
    const inputTelefono = document.getElementById("telefonoPerfil");
    const botonLogout = document.getElementById("btnCerrarSesion");

    const usuarioLocal = (()=>{
        try{
            const raw = localStorage.getItem("usuario-activo-parkeate");
            return raw ? JSON.parse(raw) : null;
        }catch(error){
            return null;
        }
    })();

    if(usuarioLocal){
        if(inputNombre) inputNombre.value = usuarioLocal.nombre || "";
        if(inputCorreo) inputCorreo.value = usuarioLocal.correo || "";
        if(inputTelefono) inputTelefono.value = usuarioLocal.telefono || "";
    }

    if(typeof window.backendRequest === "function"){
        window.backendRequest("auth.session")
            .then((respuesta)=>{
                if(respuesta && respuesta.user){
                    localStorage.setItem("usuario-activo-parkeate", JSON.stringify(respuesta.user));
                    if(inputNombre) inputNombre.value = respuesta.user.nombre || "";
                    if(inputCorreo) inputCorreo.value = respuesta.user.correo || "";
                    if(inputTelefono) inputTelefono.value = respuesta.user.telefono || "";
                }
            })
            .catch(()=>{});
    }

    if(botonLogout && !botonLogout.dataset.inicializado){
        botonLogout.dataset.inicializado = "true";
        botonLogout.addEventListener("click",async ()=>{
            try{
                if(typeof window.backendRequest === "function"){
                    await window.backendRequest("auth.logout", {method:"POST"});
                }
            }catch(error){
                // Modo local.
            }
            localStorage.removeItem("usuario-activo-parkeate");
            window.location.href = "login.html";
        });
    }

    perfilForm.addEventListener("submit",async (e)=>{
        e.preventDefault();
        const nueva = document.getElementById("nuevaPassword").value;
        const confirmar = document.getElementById("confirmarNuevaPassword").value;
        if(nueva || confirmar){
            if(nueva.length < 8){
                alert("La nueva contraseña debe tener al menos 8 caracteres.");
                return;
            }
            if(nueva !== confirmar){
                alert("Las nuevas contraseñas no coinciden.");
                return;
            }
        }

        try{
            if(typeof window.backendRequest === "function"){
                const respuesta = await window.backendRequest("auth.update-profile", {
                    method:"POST",
                    body: JSON.stringify({
                        nombre: inputNombre ? inputNombre.value.trim() : "",
                        correo: inputCorreo ? inputCorreo.value.trim() : "",
                        telefono: inputTelefono ? inputTelefono.value.trim() : "",
                        password: nueva || ""
                    })
                });
                if(respuesta && respuesta.user){
                    localStorage.setItem("usuario-activo-parkeate", JSON.stringify(respuesta.user));
                }
            }
        }catch(error){
            const mensaje = (error && error.message) ? error.message : "No fue posible actualizar el perfil.";
            alert(mensaje);
            return;
        }

        document
            .getElementById("mensajePerfil")
            .classList.remove("d-none");
        setTimeout(()=>{
            document
                .getElementById("mensajePerfil")
                .classList.add("d-none");
        },3000);
    });
}

