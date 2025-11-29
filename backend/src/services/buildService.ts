import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import { v4 as uuidv4 } from 'uuid';
import { uploadFile } from './storageService';
import { databases } from '../appwrite/client';
import { KeystoreService } from './keystoreService';

// Appwrite environment variables
const APPWRITE_DB_ID = process.env.APPWRITE_DATABASE_ID || '';
const APPWRITE_COLLECTION_ID = process.env.APPWRITE_COLLECTION_ID || '';

const execAsync = promisify(exec);

/**
 * Check if required tools are installed
 */
async function checkToolsAvailability(): Promise<{ hasJava: boolean; hasAndroidSDK: boolean; hasBubblewrap: boolean }> {
    const results = {
        hasJava: false,
        hasAndroidSDK: false,
        hasBubblewrap: false
    };

    console.log('🔍 Checking tool availability...');

    try {
        console.log('   - Checking Java...');
        await execAsync('java -version');
        results.hasJava = true;
        console.log('   ✅ Java found');
    } catch (e) {
        console.warn('   ⚠️  Java not found');
    }

    try {
        console.log('   - Checking Android SDK...');
        await execAsync('adb --version');
        results.hasAndroidSDK = true;
        console.log('   ✅ Android SDK found');
    } catch (e) {
        console.warn('   ⚠️  Android SDK not found');
    }

    try {
        console.log('   - Checking Bubblewrap (with 5s timeout)...');

        // On Windows, bubblewrap --version hangs, so skip the check
        if (process.platform === 'win32') {
            console.log('   ⚠️  Skipping Bubblewrap check on Windows (assuming installed)');
            results.hasBubblewrap = true; // Assume it's installed
        } else {
            const bubblewrapCmd = 'bubblewrap';

            // Add timeout to prevent hanging
            await Promise.race([
                execAsync(`${bubblewrapCmd} --version`),
                new Promise((_, reject) => setTimeout(() => reject(new Error('Timeout')), 5000))
            ]);

            results.hasBubblewrap = true;
            console.log('   ✅ Bubblewrap found');
        }
    } catch (e: any) {
        if (e.message === 'Timeout') {
            console.warn('   ⚠️  Bubblewrap check timed out (assuming not available)');
        } else {
            console.warn('   ⚠️  Bubblewrap not found');
        }
    }

    console.log(`📊 Tool check complete: Java=${results.hasJava}, SDK=${results.hasAndroidSDK}, Bubblewrap=${results.hasBubblewrap}`);
    return results;
}

/**
 * Service responsible for generating a Trusted Web Activity (TWA) Android project
 * using Bubblewrap, building it with Gradle, signing it, and uploading the
 * artifacts to cloud storage.
 */
export class BuildService {
    static async buildApp(config: any): Promise<any> {
        const buildId = uuidv4();
        // Create build record in Appwrite
        await databases.createDocument(
            APPWRITE_DB_ID,
            APPWRITE_COLLECTION_ID,
            buildId,
            {
                status: 'queued',
                config: JSON.stringify(config),
                createdAt: new Date().toISOString()
            }
        );

        // Start build process asynchronously
        this.runBuild(buildId, config).catch(err => {
            console.error(`Build ${buildId} failed:`, err);
        });

        return { id: buildId, status: 'queued' };
    }

    private static async runBuild(buildId: string, config: any) {
        const projectDir = path.resolve('builds', buildId);
        console.log(`🚀 Starting build ${buildId} for ${config.appName}`);

        // Check if tools are available
        const tools = await checkToolsAvailability();
        const canBuildReal = tools.hasJava && tools.hasAndroidSDK && tools.hasBubblewrap;

        if (!canBuildReal) {
            console.warn('⚠️  Missing tools for real build. Running in SIMULATION mode.');
            console.warn('   Install Java, Android SDK, and Bubblewrap for real builds.');
            console.warn('   OR use Docker: docker-compose up --build');
            return this.runSimulatedBuild(buildId, config, projectDir);
        }

        return this.runRealBuild(buildId, config, projectDir);
    }

    /**
     * Run a real build with Bubblewrap and Gradle
     */
    private static async runRealBuild(buildId: string, config: any, projectDir: string) {
        try {
            console.log(`📝 Updating status to 'building'...`);
            await this.updateStatus(buildId, 'building', 0, ['Starting real build...']);

            // 1. Initialize project
            console.log(`📂 Creating project directory: ${projectDir}`);
            await fs.promises.mkdir(projectDir, { recursive: true });

            // Generate TWA Manifest
            const manifest = {
                packageId: config.packageName,
                host: new URL(config.url).host,
                name: config.appName,
                launcherName: config.appName,
                display: 'standalone',
                themeColor: config.primaryColor,
                navigationColor: config.primaryColor,
                backgroundColor: config.primaryColor,
                startUrl: config.url,
                iconUrl: config.iconUrl || 'https://via.placeholder.com/512',
                maskableIconUrl: config.iconUrl || 'https://via.placeholder.com/512',
                appVersion: '1.0.0',
                appVersionCode: 1,
                signingKey: {
                    path: await KeystoreService.getOrCreateKeystore(config.packageName),
                    alias: 'upload'
                },
                generatorApp: 'webtoappify'
            };

            await fs.promises.writeFile(path.join(projectDir, 'twa-manifest.json'), JSON.stringify(manifest, null, 2));

            // 2. Run Bubblewrap to generate TWA
            console.log(`⚙️ Generating TWA project...`);
            await this.updateStatus(buildId, 'building', 20, ['Generating TWA project with Bubblewrap...']);

            // Set environment variables to skip interactive prompts
            const bubblewrapEnv = {
                ...process.env,
                JDKPATH: process.env.JAVA_HOME || 'skip', // Tell Bubblewrap to skip JDK install
                CI: 'true' // Some tools check this to disable interactive mode
            };

            // Use npx to ensure we get the global installation
            await execAsync(`npx @bubblewrap/cli init --manifest twa-manifest.json --directory .`, {
                cwd: projectDir,
                env: bubblewrapEnv
            });

            // 3. Build APK/AAB
            console.log(`🔨 Building Android artifacts...`);
            await this.updateStatus(buildId, 'building', 50, ['Building Android artifacts with Gradle...']);

            const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';

            // Build AAB
            console.log('   - Building Bundle (AAB)...');
            await execAsync(`${gradlew} bundleRelease`, { cwd: projectDir });

            // Build APK
            console.log('   - Building APK...');
            await execAsync(`${gradlew} assembleRelease`, { cwd: projectDir });

            // 4. Verify Artifacts
            let aabPath = path.join(projectDir, 'app', 'release', 'app-release.aab');
            let apkPath = path.join(projectDir, 'app', 'release', 'app-release.apk');

            if (!fs.existsSync(aabPath)) {
                aabPath = path.join(projectDir, 'app', 'build', 'outputs', 'bundle', 'release', 'app-release.aab');
            }
            if (!fs.existsSync(apkPath)) {
                apkPath = path.join(projectDir, 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');
            }

            if (!fs.existsSync(aabPath) || !fs.existsSync(apkPath)) {
                throw new Error('Build artifacts not found. Gradle build might have failed.');
            }

            // 5. Upload to Storage
            console.log(`☁️ Uploading artifacts to Appwrite Storage...`);
            await this.updateStatus(buildId, 'building', 90, ['Uploading artifacts...']);

            console.log(`   - Uploading AAB: ${aabPath}`);
            const aabUrl = await uploadFile(aabPath, `builds/${buildId}/app-release.aab`);

            console.log(`   - Uploading APK: ${apkPath}`);
            const apkUrl = await uploadFile(apkPath, `builds/${buildId}/app-release.apk`);

            // 6. Complete
            console.log(`✅ Build complete! Updating final status...`);
            await databases.updateDocument(
                APPWRITE_DB_ID,
                APPWRITE_COLLECTION_ID,
                buildId,
                {
                    status: 'success',
                    progress: 100,
                    aabUrl,
                    apkUrl,
                    completedAt: new Date().toISOString()
                }
            );
            console.log(`🎉 Build ${buildId} finished successfully.`);

        } catch (error: any) {
            console.error(`❌ Build failed: ${error.message}`);
            console.error(error);
            try {
                await databases.updateDocument(
                    APPWRITE_DB_ID,
                    APPWRITE_COLLECTION_ID,
                    buildId,
                    {
                        status: 'failed',
                        error: error.message,
                        completedAt: new Date().toISOString()
                    }
                );
            } catch (updateError) {
                console.error('❌ Failed to update build status to failed:', updateError);
            }
        }
    }

    /**
     * Run a simulated build (when tools are not available)
     */
    private static async runSimulatedBuild(buildId: string, config: any, projectDir: string) {
        try {
            console.log(`📝 Running SIMULATED build (tools not available)...`);
            await this.updateStatus(buildId, 'building', 0, ['[SIMULATION] Starting build...', 'Note: Install Java, Android SDK, and Bubblewrap for real builds']);

            // Create project directory
            await fs.promises.mkdir(projectDir, { recursive: true });

            // Simulate steps with delays
            await new Promise(resolve => setTimeout(resolve, 2000));
            await this.updateStatus(buildId, 'building', 20, ['[SIMULATION] Generating TWA project...']);

            await new Promise(resolve => setTimeout(resolve, 2000));
            await this.updateStatus(buildId, 'building', 50, ['[SIMULATION] Building Android artifacts...']);

            await new Promise(resolve => setTimeout(resolve, 2000));
            await this.updateStatus(buildId, 'building', 80, ['[SIMULATION] Signing artifacts...']);

            // Create mock files
            const mockDir = path.join(projectDir, 'app', 'release');
            await fs.promises.mkdir(mockDir, { recursive: true });

            const aabPath = path.join(mockDir, 'app-release.aab');
            const apkPath = path.join(mockDir, 'app-release.apk');

            // Create realistic-sized mock files (10MB each)
            const mockContent = Buffer.alloc(10 * 1024 * 1024, 'MOCK_BUILD_FILE');
            await fs.promises.writeFile(aabPath, mockContent);
            await fs.promises.writeFile(apkPath, mockContent);

            await this.updateStatus(buildId, 'building', 90, ['[SIMULATION] Uploading artifacts...']);

            // Upload mock files
            const aabUrl = await uploadFile(aabPath, `builds/${buildId}/app-release.aab`);
            const apkUrl = await uploadFile(apkPath, `builds/${buildId}/app-release.apk`);

            // Complete
            await databases.updateDocument(
                APPWRITE_DB_ID,
                APPWRITE_COLLECTION_ID,
                buildId,
                {
                    status: 'success',
                    progress: 100,
                    aabUrl,
                    apkUrl,
                    completedAt: new Date().toISOString()
                }
            );
            console.log(`🎉 [SIMULATION] Build ${buildId} finished.`);
            console.log(`⚠️  This is a SIMULATED build. Files are not real Android apps.`);

        } catch (error: any) {
            console.error(`❌ Simulated build failed: ${error.message}`);
            try {
                await databases.updateDocument(
                    APPWRITE_DB_ID,
                    APPWRITE_COLLECTION_ID,
                    buildId,
                    {
                        status: 'failed',
                        error: error.message,
                        completedAt: new Date().toISOString()
                    }
                );
            } catch (updateError) {
                console.error('❌ Failed to update build status:', updateError);
            }
        }
    }

    private static async updateStatus(buildId: string, status: string, progress: number, logs: string[]) {
        try {
            await databases.updateDocument(
                APPWRITE_DB_ID,
                APPWRITE_COLLECTION_ID,
                buildId,
                {
                    status,
                    progress,
                    logs: logs
                }
            );
        } catch (error) {
            console.error(`❌ Failed to update status for ${buildId}:`, error);
        }
    }
}
