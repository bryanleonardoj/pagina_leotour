/**
 * Componente: IniciarSesion
 * Rol: Modal con formulario de login controlado. Valida credenciales contra
 *      el arreglo de inscritos que gestiona el componente padre (App).
 * Props:
 *   - isOpen (bool): controla visibilidad del modal
 *   - onCerrar (fn): cierra el modal desde el padre
 *   - onLogin (fn): handler del padre que recibe (email, contrasena, recordarme)
 *                   y devuelve { exito: bool, mensaje: string }
 *   - onIrARegistro (fn): abre el modal de CrearCuenta desde el padre
 * Estado propio:
 *   - datos (useState): objeto { email, contrasena, recordarme }
 *   - error / exito (useState): mensajes de validación
 * Seguridad: sanitizarTexto() aplicada al email antes de pasarlo al padre.
 */
import { useState } from "react";

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Prevención XSS: elimina caracteres que podrían interpretarse como HTML
const sanitizarTexto = (texto) =>
  String(texto).replace(/[<>&"'`]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#x27;", "`": "&#x60;" }[c])
  );

function IniciarSesion({ isOpen, onCerrar, onLogin, onIrARegistro }) {
  const [datos, setDatos] = useState({ email: "", contrasena: "", recordarme: false });
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const handleCambioDato = (e) => {
    const { name, value, type, checked } = e.target;
    setDatos((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleValidacion = (e) => {
    e.preventDefault();
    setError("");
    setExito("");

    if (!validarEmail(datos.email)) return setError("El email debe ser válido.");
    if (datos.contrasena.length < 6) return setError("La contraseña debe tener al menos 6 caracteres.");

    const resultado = onLogin(sanitizarTexto(datos.email), datos.contrasena, datos.recordarme);
    if (resultado.exito) {
      setExito(resultado.mensaje);
      setTimeout(() => {
        onCerrar();
        setExito("");
        setDatos({ email: "", contrasena: "", recordarme: false });
      }, 1200);
    } else {
      setError(resultado.mensaje);
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? "active" : ""}`} onClick={onCerrar}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCerrar}>&times;</button>
        <h2 className="modal-title">Iniciar Sesión</h2>
        <form className="modal-form" onSubmit={handleValidacion}>
          <div className="form-group">
            <label htmlFor="login-email">Email:</label>
            <input
              id="login-email"
              type="email"
              name="email"
              value={datos.email}
              onChange={handleCambioDato}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="login-contrasena">Contraseña:</label>
            <input
              id="login-contrasena"
              type="password"
              name="contrasena"
              value={datos.contrasena}
              onChange={handleCambioDato}
              required
            />
          </div>
          <div className="form-group checkbox">
            <input
              id="login-recordarme"
              type="checkbox"
              name="recordarme"
              checked={datos.recordarme}
              onChange={handleCambioDato}
            />
            <label htmlFor="login-recordarme">Recuérdame</label>
          </div>
          <button type="submit" className="cta-btn primary modal-submit">Iniciar Sesión</button>
          {error && <div className="alert alert-danger mt-2">{error}</div>}
          {exito && <div className="alert alert-success mt-2">{exito}</div>}
        </form>
        <div className="modal-footer">
          <p>
            ¿No tienes cuenta?{" "}
            <button
              className="link-btn"
              onClick={() => { onCerrar(); onIrARegistro(); }}
            >
              Regístrate aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default IniciarSesion;
