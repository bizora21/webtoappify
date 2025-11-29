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

            console.log('   - Android SDK Home:', androidHome);
            console.log('   - Gradle wrapper:', gradlew);
            console.log('   - Project directory:', projectDir);

            try {
                console.log('   - Building AAB...');
                await this.updateStatus(buildId, 'building', 55, ['Building AAB bundle...']);
                const aabResult = await execAsync(`${gradlew} bundleRelease`, {
                    cwd: projectDir,
                    timeout: 600000,
                    env: { ...process.env, ANDROID_HOME: androidHome }
                });
                console.log('   - AAB build output:', aabResult.stdout);
                if (aabResult.stderr) console.warn('   - AAB build warnings:', aabResult.stderr);
            } catch (error: any) {
                console.error('   - AAB build failed:', error.message);
                console.error('   - stdout:', error.stdout);
                console.error('   - stderr:', error.stderr);
                throw new Error(`AAB build failed: ${error.message}\n${error.stderr || error.stdout}`);
            }

            try {
                console.log('   - Building APK...');
                await this.updateStatus(buildId, 'building', 75, ['Building APK...']);
                const apkResult = await execAsync(`${gradlew} assembleRelease`, {
                    cwd: projectDir,
                    timeout: 600000,
                    env: { ...process.env, ANDROID_HOME: androidHome }
                });
                console.log('   - APK build output:', apkResult.stdout);
                if (apkResult.stderr) console.warn('   - APK build warnings:', apkResult.stderr);
            } catch (error: any) {
                console.error('   - APK build failed:', error.message);
                console.error('   - stdout:', error.stdout);
                console.error('   - stderr:', error.stderr);
                throw new Error(`APK build failed: ${error.message}\n${error.stderr || error.stdout}`);
            }

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
            console.error(`   - Error message:`, error.message);
            console.error(`   - Error stack:`, error.stack);

            const errorLogs = [
                `Build failed: ${error.message}`,
                `Error type: ${error.constructor.name}`,
                error.stdout ? `stdout: ${error.stdout}` : null,
                error.stderr ? `stderr: ${error.stderr}` : null,
                `Stack trace: ${error.stack}`
            ].filter(Boolean);

            await databases.updateDocument(APPWRITE_DB_ID, APPWRITE_COLLECTION_ID, buildId, {
                status: 'failed',
                error: error.message,
                logs: errorLogs,
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

        console.log('   - Downloading Gradle Wrapper JAR...');
        // Download gradle-wrapper.jar
        const jarUrl = 'https://raw.githubusercontent.com/gradle/gradle/v8.0.0/gradle/wrapper/gradle-wrapper.jar';
        const jarPath = path.join(wrapperDir, 'gradle-wrapper.jar');
        await this.downloadFile(jarUrl, jarPath);

        console.log('   - Creating gradle-wrapper.properties...');
        // Create gradle-wrapper.properties with proper format
        await fs.promises.writeFile(path.join(wrapperDir, 'gradle-wrapper.properties'),
            `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.0-bin.zip
networkTimeout=10000
zipStoreBase=GRADLE_USER_HOME
zipStorePath=wrapper/dists
`);

        console.log('   - Creating gradlew.bat...');
        // Create proper gradlew.bat for Windows
        await fs.promises.writeFile(path.join(projectDir, 'gradlew.bat'),
            `@rem
@rem Copyright 2015 the original author or authors.
@rem
@rem Licensed under the Apache License, Version 2.0 (the "License");
@rem you may not use this file except in compliance with the License.
@rem You may obtain a copy of the License at
@rem
@rem      https://www.apache.org/licenses/LICENSE-2.0
@rem
@rem Unless required by applicable law or agreed to in writing, software
@rem distributed under the License is distributed on an "AS IS" BASIS,
@rem WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
@rem See the License for the specific language governing permissions and
@rem limitations under the License.
@rem

@if "%DEBUG%"=="" @echo off
@rem ##########################################################################
@rem
@rem  Gradle startup script for Windows
@rem
@rem ##########################################################################

@rem Set local scope for the variables with windows NT shell
if "%OS%"=="Windows_NT" setlocal

set DIRNAME=%~dp0
if "%DIRNAME%"=="" set DIRNAME=.
set APP_BASE_NAME=%~n0
set APP_HOME=%DIRNAME%

@rem Resolve any "." and ".." in APP_HOME to make it shorter.
for %%i in ("%APP_HOME%") do set APP_HOME=%%~fi

@rem Add default JVM options here. You can also use JAVA_OPTS and GRADLE_OPTS to pass JVM options to this script.
set DEFAULT_JVM_OPTS="-Xmx64m" "-Xms64m"

@rem Find java.exe
if defined JAVA_HOME goto findJavaFromJavaHome

set JAVA_EXE=java.exe
%JAVA_EXE% -version >NUL 2>&1
if %ERRORLEVEL% equ 0 goto execute

echo.
echo ERROR: JAVA_HOME is not set and no 'java' command could be found in your PATH.
echo.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.

goto fail

:findJavaFromJavaHome
set JAVA_HOME=%JAVA_HOME:"=%
set JAVA_EXE=%JAVA_HOME%/bin/java.exe

if exist "%JAVA_EXE%" goto execute

echo.
echo ERROR: JAVA_HOME is set to an invalid directory: %JAVA_HOME%
echo.
echo Please set the JAVA_HOME variable in your environment to match the
echo location of your Java installation.

goto fail

:execute
@rem Setup the command line

set CLASSPATH=%APP_HOME%\\gradle\\wrapper\\gradle-wrapper.jar

@rem Execute Gradle
"%JAVA_EXE%" %DEFAULT_JVM_OPTS% %JAVA_OPTS% %GRADLE_OPTS% "-Dorg.gradle.appname=%APP_BASE_NAME%" -classpath "%CLASSPATH%" org.gradle.wrapper.GradleWrapperMain %*

:end
@rem End local scope for the variables with windows NT shell
if %ERRORLEVEL% equ 0 goto mainEnd

:fail
rem Set variable GRADLE_EXIT_CONSOLE if you need the _script_ return code instead of
rem the _cmd.exe /c_ return code!
if not "" == "%GRADLE_EXIT_CONSOLE%" exit 1
exit /b 1

:mainEnd
if "%OS%"=="Windows_NT" endlocal

:omega
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
