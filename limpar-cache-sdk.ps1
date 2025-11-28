# Script para Limpar Cache do Android SDK Manager
# Resolve erro "Not in GZIP format"

Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "LIMPEZA DE CACHE - Android SDK Manager" -ForegroundColor Cyan
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "Este script vai limpar o cache corrompido do SDK Manager" -ForegroundColor Yellow
Write-Host ""

# Verificar se Android Studio esta rodando
$studioProcess = Get-Process -Name "studio64" -ErrorAction SilentlyContinue
if ($studioProcess) {
    Write-Host "AVISO: Android Studio esta rodando!" -ForegroundColor Red
    Write-Host "Por favor, feche o Android Studio antes de continuar." -ForegroundColor Yellow
    Write-Host ""
    $continue = Read-Host "Deseja continuar mesmo assim? (S/N)"
    if ($continue -ne 'S' -and $continue -ne 's') {
        Write-Host "Operacao cancelada." -ForegroundColor Gray
        exit 0
    }
}

Write-Host ""
Write-Host "Limpando cache..." -ForegroundColor Yellow
Write-Host ""

# 1. Limpar cache do Android
$androidCache = "$env:USERPROFILE\.android\cache"
if (Test-Path $androidCache) {
    try {
        Remove-Item -Path $androidCache -Recurse -Force -ErrorAction Stop
        Write-Host "[OK] Cache do Android limpo: $androidCache" -ForegroundColor Green
    }
    catch {
        Write-Host "[ERRO] Erro ao limpar cache do Android: $_" -ForegroundColor Red
    }
}
else {
    Write-Host "[INFO] Cache do Android nao encontrado (OK)" -ForegroundColor Gray
}

# 2. Limpar temp do SDK
$sdkTemp = "$env:LOCALAPPDATA\Android\Sdk\temp"
if (Test-Path $sdkTemp) {
    try {
        Remove-Item -Path $sdkTemp -Recurse -Force -ErrorAction Stop
        Write-Host "[OK] Temp do SDK limpo: $sdkTemp" -ForegroundColor Green
    }
    catch {
        Write-Host "[ERRO] Erro ao limpar temp do SDK: $_" -ForegroundColor Red
    }
}
else {
    Write-Host "[INFO] Temp do SDK nao encontrado (OK)" -ForegroundColor Gray
}

# 3. Limpar downloads parciais
$sdkDownloads = "$env:LOCALAPPDATA\Android\Sdk\.downloadIntermediates"
if (Test-Path $sdkDownloads) {
    try {
        Remove-Item -Path $sdkDownloads -Recurse -Force -ErrorAction Stop
        Write-Host "[OK] Downloads parciais limpos: $sdkDownloads" -ForegroundColor Green
    }
    catch {
        Write-Host "[ERRO] Erro ao limpar downloads parciais: $_" -ForegroundColor Red
    }
}
else {
    Write-Host "[INFO] Downloads parciais nao encontrados (OK)" -ForegroundColor Gray
}

# 4. Limpar cache do Gradle (pode ajudar)
$gradleCache = "$env:USERPROFILE\.gradle\caches"
if (Test-Path $gradleCache) {
    Write-Host ""
    $cleanGradle = Read-Host "Deseja limpar o cache do Gradle tambem? (S/N)"
    if ($cleanGradle -eq 'S' -or $cleanGradle -eq 's') {
        try {
            Remove-Item -Path $gradleCache -Recurse -Force -ErrorAction Stop
            Write-Host "[OK] Cache do Gradle limpo: $gradleCache" -ForegroundColor Green
        }
        catch {
            Write-Host "[ERRO] Erro ao limpar cache do Gradle: $_" -ForegroundColor Red
        }
    }
}

Write-Host ""
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host "LIMPEZA CONCLUIDA!" -ForegroundColor Green
Write-Host "=========================================" -ForegroundColor Cyan
Write-Host ""

Write-Host "PROXIMOS PASSOS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. Abra o Android Studio" -ForegroundColor White
Write-Host "2. More Actions -> SDK Manager" -ForegroundColor White
Write-Host "3. SDK Tools -> Android SDK Command-line Tools" -ForegroundColor White
Write-Host "4. Tente instalar novamente" -ForegroundColor White
Write-Host ""
Write-Host "Se o erro persistir:" -ForegroundColor Yellow
Write-Host "- Tente instalar uma versao especifica (13.0, 12.0, 11.0)" -ForegroundColor White
Write-Host "  ao inves de 'latest'" -ForegroundColor White
Write-Host "- Ou consulte: SOLUCAO-ERRO-COMMAND-LINE-TOOLS.md" -ForegroundColor White
Write-Host ""
