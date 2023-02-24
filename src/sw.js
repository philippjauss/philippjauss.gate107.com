importScripts('https://storage.googleapis.com/workbox-cdn/releases/3.2.0/workbox-sw.js');
workbox.precaching.precacheAndRoute([]);

workbox.routing.registerRoute(
    /.*\.(?:png|jpg|jpeg|svg|gif|webp|html|js|json|ico)/,
    workbox.strategies.networkFirst({
        networkTimetoutSeconds: 2,
        cacheName: 'fullsite',
        plugins: [
            new workbox.expiration.Plugin({
                maxEntries: 50,
                maxAgeSeconds: 5 * 60, // 5 minutes
            }),
        ],
    })
);
