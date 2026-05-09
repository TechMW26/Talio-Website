import {
  getLatestDownloadUrl,
  getLatestReleaseMetadata,
} from './latestReleaseApiService';

export type DownloadPlatform = 'windows' | 'mac' | 'mac-arm64' | 'mac-intel' | 'linux';

type DownloadAssetPayload = {
  platform: DownloadPlatform;
  label: string;
  fileName: string;
  sizeLabel: string;
  downloadUrl: string | null;
  isAvailable: boolean;
  unavailableReason?: string;
};

type LatestDownloadsPayload = {
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
  downloads: Partial<Record<DownloadPlatform, DownloadAssetPayload>>;
};

const CACHE_HEADER = 's-maxage=120, stale-while-revalidate=300';

const STABLE_PLATFORM_DOWNLOAD_URLS: Record<DownloadPlatform, string> = {
  windows: 'https://app.talio.in/download/windows',
  mac: 'https://app.talio.in/download/mac',
  'mac-arm64': 'https://app.talio.in/download/mac-arm64',
  'mac-intel': 'https://app.talio.in/download/mac-intel',
  linux: 'https://app.talio.in/download/latest',
};

const PLATFORM_LABELS: Record<DownloadPlatform, string> = {
  windows: 'Windows 10/11 (64-bit)',
  mac: 'macOS',
  'mac-arm64': 'Apple Silicon (M-series)',
  'mac-intel': 'Intel (x64)',
  linux: 'Linux',
};

const SUPPORTED_PLATFORMS = new Set<DownloadPlatform>([
  'windows',
  'mac',
  'mac-arm64',
  'mac-intel',
  'linux',
]);

export class DownloadReleaseError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function normalizePlatform(value: unknown): DownloadPlatform {
  const platform = String(value || '').toLowerCase() as DownloadPlatform;

  if (!SUPPORTED_PLATFORMS.has(platform)) {
    throw new DownloadReleaseError(400, 'Unsupported download platform.');
  }

  return platform;
}

function normalizeDownloadEntry(platform: DownloadPlatform, rawEntry: unknown): DownloadAssetPayload {
  const fallbackUrl = STABLE_PLATFORM_DOWNLOAD_URLS[platform];
  const fallbackLabel = PLATFORM_LABELS[platform];

  if (!rawEntry || typeof rawEntry !== 'object') {
    const isLinux = platform === 'linux';
    return {
      platform,
      label: fallbackLabel,
      fileName: '',
      sizeLabel: '',
      downloadUrl: isLinux ? null : fallbackUrl,
      isAvailable: !isLinux,
      unavailableReason: isLinux ? 'Not published in latest release' : undefined,
    };
  }

  const entry = rawEntry as Partial<DownloadAssetPayload>;
  const isAvailable = Boolean(entry.isAvailable);
  const downloadUrl = isAvailable ? entry.downloadUrl || fallbackUrl : null;

  return {
    platform,
    label: entry.label || fallbackLabel,
    fileName: entry.fileName || '',
    sizeLabel: entry.sizeLabel || '',
    downloadUrl,
    isAvailable,
    unavailableReason: !isAvailable
      ? entry.unavailableReason || (platform === 'linux' ? 'Not published in latest release' : 'Release unavailable')
      : undefined,
  };
}

export async function getLatestDownloadsPayload(): Promise<LatestDownloadsPayload> {
  const metadata = await getLatestReleaseMetadata();
  const rawDownloads = (metadata as { downloads?: Record<string, unknown> }).downloads || {};

  const windows = normalizeDownloadEntry('windows', rawDownloads.windows);
  const macArm64 = normalizeDownloadEntry('mac-arm64', rawDownloads['mac-arm64']);
  const macIntel = normalizeDownloadEntry('mac-intel', rawDownloads['mac-intel']);
  const linux = normalizeDownloadEntry('linux', rawDownloads.linux);
  const mac = normalizeDownloadEntry('mac', rawDownloads.mac || rawDownloads['mac-arm64']);

  return {
    tagName: metadata.version,
    version: metadata.version,
    release_version: metadata.version,
    download_url: metadata.download_url || getLatestDownloadUrl(),
    file_name: metadata.file_name,
    published_at: metadata.published_at,
    release_name: metadata.release_name,
    asset_size: metadata.asset_size,
    content_type: metadata.content_type,
    downloaded_at: metadata.downloaded_at,
    release_url: metadata.release_url,
    downloads: {
      windows,
      mac,
      'mac-arm64': macArm64,
      'mac-intel': macIntel,
      linux,
    },
  };
}

export async function getDownloadRedirect(platformValue: unknown) {
  const platform = normalizePlatform(platformValue);
  const payload = await getLatestDownloadsPayload();
  const entry = payload.downloads[platform];

  if (!entry?.isAvailable || !entry.downloadUrl) {
    throw new DownloadReleaseError(404, entry?.unavailableReason || 'No installer is available for this platform.');
  }

  return {
    fileName: entry.fileName || '',
    location: entry.downloadUrl,
  };
}

export function getDownloadErrorResponse(error: unknown) {
  if (error instanceof DownloadReleaseError) {
    return {
      status: error.status,
      body: { error: error.message },
    };
  }

  return {
    status: 500,
    body: { error: 'Unexpected download service error.' },
  };
}

export function getDownloadCacheHeader() {
  return CACHE_HEADER;
}
