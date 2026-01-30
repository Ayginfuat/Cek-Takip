# 🌐 Uygulamayı Herkesle Paylaşma - Hızlı Rehber

Aynı ağda olmayan biriyle paylaşmak için:

## 🚀 En Kolay Yöntem: Vercel (Önerilen)

### Adım 1: Build Alın

**`BUILD-AL-VE-PAYLAS.bat`** dosyasına çift tıklayın:
- Uygulama build alınacak
- `dist` klasörü oluşacak

VEYA manuel:
```cmd
npm run build
```

### Adım 2: Vercel'e Yükleyin

1. **https://vercel.com** adresine gidin
2. **GitHub hesabınızla giriş yapın** (ücretsiz)
3. **"Add New Project"** butonuna tıklayın
4. **`dist` klasörünü** sürükle-bırak yapın
5. **"Deploy"** butonuna tıklayın
6. ✅ **Hazır!** Linkiniz hazır!

**Sonuç:**
- `https://cek-takip-xyz.vercel.app` şeklinde bir link
- Bu linki herkesle paylaşabilirsiniz
- İnternet bağlantısı olan herkes erişebilir

---

## ⚡ Alternatif: Netlify (Çok Kolay)

1. **https://netlify.com** adresine gidin
2. **Ana sayfada `dist` klasörünü** sürükle-bırak yapın
3. ✅ **Hazır!** Linkiniz hazır!

---

## 🔄 Geçici Test: Ngrok

Hızlı test için:

1. **Sunucuyu başlatın:**
   ```cmd
   npm run dev:mobile
   ```

2. **Ngrok'u başlatın:**
   - `NGROK-HIZLI-PAYLAS.bat` dosyasına çift tıklayın
   - VEYA: https://ngrok.com'dan indirip `ngrok http 5173` çalıştırın

3. **Linki paylaşın:**
   - Ngrok size bir link verecek
   - Bu linki paylaşın

**Not:** Ücretsiz versiyonda link her yeniden başlatmada değişir.

---

## 📋 Tüm Yöntemler

Detaylı bilgi için: **`PAYLASMA-REHBERI.md`** dosyasına bakın

---

## ✅ Özet

1. **Build al:** `BUILD-AL-VE-PAYLAS.bat`
2. **Vercel'e yükle:** Sürükle-bırak
3. **Linki paylaş:** Herkes erişebilir!

---

## 🎯 Önerilen: Vercel

- ✅ Ücretsiz
- ✅ Çok kolay (sürükle-bırak)
- ✅ Otomatik HTTPS
- ✅ Hızlı
- ✅ Kalıcı link
