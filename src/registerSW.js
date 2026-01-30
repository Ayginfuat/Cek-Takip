// Service Worker'ı kaydet
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    // Base path'i bul (GitHub Pages için /Cek-Takip/ veya /)
    const basePath = import.meta.env.BASE_URL || '/'
    const swPath = `${basePath}sw.js`
    
    navigator.serviceWorker.register(swPath)
      .then((registration) => {
        console.log('Service Worker kaydedildi:', registration.scope)
      })
      .catch((error) => {
        console.log('Service Worker kaydı başarısız:', error)
      })
  })
}
