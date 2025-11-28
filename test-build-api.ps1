# Script de Teste de Build via API
# Envia uma requisicao para o backend local para iniciar um build

$apiUrl = "http://localhost:3000/api/build"
$iconPath = "c:\Users\USER\Desktop\webtoappify\test-icon.png"

# Criar um icone de teste se nao existir
if (-not (Test-Path $iconPath)) {
    Write-Host "Criando icone de teste..."
    # Download de um placeholder
    Invoke-WebRequest -Uri "https://via.placeholder.com/512.png" -OutFile $iconPath
}

Write-Host "Enviando requisicao de build para $apiUrl..."

# Configuração do App
$config = @{
    appName      = "Teste App"
    packageName  = "com.teste.app"
    url          = "https://example.com"
    primaryColor = "#000000"
    version      = "1.0.0"
} | ConvertTo-Json

# Preparar Multipart Form Data (simulado via curl pois Invoke-RestMethod tem bugs com multipart em versoes antigas do PS)
# Mas vamos usar Node.js para isso ser mais confiavel

$testScript = @"
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

async function run() {
    try {
        const form = new FormData();
        form.append('config', JSON.stringify({
            appName: 'Teste Real CLI',
            packageName: 'com.teste.cli',
            url: 'https://example.com',
            primaryColor: '#4F46E5',
            version: '1.0.0'
        }));
        
        if (fs.existsSync('$iconPath'.replace(/\\/g, '/'))) {
            form.append('icon', fs.createReadStream('$iconPath'.replace(/\\/g, '/')));
        }

        console.log('Enviando requisicao...');
        const res = await axios.post('$apiUrl', form, {
            headers: {
                ...form.getHeaders()
            }
        });

        console.log('Build iniciado! ID:', res.data.id);
        console.log('Status:', res.data.status);
        console.log('Monitore os logs no terminal do backend.');
        
    } catch (e) {
        console.error('Erro:', e.message);
        if (e.response) {
            console.error('Dados:', e.response.data);
        }
    }
}

run();
"@

$testScript | Out-File "test-build.js" -Encoding UTF8

Write-Host "Executando teste com Node.js..."
node test-build.js

Write-Host ""
Write-Host "Se o build iniciou, verifique o terminal onde 'npm run dev' esta rodando."
