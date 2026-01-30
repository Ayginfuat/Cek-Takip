@echo off
chcp 65001 >nul
echo ========================================
echo SUNUCU YENIDEN BASLATMA
echo ========================================
echo.

cd /d "%~dp0"

echo [ADIM 1] Mevcut sunucuyu durdurun
echo.
echo Eger sunucu calisiyorsa:
echo 1. Sunucunun calistigi terminal penceresini bulun
echo 2. Terminal penceresine tiklayin
echo 3. Ctrl+C tuslarina basin (sunucu duracak)
echo.
echo Sunucu durdu mu? (E/H)
set /p durdu="> "

if /i "%durdu%"=="H" (
    echo.
    echo Sunucuyu durdurmak icin:
    echo 1. Terminal penceresini bulun
    echo 2. Ctrl+C tuslarina basin
    echo.
    echo Sonra bu scripti tekrar calistirin.
    pause
    exit /b
)

echo.
echo [ADIM 2] Sunucuyu yeniden baslatma...
echo.
echo Yeni bir terminal penceresi aciliyor...
echo.

start cmd /k "cd /d %CD% && echo ======================================== && echo CEK TAKIP SUNUCUSU && echo ======================================== && echo. && echo Sunucu baslatiliyor... && echo. && echo NOT: Bu pencereyi KAPATMAYIN! && echo Durdurmak icin Ctrl+C tuslarina basin && echo. && echo ======================================== && echo. && npm run dev:mobile"

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo [BASARILI] Sunucu baslatildi!
echo ========================================
echo.
echo Yeni bir terminal penceresi acildi.
echo Sunucu orada calisiyor.
echo.
echo Sunucuyu durdurmak icin:
echo - Terminal penceresine tiklayin
echo - Ctrl+C tuslarina basin
echo.
echo ========================================
echo.
pause
