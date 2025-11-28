# Script de Configuracao Automatica - Android SDK
# Execute como Administrador

Write-Host "Configurando Android SDK para WebToAppify..." -ForegroundColor Cyan
Write-Host ""

# Verificar se esta rodando como Admin
$isAdmin = ([Security.Principal.WindowsPrincipal] [Security.Principal.WindowsIdentity]::GetCurrent()).IsInRole([Security.Principal.WindowsBuiltInRole]::Administrator)

if (-not $isAdmin) {
    Write-Host "ERRO: Execute este script como Administrador!" -ForegroundColor Red
    Write-Host "   Clique com botao direito -> 'Executar como administrador'" -ForegroundColor Yellow
    pause
    exit 1
}

# Definir caminhos
$sdkPath = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"

Write-Host "Verificando instalacao do Android SDK..." -ForegroundColor Yellow

# Verificar se SDK existe
if (-not (Test-Path $sdkPath)) {
    Write-Host "ERRO: Android SDK nao encontrado em: $sdkPath" -ForegroundColor Red
    Write-Host "   Por favor, instale o Android Studio primeiro!" -ForegroundColor Yellow
    pause
    exit 1
}

Write-Host "OK: Android SDK encontrado!" -ForegroundColor Green
Write-Host ""

# Configurar ANDROID_HOME
Write-Host "Configurando variaveis de ambiente..." -ForegroundColor Yellow

[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', $sdkPath, 'Machine')
Write-Host "   OK: ANDROID_HOME = $sdkPath" -ForegroundColor Green

[System.Environment]::SetEnvironmentVariable('ANDROID_SDK_ROOT', $sdkPath, 'Machine')
Write-Host "   OK: ANDROID_SDK_ROOT = $sdkPath" -ForegroundColor Green

# Adicionar ao PATH
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')
$pathsToAdd = @(
    "$sdkPath\platform-tools"
)

# Encontrar cmdline-tools (latest ou versao especifica)
$cmdlinePath = "$sdkPath\cmdline-tools"
if (Test-Path "$cmdlinePath\latest\bin") {
    $pathsToAdd += "$cmdlinePath\latest\bin"
}
elseif (Test-Path $cmdlinePath) {
    $versions = Get-ChildItem $cmdlinePath -Directory
    if ($versions.Count -gt 0) {
        # Pegar a ultima versao (ex: 12.0)
        $latestVersion = $versions | Sort-Object Name -Descending | Select-Object -First 1
        $pathsToAdd += "$latestVersion\bin"
        Write-Host "   INFO: Usando cmdline-tools versao $($latestVersion.Name)" -ForegroundColor Gray
    }
}

$pathsToAdd += "$sdkPath\tools\bin"

$pathsAdded = 0
foreach ($newPath in $pathsToAdd) {
    if ($currentPath -notlike "*$newPath*") {
        $currentPath += ";$newPath"
        $pathsAdded++
        Write-Host "   OK: Adicionado ao PATH: $newPath" -ForegroundColor Green
    }
    else {
        Write-Host "   INFO: Ja existe no PATH: $newPath" -ForegroundColor Gray
    }
}

if ($pathsAdded -gt 0) {
    [System.Environment]::SetEnvironmentVariable('Path', $currentPath, 'Machine')
}

Write-Host ""
Write-Host "Verificando componentes instalados..." -ForegroundColor Yellow

# Verificar Platform Tools
if (Test-Path "$sdkPath\platform-tools\adb.exe") {
    Write-Host "   OK: Platform Tools instalado (adb encontrado)" -ForegroundColor Green
}
else {
    Write-Host "   AVISO: Platform Tools NAO instalado" -ForegroundColor Red
    Write-Host "      Instale via SDK Manager: Android SDK Platform-Tools" -ForegroundColor Yellow
}

# Verificar Build Tools
$buildToolsPath = "$sdkPath\build-tools"
if (Test-Path $buildToolsPath) {
    $versions = Get-ChildItem $buildToolsPath -Directory | Select-Object -ExpandProperty Name
    if ($versions.Count -gt 0) {
        Write-Host "   OK: Build Tools instalado (versoes: $($versions -join ', '))" -ForegroundColor Green
    }
    else {
        Write-Host "   AVISO: Build Tools NAO instalado" -ForegroundColor Red
        Write-Host "      Instale via SDK Manager: Android SDK Build-Tools" -ForegroundColor Yellow
    }
}
else {
    Write-Host "   AVISO: Build Tools NAO instalado" -ForegroundColor Red
}

# Verificar Command-line Tools
$hasCmdLine = $false
if (Test-Path "$sdkPath\cmdline-tools\latest\bin\sdkmanager.bat") {
    $hasCmdLine = $true
}
elseif (Test-Path "$sdkPath\cmdline-tools") {
    $versions = Get-ChildItem "$sdkPath\cmdline-tools" -Directory
    if ($versions.Count -gt 0) {
        $hasCmdLine = $true
    }
}

if ($hasCmdLine) {
    Write-Host "   OK: Command-line Tools instalado" -ForegroundColor Green
}
else {
    Write-Host "   AVISO: Command-line Tools NAO instalado" -ForegroundColor Red
    Write-Host "      Instale via SDK Manager: Android SDK Command-line Tools" -ForegroundColor Yellow
}

# Verificar Platforms
$platformsPath = "$sdkPath\platforms"
if (Test-Path $platformsPath) {
    $platforms = Get-ChildItem $platformsPath -Directory | Select-Object -ExpandProperty Name
    if ($platforms.Count -gt 0) {
        Write-Host "   OK: SDK Platforms instalado (versoes: $($platforms -join ', '))" -ForegroundColor Green
    }
    else {
        Write-Host "   AVISO: SDK Platforms NAO instalado" -ForegroundColor Red
        Write-Host "      Instale via SDK Manager: Android SDK Platform 34" -ForegroundColor Yellow
    }
}
else {
    Write-Host "   AVISO: SDK Platforms NAO instalado" -ForegroundColor Red
}

Write-Host ""
Write-Host "Verificando Bubblewrap..." -ForegroundColor Yellow

# Verificar se npm esta disponivel
try {
    $npmVersion = npm --version 2>$null
    Write-Host "   OK: npm encontrado (versao $npmVersion)" -ForegroundColor Green
    
    # Verificar se Bubblewrap esta instalado
    npm list -g @bubblewrap/cli 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "   OK: Bubblewrap ja instalado" -ForegroundColor Green
    }
    else {
        Write-Host "   INFO: Instalando Bubblewrap..." -ForegroundColor Yellow
        npm install -g @bubblewrap/cli
        if ($LASTEXITCODE -eq 0) {
            Write-Host "   OK: Bubblewrap instalado com sucesso!" -ForegroundColor Green
        }
        else {
            Write-Host "   ERRO: Falha ao instalar Bubblewrap" -ForegroundColor Red
        }
    }
}
catch {
    Write-Host "   ERRO: npm nao encontrado" -ForegroundColor Red
    Write-Host "      Instale Node.js primeiro!" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host "CONFIGURACAO CONCLUIDA!" -ForegroundColor Green
Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "PROXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. IMPORTANTE: Feche TODOS os terminais abertos" -ForegroundColor Yellow
Write-Host "2. Abra um NOVO terminal (para carregar as variaveis)" -ForegroundColor Yellow
Write-Host "3. Execute os comandos de verificacao:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   java -version" -ForegroundColor White
Write-Host "   adb --version" -ForegroundColor White
Write-Host "   sdkmanager --list" -ForegroundColor White
Write-Host "   npx @bubblewrap/cli --version" -ForegroundColor White
Write-Host ""
Write-Host "4. Reinicie o backend:" -ForegroundColor Yellow
Write-Host ""
Write-Host "   cd c:\Users\USER\Desktop\webtoappify\backend" -ForegroundColor White
Write-Host "   npm run dev" -ForegroundColor White
Write-Host ""
Write-Host "5. Teste um build real em: http://localhost:5173" -ForegroundColor Yellow
Write-Host ""

Write-Host "=======================================================" -ForegroundColor Cyan
Write-Host ""

# Perguntar se quer abrir SDK Manager
$openSDK = Read-Host "Deseja abrir o SDK Manager agora para instalar componentes faltantes? (S/N)"
if ($openSDK -eq 'S' -or $openSDK -eq 's') {
    Write-Host "Abrindo Android Studio SDK Manager..." -ForegroundColor Cyan
    
    # Tentar encontrar Android Studio
    $studioPaths = @(
        "C:\Program Files\Android\Android Studio\bin\studio64.exe",
        "C:\Program Files (x86)\Android\Android Studio\bin\studio64.exe"
    )
    
    $studioFound = $false
    foreach ($path in $studioPaths) {
        if (Test-Path $path) {
            Start-Process $path
            $studioFound = $true
            Write-Host "   OK: Android Studio aberto!" -ForegroundColor Green
            Write-Host "   Va em: More Actions -> SDK Manager" -ForegroundColor Yellow
            break
        }
    }
    
    if (-not $studioFound) {
        Write-Host "   AVISO: Android Studio nao encontrado automaticamente" -ForegroundColor Yellow
        Write-Host "   Abra manualmente e va em: More Actions -> SDK Manager" -ForegroundColor Yellow
    }
}

Write-Host ""
Write-Host "Pressione qualquer tecla para sair..." -ForegroundColor Gray
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")
