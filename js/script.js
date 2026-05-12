/* ========================== DATOS GLOBALES ========================== */

// Moneda actual seleccionada
let monedaActual = localStorage.getItem("monedaSeleccionada") || "USD";

// Tasas de cambio aproximadas (USD como base)
const tasasCambio = {
	USD: 1,
	CLP: 850, // 1 USD = 850 CLP
	BRL: 5.10  // 1 USD = 5.10 BRL
};

// Array de usuarios registrados
let usuariosRegistrados = [];

// Array de destinos disponibles
const destinos = [
	{
		nombre: "Cartagena",
		descripcion: "Puerto histórico con playas y vistas al mar",
		imagen: "img/cartagena.jpg",
		precio: 45000,
		distancia: 45
	},
	{
		nombre: "Valparaíso",
		descripcion: "Ciudad vibrante con cerros coloridos y arte",
		imagen: "img/valparaiso.jpg",
		precio: 35000,
		distancia: 120
	},
	{
		nombre: "San Antonio",
		descripcion: "Puerto pesquero con playas tranquilas",
		imagen: "img/san-antonio.jpg",
		precio: 55000,
		distancia: 100
	}
];

/* ========================== FUNCIONES DE MONEDA ========================== */

/**
 * Convierte un precio de CLP a la moneda seleccionada
 * @param {number} precioCLP - Precio en CLP
 * @returns {number} - Precio convertido a la moneda actual
 */
function convertirMoneda(precioCLP) {
	// Convertir de CLP a USD primero
	const precioUSD = precioCLP / tasasCambio.CLP;
	// Luego de USD a la moneda seleccionada
	return precioUSD * tasasCambio[monedaActual];
}

/**
 * Obtiene el símbolo de moneda
 * @returns {string} - Símbolo de la moneda actual
 */
function obtenerSimboloMoneda() {
	const simbolos = {
		USD: "$",
		CLP: "$",
		BRL: "R$"
	};
	return simbolos[monedaActual];
}

/**
 * Formatea un precio con la moneda actual
 * @param {number} precio - Precio a formatear
 * @returns {string} - Precio formateado
 */
function formatearPrecio(precio) {
	const simbolo = obtenerSimboloMoneda();
	const precioFormateado = convertirMoneda(precio).toLocaleString("es-CL", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 0
	});
	return `${simbolo} ${precioFormateado}`;
}

/* ========================== FUNCIONES DE MODALES ========================== */

/**
 * Abre el modal de login y cierra el de registro si estaba abierto
 */
function abrirModalLogin() {
	$("#modalLogin").addClass("active");
	$("#modalRegistro").removeClass("active");
}

/**
 * Abre el modal de registro y cierra el de login si estaba abierto
 */
function abrirModalRegistro() {
	$("#modalRegistro").addClass("active");
	$("#modalLogin").removeClass("active");
}

/**
 * Cierra el modal de login
 */
function cerrarModalLogin() {
	$("#modalLogin").removeClass("active");
	$("#formularioLogin")[0].reset();
	$("[id^='error_login_']").text("");
	$("#mensaje_login").html("").hide();
}

/**
 * Cierra el modal de registro
 */
function cerrarModalRegistro() {
	$("#modalRegistro").removeClass("active");
	$("#formularioInscripcion")[0].reset();
	$("[id^='error_inscripcion_']").text("");
	$("#mensaje_inscripcion").html("").hide();
}

/* ========================== FUNCIONES DE VALIDACIÓN ========================== */

/**
 * Valida que un nombre tenga al menos 2 caracteres
 * @param {string} nombre - Nombre a validar
 * @returns {boolean} - True si es válido, false si no
 */
function validarNombre(nombre) {
	return nombre.trim().length >= 2;
}

/**
 * Valida que un email tenga el formato correcto
 * @param {string} email - Email a validar
 * @returns {boolean} - True si es válido, false si no
 */
function validarEmail(email) {
	const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
	return regex.test(email);
}

/**
 * Valida que una contraseña tenga al menos 6 caracteres
 * @param {string} contraseña - Contraseña a validar
 * @returns {boolean} - True si es válida, false si no
 */
function validarContraseña(contraseña) {
	return contraseña.length >= 6;
}

/**
 * Valida que un teléfono sea válido
 * @param {string} telefono - Teléfono a validar
 * @returns {boolean} - True si es válido, false si no
 */
function validarTelefono(telefono) {
	const regex = /^[\d\s\-\+]+$/;
	return regex.test(telefono) && telefono.replace(/\D/g, "").length >= 7;
}

/**
 * Valida que un mensaje tenga al menos 10 caracteres
 * @param {string} mensaje - Mensaje a validar
 * @returns {boolean} - True si es válido, false si no
 */
function validarMensaje(mensaje) {
	return mensaje.trim().length >= 10;
}

/* ========================== MANEJADORES DE FORMULARIOS ========================== */

/**
 * Maneja el envío del formulario de inscripción/registro
 * @param {Event} e - Evento del formulario
 */
function manejarInscripcion(e) {
	e.preventDefault();

	// Obtener valores del formulario
	const nombre = $("#inscripcion_nombre").val().trim();
	const email = $("#inscripcion_email").val().trim();
	const telefono = $("#inscripcion_telefono").val().trim();
	const contraseña = $("#inscripcion_contraseña").val();

	// Limpiar mensajes de error
	$("[id^='error_inscripcion_']").text("");

	// Validar nombre
	if (!validarNombre(nombre)) {
		$("#error_inscripcion_nombre").text("El nombre debe tener al menos 2 caracteres");
		return;
	}

	// Validar email
	if (!validarEmail(email)) {
		$("#error_inscripcion_email").text("El email debe ser válido");
		return;
	}

	// Validar teléfono
	if (!validarTelefono(telefono)) {
		$("#error_inscripcion_telefono").text("El teléfono debe ser válido");
		return;
	}

	// Validar contraseña
	if (!validarContraseña(contraseña)) {
		$("#error_inscripcion_contraseña").text("La contraseña debe tener al menos 6 caracteres");
		return;
	}

	// Crear objeto usuario y agregar a array
	const usuario = {
		nombre: nombre,
		email: email,
		telefono: telefono,
		contraseña: contraseña
	};

	usuariosRegistrados.push(usuario);

	// Mostrar mensaje de éxito
	$("#mensaje_inscripcion").html('<div class="alert-success">✓ ¡Registro exitoso! Ahora puedes iniciar sesión.</div>');
	$("#mensaje_inscripcion").show();

	// Resetear formulario
	$("#formularioInscripcion")[0].reset();

	// Cerrar modal después de 2 segundos
	setTimeout(() => {
		cerrarModalRegistro();
	}, 2000);
}

/**
 * Maneja el envío del formulario de login
 * @param {Event} e - Evento del formulario
 */
function manejarLogin(e) {
	e.preventDefault();

	// Obtener valores del formulario
	const email = $("#login_email").val().trim();
	const contraseña = $("#login_contraseña").val();
	const recordarme = $("#recordarme").is(":checked");

	// Limpiar mensajes de error
	$("[id^='error_login_']").text("");

	// Validar email
	if (!validarEmail(email)) {
		$("#error_login_email").text("El email debe ser válido");
		return;
	}

	// Validar contraseña
	if (!validarContraseña(contraseña)) {
		$("#error_login_contraseña").text("La contraseña debe tener al menos 6 caracteres");
		return;
	}

	// Buscar usuario en el array
	const usuarioEncontrado = usuariosRegistrados.find(usuario => 
		usuario.email === email && usuario.contraseña === contraseña
	);

	if (usuarioEncontrado) {
		// Si el usuario existe, mostrar mensaje de éxito
		$("#mensaje_login").html(`<div class="alert-success">✓ ¡Bienvenido ${usuarioEncontrado.nombre}!</div>`);
		$("#mensaje_login").show();

		// Si el usuario marcó "Recuérdame", guardar en localStorage
		if (recordarme) {
			localStorage.setItem("usuarioLogueado", email);
		}

		// Resetear formulario y cerrar modal
		$("#formularioLogin")[0].reset();
		setTimeout(() => {
			cerrarModalLogin();
		}, 2000);
	} else {
		// Usuario no encontrado
		$("#mensaje_login").html('<div class="alert-danger">✗ Email o contraseña incorrectos</div>');
		$("#mensaje_login").show();
	}
}

/**
 * Maneja el envío del formulario de contacto
 * @param {Event} e - Evento del formulario
 */
function manejarContacto(e) {
	e.preventDefault();

	// Obtener valores
	const nombre = $("#nombre").val().trim();
	const email = $("#correo").val().trim();
	const mensaje = $("#mensaje").val().trim();

	// Validar campos
	if (!validarNombre(nombre)) {
		alert("El nombre debe tener al menos 2 caracteres");
		return;
	}

	if (!validarEmail(email)) {
		alert("El email debe ser válido");
		return;
	}

	if (!validarMensaje(mensaje)) {
		alert("El mensaje debe tener al menos 10 caracteres");
		return;
	}

	// Mostrar resultado
	const resultado = `<div class="alert alert-success">
		✓ Gracias por contactarnos, ${nombre}. Tu mensaje ha sido recibido.
	</div>`;
	$("#contactResult").html(resultado).show();

	// Resetear formulario
	$("#contactForm")[0].reset();

	// Ocultar resultado después de 3 segundos
	setTimeout(() => {
		$("#contactResult").fadeOut();
	}, 3000);
}

/**
 * Cotiza un destino turístico
 * @param {string} nombreDestino - Nombre del destino
 * @param {number} precio - Precio del destino
 */
function cotizarDestino(nombreDestino, precio) {
	const resultado = `<div class="alert alert-success">
		✓ Cotización para ${nombreDestino}: $${precio.toLocaleString("es-CL")} CLP
	</div>`;
	$("#destinoResultado").html(resultado);
}

/* ========================== INICIALIZACIÓN DE LA APLICACIÓN ========================== */

/**
 * Inicializa los event listeners de los modales
 */
function inicializarModales() {
	// Botones del navbar
	$("#btnLogin").click(abrirModalLogin);
	$("#btnRegistro").click(abrirModalRegistro);

	// Botones de cerrar
	$("#closeLogin").click(cerrarModalLogin);
	$("#closeRegistro").click(cerrarModalRegistro);

	// Enlaces para cambiar entre formularios
	$("#irRegistro").click(abrirModalRegistro);
	$("#irLogin").click(abrirModalLogin);

	// Cerrar modal al hacer clic fuera del contenedor
	$(document).click(function(event) {
		if ($(event.target).hasClass("modal-overlay")) {
			if ($(event.target).attr("id") === "modalLogin") {
				cerrarModalLogin();
			} else if ($(event.target).attr("id") === "modalRegistro") {
				cerrarModalRegistro();
			}
		}
	});
}

/**
 * Inicializa los event listeners de los formularios
 */
function inicializarFormularios() {
	$("#formularioInscripcion").on("submit", manejarInscripcion);
	$("#formularioLogin").on("submit", manejarLogin);
	$("#contactForm").on("submit", manejarContacto);
}

/**
 * Inicializa datos del cotizador
 */
function inicializarCotizador() {
	// Datos de comunas (ejemplo)
	const comunas = [
		"La Reina", "Providencia", "Santiago", "Ñuñoa",
		"Macul", "Maipú", "Las Condes", "Vitacura"
	];

	// Llenar select de comunas
	comunas.forEach(comuna => {
		$("#comuna").append(`<option value="${comuna}">${comuna}</option>`);
	});

	// Evento del formulario cotizador
	$("#cotizadorForm").on("submit", function(e) {
		e.preventDefault();

		const comuna = $("#comuna").val();
		const servicio = $("#servicio").val();
		const pasajeros = $("#pasajeros").val();

		if (!comuna) {
			alert("Por favor selecciona una comuna");
			return;
		}

		// Calcular precio base según servicio
		let precioBase = {
			"privado": 15000,
			"ejecutivo": 25000,
			"van": 35000
		}[servicio];

		// Sumar por pasajeros adicionales
		const precioTotal = precioBase + (pasajeros - 1) * 5000;

		const resultado = `<div class="alert alert-success">
			✓ Cotización a ${comuna}: ${formatearPrecio(precioTotal)} para ${pasajeros} pasajeros (${servicio})
		</div>`;
		$("#resultado").html(resultado);
	});
}

/**
 * Inicializa el selector de monedas
 */
function inicializarSelectorMonedas() {
	// Establecer moneda guardada en botones
	$(".currency-btn").removeClass("active");
	$(`.currency-btn[data-currency="${monedaActual}"]`).addClass("active");

	// Evento al hacer clic en un botón de moneda
	$(".currency-btn").on("click", function() {
		const nuevaMoneda = $(this).data("currency");
		monedaActual = nuevaMoneda;
		localStorage.setItem("monedaSeleccionada", monedaActual);

		// Actualizar botones activos
		$(".currency-btn").removeClass("active");
		$(this).addClass("active");

		// Actualizar precios en la página
		actualizarPreciosEnPagina();

		console.log(`✓ Moneda cambiada a: ${monedaActual}`);
	});
}

/**
 * Actualiza todos los precios en la página con la moneda actual
 */
function actualizarPreciosEnPagina() {
	// Actualizar precios en tarjetas de destinos
	$(".destino-price .price").each(function() {
		const textoOriginal = $(this).text();
		const precioNumerico = parseInt(textoOriginal.replace(/\D/g, ""));
		if (precioNumerico) {
			$(this).text(formatearPrecio(precioNumerico));
		}
	});

	// Actualizar precios en resultado de cotización
	const resultadoTexto = $("#resultado").text();
	if (resultadoTexto.includes("Cotización")) {
		// Aquí puedes agregar lógica adicional si es necesario
	}
}

/**
 * Inicializa el carrusel de destinos.
 * Cambia de imagen automáticamente cada 5 segundos.
 * Permite navegación manual con botones y puntos.
 */
function inicializarCarrusel() {
	let currentSlide = 0;
	const slides = $(".carousel-item").length;
	const carouselTrack = $(".carousel-track");
	const dots = $(".carousel-dot");
	let autoplayInterval = null;
	const INTERVALO_MS = 5000; // 5 segundos

	// Verificar que existan slides antes de inicializar
	if (slides === 0) {
		console.warn("Carrusel: no se encontraron .carousel-item");
		return;
	}

	/**
	 * Mueve el carrusel a una diapositiva específica
	 * @param {number} slideIndex - Índice de la diapositiva (puede ser negativo o > slides)
	 */
	function goToSlide(slideIndex) {
		currentSlide = (slideIndex + slides) % slides;
		const translateValue = -currentSlide * 100;
		carouselTrack.css("transform", `translateX(${translateValue}%)`);

		// Actualizar indicadores
		dots.removeClass("active");
		dots.eq(currentSlide).addClass("active");
	}

	function nextSlide() { goToSlide(currentSlide + 1); }
	function prevSlide() { goToSlide(currentSlide - 1); }

	/**
	 * Reinicia el auto-play (limpia el intervalo previo y crea uno nuevo).
	 * Se llama cada vez que el usuario interactúa, para evitar conflictos.
	 */
	function reiniciarAutoplay() {
		if (autoplayInterval) clearInterval(autoplayInterval);
		autoplayInterval = setInterval(nextSlide, INTERVALO_MS);
	}

	// Botones de navegación
	$(".carousel-next").on("click", function() {
		nextSlide();
		reiniciarAutoplay();
	});
	$(".carousel-prev").on("click", function() {
		prevSlide();
		reiniciarAutoplay();
	});

	// Puntos indicadores
	dots.on("click", function() {
		const slideIndex = $(this).data("slide");
		goToSlide(slideIndex);
		reiniciarAutoplay();
	});

	// Pausar auto-play cuando el mouse está sobre el carrusel (UX común)
	$(".carousel-container")
		.on("mouseenter", function() {
			if (autoplayInterval) clearInterval(autoplayInterval);
		})
		.on("mouseleave", function() {
			reiniciarAutoplay();
		});

	// Asegurar posición inicial correcta
	goToSlide(0);

	// Iniciar auto-play
	reiniciarAutoplay();

	console.log(`✓ Carrusel iniciado: ${slides} slides, cambio cada ${INTERVALO_MS / 1000}s`);
}

/**
 * Punto de entrada principal - se ejecuta cuando el DOM está listo
 */
$(document).ready(function() {
	console.log("✓ Aplicación LEOTOUR iniciada");

	// Inicializar carrusel
	inicializarCarrusel();

	// Inicializar modales
	inicializarModales();

	// Inicializar formularios
	inicializarFormularios();

	// Inicializar cotizador
	inicializarCotizador();

	// Verificar si hay usuario guardado en localStorage
	const usuarioGuardado = localStorage.getItem("usuarioLogueado");
	if (usuarioGuardado) {
		console.log("✓ Usuario recordado:", usuarioGuardado);
	}

	// Inicializar mapa (si está disponible Leaflet)
	if (typeof L !== "undefined") {
		inicializarMapa();
	}

	// Inicializar vuelos
	inicializarVuelos();

	// Hamburger menu toggle
	$(".hamburger").click(function() {
		$(".nav-menu").toggleClass("active");
	});

	// Cerrar menú al hacer clic en un enlace
	$(".nav-link").click(function() {
		$(".nav-menu").removeClass("active");
	});

	// Inicializar selector de monedas
	inicializarSelectorMonedas();

	// Actualizar precios iniciales
	actualizarPreciosEnPagina();
});

/* ========================== FUNCIONES ADICIONALES ========================== */

/**
 * Inicializa el mapa con Leaflet
 */
function inicializarMapa() {
	try {
		const map = L.map("map").setView([-33.8688, -151.2093], 11);

		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution: "&copy; OpenStreetMap contributors",
			maxZoom: 19
		}).addTo(map);

		// Marcadores de destinos
		L.marker([-33.5686, -71.5545]).bindPopup("Cartagena - 45 km").addTo(map);
		L.marker([-33.0472, -71.6127]).bindPopup("Valparaíso - 120 km").addTo(map);
		L.marker([-33.5903, -71.6218]).bindPopup("San Antonio - 100 km").addTo(map);
	} catch (error) {
		console.log("No se pudo inicializar el mapa");
	}
}

/**
 * Inicializa la vista de vuelos
 */
function inicializarVuelos() {
	// Datos de ejemplo de vuelos con más información
	const vuelosEjemplo = [
		{ hora: "08:15", destino: "Miami", origen: "NCY", estado: "En tiempo", gate: "A-12" },
		{ hora: "10:30", destino: "New York", origen: "LAX", estado: "Retrasado", gate: "B-08" },
		{ hora: "12:45", destino: "Buenos Aires", origen: "EZE", estado: "En tiempo", gate: "A-05" },
		{ hora: "14:00", destino: "México", origen: "MEX", estado: "En tiempo", gate: "C-03" },
		{ hora: "15:30", destino: "São Paulo", origen: "GIG", estado: "Abordando", gate: "B-15" },
		{ hora: "17:00", destino: "Lima", origen: "LIM", estado: "En tiempo", gate: "A-18" }
	];

	// Mostrar vuelos en la tabla con estructura tipo aeropuerto
	let html = "";
	vuelosEjemplo.forEach(vuelo => {
		const claseEstado = vuelo.estado === "Retrasado" ? "retrasado" : vuelo.estado === "Abordando" ? "abordando" : "en-tiempo";
		html += `<div class="vuelo-item">
			<div class="vuelo-hora">${vuelo.hora}</div>
			<div class="vuelo-destino">${vuelo.destino}</div>
			<div>${vuelo.origen} → Gate ${vuelo.gate}</div>
			<div class="vuelo-estado ${claseEstado}">${vuelo.estado}</div>
		</div>`;
	});

	$("#vuelos").html(html);
}