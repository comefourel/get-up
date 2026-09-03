/* ============================================================
   SERVICE WORKER — Semaine

   ⚠️  UNE SEULE LIGNE À MODIFIER QUAND TU METS L'APP À JOUR :
   incrémente le numéro ci-dessous (v3, v4, v5…), puis renvoie
   les fichiers sur GitHub. Sans ça, ton iPhone continuera de
   servir l'ancienne version depuis son cache.
   ============================================================ */
const VERSION = 'v19';

const SHELL = `semaine-shell-${VERSION}`;
const FONTS = `semaine-fonts-${VERSION}`;

/* Fichiers locaux mis en cache dès l'installation.
   Si tu ajoutes un fichier au dossier, ajoute-le ici aussi. */
const PRECACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './icon-180.png',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png'
];

/* ---------- installation ---------- */
self.addEventListener('install', e => {
  e.waitUntil((async () => {
    const c = await caches.open(SHELL);
    // addAll échoue en bloc si un seul fichier manque : on ajoute un par un
    // pour qu'un oubli ne casse pas toute l'installation.
    await Promise.all(PRECACHE.map(u =>
      c.add(new Request(u, { cache: 'reload' })).catch(() => {})
    ));
    self.skipWaiting();
  })());
});

/* ---------- activation : purge des anciens caches ---------- */
self.addEventListener('activate', e => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.filter(k => k !== SHELL && k !== FONTS).map(k => caches.delete(k))
    );
    await self.clients.claim();
  })());
});

/* ---------- interception des requêtes ---------- */
self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;

  const url = new URL(req.url);

  /* Polices Google : cache d'abord, réseau en secours.
     Une fois chargées une première fois en ligne, elles restent
     disponibles hors connexion — sinon l'app basculerait sur des
     polices système en magasin. */
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    e.respondWith((async () => {
      const cache = await caches.open(FONTS);
      const hit = await cache.match(req);
      if (hit) return hit;
      try {
        const res = await fetch(req);
        if (res && (res.ok || res.type === 'opaque')) cache.put(req, res.clone());
        return res;
      } catch (err) {
        return hit || Response.error();
      }
    })());
    return;
  }

  /* Navigation : réseau d'abord (pour récupérer une mise à jour),
     page en cache si le réseau est absent. C'est ce qui fait
     fonctionner l'app en magasin. */
  if (req.mode === 'navigate') {
    e.respondWith((async () => {
      try {
        const res = await fetch(req);
        const cache = await caches.open(SHELL);
        cache.put('./index.html', res.clone());
        return res;
      } catch (err) {
        const cache = await caches.open(SHELL);
        return (await cache.match('./index.html')) ||
               (await cache.match('./')) ||
               new Response('Hors ligne', { status: 503, headers: { 'Content-Type': 'text/plain' } });
      }
    })());
    return;
  }

  /* Reste des fichiers de même origine : cache d'abord. */
  if (url.origin === self.location.origin) {
    e.respondWith((async () => {
      const cache = await caches.open(SHELL);
      const hit = await cache.match(req);
      if (hit) return hit;
      try {
        const res = await fetch(req);
        if (res && res.ok) cache.put(req, res.clone());
        return res;
      } catch (err) {
        return new Response('', { status: 504 });
      }
    })());
  }
});
