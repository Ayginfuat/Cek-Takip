# 🚀 Sunucuyu Yeniden Başlatma - Adım Adım

## ⚡ Hızlı Yöntem

### Otomatik Başlatma

**`SUNUCU-YENIDEN-BASLAT.bat`** dosyasına çift tıklayın:
- Mevcut sunucuyu durdurmanızı isteyecek
- Sonra otomatik olarak yeni bir terminal açıp sunucuyu başlatacak

---

## 📋 Manuel Yöntem (Adım Adım)

### 1️⃣ Mevcut Sunucuyu Durdurun

Eğer sunucu çalışıyorsa:

1. **Sunucunun çalıştığı terminal penceresini bulun**
   - Genellikle siyah bir pencere (CMD veya PowerShell)
   - İçinde `npm run dev:mobile` yazıyor olabilir

2. **Terminal penceresine tıklayın**

3. **Ctrl + C tuşlarına basın**
   - Sunucu duracak
   - Terminal penceresi kapanabilir veya açık kalabilir

### 2️⃣ Yeni Terminal Açın

**Yöntem A: Windows tuşu ile**
- Windows tuşu + R
- `powershell` yazın ve Enter'a basın

**Yöntem B: Başlat menüsü**
- Başlat menüsünü açın
- "PowerShell" veya "CMD" yazın
- Açın

**Yöntem C: Klasörden**
- Proje klasöründe boş bir yere sağ tıklayın
- "PowerShell'i burada aç" veya "Terminal'i burada aç" seçin

### 3️⃣ Proje Klasörüne Gidin

Terminal'de şu komutu yazın:

```powershell
cd "C:\Users\aygin\Desktop\Cek Takip"
```

VEYA klasörden terminal açtıysanız zaten doğru klasördesiniz.

### 4️⃣ Sunucuyu Başlatın

Terminal'de şu komutu yazın:

```powershell
npm run dev:mobile
```

### 5️⃣ Bekleyin

Birkaç saniye bekleyin. Terminal'de şuna benzer bir çıktı göreceksiniz:

```
  VITE v5.0.8  ready in 500 ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: http://192.168.5.221:5173/
```

Bu, sunucunun başarıyla başladığı anlamına gelir!

---

## ✅ Kontrol

Sunucu çalışıyorsa:
- ✅ Terminal'de "ready" mesajı görünür
- ✅ IP adresi ve port numarası görünür
- ✅ Terminal penceresi açık kalır

---

## ⚠️ Önemli Notlar

1. **Terminal penceresini kapatmayın:**
   - Sunucu çalışırken terminal penceresini kapatırsanız sunucu durur
   - Terminal penceresini minimize edebilirsiniz ama kapatmayın

2. **Sunucuyu durdurmak için:**
   - Terminal penceresine tıklayın
   - **Ctrl + C** tuşlarına basın

3. **Birden fazla sunucu çalışıyorsa:**
   - Tüm terminal pencerelerini kontrol edin
   - Her birinde Ctrl + C yapın

---

## 🔧 Sorun Giderme

### "Port zaten kullanılıyor" hatası alıyorsanız:

1. **Tüm terminal pencerelerini kapatın**
2. **Görev Yöneticisi'ni açın** (Ctrl + Shift + Esc)
3. **"İşlemler" sekmesine gidin**
4. **"node.exe" veya "npm" işlemlerini bulun**
5. **Sağ tıklayın → "Görevi sonlandır"**

VEYA

```powershell
# PowerShell'de çalıştırın:
Get-Process | Where-Object {$_.ProcessName -like "*node*"} | Stop-Process -Force
```

### Sunucu başlamıyorsa:

1. **Node.js yüklü mü kontrol edin:**
   ```powershell
   node --version
   ```

2. **npm yüklü mü kontrol edin:**
   ```powershell
   npm --version
   ```

3. **Bağımlılıklar yüklü mü kontrol edin:**
   ```powershell
   npm install
   ```

---

## 🎯 Hızlı Komutlar

**Sunucuyu başlat:**
```powershell
npm run dev:mobile
```

**Sunucuyu durdur:**
- Terminal'de **Ctrl + C**

**Sunucuyu yeniden başlat:**
1. **Ctrl + C** (durdur)
2. **npm run dev:mobile** (başlat)

---

## 📝 Özet

1. Mevcut sunucuyu durdurun (Ctrl + C)
2. Yeni terminal açın
3. Proje klasörüne gidin
4. `npm run dev:mobile` komutunu çalıştırın
5. Terminal penceresini açık tutun

VEYA

**`SUNUCU-YENIDEN-BASLAT.bat`** dosyasına çift tıklayın - otomatik yapacak!
