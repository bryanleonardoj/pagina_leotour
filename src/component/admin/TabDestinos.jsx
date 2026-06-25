import { useState, useRef } from "react";

const VACIO = { nombre: "", descripcion: "", imagen: "", precio: "", distancia: "", lat: null, lng: null };

export default function TabDestinos({ destinos, onAgregar, onEditar, onEliminar }) {
  const [modo,       setModo]       = useState("lista");
  const [editId,     setEditId]     = useState(null);
  const [form,       setForm]       = useState(VACIO);
  const [confirm,    setConfirm]    = useState(null);
  const [geoEstado,  setGeoEstado]  = useState("idle"); // idle | buscando | ok | error
  const fileRef = useRef();

  const abrirCrear = () => {
    setForm(VACIO);
    setGeoEstado("idle");
    setModo("crear");
  };

  const abrirEditar = (d) => {
    setForm({
      nombre:      d.nombre,
      descripcion: d.descripcion,
      imagen:      d.imagen || "",
      precio:      String(d.precio),
      distancia:   String(d.distancia),
      lat:         d.lat ?? null,
      lng:         d.lng ?? null
    });
    setGeoEstado(d.lat && d.lng ? "ok" : "idle");
    setEditId(d.id);
    setModo("editar");
  };

  const cerrar = () => { setModo("lista"); setEditId(null); setGeoEstado("idle"); };

  // Convierte el archivo seleccionado a base64 para guardarlo
  const handleImagen = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => setForm(prev => ({ ...prev, imagen: reader.result }));
    reader.readAsDataURL(file);
  };

  // Geocodificación automática con Nominatim (OpenStreetMap) — sin API key
  const geocodificar = async (nombre) => {
    if (!nombre.trim()) return;
    setGeoEstado("buscando");
    try {
      const q = encodeURIComponent(`${nombre.trim()}, Chile`);
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${q}&format=json&limit=1`,
        { headers: { "Accept-Language": "es" } }
      );
      const data = await res.json();
      if (data[0]) {
        setForm(prev => ({ ...prev, lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) }));
        setGeoEstado("ok");
      } else {
        setGeoEstado("error");
      }
    } catch {
      setGeoEstado("error");
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const datos = { ...form, precio: Number(form.precio), distancia: Number(form.distancia) };
    if (modo === "crear") onAgregar(datos);
    else                  onEditar(editId, datos);
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
            <i className={`fas ${modo === "crear" ? "fa-map-pin" : "fa-pen-to-square"}`}></i>
            {modo === "crear" ? " Agregar destino" : " Editar destino"}
          </h2>
        </div>

        <form className="admin-form" onSubmit={handleSubmit}>

          {/* ── Subida de imagen ── */}
          <div className="admin-form-group">
            <label>Imagen del destino</label>
            <div className="img-upload-area" onClick={() => fileRef.current.click()}>
              {form.imagen ? (
                <img src={form.imagen} alt="Vista previa" className="img-upload-preview" />
              ) : (
                <div className="img-upload-placeholder">
                  <i className="fas fa-cloud-arrow-up"></i>
                  <p>Haz clic para subir una imagen</p>
                  <small>JPG · PNG · WEBP</small>
                </div>
              )}
            </div>
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleImagen}
            />
            {form.imagen && (
              <button
                type="button"
                className="admin-btn secondary"
                style={{ marginTop: "10px" }}
                onClick={() => { setForm({ ...form, imagen: "" }); fileRef.current.value = ""; }}
              >
                <i className="fas fa-xmark"></i> Quitar imagen
              </button>
            )}
          </div>

          {/* ── Nombre + geocodificación automática ── */}
          <div className="admin-form-group">
            <label>Nombre del destino *</label>
            <input
              type="text"
              required
              value={form.nombre}
              placeholder="Ej: Valparaíso"
              onChange={e => setForm({ ...form, nombre: e.target.value })}
              onBlur={e => geocodificar(e.target.value)}
            />
            {geoEstado === "buscando" && (
              <span className="geocod-status buscando">
                <i className="fas fa-spinner fa-spin"></i> Buscando ubicación en el mapa…
              </span>
            )}
            {geoEstado === "ok" && (
              <span className="geocod-status ok">
                <i className="fas fa-location-dot"></i> Ubicación encontrada y asignada automáticamente
              </span>
            )}
            {geoEstado === "error" && (
              <span className="geocod-status error">
                <i className="fas fa-triangle-exclamation"></i> No se encontró la ubicación. El destino se guardará sin pin en el mapa.
              </span>
            )}
          </div>

          {/* ── Descripción ── */}
          <div className="admin-form-group">
            <label>Descripción *</label>
            <input
              type="text"
              required
              value={form.descripcion}
              placeholder="Ej: Hermosas playas y paisajes costeros"
              onChange={e => setForm({ ...form, descripcion: e.target.value })}
            />
          </div>

          {/* ── Precio y distancia en fila ── */}
          <div className="admin-form-row">
            <div className="admin-form-group">
              <label>Precio base (CLP) *</label>
              <input
                type="number"
                required
                min="0"
                value={form.precio}
                placeholder="Ej: 45000"
                onChange={e => setForm({ ...form, precio: e.target.value })}
              />
            </div>
            <div className="admin-form-group">
              <label>Distancia desde Santiago (km) *</label>
              <input
                type="number"
                required
                min="0"
                value={form.distancia}
                placeholder="Ej: 120"
                onChange={e => setForm({ ...form, distancia: e.target.value })}
              />
            </div>
          </div>

          <div className="admin-form-actions">
            <button type="button" className="admin-btn secondary" onClick={cerrar}>Cancelar</button>
            <button type="submit" className="admin-btn primary">
              <i className={`fas ${modo === "crear" ? "fa-plus" : "fa-check"}`}></i>
              {modo === "crear" ? " Agregar destino" : " Guardar cambios"}
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="admin-tab">
      <div className="admin-tab-header">
        <h2 className="admin-tab-title"><i className="fas fa-map-location-dot"></i> Destinos</h2>
        <button className="admin-btn primary" onClick={abrirCrear}>
          <i className="fas fa-plus"></i> Agregar destino
        </button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead>
            <tr>
              <th>Imagen</th>
              <th>Nombre / Descripción</th>
              <th>Precio CLP</th>
              <th>Dist. km</th>
              <th>Mapa</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {destinos.map(d => (
              <tr key={d.id}>
                <td>
                  {d.imagen ? (
                    <img
                      src={d.imagen}
                      alt={d.nombre}
                      className="destino-thumb"
                    />
                  ) : (
                    <div className="destino-thumb-placeholder">
                      <i className="fas fa-image"></i>
                    </div>
                  )}
                </td>
                <td>
                  <strong>{d.nombre}</strong>
                  <br />
                  <small>{d.descripcion}</small>
                </td>
                <td>$ {d.precio.toLocaleString("es-CL")}</td>
                <td>{d.distancia} km</td>
                <td>
                  {d.lat && d.lng ? (
                    <span className="geocod-status ok" style={{ fontSize: "0.75rem" }}>
                      <i className="fas fa-location-dot"></i> Sí
                    </span>
                  ) : (
                    <span style={{ color: "var(--c-muted)", fontSize: "0.78rem" }}>—</span>
                  )}
                </td>
                <td className="admin-actions">
                  <button className="admin-btn-sm edit" title="Editar" onClick={() => abrirEditar(d)}>
                    <i className="fas fa-pen"></i>
                  </button>
                  <button className="admin-btn-sm delete" title="Eliminar" onClick={() => setConfirm(d.id)}>
                    <i className="fas fa-trash"></i>
                  </button>
                </td>
              </tr>
            ))}
            {destinos.length === 0 && (
              <tr>
                <td colSpan="6" className="admin-table-empty">
                  <i className="fas fa-map-location-dot"></i>
                  <p>No hay destinos registrados.</p>
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
            <p>¿Eliminar este destino? Esta acción no se puede deshacer.</p>
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
