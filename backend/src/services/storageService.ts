import { Client, Storage } from 'node-appwrite';
import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

// Configurar cliente Appwrite
const client = new Client();
client
    .setEndpoint(process.env.APPWRITE_ENDPOINT || '')
    .setProject(process.env.APPWRITE_PROJECT_ID || '')
    .setKey(process.env.APPWRITE_API_KEY || '');

const storage = new Storage(client);

const BUCKET_ID = process.env.APPWRITE_BUCKET_ID || '';

/**
 * Upload a local file to Appwrite Storage and return a download URL.
 * @param localPath - Path to the local file
 * @param key - Unique key/name for the file in storage
 * @returns Download URL for the uploaded file
 */
export async function uploadFile(localPath: string, key: string): Promise<string> {
    try {
        // Verificar se o arquivo existe
        if (!fs.existsSync(localPath)) {
            throw new Error(`File not found: ${localPath}`);
        }

        const fileId = key.replace(/\//g, '-').replace(/\./g, '-'); // ID sem caracteres especiais
        const fileName = path.basename(localPath);

        // Create stream for Appwrite
        const fileStream = fs.createReadStream(localPath);
        // @ts-ignore
        const file = {
            name: fileName,
            type: mimeTypeFromExtension(localPath),
            size: fs.statSync(localPath).size,
            stream: fileStream
        };

        // Upload para Appwrite Storage
        const uploadedFile = await storage.createFile(
            BUCKET_ID,
            fileId,
            file as any,
            [
                'read("any")', // Permitir leitura pública
            ]
        );

        console.log(`✅ File uploaded to Appwrite: ${uploadedFile.$id}`);

        // Retornar URL de download
        const downloadUrl = `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${uploadedFile.$id}/view?project=${process.env.APPWRITE_PROJECT_ID}`;

        return downloadUrl;

    } catch (error: any) {
        console.error('❌ Error uploading file to Appwrite:', error.message);
        console.error('Details:', error);
        throw error;
    }
}

/**
 * Get download URL for a file in Appwrite Storage
 * @param fileId - ID of the file in storage
 * @returns Download URL
 */
export function getFileUrl(fileId: string): string {
    return `${process.env.APPWRITE_ENDPOINT}/storage/buckets/${BUCKET_ID}/files/${fileId}/view?project=${process.env.APPWRITE_PROJECT_ID}`;
}

/**
 * Delete a file from Appwrite Storage
 * @param fileId - ID of the file to delete
 */
export async function deleteFile(fileId: string): Promise<void> {
    try {
        await storage.deleteFile(BUCKET_ID, fileId);
        console.log(`✅ File deleted from Appwrite: ${fileId}`);
    } catch (error: any) {
        console.error('❌ Error deleting file from Appwrite:', error.message);
        throw error;
    }
}

/**
 * Determine MIME type from file extension
 */
function mimeTypeFromExtension(filePath: string): string {
    const ext = path.extname(filePath).toLowerCase();
    switch (ext) {
        case '.aab':
            return 'application/octet-stream';
        case '.apk':
            return 'application/vnd.android.package-archive';
        case '.zip':
            return 'application/zip';
        case '.json':
            return 'application/json';
        default:
            return 'application/octet-stream';
    }
}
