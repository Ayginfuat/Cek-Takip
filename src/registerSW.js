// Service Worker'ı kaydet
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('Service Worker kaydedildi:', registration.scope)
      })
      .catch((error) => {
        console.log('Service Worker kaydı başarısız:', error)
      })
  })
}
