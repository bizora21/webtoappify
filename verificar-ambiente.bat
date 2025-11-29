@echo off
echo ====================================
echo Verificando Ambiente de Build
echo ====================================
echo.

echo [1/5] Verificando Java...
java -version 2>&1 | findstr /i "version"
if %ERRORLEVEL% equ 0 (
    echo    ✓ Java encontrado
) else (
    echo    ✗ Java NAO encontrado
    echo    ERRO: Instale o Java JDK 17+
)
echo.

echo [2/5] Verificando JAVA_HOME...
if defined JAVA_HOME (
    echo    ✓ JAVA_HOME definido: %JAVA_HOME%
) else (
    echo    ✗ JAVA_HOME NAO definido
    echo    AVISO: Defina JAVA_HOME para o caminho do JDK
)
echo.

echo [3/5] Verificando Android SDK...
if defined ANDROID_HOME (
    echo    ✓ ANDROID_HOME definido: %ANDROID_HOME%
) else (
    set ANDROID_HOME=%LOCALAPPDATA%\Android\Sdk
    echo    ⚠ ANDROID_HOME nao definido, usando padrao: !ANDROID_HOME!
)
echo.

echo [4/5] Verificando ADB (Android Debug Bridge)...
adb --version 2>nul
if %ERRORLEVEL% equ 0 (
    echo    ✓ ADB encontrado
) else (
    echo    ✗ ADB NAO encontrado
    echo    ERRO: Android SDK Platform-Tools nao instalado
)
echo.

echo [5/5] Verificando Build Tools...
if exist "%ANDROID_HOME%\build-tools" (
    echo    ✓ Build Tools encontrados em: %ANDROID_HOME%\build-tools
    dir /b "%ANDROID_HOME%\build-tools" 2>nul
) else (
    echo    ✗ Build Tools NAO encontrados
    echo    ERRO: Instale Android SDK Build Tools
)
echo.

echo ====================================
echo Resumo
echo ====================================
echo.
echo Se todos os itens estiverem com ✓, o ambiente esta OK.
echo Se houver ✗, corrija os problemas antes de fazer builds.
echo.
pause
