@echo off
echo ========================================
echo Cek Takip Sistemi Baslatiliyor...
echo ========================================
echo.
cd /d "%~dp0"
echo Mevcut dizin: %CD%
echo.
echo npm run dev komutu calistiriliyor...
echo.
echo NOT: Bu pencereyi KAPATMAYIN!
echo Tarayicida http://localhost:5173 adresini acin
echo.
echo Durdurmak icin Ctrl+C tuslarina basin
echo.
echo ========================================
echo.
npm run dev
pause
