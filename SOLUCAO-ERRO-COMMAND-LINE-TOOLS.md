# SOLUÇÃO: Erro "Not in GZIP format" - Command-line Tools

## 🔴 ERRO ENCONTRADO
```
An error occurred while preparing SDK package Android SDK Command-line Tools (latest): 
Not in GZIP format.
```

Este erro ocorre quando o arquivo baixado está corrompido ou incompleto.

---

## ✅ SOLUÇÕES (Tente na ordem)

### SOLUÇÃO 1: Limpar Cache do SDK Manager (RECOMENDADO)

1. **Feche o Android Studio completamente**

2. **Delete o cache do SDK Manager:**
   ```powershell
   # Execute este comando no PowerShell
   Remove-Item -Path "$env:USERPROFILE\.android\cache" -Recurse -Force -ErrorAction SilentlyContinue
   Remove-Item -Path "$env:LOCALAPPDATA\Android\Sdk\temp" -Recurse -Force -ErrorAction SilentlyContinue
   ```

3. **Reabra o Android Studio**

4. **Tente instalar novamente:**
   - More Actions → SDK Manager
   - SDK Tools → Android SDK Command-line Tools (latest)
   - Apply

---

### SOLUÇÃO 2: Instalar Versão Específica (ao invés de "latest")

Se a SOLUÇÃO 1 não funcionar:

1. **No SDK Manager:**
   - Vá em SDK Tools
   - ☑ Marque "Show Package Details"
   - Expanda "Android SDK Command-line Tools"
   - **NÃO marque "latest"**
   - ☑ Marque uma versão específica (ex: 13.0, 12.0, 11.0)
   - Apply

2. **Versões recomendadas (tente nesta ordem):**
   - 13.0
   - 12.0
   - 11.0

---

### SOLUÇÃO 3: Download Manual

Se as soluções anteriores falharem, faça download manual:

1. **Baixe o arquivo manualmente:**
   - Acesse: https://developer.android.com/studio#command-line-tools-only
   - Baixe "Command line tools only" para Windows
   - Salve em: `C:\Users\USER\Downloads\commandlinetools-win.zip`

2. **Extraia manualmente:**
   ```powershell
   # Criar diretório
   New-Item -Path "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest" -ItemType Directory -Force
   
   # Extrair (ajuste o caminho do arquivo baixado)
   Expand-Archive -Path "C:\Users\USER\Downloads\commandlinetools-win-*.zip" -DestinationPath "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\temp" -Force
   
   # Mover conteúdo para o local correto
   Move-Item -Path "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\temp\cmdline-tools\*" -Destination "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest" -Force
   
   # Limpar pasta temporária
   Remove-Item -Path "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\temp" -Recurse -Force
   ```

3. **Verificar instalação:**
   ```powershell
   & "$env:LOCALAPPDATA\Android\Sdk\cmdline-tools\latest\bin\sdkmanager.bat" --version
   ```

---

### SOLUÇÃO 4: Verificar Conexão/Proxy

Se você está atrás de um proxy ou firewall:

1. **Configurar proxy no Android Studio:**
   - File → Settings → Appearance & Behavior → System Settings → HTTP Proxy
   - Configure se necessário

2. **Ou desabilite temporariamente:**
   - Antivírus
   - Firewall
   - VPN

3. **Tente novamente**

---

### SOLUÇÃO 5: Reinstalar Android Studio (Último Recurso)

Se nada funcionar:

1. Desinstale o Android Studio
2. Delete a pasta: `C:\Users\USER\AppData\Local\Android`
3. Reinstale o Android Studio
4. Configure o SDK novamente

---

## 🔧 SCRIPT AUTOMÁTICO - SOLUÇÃO 1

Criei um script para limpar o cache automaticamente:

```powershell
# Execute este arquivo: limpar-cache-sdk.ps1
```

---

## ✅ ALTERNATIVA: Pular Command-line Tools por enquanto

**IMPORTANTE:** O Command-line Tools não é estritamente necessário para o Bubblewrap funcionar!

Você pode:
1. ✅ Instalar apenas Build Tools 34.0.0
2. ✅ Instalar apenas Android 14 (API 34)
3. ✅ Configurar as variáveis de ambiente
4. ✅ Testar o build

O Bubblewrap usa principalmente:
- ✓ Build Tools (você já tem 36.1.0, só precisa adicionar 34.0.0)
- ✓ Platform SDK (você já tem API 36, só precisa adicionar API 34)
- ✓ Java (✓ já instalado)
- ✓ Gradle (incluído no Bubblewrap)

O Command-line Tools é útil para gerenciar o SDK via linha de comando, mas **não é obrigatório** para builds.

---

## 🎯 RECOMENDAÇÃO

**Tente nesta ordem:**

1. ✅ Execute o script `limpar-cache-sdk.ps1` (vou criar agora)
2. ✅ Tente instalar novamente via SDK Manager
3. ✅ Se falhar, **pule o Command-line Tools** por enquanto
4. ✅ Instale apenas Build Tools 34.0.0 e API 34
5. ✅ Configure as variáveis de ambiente
6. ✅ Teste um build real

Se o build funcionar sem o Command-line Tools, ótimo! Você pode tentar instalá-lo depois com calma.

---

## 📝 VERIFICAR APÓS SOLUÇÃO

Execute para verificar:
```powershell
powershell -ExecutionPolicy Bypass -File .\check-components.ps1
```
