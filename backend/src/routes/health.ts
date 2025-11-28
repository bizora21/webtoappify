import express from 'express';
import { databases } from '../appwrite/client.js';

const router = express.Router();

const APPWRITE_DB_ID = process.env.APPWRITE_DATABASE_ID || '';
const APPWRITE_COLLECTION_ID = process.env.APPWRITE_COLLECTION_ID || '';

/**
 * GET /api/health
 * Health check endpoint
 */
router.get('/', async (req, res) => {
    try {
        // Test Appwrite connection
        const collections = await databases.listCollections(APPWRITE_DB_ID);

        res.json({
            status: 'ok',
            appwrite: {
                connected: true,
                database: APPWRITE_DB_ID,
                collection: APPWRITE_COLLECTION_ID,
                collectionsCount: collections.total
            },
            env: {
                nodeVersion: process.version,
                platform: process.platform,
                androidHome: process.env.ANDROID_HOME || 'not set',
                javaHome: process.env.JAVA_HOME || 'not set'
            }
        });
    } catch (err: any) {
        res.status(500).json({
            status: 'error',
            error: err.message,
            appwrite: {
                connected: false,
                database: APPWRITE_DB_ID,
                collection: APPWRITE_COLLECTION_ID
            }
        });
    }
});

export default router;
