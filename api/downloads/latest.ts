import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDownloadCacheHeader, getDownloadErrorResponse, getLatestDownloadsPayload } from '../../server/downloadReleaseService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const payload = await getLatestDownloadsPayload();
        res.setHeader('Cache-Control', getDownloadCacheHeader());
        return res.status(200).json(payload);
    } catch (error) {
        const response = getDownloadErrorResponse(error);
        return res.status(response.status).json(response.body);
    }
}
