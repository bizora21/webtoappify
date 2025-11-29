import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';
import fs from 'fs';
import https from 'https';
import { v4 as uuidv4 } from 'uuid';
import { uploadFile } from './storageService';
import { databases } from '../appwrite/client';

const APPWRITE_DB_ID = process.env.APPWRITE_DATABASE_ID || '';
const APPWRITE_COLLECTION_ID = process.env.APPWRITE_COLLECTION_ID || '';
const execAsync = promisify(exec);

async function checkToolsAvailability(): Promise<{ hasJava: boolean; hasAndroidSDK: boolean }> {
    const results = { hasJava: false, hasAndroidSDK: false };
    console.log('🔍 Checking tools...');

    try {
        await execAsync('java -version');
        results.hasJava = true;
        console.log('   ✅ Java found');
    } catch (e) {
        console.warn('   ⚠️  Java not found');
    }

    try {
        await execAsync('adb --version');
        results.hasAndroidSDK = true;
        console.log('   ✅ Android SDK found');
    } catch (e) {
        console.warn('   ⚠️  Android SDK not found');
    }

    return results;
}

export class BuildService {
    static async buildApp(config: any): Promise<any> {
        const buildId = uuidv4();
        await databases.createDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_ID, buildId, {
            status: 'queued',
            config: JSON.stringify(config),
            createdAt: new Date().toISOString()
        });

        this.runBuild(buildId, config).catch(err => console.error(`Build failed:`, err));
        return { id: buildId, status: 'queued' };
    }

    private static async runBuild(buildId: string, config: any) {
        const projectDir = path.resolve('builds', buildId);
        console.log(`🚀 Starting REAL build ${buildId}`);

        const tools = await checkToolsAvailability();
        if (!tools.hasJava || !tools.hasAndroidSDK) {
            throw new Error('Java and Android SDK are required. Please install them.');
        }

        return this.runRealBuild(buildId, config, projectDir);
    }

    private static async runRealBuild(buildId: string, config: any, projectDir: string) {
        try {
            await this.updateStatus(buildId, 'building', 0, ['Starting real build...']);
            await fs.promises.mkdir(projectDir, { recursive: true });

            await this.updateStatus(buildId, 'building', 20, ['Generating Android project...']);
            await this.generateTWAProject(projectDir, config);

            await this.updateStatus(buildId, 'building', 30, ['Downloading Gradle Wrapper...']);
            await this.downloadGradleWrapper(projectDir);

            await this.updateStatus(buildId, 'building', 50, ['Building with Gradle...']);
            const gradlew = process.platform === 'win32' ? 'gradlew.bat' : './gradlew';
            const androidHome = process.env.ANDROID_HOME || `${process.env.LOCALAPPDATA}\\Android\\Sdk`;

            console.log('   - Building AAB...');
            await execAsync(`${gradlew} bundleRelease`, {
                cwd: projectDir,
                timeout: 600000,
                env: { ...process.env, ANDROID_HOME: androidHome }
            });

            console.log('   - Building APK...');
            await execAsync(`${gradlew} assembleRelease`, {
                cwd: projectDir,
                timeout: 600000,
                env: { ...process.env, ANDROID_HOME: androidHome }
            });

            const aabPath = path.join(projectDir, 'app', 'build', 'outputs', 'bundle', 'release', 'app-release.aab');
            const apkPath = path.join(projectDir, 'app', 'build', 'outputs', 'apk', 'release', 'app-release.apk');

            if (!fs.existsSync(aabPath) || !fs.existsSync(apkPath)) {
                throw new Error('Build artifacts not found');
            }

            await this.updateStatus(buildId, 'building', 90, ['Uploading...']);
            const aabUrl = await uploadFile(aabPath, `builds/${buildId}/app-release.aab`);
            const apkUrl = await uploadFile(apkPath, `builds/${buildId}/app-release.apk`);

            await databases.updateDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_ID, buildId, {
                status: 'success',
                progress: 100,
                aabUrl,
                apkUrl,
                completedAt: new Date().toISOString()
            });

            console.log(`🎉 Real build completed!`);
        } catch (error: any) {
            console.error(`❌ Build failed:`, error);
            await databases.updateDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_ID, buildId, {
                status: 'failed',
                error: error.message,
                logs: [`Build failed: ${error.message}`],
                completedAt: new Date().toISOString()
            });
        }
    }

    private static async generateTWAProject(projectDir: string, config: any) {
        const appDir = path.join(projectDir, 'app');
        const srcDir = path.join(appDir, 'src', 'main');
        await fs.promises.mkdir(path.join(srcDir, 'res', 'values'), { recursive: true });

        await fs.promises.writeFile(path.join(projectDir, 'build.gradle'), `
buildscript {
    repositories { google(); mavenCentral() }
    dependencies { classpath 'com.android.tools.build:gradle:8.1.0' }
}
allprojects { repositories { google(); mavenCentral() } }
`);

        await fs.promises.writeFile(path.join(projectDir, 'settings.gradle'), `include ':app'`);

        await fs.promises.writeFile(path.join(appDir, 'build.gradle'), `
plugins { id 'com.android.application' }
android {
    namespace '${config.packageName}'
    compileSdk 34
    defaultConfig {
        applicationId '${config.packageName}'
        minSdk 23
        targetSdk 34
        versionCode 1
        versionName '1.0.0'
    }
}
dependencies {
    implementation 'com.google.androidbrowserhelper:androidbrowserhelper:2.5.0'
}
`);

        await fs.promises.writeFile(path.join(srcDir, 'AndroidManifest.xml'), `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android">
    <uses-permission android:name="android.permission.INTERNET" />
    <application android:label="${config.appName}">
        <activity android:name="com.google.androidbrowserhelper.trusted.LauncherActivity" android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
            <meta-data android:name="android.support.customtabs.trusted.DEFAULT_URL" android:value="${config.url}" />
        </activity>
    </application>
</manifest>`);

        await fs.promises.writeFile(path.join(srcDir, 'res', 'values', 'strings.xml'), `<?xml version="1.0" encoding="utf-8"?>
<resources><string name="app_name">${config.appName}</string></resources>`);

        await fs.promises.writeFile(path.join(projectDir, 'gradle.properties'), `
android.useAndroidX=true
android.enableJetifier=true
org.gradle.jvmargs=-Xmx2048m
`);
    }

    private static async downloadGradleWrapper(projectDir: string) {
        const wrapperDir = path.join(projectDir, 'gradle', 'wrapper');
        await fs.promises.mkdir(wrapperDir, { recursive: true });

        // Download gradle-wrapper.jar
        const jarUrl = 'https://raw.githubusercontent.com/gradle/gradle/master/gradle/wrapper/gradle-wrapper.jar';
        const jarPath = path.join(wrapperDir, 'gradle-wrapper.jar');
        await this.downloadFile(jarUrl, jarPath);

        // Create gradle-wrapper.properties
        await fs.promises.writeFile(path.join(wrapperDir, 'gradle-wrapper.properties'), `
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.0-bin.zip
`);

        // Create gradlew.bat
        await fs.promises.writeFile(path.join(projectDir, 'gradlew.bat'), `@echo off
set GRADLE_USER_HOME=%USERPROFILE%\\.gradle
"%JAVA_HOME%\\bin\\java" -jar "%~dp0gradle\\wrapper\\gradle-wrapper.jar" %*
`);
    }

    private static downloadFile(url: string, dest: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const file = fs.createWriteStream(dest);
            https.get(url, (response) => {
                response.pipe(file);
                file.on('finish', () => {
                    file.close();
                    resolve();
                });
            }).on('error', (err) => {
                fs.unlinkSync(dest);
                reject(err);
            });
        });
    }

    private static async updateStatus(buildId: string, status: string, progress: number, logs: string[]) {
        try {
            await databases.updateDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_ID, buildId, {
                status,
                progress,
                logs
            });
        } catch (error) {
            console.error(`Failed to update status:`, error);
        }
    }
}
