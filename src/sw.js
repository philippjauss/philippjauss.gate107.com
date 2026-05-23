// Service Worker for philippjauss.gate107.com
// Workbox v7 compatible

importScripts('https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js');

// Precache files injected by workbox-build
workbox.precaching.precacheAndRoute(self.__WB_MANIFEST);

// Cache images, HTML, JS, JSON with network-first strategy
workbox.routing.registerRoute(
  /\.(?:png|jpg|jpeg|svg|gif|webp|html|js|json|ico)$/,
  new workbox.strategies.NetworkFirst({
    networkTimeoutSeconds: 2,
    cacheName: 'fullsite',
  }),
);
