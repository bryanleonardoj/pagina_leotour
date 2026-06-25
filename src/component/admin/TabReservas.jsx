import { useState } from "react";

const ESTADOS = ["pendiente", "confirmado", "cancelado"];

export default function TabReservas({ reservas, onActualizar, onEliminar }) {
  const [confirm, setConfirm]   = useState(null);
  const [filtro,  setFiltro]    = useState("todos");

  const lista = filtro === "todos"
    ? [...reservas].reverse()
    : [...reservas].reverse().filter(r => r.estado === filtro);

  return (
    <div className="admin-tab">
      <div className="admin-tab-header">
        <h2 className="admin-tab-title"><i className="fas fa-calendar-check"></i> Reservas</h2>
        <div className="admin-filtros">
          {["todos", ...ESTADOS].map(f => (
            <button
              key={f}
              className={`admin-filtro-btn ${filtro === f ? "active" : ""}`}
              onClick={() => setFiltro(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      <p className="admin-count">
        Mostrando <strong>{lista.length}</strong> reserva(s)
        {filtro !== "todos" && ` · filtro: ${filtro}`}
      </p>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>#</th>
              <th>Creada</th>
              <th>Fecha traslado</th>
              <th>Comuna</th>
              <th>Servicio</th>
              <th>Pax</th>
              <th>Total CLP</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lista.map((r, i) => (
              <tr key={r.id}>
                <td><small style={{ color: "var(--c-muted)" }}>#{String(r.id).slice(-5)}</small></td>
                <td><small>{r.creadaEn}</small></td>
                <td><small>{r.fechaTraslado}</small></td>
                <td><strong>{r.comuna}</strong></td>
                <td>{r.servicio}</td>
                <td style={{ textAlign: "center" }}>{r.pasajeros}</td>
                <td>$ {(r.totalCLP || 0).toLocaleString("es-CL")}</td>
                <td>
                  <select
                    className="admin-estado-select"
                    value={r.estado}
                    onChange={e => onActualizar(r.id, { estado: e.target.value })}
                  >
                    {ESTADOS.map(st => (
                      <option key={st} value={st}>{st.charAt(0).toUpperCase() + st.slice(1)}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <button className="admin-btn-sm delete" title="Eliminar" onClick={() => setConfirm(r.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            {lista.length === 0 && (
              <tr>
                <td colSpan="9" style={{ textAlign: "center", padding: "40px", color: "var(--c-muted)" }}>
                  <i className="fas fa-inbox" style={{ fontSize: "2rem", display: "block", marginBottom: "12px" }}></i>
                  No hay reservas{filtro !== "todos" ? ` con estado "${filtro}"` : ""}.
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
            <p>¿Eliminar esta reserva? Esta acción no se puede deshacer.</p>
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
