import { useState } from "react";

const validarEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

// Prevención XSS: elimina caracteres que podrían interpretarse como HTML
const sanitizarTexto = (texto) =>
  String(texto).replace(/[<>&"'`]/g, (c) =>
    ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", '"': "&quot;", "'": "&#x27;", "`": "&#x60;" }[c])
  );

function CrearCuenta({ isOpen, onCerrar, onRegistro, onIrALogin }) {
  const [datos, setDatos] = useState({ nombre: "", email: "", telefono: "", contrasena: "" });
  const [error, setError] = useState("");
  const [exito, setExito] = useState("");

  const handleCambioDato = (e) => {
    const { name, value } = e.target;
    setDatos((prev) => ({ ...prev, [name]: value }));
  };

  const handleValidacion = (e) => {
    e.preventDefault();
    setError("");
    setExito("");

    if (sanitizarTexto(datos.nombre).trim().length < 2)
      return setError("El nombre debe tener al menos 2 caracteres.");
    if (!validarEmail(datos.email))
      return setError("El email debe ser válido.");
    if (datos.telefono.replace(/\D/g, "").length < 7)
      return setError("El teléfono debe ser válido.");
    if (datos.contrasena.length < 6)
      return setError("La contraseña debe tener al menos 6 caracteres.");

    const resultado = onRegistro({
      nombre: sanitizarTexto(datos.nombre.trim()),
      email: sanitizarTexto(datos.email.trim()),
      telefono: datos.telefono.replace(/\D/g, ""),
      contrasena: datos.contrasena,
    });

    if (resultado.exito) {
      setExito(resultado.mensaje);
      setDatos({ nombre: "", email: "", telefono: "", contrasena: "" });
      setTimeout(() => {
        onCerrar();
        onIrALogin();
        setExito("");
      }, 1200);
    } else {
      setError(resultado.mensaje);
    }
  };

  return (
    <div className={`modal-overlay ${isOpen ? "active" : ""}`} onClick={onCerrar}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onCerrar}>&times;</button>
        <h2 className="modal-title">Crear Cuenta</h2>
        <form className="modal-form" onSubmit={handleValidacion}>
          <div className="form-group">
            <label htmlFor="registro-nombre">Nombre completo:</label>
            <input
              id="registro-nombre"
              type="text"
              name="nombre"
              value={datos.nombre}
              onChange={handleCambioDato}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="registro-email">Email:</label>
            <input
              id="registro-email"
              type="email"
              name="email"
              value={datos.email}
              onChange={handleCambioDato}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="registro-telefono">Teléfono:</label>
            <input
              id="registro-telefono"
              type="tel"
              name="telefono"
              value={datos.telefono}
              onChange={handleCambioDato}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="registro-contrasena">Contraseña:</label>
            <input
              id="registro-contrasena"
              type="password"
              name="contrasena"
              value={datos.contrasena}
              onChange={handleCambioDato}
              required
            />
          </div>
          <button type="submit" className="cta-btn primary modal-submit">Crear Cuenta</button>
          {error && <div className="alert alert-danger mt-2">{error}</div>}
          {exito && <div className="alert alert-success mt-2">{exito}</div>}
        </form>
        <div className="modal-footer">
          <p>
            ¿Ya tienes cuenta?{" "}
            <button
              className="link-btn"
              onClick={() => { onCerrar(); onIrALogin(); }}
            >
              Inicia sesión aquí
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CrearCuenta;
