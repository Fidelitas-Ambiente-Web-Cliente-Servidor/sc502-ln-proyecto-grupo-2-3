function inicializarLogin(){
    const loginForm = document.getElementById("loginForm");
    if(!loginForm) return;
    loginForm.addEventListener("submit",async (e)=>{
        e.preventDefault();
        const correo = document.getElementById("correo").value.trim();
        const password = document.getElementById("password").value.trim();
        if(!correo || !password){
            alert("Debe completar todos los campos.");
            return;
        }

        try{
            if(typeof window.backendRequest === "function"){
                const respuesta = await window.backendRequest("auth.login", {
                    method:"POST",
                    body: JSON.stringify({correo, password})
                });
                if(respuesta && respuesta.user){
                    localStorage.setItem("usuario-activo-parkeate", JSON.stringify(respuesta.user));
                    alert("Inicio de sesión exitoso.");
                    window.location.href = String(respuesta.user.rol || "") === "Administrador"
                        ? "admin.html"
                        : "perfil.html";
                    return;
                }
            }
        }catch(error){
            // Fallback local si el backend no está disponible.
        }

        const usuario = obtenerUsuarios().find(usuario=>{
            return usuario.correo.toLowerCase()===correo.toLowerCase();
        });
        if(!usuario){
            alert("El usuario no existe. Debe registrarse primero.");
            return;
        }
        if(usuario.estado!=="Activo"){
            alert("El usuario se encuentra inactivo. Contacte al administrador.");
            return;
        }
        localStorage.setItem("usuario-activo-parkeate",JSON.stringify(usuario));
        alert("Inicio de sesión exitoso.");
        window.location.href = String(usuario.rol || "") === "Administrador"
            ? "admin.html"
            : "perfil.html";
    });
}

