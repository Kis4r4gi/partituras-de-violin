/* Épocas de la historia de la música para violín y niveles de estudio.
   Se expone en window.CVM (Catálogo de Violín y Música). */
window.CVM = window.CVM || {};

window.CVM.epocas = [
  {
    id: "medieval-renacentista",
    nombre: "Medieval y Renacentista",
    rango: "siglos XII – XVI",
    orden: 0,
    resumen:
      "Antes del violín tal como lo conocemos existían la viela, el rebec y la viola da gamba. " +
      "El repertorio de esta época se toca hoy con instrumentos históricos o con violín moderno " +
      "adapta­do: polifonía, danzas y música de corte.",
    claves: ["Danza", "Polifonía", "Tromba marina", "Viola da gamba"]
  },
  {
    id: "barroco",
    nombre: "Barroco",
    rango: "1600 – 1750",
    orden: 1,
    resumen:
      "Nace el violín en Cremona (Amati, Stradivari, Guarneri) y con él el repertorio solista. " +
      "Basso continuo, ornamentos, arco barroco, digitación abierta y el gusto por la variación. " +
      "Es la base técnica e histórica de toda la escuela del violín.",
    claves: ["Basso continuo", "Ornamentos", "Arco barroco", "Variaciones"]
  },
  {
    id: "clasico",
    nombre: "Clasicismo",
    rango: "1750 – 1820",
    orden: 2,
    resumen:
      "El violín se vuelve instrumento de orquesta y de salón. Aparecen el arco francés con " +
      "talón, el sistema de digitación moderno y las primeras escuelas sistemáticas (Viotti, " +
      "Kreutzer, Rode). Formas clásicas: sonata, concierto, cuarteto.",
    claves: ["Sonata", "Concierto", "Arco francés", "Escuela francesa"]
  },
  {
    id: "romantico",
    nombre: "Romanticismo",
    rango: "1820 – 1900",
    orden: 3,
    resumen:
      "Virtuosismo, canto lírico y color orquestal. Paganini redefine la técnica; Mendelssohn, " +
      "Bruch y Tchaikovsky consolidan el concierto romántico. Auge de la escuela belga y rusa, " +
      "vibrato continuo, cambios rápidos de posición y dobles cuerdas.",
    claves: ["Virtuosismo", "Canto", "Concierto con orquesta", "Cámaras románticas"]
  },
  {
    id: "modernista",
    nombre: "Modernista e Impresionista",
    rango: "1890 – 1945",
    orden: 4,
    resumen:
      "Se rompe la tonalidad. Armónicos, trinos múltiples, col legno, glissandi, timbres nuevos " +
      "y ritmos de danza popular (tango, jazz). El violín entra en la vanguardia europea y " +
      "americana.",
    claves: ["Armónicos", "Nuevos timbres", "Tonalidad libre", "Danza"]
  },
  {
    id: "contemporaneo",
    nombre: "Contemporáneo",
    rango: "1945 – hoy",
    orden: 5,
    resumen:
      "Música escrita hoy: notación extendida, electrónica, indeterminación, minimalismo y " +
      "neotonalismo. También la música de cine y los nuevos formatos (violinista en banda, " +
      "cross-over), con un amplio repertorio pedagógico contemporáneo.",
    claves: ["Notación extendida", "Minimalismo", "Electrónica", "Cine"]
  }
];

window.CVM.niveles = [
  {
    id: 1,
    nombre: "Nivel 1 · Principiante absoluto",
    alias: "0 – 6 meses",
    resumen:
      "Postura, agarre del arco, primas notas y ritmo básico. Sin cambios de posición.",
    requisitos: [
      "Colocar el violín y el arco sin tensión en hombro y muñeca",
      "Cuerda al aire: mi, la, re, sol (de la más grave a la más aguda)",
      "Lectura de notas en las tres primeras posiciones de la cuerda de la y la e",
      "Pulso estable con metrónomo en 60–72 ppm"
    ]
  },
  {
    id: 2,
    nombre: "Nivel 2 · Iniciación",
    alias: "6 – 18 meses",
    resumen:
      "Primera posición completa, escalas de una octava, piezas cortas con acompañamiento.",
    requisitos: [
      "Primera posición en las cuatro cuerdas con digitación correcta",
      "Escalas mayores de una octava en Do, Sol, Re y La",
      "Doble tiempo: corcheas y semicorcheas simples",
      "Trinos lentos y cambio de cuerda limpio"
    ]
  },
  {
    id: 3,
    nombre: "Nivel 3 · Básico intermedio",
    alias: "18 – 36 meses",
    resumen:
      "Escala de dos octavas, primeros estudios de escuela clásica, piezas con piano de nivel fácil.",
    requisitos: [
      "Escalas de dos octavas con metrónomo y digitación fija",
      "Estudios de Wohlfahrt y Kayser completos",
      "Vibrato iniciado en dedos 2 y 3",
      "Spiccato básico en arco rebote"
    ]
  },
  {
    id: 4,
    nombre: "Nivel 4 · Intermedio",
    alias: "2 a 4 años",
    resumen:
      "Escalas de tres octavas, arpegios, estudios de Kreutzer y primeras piezas de concierto fáciles.",
    requisitos: [
      "Todas las escalas y arpegios de tres octavas",
      "Kreutzer: estudios 2, 5, 9, 13 y 16",
      "Vibrato en los cuatro dedos y en todas las cuerdas",
      "Saltos de cuerda y dobles cuerdas básicas"
    ]
  },
  {
    id: 5,
    nombre: "Nivel 5 · Intermedio alto",
    alias: "4 a 6 años",
    resumen:
      "Repertorio de concierto clásico-romántico, estudios de Mazas y Dont, técnica de brío.",
    requisitos: [
      "Conciertos fáciles (Vivaldi A, RV 356; Seitz; Kayser)",
      "Escalas en terceras y sextas, cuatro notas por pulso",
      "Mazas y Dont op. 37",
      "Cambio rápido de posición y legato amplio"
    ]
  },
  {
    id: 6,
    nombre: "Nivel 6 · Avanzado",
    alias: "6 a 9 años",
    resumen:
      "Repertorio de conservatorio: conciertos románticos, estudios de virtuosismo, cuartetos y orquesta.",
    requisitos: [
      "Bruch, Mendelssohn, Tchaikovsky (primeros movimientos)",
      "Rode, Fiorillo y Gavinies completos",
      "Trinos rápidos, ricochet, sautillé",
      "Lectura a primera vista con partes de orquesta"
    ]
  },
  {
    id: 7,
    nombre: "Nivel 7 · Profesional",
    alias: "9+ años",
    resumen:
      "Conciertos completos de Brahms, Sibelius, Berg y obras contemporáneas. Audiciones y orquesta.",
    requisitos: [
      "Conciertos completos por memorización",
      "Bach: Sonatas y Partitas íntegras",
      "Repertorio contemporáneo con notación extendida",
      "Percusión del arco, múltiples armónicos y afinación en octavas"
    ]
  }
];

/* Categorías de tipo de material (biblioteca académica). */
window.CVM.tipos = [
  { id: "obra", nombre: "Obra", icono: "♪", desc: "Pieza de repertorio para violín" },
  { id: "estudio", nombre: "Estudio", icono: "✦", desc: "Ejercicio técnico de la escuela del violín" },
  { id: "bibliografia", nombre: "Bibliografía", icono: "📚", desc: "Tratados, manuales, diccionarios e historiografía" },
  { id: "guia", nombre: "Guía", icono: "☰", desc: "Texto académico de estudio y método" },
  { id: "metodo", nombre: "Método", icono: "▤", desc: "Sistema o método de aprendizaje completo" }
];

/* Técnicas etiquetadas, usadas como filtro. */
window.CVM.tecnicas = [
  "Arco", "Digitación", "Cambios de posición", "Vibrato", "Afinación",
  "Escalas y arpegios", "Spiccato", "Martelé", "Legato", "Trinos",
  "Dobles cuerdas", "Armónicos", "Pizzicato", "Col legno", "Ricochet",
  "Sautillé", "Velocidad", "Lectura a primera vista", "Interpretación",
  "Música de cámara", "Virtuosismo"
];
