/* Enlaces externos que complementan la información de los autores.
   Solo se usan patrones de búsqueda estables (Wikipedia, IMSLP, YouTube,
   Google Libros): los resultados se abren en una pestaña nueva.
   Clave del mapa: nombre del compositor normalizado (sin acentos, sin
   puntuación, en minúsculas). Lo normaliza app.js → normAutor(). */
window.CVM = window.CVM || {};

window.CVM.enlaces = {

  /* Consultas curadas por autor: { videos: [...], lecturas: [...] } */
  autores: {
    "johann sebastian bach": {
      videos: [
        "Bach Chaconne BWV 1004 violín",
        "Bach Sonatas y Partitas violín completo",
        "Bach Concierto violín Re mayor BWV 1042"
      ],
      lecturas: [
        "Bach Sonatas y Partitas BWV 1001-1006 análisis"
      ]
    },
    "antonio vivaldi": {
      videos: [
        "Vivaldi Las cuatro estaciones violín completo",
        "Vivaldi Concierto La primavera Il Giardino Armonico"
      ],
      lecturas: ["Vivaldi Las cuatro estaciones análisis estructura"]
    },
    "arcangelo corelli": {
      videos: ["Corelli Sonatas op 5 violín", "Corelli La Follia violín"],
      lecturas: ["Corelli Sonatas opus 5 historia"]
    },
    "giuseppe tartini": {
      videos: ["Tartini Trillo del diablo violín", "Tartini Concierto violín re mayor"],
      lecturas: ["Tartini Devil's Trill sonata historia"]
    },
    "george frideric handel": {
      videos: ["Handel Sonata violín op 1", "Handel Fuego de artificio violín"],
      lecturas: []
    },
    "wolfgang amadeus mozart": {
      videos: [
        "Mozart Concierto violín Sol mayor K 216",
        "Mozart Sonata violín Fa mayor K 547",
        "Mozart Sinfonía 40 arreglos violín"
      ],
      lecturas: ["Mozart Conciertos violín K 216 K 218 K 219 análisis"]
    },
    "ludwig van beethoven": {
      videos: [
        "Beethoven Concierto violín op 61",
        "Beethoven Sonata Kreutzer violín"
      ],
      lecturas: ["Beethoven Concierto violín op 61 análisis"]
    },
    "joseph haydn": {
      videos: ["Haydn Concierto violín Sol mayor Hob VIIa 4", "Haydn Sonatas violín"],
      lecturas: []
    },
    "giovanni battista viotti": {
      videos: ["Viotti Concierto violín 29", "Viotti Sonatas violín"],
      lecturas: []
    },
    "henry purcell": {
      videos: ["Purcell Sonatas violín purcell", "Purcell Dido y Eneas aria"],
      lecturas: []
    },
    "tomaso albinoni remo giazotto": {
      videos: ["Albinoni Adagio en Sol menor violín"],
      lecturas: ["Albinoni Adagio Giazotto autenticidad"]
    },
    "pietro locatelli": {
      videos: ["Locatelli Arte del violín concierto", "Locatelli L'Arte del Violino"],
      lecturas: []
    },

    /* ---------------- ROMANTICISMO ---------------- */
    "felix mendelssohn": {
      videos: [
        "Mendelssohn Concierto violín Mi menor op 64",
        "Mendelssohn Sonata violín Fa mayor op 4"
      ],
      lecturas: ["Mendelssohn Concierto op 64 análisis"]
    },
    "max bruch": {
      videos: [
        "Bruch Concierto violín Sol menor op 26",
        "Bruch Scottish Fantasy violín"
      ],
      lecturas: ["Bruch Concierto Sol menor op 26 análisis"]
    },
    "johannes brahms": {
      videos: [
        "Brahms Concierto violín Re mayor op 77",
        "Brahms Sonatas violín op 78 op 100"
      ],
      lecturas: ["Brahms Concierto op 77 análisis"]
    },
    "pyotr ilich tchaikovsky": {
      videos: [
        "Tchaikovsky Concierto violín op 35",
        "Tchaikovsky Souvenir de une place lovée"
      ],
      lecturas: ["Tchaikovsky Concierto op 35 análisis"]
    },
    "niccolo paganini": {
      videos: [
        "Paganini Capricho n 24 violín",
        "Paganini 24 Caprichos op 1 completo",
        "Paganini La campanella violín"
      ],
      lecturas: ["Paganini 24 Caprichos historia técnica"]
    },
    "henryk wieniawski": {
      videos: ["Wieniawski Scherzo op 16", "Wieniawski Obertaso Fantasía op 17"],
      lecturas: []
    },
    "pablo de sarasate": {
      videos: [
        "Sarasate Zigeunerweisen violín",
        "Sarasate Capricho andaluz",
        "Sarasate Aire de gitanos"
      ],
      lecturas: []
    },
    "camille saint saens": {
      videos: ["Saint-Saëns Introducción y Rondo caprichoso", "Saint-Saëns Concierto violín n 3"],
      lecturas: []
    },
    "antonin dvorak": {
      videos: ["Dvořák Concierto violín op 53", "Dvořák Sonatas violín"],
      lecturas: ["Dvořák Concierto op 53 análisis"]
    },
    "jean sibelius": {
      videos: ["Sibelius Concierto violín re menor op 47"],
      lecturas: ["Sibelius Concierto op 47 análisis"]
    },
    "edward elgar": {
      videos: ["Elgar Concierto violín mi menor op 61", "Elgar Salut d'amour"],
      lecturas: []
    },
    "cesar franck": {
      videos: ["Franck Sonata violín La mayor"],
      lecturas: ["Franck Sonata violín análisis"]
    },
    "gabriel faure": {
      videos: ["Fauré Sonata violín op 13", "Fauré Berceuse op 16"],
      lecturas: []
    },
    "fritz kreisler": {
      videos: [
        "Kreisler Liebesleid violín",
        "Kreisler Rondino sobre temas de Beethoven",
        "Kreisler Recitativo y Scherzo caprice"
      ],
      lecturas: ["Kreisler atribuciones autenticidad"]
    },
    "robert schumann": {
      videos: ["Schumann Concierto violín Re menor op 61", "Schumann Sonatas violín op 105"],
      lecturas: []
    },
    "george enescu": {
      videos: ["Enescu Sonata n 3 violín", "Enescu Rapsodia rumana violín"],
      lecturas: []
    },
    "henri vieuxtemps": {
      videos: ["Vieuxtemps Concierto violín n 4", "Vieuxtemps Tarantella op 16"],
      lecturas: []
    },
    "ernest chausson": {
      videos: ["Chausson Poème op 25", "Chausson Concierto para violín orquesta piano"],
      lecturas: []
    },
    "joseph joachim raff": {
      videos: ["Raff Cavatina op 85 violín"],
      lecturas: []
    },

    /* ---------------- MODERNISTA Y CONTEMPORÁNEO ---------------- */
    "claude debussy": {
      videos: ["Debussy Sonata violín", "Debussy La fille aux cheveux de lin arreglo"],
      lecturas: []
    },
    "maurice ravel": {
      videos: ["Ravel Tzigane", "Ravel Sonata violín segundo movimiento blues"],
      lecturas: ["Ravel Tzigane historia"]
    },
    "igor stravinsky": {
      videos: ["Stravinsky Duo pour deux violons", "Stravinsky Concertino violín"],
      lecturas: []
    },
    "sergei prokofiev": {
      videos: [
        "Prokofiev Concierto violín n 1",
        "Prokofiev Concierto violín n 2"
      ],
      lecturas: ["Prokofiev Conciertos violín análisis"]
    },
    "bela bartok": {
      videos: [
        "Bartók 44 Duos violín",
        "Bartók Concierto violín n 2",
        "Bartók Rapsodia n 1 op 1"
      ],
      lecturas: ["Bartók 44 Duos pedagogía"]
    },
    "eugene ysaye": {
      videos: [
        "Ysaÿe Sonatas para violín solo op 27",
        "Ysaÿe Chaconne op 27 n 2"
      ],
      lecturas: ["Ysaÿe Sonatas op 27 historia"]
    },
    "arnold schoenberg": {
      videos: ["Schoenberg Sonata violín op 27", "Schoenberg Verklärte Nacht cuerda"],
      lecturas: []
    },
    "karol szymanowski": {
      videos: ["Szymanowski Concierto violín op 35", "Szymanowski Mity op 30"],
      lecturas: []
    },
    "leos janacek": {
      videos: ["Janáček Sonata violín", "Janáček Balada Blaník"],
      lecturas: []
    },
    "dmitri shostakovich": {
      videos: [
        "Shostakovich Concierto violín n 1 op 77",
        "Shostakovich Concierto violín n 2 op 129",
        "Shostakovich Sonatas violín op 134"
      ],
      lecturas: ["Shostakovich Conciertos violín análisis"]
    },
    "gyorgy ligeti": {
      videos: ["Ligeti Sonata violín"], lecturas: []
    },
    "arvo part": {
      videos: ["Pärt Spiegel im Spiegel violín", "Pärt Fratres violín"],
      lecturas: []
    },
    "astor piazzolla": {
      videos: [
        "Piazzolla Libertango violín",
        "Piazzolla Primavera porteña violín",
        "Piazzolla Verano porteño arrastre"
      ],
      lecturas: ["Piazzolla tango nuevo historia"]
    },
    "john williams": {
      videos: ["John Williams Tema de Schindler violín", "John Williams Jurassic Park arreglo"],
      lecturas: []
    },
    "ennio morricone": {
      videos: ["Morricone Cinco días una noche tema", "Morricone El bueno el malo y el feo"],
      lecturas: []
    },
    "aram khachaturian": {
      videos: ["Khachaturian Sabre Dance arreglo"], lecturas: []
    },
    "leonard bernstein": {
      videos: ["Bernstein West Side Story violín", "Bernstein Candide ova"],
      lecturas: []
    },
    "manuel de falla": {
      videos: ["Falla El amor brujo romance"], lecturas: []
    },

    /* ---------------- PEDAGOGOS Y ESCUELA DEL VIOLÍN ---------------- */
    "rodolphe kreutzer": {
      videos: [
        "Kreutzer 42 estudios violín n 2",
        "Kreutzer Estudios op 4 n 11",
        "Kreutzer Concierto violín n 3"
      ],
      lecturas: ["Kreutzer 42 estudios importancia pedagógica"]
    },
    "pierre rode": {
      videos: ["Rode 24 Caprichos violín", "Rode Estudios violín"],
      lecturas: []
    },
    "jacques fereol mazas": {
      videos: ["Mazas Estudios especiales op 36", "Mazas Estudios Brillantes"],
      lecturas: []
    },
    "franz wohlfahrt": {
      videos: ["Wohlfahrt op 45 estudios violín", "Wohlfahrt op 47 estudios"],
      lecturas: []
    },
    "heinrich ernst kayser": {
      videos: ["Kayser 36 estudios op 20 violín"], lecturas: []
    },
    "federico fiorillo": {
      videos: ["Fiorillo 36 estudios violín"], lecturas: []
    },
    "pierre gavinies": {
      videos: ["Gavinies 24 estudios op 1 violín"], lecturas: []
    },
    "jakob dont": {
      videos: ["Dont Estudios caprichos op 35", "Dont op 38 preludios"], lecturas: []
    },
    "otakar sevcik": {
      videos: [
        "Ševčík Escuela del arco variaciones",
        "Ševčík Cambio de posición op 1",
        "Ševčík Dobles cuerdas op 3"
      ],
      lecturas: ["Ševčík School of Violin Technique método"]
    },
    "hans sitt": {
      videos: ["Sitt Études op 32 violín", "Sitt Estudios progresivos"],
      lecturas: []
    },
    "ernst schradieck": {
      videos: ["Schradieck Escuela de técnica violín"], lecturas: []
    },
    "carl flesch": {
      videos: [
        "Flesch Sistema de escalas violín",
        "Flesch Scale System rutina diaria"
      ],
      lecturas: ["Carl Flesch The Art of Violin Playing resumen"]
    },
    "ivan galamian": {
      videos: ["Galamian Principios de tocar el violín", "Galamian escala metrónomo"],
      lecturas: ["Galamian principles of teaching and playing the violin"]
    },
    "shinichi suzuki": {
      videos: [
        "Método Suzuki violín clase",
        "Suzuki Nurtured by Love conferencia",
        "Suzuki Libro 1 violín"
      ],
      lecturas: ["Suzuki método talento escuela materna"]
    },
    "paul rolland": {
      videos: ["Paul Rolland violín acciones básicas", "Rolland string teaching"],
      lecturas: []
    },
    "leopold auer": {
      videos: ["Auer La escuela del violín", "Auer Ysaÿe Kreisler escuela rusa"],
      lecturas: []
    },
    "leopold mozart": {
      videos: ["Leopold Mozart Escuela de violín 1756", "Leopold Mozart Pequeña serenata"],
      lecturas: ["Leopold Mozart Violinschule tratado 1756"]
    },
    "giovanni battista geminiani": {
      videos: ["Geminiani The Art of Playing on the Violin", "Geminiani Sonatas op 5"],
      lecturas: ["Geminiani Art of Playing on the Violin 1751"]
    },
    "pierre baillot": {
      videos: ["Baillot L'art du violon", "Baillot Método Conservatorio París"],
      lecturas: []
    },
    "louis spohr": {
      videos: ["Spohr Concierto violín n 8", "Spohr Violinschule"], lecturas: []
    },
    "ferdinand david": {
      videos: ["Ferdinand David Concierto violín", "Ferdinand David Violinschule"],
      lecturas: []
    },
    "charles de beriot": {
      videos: ["Bériot Escena balada op 25", "Bériot Méthode de violon"],
      lecturas: []
    },
    "simon fischer": {
      videos: ["Simon Fischer Basics violín", "Simon Fischer Practice método"],
      lecturas: []
    },
    "fritz kreisler atrib a pugnani": {
      videos: ["Kreisler Rondino Beethoven"], lecturas: []
    }
  },

  /* Recursos externos por época de la historia de la música */
  epocas: {
    "medieval-renacentista": {
      wiki: "Música medieval y del Renacimiento",
      videos: ["Música medieval violín da braccio", "Renacimiento violín viola da gamba"],
      lecturas: ["Historia del violín orígenes viola"]
    },
    "barroco": {
      wiki: "Música barroca",
      videos: ["Música barroca violín concierto grosso", "Arco barroco interpretación histórica"],
      lecturas: ["Barroco escuelas de interpretación tratados"]
    },
    "clasico": {
      wiki: "Clasicismo (música)",
      videos: ["Música clásica violín Mozart Haydn", "Escuela clásica del violín Kreutzer"],
      lecturas: ["Clasicismo violín escuela francesa"]
    },
    "romantico": {
      wiki: "Música romántica",
      videos: ["Romanticismo violín virtuosismo Paganini", "Conciertos románticos violín"],
      lecturas: ["Romanticismo escuelas nacionales del violín"]
    },
    "modernista": {
      wiki: "Música moderna (siglo XX)",
      videos: ["Música moderna siglo XX violín", "Impresionismo violín Debussy Ravel"],
      lecturas: ["Siglo XX técnica del violín"]
    },
    "contemporaneo": {
      wiki: "Música contemporánea",
      videos: ["Música contemporánea violín nuevas técnicas", "Violín experimental siglo XXI"],
      lecturas: ["Técnicas extendidas del violín"]
    }
  }
};
