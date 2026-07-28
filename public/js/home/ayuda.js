function inicializarAyuda(){
    const formAyuda = document.getElementById("formAyuda");
    if(!formAyuda) return;
    formAyuda.addEventListener("submit",(e)=>{
        e.preventDefault();
        const nombre = document.getElementById("nombreAyuda").value.trim();
        const correo = document.getElementById("correoAyuda").value.trim();
        const consulta = document.getElementById("consultaAyuda").value.trim();
        if(!nombre || !correo || !consulta){
            alert("Debe completar todos los campos.");
            return;
        }
        document.getElementById("mensajeAyuda").classList.remove("d-none");
        formAyuda.reset();
    });
}

