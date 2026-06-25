import { useState } from "react";

const VACIO = { nombre: "", email: "", telefono: "", contrasena: "", rol: "usuario" };

export default function TabUsuarios({ usuarios, onAgregar, onEditar, onEliminar }) {
  const [modo,    setModo]    = useState("lista");
  const [editId,  setEditId]  = useState(null);
  const [form,    setForm]    = useState(VACIO);
  const [confirm, setConfirm] = useState(null);
  const [error,   setError]   = useState("");

  const abrirCrear = () => { setForm(VACIO); setError(""); setModo("crear"); };

  const abrirEditar = (u) => {
    setForm({
      nombre:     u.nombre,
      email:      u.email,
      telefono:   u.telefono || "",
      contrasena: "",
      rol:        u.rol || "usuario"
    });
    setEditId(u.id);
    setError("");
    setModo("editar");
  };

  const cerrar = () => { setModo("lista"); setEditId(null); setError(""); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (modo === "crear") {
      if (usuarios.some(u => u.email === form.email)) {
        setError("Ya existe un usuario con este email.");
        return;
      }
      onAgregar({ ...form });
    } else {
      const datos = { ...form };
      // Si no se ingresó nueva contraseña, conservar la existente
      if (!datos.contrasena) {
        datos.contrasena = usuarios.find(u => u.id === editId)?.contrasena || "";
      }
      onEditar(editId, datos);
    }
    cerrar();
  };

  if (modo !== "lista") {
    return (
      <div className="admin-tab">
        <div className="admin-tab-header">
          <button className="admin-back-btn" onClick={cerrar}>
            <i className="fas fa-arrow-left"></i> Volver
          </button>
          <h2 className="admin-tab-title">
            <i className={`fas ${modo === "crear" ? "fa-user-plus" : "fa-user-pen"}`}></i>
            {modo === "crear" ? "Crear usuario" : "Editar usuario"}
          </h2>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="admin-form-group">
            <label>Nombre completo *</label>
            <input
              type="text"
              required
              minLength={2}
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label>Email *</label>
            <input
              type="email"
              required
              value={form.email}
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label>Teléfono</label>
            <input
              type="tel"
              value={form.telefono}
              onChange={e => setForm({ ...form, telefono: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label>
              {modo === "crear"
                ? "Contraseña *"
                : "Nueva contraseña (dejar vacío para no cambiar)"}
            </label>
            <input
              type="password"
              required={modo === "crear"}
              minLength={modo === "crear" ? 6 : 0}
              value={form.contrasena}
              onChange={e => setForm({ ...form, contrasena: e.target.value })}
            />
          </div>

          <div className="admin-form-group">
            <label>Rol</label>
            <select
              value={form.rol}
              onChange={e => setForm({ ...form, rol: e.target.value })}
            >
              <option value="usuario">Usuario</option>
              <option value="admin">Administrador</option>
            </select>
            {form.rol === "admin" && (
              <small className="admin-form-hint">
                <i className="fas fa-triangle-exclamation"></i> Este usuario podrá acceder al panel de administración.
              </small>
            )}
          </div>

          {error && <p className="admin-form-error"><i className="fas fa-circle-exclamation"></i> {error}</p>}

          <div className="admin-form-actions">
            <button type="button" className="admin-btn secondary" onClick={cerrar}>Cancelar</button>
            <button type="submit" className="admin-btn primary">
              <i className={`fas ${modo === "crear" ? "fa-user-plus" : "fa-check"}`}></i>
              {modo === "crear" ? " Crear usuario" : " Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-tab">
      <div className="admin-tab-header">
        <h2 className="admin-tab-title"><i className="fas fa-users"></i> Usuarios</h2>
        <button className="admin-btn primary" onClick={abrirCrear}>
          <i className="fas fa-user-plus"></i> Crear usuario
        </button>
      </div>

      <p className="admin-count">
        <strong>{usuarios.length}</strong> usuario(s) registrado(s)
      </p>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Email</th>
              <th>Teléfono</th>
              <th>Rol</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {usuarios.map(u => (
              <tr key={u.id || u.email}>
                <td>
                  <div className="usuario-nombre-cell">
                    <div className="usuario-avatar-sm">
                      <i className={`fas ${u.rol === "admin" ? "fa-shield-halved" : "fa-user"}`}></i>
                    </div>
                    <strong>{u.nombre}</strong>
                  </div>
                </td>
                <td>{u.email}</td>
                <td>{u.telefono || <span style={{ color: "var(--c-muted)" }}>—</span>}</td>
                <td>
                  <span className={`rol-badge rol-${u.rol || "usuario"}`}>
                    <i className={`fas ${u.rol === "admin" ? "fa-shield-halved" : "fa-circle-user"}`}></i>
                    {u.rol === "admin" ? " Administrador" : " Usuario"}
                  </span>
                </td>
                <td className="admin-actions">
                  <button
                    className="admin-btn-sm edit"
                    title="Editar usuario"
                    onClick={() => abrirEditar(u)}
                  >
                    <i className="fas fa-pen"></i>
                  </button>
                  <button
                    className="admin-btn-sm delete"
                    title="Eliminar usuario"
                    onClick={() => setConfirm(u.id)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            {usuarios.length === 0 && (
              <tr>
                <td colSpan="5" className="admin-table-empty">
                  <i className="fas fa-users"></i>
                  <p>No hay usuarios registrados.</p>
                  <button className="admin-btn primary" onClick={abrirCrear} style={{ marginTop: "12px" }}>
                    <i className="fas fa-user-plus"></i> Crear el primero
                  </button>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {confirm !== null && (
        <div className="admin-confirm-overlay">
          <div className="admin-confirm">
            <i className="fas fa-triangle-exclamation admin-confirm-icon"></i>
            <p>¿Eliminar este usuario? Esta acción no se puede deshacer.</p>
            <div className="admin-confirm-actions">
              <button className="admin-btn secondary" onClick={() => setConfirm(null)}>
                Cancelar
              </button>
              <button
                className="admin-btn danger"
                onClick={() => { onEliminar(confirm); setConfirm(null); }}
              >
                <i className="fas fa-trash"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
