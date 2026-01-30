@echo off
chcp 65001 >nul
echo ========================================
echo UYGULAMA BUILD ALMA VE PAYLASMA
echo ========================================
echo.

cd /d "%~dp0"

echo [1/3] Build aliniyor...
echo.
echo Bu islem birkaç dakika surebilir...
echo.

call npm run build

if %ERRORLEVEL% NEQ 0 (
    echo.
    echo [HATA] Build basarisiz oldu!
    echo Lutfen hatalari kontrol edin.
    pause
    exit /b
)

echo.
echo [2/3] Build basarili!
echo.
echo Build dosyalari "dist" klasorunde olusturuldu.
echo.

echo [3/3] Paylasma secenekleri...
echo.
echo ========================================
echo PAYLASMA YONTEMLERI:
echo ========================================
echo.
echo [YONTEM 1] Vercel (Ucretsiz, Kolay) - ONERILEN
echo   1. https://vercel.com adresine gidin
echo   2. GitHub hesabi ile giris yapin
echo   3. "Add New Project" butonuna tiklayin
echo   4. "dist" klasorunu surukleyip birakin
echo   5. Herkes erisebilir!
echo.
echo [YONTEM 2] Netlify (Ucretsiz, Kolay)
echo   1. https://netlify.com adresine gidin
echo   2. "dist" klasorunu surukleyip birakin
echo   3. Herkes erisebilir!
echo.
echo [YONTEM 3] GitHub Pages (Ucretsiz)
echo   1. GitHub'da yeni bir repository olusturun
echo   2. "dist" klasorundeki dosyalari yukleyin
echo   3. Settings → Pages → Source: main branch
echo   4. Herkes erisebilir!
echo.
echo [YONTEM 4] Ngrok (Gecici, Hizli)
echo   1. https://ngrok.com adresinden ucretsiz hesap acin
echo   2. Ngrok'u indirin ve kurun
echo   3. ngrok http 5173 komutunu calistirin
echo   4. Verilen linki paylasin (gecici)
echo.
echo ========================================
echo.
echo Detayli talimatlar icin: PAYLASMA-REHBERI.md
echo.
pause
