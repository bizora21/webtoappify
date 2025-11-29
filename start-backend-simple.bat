@echo off
echo ========================================
echo WebToAppify Backend Server (Simple)
echo ========================================
echo.

cd /d "%~dp0backend"

REM Configurar Java no PATH
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Starting backend server...
echo Backend will run on http://localhost:3000
echo Press Ctrl+C to stop
echo.

call npm run dev
