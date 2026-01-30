@echo off
chcp 65001 >nul
echo ========================================
echo GITHUB PAGES AKTIF ETME
echo ========================================
echo.

echo GitHub Pages'i aktif etmek icin:
echo.
echo [ADIM 1] GitHub'da repository'yi acin
echo    https://github.com/Ayginfuat/Cek-Takip
echo.
echo [ADIM 2] Settings sekmesine tiklayin
echo.
echo [ADIM 3] Sol menuden "Pages" secenegine tiklayin
echo.
echo [ADIM 4] Source bolumunde:
echo    - "Deploy from a branch" secin
echo    - Branch: "main" secin
echo    - Folder: "/ (root)" secin
echo    - "Save" butonuna tiklayin
echo.
echo VEYA (Daha iyi):
echo    - "GitHub Actions" secin
echo    - Otomatik deploy edilecek!
echo.
echo [ADIM 5] 1-2 dakika bekleyin
echo.
echo [ADIM 6] Linkiniz hazir:
echo    https://ayginfuat.github.io/Cek-Takip/
echo.
echo ========================================
echo.
echo Detayli talimatlar: GITHUB-PAGES-AKTIF-ET.md
echo.
echo GitHub'i acmak icin...
timeout /t 3 /nobreak >nul

start https://github.com/Ayginfuat/Cek-Takip/settings/pages

echo.
pause
