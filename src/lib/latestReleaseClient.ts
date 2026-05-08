export type LatestReleasePayload = {
    version?: string;
    download_url?: string | null;
    file_name?: string;
    release_name?: string;
    asset_size?: number;
    published_at?: string;
    downloaded_at?: string;
    release_url?: string;
    error?: string;
};

export const LATEST_RELEASE_ENDPOINT = '/api/latest-release';

let latestReleasePromise: Promise<LatestReleasePayload> | null = null;
let latestReleasePayload: LatestReleasePayload | null = null;

export async function getLatestReleasePayload() {
    if (latestReleasePayload) {
        return latestReleasePayload;
    }

    if (!latestReleasePromise) {
        latestReleasePromise = fetch(LATEST_RELEASE_ENDPOINT, {
            headers: { Accept: 'application/json' },
        })
            .then(async (response) => {
                const payload = (await response.json()) as LatestReleasePayload;

                if (!response.ok) {
                    throw new Error(payload.error || 'Latest release is unavailable right now.');
                }

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