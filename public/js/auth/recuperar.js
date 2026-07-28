function inicializarRecuperacion(){
    const recuperarForm = document.getElementById("recuperarForm");
    if(!recuperarForm) return;
    recuperarForm.addEventListener("submit",(e)=>{
        e.preventDefault();
        const correo = document.getElementById("correoRecuperacion").value.trim();
        if(!correo){
            alert("Ingrese un correo electrónico.");
            return;
        }
        document
            .getElementById("mensajeRecuperacion")
            .classList.remove("d-none");
        recuperarForm.reset();
    });
}

