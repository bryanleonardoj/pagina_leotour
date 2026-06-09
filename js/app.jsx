import { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";

const tasasCambio = { USD: 1, CLP: 850, BRL: 5.1 };

const servicios = [
	{ id: "privado", nombre: "Sedán Privado", desc: "Comodidad para 1-3 pasajeros", clase: "sedan-icon", icon: "fa-car" },
	{ id: "ejecutivo", nombre: "SUV Ejecutivo", desc: "Experiencia premium", clase: "suv-icon", icon: "fa-car-side" },
	{ id: "van", nombre: "Van (6 personas)", desc: "Ideal para grupos", clase: "van-icon", icon: "fa-shuttle-van" }
];

const destinos = [
	{ nombre: "Cartagena", descripcion: "Puerto histórico con playas y vistas al mar", imagen: "img/cartagena.jpg", precio: 45000, distancia: 45 },
	{ nombre: "Valparaíso", descripcion: "Ciudad vibrante con cerros coloridos y arte", imagen: "img/valparaiso.jpg", precio: 35000, distancia: 120 },
	{ nombre: "San Antonio", descripcion: "Puerto pesquero con playas tranquilas", imagen: "img/san-antonio.jpg", precio: 55000, distancia: 100 },
	{ nombre: "Pomaire", descripcion: "Pueblo típico con cerámica artesanal", imagen: "img/pomaire.jpg", precio: 65000, distancia: 60 },
	{ nombre: "Cajón del Maipo", descripcion: "Montañas, ríos y naturaleza pura", imagen: "img/cajon-maipo.jpg", precio: 50000, distancia: 50 },
	{ nombre: "Pirque (Viñas)", descripcion: "Degustación de vinos y paisajes agrícolas", imagen: "img/pirque.jpg", precio: 40000, distancia: 35 }
];

const vuelosEjemplo = [
	{ hora: "08:15", destino: "Miami", origen: "NCY", estado: "En tiempo", gate: "A-12" },
	{ hora: "10:30", destino: "New York", origen: "LAX", estado: "Retrasado", gate: "B-08" },
	{ hora: "12:45", destino: "Buenos Aires", origen: "EZE", estado: "En tiempo", gate: "A-05" },
	{ hora: "14:00", destino: "México", origen: "MEX", estado: "En tiempo", gate: "C-03" },
	{ hora: "15:30", destino: "São Paulo", origen: "GIG", estado: "Abordando", gate: "B-15" },
	{ hora: "17:00", destino: "Lima", origen: "LIM", estado: "En tiempo", gate: "A-18" }
];

const comunas = ["La Reina", "Providencia", "Santiago", "Ñuñoa", "Macul", "Maipú", "Las Condes", "Vitacura"];

function App() {
	const [monedaActual, setMonedaActual] = useState(localStorage.getItem("monedaSeleccionada") || "USD");
	const [menuOpen, setMenuOpen] = useState(false);
	const [loginOpen, setLoginOpen] = useState(false);
	const [registroOpen, setRegistroOpen] = useState(false);
	const [usuariosRegistrados, setUsuariosRegistrados] = useState([]);
	const [slide, setSlide] = useState(0);

	const [cotizador, setCotizador] = useState({ comuna: "", servicio: "privado", pasajeros: 1, fecha: "" });
	const [cotizacion, setCotizacion] = useState("");
	const [destinoResultado, setDestinoResultado] = useState("");
	const [contactResult, setContactResult] = useState("");

	const [loginData, setLoginData] = useState({ email: "", contrasena: "", recordarme: false });
	const [registroData, setRegistroData] = useState({ nombre: "", email: "", telefono: "", contrasena: "" });
	const [loginError, setLoginError] = useState("");
	const [registroError, setRegistroError] = useState("");
	const [loginOk, setLoginOk] = useState("");
	const [registroOk, setRegistroOk] = useState("");

	const convertirMoneda = (precioCLP) => {
		const precioUSD = precioCLP / tasasCambio.CLP;
		return precioUSD * tasasCambio[monedaActual];
	};

	const simboloMoneda = useMemo(() => ({ USD: "$", CLP: "$", BRL: "R$" }[monedaActual]), [monedaActual]);

	const formatearPrecio = (precioCLP) => {
		const valor = convertirMoneda(precioCLP).toLocaleString("es-CL", { maximumFractionDigits: 0 });
		return `${simboloMoneda} ${valor}`;
	};

	useEffect(() => {
		localStorage.setItem("monedaSeleccionada", monedaActual);
	}, [monedaActual]);

	useEffect(() => {
		const timer = setInterval(() => {
			setSlide((prev) => (prev + 1) % destinos.length);
		}, 5000);
		return () => clearInterval(timer);
	}, []);

	useEffect(() => {
		if (typeof L === "undefined") return;
		const map = L.map("map").setView([-33.45, -70.66], 9);
		L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
			attribution: "&copy; OpenStreetMap contributors",
			maxZoom: 19
		}).addTo(map);

		L.marker([-33.5686, -71.5545]).bindPopup("Cartagena - 45 km").addTo(map);
		L.marker([-33.0472, -71.6127]).bindPopup("Valparaíso - 120 km").addTo(map);
		L.marker([-33.5903, -71.6218]).bindPopup("San Antonio - 100 km").addTo(map);

		return () => map.remove();
	}, []);

	const handleCotizar = (e) => {
		e.preventDefault();
		if (!cotizador.comuna) {
			setCotizacion("Por favor selecciona una comuna.");
			return;
		}
		const base = { privado: 15000, ejecutivo: 25000, van: 35000 }[cotizador.servicio];
		const total = base + (Number(cotizador.pasajeros) - 1) * 5000;
		setCotizacion(`✓ Cotización a ${cotizador.comuna}: ${formatearPrecio(total)} para ${cotizador.pasajeros} pasajeros (${cotizador.servicio})`);
	};

	const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

	const handleRegistro = (e) => {
		e.preventDefault();
		setRegistroError("");
		setRegistroOk("");
		if (registroData.nombre.trim().length < 2) return setRegistroError("El nombre debe tener al menos 2 caracteres.");
		if (!validarEmail(registroData.email)) return setRegistroError("El email debe ser válido.");
		if (registroData.telefono.replace(/\D/g, "").length < 7) return setRegistroError("El teléfono debe ser válido.");
		if (registroData.contrasena.length < 6) return setRegistroError("La contraseña debe tener al menos 6 caracteres.");

		setUsuariosRegistrados((prev) => [...prev, { ...registroData }]);
		setRegistroOk("✓ ¡Registro exitoso! Ahora puedes iniciar sesión.");
		setRegistroData({ nombre: "", email: "", telefono: "", contrasena: "" });
		setTimeout(() => {
			setRegistroOpen(false);
			setLoginOpen(true);
			setRegistroOk("");
		}, 1200);
	};

	const handleLogin = (e) => {
		e.preventDefault();
		setLoginError("");
		setLoginOk("");
		if (!validarEmail(loginData.email)) return setLoginError("El email debe ser válido.");
		if (loginData.contrasena.length < 6) return setLoginError("La contraseña debe tener al menos 6 caracteres.");

		const encontrado = usuariosRegistrados.find(
			(u) => u.email === loginData.email && u.contrasena === loginData.contrasena
		);

		if (!encontrado) return setLoginError("Email o contraseña incorrectos.");
		if (loginData.recordarme) localStorage.setItem("usuarioLogueado", loginData.email);
		setLoginOk(`✓ ¡Bienvenido ${encontrado.nombre}!`);
		setTimeout(() => {
			setLoginOpen(false);
			setLoginOk("");
		}, 1200);
	};

	const handleContacto = (e) => {
		e.preventDefault();
		const data = new FormData(e.target);
		const nombre = String(data.get("nombre") || "").trim();
		const correo = String(data.get("correo") || "").trim();
		const mensaje = String(data.get("mensaje") || "").trim();

		if (nombre.length < 2 || !validarEmail(correo) || mensaje.length < 10) {
			setContactResult("Revisa los datos: nombre, correo y mensaje (mínimo 10 caracteres).");
			return;
		}

		setContactResult(`✓ Gracias por contactarnos, ${nombre}. Tu mensaje ha sido recibido.`);
		e.target.reset();
	};

	return (
		<>
			<header className="navbar">
				<div className="navbar-container">
					<a href="#" className="logo">
						<img src="img/leotour-logo.png" alt="Logo LEOTOUR" width="42" />
						<span className="brand">LEOTOUR</span>
					</a>

					<nav className={`nav-menu ${menuOpen ? "active" : ""}`}>
						{["servicios", "cotizar", "destinos", "mapa", "vuelos-section", "contacto"].map((id) => (
							<a key={id} href={`#${id}`} className="nav-link" onClick={() => setMenuOpen(false)}>{id.replace("-section", "").replace("-", " ")}</a>
						))}
					</nav>

					<div className="nav-actions">
						<div className="currency-selector">
							{["USD", "CLP", "BRL"].map((m) => (
								<button key={m} className={`currency-btn ${monedaActual === m ? "active" : ""}`} onClick={() => setMonedaActual(m)}>{m}</button>
							))}
						</div>
						<button className="auth-btn login-btn" onClick={() => setLoginOpen(true)}>Iniciar Sesión</button>
						<button className="auth-btn registro-btn" onClick={() => setRegistroOpen(true)}>Registrarse</button>
					</div>

					<button className={`hamburger ${menuOpen ? "active" : ""}`} onClick={() => setMenuOpen((v) => !v)} aria-label="Menú">
						<span></span><span></span><span></span>
					</button>
				</div>
			</header>

			<main>
				<section className="hero">
					<div className="hero-decoration"></div>
					<div className="hero-content">
						<span className="hero-badge"><i className="fas fa-shield-halved"></i> Transporte certificado SCL</span>
						<h1 className="hero-title">Viaja con <span className="hero-title-accent">LEOTOUR</span></h1>
						<p className="hero-subtitle">Transporte profesional desde y hacia el Aeropuerto de Santiago. Confiable, seguro y siempre a tiempo.</p>
						<div className="hero-ctas">
							<a href="#cotizar" className="cta-btn primary"><i className="fas fa-check-circle"></i> Reservar ahora</a>
							<a href="#servicios" className="cta-btn secondary"><i className="fas fa-info-circle"></i> Conocer servicios</a>
						</div>
					</div>
					<div className="hero-visual"><img className="hero-img" src="img/leotour-van.png" alt="Van LEOTOUR" /></div>
				</section>

				<section className="carousel-section">
					<div className="section-heading">
						<span className="section-eyebrow">Inspírate</span>
						<h2>Destinos populares</h2>
					</div>
					<div className="carousel-container" onMouseEnter={() => {}}>
						<div className="carousel-track" style={{ transform: `translateX(${-slide * 100}%)` }}>
							{destinos.map((d) => (
								<div key={d.nombre} className="carousel-item" style={{ backgroundImage: `url('${d.imagen}')` }}>
									<div className="carousel-overlay"><h3>{d.nombre}</h3><p>{d.descripcion}</p></div>
								</div>
							))}
						</div>
						<button className="carousel-btn carousel-prev" onClick={() => setSlide((s) => (s - 1 + destinos.length) % destinos.length)}><i className="fas fa-chevron-left"></i></button>
						<button className="carousel-btn carousel-next" onClick={() => setSlide((s) => (s + 1) % destinos.length)}><i className="fas fa-chevron-right"></i></button>
						<div className="carousel-indicators">
							{destinos.map((_, i) => <span key={i} className={`carousel-dot ${slide === i ? "active" : ""}`} onClick={() => setSlide(i)}></span>)}
						</div>
					</div>
				</section>

				<section className="servicios" id="servicios">
					<div className="section-heading">
						<span className="section-eyebrow">Nuestra flota</span>
						<h2>Servicios a tu medida</h2>
					</div>
					<div className="container">
						<div className="row g-4 justify-content-center">
							{servicios.map((s) => (
								<div key={s.id} className="col-md-4">
									<div className="servicio-card h-100">
										<div className={`servicio-icon ${s.clase}`}><i className={`fas ${s.icon} fa-2x`}></i></div>
										<h3>{s.nombre}</h3>
										<p className="servicio-desc">{s.desc}</p>
										<a href="#cotizar" className="servicio-link">Cotizar <i className="fas fa-arrow-right"></i></a>
									</div>
								</div>
							))}
						</div>
					</div>
				</section>

				<section className="cotizador" id="cotizar">
					<div className="section-heading">
						<span className="section-eyebrow">Reserva fácil</span>
						<h2>Cotiza tu traslado</h2>
					</div>
					<form className="form-container" onSubmit={handleCotizar}>
						<div className="form-group">
							<label><i className="fas fa-map-marker-alt"></i> Comuna destino</label>
							<select value={cotizador.comuna} onChange={(e) => setCotizador({ ...cotizador, comuna: e.target.value })}>
								<option value="">-- Seleccionar comuna --</option>
								{comunas.map((c) => <option key={c} value={c}>{c}</option>)}
							</select>
						</div>
						<div className="form-group">
							<label><i className="fas fa-car-side"></i> Tipo de vehículo</label>
							<select value={cotizador.servicio} onChange={(e) => setCotizador({ ...cotizador, servicio: e.target.value })}>
								{servicios.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
							</select>
						</div>
						<div className="form-row">
							<div className="form-group">
								<label><i className="fas fa-users"></i> Pasajeros</label>
								<input type="number" min="1" max="10" value={cotizador.pasajeros} onChange={(e) => setCotizador({ ...cotizador, pasajeros: e.target.value })} />
							</div>
							<div className="form-group">
								<label><i className="fas fa-calendar-alt"></i> Fecha y hora</label>
								<input type="datetime-local" value={cotizador.fecha} onChange={(e) => setCotizador({ ...cotizador, fecha: e.target.value })} />
							</div>
						</div>
						<button type="submit" className="cta-btn primary"><i className="fas fa-calculator"></i> Cotizar traslado</button>
					</form>
					{cotizacion && <div className="result"><div className="alert alert-success mt-3">{cotizacion}</div></div>}
				</section>

				<section className="destinos-section" id="destinos">
					<div className="section-heading">
						<span className="section-eyebrow">Tours</span>
						<h2>Destinos turísticos Chile</h2>
					</div>
					<div className="destinos-grid">
						{destinos.map((d) => (
							<div key={d.nombre} className="destino-card">
								<div className="destino-img" style={{ backgroundImage: `url('${d.imagen}')` }}><span className="destino-label">{d.nombre}</span></div>
								<div className="destino-info">
									<h3>{d.nombre}</h3>
									<p>{d.descripcion}</p>
									<div className="destino-price">
										<span className="price">{formatearPrecio(d.precio)}</span>
										<span className="distance"><i className="fas fa-route"></i> {d.distancia} km</span>
									</div>
									<button className="destino-btn" onClick={() => setDestinoResultado(`✓ Cotización para ${d.nombre}: ${formatearPrecio(d.precio)}`)}>Cotizar</button>
								</div>
							</div>
						))}
					</div>
					{destinoResultado && <div className="result mt-4"><div className="alert alert-success">{destinoResultado}</div></div>}
				</section>

				<section className="mapa" id="mapa">
					<div className="section-heading"><span className="section-eyebrow">Cobertura</span><h2>Mapa de rutas</h2></div>
					<div id="map" className="map"></div>
				</section>

				<section className="vuelos-panel" id="vuelos-section">
					<div className="vuelos-header">
						<h2><i className="fas fa-plane"></i> Vuelos en tiempo real — Aeropuerto SCL</h2>
					</div>
					<div className="vuelos-container">
						<div className="vuelos-display">
							<div className="vuelos-header-row">
								<div className="vuelos-col-hora">HORA</div><div className="vuelos-col-destino">DESTINO</div><div className="vuelos-col-info">INFORMACIÓN</div><div className="vuelos-col-estado">ESTADO</div>
							</div>
							<div className="vuelos-board">
								{vuelosEjemplo.map((v, i) => {
									const clase = v.estado === "Retrasado" ? "retrasado" : v.estado === "Abordando" ? "abordando" : "en-tiempo";
									return <div key={i} className="vuelo-item"><div className="vuelo-hora">{v.hora}</div><div className="vuelo-destino">{v.destino}</div><div>{v.origen} → Gate {v.gate}</div><div className={`vuelo-estado ${clase}`}>{v.estado}</div></div>;
								})}
							</div>
						</div>
					</div>
				</section>

				<section className="contacto" id="contacto">
					<div className="section-heading"><span className="section-eyebrow">Estamos para ti</span><h2>Contáctanos</h2></div>
					<div className="contacto-wrapper">
						<form className="contact-form" onSubmit={handleContacto}>
							<div className="form-group"><label>Nombre completo</label><input type="text" name="nombre" required /></div>
							<div className="form-group"><label>Correo electrónico</label><input type="email" name="correo" required /></div>
							<div className="form-group"><label>Mensaje</label><textarea name="mensaje" required></textarea></div>
							<button type="submit" className="cta-btn primary">Enviar mensaje</button>
							{contactResult && <div className="alert alert-success mt-3">{contactResult}</div>}
						</form>
						<div className="contact-info">
							<h3>Información de contacto</h3>
							<p><i className="fas fa-envelope"></i> contacto@leotour.cl</p>
							<p><i className="fas fa-phone"></i> +56 9 1234 5678</p>
							<p><i className="fas fa-location-dot"></i> Aeropuerto SCL, Santiago</p>
						</div>
					</div>
				</section>
			</main>

			<footer className="footer">
				<div className="footer-container">
					<div className="footer-brand">
						<img src="img/leotour-logo.png" alt="LEOTOUR" width="50" />
						<div><strong>LEOTOUR</strong><span>Transporte Premium SCL</span></div>
					</div>
					<div className="footer-links">
						<a href="#servicios">Servicios</a><a href="#destinos">Destinos</a><a href="#cotizar">Cotizar</a><a href="#contacto">Contacto</a>
					</div>
					<p className="footer-copy">© 2026 LEOTOUR — Todos los derechos reservados</p>
				</div>
			</footer>

			<a href="https://wa.me/56912345678?text=Hola%20LEOTOUR,%20me%20gustaría%20conocer%20más%20sobre%20tus%20servicios" className="whatsapp-btn" target="_blank" rel="noreferrer" title="Contactar por WhatsApp">
				<i className="fab fa-whatsapp"></i>
			</a>

			<div className={`modal-overlay ${loginOpen ? "active" : ""}`} onClick={() => setLoginOpen(false)}>
				<div className="modal-container" onClick={(e) => e.stopPropagation()}>
					<button className="modal-close" onClick={() => setLoginOpen(false)}>&times;</button>
					<h2 className="modal-title">Iniciar Sesión</h2>
					<form className="modal-form" onSubmit={handleLogin}>
						<div className="form-group"><label>Email:</label><input type="email" value={loginData.email} onChange={(e) => setLoginData({ ...loginData, email: e.target.value })} required /></div>
						<div className="form-group"><label>Contraseña:</label><input type="password" value={loginData.contrasena} onChange={(e) => setLoginData({ ...loginData, contrasena: e.target.value })} required /></div>
						<div className="form-group checkbox"><input type="checkbox" checked={loginData.recordarme} onChange={(e) => setLoginData({ ...loginData, recordarme: e.target.checked })} /><label>Recuérdame</label></div>
						<button type="submit" className="cta-btn primary modal-submit">Iniciar Sesión</button>
						{loginError && <div className="alert alert-danger mt-2">{loginError}</div>}
						{loginOk && <div className="alert alert-success mt-2">{loginOk}</div>}
					</form>
					<div className="modal-footer"><p>¿No tienes cuenta? <button className="link-btn" onClick={() => { setLoginOpen(false); setRegistroOpen(true); }}>Regístrate aquí</button></p></div>
				</div>
			</div>

			<div className={`modal-overlay ${registroOpen ? "active" : ""}`} onClick={() => setRegistroOpen(false)}>
				<div className="modal-container" onClick={(e) => e.stopPropagation()}>
					<button className="modal-close" onClick={() => setRegistroOpen(false)}>&times;</button>
					<h2 className="modal-title">Crear Cuenta</h2>
					<form className="modal-form" onSubmit={handleRegistro}>
						<div className="form-group"><label>Nombre completo:</label><input type="text" value={registroData.nombre} onChange={(e) => setRegistroData({ ...registroData, nombre: e.target.value })} required /></div>
						<div className="form-group"><label>Email:</label><input type="email" value={registroData.email} onChange={(e) => setRegistroData({ ...registroData, email: e.target.value })} required /></div>
						<div className="form-group"><label>Teléfono:</label><input type="tel" value={registroData.telefono} onChange={(e) => setRegistroData({ ...registroData, telefono: e.target.value })} required /></div>
						<div className="form-group"><label>Contraseña:</label><input type="password" value={registroData.contrasena} onChange={(e) => setRegistroData({ ...registroData, contrasena: e.target.value })} required /></div>
						<button type="submit" className="cta-btn primary modal-submit">Crear Cuenta</button>
						{registroError && <div className="alert alert-danger mt-2">{registroError}</div>}
						{registroOk && <div className="alert alert-success mt-2">{registroOk}</div>}
					</form>
					<div className="modal-footer"><p>¿Ya tienes cuenta? <button className="link-btn" onClick={() => { setRegistroOpen(false); setLoginOpen(true); }}>Inicia sesión aquí</button></p></div>
				</div>
			</div>
		</>
	);
}

createRoot(document.getElementById("root")).render(<App />);
