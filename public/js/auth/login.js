function inicializarLogin(){
    const loginForm = document.getElementById("loginForm");
    if(!loginForm) return;
    loginForm.addEventListener("submit",(e)=>{
        e.preventDefault();
        const correo = document.getElementById("correo").value.trim();
        const password = document.getElementById("password").value.trim();
        if(!correo || !password){
            alert("Debe completar todos los campos.");
            return;
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
        window.location.href = "perfil.html";
    });
}

