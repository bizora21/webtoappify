# Guia de Teste - WebToAppify

## Pré-requisitos para Teste Local (Sem Docker)

⚠️ **IMPORTANTE**: Para builds reais, você precisa ter instalado:
- Java JDK 17+
- Android SDK (com build-tools e platform-tools)
- Bubblewrap CLI (`npm install -g @bubblewrap/cli`)

Se não tiver esses requisitos, use o Docker (recomendado).

## Opção 1: Teste com Docker (Recomendado)

### 1. Iniciar os serviços
```bash
cd c:\Users\USER\Desktop\webtoappify
docker-compose up --build
```

### 2. Acessar a aplicação
- Frontend: http://localhost:5173
- Backend: http://localhost:3000
- Health Check: http://localhost:3000/health

## Opção 2: Teste Local (Desenvolvimento)

### 1. Iniciar o Backend
```bash
cd c:\Users\USER\Desktop\webtoappify\backend
npm install
npm run dev
```

### 2. Iniciar o Frontend (em outro terminal)
```bash
cd c:\Users\USER\Desktop\webtoappify
npm install
npm run dev
```

### 3. Acessar
- Frontend: http://localhost:5173

## Fluxo de Teste

### Passo 1: Basic Info
1. **URL**: https://example.com (ou qualquer site que você queira converter)
2. **App Name**: Meu App Teste
3. **Package Name**: com.teste.meuapp
4. **Contact Email**: seu@email.com

### Passo 2: Branding
1. **Upload Icon**: Faça upload de uma imagem PNG/JPG (512x512px recomendado)
2. **Primary Color**: Escolha uma cor (ex: #4f46e5)
3. **Splash Screen**: Opcional

### Passo 3: Features
1. **Offline Mode**: Marque se quiser suporte offline
2. **Push Notifications**: Deixe desmarcado por enquanto
3. **Privacy Policy URL**: Opcional

### Passo 4: Build
1. O build iniciará automaticamente
2. Acompanhe o progresso e os logs
3. Quando concluído, faça download do APK ou AAB

## Verificação do Appwrite

### Verificar Database
1. Acesse: https://nyc.cloud.appwrite.io/console
2. Vá para o projeto: `6925ff2b001511b5e0ea`
3. Database: `202000`
4. Collection: `teste`
5. Verifique se os documentos estão sendo criados

### Verificar Storage
1. Bucket ID: `692720f30033aa28d1cb`
2. Verifique se os arquivos estão sendo enviados

## Estrutura de Campos da Collection "teste"

Certifique-se de que a collection tem estes atributos:

| Campo | Tipo | Tamanho | Obrigatório |
|-------|------|---------|-------------|
| status | String | 50 | Sim |
| config | String | 10000 | Não |
| progress | Integer | - | Não |
| logs | String[] | - | Não |
| aabUrl | String | 500 | Não |
| apkUrl | String | 500 | Não |
| error | String | 1000 | Não |
| createdAt | String | 100 | Não |
| completedAt | String | 100 | Não |

## Troubleshooting

### Erro: "Cannot find bubblewrap"
**Solução**: Instale globalmente
```bash
npm install -g @bubblewrap/cli
```

### Erro: "Java not found"
**Solução**: Instale Java JDK 17
- Windows: https://adoptium.net/
- Adicione ao PATH

### Erro: "Android SDK not found"
**Solução**: 
1. Baixe Android Studio ou Command Line Tools
2. Configure ANDROID_SDK_ROOT no PATH
3. Instale platform-tools e build-tools

### Erro: "CORS blocked"
**Solução**: Verifique se o backend está rodando na porta 3000 e o CORS_ORIGIN está correto no .env

### Erro: "Failed to upload to Appwrite"
**Solução**: 
1. Verifique as credenciais no .env
2. Verifique se o bucket existe e tem permissões corretas
3. Teste a conexão: `node backend/test-appwrite.js`

### Build demora muito
**Normal**: Builds podem levar 5-10 minutos na primeira vez (download de dependências do Gradle)

## Testando o APK Gerado

### Em Emulador
```bash
adb install caminho/para/app-release.apk
```

### Em Dispositivo Real
1. Ative "Fontes Desconhecidas" nas configurações
2. Transfira o APK para o dispositivo
3. Instale manualmente

## Logs Úteis

### Backend Logs
```bash
cd c:\Users\USER\Desktop\webtoappify\backend
npm run dev
# Observe os logs no console
```

### Verificar Build Directory
```bash
cd c:\Users\USER\Desktop\webtoappify\backend\builds
ls
# Cada build terá uma pasta com UUID
```

### Verificar Keystores
```bash
cd c:\Users\USER\Desktop\webtoappify\backend\keystores
ls
# Cada package terá um arquivo .jks
```

## Próximos Passos Após Teste Bem-Sucedido

1. ✅ Validar que o APK instala e funciona
2. ✅ Testar em diferentes URLs
3. ✅ Testar com diferentes ícones e cores
4. ✅ Configurar deploy em produção
5. ✅ Adicionar autenticação de usuários
6. ✅ Implementar fila de builds
