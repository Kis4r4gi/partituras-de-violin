/* Partituras de violín — lógica de la aplicación (SPA sin dependencias). */
(function () {
  "use strict";

  var C = window.CVM;
  var store = C.store;
  var items = C.obras || [];

  var erasById = {};
  C.epocas.forEach(function (e) { erasById[e.id] = e; });
  var tiposById = {};
  C.tipos.forEach(function (t) { tiposById[t.id] = t; });
  var nivelesById = {};
  C.niveles.forEach(function (n) { nivelesById[n.id] = n; });

  var $main = document.getElementById("main");
  var $q = document.getElementById("q");
  var $tabs = document.getElementById("tabs");
  var $modal = document.getElementById("modal");
  var $modalBody = document.getElementById("modalBody");

  /* ---------- utilidades ---------- */
  function norm(s) {
    return (s == null ? "" : String(s)).toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }
  function esc(s) {
    return String(s == null ? "" : s)
      .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
      .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
  }
  function clip(s, n) {
    s = String(s == null ? "" : s).replace(/\s+/g, " ");
    return s.length > n ? s.slice(0, n).trim() + "…" : s;
  }
  function badge(txt, cls) {
    return '<span class="badge ' + (cls || "") + '">' + esc(txt) + "</span>";
  }
  function toast(msg) {
    var el = document.createElement("div");
    el.textContent = msg;
    el.style.cssText =
      "position:fixed;left:50%;bottom:24px;transform:translateX(-50%);z-index:99;" +
      "background:#221e19;border:1px solid #d9a441;color:#f0c574;padding:10px 16px;" +
      "border-radius:999px;font-size:13.5px;box-shadow:0 10px 30px rgba(0,0,0,.5)";
    document.body.appendChild(el);
    setTimeout(function () { el.remove(); }, 2200);
  }

  /* índice de búsqueda */
  items.forEach(function (it) {
    var era = it.epoca ? erasById[it.epoca] : null;
    it._hay = norm([
      it.titulo, it.compositor, it.notas, it.categoria, it.instrumentacion,
      (it.tecnicas || []).join(" "), era ? era.nombre : "biblioteca academica",
      "nivel " + it.nivel, it.tipo,
      (it.contenido || []).join(" ")
    ].join(" "));
  });

  /* ---------- rutas ---------- */
  function parseRoute() {
    var h = location.hash.replace(/^#\/?/, "");
    var qi = h.indexOf("?");
    var view = qi >= 0 ? h.slice(0, qi) : h;
    var params = {};
    if (qi >= 0) {
      h.slice(qi + 1).split("&").forEach(function (pair) {
        if (!pair) return;
        var kv = pair.split("=");
        params[decodeURIComponent(kv[0])] = decodeURIComponent((kv[1] || "").replace(/\+/g, " "));
      });
    }
    if (!view) view = "inicio";
    return { view: view, params: params };
  }
  function buildHash(view, params) {
    var qs = Object.keys(params || {})
      .filter(function (k) { return params[k] !== "" && params[k] != null; })
      .map(function (k) { return encodeURIComponent(k) + "=" + encodeURIComponent(params[k]); })
      .join("&");
    return "#/" + view + (qs ? "?" + qs : "");
  }
  function setRoute(view, params, replace) {
    var h = buildHash(view, params);
    if (replace) {
      try {
        history.replaceState(null, "", h);
        render();
      } catch (e) {
        /* algunos navegadores bloquean replaceState en file:// */
        if (location.hash === h) render();
        else location.hash = h;
      }
      return;
    }
    if (location.hash === h) render();
    else location.hash = h;
  }

  /* ---------- datos derivados ---------- */
  function filterItems(p) {
    var q = norm(p.q);
    return items.filter(function (it) {
      if (q && it._hay.indexOf(q) === -1) return false;
      if (p.epoca && String(it.epoca || "") !== p.epoca) return false;
      if (p.nivel && String(it.nivel) !== p.nivel) return false;
      if (p.tipo && it.tipo !== p.tipo) return false;
      if (p.cat && it.categoria !== p.cat) return false;
      if (p.tec && !(it.tecnicas || []).some(function (t) { return norm(t) === norm(p.tec); })) return false;
      if (p.fav === "1" && !store.isFav(it.id)) return false;
      if (p.est && store.getEstado(it.id) !== p.est) return false;
      return true;
    });
  }
  function sortItems(arr, orden) {
    var a = arr.slice();
    if (orden === "titulo") a.sort(function (x, y) { return x.titulo.localeCompare(y.titulo, "es"); });
    else if (orden === "compositor") a.sort(function (x, y) { return x.compositor.localeCompare(y.compositor, "es"); });
    else if (orden === "nivel") a.sort(function (x, y) { return x.nivel - y.nivel; });
    else if (orden === "epoca") a.sort(function (x, y) {
      var ox = x.epoca ? erasById[x.epoca].orden : 99;
      var oy = y.epoca ? erasById[y.epoca].orden : 99;
      return ox - oy || x.nivel - y.nivel;
    });
    return a;
  }
  function countBy(fn) { return items.filter(fn).length; }

  /* ---------- fragmentos de interfaz ---------- */
  function cardHTML(it) {
    var era = it.epoca ? erasById[it.epoca] : null;
    var tipo = tiposById[it.tipo] || { icono: "•", nombre: it.tipo };
    var fav = store.isFav(it.id);
    var est = store.getEstado(it.id);
    return '' +
      '<article class="card" data-open="' + it.id + '" tabindex="0">' +
        '<button class="fav-star' + (fav ? " on" : "") + '" data-fav="' + it.id + '" title="Favorito" aria-label="Favorito">' + (fav ? "★" : "☆") + "</button>" +
        "<h4>" + esc(it.titulo) + "</h4>" +
        '<div class="composer">' + esc(it.compositor) +
          (it.autorVida ? ' <span class="life">(' + esc(it.autorVida) + ")</span>" : "") + "</div>" +
        '<div class="meta">' +
          badge(tipo.icono + " " + tipo.nombre, "tipo") +
          (era ? badge(era.nombre, "era") : badge("Biblioteca académica", "")) +
          badge("Nivel " + it.nivel, "lvl-" + it.nivel) +
          (est !== "pendiente" ? badge(est === "estudiada" ? "Estudiada" : "Estudiando", "state-" + est) : "") +
        "</div>" +
        '<div class="excerpt">' + esc(clip(it.notas, 130)) + "</div>" +
      "</article>";
  }
  function gridHTML(arr, cls) {
    if (!arr.length) return '<div class="empty">Sin resultados. Probá con otra palabra o quitá algún filtro.</div>';
    return '<div class="grid ' + (cls || "") + '">' + arr.map(cardHTML).join("") + "</div>";
  }
  function rowHTML(it) {
    var est = store.getEstado(it.id);
    return '<div class="row" data-open="' + it.id + '">' +
      '<div class="row-main"><strong>' + esc(it.titulo) + "</strong><span>" + esc(it.compositor) + "</span></div>" +
      '<div class="row-side">' + badge("Nivel " + it.nivel, "lvl-" + it.nivel) +
        (est !== "pendiente" ? badge(est === "estudiada" ? "✓ Estudiada" : "● Estudiando", "state-" + est) : "") +
      "</div></div>";
  }

  /* ---------- vistas ---------- */
  function viewInicio() {
    var obras = countBy(function (i) { return i.tipo === "obra"; });
    var estudios = countBy(function (i) { return i.tipo === "estudio"; });
    var guias = countBy(function (i) { return i.tipo === "guia"; });
    var metodos = countBy(function (i) { return i.tipo === "metodo"; });
    var bibliografia = countBy(function (i) { return i.tipo === "bibliografia"; });
    var destacados = [
      "b-bach-partita2-chaconne", "b-vivaldi-cuatro-estaciones", "c-mozart-k216",
      "r-bruch-op26", "r-tchaikovsky-op35", "m-debussy-sonata", "n-piazzolla-libertango",
      "a-kreutzer-42", "g-como-estudiar"
    ].map(function (id) { return items.find(function (i) { return i.id === id; }); }).filter(Boolean);

    var h = '' +
      '<section class="hero">' +
        "<h2>Estudiá el violín por épocas y niveles</h2>" +
        "<p>Repertorio de la historia de la música (barroco, clasicismo, romanticismo, modernismo y " +
        "contemporáneo) junto a la biblioteca académica del instrumento: estudios, métodos y guías " +
        "para avanzar desde la postura hasta la audición profesional.</p>" +
        '<div class="stats">' +
          '<div class="stat"><b>' + obras + "</b><span>Obras</span></div>" +
          '<div class="stat"><b>' + estudios + "</b><span>Estudios</span></div>" +
          '<div class="stat"><b>' + guias + "</b><span>Guías</span></div>" +
          '<div class="stat"><b>' + metodos + "</b><span>Métodos</span></div>" +
          '<div class="stat"><b>' + bibliografia + "</b><span>Bibliografía</span></div>" +
          '<div class="stat"><b>' + C.epocas.length + "</b><span>Épocas</span></div>" +
          '<div class="stat"><b>' + C.niveles.length + "</b><span>Niveles</span></div>" +
        "</div>" +
      "</section>";

    h += '<section class="section"><div class="section-head"><h3>Repertorio por épocas</h3>' +
      '<a href="#/epocas">Ver todas</a></div><div class="chips">' +
      C.epocas.map(function (e) {
        var n = countBy(function (i) { return i.epoca === e.id; });
        return '<a class="chip" href="#/catalogo?epoca=' + e.id + '">' + esc(e.nombre) +
          ' <span class="badge">' + n + "</span></a>";
      }).join("") + "</div></section>";

    h += '<section class="section"><div class="section-head"><h3>Ruta por niveles</h3>' +
      '<a href="#/niveles">Ver niveles</a></div><div class="chips">' +
      C.niveles.map(function (n) {
        var c = countBy(function (i) { return i.nivel === n.id; });
        return '<a class="chip" href="#/catalogo?nivel=' + n.id + '">Nivel ' + n.id +
          ' <span class="badge">' + c + "</span></a>";
      }).join("") + "</div></section>";

    h += '<section class="section"><div class="section-head"><h3>Estudios por compositor y período</h3>' +
      '<a href="#/biblioteca?tipo=estudio">Ver agrupados en la Biblioteca</a></div><div class="chips">' +
      C.epocas.map(function (e) {
        var n = countBy(function (i) { return i.tipo === "estudio" && i.epoca === e.id; });
        if (!n) return "";
        var autores = {};
        items.forEach(function (i) {
          if (i.tipo === "estudio" && i.epoca === e.id) autores[i.compositor] = true;
        });
        return '<a class="chip" href="#/catalogo?tipo=estudio&epoca=' + e.id + '" title="' +
          esc(Object.keys(autores).join(", ")) + '">' + esc(e.nombre) +
          ' <span class="badge">' + n + " estudios</span></a>";
      }).join("") + "</div></section>";

    h += '<section class="section"><div class="section-head"><h3>Para empezar hoy</h3>' +
      '<a href="#/catalogo">Catálogo completo</a></div>' + gridHTML(destacados) + "</section>";

    h += '<section class="section"><div class="section-head"><h3>Cómo usar la aplicación</h3></div>' +
      '<div class="grid wide">' +
        '<div class="card" data-goto="#/epocas"><h4>1. Elegí una época</h4><div class="excerpt">' +
          "Cada época explica qué técnica y qué sonido se trabajan en sus obras, del barroco al presente.</div></div>" +
        '<div class="card" data-goto="#/niveles"><h4>2. Revisá tu nivel</h4><div class="excerpt">' +
          "Los 7 niveles listan los requisitos: escalas, estudios y repertorio que hay que dominar para avanzar.</div></div>" +
        '<div class="card" data-goto="#/biblioteca"><h4>3. Estudiá con la biblioteca</h4><div class="excerpt">' +
          "Guías de postura, arco, vibrato y método de estudio; estudios de Ševčík a Galamian.</div></div>" +
      "</div></section>";

    return h;
  }

  function selectHTML(name, label, options, current) {
    return "<label>" + esc(label) + '<select data-filter="' + name + '">' +
      options.map(function (o) {
        return '<option value="' + esc(o.v) + '"' + (String(current || "") === String(o.v) ? " selected" : "") + ">" +
          esc(o.t) + "</option>";
      }).join("") + "</select></label>";
  }

  function viewCatalogo(p) {
    var arr = sortItems(filterItems(p), p.orden);

    var tecnicas = {};
    items.forEach(function (i) { (i.tecnicas || []).forEach(function (t) { tecnicas[t] = true; }); });
    var cats = {};
    items.forEach(function (i) { if (i.categoria) cats[i.categoria] = true; });

    var h = '<div class="filters">' +
      selectHTML("epoca", "Época", [{ v: "", t: "Todas" }].concat(C.epocas.map(function (e) { return { v: e.id, t: e.nombre }; })), p.epoca) +
      selectHTML("nivel", "Nivel", [{ v: "", t: "Todos" }].concat(C.niveles.map(function (n) { return { v: n.id, t: "Nivel " + n.id + " · " + n.alias }; })), p.nivel) +
      selectHTML("tipo", "Tipo de material", [{ v: "", t: "Todos" }].concat(C.tipos.map(function (t) { return { v: t.id, t: t.nombre }; })), p.tipo) +
      selectHTML("tec", "Técnica", [{ v: "", t: "Todas" }].concat(Object.keys(tecnicas).sort().map(function (t) { return { v: t, t: t }; })), p.tec) +
      selectHTML("orden", "Orden", [
        { v: "", t: "Relevancia" }, { v: "nivel", t: "Nivel (fácil → difícil)" },
        { v: "titulo", t: "Título A–Z" }, { v: "compositor", t: "Compositor A–Z" },
        { v: "epoca", t: "Época histórica" }
      ], p.orden) +
      '<div class="filter-actions">' +
        '<button class="btn' + (p.fav === "1" ? " on" : "") + '" data-togglefav="1">★ Favoritos</button>' +
        '<button class="ghost-btn" data-clear="1">Limpiar</button>' +
      "</div></div>";

    if (p.cat) {
      h += '<div class="chips" style="margin:-4px 0 14px">' +
        '<span class="chip">Categoría: ' + esc(p.cat) + "</span>" +
        '<button class="chip x" data-rmcat="1">Quitar filtro ✕</button></div>';
    }

    h += '<p class="result-line"><span><b>' + arr.length + "</b> elementos encontrados" +
      (p.q ? ' para «' + esc(p.q) + "»" : "") + "</span>" +
      '<span><button class="ghost-btn" data-savesearch="1">☆ Guardar esta búsqueda</button></span></p>';

    h += gridHTML(arr);
    return h;
  }

  function viewEpocas() {
    var h = '<div class="section-head"><h3>Épocas de la historia del repertorio</h3></div>' +
      '<div class="grid wide">' +
      C.epocas.map(function (e) {
        var n = countBy(function (i) { return i.epoca === e.id; });
        return '<a class="era-card" href="#/catalogo?epoca=' + e.id + '">' +
          '<div class="range">' + esc(e.rango) + "</div>" +
          "<h4>" + esc(e.nombre) + "</h4>" +
          "<p>" + esc(e.resumen) + "</p>" +
          '<div class="tags">' + e.claves.map(function (c) { return badge(c, "era"); }).join("") +
          badge(n + " recursos", "") + "</div></a>";
      }).join("") + "</div>";

    /* Recursos externos que amplían cada época: artículos, videos y libros. */
    var mapaEp = (C.enlaces && C.enlaces.epocas) || {};
    h += '<section class="section"><div class="section-head"><h3>Ampliar cada época</h3>' +
      "<span>Artículos, videos y libros de consulta</span></div>" +
      '<div class="grid wide">' +
      C.epocas.map(function (e) {
        var cur = mapaEp[e.id] || {};
        var links = [];
        if (cur.wiki) links.push({ i: "📖", t: "Artículo: " + cur.wiki, u: wikiUrl(cur.wiki) });
        (cur.videos || []).forEach(function (q) {
          links.push({ i: "🎬", t: q, u: ytUrl(q) });
        });
        (cur.lecturas || []).forEach(function (q) {
          links.push({ i: "📰", t: "Leer: " + q, u: busqUrl(q) });
        });
        links.push({ i: "📚", t: "Libros: " + e.nombre, u: booksUrl(e.nombre + " violín") });
        if (!links.length) return "";
        return '<div class="card"><h4>' + esc(e.nombre) + " · externos</h4>" +
          '<div class="chips ext-links">' + links.map(function (l) {
            return '<a class="chip" href="' + l.u + '" target="_blank" rel="noopener">' +
              l.i + " " + esc(l.t) + " ↗</a>";
          }).join("") + "</div></div>";
      }).join("") + "</div></section>";

    return h;
  }

  function viewNiveles() {
    return '<div class="section-head"><h3>Niveles de estudio del instrumento</h3></div>' +
      '<div class="grid wide">' +
      C.niveles.map(function (n) {
        var c = countBy(function (i) { return i.nivel === n.id; });
        return '<a class="level-card" href="#/catalogo?nivel=' + n.id + '">' +
          '<div class="range">' + esc(n.alias) + "</div>" +
          "<h4>" + esc(n.nombre) + "</h4>" +
          "<p>" + esc(n.resumen) + "</p>" +
          "<ul>" + n.requisitos.map(function (r) { return "<li>" + esc(r) + "</li>"; }).join("") + "</ul>" +
          '<p class="count">' + c + " elementos en este nivel</p></a>";
      }).join("") + "</div>";
  }

  function viewBiblioteca(p) {
    var tipo = p.tipo || "";
    var orden = p.orden || "periodo";
    var cats = {};
    items.forEach(function (i) { if (i.categoria) cats[i.categoria] = true; });

    var h = '<div class="filters"><div class="filter-actions" style="flex-wrap:wrap;gap:8px">' +
      '<a class="chip' + (tipo === "" ? " chip-on" : "") + '" href="#/biblioteca">Todo</a>' +
      C.tipos.filter(function (t) { return t.id !== "obra"; }).map(function (t) {
        return '<a class="chip' + (tipo === t.id ? " chip-on" : "") + '" href="#/biblioteca?tipo=' + t.id + '">' +
          t.icono + " " + esc(t.nombre) + "</a>";
      }).join("") + "</div>" +
      '<label>Ordenar<select data-bfilter="orden">' +
        '<option value="periodo"' + (orden === "periodo" ? " selected" : "") + ">Período del autor → compositor</option>" +
        '<option value="compositor"' + (orden === "compositor" ? " selected" : "") + ">Compositor A–Z</option>" +
        '<option value="nivel"' + (orden === "nivel" ? " selected" : "") + ">Nivel (fácil → difícil)</option>" +
      "</select></label></div>";

    if (Object.keys(cats).length) {
      h += '<div class="chips" style="margin-bottom:16px">' +
        Object.keys(cats).sort().map(function (c) {
          return '<a class="chip" href="#/catalogo?cat=' + encodeURIComponent(c) + '">' + esc(c) + "</a>";
        }).join("") + "</div>";
    }

    var arr = filterItems({ tipo: tipo, q: p.q });
    if (!tipo) arr = arr.filter(function (i) { return i.tipo !== "obra"; });

    if (orden === "compositor") {
      arr.sort(function (x, y) {
        return x.compositor.localeCompare(y.compositor, "es") || x.titulo.localeCompare(y.titulo, "es");
      });
    } else if (orden === "nivel") {
      arr.sort(function (x, y) {
        return x.nivel - y.nivel || x.compositor.localeCompare(y.compositor, "es");
      });
    } else {
      arr.sort(function (x, y) {
        var ox = x.epoca ? erasById[x.epoca].orden : 99;
        var oy = y.epoca ? erasById[y.epoca].orden : 99;
        return ox - oy ||
          x.compositor.localeCompare(y.compositor, "es") ||
          x.titulo.localeCompare(y.titulo, "es");
      });
    }

    h += '<p class="result-line"><span><b>' + arr.length + "</b> elementos de la biblioteca académica</span>" +
      "<span>Los estudios aparecen agrupados por el período de su compositor</span></p>";

    if (orden === "periodo") {
      var grupos = [];
      var idx = {};
      arr.forEach(function (it) {
        var key = it.epoca || "__general__";
        if (!idx[key]) { idx[key] = { key: key, items: [] }; grupos.push(idx[key]); }
        idx[key].items.push(it);
      });
      h += grupos.map(function (g) {
        var era = erasById[g.key];
        var label = era
          ? era.nombre + " · " + era.rango
          : "General · material académico sin período";
        return '<div class="group"><h3 class="group-head">' + esc(label) +
          '<span class="badge">' + g.items.length + "</span></h3>" + gridHTML(g.items) + "</div>";
      }).join("");
    } else {
      h += gridHTML(arr);
    }
    return h;
  }

  function fileRow(f) {
    var icono = f.tipo === "partitura" ? "♫" : f.tipo === "libro" ? "▤" :
      f.tipo === "audio" ? "▶" : f.tipo === "imagen" ? "▦" : "✎";
    return '<a class="file-row" href="' + esc(f.ruta) + '" target="_blank" rel="noopener">' +
      '<div class="file-main"><span class="file-icon">' + icono + "</span>" +
      "<div><strong>" + esc(f.nombre) + '</strong><span class="sub">' + esc(f.ruta) + "</span></div>" +
      "</div>" + badge(f.ext.toUpperCase(), "") + "</a>";
  }

  function viewOffline() {
    var files = C.offline || [];
    var porCarpeta = {};
    files.forEach(function (f) { (porCarpeta[f.carpeta] = porCarpeta[f.carpeta] || []).push(f); });

    var descCarpetas = {
      "Partituras": "PDF, MusicXML o imágenes de las piezas — ej: Bach - Partita 2 Chaconne.pdf",
      "Libros": "PDF o EPUB de métodos, estudios y tratados — ej: Sitt - Études op. 32.pdf",
      "Audio": "Grabaciones de referencia, acompañamientos y versiones propias",
      "Imagenes": "Portadas, fotos de digitaciones y material de apoyo",
      "Notas": "Apuntes de estudio en texto o PDF"
    };

    var h = '<section class="hero"><h2>Contenido sin conexión</h2>' +
      "<p>Guardá tus propias partituras, libros y audio en las carpetas de esta aplicación; " +
      "el indexador local los lista aquí y se abren directamente, sin internet.</p>" +
      '<div class="stats">' +
        '<div class="stat"><b>' + files.length + "</b><span>Archivos indexados</span></div>" +
        '<div class="stat"><b>' + Object.keys(porCarpeta).length + "</b><span>Carpetas con contenido</span></div>" +
      "</div></section>";

    ["Partituras", "Libros", "Audio", "Imagenes", "Notas"].forEach(function (c) {
      var lista = porCarpeta[c];
      h += '<section class="section"><div class="section-head"><h3>' + c + "</h3>" +
        '<span class="badge">' + (lista ? lista.length : 0) + "</span></div>" +
        '<p class="result-line"><span>' + esc(descCarpetas[c]) + "</span></p>";
      h += lista && lista.length
        ? lista.map(fileRow).join("")
        : '<div class="empty">Sin archivos todavía. Guardá archivos en la carpeta <b>' + c +
          "</b> y ejecutá <b>python scripts\\indexar-offline.py</b>.</div>";
      h += "</section>";
    });

    var descargas = [
      { t: "Bach – Sonatas y Partitas BWV 1001–1006", q: "Bach sonatas partitas violin BWV 1001" },
      { t: "Vivaldi – Las cuatro estaciones", q: "Vivaldi four seasons violin" },
      { t: "Kreutzer – 42 estudios", q: "Rodolphe Kreutzer 42 études violin" },
      { t: "Sitt – Études op. 32", q: "Hans Sitt Études op 32 violin" },
      { t: "Ševčík – Escuela del violín", q: "Otakar Sevcik school of violin technique" },
      { t: "Wohlfahrt – Estudios op. 45 y 47", q: "Franz Wohlfahrt op 45 violin" },
      { t: "Kayser – 36 estudios op. 20", q: "Heinrich Kayser op 20 violin" },
      { t: "Mazas – Estudios especiales op. 36", q: "Mazas études spéciales op 36" },
      { t: "Flesch – Sistema de escalas", q: "Carl Flesch scale system" },
      { t: "Paganini – 24 Caprichos", q: "Paganini 24 caprices op 1" },
      { t: "Leopold Mozart – Escuela de violín (1756)", q: "Leopold Mozart Violinschule" },
      { t: "Baillot – L'art du violon (1834)", q: "Baillot l'art du violon" }
    ];
    h += '<section class="section"><div class="section-head"><h3>Descargas de dominio público (IMSLP)</h3>' +
      '<span class="badge">Gratis y legal</span></div>' +
      '<div class="chips">' + descargas.map(function (d) {
        return '<a class="chip" href="https://imslp.org/index.php?title=Special:Search&search=' +
          encodeURIComponent(d.q) + '" target="_blank" rel="noopener">⬇ ' + esc(d.t) + "</a>";
      }).join("") + "</div></section>";

    h += '<section class="section"><div class="section-head"><h3>Cómo llenar la biblioteca offline</h3></div>' +
      '<div class="grid wide">' +
        '<div class="card"><h4>1. Descargá lo que es libre</h4><div class="excerpt">' +
          "Las obras de autores fallecidos hace más de 70 años (Bach, Vivaldi, Mozart, " +
          "Kreutzer, Sitt, Ševčík…) son de dominio público: se descargan gratis en IMSLP. " +
          "Guardá el PDF en <b>Partituras/</b>.</div></div>" +
        '<div class="card"><h4>2. Comprá lo que tiene copyright</h4><div class="excerpt">' +
          "Los métodos modernos (Flesch, Galamian, Suzuki, Simon Fischer) no se pueden " +
          "copiar: adquirí la edición legal y guardá el PDF en <b>Libros/</b>.</div></div>" +
        '<div class="card"><h4>3. Indexá y listo</h4><div class="excerpt">' +
          "Ejecutá <b>python scripts\\indexar-offline.py</b> y recargá la aplicación: " +
          "los archivos aparecen arriba y se abren sin conexión.</div></div>" +
      "</div></section>";

    h += '<section class="section"><div class="empty">' +
      "Esta aplicación no incluye partituras ni libros con copyright: solo indexa los " +
      "archivos que vos guardás en tus carpetas. Los textos académicos incluidos en la " +
      "app (guías, notas y descripciones) son originales.</div></section>";

    return h;
  }

  function viewMi() {
    var ests = store.estados();
    var favs = store.favs().map(function (id) { return items.find(function (i) { return i.id === id; }); }).filter(Boolean);
    var estudiando = items.filter(function (i) { return ests[i.id] === "estudiando"; });
    var estudiadas = items.filter(function (i) { return ests[i.id] === "estudiada"; });
    var buscadas = store.busquedas();
    var total = items.length;
    var pct = Math.round(((estudiadas.length + estudiando.length * 0.5) / total) * 100);

    var h = '<section class="hero"><h2>Mi progreso</h2>' +
      "<p>Tu avance se guarda en este dispositivo: favoritos, piezas estudiadas y notas de trabajo.</p>" +
      '<div class="stats">' +
        '<div class="stat"><b>' + estudiadas.length + "</b><span>Estudiadas</span></div>" +
        '<div class="stat"><b>' + estudiando.length + "</b><span>Estudiando</span></div>" +
        '<div class="stat"><b>' + favs.length + "</b><span>Favoritas</span></div>" +
        '<div class="stat"><b>' + pct + " %</b><span>Avance</span></div>" +
      "</div>" +
      '<div class="progress-bar" style="margin-top:16px"><i style="width:' + Math.max(pct, 2) + '%"></i></div>' +
      "</section>";

    h += '<section class="section"><div class="section-head"><h3>Favoritos</h3>' +
      '<a href="#/catalogo?fav=1">Ver en el catálogo</a></div>' +
      (favs.length ? favs.map(rowHTML).join("") : '<div class="empty">Todavía no marcaste favoritos. Tocá la estrella de cualquier pieza.</div>') +
      "</section>";

    h += '<section class="section"><div class="section-head"><h3>Estudiando</h3></div>' +
      (estudiando.length ? estudiando.map(rowHTML).join("") : '<div class="empty">Abrí una pieza y marcala «Estudiando» para seguirla aquí.</div>') +
      "</section>";

    h += '<section class="section"><div class="section-head"><h3>Completadas</h3></div>' +
      (estudiadas.length ? estudiadas.map(rowHTML).join("") : '<div class="empty">Cuando domines una pieza, marcala «Estudiada».</div>') +
      "</section>";

    h += '<section class="section"><div class="section-head"><h3>Búsquedas guardadas</h3></div>' +
      (buscadas.length
        ? '<div class="chips">' + buscadas.map(function (b) {
            return '<button class="chip" data-runsearch="' + esc(b.id) + '">' + esc(b.nombre) +
              '</button><button class="chip x" data-delsearch="' + esc(b.id) + '" title="Eliminar">✕</button>';
          }).join("") + "</div>"
        : '<div class="empty">Filtrá el catálogo y tocá «Guardar esta búsqueda» para tenerlo a mano.</div>') +
      "</section>";

    h += '<section class="section"><button class="ghost-btn" data-clearall="1">Borrar todos los datos guardados en este dispositivo</button></section>';
    return h;
  }

  /* ---------- detalle ---------- */
  function imslpUrl(it) {
    var t = (it.compositor.replace(/\(.*?\)/g, "") + " " + it.titulo).trim();
    return "https://imslp.org/index.php?title=Special:Search&search=" + encodeURIComponent(t);
  }
  function webUrl(it) {
    return "https://www.google.com/search?q=" + encodeURIComponent(it.compositor + " " + it.titulo + " partitura violin");
  }

  /* ---------- enlaces externos (videos, artículos, libros) ---------- */
  function normAutor(n) {
    return (n || "")
      .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
      .toLowerCase().replace(/[^a-z0-9]+/g, " ").trim();
  }
  function ytUrl(q) {
    return "https://www.youtube.com/results?search_query=" + encodeURIComponent(q);
  }
  function wikiUrl(q) {
    return "https://es.wikipedia.org/wiki/Special:Search?search=" + encodeURIComponent(q);
  }
  function booksUrl(q) {
    return "https://www.google.com/search?tbm=bks&q=" + encodeURIComponent(q);
  }
  function busqUrl(q) {
    return "https://www.google.com/search?q=" + encodeURIComponent(q);
  }

  /* Enlaces que complementan al autor de una entrada: artículos (Wikipedia),
     videos (YouTube), libros (Google Libros) y lecturas recomendadas. */
  function authorLinks(it) {
    var mapa = (C.enlaces && C.enlaces.autores) || {};
    var nombre = it.compositor.replace(/\(.*?\)/g, "").trim();
    var clave = normAutor(it.compositor);
    var cur = mapa[clave] || {};
    /* Entradas con autor genérico (guías, diccionarios): buscar por el título. */
    var generico = /^(ed |ed$|biblioteca|autores|publicacion)/.test(clave);
    var base = generico ? it.titulo : (nombre + " violín").trim();

    var out = [];

    if (!generico) {
      out.push({ i: "📖", t: "Artículo del autor (Wikipedia)", u: wikiUrl(nombre) });
    }

    var videos = (cur.videos && cur.videos.length)
      ? cur.videos
      : [base];
    videos.slice(0, 3).forEach(function (q, n) {
      out.push({ i: "🎬", t: (n === 0 ? "Ver videos: " : "Video: ") + q, u: ytUrl(q) });
    });

    if (["bibliografia", "metodo", "guia", "estudio"].indexOf(it.tipo) >= 0) {
      out.push({
        i: "📚",
        t: "Buscar el libro (Google Libros)",
        u: booksUrl(generico ? it.titulo : nombre + " " + it.titulo)
      });
    }

    (cur.lecturas || []).slice(0, 2).forEach(function (q) {
      out.push({ i: "📰", t: "Leer: " + q, u: busqUrl(q) });
    });

    return out;
  }

  function linksHTML(list) {
    return '<p class="subhead">Enlaces externos</p><div class="chips ext-links">' +
      list.map(function (l) {
        return '<a class="chip" href="' + l.u + '" target="_blank" rel="noopener">' +
          l.i + " " + esc(l.t) + " ↗</a>";
      }).join("") + "</div>";
  }

  function openDetail(id) {
    var it = items.find(function (i) { return i.id === id; });
    if (!it) return;
    var era = it.epoca ? erasById[it.epoca] : null;
    var tipo = tiposById[it.tipo] || { icono: "•", nombre: it.tipo };
    var fav = store.isFav(it.id);
    var est = store.getEstado(it.id);

    var h = '<div class="detail">' +
      "<h2>" + esc(it.titulo) + "</h2>" +
      '<p class="composer">' + esc(it.compositor) +
        (it.autorVida ? " · " + esc(it.autorVida) : "") +
        (it.anio ? " · " + esc(it.anio) : "") + "</p>" +
      '<div class="badges">' +
        badge(tipo.icono + " " + tipo.nombre, "tipo") +
        (era ? badge(era.nombre + " · " + era.rango, "era") : badge("Biblioteca académica", "")) +
        badge("Nivel " + it.nivel + " · " + (nivelesById[it.nivel] ? nivelesById[it.nivel].alias : ""), "lvl-" + it.nivel) +
        (est !== "pendiente" ? badge(est === "estudiada" ? "✓ Estudiada" : "● Estudiando", "state-" + est) : "") +
      "</div>" +
      '<div class="kv">' +
        "<div><span>Instrumentación</span><b>" + esc(it.instrumentacion || "—") + "</b></div>" +
        "<div><span>Duración</span><b>" + esc(it.duracion || "—") + "</b></div>" +
        (it.categoria ? "<div><span>Categoría</span><b>" + esc(it.categoria) + "</b></div>" : "") +
        "<div><span>Época</span><b>" + (era ? esc(era.nombre) : "Académica") + "</b></div>" +
      "</div>" +
      (it.tecnicas && it.tecnicas.length
        ? '<div class="badges">' + it.tecnicas.map(function (t) {
            return '<a class="badge" href="#/catalogo?tec=' + encodeURIComponent(t) + '">' + esc(t) + "</a>";
          }).join("") + "</div>"
        : "") +
      '<p class="subhead">Notas de estudio</p>' +
      '<p class="text">' + esc(it.notas) + "</p>";

    if (it.contenido && it.contenido.length) {
      h += '<p class="subhead">Contenido</p><ul class="contenido">' +
        it.contenido.map(function (c) { return "<li>" + esc(c) + "</li>"; }).join("") + "</ul>";
    }

    h += linksHTML(authorLinks(it));

    h += '<div class="actions">' +
      '<button class="btn' + (fav ? " on" : "") + '" data-fav="' + it.id + '">' + (fav ? "★ En favoritos" : "☆ Añadir a favoritos") + "</button>" +
      (it.tipo === "guia" ? "" :
        '<a class="btn" href="' + imslpUrl(it) + '" target="_blank" rel="noopener">Buscar partitura en IMSLP</a>' +
        '<a class="btn" href="' + webUrl(it) + '" target="_blank" rel="noopener">Buscar en la web</a>') +
    "</div>";

    h += '<p class="subhead">Seguimiento</p><div class="state-picker">' +
      ["pendiente", "estudiando", "estudiada"].map(function (s) {
        var label = s === "pendiente" ? "Sin empezar" : s === "estudiando" ? "● Estudiando" : "✓ Estudiada";
        return '<button class="btn' + (est === s ? " on" : "") + '" data-state="' + s + '" data-id="' + it.id + '">' + label + "</button>";
      }).join("") + "</div>";

    h += '<p class="subhead">Mis notas</p>' +
      '<textarea class="notes-area" data-note="' + it.id + '" placeholder="Ej: compás 24 del segundo movimiento, cuarta dedo afinado agudo…">' +
      esc(store.getNota(it.id)) + "</textarea>";

    h += "</div>";

    $modalBody.innerHTML = h;
    $modal.hidden = false;
    document.body.style.overflow = "hidden";
  }
  function closeDetail() {
    $modal.hidden = true;
    document.body.style.overflow = "";
  }

  /* ---------- render ---------- */
  function render() {
    var r = parseRoute();
    var view = r.view;
    var p = r.params;

    Array.prototype.forEach.call($tabs.querySelectorAll("a"), function (a) {
      a.classList.toggle("active", a.getAttribute("data-view") === view);
    });
    if (document.activeElement !== $q) $q.value = p.q || "";

    var html;
    if (view === "catalogo") html = viewCatalogo(p);
    else if (view === "epocas") html = viewEpocas();
    else if (view === "niveles") html = viewNiveles();
    else if (view === "biblioteca") html = viewBiblioteca(p);
    else if (view === "offline") html = viewOffline();
    else if (view === "mi") html = viewMi();
    else html = viewInicio();

    $main.innerHTML = html;
    if (view !== "catalogo") closeDetail();
  }

  /* ---------- eventos ---------- */
  var typingTimer = null;
  $q.addEventListener("input", function () {
    clearTimeout(typingTimer);
    typingTimer = setTimeout(function () {
      var r = parseRoute();
      var params = Object.assign({}, r.params, { q: $q.value.trim() });
      if (r.view !== "catalogo" && r.view !== "biblioteca") setRoute("catalogo", params);
      else setRoute(r.view, params, true);
    }, 160);
  });

  document.getElementById("btnSaveSearch").addEventListener("click", saveSearch);
  function saveSearch() {
    var r = parseRoute();
    var p = r.params;
    if (!p.q) p.q = $q.value.trim();
    var partes = [];
    if (p.q) partes.push("“" + p.q + "”");
    if (p.epoca && erasById[p.epoca]) partes.push(erasById[p.epoca].nombre);
    if (p.nivel) partes.push("Nivel " + p.nivel);
    if (p.tipo && tiposById[p.tipo]) partes.push(tiposById[p.tipo].nombre);
    if (p.tec) partes.push(p.tec);
    if (p.cat) partes.push(p.cat);
    if (p.fav === "1") partes.push("Favoritos");
    var nombre = partes.length ? partes.join(" · ") : "Catálogo completo";
    var ok = store.addBusqueda({
      id: "s" + Date.now(),
      nombre: nombre,
      view: r.view === "mi" ? "catalogo" : r.view,
      params: Object.assign({}, p)
    });
    toast(ok ? "Búsqueda guardada" : "Ya estaba guardada");
    if (parseRoute().view === "mi") render();
  }

  $main.addEventListener("click", function (ev) {
    var t = ev.target;

    var favBtn = t.closest("[data-fav]");
    if (favBtn) {
      ev.stopPropagation();
      var added = store.toggleFav(favBtn.getAttribute("data-fav"));
      toast(added ? "Añadida a favoritos" : "Quitada de favoritos");
      render();
      if (!$modal.hidden) openDetail(favBtn.getAttribute("data-fav"));
      return;
    }

    var goto = t.closest("[data-goto]");
    if (goto) { location.hash = goto.getAttribute("data-goto"); return; }

    var open = t.closest("[data-open]");
    if (open) { openDetail(open.getAttribute("data-open")); return; }

    var clear = t.closest("[data-clear]");
    if (clear) { setRoute("catalogo", {}); return; }

    var rmCat = t.closest("[data-rmcat]");
    if (rmCat) {
      var rc = parseRoute();
      var rp = Object.assign({}, rc.params);
      delete rp.cat;
      setRoute("catalogo", rp, true);
      return;
    }

    var favFilter = t.closest("[data-togglefav]");
    if (favFilter) {
      var r = parseRoute();
      var params = Object.assign({}, r.params, { fav: r.params.fav === "1" ? "" : "1" });
      setRoute("catalogo", params, true);
      return;
    }

    var saveBtn = t.closest("[data-savesearch]");
    if (saveBtn) { saveSearch(); return; }

    var runBtn = t.closest("[data-runsearch]");
    if (runBtn) {
      var b = store.busquedas().find(function (x) { return x.id === runBtn.getAttribute("data-runsearch"); });
      if (b) setRoute(b.view || "catalogo", b.params || {});
      return;
    }

    var delBtn = t.closest("[data-delsearch]");
    if (delBtn) { store.delBusqueda(delBtn.getAttribute("data-delsearch")); render(); return; }

    var clearAll = t.closest("[data-clearall]");
    if (clearAll) {
      if (confirm("¿Borrar favoritos, progreso y búsquedas guardadas?")) { store.clear(); render(); toast("Datos borrados"); }
      return;
    }
  });

  $main.addEventListener("change", function (ev) {
    var sel = ev.target.closest("[data-filter], [data-bfilter]");
    if (!sel) return;
    var isB = sel.hasAttribute("data-bfilter");
    var r = parseRoute();
    var params = Object.assign({}, r.params);
    params[sel.getAttribute(isB ? "data-bfilter" : "data-filter")] = sel.value;
    setRoute(isB ? "biblioteca" : "catalogo", params, true);
  });

  $main.addEventListener("keydown", function (ev) {
    if (ev.key !== "Enter") return;
    var card = ev.target.closest(".card[data-open]");
    if (card) openDetail(card.getAttribute("data-open"));
  });

  $modal.addEventListener("click", function (ev) {
    if (ev.target.closest("[data-close]")) { closeDetail(); return; }

    var favBtn = ev.target.closest("[data-fav]");
    if (favBtn) {
      var id = favBtn.getAttribute("data-fav");
      store.toggleFav(id);
      toast(store.isFav(id) ? "Añadida a favoritos" : "Quitada de favoritos");
      openDetail(id);
      render();
      return;
    }
    var st = ev.target.closest("[data-state]");
    if (st) {
      var sid = st.getAttribute("data-id");
      store.setEstado(sid, st.getAttribute("data-state"));
      openDetail(sid);
      render();
      return;
    }
  });

  document.addEventListener("keydown", function (ev) {
    if (ev.key === "Escape" && !$modal.hidden) closeDetail();
    if (ev.key === "/" && document.activeElement !== $q) { ev.preventDefault(); $q.focus(); }
  });

  $modal.addEventListener("input", function (ev) {
    var note = ev.target.closest("[data-note]");
    if (note) store.setNota(note.getAttribute("data-note"), note.value);
  });

  window.addEventListener("hashchange", function () {
    closeDetail();
    render();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });

  /* ---------- PWA: instalación y caché sin conexión ---------- */
  var deferredPrompt = null;
  window.addEventListener("beforeinstallprompt", function (e) {
    e.preventDefault();
    deferredPrompt = e;
    document.getElementById("btnInstall").classList.remove("hidden");
  });
  document.getElementById("btnInstall").addEventListener("click", function () {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    deferredPrompt.userChoice.then(function () { deferredPrompt = null; });
  });

  if ("serviceWorker" in navigator && location.protocol.indexOf("http") === 0) {
    navigator.serviceWorker.register("sw.js").catch(function () { /* sin caché offline */ });
  }

  render();
})();
