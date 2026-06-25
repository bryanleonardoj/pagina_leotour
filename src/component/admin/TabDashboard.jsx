import { useState, useEffect } from "react";

// WMO weather codes from Open-Meteo
const WMO = {
  0:  { desc: "Despejado",          icon: "fa-sun" },
  1:  { desc: "Mainly clear",       icon: "fa-sun" },
  2:  { desc: "Parcialmente nublado", icon: "fa-cloud-sun" },
  3:  { desc: "Nublado",            icon: "fa-cloud" },
  45: { desc: "Niebla",             icon: "fa-smog" },
  48: { desc: "Niebla con hielo",   icon: "fa-smog" },
  51: { desc: "Llovizna ligera",    icon: "fa-cloud-drizzle" },
  61: { desc: "Lluvia ligera",      icon: "fa-cloud-rain" },
  63: { desc: "Lluvia moderada",    icon: "fa-cloud-rain" },
  65: { desc: "Lluvia intensa",     icon: "fa-cloud-showers-heavy" },
  71: { desc: "Nevada ligera",      icon: "fa-snowflake" },
  80: { desc: "Chubascos",          icon: "fa-cloud-rain" },
  95: { desc: "Tormenta",           icon: "fa-bolt" }
};

function infoClima(code) {
  if (WMO[code]) return WMO[code];
  if (code >= 51 && code <= 57) return { desc: "Llovizna",    icon: "fa-cloud-drizzle" };
  if (code >= 61 && code <= 67) return { desc: "Lluvia",      icon: "fa-cloud-rain" };
  if (code >= 71 && code <= 77) return { desc: "Nieve",       icon: "fa-snowflake" };
  if (code >= 80 && code <= 82) return { desc: "Chubascos",   icon: "fa-cloud-rain" };
  return { desc: "Variable", icon: "fa-cloud" };
}

export default function TabDashboard({ destinos, reservas, usuarios, tasasCambio }) {
  const [climas, setClimas] = useState({});

  useEffect(() => {
    destinos.forEach(async (d) => {
      if (!d.lat || !d.lng) return;
      try {
        const res = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${d.lat}&longitude=${d.lng}` +
          `&current=temperature_2m,weather_code,wind_speed_10m&timezone=America/Santiago`
        );
        const data = await res.json();
        if (data.current) {
          setClimas(prev => ({
            ...prev,
            [d.id]: {
              temp:   Math.round(data.current.temperature_2m),
              code:   data.current.weather_code,
              viento: Math.round(data.current.wind_speed_10m)
            }
          }));
        }
      } catch { /* muestra spinner si falla */ }
    });
  }, [destinos]);

  const totalIngresos = reservas.reduce((s, r) => s + (r.totalCLP || 0), 0);
  const destinoTop = (() => {
    if (!reservas.length) return "Sin datos";
    const conteo = reservas.reduce((acc, r) => {
      acc[r.comuna] = (acc[r.comuna] || 0) + 1; return acc;
    }, {});
    return Object.entries(conteo).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Sin datos";
  })();

  const reservasRecientes = [...reservas].reverse().slice(0, 5);

  return (
    <div className="admin-tab">
      <h2 className="admin-tab-title"><i className="fas fa-chart-line"></i> Dashboard</h2>

      {/* Stat cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon primary"><i className="fas fa-calendar-check"></i></div>
          <div>
            <p className="admin-stat-num">{reservas.length}</p>
            <p className="admin-stat-label">Reservas totales</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon accent"><i className="fas fa-users"></i></div>
          <div>
            <p className="admin-stat-num">{usuarios.length}</p>
            <p className="admin-stat-label">Usuarios registrados</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon green"><i className="fas fa-dollar-sign"></i></div>
          <div>
            <p className="admin-stat-num">$ {totalIngresos.toLocaleString("es-CL")}</p>
            <p className="admin-stat-label">Ingresos estimados (CLP)</p>
          </div>
        </div>
        <div className="admin-stat-card">
          <div className="admin-stat-icon purple"><i className="fas fa-star"></i></div>
          <div>
            <p className="admin-stat-num">{destinoTop}</p>
            <p className="admin-stat-label">Destino más cotizado</p>
          </div>
        </div>
      </div>

      {/* Live exchange rates */}
      <h3 className="admin-section-title"><i className="fas fa-coins"></i> Tasas de cambio en vivo — Frankfurter API</h3>
      <div className="admin-rates-row">
        <div className="admin-rate-card">
          <span className="rate-flag">🇺🇸</span>
          <div>
            <p className="rate-pair">USD → CLP</p>
            <p className="rate-valor">1 USD = {tasasCambio.CLP.toLocaleString("es-CL")} CLP</p>
          </div>
        </div>
        <div className="admin-rate-card">
          <span className="rate-flag">🇧🇷</span>
          <div>
            <p className="rate-pair">USD → BRL</p>
            <p className="rate-valor">1 USD = {tasasCambio.BRL} BRL</p>
          </div>
        </div>
        <div className="admin-rate-card">
          <span className="rate-flag">🇨🇱</span>
          <div>
            <p className="rate-pair">CLP → USD</p>
            <p className="rate-valor">1 CLP = {(1 / tasasCambio.CLP).toFixed(5)} USD</p>
          </div>
        </div>
      </div>

      {/* Weather */}
      <h3 className="admin-section-title"><i className="fas fa-cloud-sun"></i> Clima en destinos — Open-Meteo API</h3>
      <div className="admin-clima-grid">
        {destinos.map(d => {
          const c = climas[d.id];
          const info = c ? infoClima(c.code) : null;
          return (
            <div key={d.id} className="admin-clima-card">
              <h4>{d.nombre}</h4>
              {c ? (
                <>
                  <div className="clima-icon"><i className={`fas ${info.icon}`}></i></div>
                  <p className="clima-temp">{c.temp}°C</p>
                  <p className="clima-desc">{info.desc}</p>
                  <p className="clima-viento"><i className="fas fa-wind"></i> {c.viento} km/h</p>
                </>
              ) : (
                <div className="clima-loading"><i className="fas fa-spinner fa-spin"></i> Cargando...</div>
              )}
            </div>
          );
        })}
      </div>

      {/* Recent reservations */}
      {reservasRecientes.length > 0 && (
        <>
          <h3 className="admin-section-title" style={{ marginTop: "36px" }}>
            <i className="fas fa-clock-rotate-left"></i> Últimas reservas
          </h3>
          <div className="admin-table-wrap">
            <table className="admin-table">
              <thead>
                <tr><th>Fecha</th><th>Comuna</th><th>Servicio</th><th>Pax</th><th>Total CLP</th><th>Estado</th></tr>
              </thead>
              <tbody>
                {reservasRecientes.map(r => (
                  <tr key={r.id}>
                    <td><small>{r.creadaEn}</small></td>
                    <td>{r.comuna}</td>
                    <td>{r.servicio}</td>
                    <td>{r.pasajeros}</td>
                    <td>$ {(r.totalCLP || 0).toLocaleString("es-CL")}</td>
                    <td><span className={`estado-badge estado-${r.estado}`}>{r.estado}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
}
