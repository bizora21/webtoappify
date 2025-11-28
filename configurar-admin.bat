@echo off
cd /d "%~dp0"
echo ==========================================
echo CONFIGURANDO ANDROID SDK (ADMINISTRADOR)
echo ==========================================
echo.
powershell -ExecutionPolicy Bypass -File .\configurar-android-sdk.ps1
echo.
pause
