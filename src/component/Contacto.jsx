/**
 * Componente: Contacto
 * Rol: Formulario de contacto controlado (Nombre, Email, Mensaje).
 * Props: ninguna — es autónomo, gestiona su propio estado.
 * Estado propio:
 *   - datos (useState): objeto { nombre, correo, mensaje }
 *   - resultado (useState): mensaje de éxito o error para mostrar al usuario
 *   - esError (useState): booleano que diferencia el tipo de alerta
 * Seguridad: sanitizarTexto() escapa caracteres HTML antes de procesar el input.
 * Funciones clave:
 *   - handleCambioDato(e): actualiza el estado por nombre de campo
 *   - handleValidacion(e): valida y sanitiza antes de "enviar"
 */
import { useState } from "react";

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Prevención XSS: elimina caracteres que podrían interpretarse como HTML
const sanitizarTexto = (texto) =>
  String(texto).replace(/[<>&"'`]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#x27;", "`": "&#x60;" }[c])
  );

function Contacto() {
  const [datos, setDatos] = useState({ nombre: "", correo: "", mensaje: "" });
  const [resultado, setResultado] = useState("");
  const [esError, setEsError] = useState(false);

  const handleCambioDato = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  const handleValidacion = (e) => {
    e.preventDefault();
    const nombre = sanitizarTexto(datos.nombre.trim());
    const correo = sanitizarTexto(datos.correo.trim());
    const mensaje = sanitizarTexto(datos.mensaje.trim());

    if (nombre.length < 2 || !validarEmail(correo) || mensaje.length < 10) {
      setEsError(true);
      setResultado("Revisa los datos: nombre, correo y mensaje (mínimo 10 caracteres).");
      return;
    }

    setEsError(false);
    setResultado(`✓ Gracias por contactarnos, ${nombre}. Tu mensaje ha sido recibido.`);
    setDatos({ nombre: "", correo: "", mensaje: "" });
  };

  return (
    <section className="contacto" id="contacto">
      <div className="section-heading">
        <span className="section-eyebrow">Estamos para ti</span>
        <h2>Contáctanos</h2>
      </div>
      <div className="contacto-wrapper">
        <form className="contact-form" onSubmit={handleValidacion}>
          <div className="form-group">
            <label htmlFor="contacto-nombre">Nombre completo</label>
            <input
              id="contacto-nombre"
              type="text"
              name="nombre"
              value={datos.nombre}
              onChange={handleCambioDato}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contacto-correo">Correo electrónico</label>
            <input
              id="contacto-correo"
              type="email"
              name="correo"
              value={datos.correo}
              onChange={handleCambioDato}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="contacto-mensaje">Mensaje</label>
            <textarea
              id="contacto-mensaje"
              name="mensaje"
              value={datos.mensaje}
              onChange={handleCambioDato}
              required
            ></textarea>
          </div>
          <button type="submit" className="cta-btn primary">Enviar mensaje</button>
          {resultado && (
            <div className={`alert ${esError ? "alert-danger" : "alert-success"} mt-3`}>
              {resultado}
            </div>
          )}
        </form>
        <div className="contact-info">
          <h3>Información de contacto</h3>
          <p><i className="fas fa-envelope"></i> contacto@leotour.cl</p>
          <p><i className="fas fa-phone"></i> +56 9 1234 5678</p>
          <p><i className="fas fa-location-dot"></i> Aeropuerto SCL, Santiago</p>
        </div>
      </div>
    </section>
  );
}

export default Contacto;
