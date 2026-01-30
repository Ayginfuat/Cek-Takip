@echo off
chcp 65001 >nul
echo ========================================
echo KAPAK RESMI SORUNU - COZUM
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Ikon dosyalari kontrol ediliyor...
echo.

set "HATA=0"

if exist "public\icon-192.png" (
    for %%A in ("public\icon-192.png") do (
        if %%~zA LSS 1000 (
            echo [HATA] icon-192.png cok kucuk! (%%~zA bytes)
            set "HATA=1"
        ) else (
            echo [OK] icon-192.png mevcut (%%~zA bytes)
        )
    )
) else (
    echo [EKSIK] icon-192.png BULUNAMDI!
    set "HATA=1"
)

if exist "public\icon-512.png" (
    for %%A in ("public\icon-512.png") do (
        if %%~zA LSS 1000 (
            echo [HATA] icon-512.png cok kucuk! (%%~zA bytes)
            set "HATA=1"
        ) else (
            echo [OK] icon-512.png mevcut (%%~zA bytes)
        )
    )
) else (
    echo [EKSIK] icon-512.png BULUNAMDI!
    set "HATA=1"
)

echo.

if %HATA%==1 (
    echo ========================================
    echo [SORUN VAR] Ikon dosyalari eksik veya hatali!
    echo ========================================
    echo.
    echo COZUM:
    echo 1. icon-otomatik-olustur.html dosyasini tarayicida acin
    echo 2. "Ikonlari Olustur ve Indir" butonuna tiklayin
    echo 3. Her iki ikonu da indirin
    echo 4. Indirilen dosyalari public klasorune kopyalayin:
    echo    - icon-192.png → public\icon-192.png
    echo    - icon-512.png → public\icon-512.png
    echo 5. Bu scripti tekrar calistirin
    echo.
    echo Ikon olusturucuyu aciyorum...
    echo.
    start "" "icon-otomatik-olustur.html"
    echo.
    pause
    exit /b
)

echo [2/3] Manifest dosyasi kontrol ediliyor...
echo.

if exist "public\manifest.json" (
    echo [OK] manifest.json mevcut
) else (
    echo [HATA] manifest.json bulunamadi!
    pause
    exit /b
)

echo.
echo [3/3] Sonraki adimlar...
echo.
echo ========================================
echo [BASARILI] Ikon dosyalari hazir!
echo ========================================
echo.
echo SIMDI YAPMANIZ GEREKENLER:
echo.
echo 1. Sunucuyu YENIDEN BASLATIN:
echo    - Sunucuyu durdurun (Ctrl+C)
echo    - npm run dev:mobile
echo.
echo 2. TELEFONDA TEMIZLEYIN:
echo    - Ana ekrandan uygulamayi SILIN (uzun basin → kaldir)
echo    - Tarayici cache'ini TEMIZLEYIN:
echo      * Android: Chrome → Ayarlar → Gizlilik → 
echo        Tarama verilerini temizle → "Onbellege alinan resimler"
echo      * iPhone: Ayarlar → Safari → Gelismis → 
echo        Web Sitesi Verileri → Temizle
echo.
echo 3. UYGULAMAYI YENIDEN EKLEYIN:
echo    - Tarayicida uygulamayi acin
echo    - Sayfayi YENILEYIN (F5)
echo    - 5-10 saniye bekleyin
echo    - "Ana ekrana ekle" yapin
echo.
echo ========================================
echo.
pause
