import { useState } from "react";
import TabUsuarios from "./TabUsuarios";

export default function TabConfiguracion({ usuarios, onAgregar, onEditar, onEliminar }) {
  const [seccion, setSeccion] = useState(null);

  if (seccion === "usuarios") {
    return (
      <div className="admin-tab">
        <div className="config-breadcrumb">
          <button className="admin-back-btn" onClick={() => setSeccion(null)}>
            <i className="fas fa-arrow-left"></i> Configuración
          </button>
          <i className="fas fa-chevron-right config-breadcrumb-sep"></i>
          <span className="config-breadcrumb-actual">Gestión de Usuarios</span>
        </div>
        <TabUsuarios
          usuarios={usuarios}
          onAgregar={onAgregar}
          onEditar={onEditar}
          onEliminar={onEliminar}
        />
      </div>
    );
  }

  return (
    <div className="admin-tab">
      <h2 className="admin-tab-title">
        <i className="fas fa-gear"></i> Configuración
      </h2>
      <p className="admin-tab-subtitle">
        Administra los ajustes del sistema y las cuentas de usuario.
      </p>

      {/* Botón principal directo */}
      <div className="config-acceso-directo">
        <div className="config-acceso-info">
          <i className="fas fa-users-gear config-acceso-icono"></i>
          <div>
            <h3>Gestión de Usuarios</h3>
            <p>
              Tienes <strong>{usuarios.length}</strong> usuario(s) registrado(s).
              Crea, edita o elimina cuentas y asigna roles.
            </p>
          </div>
        </div>
        <button
          className="admin-btn primary config-acceso-btn"
          onClick={() => setSeccion("usuarios")}
        >
          <i className="fas fa-users"></i> Ir al CRUD de Usuarios
        </button>
      </div>

      {/* Tarjeta alternativa (visual) */}
      <div className="config-grid">
        <button className="config-card" onClick={() => setSeccion("usuarios")}>
          <div className="config-card-icon usuarios">
            <i className="fas fa-users"></i>
          </div>
          <div className="config-card-body">
            <h3>Gestión de Usuarios</h3>
            <p>Crear, editar y eliminar cuentas. Asignar roles de acceso al panel.</p>
            <span className="config-card-count">
              <i className="fas fa-circle-dot"></i> {usuarios.length} usuario(s) registrado(s)
            </span>
          </div>
          <i className="fas fa-chevron-right config-card-arrow"></i>
        </button>
      </div>
    </div>
  );
}
