import axios from 'axios';
import type { AppConfig } from '../../types';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export interface BuildStatus {
    id: string;
    status: 'queued' | 'building' | 'success' | 'failed';
    progress: number;
    logs: string[];
    aabUrl?: string;
    apkUrl?: string;
}

export async function startBuild(config: AppConfig): Promise<{ buildId: string }> {
    const response = await axios.post(`${API_URL}/api/build`, config);
    return { buildId: response.data.buildId };
}

export async function getBuildStatus(buildId: string): Promise<BuildStatus> {
    const response = await axios.get(`${API_URL}/api/build/${buildId}`);
    return response.data as BuildStatus;
}
