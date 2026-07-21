import { getDownload, getDownloadErrorResponse } from '../../server/downloadReleaseService';

function jsonResponse(body: unknown, status: number, headers?: HeadersInit) {
    return Response.json(body, { status, headers });
}

export default {
    async fetch(request: Request) {
        if (request.method !== 'GET') {
            return jsonResponse({ error: 'Method not allowed' }, 405, { Allow: 'GET' });
        }

        try {
            const requestUrl = new URL(request.url);
            const download = await getDownload(requestUrl.searchParams.get('platform'));

            if (download.kind === 'redirect') {
                return new Response(null, {
                    status: 302,
                    headers: {
                        'Cache-Control': 'no-store',
                        Location: download.location,
                    },
                });
            }

            if (!download.response.body) {
                return jsonResponse(
                    { error: 'The installer response was empty.' },
                    502,
                    { 'Cache-Control': 'no-store' },
                );
            }

            const headers = new Headers({
                'Cache-Control': 'no-store',
                'Content-Disposition': `attachment; filename*=UTF-8''${encodeURIComponent(download.fileName)}`,
            });
            const contentType = download.response.headers.get('content-type') || download.contentType;
            const contentLength = download.response.headers.get('content-length');

            if (contentType) headers.set('Content-Type', contentType);
            if (contentLength) headers.set('Content-Length', contentLength);

            return new Response(download.response.body, { status: 200, headers });
        } catch (error) {
            const response = getDownloadErrorResponse(error);
            return jsonResponse(response.body, response.status, { 'Cache-Control': 'no-store' });
        }
    },
};
