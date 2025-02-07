// public/service-worker.js

// Workbox Service Worker

// Install event
self.addEventListener('install', (event) => {
  console.log('Service Worker: Installing...');
  event.waitUntil(
    caches.open('static-v1').then((cache) => {
      return cache.addAll([
        '/', // Cache index.html
        '/favicon.ico',
        '/manifest.json',
        '/logo512.png',
        // Add other static assets if needed
      ]);
    })
  );
});

// Activate event
self.addEventListener('activate', (event) => {
  console.log('Service Worker: Activating...');
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((cache) => cache !== 'static-v1') // Keep only the current cache
          .map((cache) => caches.delete(cache))
      );
    })
  );
});

// Fetch event to handle caching strategies
self.addEventListener('fetch', (event) => {
  if (event.request.destination === 'image') {
    // CacheFirst strategy for images
    event.respondWith(
      caches.open('images-cache').then((cache) => {
        return cache.match(event.request).then((response) => {
          return (
            response ||
            fetch(event.request).then((networkResponse) => {
              cache.put(event.request, networkResponse.clone());
              return networkResponse;
            })
          );
        });
      })
    );
  } else if (event.request.url.includes('/api/')) {
    // NetworkFirst strategy for API requests
    event.respondWith(
      caches.open('api-cache').then((cache) => {
        return fetch(event.request)
          .then((response) => {
            cache.put(event.request, response.clone());
            return response;
          })
          .catch(() => cache.match(event.request));
      })
    );
  } else {
    // Fallback to cache for other requests (CacheFirst)
    event.respondWith(
      caches.match(event.request).then((response) => {
        return response || fetch(event.request);
      })
    );
  }
});
