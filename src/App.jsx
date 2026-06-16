import { useEffect, useMemo, useState } from "react";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import CarruselImagenes from "./component/CarruselImagenes";
import IniciarSesion from "./component/IniciarSesion";
import CrearCuenta from "./component/CrearCuenta";
import Contacto from "./component/Contacto";

const tasasCambio = { USD: 1, CLP: 850, BRL: 5.1 };

const servicios = [
  { id: "privado", nombre: "Sedán Privado", desc: "Comodidad para 1-3 pasajeros", clase: "sedan-icon", icon: "fa-car" },
  { id: "ejecutivo", nombre: "SUV Ejecutivo", desc: "Experiencia premium", clase: "suv-icon", icon: "fa-car-side" },
  { id: "van", nombre: "Van (6 personas)", desc: "Ideal para grupos", clase: "van-icon", icon: "fa-shuttle-van" }
];

const destinos = [
  { nombre: "Cartagena", descripcion: "Puerto histórico con playas y vistas al mar", imagen: "/img/cartagena.jpg", precio: 45000, distancia: 45 },
  { nombre: "Valparaíso", descripcion: "Ciudad vibrante con cerros coloridos y arte", imagen: "/img/valparaiso.jpg", precio: 35000, distancia: 120 },
  { nombre: "San Antonio", descripcion: "Puerto pesquero con playas tranquilas", imagen: "/img/san-antonio.jpg", precio: 55000, distancia: 100 },
  { nombre: "Pomaire", descripcion: "Pueblo típico con cerámica artesanal", imagen: "/img/pomaire.jpg", precio: 65000, distancia: 60 },
  { nombre: "Cajón del Maipo", descripcion: "Montañas, ríos y naturaleza pura", imagen: "/img/cajon-maipo.jpg", precio: 50000, distancia: 50 },
  { nombre: "Pirque (Viñas)", descripcion: "Degustación de vinos y paisajes agrícolas", imagen: "/img/pirque.jpg", precio: 40000, distancia: 35 }
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
  const [usuarioActual, setUsuarioActual] = useState(null);
  const [cotizador, setCotizador] = useState({ comuna: "", servicio: "privado", pasajeros: 1, fecha: "" });
  const [cotizacion, setCotizacion] = useState("");
  const [destinoResultado, setDestinoResultado] = useState("");

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

  // Recibe datos del componente CrearCuenta y actualiza el arreglo de inscritos
  const handleRegistro = (datos) => {
    if (usuariosRegistrados.some((u) => u.email === datos.email)) {
      return { exito: false, mensaje: "El email ya está registrado." };
    }
    setUsuariosRegistrados((prev) => [...prev, { ...datos }]);
    return { exito: true, mensaje: "✓ ¡Registro exitoso! Ahora puedes iniciar sesión." };
  };

  // Recibe credenciales del componente IniciarSesion y valida contra el arreglo de inscritos
  const handleLogin = (email, contrasena, recordarme) => {
    const encontrado = usuariosRegistrados.find(
      (u) => u.email === email && u.contrasena === contrasena
    );
    if (!encontrado) return { exito: false, mensaje: "Email o contraseña incorrectos." };
    if (recordarme) localStorage.setItem("usuarioLogueado", email);
    setUsuarioActual(encontrado);
    return { exito: true, mensaje: `✓ ¡Bienvenido ${encontrado.nombre}!` };
  };

  return (
    <>
      <header className="navbar">
        <div className="navbar-container">
          <a href="#" className="logo">
            <img src="/img/leotour-logo.png" alt="Logo LEOTOUR" width="42" />
            <span className="brand">LEOTOUR</span>
          </a>

          <nav className={`nav-menu ${menuOpen ? "active" : ""}`}>
            {["servicios", "cotizar", "destinos", "mapa", "vuelos-section", "contacto"].map((id) => (
              <a key={id} href={`#${id}`} className="nav-link" onClick={() => setMenuOpen(false)}>
                {id.replace("-section", "").replace("-", " ")}
              </a>
            ))}
          </nav>

          <div className="nav-actions">
            <div className="currency-selector">
              {["USD", "CLP", "BRL"].map((m) => (
                <button key={m} className={`currency-btn ${monedaActual === m ? "active" : ""}`} onClick={() => setMonedaActual(m)}>{m}</button>
              ))}
            </div>
            {usuarioActual ? (
              <div className="user-profile">
                <div className="user-avatar">{usuarioActual.nombre.charAt(0).toUpperCase()}</div>
                <span className="user-name">{usuarioActual.nombre.split(" ")[0]}</span>
                <button
                  className="auth-btn login-btn"
                  onClick={() => { setUsuarioActual(null); localStorage.removeItem("usuarioLogueado"); }}
                >
                  Salir
                </button>
              </div>
            ) : (
              <>
                <button className="auth-btn login-btn" onClick={() => setLoginOpen(true)}>Iniciar Sesión</button>
                <button className="auth-btn registro-btn" onClick={() => setRegistroOpen(true)}>Registrarse</button>
              </>
            )}
          </div>

          <button
            className={`hamburger ${menuOpen ? "active" : ""}`}
            onClick={() => setMenuOpen((v) => !v)}
            aria-label="Menú"
          >
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
          <div className="hero-visual">
            <img className="hero-img" src="/img/leotour-van.png" alt="Van LEOTOUR" />
          </div>
        </section>

        {/* Componente Carrusel: gestiona su propio estado de slide con useState */}
        <CarruselImagenes imagenes={destinos} />

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
              <label htmlFor="cotizador-comuna"><i className="fas fa-map-marker-alt"></i> Comuna destino</label>
              <select
                id="cotizador-comuna"
                value={cotizador.comuna}
                onChange={(e) => setCotizador({ ...cotizador, comuna: e.target.value })}
              >
                <option value="">-- Seleccionar comuna --</option>
                {comunas.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="cotizador-servicio"><i className="fas fa-car-side"></i> Tipo de vehículo</label>
              <select
                id="cotizador-servicio"
                value={cotizador.servicio}
                onChange={(e) => setCotizador({ ...cotizador, servicio: e.target.value })}
              >
                {servicios.map((s) => <option key={s.id} value={s.id}>{s.nombre}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="cotizador-pasajeros"><i className="fas fa-users"></i> Pasajeros</label>
                <input
                  id="cotizador-pasajeros"
                  type="number"
                  min="1"
                  max="10"
                  value={cotizador.pasajeros}
                  onChange={(e) => setCotizador({ ...cotizador, pasajeros: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label htmlFor="cotizador-fecha"><i className="fas fa-calendar-alt"></i> Fecha y hora</label>
                <input
                  id="cotizador-fecha"
                  type="datetime-local"
                  value={cotizador.fecha}
                  onChange={(e) => setCotizador({ ...cotizador, fecha: e.target.value })}
                />
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
                <div className="destino-img" style={{ backgroundImage: `url('${d.imagen}')` }}>
                  <span className="destino-label">{d.nombre}</span>
                </div>
                <div className="destino-info">
                  <h3>{d.nombre}</h3>
                  <p>{d.descripcion}</p>
                  <div className="destino-price">
                    <span className="price">{formatearPrecio(d.precio)}</span>
                    <span className="distance"><i className="fas fa-route"></i> {d.distancia} km</span>
                  </div>
                  <button
                    className="destino-btn"
                    onClick={() => setDestinoResultado(`✓ Cotización para ${d.nombre}: ${formatearPrecio(d.precio)}`)}
                  >
                    Cotizar
                  </button>
                </div>
              </div>
            ))}
          </div>
          {destinoResultado && <div className="result mt-4"><div className="alert alert-success">{destinoResultado}</div></div>}
        </section>

        <section className="mapa" id="mapa">
          <div className="section-heading">
            <span className="section-eyebrow">Cobertura</span>
            <h2>Mapa de rutas</h2>
          </div>
          <div id="map" className="map"></div>
        </section>

        <section className="vuelos-panel" id="vuelos-section">
          <div className="vuelos-header">
            <h2><i className="fas fa-plane"></i> Vuelos en tiempo real — Aeropuerto SCL</h2>
          </div>
          <div className="vuelos-container">
            <div className="vuelos-display">
              <div className="vuelos-header-row">
                <div className="vuelos-col-hora">HORA</div>
                <div className="vuelos-col-destino">DESTINO</div>
                <div className="vuelos-col-info">INFORMACIÓN</div>
                <div className="vuelos-col-estado">ESTADO</div>
              </div>
              <div className="vuelos-board">
                {vuelosEjemplo.map((v, i) => {
                  const clase = v.estado === "Retrasado" ? "retrasado" : v.estado === "Abordando" ? "abordando" : "en-tiempo";
                  return (
                    <div key={i} className="vuelo-item">
                      <div className="vuelo-hora">{v.hora}</div>
                      <div className="vuelo-destino">{v.destino}</div>
                      <div>{v.origen} → Gate {v.gate}</div>
                      <div className={`vuelo-estado ${clase}`}>{v.estado}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Componente Contacto: formulario controlado con validación y sanitización */}
        <Contacto />
      </main>

      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <img src="/img/leotour-logo.png" alt="LEOTOUR" width="50" />
            <div><strong>LEOTOUR</strong><span>Transporte Premium SCL</span></div>
          </div>
          <div className="footer-links">
            <a href="#servicios">Servicios</a>
            <a href="#destinos">Destinos</a>
            <a href="#cotizar">Cotizar</a>
            <a href="#contacto">Contacto</a>
          </div>
          <div className="footer-info">
            <p><strong>Alumno:</strong> Bryan Jiménez</p>
            <p><strong>Profesor:</strong> Victor Vásquez</p>
            <p><strong>Sección:</strong> FB50-N3-P13-C1/D</p>
          </div>
          <p className="footer-copy">© 2026 LEOTOUR — Todos los derechos reservados</p>
        </div>
      </footer>

      <a
        href="https://wa.me/56912345678?text=Hola%20LEOTOUR,%20me%20gustaría%20conocer%20más%20sobre%20tus%20servicios"
        className="whatsapp-btn"
        target="_blank"
        rel="noreferrer"
        title="Contactar por WhatsApp"
      >
        <i className="fab fa-whatsapp"></i>
      </a>

      {/* Componente IniciarSesion: formulario controlado con validación por estado */}
      <IniciarSesion
        isOpen={loginOpen}
        onCerrar={() => setLoginOpen(false)}
        onLogin={handleLogin}
        onIrARegistro={() => setRegistroOpen(true)}
      />

      {/* Componente CrearCuenta: formulario controlado que actualiza arreglo de inscritos */}
      <CrearCuenta
        isOpen={registroOpen}
        onCerrar={() => setRegistroOpen(false)}
        onRegistro={handleRegistro}
        onIrALogin={() => setLoginOpen(true)}
      />
    </>
  );
}

export default App;
