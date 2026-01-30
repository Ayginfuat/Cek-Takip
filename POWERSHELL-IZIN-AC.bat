@echo off
chcp 65001 >nul
echo ========================================
echo POWERSHELL IZIN AYARI
echo ========================================
echo.
echo PowerShell script calistirma izni aciliyor...
echo.

echo [ADIM 1] Execution Policy degistiriliyor...
powershell -Command "Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser -Force"

echo.
echo [ADIM 2] Kontrol ediliyor...
powershell -Command "Get-ExecutionPolicy -List"

echo.
echo ========================================
echo [BASARILI] Izin acildi!
echo ========================================
echo.
echo Simdi npm komutlarini calistirabilirsiniz.
echo.
echo Sunucuyu baslatmak icin:
echo npm run dev:mobile
echo.
pause
