# Partituras de violín

Aplicación para **Windows y Android** con la biblioteca académica del violín y el repertorio
violinístico organizado por **épocas históricas** (barroco, clasicismo, romanticismo,
modernismo y contemporáneo) y por **niveles de estudio (1 a 7)**.

Es una aplicación web instalable (PWA): funciona en el navegador, se instala como programa
en Windows y como app en Android, y **guarda todo sin conexión**.

---

## Contenido

| Sección | Qué hay |
| --- | --- |
| **Inicio** | Resumen, acceso rápido a épocas y niveles, estudios por compositor y período, piezas destacadas. |
| **Catálogo** | 137 obras + 17 estudios + 22 guías + 10 métodos + 14 bibliográficos (200 en total), con búsqueda instantánea y filtros por época, nivel, tipo y técnica. |
| **Épocas** | 6 épocas con su rango histórico, qué técnica se trabaja en cada una y sus recursos, más enlaces externos (artículos, videos y libros) para ampliar cada período. |
| **Niveles** | Los 7 niveles con requisitos (escalas, estudios y repertorio) y sus piezas. |
| **Biblioteca** | Estudios, métodos y bibliografía **agrupados por el período de su compositor** (Clasicismo, Romanticismo, Modernista…), con los años de cada autor. Guías académicas: postura, arco, vibrato, método de estudio, salud, historia. |
| **Sin conexión** | Índice de tus partituras, libros y audio propios + enlaces de descarga de dominio público (IMSLP). |
| **Mi progreso** | Favoritos, piezas *estudiando* / *estudiadas*, notas personales y búsquedas guardadas. |

Los datos se guardan en el navegador (`localStorage`), solo en el dispositivo.

---

## Estudios por compositor y período

En **Biblioteca → Estudios** (y con el orden «Período del autor → compositor») los estudios
aparecen agrupados en el período histórico de su autor, y dentro de cada período, ordenados
por compositor:

| Período | Compositores de estudios |
| --- | --- |
| **Clasicismo (1750–1820)** | Kreutzer (1766–1831), Rode (1774–1830), Fiorillo (1753–1819), Gavinies (1745–1825), Mazas (1781–1858), L'Abbé |
| **Romanticismo (1820–1900)** | Hans Sitt (1850–1926), Ševčík (1852–1934), Schradieck (1846–1928), Wohlfahrt (1833–1884), Kayser (1815–1888), Dont (1815–1888) |
| **Modernista (1890–1945)** | Flesch (1873–1973), Yost, Bartók (1881–1945) |
| **Contemporáneo** | Métodos: Suzuki (1898–1998), Rolland (1906–1986), Galamian (1904–1981) |

El selector **Ordenar** permite cambiar entre *Período → compositor*, *Compositor A–Z* y *Nivel*.

---

## Bibliografía general

14 entradas de bibliografía (tipo **📚 Bibliografía**) con descripción propia de cada obra:

- **Tratados históricos:** Geminiani *The Art of Playing on the Violin* (1751), Leopold Mozart
  *Violinschule* (1756), Baillot *L'art du violon* (1834).
  (Spohr, Ferdinand David y Bériot están en la sección **Métodos**.)
- **Historiografía:** Altmann *A History of Violin Playing* (1972), Stowell *The Violin*.
- **Diccionarios y publicaciones:** *New Grove* (1980), *Grove's* (1879), *Baker's*,
  *MGG*, *Oxford Companion* (1938), revista *The Strad* (desde 1890).
- **Pedagogía contemporánea:** Simon Fischer *Basics* y *Practice*, Suzuki *Nurtured by Love*.

> Solo se incluyen **metadatos y descripciones**; los textos originales son de dominio
> público (descargables en IMSLP) o de compra legal.

---

## Enlaces externos (videos, artículos y libros)

Cada ficha de detalle incluye una sección **«Enlaces externos»** que complementa la
información del autor:

- **📖 Artículo del autor** → Wikipedia en español (búsqueda del compositor).
- **🎬 Videos** → búsquedas de YouTube con consultas curadas por autor (p. ej. Bach
  *Chaconne BWV 1004*, Paganini *Capricho n.º 24*, Ševčík *Escuela del arco*…).
- **📚 Libros** → Google Libros para métodos, tratados, guías y bibliografía.
- **📰 Lecturas** → artículos y análisis seleccionados por autor.

Hay **consultas curadas para 73 autores** (Bach, Vivaldi, Paganini, Kreutzer, Sitt,
Ševčík, Flesch, Suzuki, Bartók, Ysaÿe, Piazzolla…); el resto de autores recibe
enlaces generados automáticamente con su nombre. En la sección **Épocas**, la tarjeta
*«Ampliar cada época»* suma recursos de Wikipedia, YouTube y Google Libros para los
6 períodos.

Todos los enlaces usan **búsquedas públicas estables** (Wikipedia, YouTube, Google,
IMSLP) y se abren en una pestaña nueva; la app no aloja contenido de terceros.

---

## Contenido sin conexión (partituras, libros, audio)

La sección **Sin conexión** indexa archivos que vos guardás en las carpetas de la aplicación:

```
Partituras/   PDF, MusicXML, imágenes de las piezas
Libros/       PDF o EPUB de métodos y tratados (ej: Sitt – Études op. 32.pdf)
Audio/        MP3, OGG, WAV de referencia o acompañamientos
Imagenes/     portadas y fotos de digitaciones
Notas/        apuntes en TXT, MD o PDF
```

Para generar el índice (lo hace Python, no la aplicación):

```powershell
python scripts\indexar-offline.py
```

Después recargá la app y entrá a **Sin conexión**: los archivos aparecen listados y se
abren en una pestaña nueva.

**Descargas legales:** la sección incluye 12 enlaces directos de búsqueda a IMSLP para las
obras de dominio público (Bach, Vivaldi, Kreutzer, **Sitt op. 32**, Ševčík, Wohlfahrt, Kayser,
Mazas, Flesch, Paganini, Leopold Mozart, Baillot). Las obras de autores fallecidos hace más
de 70 años se pueden descargar gratis; los métodos con copyright hay que adquirirlos.

> ⚠️ Esta aplicación **no incluye partituras ni libros con copyright**: solo indexa los
> archivos que vos guardás. Los textos académicos de la app (guías, notas y descripciones)
> son originales.

---

## Versión en línea (GitHub Pages)

**https://kis4r4gi.github.io/partituras-de-violin/**

- No necesita instalación: abrís el enlace desde Chrome o Edge (Windows o Android).
- Para usarla sin conexión: *Instalar aplicación* (Chrome/Edge) o *Agregar a pantalla de
  inicio* (Android); después queda disponible sin internet igual que la versión local.
- El código está en GitHub: https://github.com/Kis4r4gi/partituras-de-violin

---

## Cómo abrirlo en Windows

**Opción A (rápida):** doble clic en `index.html`.

**Opción B (recomendada):** ejecutá `scripts\iniciar.bat`.

- Levanta un servidor local y abre `http://127.0.0.1:8077`.
- En Chrome/Edge aparece el botón **Instalar aplicación** (o el menú ⋮ → *Instalar…*).
- Una vez instalada, se abre como programa propio y funciona **sin conexión**.

---

## Cómo usarlo en Android

1. Abrí `scripts\iniciar.bat` en la PC (o `python -m http.server 8000 --bind 0.0.0.0`
   desde la carpeta de la aplicación).
2. Desde el celular, con la **misma red Wi-Fi**, abrí Chrome en:
   `http://<IP-de-la-PC>:8000` (la IP se ve con `ipconfig`).
3. Menú de Chrome → **Agregar a pantalla de inicio** (se instala como aplicación).
4. Una vez instalada, Chrome guarda los archivos y queda disponible **sin conexión**;
   tus favoritos y tu progreso se guardan en el teléfono.

Para convertirla en un `.apk` se puede usar [PWABuilder](https://www.pwabuilder.com/)
a partir de la dirección local o de un hosting de la misma carpeta.

---

## Estructura

```
Partituras de violin/
├─ index.html                 Aplicación (punto de entrada)
├─ manifest.json              Instalación como app (Windows/Android)
├─ sw.js                      Service Worker: caché sin conexión
├─ LEEME.md                   Este archivo
├─ css/styles.css             Tema oscuro cálido, adaptable a móvil
├─ js/store.js                Favoritos, progreso, notas y búsquedas (localStorage)
├─ js/app.js                  Interfaz, búsqueda, filtros y rutas
├─ js/data/
│   ├─ taxonomia.js           Épocas, niveles, tipos y técnicas
│   ├─ repertorio-barroco-clasico.js
│   ├─ repertorio-romantico.js
│   ├─ repertorio-moderno.js  Modernismo y contemporáneo
│   ├─ academico-estudios.js  Estudios y métodos (con período del autor)
│   ├─ academico-guias.js     Guías académicas
│   ├─ bibliografia.js        Tratados, diccionarios e historiografía
│   ├─ enlaces.js             Enlaces externos por autor y por época
│   └─ offline.js             Índice generado de archivos locales
├─ Partituras/                Tus partituras (PDF, MusicXML)
├─ Libros/                    Tus libros (PDF, EPUB)
├─ Audio/                     Grabaciones y acompañamientos
├─ Imagenes/                  Portadas y material de apoyo
├─ Notas/                     Apuntes de estudio
├─ assets/                    Iconos (PNG + SVG)
└─ scripts/
    ├─ iniciar.bat            Servidor local + abre el navegador
    ├─ indexar-offline.py     Genera js/data/offline.js con tus archivos
    └─ build-icons.ps1        Regenera los iconos PNG
```

---

## Cómo añadir contenidos

Editá (o creá) un archivo dentro de `js/data/` y agregá entradas con este formato:

```js
window.CVM.obras.push({
  id: "r-mendelssohn-op64",          // único, sin espacios
  tipo: "obra",                       // obra | estudio | guia | metodo
  titulo: "Concierto para violín en mi menor, op. 64",
  compositor: "Felix Mendelssohn",
  anio: 1844,                         // opcional
  epoca: "romantico",                 // medieval-renacentista | barroco | clasico |
                                      // romantico | modernista | contemporaneo | null
  nivel: 6,                           // 1 a 7
  instrumentacion: "Violín y orquesta",
  duracion: "26 min",
  categoria: "Concierto",             // opcional, usada en la Biblioteca
  tecnicas: ["Interpretación", "Velocidad", "Afinación"],
  notas: "Descripción breve de la obra y consejos de estudio.",
  contenido: ["Punto 1", "Punto 2"]   // opcional, lista de puntos (guías)
});
```

No hay que recompilar nada: basta con recargar la página.

---

## Iconos

`assets/icon-192.png`, `icon-512.png` y `icon-maskable-512.png` se regeneran con:

```powershell
powershell.exe -NoProfile -ExecutionPolicy Bypass -File .\scripts\build-icons.ps1
```

---

## Requisitos

- Navegador moderno (Chrome, Edge, Firefox o Safari) de cualquier versión reciente.
- Python 3 solo es necesario para el servidor local opcional.
