import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Readable } from 'node:stream';
import { getDownload, getDownloadErrorResponse } from '../../server/downloadReleaseService';

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'GET') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const download = await getDownload(req.query.platform);
        res.setHeader('Cache-Control', 'no-store');

        if (download.kind === 'redirect') {
            return res.redirect(302, download.location);
        }

        const contentType = download.response.headers.get('content-type') || download.contentType;
        const contentLength = download.response.headers.get('content-length');

        if (contentType) res.setHeader('Content-Type', contentType);
        if (contentLength) res.setHeader('Content-Length', contentLength);
        res.setHeader('Content-Disposition', `attachment; filename*=UTF-8''${encodeURIComponent(download.fileName)}`);

        if (!download.response.body) {
            return res.status(502).json({ error: 'The installer response was empty.' });
        }

        Readable.fromWeb(download.response.body as any).pipe(res);
        return;
    } catch (error) {
        const response = getDownloadErrorResponse(error);
        return res.status(response.status).json(response.body);
    }
}
