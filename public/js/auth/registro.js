function inicializarRegistro(){
    const registroForm = document.getElementById("registroForm");
    if(!registroForm) return;
    registroForm.addEventListener("submit",async (e)=>{
        e.preventDefault();
        const nombre = document.getElementById("nombre").value.trim();
        const correo = document.getElementById("correoRegistro").value.trim();
        const telefono = document.getElementById("telefono").value.trim();
        const password = document.getElementById("passwordRegistro").value;
        const confirmar = document.getElementById("confirmarPassword").value;
        if(!nombre || !correo || !telefono || !password || !confirmar){
            alert("Todos los campos son obligatorios.");
            return;
        }
        if(password.length < 8){
            alert("La contraseña debe tener al menos 8 caracteres.");
            return;
        }
        if(password !== confirmar){
            alert("Las contraseñas no coinciden.");
            return;
        }

        try{
            if(typeof window.backendRequest === "function"){
                await window.backendRequest("auth.register", {
                    method:"POST",
                    body: JSON.stringify({nombre, correo, telefono, password})
                });
                alert("Usuario registrado correctamente.");
                window.location.href = "login.html";
                return;
            }
        }catch(error){
            const mensaje = (error && error.message) ? error.message : "";
            const fallbackLocal = mensaje.toLowerCase().includes("failed") || mensaje.toLowerCase().includes("network") || mensaje.toLowerCase().includes("fetch");
            if(mensaje && !fallbackLocal){
                alert(mensaje);
                return;
            }
        }

        const usuarios = obtenerUsuarios();
        const existe = usuarios.some(usuario=>{
            return usuario.correo.toLowerCase()===correo.toLowerCase();
        });
        if(existe){
            alert("Ya existe un usuario registrado con ese correo.");
            return;
        }
        usuarios.push({
            id:generarId("usr"),
            nombre,
            correo,
            telefono,
            rol:"Usuario",
            estado:"Activo"
        });
        guardarUsuarios(usuarios);
        alert("Usuario registrado correctamente.");
        window.location.href = "login.html";
    });
}
function formatoTelefono(){
    const telefono = document.getElementById("telefono");
    if(!telefono) return;
    telefono.addEventListener("input",()=>{
        let valor = telefono.value.replace(/\D/g,"");
        if(valor.length > 4){
            valor = valor.substring(0,4) + "-" + valor.substring(4,8);
        }
        telefono.value = valor;
    });
}

