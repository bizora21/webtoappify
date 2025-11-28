# 🐳 GUIA COMPLETO: Instalação do Docker Desktop

**Tempo estimado**: 15-20 minutos  
**Requisitos**: Windows 10/11 (64-bit)

---

## 📥 PASSO 1: DOWNLOAD

### Opção A: Pelo Navegador (Já Aberto)
A página do Docker já está aberta no seu navegador!

1. **Clique no botão azul**: "Download for Windows - AMD64"
2. O arquivo `Docker Desktop Installer.exe` será baixado (~500 MB)
3. Aguarde o download completar

### Opção B: Link Direto
Se preferir, use este link direto:
```
https://desktop.docker.com/win/main/amd64/Docker%20Desktop%20Installer.exe
```

---

## 💾 PASSO 2: INSTALAÇÃO

### 1. Executar o Instalador
- Localize o arquivo baixado: `Docker Desktop Installer.exe`
- **Clique com botão direito** → "Executar como administrador"
- Clique "Sim" na janela de controle de conta de usuário

### 2. Configuração da Instalação
Na tela de configuração, **MARQUE AMBAS AS OPÇÕES**:
- ✅ **Use WSL 2 instead of Hyper-V** (Recomendado)
- ✅ **Add shortcut to desktop**

### 3. Aguardar Instalação
- O instalador vai:
  - Extrair arquivos (~5 minutos)
  - Instalar componentes do Docker
  - Configurar WSL 2 (se necessário)
- **NÃO FECHE** a janela durante a instalação

### 4. Finalizar
- Quando aparecer "Installation succeeded"
- Clique em **"Close and restart"**
- **IMPORTANTE**: O computador VAI REINICIAR automaticamente

---

## 🔄 PASSO 3: APÓS REINICIAR

### 1. Primeiro Acesso ao Docker Desktop
Após o computador reiniciar:
- O Docker Desktop deve abrir automaticamente
- Se não abrir, procure o ícone do Docker na área de trabalho ou menu Iniciar

### 2. Aceitar Termos de Serviço
- Leia (ou não 😅) os termos
- Marque: ✅ "I accept the terms"
- Clique em **"Accept"**

### 3. Configuração Inicial (Opcional)
- Você pode pular o tutorial clicando em "Skip tutorial"
- OU seguir o tutorial rápido (5 minutos)

### 4. Aguardar Docker Iniciar
- No canto inferior esquerdo, aguarde aparecer:
  - 🟢 **"Docker Desktop is running"**
- Isso pode levar 1-2 minutos na primeira vez

---

## ✅ PASSO 4: VERIFICAR INSTALAÇÃO

### Abrir PowerShell ou Terminal
Pressione `Win + X` → "Terminal" ou "PowerShell"

### Executar Comandos de Verificação
```powershell
# Verificar versão do Docker
docker --version
# Deve mostrar: Docker version 24.x.x ou superior

# Verificar se está rodando
docker ps
# Deve mostrar uma tabela vazia (sem erros)

# Teste rápido (opcional)
docker run hello-world
# Deve baixar e executar um container de teste
```

**Se todos os comandos funcionarem**: ✅ Docker instalado com sucesso!

---

## 🚀 PASSO 5: INICIAR O WEBTOAPPIFY COM DOCKER

Agora que o Docker está instalado, vamos rodar o projeto!

### 1. Abrir Terminal no Projeto
```powershell
# Navegar para o diretório do projeto
cd c:\Users\USER\Desktop\webtoappify
```

### 2. Parar Servidores Locais (se estiverem rodando)
Nos terminais onde `npm run dev` está rodando:
- Pressione `Ctrl + C` para parar cada servidor
- Confirme com `Y` se solicitado

### 3. Iniciar com Docker
```powershell
# Iniciar todos os serviços com Docker
docker-compose up --build
```

**O que vai acontecer:**
- 📦 Docker vai baixar imagens necessárias (~2-5 GB na primeira vez)
- 🔨 Vai compilar o projeto
- 🚀 Vai iniciar 3 containers:
  - `webtoappify-db` (PostgreSQL)
  - `webtoappify-backend` (API)
  - `webtoappify-frontend` (Interface)

**Tempo estimado na primeira vez**: 10-15 minutos (downloads)  
**Próximas vezes**: 30 segundos - 1 minuto

### 4. Aguardar Mensagens de Sucesso
Aguarde até ver estas mensagens no terminal:
```
webtoappify-backend   | 🚀 Server running on http://localhost:3000
webtoappify-frontend  | ➜  Local:   http://localhost:5173/
webtoappify-db        | database system is ready to accept connections
```

### 5. Acessar a Aplicação
Abra o navegador em:
- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3000/health

---

## 🎯 PASSO 6: TESTAR BUILD REAL

Agora você pode testar um build REAL de Android!

### 1. Acessar a Interface
- Vá para: http://localhost:5173

### 2. Preencher o Formulário
- **URL**: `https://example.com`
- **App Name**: `Meu Primeiro App`
- **Package Name**: `com.meuapp.teste`
- **Email**: `seu@email.com`
- **Cor Primária**: Escolha uma cor

### 3. Gerar App
- Clique em **"Gerar App"**
- Aguarde o progresso (pode levar 5-10 minutos no primeiro build)

### 4. Verificar Logs
No terminal onde o Docker está rodando, você verá:
```
✅ Starting real build...
📂 Creating project directory...
⚙️ Generating TWA project...
🔨 Building Android artifacts...
☁️ Uploading artifacts...
🎉 Build finished successfully!
```

**Se ver estas mensagens**: 🎉 **BUILD REAL FUNCIONANDO!**

---

## 🛑 COMANDOS ÚTEIS DO DOCKER

### Parar os Containers
```powershell
# Parar (mantém dados)
docker-compose stop

# Parar e remover containers (limpa tudo)
docker-compose down
```

### Iniciar Novamente
```powershell
# Iniciar containers existentes
docker-compose up

# Reconstruir e iniciar (após mudanças no código)
docker-compose up --build
```

### Ver Logs
```powershell
# Ver logs de todos os serviços
docker-compose logs

# Ver logs apenas do backend
docker-compose logs backend

# Seguir logs em tempo real
docker-compose logs -f
```

### Ver Status
```powershell
# Ver containers rodando
docker ps

# Ver uso de recursos
docker stats
```

---

## 🆘 TROUBLESHOOTING

### "WSL 2 installation is incomplete"
**Solução**:
1. Abra PowerShell como Administrador
2. Execute:
   ```powershell
   wsl --install
   wsl --set-default-version 2
   ```
3. Reinicie o computador
4. Tente novamente

### "Docker Desktop requires a newer WSL kernel version"
**Solução**:
1. Baixe: https://aka.ms/wsl2kernel
2. Instale o update
3. Reinicie o Docker Desktop

### "Hardware assisted virtualization is not enabled"
**Solução**:
1. Reinicie o computador
2. Entre na BIOS (geralmente F2, F10, ou Del durante boot)
3. Procure por "Virtualization Technology" ou "VT-x" ou "AMD-V"
4. Habilite a opção
5. Salve e reinicie

### "Port 5173 is already in use"
**Solução**:
1. Pare os servidores locais (`npm run dev`)
2. OU mude a porta no `docker-compose.yml`

### Docker está lento
**Solução**:
1. Abra Docker Desktop
2. Settings → Resources
3. Aumente CPU e Memory
4. Clique "Apply & Restart"

---

## 📊 COMPARAÇÃO: Antes vs Depois do Docker

| Aspecto | Sem Docker | Com Docker |
|---------|------------|------------|
| **Instalação de Ferramentas** | Manual (Java, Android SDK, Gradle, Bubblewrap) | Automática (tudo incluído) |
| **Tempo de Setup** | 30-60 minutos | 15-20 minutos |
| **Configuração** | Variáveis de ambiente, PATH, etc. | Zero configuração |
| **Builds** | Modo simulação | Builds reais de APK/AAB |
| **Manutenção** | Atualizar cada ferramenta | `docker-compose pull` |
| **Portabilidade** | Só funciona no seu PC | Funciona em qualquer lugar |

---

## ✅ CHECKLIST DE INSTALAÇÃO

Use este checklist para acompanhar o progresso:

- [ ] **Passo 1**: Download do Docker Desktop
- [ ] **Passo 2**: Instalação do Docker
- [ ] **Passo 3**: Reiniciar computador
- [ ] **Passo 4**: Aceitar termos e aguardar Docker iniciar
- [ ] **Passo 5**: Verificar instalação (`docker --version`)
- [ ] **Passo 6**: Parar servidores locais
- [ ] **Passo 7**: Executar `docker-compose up --build`
- [ ] **Passo 8**: Aguardar downloads e build
- [ ] **Passo 9**: Acessar http://localhost:5173
- [ ] **Passo 10**: Testar build real de app

---

## 🎉 PRÓXIMOS PASSOS

Após a instalação bem-sucedida:

1. ✅ Testar build de um app real
2. ✅ Verificar se APK/AAB são gerados
3. ✅ Fazer download e testar instalação em Android
4. ✅ Explorar outras funcionalidades (ícones, splash screens, etc.)

---

## 📞 PRECISA DE AJUDA?

Se encontrar qualquer problema:
1. Verifique a seção "Troubleshooting" acima
2. Consulte os logs do Docker: `docker-compose logs`
3. Verifique se o Docker Desktop está rodando (ícone na bandeja do sistema)

---

**Boa instalação!** 🚀

*Última atualização: 27/11/2025 21:41*
