@echo off
echo ========================================
echo Cek Takip Sistemi - Telefon Icin Baslatiliyor...
echo ========================================
echo.
cd /d "%~dp0"
echo Mevcut dizin: %CD%
echo.
echo IP adresi bulunuyor...
echo.
for /f "tokens=2 delims=:" %%a in ('ipconfig ^| findstr /c:"IPv4"') do (
    set IP=%%a
    goto :found
)
:found
set IP=%IP:~1%
echo.
echo ========================================
echo ONEMLI BILGILER:
echo ========================================
echo.
echo 1. Bilgisayar ve telefonunuz AYNI WiFi aginda olmali!
echo.
echo 2. Telefonunuzun tarayicisinda su adresi acin:
echo    http://%IP%:5173
echo.
echo 3. Eger yukaridaki IP adresi calismazsa, asagidaki
echo    komutu calistirarak IP adresinizi bulun:
echo    ipconfig
echo.
echo 4. Windows Firewall uyarisi cikarsa "Erişime izin ver" secin
echo.
echo 5. Bu pencereyi KAPATMAYIN!
echo.
echo ========================================
echo.
echo Sunucu baslatiliyor...
echo.
npm run dev:mobile
pause
