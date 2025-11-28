# 🚀 GUIA RÁPIDO: Ativar Builds Reais

**Escolha UMA das opções abaixo:**

---

## ⚡ OPÇÃO 1: Docker (MAIS RÁPIDO - 15 min)

### Passo 1: Instalar Docker Desktop
1. Baixe: https://www.docker.com/products/docker-desktop/
2. Execute o instalador
3. Reinicie o computador quando solicitado

### Passo 2: Iniciar o Projeto
```bash
# No diretório do projeto
cd c:\Users\USER\Desktop\webtoappify

# Iniciar com Docker
docker-compose up --build
```

### Passo 3: Acessar
- Frontend: http://localhost:5173
- Backend: http://localhost:3000

**PRONTO!** Builds reais funcionando! 🎉

---

## 🔧 OPÇÃO 2: Android SDK Manual (30-60 min)

### Passo 1: Completar Android SDK

1. **Abra o Android Studio**

2. **Vá em**: `Tools → SDK Manager`

3. **Aba "SDK Platforms"** - Instale:
   - ✅ Android 14.0 (API 34)

4. **Aba "SDK Tools"** - Instale:
   - ✅ Android SDK Build-Tools 34.0.0
   - ✅ Android SDK Platform-Tools
   - ✅ Android SDK Command-line Tools

5. **Clique em "Apply"** e aguarde

### Passo 2: Configurar Variáveis de Ambiente

**Opção A: Via Interface Gráfica**
1. Pressione `Win + R`, digite `sysdm.cpl`, Enter
2. Aba "Avançado" → "Variáveis de Ambiente"
3. Em "Variáveis do Sistema", clique "Novo":
   - Nome: `ANDROID_HOME`
   - Valor: `C:\Users\USER\AppData\Local\Android\Sdk`
4. Edite a variável `Path`, adicione:
   - `C:\Users\USER\AppData\Local\Android\Sdk\platform-tools`
   - `C:\Users\USER\AppData\Local\Android\Sdk\cmdline-tools\latest\bin`
5. Clique "OK" em tudo

**Opção B: Via PowerShell (Admin)**
```powershell
# Definir ANDROID_HOME
[System.Environment]::SetEnvironmentVariable('ANDROID_HOME', 'C:\Users\USER\AppData\Local\Android\Sdk', 'Machine')

# Adicionar ao PATH
$path = [System.Environment]::GetEnvironmentVariable('Path', 'Machine')
$newPath = $path + ';C:\Users\USER\AppData\Local\Android\Sdk\platform-tools;C:\Users\USER\AppData\Local\Android\Sdk\cmdline-tools\latest\bin'
[System.Environment]::SetEnvironmentVariable('Path', $newPath, 'Machine')
```

### Passo 3: Instalar Bubblewrap
```bash
npm install -g @bubblewrap/cli
```

### Passo 4: Verificar Instalação
**IMPORTANTE**: Feche e abra um NOVO terminal antes de testar!

```bash
# Verificar ferramentas
java -version        # Deve mostrar: 17.0.17
adb --version        # Deve mostrar versão do ADB
bubblewrap --version # Deve mostrar versão do Bubblewrap

# Se algum comando falhar, reinicie o computador
```

### Passo 5: Reiniciar Servidores
```bash
# Parar os servidores atuais (Ctrl+C em cada terminal)

# Iniciar backend
cd c:\Users\USER\Desktop\webtoappify\backend
npm run dev

# Em outro terminal, iniciar frontend
cd c:\Users\USER\Desktop\webtoappify
npm run dev
```

**PRONTO!** Builds reais funcionando! 🎉

---

## ✅ VERIFICAÇÃO FINAL

Após escolher uma opção, teste com:

```bash
# Acessar a aplicação
http://localhost:5173

# Preencher formulário com:
- URL: https://example.com
- App Name: Test App
- Package Name: com.test.app
- Email: test@example.com

# Clicar em "Gerar App"

# Verificar logs do backend
# Deve mostrar:
# ✅ "Starting real build..." (não "SIMULATION")
```

---

## 🆘 TROUBLESHOOTING

### "adb não é reconhecido"
→ Reinicie o terminal ou computador após configurar variáveis de ambiente

### "bubblewrap não é reconhecido"
→ Use: `npx @bubblewrap/cli --version` ao invés de `bubblewrap --version`

### Docker não inicia
→ Verifique se a virtualização está habilitada na BIOS

### Build ainda em modo simulação
→ Verifique se TODAS as ferramentas foram instaladas:
```bash
java -version
adb --version
bubblewrap --version
```

---

## 📞 SUPORTE

Se encontrar problemas:
1. Verifique `ANALISE_COMPLETA.md` para detalhes técnicos
2. Consulte `INSTALLATION_GUIDE.md` para instruções detalhadas
3. Verifique logs do backend para mensagens de erro específicas

---

**Boa sorte!** 🚀
