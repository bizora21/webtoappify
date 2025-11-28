# Guia de Instalação de Ferramentas - WebToAppify

## ⚠️ IMPORTANTE: Escolha uma das opções abaixo

### Opção 1: Docker (RECOMENDADO - Mais Fácil) ✅

Se você tem Docker instalado, **não precisa instalar nada manualmente**. O Docker já vem com tudo configurado.

```bash
# Verifique se tem Docker
docker --version

# Se não tiver, baixe em: https://www.docker.com/products/docker-desktop/

# Depois, simplesmente rode:
docker-compose up --build
```

**Vantagens do Docker:**
- ✅ Não precisa instalar Java, Android SDK, Bubblewrap
- ✅ Ambiente isolado e consistente
- ✅ Funciona em qualquer sistema operacional
- ✅ Fácil de atualizar e manter

---

### Opção 2: Instalação Manual (Windows)

Se preferir rodar localmente sem Docker, siga os passos abaixo:

## 1️⃣ Instalar Java JDK 17+

### Download
1. Acesse: https://adoptium.net/temurin/releases/
2. Selecione:
   - **Version**: 17 (LTS)
   - **Operating System**: Windows
   - **Architecture**: x64
3. Baixe o instalador `.msi`

### Instalação
1. Execute o instalador
2. **IMPORTANTE**: Marque a opção "Add to PATH"
3. Clique em "Next" até finalizar

### Verificação
```bash
java -version
# Deve mostrar: openjdk version "17.x.x"
```

### Solução de Problemas
Se o comando `java` não for reconhecido:
1. Abra "Variáveis de Ambiente" do Windows
2. Em "Variáveis do Sistema", encontre `Path`
3. Adicione: `C:\Program Files\Eclipse Adoptium\jdk-17.x.x-hotspot\bin`
4. Reinicie o terminal

---

## 2️⃣ Instalar Android SDK

### Opção A: Android Studio (Mais Fácil)
1. Baixe: https://developer.android.com/studio
2. Instale normalmente
3. Abra o Android Studio
4. Vá em: **Tools → SDK Manager**
5. Instale:
   - ✅ Android SDK Platform 34
   - ✅ Android SDK Build-Tools 34.0.0
   - ✅ Android SDK Platform-Tools
   - ✅ Android SDK Command-line Tools

### Opção B: Command Line Tools (Mais Leve)
1. Baixe: https://developer.android.com/studio#command-line-tools-only
2. Extraia para: `C:\Android\cmdline-tools`
3. Renomeie a pasta extraída para `latest`
4. Estrutura final: `C:\Android\cmdline-tools\latest\bin`

### Configurar Variáveis de Ambiente
1. Abra "Variáveis de Ambiente" do Windows
2. Crie nova variável do sistema:
   - **Nome**: `ANDROID_SDK_ROOT`
   - **Valor**: `C:\Users\SEU_USUARIO\AppData\Local\Android\Sdk` (se usou Android Studio)
   - **OU**: `C:\Android` (se usou Command Line Tools)

3. Adicione ao `Path`:
   - `%ANDROID_SDK_ROOT%\platform-tools`
   - `%ANDROID_SDK_ROOT%\cmdline-tools\latest\bin`

### Instalar Componentes (se usou Command Line Tools)
```bash
# Aceitar licenças
sdkmanager --licenses

# Instalar componentes
sdkmanager "platform-tools" "platforms;android-34" "build-tools;34.0.0"
```

### Verificação
```bash
adb --version
# Deve mostrar a versão do ADB

sdkmanager --list
# Deve listar os pacotes instalados
```

---

## 3️⃣ Instalar Bubblewrap CLI

### Instalação
```bash
npm install -g @bubblewrap/cli
```

### Verificação
```bash
bubblewrap --version
# Deve mostrar a versão do Bubblewrap
```

### Solução de Problemas
Se o comando `bubblewrap` não for reconhecido:
1. Verifique o caminho global do npm:
   ```bash
   npm config get prefix
   ```
2. Adicione ao PATH: `C:\Users\SEU_USUARIO\AppData\Roaming\npm`

---

## 4️⃣ Verificação Final

Execute este script para verificar se tudo está instalado:

```bash
# Verificar Node.js
node --version

# Verificar Java
java -version

# Verificar Android SDK
adb --version

# Verificar Bubblewrap
bubblewrap --version

# Verificar keytool (vem com Java)
keytool -help
```

**Se todos os comandos funcionarem, você está pronto!** ✅

---

## 🐛 Troubleshooting Comum

### "java não é reconhecido"
- Reinstale o Java e marque "Add to PATH"
- OU adicione manualmente ao PATH

### "adb não é reconhecido"
- Configure ANDROID_SDK_ROOT
- Adicione platform-tools ao PATH

### "bubblewrap não é reconhecido"
- Adicione pasta global do npm ao PATH
- OU use: `npx @bubblewrap/cli` ao invés de `bubblewrap`

### "sdkmanager não é reconhecido"
- Verifique se cmdline-tools está em `cmdline-tools\latest\bin`
- Adicione ao PATH

---

## 📦 Instalação Rápida via Chocolatey (Alternativa)

Se você tem o Chocolatey instalado:

```bash
# Instalar Java
choco install openjdk17

# Instalar Android SDK (via Android Studio)
choco install androidstudio

# Instalar Bubblewrap
npm install -g @bubblewrap/cli
```

---

## 🎯 Próximos Passos

Após instalar tudo:

1. **Reinicie o terminal** (importante!)
2. Execute os comandos de verificação acima
3. Inicie o backend: `cd backend && npm run dev`
4. Inicie o frontend: `npm run dev`
5. Acesse: http://localhost:5173
6. Teste um build!

---

## 💡 Recomendação Final

**Use Docker se possível!** É muito mais simples e evita todos esses problemas de configuração.

```bash
docker-compose up --build
```

Pronto! Sem dor de cabeça. 🚀
