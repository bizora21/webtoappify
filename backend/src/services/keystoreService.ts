import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';

const execAsync = promisify(exec);

/** Service to manage Android keystores for signing builds */
export class KeystoreService {
    static async getOrCreateKeystore(packageName: string): Promise<string> {
        const keystoreDir = path.resolve('keystores');
        fs.mkdirSync(keystoreDir, { recursive: true });
        const keystorePath = path.join(keystoreDir, `${packageName}.jks`);
        if (!fs.existsSync(keystorePath)) {
            const password = process.env.KEYSTORE_PASSWORD || 'changeit';
            const cmd = `keytool -genkeypair -v -keystore ${keystorePath} -alias upload -keyalg RSA -keysize 2048 -validity 10000 -storepass ${password} -keypass ${password} -dname "CN=${packageName}, OU=WebToAppify, O=WebToAppify, L=City, S=State, C=US"`;
            await execAsync(cmd);
        }
        return keystorePath;
    }
}
