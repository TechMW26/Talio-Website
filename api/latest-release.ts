import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getLatestReleaseErrorResponse, getLatestReleaseMetadata } from '../server/latestReleaseApiService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const payload = await getLatestReleaseMetadata();
        res.setHeader('Cache-Control', 'no-store');
        return res.status(200).json(payload);
    } catch (error) {
        const response = getLatestReleaseErrorResponse(error);
        res.setHeader('Cache-Control', 'no-store');
        return res.status(response.status).json(response.body);
    }
}
