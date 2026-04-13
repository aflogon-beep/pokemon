// PokéBattle Service Worker
const CACHE_NAME = 'pokebattle-v9.5.2';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './css/styles.css',
  './js/audio.js',
  './js/data.js',
  './js/quotes.js',
  './js/profiles.js',
  './js/scenarios/scenes.js',
  './js/scenarios/canvas-scenes.js',
  './js/ui/screens.js',
  './js/battle.js',
  './js/sprites.js',
  './js/main.js',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // External sprites: network first
  if (url.hostname === 'raw.githubusercontent.com' || url.hostname === 'img.pokemondb.net') {
    e.respondWith(
      fetch(e.request)
        .then(res => { const c = res.clone(); caches.open(CACHE_NAME).then(ca => ca.put(e.request, c)); return res; })
        .catch(() => caches.match(e.request))
    );
    return;
  }
  // Local assets: cache first
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request).then(res => {
      if (res && res.status === 200) { const c = res.clone(); caches.open(CACHE_NAME).then(ca => ca.put(e.request, c)); }
      return res;
    }))
  );
});
