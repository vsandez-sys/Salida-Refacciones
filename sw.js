const CACHE_NAME = 'somsi-vales-v1';
const urlsToCache = [
  './',
  './index.html',
  './devolucion.html',
  './css/styles.css',
  './js/script.js',
  './js/script-devolucion.js',
  './assets/logo.png',
  './manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});