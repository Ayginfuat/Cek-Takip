@echo off
chcp 65001 >nul
echo ========================================
echo SUNUCU BASLATMA (CMD ile)
echo ========================================
echo.
echo PowerShell sorunu varsa CMD kullaniliyor...
echo.

cd /d "%~dp0"

echo [1/2] Mevcut sunucuyu durdurun
echo.
echo Eger sunucu calisiyorsa:
echo - Terminal penceresine tiklayin
echo - Ctrl+C tuslarina basin
echo.
echo Sunucu durdu mu? (E/H)
set /p durdu="> "

echo.
echo [2/2] Sunucu baslatiliyor...
echo.

start cmd /k "cd /d %CD% && echo ======================================== && echo CEK TAKIP SUNUCUSU && echo ======================================== && echo. && echo Sunucu baslatiliyor... && echo. && echo NOT: Bu pencereyi KAPATMAYIN! && echo Durdurmak icin Ctrl+C tuslarina basin && echo. && echo ======================================== && echo. && npm run dev:mobile"

timeout /t 3 /nobreak >nul

echo.
echo ========================================
echo [BASARILI] Sunucu baslatildi!
echo ========================================
echo.
echo Yeni bir CMD penceresi acildi.
echo Sunucu orada calisiyor.
echo.
echo Sunucuyu durdurmak icin:
echo - CMD penceresine tiklayin
echo - Ctrl+C tuslarina basin
echo.
echo ========================================
echo.
pause
