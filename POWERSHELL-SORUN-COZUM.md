# 🔧 PowerShell Script Hatası - Çözüm

"running scripts is disabled" hatası alıyorsanız:

## ⚡ Hızlı Çözüm

### Otomatik Çözüm

**`POWERSHELL-IZIN-AC.bat`** dosyasına çift tıklayın:
- PowerShell script çalıştırma iznini otomatik açacak
- Sorun çözülecek

---

## 📋 Manuel Çözüm (Adım Adım)

### Yöntem 1: PowerShell'den (Önerilen)

1. **PowerShell'i Yönetici Olarak Açın:**
   - Windows tuşu + X
   - "Windows PowerShell (Yönetici)" seçin
   - VEYA Başlat menüsünde PowerShell'e sağ tıklayın → "Yönetici olarak çalıştır"

2. **Şu komutu çalıştırın:**
   ```powershell
   Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

3. **"Y" (Evet) yazın ve Enter'a basın**

4. **Kontrol edin:**
   ```powershell
   Get-ExecutionPolicy
   ```
   "RemoteSigned" yazmalı

### Yöntem 2: CMD Kullanın (Alternatif)

PowerShell yerine CMD kullanabilirsiniz:

1. **CMD açın:**
   - Windows tuşu + R
   - `cmd` yazın ve Enter'a basın

2. **Proje klasörüne gidin:**
   ```cmd
   cd "C:\Users\aygin\Desktop\Cek Takip"
   ```

3. **Sunucuyu başlatın:**
   ```cmd
   npm run dev:mobile
   ```

### Yöntem 3: VSCode Terminal Kullanın

Eğer VSCode kullanıyorsanız:

1. **VSCode'da Terminal açın:**
   - Üst menüden: Terminal → New Terminal
   - VEYA Ctrl + ` (backtick)

2. **Terminal türünü değiştirin:**
   - Terminal'in sağ üst köşesindeki "+" yanındaki ok'a tıklayın
   - "Command Prompt" seçin

3. **Sunucuyu başlatın:**
   ```cmd
   npm run dev:mobile
   ```

---

## ✅ Çözüm Sonrası

İzin açıldıktan sonra:

1. **Yeni bir PowerShell penceresi açın**
2. **Proje klasörüne gidin:**
   ```powershell
   cd "C:\Users\aygin\Desktop\Cek Takip"
   ```
3. **Sunucuyu başlatın:**
   ```powershell
   npm run dev:mobile
   ```

---

## 🔍 Execution Policy Nedir?

Execution Policy, PowerShell'in güvenlik ayarıdır:
- **Restricted:** Hiçbir script çalıştırılamaz (varsayılan)
- **RemoteSigned:** Yerel scriptler çalıştırılabilir, uzaktan indirilenler imzalı olmalı (önerilen)
- **Unrestricted:** Tüm scriptler çalıştırılabilir (güvenlik riski)

**RemoteSigned** en güvenli ve pratik seçenektir.

---

## ⚠️ Önemli Notlar

1. **Yönetici olarak çalıştırma:**
   - Execution policy'yi değiştirmek için yönetici yetkisi gerekebilir
   - Eğer hata alırsanız PowerShell'i yönetici olarak açın

2. **Scope (Kapsam):**
   - `CurrentUser`: Sadece sizin kullanıcı hesabınız için geçerli (önerilen)
   - `LocalMachine`: Tüm kullanıcılar için geçerli (yönetici gerekir)

3. **Güvenlik:**
   - RemoteSigned güvenlidir
   - Sadece yerel scriptlerinizi çalıştırmanıza izin verir
   - Uzaktan indirilen scriptler imzalı olmalı

---

## 🎯 Hızlı Komutlar

**İzni aç (CurrentUser için):**
```powershell
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

**İzni kontrol et:**
```powershell
Get-ExecutionPolicy
```

**Tüm scope'ları kontrol et:**
```powershell
Get-ExecutionPolicy -List
```

---

## 📝 Özet

1. **`POWERSHELL-IZIN-AC.bat`** dosyasına çift tıklayın
   - VEYA PowerShell'i yönetici olarak açıp `Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser` komutunu çalıştırın

2. **Yeni PowerShell penceresi açın**

3. **Sunucuyu başlatın:**
   ```powershell
   npm run dev:mobile
   ```

VEYA

**CMD kullanın** (PowerShell yerine):
```cmd
npm run dev:mobile
```

---

## 🆘 Hala Çalışmıyorsa

1. **CMD kullanın** (PowerShell yerine)
2. **VSCode Terminal kullanın** (Command Prompt modunda)
3. **Node.js'i yeniden yükleyin**
