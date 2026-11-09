/* Chaibreak service worker: lets the site open offline. Cache-first, versioned per build. */
const V = 'cb-6fae01973f';
const FILES = ["./", "play/zest/", "play/julienne/", "play/slab/", "play/pinpoint/", "play/pocket/", "play/binit/", "play/lastover/", "play/biscuit/", "play/noodle/", "play/merge/", "play/sort/", "play/sudoku/", "play/word/", "play/stall/", "play/carrom/", "play/solitaire/", "assets/app.css?v=e54443e4", "assets/app.js?v=9517b988", "assets/config.js", "assets/fonts/baloo-2-latin-wght-normal.woff2", "assets/fonts/figtree-latin-wght-normal.woff2", "assets/icons/favicon.svg", "assets/icons/favicon-32.png", "assets/icons/icon-192.png", "assets/icons/icon-512.png", "assets/icons/apple-touch-icon.png", "manifest.webmanifest", "privacy.html"];
self.addEventListener('install', e => {
  e.waitUntil(caches.open(V).then(c => Promise.all(FILES.map(f => c.add(new URL(f, self.registration.scope).href).catch(() => {})))).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
  e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.indexOf('cb-') === 0 && k !== V).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
  const r = e.request;
  if(r.method !== 'GET') return;
  const u = new URL(r.url);
  if(u.origin !== self.location.origin) return;
  if(u.pathname.slice(-17) === '/assets/config.js'){ e.respondWith(fetch(r).catch(() => caches.match(r))); return; }
  e.respondWith(caches.match(r).then(hit => hit || fetch(r).then(res => {
    if(res && res.ok){ const cp = res.clone(); caches.open(V).then(c => c.put(r, cp)); }
    return res;
  }).catch(() => r.mode === 'navigate' ? caches.match(new URL('./', self.registration.scope).href) : Response.error())));
});
