export type LatestReleaseMetadata = {
    version?: string;
    download_url?: string | null;
    file_name?: string;
    published_at?: string;
    release_name?: string;
    asset_size?: number;
    content_type?: string;
    downloaded_at?: string;
    release_url?: string;
    error?: string;
};

const DEFAULT_LATEST_RELEASE_API_URL = 'https://app.talio.in/api/latest-release';
const DEFAULT_LATEST_DOWNLOAD_URL = 'https://app.talio.in/download/latest';

export class LatestReleaseApiError extends Error {
    status: number;
    body: LatestReleaseMetadata;

    constructor(status: number, body: LatestReleaseMetadata) {
        super(body.error || 'Latest release is unavailable right now.');
        this.status = status;
        this.body = body;
    }
}


function getLatestReleaseApiUrl() {
    return process.env.TALIO_LATEST_RELEASE_API_URL || DEFAULT_LATEST_RELEASE_API_URL;
}

export function getLatestDownloadUrl() {
    return process.env.TALIO_LATEST_DOWNLOAD_URL || DEFAULT_LATEST_DOWNLOAD_URL;
}

function normalizeErrorBody(status: number, body: unknown): LatestReleaseMetadata {
    if (body && typeof body === 'object') {
        const payload = body as LatestReleaseMetadata;
        return {
            error: payload.error || 'Latest release is unavailable right now.',
            download_url: payload.download_url ?? null,
        };
    }

    return {
        error: status === 404 ? 'Latest release is not available yet' : 'Latest release is unavailable right now.',
        download_url: null,
    };
}

export async function getLatestReleaseMetadata(): Promise<LatestReleaseMetadata> {
    let response: Response;

    try {
        response = await fetch(getLatestReleaseApiUrl(), {
            headers: {
                Accept: 'application/json',
                'User-Agent': 'Talio-Website-Latest-Release',
            },
        });
    } catch {
        throw new LatestReleaseApiError(502, {
            error: 'Latest release is unavailable right now.',
            download_url: null,
        });
    }

    let body: unknown = null;

    try {
        body = await response.json();
    } catch {
        body = null;
    }

    if (!response.ok) {
        throw new LatestReleaseApiError(response.status, normalizeErrorBody(response.status, body));
    }

    if (!body || typeof body !== 'object') {
        throw new LatestReleaseApiError(502, {
            error: 'Latest release is unavailable right now.',
            download_url: null,
        });
    }

    return body as LatestReleaseMetadata;
}

export function getLatestReleaseErrorResponse(error: unknown) {
    if (error instanceof LatestReleaseApiError) {
        return {
            status: error.status,
            body: error.body,
        };
    }

    return {
        status: 500,
        body: {
            error: 'Unexpected latest release service error.',
            download_url: null,
        },
    };
}