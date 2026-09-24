import { getDownloadCacheHeader, getDownloadErrorResponse, getLatestDownloadsPayload } from '../../server/downloadReleaseService.js';

function jsonResponse(body: unknown, status: number, headers?: HeadersInit) {
    return Response.json(body, { status, headers });
}

export default {
    async fetch(request: Request) {
        if (request.method !== 'GET') {
            return jsonResponse({ error: 'Method not allowed' }, 405, { Allow: 'GET' });
        }

        try {
            const payload = await getLatestDownloadsPayload();
            return jsonResponse(payload, 200, { 'Cache-Control': getDownloadCacheHeader() });
        } catch (error) {
            const response = getDownloadErrorResponse(error);
            return jsonResponse(response.body, response.status, { 'Cache-Control': 'no-store' });
        }
    },
};
