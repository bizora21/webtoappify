# 🔧 GUIA COMPLETO: Completar Android SDK

**Tempo estimado**: 30-40 minutos  
**Requisitos**: Android Studio já instalado ✅  
**RAM**: 8GB (perfeito para esta opção!)

---

## ✅ O QUE VOCÊ JÁ TEM

- ✅ Android Studio instalado
- ✅ Java JDK 17 instalado e funcionando
- ✅ Node.js e npm instalados
- ✅ Pasta do SDK criada: `C:\Users\USER\AppData\Local\Android\Sdk`

**Falta apenas**: Instalar os componentes do SDK!

---

## 📦 PASSO 1: ABRIR SDK MANAGER

### Opção A: Pelo Android Studio (Recomendado)

1. **Abra o Android Studio**
   - Procure no Menu Iniciar: "Android Studio"
   - OU clique no atalho da área de trabalho

2. **Tela Inicial**
   - Se abrir um projeto, feche-o: `File → Close Project`
   - Você deve ver a tela de boas-vindas

3. **Abrir SDK Manager**
   - Clique em: **"More Actions"** (ou ⚙️ no canto superior direito)
   - Selecione: **"SDK Manager"**

### Opção B: Direto pelo Menu (se já tiver projeto aberto)

1. No menu superior: **Tools → SDK Manager**

---

## 📥 PASSO 2: INSTALAR SDK PLATFORMS

Na janela do SDK Manager:

### 1. Aba "SDK Platforms"
- Clique na aba **"SDK Platforms"**

### 2. Marcar Opções
Marque as seguintes opções (use a checkbox à esquerda):

- ✅ **Android 14.0 ("UpsideDownCake")** - API Level 34
  - Ou a versão mais recente disponível

**DICA**: Se não aparecer, marque a opção:
- ☑️ **"Show Package Details"** (canto inferior direito)

Isso mostrará sub-componentes. Certifique-se de ter:
- ✅ Android SDK Platform 34
- ✅ Sources for Android 34 (opcional, mas útil)

### 3. Aplicar
- Clique em **"Apply"** no canto inferior direito
- Aguarde o download (~500 MB - 1 GB)

---

## 🛠️ PASSO 3: INSTALAR SDK TOOLS

### 1. Aba "SDK Tools"
- Clique na aba **"SDK Tools"**

### 2. Marcar TODAS estas opções:

- ✅ **Android SDK Build-Tools 34.0.0** (ou mais recente)
- ✅ **Android SDK Platform-Tools**
- ✅ **Android SDK Command-line Tools (latest)**
- ✅ **Android Emulator** (opcional, mas recomendado)
- ✅ **Android SDK Tools (Obsolete)** (se aparecer)

**IMPORTANTE**: Marque a opção:
- ☑️ **"Show Package Details"** (canto inferior direito)

Certifique-se de ter pelo menos:
- ✅ Build-Tools 34.0.0 ou superior
- ✅ Platform-Tools (última versão)
- ✅ Command-line Tools (latest)

### 3. Aplicar
- Clique em **"Apply"**
- Aceite as licenças (clique em "Accept" para cada uma)
- Clique em **"OK"**
- Aguarde o download (~2-3 GB total)

**TEMPO**: 10-20 minutos dependendo da internet

---

## 🌐 PASSO 4: CONFIGURAR VARIÁVEIS DE AMBIENTE

### Método 1: PowerShell (Mais Rápido)

Abra o PowerShell como **Administrador**:

```powershell
# Definir ANDROID_HOME
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\USER\AppData\Local\Android\Sdk', 'Machine')

# Definir ANDROID_SDK_ROOT (alguns programas usam este)
[System.Environment]::SetEnvironmentVariable('ANDROID_SDK_ROOT', 'C:\Users\USER\AppData\Local\Android\Sdk', 'Machine')

# Adicionar ao PATH
$currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')
$newPaths = @(
    'C:\Users\USER\AppData\Local\Android\Sdk\platform-tools',
    'C:\Users\USER\AppData\Local\Android\Sdk\cmdline-tools\latest\bin',
    'C:\Users\USER\AppData\Local\Android\Sdk\tools\bin'
)

foreach ($newPath in $newPaths) {
    if ($currentPath -notlike "*$newPath*") {
        $currentPath += ";$newPath"
    }
}

[System.Environment]::SetEnvironmentVariable('Path', $currentPath, 'Machine')

Write-Host "✅ Variáveis de ambiente configuradas!" -ForegroundColor Green
Write-Host "⚠️  IMPORTANTE: Feche e abra um NOVO terminal para as mudanças terem efeito!" -ForegroundColor Yellow
```

### Método 2: Interface Gráfica (Alternativa)

1. **Abrir Configurações do Sistema**
   - Pressione `Win + R`
   - Digite: `sysdm.cpl`
   - Pressione Enter

2. **Variáveis de Ambiente**
   - Clique na aba **"Avançado"**
   - Clique em **"Variáveis de Ambiente..."**

3. **Criar ANDROID_HOME**
   - Em "Variáveis do sistema", clique em **"Novo..."**
   - Nome da variável: `ANDROID_HOME`
   - Valor da variável: `C:\Users\USER\AppData\Local\Android\Sdk`
   - Clique em **"OK"**

4. **Criar ANDROID_SDK_ROOT**
   - Clique em **"Novo..."** novamente
   - Nome da variável: `ANDROID_SDK_ROOT`
   - Valor da variável: `C:\Users\USER\AppData\Local\Android\Sdk`
   - Clique em **"OK"**

5. **Editar PATH**
   - Em "Variáveis do sistema", encontre **"Path"**
   - Clique em **"Editar..."**
   - Clique em **"Novo"** e adicione cada linha:
     - `C:\Users\USER\AppData\Local\Android\Sdk\platform-tools`
     - `C:\Users\USER\AppData\Local\Android\Sdk\cmdline-tools\latest\bin`
     - `C:\Users\USER\AppData\Local\Android\Sdk\tools\bin`
   - Clique em **"OK"** em todas as janelas

---

## 🔧 PASSO 5: INSTALAR GRADLE

### Opção A: Via Chocolatey (Mais Fácil)

Se você tem Chocolatey instalado:

```powershell
# Abrir PowerShell como Administrador
choco install gradle
```

### Opção B: Download Manual

1. **Download**
   - Acesse: https://gradle.org/releases/
   - Baixe: **"Binary-only"** da versão mais recente (ex: gradle-8.5-bin.zip)

2. **Extrair**
   - Extraia para: `C:\Gradle`
   - Estrutura final: `C:\Gradle\gradle-8.5\bin\gradle.bat`

3. **Adicionar ao PATH**
   
   PowerShell como Admin:
   ```powershell
   $currentPath = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')
   $gradlePath = 'C:\Gradle\gradle-8.5\bin'
   
   if ($currentPath -notlike "*$gradlePath*") {
       $currentPath += ";$gradlePath"
       [System.Environment]::SetEnvironmentVariable('Path', $currentPath, 'Machine')
   }
   
   Write-Host "✅ Gradle adicionado ao PATH!" -ForegroundColor Green
   ```

### Opção C: Usar Gradle Wrapper (Mais Simples)

**Boa notícia**: Bubblewrap gera projetos com Gradle Wrapper incluído!
- Você NÃO precisa instalar Gradle globalmente
- O projeto usará `gradlew.bat` automaticamente

**Recomendação**: Pule a instalação do Gradle por enquanto. Se precisar, instale depois.

---

## 📦 PASSO 6: INSTALAR BUBBLEWRAP CLI

Abra um **NOVO** terminal (importante para carregar as variáveis de ambiente):

```powershell
# Instalar Bubblewrap globalmente
npm install -g @bubblewrap/cli

# Verificar instalação
npx @bubblewrap/cli --version
```

**Se der erro "bubblewrap não reconhecido"**: Use sempre `npx @bubblewrap/cli` ao invés de `bubblewrap`

---

## ✅ PASSO 7: VERIFICAR INSTALAÇÃO COMPLETA

**IMPORTANTE**: Feche TODOS os terminais e abra um NOVO PowerShell.

Execute cada comando:

```powershell
# 1. Verificar Java
java -version
# ✅ Deve mostrar: openjdk version "17.0.17"

# 2. Verificar Android SDK
$env:ANDROID_HOME
# ✅ Deve mostrar: C:\Users\USER\AppData\Local\Android\Sdk

# 3. Verificar ADB (Platform Tools)
adb --version
# ✅ Deve mostrar: Android Debug Bridge version X.X.X

# 4. Verificar SDK Manager
sdkmanager --list
# ✅ Deve listar pacotes instalados

# 5. Verificar Bubblewrap
npx @bubblewrap/cli --version
# ✅ Deve mostrar: @bubblewrap/cli: X.X.X

# 6. Verificar Gradle (opcional)
gradle --version
# ✅ Deve mostrar versão do Gradle
# OU use gradlew.bat nos projetos
```

### Checklist de Verificação:

- [ ] `java -version` funciona
- [ ] `$env:ANDROID_HOME` mostra o caminho correto
- [ ] `adb --version` funciona
- [ ] `sdkmanager --list` funciona
- [ ] `npx @bubblewrap/cli --version` funciona

**Se TODOS funcionarem**: 🎉 **INSTALAÇÃO COMPLETA!**

---

## 🚀 PASSO 8: TESTAR BUILD REAL

Agora vamos testar se tudo funciona!

### 1. Reiniciar Backend

No terminal do backend (ou abra um novo):

```powershell
# Parar o backend atual (Ctrl+C)

# Navegar para o backend
cd c:\Users\USER\Desktop\webtoappify\backend

# Iniciar novamente
npm run dev
```

**Aguarde ver**:
```
🚀 Server running on http://localhost:3000
📊 Environment: development
```

**IMPORTANTE**: Não deve mais aparecer "⚠️ Android SDK not found"

### 2. Verificar Logs

Se você ver:
```
✅ Java: FOUND
✅ Android SDK: FOUND
✅ Bubblewrap: FOUND
```

**PERFEITO!** Tudo pronto para builds reais!

### 3. Testar na Interface

1. Acesse: http://localhost:5173
2. Preencha o formulário:
   - **URL**: `https://example.com`
   - **App Name**: `Teste Real`
   - **Package Name**: `com.teste.real`
   - **Email**: `teste@email.com`
3. Clique em **"Gerar App"**

### 4. Acompanhar Build

No terminal do backend, você deve ver:

```
📥 Received build request
🚀 Starting build for Teste Real
✅ Tools check: Java ✓ Android SDK ✓ Bubblewrap ✓
📝 Updating status to 'building'...
📂 Creating project directory...
⚙️ Generating TWA project...
🔨 Building Android artifacts...
   - Building Bundle (AAB)...
   - Building APK...
☁️ Uploading artifacts...
🎉 Build finished successfully!
```

**Se ver estas mensagens**: 🎉 **BUILD REAL FUNCIONANDO!**

---

## 🆘 TROUBLESHOOTING

### "adb não é reconhecido"

**Causa**: Variáveis de ambiente não carregadas

**Solução**:
1. Feche TODOS os terminais
2. Reinicie o computador (recomendado)
3. Abra um NOVO terminal
4. Teste novamente

### "sdkmanager não é reconhecido"

**Causa**: Command-line Tools não instalado ou PATH incorreto

**Solução**:
1. Volte ao SDK Manager
2. Instale "Android SDK Command-line Tools (latest)"
3. Verifique se existe: `C:\Users\USER\AppData\Local\Android\Sdk\cmdline-tools\latest\bin`
4. Se a pasta for `cmdline-tools\[versão]\bin`, renomeie para `latest`

### "Gradle build failed"

**Causa**: Gradle não encontrado ou versão incompatível

**Solução**:
1. Use o Gradle Wrapper do projeto: `gradlew.bat` (recomendado)
2. OU instale Gradle globalmente (ver Passo 5)

### "ANDROID_HOME not set"

**Causa**: Variável de ambiente não configurada

**Solução**:
1. Execute o script do PowerShell do Passo 4 novamente
2. Reinicie o terminal
3. Verifique: `echo $env:ANDROID_HOME`

### Build fica em "QUEUED"

**Causa**: Backend não detectou as ferramentas

**Solução**:
1. Pare o backend (Ctrl+C)
2. Feche o terminal
3. Abra um NOVO terminal
4. Inicie o backend novamente: `npm run dev`
5. Verifique os logs de detecção de ferramentas

---

## 📊 ESPAÇO EM DISCO NECESSÁRIO

| Componente | Tamanho |
|------------|---------|
| Android SDK Platform 34 | ~500 MB |
| Build-Tools | ~100 MB |
| Platform-Tools | ~50 MB |
| Command-line Tools | ~150 MB |
| Emulator (opcional) | ~1 GB |
| Gradle (opcional) | ~150 MB |
| **TOTAL** | **~1-2 GB** |

**Muito mais leve que Docker!** (que precisa de 3-5 GB)

---

## 💡 DICAS PARA 8GB DE RAM

### Otimizar Android Studio:
1. `File → Settings → Appearance & Behavior → System Settings → Memory Settings`
2. Reduza "IDE max heap size" para 2048 MB
3. Reduza "Maximum heap size" para 1024 MB

### Durante Builds:
- Feche programas desnecessários
- Feche abas do navegador que não está usando
- Deixe apenas o terminal e o navegador abertos

### Monitorar Uso:
```powershell
# Ver uso de memória
Get-Process | Sort-Object -Property WS -Descending | Select-Object -First 10
```

---

## ✅ CHECKLIST FINAL

- [ ] SDK Manager aberto
- [ ] Android SDK Platform 34 instalado
- [ ] Build-Tools instalado
- [ ] Platform-Tools instalado
- [ ] Command-line Tools instalado
- [ ] Variáveis de ambiente configuradas (ANDROID_HOME, PATH)
- [ ] Bubblewrap instalado (`npm install -g @bubblewrap/cli`)
- [ ] Todos os comandos de verificação funcionando
- [ ] Backend reiniciado e detectando ferramentas
- [ ] Build real testado e funcionando

---

## 🎯 PRÓXIMOS PASSOS

Após completar tudo:

1. ✅ Testar build de diferentes sites
2. ✅ Personalizar ícones e splash screens
3. ✅ Testar APK em dispositivo Android real
4. ✅ Explorar configurações avançadas

---

## 📞 PRECISA DE AJUDA?

Se encontrar problemas:
1. Verifique a seção "Troubleshooting" acima
2. Certifique-se de ter reiniciado o terminal após configurar variáveis
3. Verifique os logs do backend para mensagens específicas
4. Teste cada comando de verificação individualmente

---

**Boa instalação!** 🚀

*Última atualização: 27/11/2025 21:47*
