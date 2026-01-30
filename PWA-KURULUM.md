# 📱 Uygulamayı Telefona Ekleme (PWA)

Çek Takip uygulamanızı telefonunuza bir uygulama gibi ekleyebilirsiniz!

## 🚀 Hızlı Başlangıç

### 1. İkonları Oluşturun

1. `create-icons.html` dosyasını tarayıcıda açın
2. İkonlar otomatik oluşturulacak
3. Her iki ikonu da (192x192 ve 512x512) indirin
4. İndirilen dosyaları `public` klasörüne kopyalayın:
   - `icon-192.png` → `public/icon-192.png`
   - `icon-512.png` → `public/icon-512.png`

**VEYA** hazır ikonları kullanmak için:
- İnternetten "PWA icon generator" arayın
- 192x192 ve 512x512 boyutlarında ikonlar oluşturun
- `public` klasörüne kaydedin

### 2. Sunucuyu Başlatın

```powershell
npm run dev:mobile
```

### 3. Telefonda Açın

- Telefonunuzun tarayıcısında uygulamayı açın
- QR kod butonunu kullanarak veya IP adresiyle bağlanın

### 4. Ana Ekrana Ekleyin

#### 📱 Android (Chrome/Samsung Internet):

1. Tarayıcı menüsünü açın (sağ üstteki 3 nokta ⋮)
2. **"Ana ekrana ekle"** veya **"Add to Home screen"** seçeneğini bulun
3. **"Ekle"** veya **"Add"** butonuna tıklayın
4. Uygulama ana ekranınıza eklenecek!

#### 🍎 iPhone (Safari):

1. Alt kısımdaki **paylaş butonuna** tıklayın (kare ve ok simgesi)
2. Aşağı kaydırın ve **"Ana Ekrana Ekle"** seçeneğini bulun
3. **"Ekle"** butonuna tıklayın
4. Uygulama ana ekranınıza eklenecek!

## ✨ PWA Özellikleri

Uygulama ana ekranınıza eklendikten sonra:

- ✅ **Uygulama gibi açılır** - Tarayıcı çerçevesi olmadan
- ✅ **Hızlı erişim** - Ana ekrandan direkt açılır
- ✅ **Offline çalışma** - İnternet olmasa bile temel özellikler çalışır
- ✅ **Bildirimler** - (İleride eklenebilir)
- ✅ **Tam ekran** - Daha iyi kullanıcı deneyimi

## 🔧 Sorun Giderme

### "Ana ekrana ekle" seçeneği görünmüyorsa:

1. **HTTPS veya localhost kontrolü:**
   - Uygulama HTTPS üzerinden veya localhost'ta çalışmalı
   - `npm run dev:mobile` ile başlattığınızdan emin olun

2. **Manifest dosyası kontrolü:**
   - `public/manifest.json` dosyasının var olduğundan emin olun
   - Tarayıcı konsolunda hata var mı kontrol edin (F12)

3. **İkonlar kontrolü:**
   - `public/icon-192.png` ve `public/icon-512.png` dosyalarının var olduğundan emin olun

4. **Service Worker kontrolü:**
   - Tarayıcı konsolunda (F12) Service Worker'ın kayıtlı olduğunu kontrol edin

### Uygulama açılmıyorsa:

- Sunucunun çalıştığından emin olun
- Aynı WiFi ağında olduğunuzdan emin olun
- IP adresinin doğru olduğundan emin olun

## 📝 Notlar

- Uygulama ana ekranınıza eklendikten sonra, normal bir uygulama gibi çalışır
- Veriler hala LocalStorage'da saklanır (her cihazda ayrı)
- İnternet bağlantısı olmasa bile uygulama açılır (offline mod)
- Güncellemeler otomatik olarak yüklenir

## 🎨 İkon Özelleştirme

İkonları özelleştirmek için:

1. `create-icons.html` dosyasını düzenleyin
2. Renkleri, simgeleri değiştirin
3. Yeni ikonlar oluşturun
4. `public` klasörüne kaydedin

Veya online icon generator kullanın:
- https://realfavicongenerator.net/
- https://www.pwabuilder.com/imageGenerator
