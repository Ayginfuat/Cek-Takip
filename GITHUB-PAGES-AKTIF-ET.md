# 🌐 GitHub Pages'i Aktif Etme

GitHub linkine tıklandığında uygulamanın çalışması için:

## 🚀 Adım Adım

### 1️⃣ GitHub'da Ayarları Açın

1. **https://github.com/Ayginfuat/Cek-Takip** adresine gidin
2. **"Settings"** sekmesine tıklayın (repository'nin üst menüsünde)
3. Sol menüden **"Pages"** seçeneğine tıklayın

### 2️⃣ GitHub Pages'i Aktif Edin

1. **"Source"** bölümünde:
   - **"Deploy from a branch"** seçin
   - **Branch:** `main` seçin
   - **Folder:** `/ (root)` seçin
   - **"Save"** butonuna tıklayın

2. **VEYA** (Daha iyi yöntem):
   - **"Source"** bölümünde:
   - **"GitHub Actions"** seçin
   - Otomatik olarak deploy edilecek!

### 3️⃣ Bekleyin

- İlk deploy 1-2 dakika sürebilir
- "Actions" sekmesinden deploy durumunu takip edebilirsiniz

### 4️⃣ Linkinizi Alın

Deploy tamamlandıktan sonra:
- Settings → Pages bölümünde link görünecek
- Link şu formatta olacak: `https://ayginfuat.github.io/Cek-Takip/`

---

## ✅ Kontrol

1. **Actions sekmesine gidin:**
   - Repository'de "Actions" sekmesine tıklayın
   - "Deploy to GitHub Pages" workflow'unun başarılı olduğunu kontrol edin

2. **Linki test edin:**
   - Settings → Pages'de verilen linke tıklayın
   - Uygulama açılmalı!

---

## 🔄 Otomatik Güncelleme

Artık kodları güncellediğinizde:

1. **GitHub'a push yapın:**
   ```cmd
   git add .
   git commit -m "Güncelleme"
   git push
   ```

2. **Otomatik deploy:**
   - GitHub Actions otomatik olarak build alacak
   - GitHub Pages'e deploy edecek
   - 1-2 dakika içinde güncelleme yayında olacak!

---

## 📝 Notlar

- ✅ İlk deploy 1-2 dakika sürebilir
- ✅ Sonraki güncellemeler de otomatik deploy edilir
- ✅ Link her zaman aynı kalır
- ✅ HTTPS otomatik aktif

---

## 🎯 Sonuç

Artık GitHub repository linkinize tıklandığında uygulama çalışacak!

Link formatı: `https://ayginfuat.github.io/Cek-Takip/`
