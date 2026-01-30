@echo off
chcp 65001 >nul
echo ========================================
echo UYGULAMAYI TELEFONA EKLEME - HIZLI BAŞLANGIÇ
echo ========================================
echo.
echo Bu script sizi adım adım yönlendirecek...
echo.

cd /d "%~dp0"

echo [ADIM 1/5] İkon dosyaları kontrol ediliyor...
echo.

if exist "public\icon-192.png" (
    if exist "public\icon-512.png" (
        echo [OK] İkon dosyaları mevcut!
        echo.
        goto :sunucu
    )
)

echo [EKSIK] İkon dosyaları bulunamadı!
echo.
echo İkonları oluşturmak için:
echo 1. icon-olustur.html dosyasını tarayıcıda açın
echo 2. "cek takip ikon.jpeg" dosyasını yükleyin
echo 3. İkonları oluşturun ve indirin
echo 4. public klasörüne kaydedin
echo.
echo İkon oluşturucuyu açıyorum...
echo.
start "" "icon-olustur.html"
echo.
echo İkonları oluşturduktan sonra bu scripti tekrar çalıştırın.
echo.
pause
exit /b

:sunucu
echo [ADIM 2/5] Sunucu durumu kontrol ediliyor...
echo.
echo Sunucuyu başlatmak için:
echo npm run dev:mobile
echo.
echo Sunucu çalışıyor mu? (E/H)
set /p sunucu="> "

if /i "%sunucu%"=="E" (
    echo [OK] Sunucu çalışıyor!
) else (
    echo.
    echo Sunucuyu başlatmak için yeni bir terminal açın ve:
    echo npm run dev:mobile
    echo komutunu çalıştırın.
    echo.
)

echo.
echo [ADIM 3/5] Telefonda bağlanma...
echo.
echo Telefonunuzda:
echo 1. Tarayıcıyı açın
echo 2. QR kod butonunu kullanın VEYA
echo 3. IP adresiyle bağlanın: http://BILGISAYAR-IP:5173
echo.

echo [ADIM 4/5] Ana ekrana ekleme...
echo.
echo Android:
echo   - Menü (⋮) → "Ana ekrana ekle" → "Ekle"
echo.
echo iPhone:
echo   - Paylaş (□↑) → "Ana Ekrana Ekle" → "Ekle"
echo.

echo [ADIM 5/5] Kontrol...
echo.
echo İkon görünüyorsa: ✅ BAŞARILI!
echo İkon görünmüyorsa:
echo   1. Ana ekrandan uygulamayı silin
echo   2. Tarayıcı cache'ini temizleyin
echo   3. Uygulamayı yeniden ekleyin
echo.

echo ========================================
echo.
echo Detaylı bilgi için: TELEFONA-EKLE-REHBERI.md
echo.
pause
