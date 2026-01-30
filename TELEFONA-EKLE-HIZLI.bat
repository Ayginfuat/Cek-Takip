@echo off
chcp 65001 >nul
echo ========================================
echo UYGULAMA SIMGESI TELEFONA EKLEME
echo ========================================
echo.

cd /d "%~dp0"

echo [1/4] Ikon dosyalari kontrol ediliyor...
echo.

if exist "public\icon-192.png" (
    if exist "public\icon-512.png" (
        echo [OK] Ikon dosyalari mevcut!
        echo.
        goto :sunucu
    )
)

echo [EKSIK] Ikon dosyalari bulunamadi!
echo.
echo Ikonlari olusturmak icin:
echo 1. icon-otomatik-olustur.html dosyasini tarayicida acin
echo 2. Ikonlari olusturun ve indirin
echo 3. public klasorune kaydedin
echo.
echo Ikon olusturucuyu aciyorum...
echo.
start "" "icon-otomatik-olustur.html"
echo.
echo Ikonlari olusturduktan sonra bu scripti tekrar calistirin.
echo.
pause
exit /b

:sunucu
echo [2/4] Sunucu durumu kontrol ediliyor...
echo.
echo Sunucuyu baslatmak icin:
echo npm run dev:mobile
echo.
echo Sunucu calisiyor mu? (E/H)
set /p sunucu="> "

if /i "%sunucu%"=="E" (
    echo [OK] Sunucu calisiyor!
) else (
    echo.
    echo Sunucuyu baslatmak icin yeni bir terminal acin ve:
    echo npm run dev:mobile
    echo komutunu calistirin.
    echo.
)

echo.
echo [3/4] Telefonda baglanma...
echo.
echo Telefonunuzda:
echo 1. Tarayiciyi acin
echo 2. QR kod butonunu kullanin VEYA
echo 3. IP adresiyle baglanin: http://BILGISAYAR-IP:5173
echo.

echo [4/4] Ana ekrana ekleme...
echo.
echo Android:
echo   - Menu (⋮) → "Ana ekrana ekle" → "Ekle"
echo.
echo iPhone:
echo   - Paylas (□↑) → "Ana Ekrana Ekle" → "Ekle"
echo.

echo ========================================
echo.
echo Detayli bilgi icin: UYGULAMA-SIMGESI-TELEFONA-EKLE.md
echo.
pause
