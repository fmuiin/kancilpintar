/* Service worker: membuat game tetap bisa dibuka tanpa internet setelah pernah dibuka sekali.
   Strategi: ambil dari internet dulu (supaya pembaruan langsung terlihat), kalau gagal pakai simpanan.
   Naikkan nomor CACHE kalau menambah berkas baru ke daftar CORE. */
const CACHE = 'kancil-pintar-v1';
const CORE = [
  './',
  'index.html',
  'css/style.css',
  'js/app.js',
  'js/data.js',
  'js/art.js',
  'js/audio.js',
  'js/utils.js',
  'manifest.webmanifest',
  'assets/icon.svg',
  'assets/icon-192.png',
  'assets/icon-512.png'
];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const r = e.request;
  if (r.method !== 'GET' || new URL(r.url).origin !== self.location.origin) return;
  e.respondWith(
    fetch(r)
      .then(res => {
        const copy = res.clone();
        caches.open(CACHE).then(c => c.put(r, copy));
        return res;
      })
      .catch(() => caches.match(r).then(m => m || caches.match('./')))
  );
});
