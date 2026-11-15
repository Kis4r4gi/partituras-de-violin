/* Service Worker: guarda la aplicación para uso sin conexión. */
const CACHE = "partituras-violin-v5";

const ASSETS = [
  "./",
  "./index.html",
  "./manifest.json",
  "./css/styles.css?v=2",
  "./js/store.js",
  "./js/app.js",
  "./js/data/taxonomia.js",
  "./js/data/repertorio-barroco-clasico.js",
  "./js/data/repertorio-romantico.js",
  "./js/data/repertorio-moderno.js",
  "./js/data/academico-estudios.js",
  "./js/data/academico-guias.js",
  "./js/data/bibliografia.js",
  "./js/data/enlaces.js",
  "./js/data/offline.js",
  "./assets/icon-192.png",
  "./assets/icon-512.png",
  "./assets/icon-maskable-512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE)
      .then((cache) => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET" || new URL(req.url).origin !== location.origin) return;

  // Red primero (para siempre tener la versión nueva) y caché como respaldo sin conexión.
  event.respondWith(
    fetch(req)
      .then((res) => {
        if (res && res.status === 200 && res.type === "basic") {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(req, copy));
        }
        return res;
      })
      .catch(() =>
        caches.match(req).then((cached) => cached || caches.match("./index.html"))
      )
  );
});
