const CACHE_NAME = 'registro-tennis-v4';
const APP_FILES = [
    './index.html',
    './registro_personale_tennis.html',
    './privacy.html',
    './manifest.webmanifest',
    './tennis-icon-192.png',
    './tennis-icon-512.png',
    './tennis-icon-180.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => cache.addAll(APP_FILES))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key))))
            .then(() => self.clients.claim())
    );
});

self.addEventListener('fetch', event => {
    if (event.request.method !== 'GET' || new URL(event.request.url).origin !== self.location.origin) return;

    event.respondWith(
        caches.match(event.request).then(cached => {
            if (cached) return cached;
            return fetch(event.request).catch(() => caches.match('./registro_personale_tennis.html'));
        })
    );
});
