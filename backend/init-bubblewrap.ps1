# Script para Inicializar Bubblewrap
# Responde automaticamente as perguntas de configuracao inicial

Write-Host "Inicializando Bubblewrap pela primeira vez..." -ForegroundColor Cyan
Write-Host ""

# Criar um arquivo de resposta automatica
$env:BUBBLEWRAP_SKIP_JDK_INSTALL = "true"

# Executar bubblewrap doctor para inicializar
Write-Host "Executando 'bubblewrap doctor'..." -ForegroundColor Yellow
npx @bubblewrap/cli doctor

Write-Host ""
Write-Host "Inicializacao concluida!" -ForegroundColor Green
Write-Host "Agora tente fazer o build novamente." -ForegroundColor Yellow
