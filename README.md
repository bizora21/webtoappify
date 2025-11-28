# WebToAppify 🚀

Converta qualquer site em um aplicativo Android (TWA - Trusted Web Activity) pronto para publicação na Google Play Store.

## 📋 Visão Geral

WebToAppify é uma plataforma completa que permite transformar qualquer URL em um aplicativo Android nativo, com suporte a:
- ✅ Geração automática de APK e AAB
- ✅ Assinatura automática com keystores
- ✅ Customização de ícones, cores e splash screen
- ✅ Suporte a modo offline e notificações push
- ✅ Interface visual intuitiva com preview em tempo real

## 🏗️ Arquitetura

### Frontend
- **Framework**: React + Vite + TypeScript
- **Estilização**: Tailwind CSS
- **Componentes**: Wizard de 4 etapas com preview em tempo real

### Backend
- **Runtime**: Node.js + Express + TypeScript
- **Build Engine**: Bubblewrap CLI + Gradle
- **Storage**: Appwrite (Database + File Storage)
- **Assinatura**: Keystore automático com keytool

### Infraestrutura
- **Containerização**: Docker + Docker Compose
- **SDK**: Android SDK 34 + Build Tools
- **Java**: OpenJDK 17

## 🚀 Início Rápido

### Opção 1: Docker (Recomendado)

```bash
# Clone o repositório
git clone <repo-url>
cd webtoappify

# Inicie os serviços
docker-compose up --build

# Acesse
# Frontend: http://localhost:5173
# Backend: http://localhost:3000
```

### Opção 2: Desenvolvimento Local

**Pré-requisitos:**
- Node.js 20+
- Java JDK 17+
- Android SDK (com build-tools e platform-tools)
- Bubblewrap CLI: `npm install -g @bubblewrap/cli`

**Backend:**
```bash
cd backend
npm install
npm run dev
```

**Frontend:**
```bash
npm install
npm run dev
```

### Opção 3: Scripts Windows

```bash
# Terminal 1: Backend
start-backend.bat

# Terminal 2: Frontend
start-frontend.bat
```

## 📁 Estrutura do Projeto

```
webtoappify/
├── backend/                 # Servidor Node.js
│   ├── src/
│   │   ├── services/       # Lógica de negócio
│   │   │   ├── buildService.ts      # Orquestração do build
│   │   │   ├── storageService.ts    # Upload para Appwrite
│   │   │   └── keystoreService.ts   # Geração de keystores
│   │   ├── routes/         # Endpoints da API
│   │   ├── appwrite/       # Cliente Appwrite
│   │   └── server.ts       # Servidor Express
│   ├── Dockerfile          # Imagem Docker com Android SDK
│   └── .env                # Configurações (não versionado)
│
├── components/             # Componentes React
│   ├── StepBasicInfo.tsx
│   ├── StepBranding.tsx
│   ├── StepFeatures.tsx
│   ├── StepBuild.tsx
│   └── PreviewPhone.tsx
│
├── App.tsx                 # Componente principal
├── types.ts                # Tipos TypeScript
├── docker-compose.yml      # Orquestração Docker
└── README.md               # Este arquivo
```

## 🔧 Configuração

### Variáveis de Ambiente (Backend)

Crie um arquivo `.env` em `backend/`:

```bash
# Appwrite Configuration
APPWRITE_ENDPOINT=https://nyc.cloud.appwrite.io/v1
APPWRITE_PROJECT_ID=seu_project_id
APPWRITE_API_KEY=sua_api_key
APPWRITE_DATABASE_ID=seu_database_id
APPWRITE_COLLECTION_ID=sua_collection_id
APPWRITE_BUCKET_ID=seu_bucket_id

# Server Configuration
PORT=3000
CORS_ORIGIN=http://localhost:5173

# Keystore Configuration
KEYSTORE_PASSWORD=sua_senha_segura
```

### Configuração do Appwrite

1. Crie um projeto no Appwrite
2. Crie um banco de dados
3. Crie uma collection com os seguintes atributos:
   - `status` (String, 50)
   - `config` (String, 10000)
   - `progress` (Integer)
   - `logs` (String Array)
   - `aabUrl` (String, 500)
   - `apkUrl` (String, 500)
   - `error` (String, 1000)
   - `createdAt` (String, 100)
   - `completedAt` (String, 100)
4. Crie um bucket de storage com permissões de leitura pública

## 📖 Como Usar

1. **Basic Info**: Insira a URL do site, nome do app, package name e email
2. **Branding**: Faça upload do ícone, escolha cores e splash screen
3. **Features**: Configure modo offline, notificações push, etc.
4. **Build**: Acompanhe o progresso e baixe o APK/AAB quando pronto

## 🔍 API Endpoints

### POST `/api/build`
Inicia um novo build.

**Request:**
- Content-Type: `multipart/form-data`
- Body:
  - `config` (JSON string): Configurações do app
  - `icon` (File): Ícone do app
  - `splash` (File): Splash screen (opcional)

**Response:**
```json
{
  "id": "uuid-do-build",
  "status": "queued"
}
```

### GET `/api/build/:id`
Retorna o status de um build.

**Response:**
```json
{
  "status": "success",
  "progress": 100,
  "logs": ["Build started...", "Generating TWA...", "Build complete!"],
  "aabUrl": "https://...",
  "apkUrl": "https://..."
}
```

## 🐛 Troubleshooting

Consulte o arquivo [TESTING_GUIDE.md](./TESTING_GUIDE.md) para instruções detalhadas de teste e resolução de problemas.

## 📊 Status da Implementação

Consulte [IMPLEMENTATION_STATUS.md](./IMPLEMENTATION_STATUS.md) para ver o que está implementado e o que está pendente.

## 🛠️ Tecnologias Utilizadas

- **Frontend**: React, TypeScript, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, TypeScript, Multer
- **Build**: Bubblewrap CLI, Gradle, Android SDK
- **Storage**: Appwrite (Database + Storage)
- **Containerização**: Docker, Docker Compose
- **Assinatura**: keytool (Java)

## 📝 Licença

Este projeto é fornecido como está, para fins de demonstração.

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou pull requests.

## 📧 Suporte

Para questões e suporte, abra uma issue no repositório.

---

**Desenvolvido com ❤️ para facilitar a criação de apps Android a partir de sites**
