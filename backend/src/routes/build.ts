import express from 'express';
import { BuildService } from '../services/buildService.js';
import { databases } from '../appwrite/client.js';
import multer from 'multer';
import fs from 'fs';
import { uploadFile } from '../services/storageService.js';

const router = express.Router();

// Appwrite environment variables
const APPWRITE_DB_ID = process.env.APPWRITE_DATABASE_ID || '';
const APPWRITE_COLLECTION_ID = process.env.APPWRITE_COLLECTION_ID || '';

const upload = multer({ dest: 'uploads/' });

/**
 * POST /api/build
 * Recebe a configuração do app e inicia o pipeline de build.
 */
/**
 * POST /api/build
 * Recebe a configuração do app e inicia o pipeline de build.
 * Suporta multipart/form-data para upload de ícones.
 */
router.post('/', upload.fields([{ name: 'icon', maxCount: 1 }, { name: 'splash', maxCount: 1 }]), async (req, res) => {
    console.log('📥 Received build request');
    try {
        let config = req.body;

        // If sent as FormData, config might be a JSON string in a field or individual fields
        if (req.body.config) {
            try {
                config = JSON.parse(req.body.config);
            } catch (e) {
                // ignore, assume body is already the config object (if not stringified)
            }
        }

        // Handle uploaded files
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        if (files) {
            if (files['icon'] && files['icon'][0]) {
                const iconPath = files['icon'][0].path;
                console.log(`   - Processing icon: ${iconPath}`);
                // Upload to Appwrite to get a public URL for the manifest
                const iconUrl = await uploadFile(iconPath, `temp/${Date.now()}_icon.png`);
                config.iconUrl = iconUrl;
                // Clean up temp file
                fs.unlinkSync(iconPath);
            }

            if (files['splash'] && files['splash'][0]) {
                const splashPath = files['splash'][0].path;
                console.log(`   - Processing splash: ${splashPath}`);
                const splashUrl = await uploadFile(splashPath, `temp/${Date.now()}_splash.png`);
                config.splashUrl = splashUrl;
                fs.unlinkSync(splashPath);
            }
        }

        console.log('   - Config:', JSON.stringify(config, null, 2));

        const result = await BuildService.buildApp(config);
        console.log('✅ Build started successfully:', result);
        res.json(result);
    } catch (err: any) {
        console.error('❌ Build error:', err);
        res.status(500).json({ error: err.message });
    }
});

/**
 * GET /api/build/:id
 * Retorna o status atual do build e URLs de download (quando pronto).
 */
router.get('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const build = await databases.getDocument(
            APPWRITE_DB_ID,
            APPWRITE_COLLECTION_ID,
            id
        );

        if (!build) return res.status(404).json({ error: 'Build not found' });
        res.json(build);
    } catch (err: any) {
        console.error('Get build error', err);
        res.status(500).json({ error: err.message });
    }
});

export default router;
