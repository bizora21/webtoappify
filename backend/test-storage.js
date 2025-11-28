import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

dotenv.config({ path: join(__dirname, '.env') });

console.log('📁 Testando Appwrite Storage...\n');
console.log('🔑 Configuração:');
console.log('  BUCKET_ID:', process.env.APPWRITE_BUCKET_ID);
console.log('  ENDPOINT:', process.env.APPWRITE_ENDPOINT);

const { uploadFile, getFileUrl, deleteFile } = await import('./src/services/storageService.js');

async function testStorage() {
    try {
        // Criar um arquivo de teste
        const testFilePath = join(__dirname, 'test-file.txt');
        fs.writeFileSync(testFilePath, 'Este é um arquivo de teste para Appwrite Storage!');

        console.log('\n📤 Fazendo upload do arquivo de teste...');

        // Upload do arquivo
        const fileUrl = await uploadFile(testFilePath, 'test-upload.txt');

        console.log('✅ Upload bem-sucedido!');
        console.log('📎 URL do arquivo:', fileUrl);

        // Limpar arquivo local
        fs.unlinkSync(testFilePath);

        console.log('\n🎉 TESTE DE STORAGE CONCLUÍDO COM SUCESSO!');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('✅ Upload para Appwrite Storage: OK');
        console.log('✅ URL de download gerada: OK');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');

    } catch (error) {
        console.error('\n❌ Erro no teste:', error.message);

        if (error.message.includes('Bucket with the requested ID')) {
            console.error('\n💡 O Bucket não foi encontrado!');
            console.error('   Verifique se você:');
            console.error('   1. Criou o Bucket no Appwrite');
            console.error('   2. Copiou o BUCKET_ID correto para o .env');
            console.error('   3. Configurou as permissões do Bucket');
        }
    }
}

testStorage();
