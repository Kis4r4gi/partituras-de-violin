/* Biblioteca académica: estudios técnicos de la escuela del violín y métodos.
   Ordenado por período histórico del compositor:
   Clasicismo → Romanticismo → Modernismo → Contemporáneo.
   Cada entrada lleva epoca (para agruparla por período) y autorVida (años del autor). */
window.CVM = window.CVM || {};
window.CVM.obras = window.CVM.obras || [];

window.CVM.obras.push(
  /* ================= CLASICISMO: escuela francesa (s. XVIII – XIX) ================= */
  {
    id: "a-kreutzer-42",
    tipo: "estudio",
    titulo: "42 estudios",
    compositor: "Rodolphe Kreutzer",
    autorVida: "1766 – 1831",
    epoca: "clasico",
    nivel: 4,
    instrumentacion: "Violín solo",
    duracion: "42 estudios",
    categoria: "Escuela clásica",
    tecnicas: ["Spiccato", "Escalas y arpegios", "Dobles cuerdas", "Velocidad"],
    notas:
      "Puerta de entrada al nivel avanzado. Clave: n.º 2 (legato y arco), n.º 5 " +
      "(cambios de cuerda), n.º 9 (bariolaje), n.º 13 (saltos) y n.º 16 (semicorcheas)."
  },
  {
    id: "a-rode-caprichos",
    tipo: "estudio",
    titulo: "24 caprichos",
    compositor: "Pierre Rode",
    autorVida: "1774 – 1830",
    epoca: "clasico",
    nivel: 6,
    instrumentacion: "Violín solo",
    duracion: "24 estudios",
    categoria: "Escuela clásica",
    tecnicas: ["Virtuosismo", "Legato", "Escalas y arpegios", "Interpretación"],
    notas:
      "Canto y elegancia francesa dentro de la técnica: el n.º 2 y el n.º 6 son " +
      "básicos. Estudio de la melodía en semicorcheas y del arco repartido."
  },
  {
    id: "a-fiorillo",
    tipo: "estudio",
    titulo: "36 estudios y caprichos",
    compositor: "Federico Fiorillo",
    autorVida: "1753 – 1819",
    epoca: "clasico",
    nivel: 6,
    instrumentacion: "Violín solo",
    duracion: "36 estudios",
    categoria: "Escuela clásica",
    tecnicas: ["Virtuosismo", "Velocidad", "Spiccato", "Dobles cuerdas"],
    notas: "Estudios brillantes de época de transición: ya suenan a concierto."
  },
  {
    id: "a-gavinies",
    tipo: "estudio",
    titulo: "24 estudios pedagógicos",
    compositor: "Pierre Gavinies",
    autorVida: "1745 – 1825",
    epoca: "clasico",
    nivel: 6,
    instrumentacion: "Violín solo",
    duracion: "24 estudios",
    categoria: "Escuela clásica",
    tecnicas: ["Virtuosismo", "Afinación", "Velocidad", "Dobles cuerdas"],
    notas:
      "Cumbre de la escuela francesa clásica: dificultad de sonido y de intención a " +
      "partes iguales."
  },
  {
    id: "a-mazas",
    tipo: "estudio",
    titulo: "Estudios especiales, op. 36 (Libros I, II y III)",
    compositor: "Jacques Féréol Mazas",
    autorVida: "1781 – 1858",
    epoca: "clasico",
    nivel: 4,
    instrumentacion: "Violín solo",
    duracion: "75 estudios",
    categoria: "Escuela clásica",
    tecnicas: ["Spiccato", "Velocidad", "Arco", "Interpretación"],
    notas:
      "Los del Libro I son estudios melódicos; los del II, de brío y arco rebote; " +
      "los del III, «études d'artiste» de concierto."
  },
  {
    id: "a-labbe",
    tipo: "estudio",
    titulo: "Estudios de la escuela francesa",
    compositor: "Nicolas L'Abbé",
    epoca: "clasico",
    nivel: 5,
    instrumentacion: "Violín solo",
    duracion: "24 estudios",
    categoria: "Escuela clásica",
    tecnicas: ["Escalas y arpegios", "Spiccato", "Velocidad"],
    notas:
      "Arpegios y escalas en estudios cortos: transición entre Kreutzer y Rode."
  },

  /* ================= ROMANTICISMO: escuelas alemana, belga y checa ================= */
  {
    id: "a-kayser",
    tipo: "estudio",
    titulo: "36 estudios, op. 20",
    compositor: "Heinrich Ernst Kayser",
    autorVida: "1815 – 1888",
    epoca: "romantico",
    nivel: 3,
    instrumentacion: "Violín solo",
    duracion: "36 estudios",
    categoria: "Escuela romántica",
    tecnicas: ["Arco", "Legato", "Digitación", "Interpretación"],
    notas:
      "Primer contacto con la escuela clásica de estudios: melodía + acompañamiento " +
      "en una sola cuerda, arco recto y frases de canto."
  },
  {
    id: "a-wohlfahrt",
    tipo: "estudio",
    titulo: "60 estudios, op. 45 y op. 47",
    compositor: "Franz Wohlfahrt",
    autorVida: "1833 – 1884",
    epoca: "romantico",
    nivel: 3,
    instrumentacion: "Violín solo",
    duracion: "60 estudios",
    categoria: "Escuela romántica",
    tecnicas: ["Digitación", "Arco", "Afinación", "Legato"],
    notas:
      "Los estudios más difundidos del nivel intermedio. El op. 45 trabaja la primera " +
      "posición con dobles cuerdas suaves; el op. 47 añade cambio de cuerda."
  },
  {
    id: "a-dont",
    tipo: "estudio",
    titulo: "Estudios-caprichos, op. 35 y op. 37",
    compositor: "Jakob Dont",
    autorVida: "1815 – 1888",
    epoca: "romantico",
    nivel: 5,
    instrumentacion: "Violín solo",
    duracion: "48 estudios",
    categoria: "Escuela romántica",
    tecnicas: ["Spiccato", "Velocidad", "Virtuosismo", "Dobles cuerdas"],
    notas:
      "Paso natural entre Kreutzer y Fiorillo: más carácter, más ritmo y más arco rebote."
  },
  {
    id: "a-sitt-32",
    tipo: "estudio",
    titulo: "Études, op. 32",
    compositor: "Hans Sitt",
    autorVida: "1850 – 1926",
    epoca: "romantico",
    nivel: 4,
    instrumentacion: "Violín solo",
    duracion: "Colección progresiva",
    categoria: "Escuela romántica",
    tecnicas: ["Digitación", "Escalas y arpegios", "Velocidad", "Arco"],
    notas:
      "El estudio bohemio por excelencia de finales del siglo XIX: progresivo, melódico " +
      "y con cambios de posición y cambios de cuerda trabajados de forma natural. " +
      "Puente entre Wohlfahrt/Kayser y los estudios de virtuosismo (Mazas, Kreutzer). " +
      "Dominio público, descargable en IMSLP."
  },
  {
    id: "a-sevcik-posicion",
    tipo: "estudio",
    titulo: "Ejercicios sistemáticos: cambio de posición y escalas preparatorias (op. 1, 2 y 3)",
    compositor: "Otakar Ševčík",
    autorVida: "1852 – 1934",
    epoca: "romantico",
    nivel: 3,
    instrumentacion: "Violín solo",
    duracion: "Curso completo",
    categoria: "Cambios de posición",
    tecnicas: ["Cambios de posición", "Escalas y arpegios", "Afinación"],
    notas:
      "El sistema más lógico para asentar el cambio de posición: cada dedo se estudia " +
      "aislado y después en cadena. Trabajar con metrónomo lento y espejo de mano."
  },
  {
    id: "a-sevcik-arco",
    tipo: "estudio",
    titulo: "Escuela del arco: variaciones de arqueo",
    compositor: "Otakar Ševčík",
    autorVida: "1852 – 1934",
    epoca: "romantico",
    nivel: 4,
    instrumentacion: "Violín solo",
    duracion: "Curso completo",
    categoria: "Arco",
    tecnicas: ["Arco", "Martelé", "Spiccato", "Legato"],
    notas:
      "Combinaciones de primera y segunda parte del arco: martelé, martelé ligero, " +
      "colé, saltando. Construye el control del rebote desde el bloqueo."
  },
  {
    id: "a-sevcik-dobles",
    tipo: "estudio",
    titulo: "Estudios preparatorios en dobles cuerdas",
    compositor: "Otakar Ševčík",
    autorVida: "1852 – 1934",
    epoca: "romantico",
    nivel: 4,
    instrumentacion: "Violín solo",
    duracion: "Curso completo",
    categoria: "Dobles cuerdas",
    tecnicas: ["Dobles cuerdas", "Afinación", "Arco"],
    notas:
      "Aísla cada par de cuerdas hasta que el dedo y el arco trabajan con independencia."
  },
  {
    id: "a-schradieck",
    tipo: "estudio",
    titulo: "Escuela de técnica para violín (Libro I: escalas, arpegios y dedos)",
    compositor: "Ernst Schradieck",
    autorVida: "1846 – 1928",
    epoca: "romantico",
    nivel: 3,
    instrumentacion: "Violín solo",
    duracion: "Diario",
    categoria: "Digitación",
    tecnicas: ["Digitación", "Escalas y arpegios", "Velocidad", "Afinación"],
    notas:
      "Secuencias de cuerdas repetidas que trabajan independencia del dedo 4 y " +
      "uniformidad del sonido. Calentamiento ideal de 10 minutos."
  },

  /* ================= MODERNISMO: escuela del siglo XX ================= */
  {
    id: "a-flesch-sistema",
    tipo: "estudio",
    titulo: "Sistema de escalas (Book of Scales)",
    compositor: "Carl Flesch",
    autorVida: "1873 – 1973",
    epoca: "modernista",
    nivel: 4,
    instrumentacion: "Violín solo",
    duracion: "Curso permanente",
    categoria: "Escalas y arpegios",
    tecnicas: ["Escalas y arpegios", "Afinación", "Velocidad"],
    notas:
      "Las 24 tonalidades con cambiaturas estandarizadas: el sistema de estudio de " +
      "escalas por excelencia. Rutina diaria de 15 a 20 minutos."
  },
  {
    id: "a-yost",
    tipo: "estudio",
    titulo: "Escuela de técnica para violín (3 libros)",
    compositor: "Gustav Yost",
    epoca: "modernista",
    nivel: 3,
    instrumentacion: "Violín solo",
    duracion: "3 libros",
    categoria: "Fundamentos",
    tecnicas: ["Cambios de posición", "Escalas y arpegios", "Afinación"],
    notas:
      "Secuencias cortas y muy ordenadas: excelente para ritmar el cambio de posición " +
      "desde el nivel 3."
  },
  {
    id: "a-bartok-estudios",
    tipo: "estudio",
    titulo: "44 Duos: uso pedagógico por niveles",
    compositor: "Béla Bartók",
    autorVida: "1881 – 1945",
    epoca: "modernista",
    nivel: 3,
    instrumentacion: "Dos violines",
    duracion: "44 piezas",
    categoria: "Oído y música de cámara",
    tecnicas: ["Música de cámara", "Afinación", "Interpretación"],
    notas:
      "Piezas progresivas: se pueden clasificar por nivel para clase de grupo. Trabajan " +
      "la segunda menor, la escala menor y los acentos asimétricos."
  },

  /* ================= MÉTODOS ================= */
  {
    id: "a-spohr-schule",
    tipo: "metodo",
    titulo: "Violinschule (Escuela de violín)",
    compositor: "Louis Spohr",
    autorVida: "1784 – 1859",
    epoca: "romantico",
    nivel: 4,
    instrumentacion: "Tratado con ejemplos",
    duracion: "Método completo",
    categoria: "Tratado histórico",
    tecnicas: ["Arco", "Interpretación", "Vibrato", "Digitación"],
    notas:
      "Método del gran solista romántico: parte técnica (digitación, arco, efectos) y " +
      "parte artística (tempo, rubato, expresión). Referencia de la escuela alemana."
  },
  {
    id: "a-david-schule",
    tipo: "metodo",
    titulo: "Violinschule (Escuela de violín)",
    compositor: "Ferdinand David",
    autorVida: "1810 – 1873",
    epoca: "romantico",
    nivel: 5,
    instrumentacion: "Tratado con estudios",
    duracion: "Método completo",
    categoria: "Tratado histórico",
    tecnicas: ["Arco", "Digitación", "Escalas y arpegios", "Interpretación"],
    notas:
      "Rigor clásico con el virtuosismo romántico: escalas sistemáticas y selección " +
      "comentada de estudios. Base de la escuela alemana posterior."
  },
  {
    id: "a-baillot-methode",
    tipo: "metodo",
    titulo: "Méthode du violon (Método del Conservatorio de París)",
    compositor: "Pierre Baillot",
    autorVida: "1789 – 1842",
    epoca: "romantico",
    nivel: 4,
    instrumentacion: "Tratado con estudios",
    duracion: "Método completo",
    categoria: "Tratado histórico",
    tecnicas: ["Escalas y arpegios", "Arco", "Interpretación"],
    notas:
      "El método oficial del Conservatorio de París: la escala como base de la " +
      "afinación y una teoría del fraseo que ordena todo el repertorio de la época."
  },
  {
    id: "a-beriot-methode",
    tipo: "metodo",
    titulo: "Méthode de violon",
    compositor: "Charles de Bériot",
    autorVida: "1802 – 1870",
    epoca: "romantico",
    nivel: 3,
    instrumentacion: "Método con piezas",
    duracion: "Método completo",
    categoria: "Método por niveles",
    tecnicas: ["Digitación", "Arco", "Escalas y arpegios", "Interpretación"],
    notas:
      "Método de la escuela belga: progresión clara desde la primera posición hasta " +
      "los pasajes de concierto, con piezas cantables desde las primeras lecciones."
  },
  {
    id: "a-suzuki",
    tipo: "metodo",
    titulo: "Método Suzuki (Libros 1 a 7)",
    compositor: "Shinichi Suzuki",
    autorVida: "1898 – 1998",
    epoca: "contemporaneo",
    nivel: 1,
    instrumentacion: "Violín y piano (o grupo)",
    duracion: "7 libros",
    categoria: "Método por niveles",
    tecnicas: ["Interpretación", "Afinación", "Arco", "Digitación"],
    notas:
      "Educación por el oído, repetición y repertorio desde la primera lección. " +
      "Libros 1–2: niveles 1–3. Libros 3–4: niveles 4–5. Libros 5–7: nivel 6. " +
      "Ideal combinado con un libro técnico (Ševčík o Schradieck)."
  },
  {
    id: "a-rolland",
    tipo: "metodo",
    titulo: "La enseñanza de la acción en la técnica de cuerda",
    compositor: "Paul Rolland",
    autorVida: "1906 – 1986",
    epoca: "contemporaneo",
    nivel: 1,
    instrumentacion: "Violín, viola, cello y contrabajo",
    duracion: "Curso completo",
    categoria: "Acción y relajación",
    tecnicas: ["Arco", "Postura", "Interpretación", "Legato"],
    notas:
      "Acciones básicas con el arco en el suelo antes de tomar el instrumento. " +
      "Prevención de tensión desde el primer día: codo libre, pulgar móvil, mano abierta."
  },
  {
    id: "a-galamian",
    tipo: "metodo",
    titulo: "Principios de tocar y enseñar el violín",
    compositor: "Ivan Galamian",
    autorVida: "1904 – 1981",
    epoca: "contemporaneo",
    nivel: 5,
    instrumentacion: "Libro de referencia",
    duracion: "Tratado",
    categoria: "Tratado de interpretación",
    tecnicas: ["Interpretación", "Arco", "Digitación", "Afinación"],
    notas:
      "El tratado clásico del siglo XX: ritmo interior, dirección del fraseo, preparación " +
      "de las escalas y metodología de ensayo. Referencia obligada del profesorado."
  },
  {
    id: "a-flesch",
    tipo: "metodo",
    titulo: "El arte de tocar el violín",
    compositor: "Carl Flesch",
    autorVida: "1873 – 1973",
    epoca: "modernista",
    nivel: 5,
    instrumentacion: "Libro de referencia",
    duracion: "Tratado",
    categoria: "Tratado de interpretación",
    tecnicas: ["Afinación", "Arco", "Digitación", "Interpretación"],
    notas:
      "Sistema de escalas y dedos, vibrato, sonido y el rango de la técnica. Incluye " +
      "los Test y ejercicios de diagnóstico."
  },
  {
    id: "a-auer",
    tipo: "metodo",
    titulo: "La escuela del violín según Auer",
    compositor: "Leopold Auer",
    autorVida: "1845 – 1930",
    epoca: "modernista",
    nivel: 5,
    instrumentacion: "Libro de referencia",
    duracion: "Tratado",
    categoria: "Tratado de interpretación",
    tecnicas: ["Interpretación", "Arco", "Digitación"],
    notas:
      "Reúne los estudios que Auer exigía a sus alumnos (Kreutzer, Rode, Bériot). " +
      "Rigor de la escuela rusa: efectos, fraseo y repertorio de concierto."
  },
  {
    id: "a-joachim-moser",
    tipo: "metodo",
    titulo: "Escuela del violín (Schule des Violinspiels)",
    compositor: "Joseph Joachim y Andreas Moser",
    autorVida: "1831 – 1907 · 1855 – 1934",
    epoca: "modernista",
    nivel: 5,
    instrumentacion: "Libro de referencia",
    duracion: "Tratado en 3 partes",
    categoria: "Tratado de interpretación",
    tecnicas: ["Digitación", "Afinación", "Interpretación", "Arco"],
    notas:
      "Tratado de la escuela germana (1905–1915): digitación a dos voces, arco clásico " +
      "y una gran selección de estudios y obras por niveles."
  }
);
