type DownloadPlatform = 'windows' | 'mac' | 'mac-arm64' | 'mac-intel';

type GithubReleaseAsset = {
  id: number;
  name: string;
  size: number;
  url: string;
  browser_download_url: string;
  content_type?: string;
};

type GithubRelease = {
  tag_name: string;
  name?: string;
  published_at?: string;
  assets: GithubReleaseAsset[];
};

type DownloadAssetPayload = {
  platform: DownloadPlatform;
  label: string;
  fileName: string;
  sizeLabel: string;
  downloadUrl: string;
};

const DEFAULT_RELEASE_REPO = 'https://github.com/avirajsharma-ops/Talio.git';
const GITHUB_API_VERSION = '2022-11-28';
const CACHE_HEADER = 's-maxage=300, stale-while-revalidate=600';

const PLATFORM_LABELS: Record<DownloadPlatform, string> = {
  windows: 'Windows 10/11 (64-bit)',
  mac: 'macOS',
  'mac-arm64': 'Apple Silicon (M-series)',
  'mac-intel': 'Intel (x64)',
};

const SUPPORTED_PLATFORMS = new Set<DownloadPlatform>(['windows', 'mac', 'mac-arm64', 'mac-intel']);

export class DownloadReleaseError extends Error {
  status: number;

  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

function normalizeReleaseRepository(repositoryValue: string) {
  const repository = repositoryValue.trim();

  const sshMatch = repository.match(/^git@github\.com:([\w.-]+\/[\w.-]+?)(?:\.git)?$/i);
  if (sshMatch) {
    return sshMatch[1];
  }

  if (/^https?:\/\//i.test(repository)) {
    try {
      const url = new URL(repository);
      const normalizedHost = url.hostname.toLowerCase().replace(/^www\./, '');
      const normalizedPath = url.pathname.replace(/^\/+|\/+$/g, '').replace(/\.git$/i, '');

      if (normalizedHost === 'github.com' && /^[\w.-]+\/[\w.-]+$/.test(normalizedPath)) {
        return normalizedPath;
      }
    } catch {
      return '';
    }
  }

  const normalizedRepository = repository.replace(/\.git$/i, '');

  if (/^[\w.-]+\/[\w.-]+$/.test(normalizedRepository)) {
    return normalizedRepository;
  }

  return '';
}

function getReleaseRepository() {
  const repository = normalizeReleaseRepository(process.env.TALIO_RELEASE_REPO || process.env.GITHUB_RELEASE_REPO || DEFAULT_RELEASE_REPO);

  if (!repository) {
    throw new DownloadReleaseError(500, 'Release repository is not configured correctly.');
  }

  return repository;
}

function getGithubToken() {
  return process.env.GITHUB_RELEASE_TOKEN || process.env.GITHUB_TOKEN || '';
}

function getGithubHeaders(accept = 'application/vnd.github+json') {
  const token = getGithubToken();
  const headers: Record<string, string> = {
    Accept: accept,
    'X-GitHub-Api-Version': GITHUB_API_VERSION,
    'User-Agent': 'Talio-Website-Downloads',
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  return headers;
}

function normalizePlatform(value: unknown): DownloadPlatform {
  const platform = String(value || '').toLowerCase() as DownloadPlatform;

  if (!SUPPORTED_PLATFORMS.has(platform)) {
    throw new DownloadReleaseError(400, 'Unsupported download platform.');
  }

  return platform;
}

function isInstallerAsset(assetName: string) {
  const name = assetName.toLowerCase();
  return !/\.(blockmap|yml|yaml|json|txt|sha256?|sig|asc)$/i.test(name);
}

function scoreAsset(asset: GithubReleaseAsset, platform: DownloadPlatform) {
  const name = asset.name.toLowerCase();

  if (!isInstallerAsset(name)) {
    return Number.NEGATIVE_INFINITY;
  }

  const isWindowsFile = /\.(exe|msi)$/i.test(name) || /(^|[-_.\s])(win|windows)([-_.\s]|$)/i.test(name);
  const isMacFile = /\.(dmg|pkg)$/i.test(name) || /(^|[-_.\s])(mac|macos|darwin|osx)([-_.\s]|$)/i.test(name);
  const hasArm = /(^|[-_.\s])(arm64|aarch64|apple[-_.\s]?silicon|m[1-4])([-_.\s]|$)/i.test(name);
  const hasIntel = /(^|[-_.\s])(x64|x86_64|amd64|intel)([-_.\s]|$)/i.test(name);

  if (platform === 'windows') {
    if (isMacFile || /(^|[-_.\s])(mac|macos|darwin|osx)([-_.\s]|$)/i.test(name)) {
      return Number.NEGATIVE_INFINITY;
    }

    let score = 0;
    if (/\.exe$/i.test(name)) score += 80;
    if (/\.msi$/i.test(name)) score += 75;
    if (/\.zip$/i.test(name)) score += 25;
    if (isWindowsFile) score += 60;
    if (hasIntel) score += 15;
    if (hasArm) score -= 15;
    return score;
  }

  if (isWindowsFile || /\.(exe|msi)$/i.test(name)) {
    return Number.NEGATIVE_INFINITY;
  }

  let score = 0;
  if (/\.dmg$/i.test(name)) score += 80;
  if (/\.pkg$/i.test(name)) score += 65;
  if (/\.zip$/i.test(name)) score += 25;
  if (isMacFile) score += 50;

  if (platform === 'mac-arm64') {
    if (hasArm) score += 55;
    if (hasIntel) score -= 35;
  }

  if (platform === 'mac-intel') {
    if (hasIntel) score += 55;
    if (hasArm) score -= 35;
  }

  if (platform === 'mac') {
    if (hasArm) score += 25;
    if (hasIntel) score += 10;
  }

  return score;
}

function selectReleaseAsset(release: GithubRelease, platform: DownloadPlatform) {
  const rankedAssets = release.assets
    .map((asset) => ({ asset, score: scoreAsset(asset, platform) }))
    .filter(({ score }) => Number.isFinite(score) && score > 0)
    .sort((left, right) => right.score - left.score);

  return rankedAssets[0]?.asset;
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) {
    return '';
  }

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size >= 10 || unitIndex === 0 ? Math.round(size) : size.toFixed(1)} ${units[unitIndex]}`;
}

function toDownloadAssetPayload(platform: DownloadPlatform, asset: GithubReleaseAsset): DownloadAssetPayload {
  return {
    platform,
    label: PLATFORM_LABELS[platform],
    fileName: asset.name,
    sizeLabel: formatBytes(asset.size),
    downloadUrl: `/api/downloads/file?platform=${platform}`,
  };
}

async function fetchLatestRelease(): Promise<GithubRelease> {
  const repository = getReleaseRepository();
  const releaseTag = process.env.TALIO_RELEASE_TAG || process.env.GITHUB_RELEASE_TAG;
  const releasePath = releaseTag ? `releases/tags/${encodeURIComponent(releaseTag)}` : 'releases/latest';
  const response = await fetch(`https://api.github.com/repos/${repository}/${releasePath}`, {
    headers: getGithubHeaders(),
  });

  if (!response.ok) {
    if (response.status === 404 && !getGithubToken()) {
      throw new DownloadReleaseError(502, 'Release repository is private or has no public latest release. Configure GITHUB_RELEASE_TOKEN with read access.');
    }

    if (response.status === 404) {
      throw new DownloadReleaseError(502, 'Release repository or release tag was not found.');
    }

    throw new DownloadReleaseError(502, 'Release downloads are unavailable right now.');
  }

  const release = (await response.json()) as GithubRelease;

  if (!Array.isArray(release.assets)) {
    throw new DownloadReleaseError(502, 'Release downloads are unavailable right now.');
  }

  return release;
}

export async function getLatestDownloadsPayload() {
  const release = await fetchLatestRelease();
  const downloads: Partial<Record<DownloadPlatform, DownloadAssetPayload>> = {};

  for (const platform of ['windows', 'mac', 'mac-arm64', 'mac-intel'] as DownloadPlatform[]) {
    const asset = selectReleaseAsset(release, platform);

    if (asset) {
      downloads[platform] = toDownloadAssetPayload(platform, asset);
    }
  }

  return {
    tagName: release.tag_name,
    version: release.name || release.tag_name,
    publishedAt: release.published_at,
    downloads,
  };
}

export async function getDownloadRedirect(platformValue: unknown) {
  const platform = normalizePlatform(platformValue);
  const release = await fetchLatestRelease();
  const asset = selectReleaseAsset(release, platform);

  if (!asset) {
    throw new DownloadReleaseError(404, 'No installer is available for this platform.');
  }

  const token = getGithubToken();

  if (!token) {
    return {
      fileName: asset.name,
      location: asset.browser_download_url,
    };
  }

  const response = await fetch(asset.url, {
    headers: getGithubHeaders('application/octet-stream'),
    redirect: 'manual',
  });
  const location = response.headers.get('location');

  if (location && response.status >= 300 && response.status < 400) {
    return {
      fileName: asset.name,
      location,
    };
  }

  if (!response.ok) {
    throw new DownloadReleaseError(502, 'Release downloads are unavailable right now.');
  }

  return {
    fileName: asset.name,
    location: asset.browser_download_url,
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
