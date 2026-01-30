# Telefonda Çek Takip Sistemini Kullanma

## Adım Adım Talimatlar

### 1. Hazırlık
- ✅ Bilgisayarınız ve telefonunuz **AYNI WiFi ağında** olmalı
- ✅ Bilgisayarınızda proje klasörüne gidin

### 2. Sunucuyu Başlatma

**Yöntem A: Batch Dosyası ile (Kolay)**
1. `TELEFON-ICIN-BASLAT.bat` dosyasına çift tıklayın
2. Açılan pencerede IP adresinizi göreceksiniz
3. Bu pencereyi **KAPATMAYIN**

**Yöntem B: Manuel Terminal ile**
1. PowerShell veya CMD açın
2. Şu komutları çalıştırın:
```powershell
cd "C:\Users\aygin\Desktop\Cek Takip"
npm run dev:mobile
```

### 3. IP Adresinizi Bulma

Eğer IP adresi görünmüyorsa:
1. Yeni bir terminal açın
2. Şu komutu çalıştırın:
```powershell
ipconfig
```
3. "IPv4 Address" satırındaki IP adresini not edin (örnek: 192.168.1.100)

### 4. Telefonda Açma

1. Telefonunuzun tarayıcısını açın (Chrome, Safari, vb.)
2. Adres çubuğuna şunu yazın:
```
http://BILGISAYARIN-IP-ADRESI:5173
```
Örnek: `http://192.168.1.100:5173`

### 5. Windows Firewall Uyarısı

İlk kez çalıştırırken Windows Firewall uyarısı çıkabilir:
- **"Erişime izin ver"** veya **"Allow access"** seçeneğini seçin
- Bu sayede telefonunuz bilgisayarınıza bağlanabilir

## Sorun Giderme

### "Site'ye erişilemiyor" hatası alıyorsanız:

1. **Aynı WiFi kontrolü:**
   - Bilgisayar ve telefon aynı WiFi ağında mı?
   - Farklı ağlardaysa bağlanamazsınız

2. **IP adresi kontrolü:**
   - IP adresini doğru yazdınız mı?
   - `ipconfig` komutuyla tekrar kontrol edin

3. **Port kontrolü:**
   - Port 5173'ün açık olduğundan emin olun
   - Başka bir program bu portu kullanıyor olabilir

4. **Firewall kontrolü:**
   - Windows Firewall ayarlarından port 5173'e izin verin
   - Antivirus yazılımınız engelliyor olabilir

5. **Sunucu çalışıyor mu:**
   - Bilgisayarınızda terminal penceresini kontrol edin
   - Hata mesajı var mı bakın

### Telefon ve bilgisayar farklı ağlardaysa:

- **Seçenek 1:** Telefonunuzu bilgisayarınızla aynı WiFi ağına bağlayın
- **Seçenek 2:** Hotspot kullanın (bilgisayar hotspot açsın, telefon bağlansın)
- **Seçenek 3:** Build alıp statik dosya olarak sunun (daha karmaşık)

## İpuçları

- ✅ Sunucu çalışırken terminal penceresini kapatmayın
- ✅ IP adresiniz değişirse (WiFi değiştirirseniz) yeni IP ile tekrar deneyin
- ✅ Tarayıcıda "Ana ekrana ekle" özelliğini kullanarak uygulamayı hızlı erişime ekleyebilirsiniz
- ✅ Veriler telefonun tarayıcısında LocalStorage'da saklanır (her cihazda ayrı)

## Güvenlik Notu

Bu yöntem sadece yerel ağınızda çalışır. İnternet üzerinden erişilemez. Güvenli bir yöntemdir.
