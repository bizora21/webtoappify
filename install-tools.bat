@echo off
echo ========================================
echo WebToAppify - Instalador Automatico
echo ========================================
echo.
echo Este script ira instalar as ferramentas necessarias:
echo - Bubblewrap CLI
echo - Verificar Java JDK
echo - Verificar Android SDK
echo.
pause

echo.
echo [1/3] Instalando Bubblewrap CLI...
echo.
call npm install -g @bubblewrap/cli
if %ERRORLEVEL% NEQ 0 (
    echo ERRO: Falha ao instalar Bubblewrap CLI
    pause
    exit /b 1
)
echo ✓ Bubblewrap CLI instalado com sucesso!

echo.
echo [2/3] Verificando Java JDK...
echo.
java -version 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️  Java JDK nao encontrado!
    echo.
    echo Por favor, instale o Java JDK 17 manualmente:
    echo 1. Acesse: https://adoptium.net/temurin/releases/
    echo 2. Baixe o instalador para Windows x64
    echo 3. Execute e marque "Add to PATH"
    echo 4. Reinicie este script
    echo.
    pause
    exit /b 1
) else (
    echo ✓ Java JDK encontrado!
)

echo.
echo [3/3] Verificando Android SDK...
echo.
adb --version 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo.
    echo ⚠️  Android SDK nao encontrado!
    echo.
    echo OPCAO 1 - Instalar Android Studio (Recomendado):
    echo 1. Acesse: https://developer.android.com/studio
    echo 2. Baixe e instale
    echo 3. Abra o SDK Manager e instale:
    echo    - Android SDK Platform 34
    echo    - Android SDK Build-Tools 34.0.0
    echo    - Android SDK Platform-Tools
    echo.
    echo OPCAO 2 - Usar Docker (Mais Facil):
    echo 1. Instale Docker Desktop: https://www.docker.com/products/docker-desktop/
    echo 2. Execute: docker-compose up --build
    echo.
    pause
    exit /b 1
) else (
    echo ✓ Android SDK encontrado!
)

echo.
echo ========================================
echo ✓ Todas as ferramentas estao instaladas!
echo ========================================
echo.
echo Voce pode agora:
echo 1. Executar: start-backend.bat
echo 2. Executar: start-frontend.bat
echo 3. Acessar: http://localhost:5173
echo.
pause
