/* Almacenamiento local: favoritos, progreso, notas y búsquedas guardadas. */
window.CVM = window.CVM || {};

(function () {
  var KEY = "partituras-violin-v1";
  var DEFAULTS = { favs: [], estado: {}, notas: {}, busquedas: [] };
  var data = load();

  function load() {
    try {
      var raw = localStorage.getItem(KEY);
      if (!raw) return JSON.parse(JSON.stringify(DEFAULTS));
      var parsed = JSON.parse(raw);
      return Object.assign(JSON.parse(JSON.stringify(DEFAULTS)), parsed || {});
    } catch (e) {
      return JSON.parse(JSON.stringify(DEFAULTS));
    }
  }

  function save() {
    try {
      localStorage.setItem(KEY, JSON.stringify(data));
    } catch (e) {
      /* modo privado o sin espacio: la sesión sigue funcionando en memoria */
    }
  }

  window.CVM.store = {
    all: function () { return data; },

    /* --- favoritos --- */
    isFav: function (id) { return data.favs.indexOf(id) !== -1; },
    toggleFav: function (id) {
      var i = data.favs.indexOf(id);
      if (i === -1) data.favs.push(id); else data.favs.splice(i, 1);
      save();
      return i === -1;
    },
    favs: function () { return data.favs.slice(); },

    /* --- progreso --- */
    getEstado: function (id) { return data.estado[id] || "pendiente"; },
    setEstado: function (id, estado) {
      if (estado === "pendiente") delete data.estado[id];
      else data.estado[id] = estado;
      save();
      return data.estado[id] || "pendiente";
    },
    estados: function () { return data.estado; },

    /* --- notas personales --- */
    getNota: function (id) { return data.notas[id] || ""; },
    setNota: function (id, texto) {
      if (texto) data.notas[id] = texto; else delete data.notas[id];
      save();
    },

    /* --- búsquedas guardadas --- */
    busquedas: function () { return data.busquedas.slice(); },
    addBusqueda: function (b) {
      var dup = data.busquedas.some(function (x) { return x.nombre === b.nombre; });
      if (!dup) data.busquedas.unshift(b);
      if (data.busquedas.length > 12) data.busquedas.length = 12;
      save();
      return !dup;
    },
    delBusqueda: function (id) {
      data.busquedas = data.busquedas.filter(function (x) { return x.id !== id; });
      save();
    },
    setBusquedas: function (lista) { data.busquedas = lista; save(); },

    clear: function () { data = JSON.parse(JSON.stringify(DEFAULTS)); save(); }
  };
})();
