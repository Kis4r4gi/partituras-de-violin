# Partituras de violín

Aplicación para **Windows y Android** con la biblioteca académica del violín y el repertorio
violinístico por épocas y niveles, más las carpetas personales para guardar partituras y audio.

## 1. La aplicación

Entrá a [`LEEME.md`](LEEME.md) para instrucciones completas. Resumen rápido:

- **Windows:** doble clic en `index.html`, o ejecutá `scripts\iniciar.bat` (servidor local +
  botón para instalar la aplicación con Chrome/Edge).
- **Android:** con la misma red Wi-Fi, `python -m http.server 8000 --bind 0.0.0.0` y abrí
  `http://<IP-de-la-PC>:8000` desde Chrome → *Agregar a pantalla de inicio*.
- Funciona sin conexión y guarda favoritos, progreso y notas en el dispositivo.

Secciones: **Inicio · Catálogo (200 elementos) · Épocas · Niveles · Biblioteca (estudios por compositor y período, bibliografía) · Sin conexión · Mi progreso**.

Cada ficha incluye **Enlaces externos** con artículos (Wikipedia), videos (YouTube) y
libros (Google Libros) que complementan al autor —consultas curadas para 73 autores—, y
la vista **Épocas** suma recursos externos para los 6 períodos.

## 2. Carpetas personales

| Carpeta | Contenido |
| --- | --- |
| `index.html` + `css/`, `js/`, `assets/` | La aplicación. |
| `Partituras/` | Partituras en PDF (o MusicXML) de cada pieza. |
| `Libros/` | Libros y tratados en PDF/EPUB (estudios, métodos, bibliografía). |
| `Audio/` | Grabaciones de referencia, acompañamientos y versiones propias. |
| `Imagenes/` | Portadas, fotos de digitaciones y material de apoyo. |
| `Notas/` | Apuntes de estudio y progreso por pieza. |
| `scripts/` | Lanzador de Windows y regeneración de iconos. |

### Convención de nombres

```
Compositor - Título (opcional: tonalidad o arreglo).pdf
```

Ejemplos:

- `Bach - Partita No. 2 en Re menor, BWV 1004.pdf`
- `Massenet - Meditación de Thaïs.pdf`
- `Paganini - Capricho No. 24.pdf`

## 3. Repertorio

La tabla de repertorio vive ahora en la aplicación: cada pieza tiene época, nivel,
instrumentación, técnicas y notas de estudio, con buscador y filtros.

## 4. Recursos útiles

- [IMSLP](https://imslp.org/) — partituras de dominio público.
- [MuseScore](https://musescore.org/) — editor y visor de partituras.
- [Mutopia Project](https://www.mutopiaproject.org/) — partituras libres en LilyPond/MIDI.
- Las fichas de la aplicación enlazan además a Wikipedia, YouTube y Google Libros
  (búsquedas públicas por autor y por obra).
