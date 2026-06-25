import { useState } from "react";
import TabDashboard from "./TabDashboard";
import TabDestinos  from "./TabDestinos";
import TabServicios from "./TabServicios";
import TabReservas       from "./TabReservas";
import TabConfiguracion  from "./TabConfiguracion";

const TABS = [
  { id: "dashboard",      label: "Dashboard",      icon: "fa-chart-line" },
  { id: "destinos",       label: "Destinos",       icon: "fa-map-location-dot" },
  { id: "servicios",      label: "Servicios",      icon: "fa-car" },
  { id: "reservas",       label: "Reservas",       icon: "fa-calendar-check" },
  { id: "configuracion",  label: "Configuración",  icon: "fa-gear" }
];

export default function PanelAdmin({
  onCerrar, destinos, servicios, reservas, usuarios, tasasCambio,
  onAgregarDestino, onEditarDestino, onEliminarDestino,
  onAgregarServicio, onEditarServicio, onEliminarServicio,
  onActualizarReserva, onEliminarReserva,
  onAgregarUsuario, onEditarUsuario, onEliminarUsuario,
  initialTab = "dashboard"
}) {
  const [tabActiva, setTabActiva] = useState(initialTab);

  return (
    <div className="admin-overlay">
      <div className="admin-panel">
        <aside className="admin-sidebar">
          <div className="admin-logo">
            <i className="fas fa-shield-halved"></i>
            <span>Admin Panel</span>
          </div>
          <nav className="admin-nav">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`admin-nav-btn ${tabActiva === t.id ? "active" : ""}`}
                onClick={() => setTabActiva(t.id)}
              >
                <i className={`fas ${t.icon}`}></i>
                <span>{t.label}</span>
              </button>
            ))}
          </nav>
          <button className="admin-cerrar-btn" onClick={onCerrar}>
            <i className="fas fa-arrow-left"></i>
            <span>Volver al sitio</span>
          </button>
        </aside>

        <div className="admin-content">
          {tabActiva === "dashboard" && (
            <TabDashboard
              destinos={destinos}
              reservas={reservas}
              usuarios={usuarios}
              tasasCambio={tasasCambio}
            />
          )}
          {tabActiva === "destinos" && (
            <TabDestinos
              destinos={destinos}
              onAgregar={onAgregarDestino}
              onEditar={onEditarDestino}
              onEliminar={onEliminarDestino}
            />
          )}
          {tabActiva === "servicios" && (
            <TabServicios
              servicios={servicios}
              onAgregar={onAgregarServicio}
              onEditar={onEditarServicio}
              onEliminar={onEliminarServicio}
            />
          )}
          {tabActiva === "reservas" && (
            <TabReservas
              reservas={reservas}
              onActualizar={onActualizarReserva}
              onEliminar={onEliminarReserva}
            />
          )}
          {tabActiva === "configuracion" && (
            <TabConfiguracion
              usuarios={usuarios}
              onAgregar={onAgregarUsuario}
              onEditar={onEditarUsuario}
              onEliminar={onEliminarUsuario}
            />
          )}
        </div>
      </div>
    </div>
  );
}
