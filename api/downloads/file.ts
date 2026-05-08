import type { VercelRequest, VercelResponse } from '@vercel/node';
import { getDownloadErrorResponse, getDownloadRedirect } from '../../server/downloadReleaseService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const redirect = await getDownloadRedirect(req.query.platform);
        res.setHeader('Cache-Control', 'no-store');
        return res.redirect(302, redirect.location);
    } catch (error) {
        const response = getDownloadErrorResponse(error);
        return res.status(response.status).json(response.body);
    }
}
