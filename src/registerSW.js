// Service Worker'ı kaydet ve eski versiyonları temizle
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Base path'i bul (GitHub Pages için /Cek-Takip/ veya /)
    const basePath = import.meta.env.BASE_URL || '/'
    const swPath = `${basePath}sw.js`
    
    // Önce eski service worker'ları unregister et
    navigator.serviceWorker.getRegistrations().then((registrations) => {
      for (let registration of registrations) {
        registration.unregister().then((success) => {
          if (success) {
            console.log('Eski Service Worker kaldırıldı')
          }
        })
      }
      
      // Eski cache'leri temizle
      if ('caches' in window) {
        caches.keys().then((cacheNames) => {
          cacheNames.forEach((cacheName) => {
            if (cacheName.startsWith('cek-takip-') && cacheName !== 'cek-takip-v3') {
              caches.delete(cacheName).then(() => {
                console.log('Eski cache temizlendi:', cacheName)
              })
            }
          })
        })
      }
      
      // Yeni service worker'ı kaydet
      setTimeout(() => {
        navigator.serviceWorker.register(swPath)
          .then((registration) => {
            console.log('Yeni Service Worker kaydedildi:', registration.scope)
            
            // Yeni versiyon varsa hemen güncelle
            registration.addEventListener('updatefound', () => {
              const newWorker = registration.installing
              newWorker.addEventListener('statechange', () => {
                if (newWorker.state === 'activated') {
                  console.log('Yeni Service Worker aktif!')
                  // Sayfayı yenile
                  window.location.reload()
                }
              })
            })
            
            // Periyodik kontrol et
            setInterval(() => {
              registration.update()
            }, 60000) // Her 60 saniyede bir kontrol et
          })
          .catch((error) => {
            console.log('Service Worker kaydı başarısız:', error)
          })
      }, 1000) // 1 saniye bekle (eski SW'ın kaldırılması için)
    })
  })
}
