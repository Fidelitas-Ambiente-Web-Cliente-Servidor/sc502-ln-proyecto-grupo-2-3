const menu = [
  { nombre: 'Bruschetta Clásica', descripcion: 'Pan tostado con tomate y albahaca fresca', precio: 4500, categoria: 'Entrada' },
  { nombre: 'Tabla de Quesos', descripcion: 'Selección de quesos importados con mermelada', precio: 7800, categoria: 'Entrada' },
  { nombre: 'Lomo al Vino Tinto', descripcion: 'Lomo de res en reducción de vino tinto', precio: 15500, categoria: 'Plato Fuerte' },
  { nombre: 'Pasta Carbonara', descripcion: 'Pasta con tocino, huevo y queso parmesano', precio: 10200, categoria: 'Plato Fuerte' },
  { nombre: 'Salmón a la Plancha', descripcion: 'Filete de salmón con vegetales al vapor', precio: 13800, categoria: 'Plato Fuerte' },
  { nombre: 'Tiramisú', descripcion: 'Postre italiano con café y mascarpone', precio: 5200, categoria: 'Postre' },
  { nombre: 'Cheesecake de Maracuyá', descripcion: 'Cheesecake cremoso con coulis de maracuyá', precio: 4800, categoria: 'Postre' }
];

const reservas = [];

// Renderizar menú
function renderMenu(lista = menu) {

    const contenedor = document.getElementById("contenedor-menu");
    contenedor.innerHTML = "";

    lista.forEach(plato => {

        let columna = document.createElement("div");
        columna.className = "col-md-4";

        let card = document.createElement("div");
        card.className = "card-plato";

        card.innerHTML = `
            <h4>${plato.nombre}</h4>
            <p>${plato.descripcion}</p>
            <p><strong>₡${plato.precio.toLocaleString()}</strong></p>
            <p>${plato.categoria}</p>
        `;

        columna.appendChild(card);
        contenedor.appendChild(columna);

    });

}

// Filtrar categorías
function filtrarCategoria(categoria) {

    if (categoria === "Todos") {

        renderMenu();

    } else {

        let filtrados = menu.filter(plato => plato.categoria === categoria);
        renderMenu(filtrados);

    }

}

// Validar formulario
function validarFormulario() {

    let valido = true;

    let nombre = document.getElementById("nombre").value.trim();
    let correo = document.getElementById("correo").value.trim();
    let fecha = document.getElementById("fecha").value;
    let personas = document.getElementById("personas").value;

    document.getElementById("errorNombre").innerHTML = "";
    document.getElementById("errorCorreo").innerHTML = "";
    document.getElementById("errorFecha").innerHTML = "";
    document.getElementById("errorPersonas").innerHTML = "";

    if (nombre.length < 5 || !/^[A-Za-zÁÉÍÓÚáéíóúÑñ ]+$/.test(nombre)) {

        document.getElementById("errorNombre").innerHTML =
            "<div class='error-campo'>Nombre inválido.</div>";

        valido = false;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo)) {

        document.getElementById("errorCorreo").innerHTML =
            "<div class='error-campo'>Correo inválido.</div>";

        valido = false;
    }

    let hoy = new Date().toISOString().split("T")[0];

    if (fecha < hoy) {

        document.getElementById("errorFecha").innerHTML =
            "<div class='error-campo'>La fecha no puede ser pasada.</div>";

        valido = false;
    }

    if (personas < 1 || personas > 20) {

        document.getElementById("errorPersonas").innerHTML =
            "<div class='error-campo'>Debe ser entre 1 y 20 personas.</div>";

        valido = false;
    }

    document.getElementById("btnEnviar").disabled = !valido;

    return valido;

}

// Agregar reserva
function agregarReserva() {

    let nombre = document.getElementById("nombre").value;
    let correo = document.getElementById("correo").value;
    let fecha = document.getElementById("fecha").value;
    let hora = document.getElementById("hora").value;
    let personas = document.getElementById("personas").value;

    reservas.push({
        nombre,
        correo,
        fecha,
        hora,
        personas
    });

    let fila = document.createElement("tr");
    fila.className = "fila-reserva";

    if (personas >= 6) {

        fila.classList.add("vip");

    }

    fila.innerHTML = `
        <td>${nombre}</td>
        <td>${correo}</td>
        <td>${fecha}</td>
        <td>${hora}</td>
        <td>${personas}</td>
    `;

    document.getElementById("tablaReservas").appendChild(fila);

    document.getElementById("form-reserva").reset();

    document.getElementById("btnEnviar").disabled = true;

    actualizarResumen();

}

// Actualizar resumen
function actualizarResumen() {

    let totalReservas = reservas.length;

    let totalPersonas = 0;

    let mayor = 0;
    let nombreMayor = "";

    reservas.forEach(reserva => {

        totalPersonas += Number(reserva.personas);

        if (reserva.personas > mayor) {

            mayor = reserva.personas;
            nombreMayor = reserva.nombre;

        }

    });

    document.getElementById("resumen").innerHTML = `
        <h4>Resumen de Reservas</h4>
        <p>Total de reservas: ${totalReservas}</p>
        <p>Total de personas esperadas: ${totalPersonas}</p>
        <p>Reserva más grande: ${nombreMayor} (${mayor} personas)</p>
    `;

}

// Al cargar la página
document.addEventListener("DOMContentLoaded", function () {

    renderMenu();

});

// Enviar formulario
document.getElementById("form-reserva").addEventListener("submit", function (e) {

    e.preventDefault();

    if (validarFormulario()) {

        agregarReserva();

    }

});