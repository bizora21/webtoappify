@echo off
echo ========================================
echo WebToAppify Backend Server
echo ========================================
echo.

cd /d "%~dp0backend"

REM Configurar Java no PATH
set "JAVA_HOME=C:\Program Files\Eclipse Adoptium\jdk-17.0.17.10-hotspot"
set "PATH=%JAVA_HOME%\bin;%PATH%"

echo Verificando ferramentas...
echo.

REM Verificar Node.js
node --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [X] Node.js nao encontrado
) else (
    echo [OK] Node.js instalado
)

REM Verificar Java
java -version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [X] Java nao encontrado
) else (
    echo [OK] Java JDK instalado
)

REM Verificar Bubblewrap
call bubblewrap --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [X] Bubblewrap nao encontrado
) else (
    echo [OK] Bubblewrap instalado
)

REM Verificar Android SDK
adb --version >nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo [!] Android SDK nao encontrado - Sistema funcionara em modo SIMULACAO
) else (
    echo [OK] Android SDK instalado - Sistema funcionara em modo REAL
)

echo.
echo ========================================
echo.

echo Checking if node_modules exists...
if not exist "node_modules\" (
    echo Installing dependencies...
    call npm install
    echo.
)

echo Starting backend server...
echo Backend will run on http://localhost:3000
echo Press Ctrl+C to stop
echo.

call npm run dev
