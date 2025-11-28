# Script de Verificacao - Componentes Android
# Nao precisa de privilegios de administrador

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "VERIFICACAO DE COMPONENTES ANDROID SDK" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

# Definir caminhos
$sdkPath = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"

# 1. Verificar Android SDK
Write-Host "1. ANDROID SDK" -ForegroundColor Yellow
Write-Host "   Caminho: $sdkPath"
if (Test-Path $sdkPath) {
    Write-Host "   Status: INSTALADO" -ForegroundColor Green
}
else {
    Write-Host "   Status: NAO ENCONTRADO" -ForegroundColor Red
    Write-Host "   Acao: Instale o Android Studio" -ForegroundColor Yellow
}
Write-Host ""

# 2. Verificar Platform Tools (adb)
Write-Host "2. PLATFORM TOOLS (adb)" -ForegroundColor Yellow
$adbPath = "$sdkPath\platform-tools\adb.exe"
if (Test-Path $adbPath) {
    Write-Host "   Status: INSTALADO" -ForegroundColor Green
    try {
        $adbVersion = & $adbPath --version 2>&1 | Select-Object -First 1
        Write-Host "   Versao: $adbVersion" -ForegroundColor Gray
    }
    catch {}
}
else {
    Write-Host "   Status: NAO INSTALADO" -ForegroundColor Red
    Write-Host "   Acao: Instale via SDK Manager > SDK Tools > Android SDK Platform-Tools" -ForegroundColor Yellow
}
Write-Host ""

# 3. Verificar Build Tools
Write-Host "3. BUILD TOOLS" -ForegroundColor Yellow
$buildToolsPath = "$sdkPath\build-tools"
if (Test-Path $buildToolsPath) {
    $versions = Get-ChildItem $buildToolsPath -Directory -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name
    if ($versions.Count -gt 0) {
        Write-Host "   Status: INSTALADO" -ForegroundColor Green
        Write-Host "   Versoes: $($versions -join ', ')" -ForegroundColor Gray
        
        # Verificar se tem versao 34.x
        $hasV34 = $versions | Where-Object { $_ -like "34.*" }
        if ($hasV34) {
            Write-Host "   Versao 34.x: OK" -ForegroundColor Green
        }
        else {
            Write-Host "   Versao 34.x: FALTANDO (recomendada)" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "   Status: NAO INSTALADO" -ForegroundColor Red
        Write-Host "   Acao: Instale via SDK Manager > SDK Tools > Android SDK Build-Tools 34.0.0" -ForegroundColor Yellow
    }
}
else {
    Write-Host "   Status: NAO INSTALADO" -ForegroundColor Red
    Write-Host "   Acao: Instale via SDK Manager > SDK Tools > Android SDK Build-Tools 34.0.0" -ForegroundColor Yellow
}
Write-Host ""

# 4. Verificar Command-line Tools
Write-Host "4. COMMAND-LINE TOOLS (sdkmanager)" -ForegroundColor Yellow
$sdkmanagerPath = "$sdkPath\cmdline-tools\latest\bin\sdkmanager.bat"
if (Test-Path $sdkmanagerPath) {
    Write-Host "   Status: INSTALADO" -ForegroundColor Green
}
else {
    Write-Host "   Status: NAO INSTALADO" -ForegroundColor Red
    Write-Host "   Acao: Instale via SDK Manager > SDK Tools > Android SDK Command-line Tools" -ForegroundColor Yellow
}
Write-Host ""

# 5. Verificar Platforms (SDK)
Write-Host "5. SDK PLATFORMS" -ForegroundColor Yellow
$platformsPath = "$sdkPath\platforms"
if (Test-Path $platformsPath) {
    $platforms = Get-ChildItem $platformsPath -Directory -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name
    if ($platforms.Count -gt 0) {
        Write-Host "   Status: INSTALADO" -ForegroundColor Green
        Write-Host "   Versoes: $($platforms -join ', ')" -ForegroundColor Gray
        
        # Verificar se tem Android 14 (API 34)
        $hasAPI34 = $platforms | Where-Object { $_ -eq "android-34" }
        if ($hasAPI34) {
            Write-Host "   Android 14 (API 34): OK" -ForegroundColor Green
        }
        else {
            Write-Host "   Android 14 (API 34): FALTANDO (recomendada)" -ForegroundColor Yellow
        }
    }
    else {
        Write-Host "   Status: NAO INSTALADO" -ForegroundColor Red
        Write-Host "   Acao: Instale via SDK Manager > SDK Platforms > Android 14.0 (API 34)" -ForegroundColor Yellow
    }
}
else {
    Write-Host "   Status: NAO INSTALADO" -ForegroundColor Red
    Write-Host "   Acao: Instale via SDK Manager > SDK Platforms > Android 14.0 (API 34)" -ForegroundColor Yellow
}
Write-Host ""

# 6. Verificar Java (JDK)
Write-Host "6. JAVA JDK" -ForegroundColor Yellow
try {
    $javaVersion = java -version 2>&1 | Select-Object -First 1
    Write-Host "   Status: INSTALADO" -ForegroundColor Green
    Write-Host "   Versao: $javaVersion" -ForegroundColor Gray
}
catch {
    Write-Host "   Status: NAO ENCONTRADO" -ForegroundColor Red
    Write-Host "   Acao: Instale JDK 17 ou superior" -ForegroundColor Yellow
}
Write-Host ""

# 7. Verificar Node.js
Write-Host "7. NODE.JS" -ForegroundColor Yellow
try {
    $nodeVersion = node --version 2>&1
    Write-Host "   Status: INSTALADO" -ForegroundColor Green
    Write-Host "   Versao: $nodeVersion" -ForegroundColor Gray
}
catch {
    Write-Host "   Status: NAO ENCONTRADO" -ForegroundColor Red
    Write-Host "   Acao: Instale Node.js LTS" -ForegroundColor Yellow
}
Write-Host ""

# 8. Verificar npm
Write-Host "8. NPM" -ForegroundColor Yellow
try {
    $npmVersion = npm --version 2>&1
    Write-Host "   Status: INSTALADO" -ForegroundColor Green
    Write-Host "   Versao: $npmVersion" -ForegroundColor Gray
}
catch {
    Write-Host "   Status: NAO ENCONTRADO" -ForegroundColor Red
}
Write-Host ""

# 9. Verificar Bubblewrap
Write-Host "9. BUBBLEWRAP CLI" -ForegroundColor Yellow
try {
    $bubblewrapCheck = npm list -g @bubblewrap/cli 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   Status: INSTALADO" -ForegroundColor Green
        try {
            $bwVersion = npx @bubblewrap/cli --version 2>&1
            Write-Host "   Versao: $bwVersion" -ForegroundColor Gray
        }
        catch {}
    }
    else {
        Write-Host "   Status: NAO INSTALADO" -ForegroundColor Red
        Write-Host "   Acao: Execute 'npm install -g @bubblewrap/cli'" -ForegroundColor Yellow
    }
}
catch {
    Write-Host "   Status: NAO INSTALADO" -ForegroundColor Red
    Write-Host "   Acao: Execute 'npm install -g @bubblewrap/cli'" -ForegroundColor Yellow
}
Write-Host ""

# 10. Verificar Gradle (opcional, mas util)
Write-Host "10. GRADLE (Opcional)" -ForegroundColor Yellow
try {
    $gradleVersion = gradle --version 2>&1 | Select-Object -First 1
    Write-Host "   Status: INSTALADO" -ForegroundColor Green
    Write-Host "   Versao: $gradleVersion" -ForegroundColor Gray
}
catch {
    Write-Host "   Status: NAO INSTALADO" -ForegroundColor Yellow
    Write-Host "   Info: Bubblewrap usa Gradle Wrapper (nao precisa instalar)" -ForegroundColor Gray
}
Write-Host ""

# 11. Verificar variaveis de ambiente
Write-Host "11. VARIAVEIS DE AMBIENTE" -ForegroundColor Yellow
$androidHome = [System.Environment]::GetEnvironmentVariable('ANDROID_HOME', 'Machine')
$androidSdkRoot = [System.Environment]::GetEnvironmentVariable('ANDROID_SDK_ROOT', 'Machine')

if ($androidHome) {
    Write-Host "   ANDROID_HOME: $androidHome" -ForegroundColor Green
}
else {
    Write-Host "   ANDROID_HOME: NAO CONFIGURADO" -ForegroundColor Red
    Write-Host "   Acao: Execute o script configurar-android-sdk.ps1 como Admin" -ForegroundColor Yellow
}

if ($androidSdkRoot) {
    Write-Host "   ANDROID_SDK_ROOT: $androidSdkRoot" -ForegroundColor Green
}
else {
    Write-Host "   ANDROID_SDK_ROOT: NAO CONFIGURADO" -ForegroundColor Red
    Write-Host "   Acao: Execute o script configurar-android-sdk.ps1 como Admin" -ForegroundColor Yellow
}
Write-Host ""

# Resumo
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "RESUMO" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

$componentsOK = 0
$componentsMissing = 0

# Contar componentes essenciais
$essentialComponents = @(
    @{Name = "Android SDK"; Path = $sdkPath },
    @{Name = "Platform Tools"; Path = $adbPath },
    @{Name = "Build Tools"; Path = $buildToolsPath },
    @{Name = "Command-line Tools"; Path = $sdkmanagerPath },
    @{Name = "SDK Platforms"; Path = $platformsPath }
)

foreach ($comp in $essentialComponents) {
    if (Test-Path $comp.Path) {
        $componentsOK++
    }
    else {
        $componentsMissing++
    }
}

Write-Host "Componentes essenciais OK: $componentsOK/5" -ForegroundColor $(if ($componentsOK -eq 5) { "Green" } else { "Yellow" })
Write-Host "Componentes faltando: $componentsMissing/5" -ForegroundColor $(if ($componentsMissing -eq 0) { "Green" } else { "Red" })
Write-Host ""

if ($componentsMissing -gt 0) {
    Write-Host "PROXIMOS PASSOS:" -ForegroundColor Yellow
    Write-Host "1. Abra o Android Studio" -ForegroundColor White
    Write-Host "2. Va em: More Actions > SDK Manager" -ForegroundColor White
    Write-Host "3. Instale os componentes marcados como FALTANDO acima" -ForegroundColor White
    Write-Host "4. Execute este script novamente para verificar" -ForegroundColor White
}
else {
    Write-Host "PARABENS! Todos os componentes essenciais estao instalados!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Proximo passo: Execute configurar-android-sdk.ps1 como Admin" -ForegroundColor Yellow
    Write-Host "para configurar as variaveis de ambiente." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
