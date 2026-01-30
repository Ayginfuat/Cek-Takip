@echo off
chcp 65001 >nul
echo ========================================
echo NGROK ILE HIZLI PAYLASIM
echo ========================================
echo.
echo Bu yontem gecici bir link olusturur.
echo (Ucretsiz versiyonda link her yeniden baslatmada degisir)
echo.

cd /d "%~dp0"

echo [1/3] Ngrok kontrol ediliyor...
echo.

where ngrok >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [EKSIK] Ngrok bulunamadi!
    echo.
    echo Ngrok'u kurmak icin:
    echo 1. https://ngrok.com adresine gidin
    echo 2. Ucretsiz hesap acin
    echo 3. Ngrok'u indirin
    echo 4. Ngrok'u bir klasore cikarin
    echo 5. O klasoru PATH'e ekleyin VEYA
    echo 6. Ngrok.exe dosyasini bu klasore kopyalayin
    echo.
    echo Alternatif: Vercel veya Netlify kullanin (kalici)
    echo.
    pause
    exit /b
)

echo [OK] Ngrok bulundu!
echo.

echo [2/3] Sunucu calisiyor mu kontrol ediliyor...
echo.
echo NOT: Once sunucuyu baslatmaniz gerekiyor:
echo npm run dev:mobile
echo.
echo Sunucu calisiyor mu? (E/H)
set /p sunucu="> "

if /i "%sunucu%"=="H" (
    echo.
    echo Once sunucuyu baslatin:
    echo npm run dev:mobile
    echo.
    echo Sonra bu scripti tekrar calistirin.
    pause
    exit /b
)

echo.
echo [3/3] Ngrok baslatiliyor...
echo.
echo ========================================
echo ONEMLI:
echo ========================================
echo.
echo Ngrok size bir link verecek (ornek: https://abc123.ngrok.io)
echo Bu linki herkesle paylasabilirsiniz!
echo.
echo NOT: Bu link gecicidir (ngrok ucretsiz versiyonunda)
echo Kalici link icin Vercel veya Netlify kullanin.
echo.
echo ========================================
echo.

start cmd /k "ngrok http 5173"

timeout /t 3 /nobreak >nul

echo.
echo Ngrok baslatildi!
echo.
echo Tarayicida http://localhost:4040 adresini acin
echo Orada linkinizi goreceksiniz.
echo.
echo Durdurmak icin: Ngrok penceresinde Ctrl+C
echo.
pause
