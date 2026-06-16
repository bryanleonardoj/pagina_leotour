import { useState, useEffect, useRef } from "react";

function CarruselImagenes({ imagenes }) {
  const [slide, setSlide] = useState(0);
  const timerRef = useRef(null);

  const handleCambioImagen = (nuevoSlide) => {
    setSlide(nuevoSlide);
    reiniciarTimer();
  };

  const reiniciarTimer = () => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setSlide((prev) => (prev + 1) % imagenes.length);
    }, 5000);
  };

  useEffect(() => {
    reiniciarTimer();
    return () => clearInterval(timerRef.current);
  }, [imagenes.length]);

  return (
    <section className="carousel-section">
      <div className="section-heading">
        <span className="section-eyebrow">Inspírate</span>
        <h2>Destinos populares</h2>
      </div>
      <div className="carousel-container">
        {imagenes.map((d, i) => (
          <div key={d.nombre} className={`carousel-item ${i === slide ? "active" : ""}`}>
            <img src={d.imagen} alt={d.nombre} className="carousel-img" />
            <div className="carousel-overlay">
              <h3>{d.nombre}</h3>
              <p>{d.descripcion}</p>
            </div>
          </div>
        ))}

        <button
          className="carousel-btn carousel-prev"
          onClick={() => handleCambioImagen((slide - 1 + imagenes.length) % imagenes.length)}
          aria-label="Anterior"
        >
          <i className="fas fa-chevron-left"></i>
        </button>
        <button
          className="carousel-btn carousel-next"
          onClick={() => handleCambioImagen((slide + 1) % imagenes.length)}
          aria-label="Siguiente"
        >
          <i className="fas fa-chevron-right"></i>
        </button>

        <div className="carousel-indicators">
          {imagenes.map((_, i) => (
            <span
              key={i}
              className={`carousel-dot ${slide === i ? "active" : ""}`}
              onClick={() => handleCambioImagen(i)}
            ></span>
          ))}
        </div>
      </div>
    </section>
  );
}

export default CarruselImagenes;
