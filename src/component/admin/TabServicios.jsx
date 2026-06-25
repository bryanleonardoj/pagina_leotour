import { useState } from "react";

const CLASES = ["sedan-icon", "suv-icon", "van-icon"];
const ICONOS = ["fa-car", "fa-car-side", "fa-shuttle-van", "fa-bus", "fa-motorcycle", "fa-taxi"];

const VACIO = { id: "", nombre: "", desc: "", clase: "sedan-icon", icon: "fa-car", precioBase: "" };

export default function TabServicios({ servicios, onAgregar, onEditar, onEliminar }) {
  const [modo,    setModo]    = useState("lista");
  const [editId,  setEditId]  = useState(null);
  const [form,    setForm]    = useState(VACIO);
  const [confirm, setConfirm] = useState(null);

  const abrirCrear = () => { setForm(VACIO); setModo("crear"); };

  const abrirEditar = (s) => {
    setForm({ ...s, precioBase: String(s.precioBase) });
    setEditId(s.id);
    setModo("editar");
  };

  const cerrar = () => { setModo("lista"); setEditId(null); };

  const handleSubmit = (e) => {
    e.preventDefault();
    const datos = { ...form, precioBase: Number(form.precioBase) };
    if (modo === "crear") {
      if (!datos.id) datos.id = datos.nombre.toLowerCase().replace(/\s+/g, "-");
      onAgregar(datos);
    } else {
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
            {modo === "crear" ? "Agregar servicio" : "Editar servicio"}
          </h2>
        </div>
        <form className="admin-form" onSubmit={handleSubmit}>
          {modo === "crear" && (
            <div className="admin-form-group">
              <label>ID único (ej: minibus)</label>
              <input
                type="text"
                value={form.id}
                placeholder="Se genera automáticamente si se deja vacío"
                onChange={e => setForm({ ...form, id: e.target.value })}
              />
            </div>
          )}
          <div className="admin-form-group">
            <label>Nombre del servicio *</label>
            <input
              type="text"
              required
              value={form.nombre}
              onChange={e => setForm({ ...form, nombre: e.target.value })}
            />
          </div>
          <div className="admin-form-group">
            <label>Descripción *</label>
            <input
              type="text"
              required
              value={form.desc}
              onChange={e => setForm({ ...form, desc: e.target.value })}
            />
          </div>
          <div className="admin-form-group">
            <label>Precio base (CLP) *</label>
            <input
              type="number"
              required
              value={form.precioBase}
              onChange={e => setForm({ ...form, precioBase: e.target.value })}
            />
          </div>
          <div className="admin-form-group">
            <label>Clase CSS (color del ícono)</label>
            <select value={form.clase} onChange={e => setForm({ ...form, clase: e.target.value })}>
              {CLASES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div className="admin-form-group">
            <label>Ícono Font Awesome</label>
            <select value={form.icon} onChange={e => setForm({ ...form, icon: e.target.value })}>
              {ICONOS.map(ic => <option key={ic} value={ic}>{ic}</option>)}
            </select>
            <small style={{ color: "var(--c-muted)", marginTop: "6px", display: "block" }}>
              Vista previa: <i className={`fas ${form.icon}`} style={{ color: "var(--c-primary)", marginLeft: 6 }}></i>
            </small>
          </div>
          <div className="admin-form-actions">
            <button type="button" className="admin-btn secondary" onClick={cerrar}>Cancelar</button>
            <button type="submit" className="admin-btn primary">
              <i className={`fas ${modo === "crear" ? "fa-plus" : "fa-check"}`}></i>
              {modo === "crear" ? " Agregar" : " Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-tab">
      <div className="admin-tab-header">
        <h2 className="admin-tab-title"><i className="fas fa-car"></i> Servicios</h2>
        <button className="admin-btn primary" onClick={abrirCrear}>
          <i className="fas fa-plus"></i> Agregar servicio
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Ícono</th>
              <th>Nombre</th>
              <th>Descripción</th>
              <th>Precio base CLP</th>
              <th>Clase</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {servicios.map(s => (
              <tr key={s.id}>
                <td style={{ textAlign: "center" }}>
                  <i className={`fas ${s.icon} fa-lg`} style={{ color: "var(--c-primary)" }}></i>
                </td>
                <td><strong>{s.nombre}</strong></td>
                <td><small>{s.desc}</small></td>
                <td>$ {(s.precioBase || 0).toLocaleString("es-CL")}</td>
                <td><code style={{ fontSize: "0.78rem" }}>{s.clase}</code></td>
                <td className="admin-actions">
                  <button className="admin-btn-sm edit" title="Editar" onClick={() => abrirEditar(s)}>
                    <i className="fas fa-pen"></i>
                  </button>
                  <button className="admin-btn-sm delete" title="Eliminar" onClick={() => setConfirm(s.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            {servicios.length === 0 && (
              <tr><td colSpan="6" style={{ textAlign: "center", padding: "32px", color: "var(--c-muted)" }}>
                No hay servicios registrados.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {confirm !== null && (
        <div className="admin-confirm-overlay">
          <div className="admin-confirm">
            <i className="fas fa-triangle-exclamation admin-confirm-icon"></i>
            <p>¿Eliminar este servicio? Esta acción no se puede deshacer.</p>
            <div className="admin-confirm-actions">
              <button className="admin-btn secondary" onClick={() => setConfirm(null)}>Cancelar</button>
              <button className="admin-btn danger" onClick={() => { onEliminar(confirm); setConfirm(null); }}>
                <i className="fas fa-trash"></i> Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
