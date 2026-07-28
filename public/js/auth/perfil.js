function inicializarPerfil(){
    const perfilForm = document.getElementById("perfilForm");
    if(!perfilForm) return;
    perfilForm.addEventListener("submit",(e)=>{
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

