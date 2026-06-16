# LEOTOUR — Aplicación React con Vite

**Alumno:** Bryan Jiménez  
**Profesor:** Victor Vásquez  
**Sección:** FB50-N3-P13-C1/D  

---

## Descripción del Proyecto

Aplicación web de una empresa de transporte privado desde y hacia el Aeropuerto de Santiago (SCL). Desarrollada con React 19 + Vite 8, Bootstrap 5 y Leaflet para mapas interactivos.

---

## Arquitectura de la Aplicación

### Stack Tecnológico

| Capa | Tecnología |
|---|---|
| Framework UI | React 19 (componentes funcionales + hooks) |
| Build Tool | Vite 8 |
| Estilos | CSS personalizado + Bootstrap 5 |
| Mapa | Leaflet (OpenStreetMap) |
| Tipografías | Inter + Montserrat (Google Fonts) |
| Iconos | Font Awesome 6 |

---

### Árbol de Componentes

```
App (src/App.jsx)
│   Estado global: monedaActual, menuOpen, loginOpen, registroOpen,
│                  usuariosRegistrados[], usuarioActual, cotizador, cotizacion
│
├── <header>  →  Navbar con logo, menú de navegación, selector de moneda y botones de auth
│
├── <main>
│   ├── <section.hero>           →  Portada con título, subtítulo y llamadas a acción
│   │
│   ├── CarruselImagenes         →  src/component/CarruselImagenes.jsx
│   │       Props: imagenes[]
│   │       Estado propio: slide (índice del slide activo)
│   │       Funciones: handleCambioImagen(nuevoSlide)
│   │
│   ├── <section#servicios>      →  Tarjetas de servicios (Sedán, SUV, Van)
│   │
│   ├── <section#cotizar>        →  Formulario de cotización de traslado (en App)
│   │
│   ├── <section#destinos>       →  Grilla de destinos turísticos con precios
│   │
│   ├── <section#mapa>           →  Mapa Leaflet con marcadores de rutas
│   │
│   ├── <section#vuelos-section> →  Panel de vuelos en tiempo real SCL
│   │
│   └── Contacto                 →  src/component/Contacto.jsx
│           Estado propio: datos{nombre, correo, mensaje}, resultado, esError
│           Funciones: handleCambioDato(e), handleValidacion(e)
│
├── <footer>  →  Información de copyright, links y datos del alumno
│
├── IniciarSesion                →  src/component/IniciarSesion.jsx
│       Props: isOpen, onCerrar, onLogin, onIrARegistro
│       Estado propio: datos{email, contrasena, recordarme}, error, exito
│       Funciones: handleCambioDato(e), handleValidacion(e)
│
└── CrearCuenta                  →  src/component/CrearCuenta.jsx
        Props: isOpen, onCerrar, onRegistro, onIrALogin
        Estado propio: datos{nombre, email, telefono, contrasena}, error, exito
        Funciones: handleCambioDato(e), handleValidacion(e)
```

---

### Flujo de Datos (Props y Estado)

```
App (fuente de verdad del estado global)
 │
 ├── usuariosRegistrados[]  ──►  CrearCuenta recibe onRegistro()
 │                               y llama al padre cuando el form es válido
 │
 ├── usuarioActual          ──►  Se muestra en el Navbar (avatar + nombre)
 │                               Se actualiza cuando IniciarSesion llama onLogin()
 │
 └── imagenes (destinos[])  ──►  CarruselImagenes recibe el arreglo
                                 y gestiona su propio estado de slide
```

### Comunicación entre Componentes

- **App → CarruselImagenes:** paso de datos mediante prop `imagenes`.
- **App → IniciarSesion / CrearCuenta:** paso de handlers (`onLogin`, `onRegistro`) y control de visibilidad (`isOpen`, `onCerrar`).
- **IniciarSesion / CrearCuenta → App:** los hijos llaman los handlers con los datos sanitizados; el padre actualiza el arreglo de inscritos y devuelve `{ exito, mensaje }`.
- **App → Contacto:** sin props; el componente es autónomo (estado y lógica interna).

---

### Gestión del Estado

| Estado | Hook | Descripción |
|---|---|---|
| `slide` | `useState` (en CarruselImagenes) | Índice del slide activo del carrusel |
| `usuariosRegistrados` | `useState` (en App) | Arreglo de objetos usuario inscritos |
| `usuarioActual` | `useState` (en App) | Objeto del usuario logueado (o null) |
| `monedaActual` | `useState` (en App) | Moneda seleccionada: USD, CLP o BRL |
| `cotizador` | `useState` (en App) | Objeto con datos del formulario de cotización |
| `datos` | `useState` (en formularios) | Objeto con campos del formulario activo |
| `error / exito` | `useState` (en formularios) | Mensajes de validación |

---

### Seguridad y Validaciones

- **Sanitización XSS:** función `sanitizarTexto()` en cada formulario, que escapa los caracteres `< > & " ' \`` antes de procesar los datos.
- **Validación de email:** expresión regular `/^[^\s@]+@[^\s@]+\.[^\s@]+$/` aplicada con estado React (no solo `required` HTML).
- **Componentes controlados:** todos los `<input>` tienen `value` enlazado al estado React, lo que previene acceso al DOM y permite validación en tiempo real.
- **Limpieza post-envío:** los campos se resetean al estado vacío tras un envío exitoso.

---

### Estructura de Archivos

```
pagina_leotour/
├── public/
│   └── img/              →  Imágenes del carrusel y logos
├── src/
│   ├── component/
│   │   ├── CarruselImagenes.jsx   →  Componente carrusel con useState
│   │   ├── Contacto.jsx           →  Formulario de contacto controlado
│   │   ├── CrearCuenta.jsx        →  Formulario de inscripción controlado
│   │   └── IniciarSesion.jsx      →  Formulario de login controlado
│   ├── context/
│   │   └── AppContext.jsx         →  Contexto global (disponible para escalar)
│   ├── App.jsx                    →  Componente raíz con estado global
│   ├── index.css                  →  Hoja de estilos principal
│   └── main.jsx                   →  Punto de entrada React
├── index.html
├── package.json
├── vite.config.js
├── ia_consultas.txt               →  Prompts usados con herramientas de IA
└── README.md                      →  Arquitectura del proyecto (este archivo)
```
