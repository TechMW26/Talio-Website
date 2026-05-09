export type LatestDownloadPlatform = 'windows' | 'mac' | 'mac-arm64' | 'mac-intel' | 'linux';

export type LatestDownloadAsset = {
    platform: LatestDownloadPlatform;
    label: string;
    fileName: string;
    sizeLabel: string;
    downloadUrl: string | null;
    isAvailable: boolean;
    unavailableReason?: string;
};

export type LatestReleasePayload = {
    tagName?: string;
    version?: string;
    release_version?: string;
    download_url?: string | null;
    file_name?: string;
    published_at?: string;
    release_name?: string;
    asset_size?: number;
    content_type?: string;
    downloaded_at?: string;
    release_url?: string;
    downloads?: Partial<Record<LatestDownloadPlatform, LatestDownloadAsset>>;
    error?: string;
};

export const LATEST_RELEASE_ENDPOINT = '/api/latest-release';
export const REMOTE_LATEST_RELEASE_ENDPOINT = 'https://app.talio.in/api/latest-release';
export const STABLE_LATEST_DOWNLOAD_URL = 'https://app.talio.in/download/latest';
export const STABLE_PLATFORM_DOWNLOAD_URLS: Record<LatestDownloadPlatform, string> = {
    windows: 'https://app.talio.in/download/windows',
    mac: 'https://app.talio.in/download/mac',
    'mac-arm64': 'https://app.talio.in/download/mac-arm64',
    'mac-intel': 'https://app.talio.in/download/mac-intel',
    linux: 'https://app.talio.in/download/latest',
};

let latestReleasePromise: Promise<LatestReleasePayload> | null = null;
let latestReleasePayload: LatestReleasePayload | null = null;

async function fetchLatestReleaseFrom(endpoint: string) {
    const response = await fetch(endpoint, {
        headers: { Accept: 'application/json' },
    });

    const payload = (await response.json()) as LatestReleasePayload;

    if (!response.ok) {
        throw new Error(payload.error || 'Latest release is unavailable right now.');
    }

    return payload;
}

export async function getLatestReleasePayload() {
    if (latestReleasePayload) {
        return latestReleasePayload;
    }

    if (!latestReleasePromise) {
        latestReleasePromise = fetchLatestReleaseFrom(LATEST_RELEASE_ENDPOINT)
            .catch(() => fetchLatestReleaseFrom(REMOTE_LATEST_RELEASE_ENDPOINT))
            .then((payload) => {
                latestReleasePayload = payload;
                return payload;
            })
            .catch((error) => {
                latestReleasePromise = null;
                throw error;
            });
    }

    return latestReleasePromise;
}

export function prefetchLatestReleasePayload() {
    void getLatestReleasePayload().catch(() => undefined);
}