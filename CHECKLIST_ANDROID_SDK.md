# ✅ CHECKLIST RÁPIDO - Android SDK

**Tempo total**: 30-40 minutos  
**Ideal para**: Máquinas com 8GB RAM ✅

---

## 📦 PASSO 1: SDK MANAGER (10 min)

### Abrir SDK Manager:
- [ ] Abri o Android Studio
- [ ] Cliquei em "More Actions" → "SDK Manager"

### Aba "SDK Platforms":
- [ ] Marquei: ✅ Android 14.0 (API 34)
- [ ] Cliquei em "Apply"
- [ ] Aguardei download (~500 MB)

### Aba "SDK Tools":
- [ ] Marquei: ✅ Android SDK Build-Tools 34.0.0
- [ ] Marquei: ✅ Android SDK Platform-Tools
- [ ] Marquei: ✅ Android SDK Command-line Tools (latest)
- [ ] Cliquei em "Apply"
- [ ] Aceitei todas as licenças
- [ ] Aguardei download (~2-3 GB)

---

## 🌐 PASSO 2: VARIÁVEIS DE AMBIENTE (5 min)

### Opção Rápida - PowerShell:
- [ ] Abri PowerShell como Administrador
- [ ] Executei o script de configuração (ver abaixo)
- [ ] Vi mensagem: "✅ Variáveis configuradas!"

### Script para copiar e colar:
```powershell
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\USER\AppData\Local\Android\Sdk', 'Machine')
[System.Environment]::SetEnvironmentVariable('ANDROID_SDK_ROOT', 'C:\Users\USER\AppData\Local\Android\Sdk', 'Machine')
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')
$newPaths = @('C:\Users\USER\AppData\Local\Android\Sdk\platform-tools', 'C:\Users\USER\AppData\Local\Android\Sdk\cmdline-tools\latest\bin')
foreach ($newPath in $newPaths) { if ($currentPath -notlike "*$newPath*") { $currentPath += ";$newPath" } }
[System.Environment]::SetEnvironmentVariable('Path', $currentPath, 'Machine')
Write-Host "✅ Variáveis configuradas!" -ForegroundColor Green
```

---

## 📦 PASSO 3: INSTALAR BUBBLEWRAP (2 min)

- [ ] Abri um NOVO terminal (importante!)
- [ ] Executei: `npm install -g @bubblewrap/cli`
- [ ] Aguardei instalação

---

## ✅ PASSO 4: VERIFICAR (5 min)

**IMPORTANTE**: Feche todos os terminais e abra um NOVO!

Execute cada comando:

```powershell
java -version
```
- [ ] ✅ Funcionou

```powershell
$env:ANDROID_HOME
```
- [ ] ✅ Mostrou: C:\Users\USER\AppData\Local\Android\Sdk

```powershell
adb --version
```
- [ ] ✅ Funcionou

```powershell
sdkmanager --list
```
- [ ] ✅ Funcionou (listou pacotes)

```powershell
npx @bubblewrap/cli --version
```
- [ ] ✅ Funcionou

---

## 🚀 PASSO 5: REINICIAR BACKEND (2 min)

- [ ] Parei o backend atual (Ctrl+C)
- [ ] Fechei o terminal
- [ ] Abri um NOVO terminal
- [ ] Executei:
  ```powershell
  cd c:\Users\USER\Desktop\webtoappify\backend
  npm run dev
  ```
- [ ] Vi mensagem: "🚀 Server running..."
- [ ] NÃO vi: "⚠️ Android SDK not found"

---

## 🎯 PASSO 6: TESTAR BUILD REAL (10 min)

- [ ] Acessei: http://localhost:5173
- [ ] Preenchi formulário de teste
- [ ] Cliquei em "Gerar App"
- [ ] Vi progresso do build
- [ ] Vi no backend: "🚀 Starting build..."
- [ ] Vi no backend: "✅ Tools check: Java ✓ Android SDK ✓"
- [ ] Build completou com sucesso
- [ ] Consegui baixar APK/AAB

---

## 🎉 SUCESSO!

Se marcou todos os itens: **PARABÉNS!** 🚀

Você agora tem:
- ✅ Android SDK completo
- ✅ Todas as ferramentas instaladas
- ✅ Builds REAIS funcionando
- ✅ Sistema otimizado para 8GB RAM

---

## 🆘 SE ALGO DEU ERRADO

### "adb não é reconhecido"
→ Reinicie o computador e tente novamente

### "sdkmanager não é reconhecido"
→ Verifique se instalou "Command-line Tools" no SDK Manager

### Build ainda em modo simulação
→ Reinicie o backend em um NOVO terminal

### Dúvidas?
→ Consulte `GUIA_ANDROID_SDK.md` para detalhes completos

---

## 📍 ONDE ESTOU?

Marque sua etapa atual:

- [ ] **Etapa 1**: Instalando SDK Platforms
- [ ] **Etapa 2**: Instalando SDK Tools
- [ ] **Etapa 3**: Configurando variáveis
- [ ] **Etapa 4**: Instalando Bubblewrap
- [ ] **Etapa 5**: Verificando instalação
- [ ] **Etapa 6**: Reiniciando backend
- [ ] **Etapa 7**: Testando build
- [ ] **✅ CONCLUÍDO**: Tudo funcionando!

---

**Próximo passo**: Abra o Android Studio e vá para o SDK Manager!
