// Service Worker - Offline çalışma için
const CACHE_NAME = 'cek-takip-v3' // Versiyon numarasını artırdık
const urlsToCache = [
  '/',
  '/index.html',
  '/src/main.jsx',
  '/src/App.jsx',
  '/src/index.css',
  '/manifest.json',
  '/icon-192.png',
  '/icon-512.png'
]

// Install event - Cache'e kaydet ve hemen aktif et
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll(urlsToCache)
      })
      .then(() => {
        // Yeni service worker'ı hemen aktif et (skipWaiting)
        return self.skipWaiting()
      })
  )
})

// Fetch event - Cache'den veya network'ten getir
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache'de varsa cache'den döndür, yoksa network'ten getir
        return response || fetch(event.request)
      })
  )
})

// Activate event - Eski cache'leri temizle ve hemen kontrol et
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all([
        // Eski cache'leri sil
        ...cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Eski cache siliniyor:', cacheName)
            return caches.delete(cacheName)
          }
        }),
        // Tüm client'lara kontrol mesajı gönder
        self.clients.claim()
      ])
    })
  )
})
