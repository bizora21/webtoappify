# Quick Check Script
$sdkPath = "C:\Users\$env:USERNAME\AppData\Local\Android\Sdk"

Write-Output "=== VERIFICACAO RAPIDA ==="
Write-Output ""

# Android SDK
Write-Output "1. Android SDK: $(if (Test-Path $sdkPath) { 'OK' } else { 'FALTANDO' })"

# Platform Tools
Write-Output "2. Platform Tools: $(if (Test-Path "$sdkPath\platform-tools\adb.exe") { 'OK' } else { 'FALTANDO' })"

# Build Tools
$buildTools = Get-ChildItem "$sdkPath\build-tools" -Directory -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name
Write-Output "3. Build Tools: $(if ($buildTools) { $buildTools -join ', ' } else { 'FALTANDO' })"
if ($buildTools -notcontains "34.0.0") {
    Write-Output "   AVISO: Build Tools 34.0.0 recomendado (tem: $($buildTools -join ', '))"
}

# Command-line Tools
$cmdlinePath = "$sdkPath\cmdline-tools"
$hasCmdLine = $false
if (Test-Path $cmdlinePath) {
    $versions = Get-ChildItem $cmdlinePath -Directory
    if ($versions.Count -gt 0) {
        $hasCmdLine = $true
        Write-Output "4. Command-line Tools: OK (Versoes: $($versions.Name -join ', '))"
    }
}

if (-not $hasCmdLine) {
    Write-Output "4. Command-line Tools: FALTANDO"
}

# Platforms
$platforms = Get-ChildItem "$sdkPath\platforms" -Directory -ErrorAction SilentlyContinue | Select-Object -ExpandProperty Name
Write-Output "5. SDK Platforms: $(if ($platforms) { $platforms -join ', ' } else { 'FALTANDO' })"
if ($platforms -notcontains "android-34") {
    Write-Output "   AVISO: Android 14 (API 34) recomendado (tem: $($platforms -join ', '))"
}

# Java
try {
    $javaVer = java -version 2>&1 | Select-Object -First 1
    Write-Output "6. Java: OK - $javaVer"
}
catch {
    Write-Output "6. Java: FALTANDO"
}

# Node
try {
    $nodeVer = node --version
    Write-Output "7. Node.js: OK - $nodeVer"
}
catch {
    Write-Output "7. Node.js: FALTANDO"
}

# Bubblewrap
$bwCheck = npm list -g @bubblewrap/cli 2>&1
Write-Output "8. Bubblewrap: $(if ($LASTEXITCODE -eq 0) { 'OK' } else { 'FALTANDO' })"

Write-Output ""
Write-Output "=== COMPONENTES FALTANDO ==="
Write-Output ""

$missing = @()

if (-not $hasCmdLine) {
    $missing += "- Command-line Tools"
}

if ($buildTools -notcontains "34.0.0") {
    $missing += "- Build Tools 34.0.0"
}

if ($platforms -notcontains "android-34") {
    $missing += "- Android 14 (API 34)"
}

if ($missing.Count -gt 0) {
    foreach ($item in $missing) {
        Write-Output $item
    }
    Write-Output ""
    Write-Output "ACAO: Abra Android Studio > More Actions > SDK Manager"
    Write-Output "       e instale os componentes acima."
}
else {
    Write-Output "Nenhum componente essencial faltando!"
}
