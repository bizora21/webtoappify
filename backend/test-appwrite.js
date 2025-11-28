import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const result = dotenv.config({ path: join(__dirname, '.env') });

console.log('📁 Arquivo .env carregado:', result.parsed ? 'SIM' : 'NÃO');
console.log('🔑 Variáveis de ambiente:');
console.log('  APPWRITE_ENDPOINT:', process.env.APPWRITE_ENDPOINT);
console.log('  APPWRITE_PROJECT_ID:', process.env.APPWRITE_PROJECT_ID);
console.log('  APPWRITE_DATABASE_ID:', process.env.APPWRITE_DATABASE_ID);
console.log('  APPWRITE_COLLECTION_ID:', process.env.APPWRITE_COLLECTION_ID);

if (!process.env.APPWRITE_ENDPOINT) {
    console.error('\n❌ APPWRITE_ENDPOINT não está definido!');
    process.exit(1);
}

const { databases } = await import('./src/appwrite/client.js');

async function testConnection() {
    try {
        console.log('\n🔍 Testando conexão com Appwrite...');

        // Enviar APENAS os campos que o WebToAppify precisa
        const testDoc = await databases.createDocument(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_COLLECTION_ID,
            'test-' + Date.now(),
            {
                status: 'queued',
                config: JSON.stringify({
                    appName: 'Test App',
                    packageName: 'com.test.app',
                    url: 'https://example.com'
                }),
                progress: 0,
                logs: ['Iniciando teste de conexão...'],
                createdAt: new Date().toISOString()
            }
        );

        console.log('\n✅ SUCESSO! Documento criado!');
        console.log('📄 ID do documento:', testDoc.$id);
        console.log('📊 Status:', testDoc.status);
        console.log('📈 Progress:', testDoc.progress);

        // Tentar ler o documento
        console.log('\n🔍 Testando leitura do documento...');
        const readDoc = await databases.getDocument(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_COLLECTION_ID,
            testDoc.$id
        );

        console.log('✅ Leitura bem-sucedida!');
        console.log('📖 Dados recuperados:', {
            id: readDoc.$id,
            status: readDoc.status,
            progress: readDoc.progress
        });

        // Tentar atualizar o documento
        console.log('\n� Testando atualização do documento...');
        const updatedDoc = await databases.updateDocument(
            process.env.APPWRITE_DATABASE_ID,
            process.env.APPWRITE_COLLECTION_ID,
            testDoc.$id,
            {
                status: 'building',
                progress: 50,
                logs: ['Iniciando teste...', 'Build em progresso...']
            }
        );

        console.log('✅ Atualização bem-sucedida!');
        console.log('� Novo status:', updatedDoc.status);
        console.log('📈 Novo progress:', updatedDoc.progress);

        console.log('\n🎉 TUDO FUNCIONANDO PERFEITAMENTE!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Conexão com Appwrite: OK');
        console.log('✅ Criação de documentos: OK');
        console.log('✅ Leitura de documentos: OK');
        console.log('✅ Atualização de documentos: OK');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('\n🚀 O backend está pronto para funcionar!');

    } catch (error) {
        console.error('\n❌ Erro:', error.message);

        if (error.message.includes('Missing required attribute')) {
            const match = error.message.match(/Missing required attribute "([^"]+)"/);
            const missingField = match ? match[1] : 'desconhecido';

            console.error('\n💡 Campo obrigatório faltando:', missingField);
            console.error('   Este campo precisa ser adicionado à Collection no Appwrite.');
        } else if (error.message.includes('Unknown attribute')) {
            const match = error.message.match(/Unknown attribute: "([^"]+)"/);
            const unknownField = match ? match[1] : 'desconhecido';

            console.error('\n💡 Campo desconhecido:', unknownField);
            console.error('   Este campo não existe na Collection. Adicione-o no Appwrite.');
        }
    }
}

testConnection();
