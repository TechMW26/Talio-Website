export type DownloadPlatform = 'windows' | 'mac' | 'mac-arm64' | 'mac-intel' | 'linux';

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
  html_url?: string;
  assets: GithubReleaseAsset[];
};

type DownloadAssetPayload = {
  platform: DownloadPlatform;
  label: string;
  fileName: string;
  sizeLabel: string;
  downloadUrl: string | null;
  isAvailable: boolean;
  unavailableReason?: string;
};

export type DownloadResult = {
  fileName: string;
  contentType?: string;
} & (
  | { kind: 'redirect'; location: string }
  | { kind: 'proxy'; response: Response }
);

const DEFAULT_RELEASE_REPO = 'https://github.com/avirajsharma-ops/Talio.git';
const GITHUB_API_VERSION = '2026-03-10';
const CACHE_HEADER = 's-maxage=120, stale-while-revalidate=300';

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
  return /^[\w.-]+\/[\w.-]+$/.test(normalizedRepository) ? normalizedRepository : '';
}

function getReleaseRepository() {
  const configuredRepository = process.env.TALIO_RELEASE_REPO
    || process.env.GITHUB_RELEASE_REPO
    || DEFAULT_RELEASE_REPO;
  const repository = normalizeReleaseRepository(configuredRepository);

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
  const platformValue = Array.isArray(value) ? value[0] : value;
  const platform = String(platformValue || '').toLowerCase() as DownloadPlatform;

  if (!SUPPORTED_PLATFORMS.has(platform)) {
    throw new DownloadReleaseError(400, 'Unsupported download platform.');
  }

  return platform;
}

function getAssetTraits(assetName: string) {
  const name = assetName.toLowerCase();
  const hasArm = /(^|[-_.\s])(arm64|aarch64|apple[-_.\s]?silicon|m[1-4])([-_.\s]|$)/i.test(name);
  const hasIntel = /(^|[-_.\s])(x64|x86[-_]?64|amd64|intel)([-_.\s]|$)/i.test(name);
  const hasWindowsName = /(^|[-_.\s])(win|windows)([-_.\s]|$)/i.test(name);
  const hasMacName = /(^|[-_.\s])(mac|macos|darwin|osx)([-_.\s]|$)/i.test(name);
  const hasLinuxName = /(^|[-_.\s])(linux|ubuntu|debian)([-_.\s]|$)/i.test(name);

  return {
    name,
    hasArm,
    hasIntel,
    hasWindowsName,
    hasMacName,
    hasLinuxName,
    isWindows: /\.(exe|msi)$/i.test(name) || hasWindowsName,
    isMac: /\.(dmg|pkg)$/i.test(name) || hasMacName,
    isLinux: /\.(appimage|deb|rpm)$/i.test(name) || hasLinuxName,
  };
}

function scoreAsset(asset: GithubReleaseAsset, platform: DownloadPlatform) {
  const traits = getAssetTraits(asset.name);

  if (/\.(blockmap|ya?ml|json|txt|sha256?|sig|asc)$/i.test(traits.name)) {
    return Number.NEGATIVE_INFINITY;
  }

  if (platform === 'windows') {
    if (traits.isMac || traits.isLinux || traits.hasArm) return Number.NEGATIVE_INFINITY;

    let score = traits.isWindows ? 100 : 0;
    if (/\.exe$/i.test(traits.name)) score += 30;
    if (/\.msi$/i.test(traits.name)) score += 25;
    if (traits.hasIntel) score += 10;
    return score;
  }

  if (platform === 'linux') {
    if (traits.isWindows || traits.isMac) return Number.NEGATIVE_INFINITY;

    let score = traits.isLinux ? 100 : 0;
    if (/\.appimage$/i.test(traits.name)) score += 35;
    if (/\.deb$/i.test(traits.name)) score += 30;
    if (/\.rpm$/i.test(traits.name)) score += 25;
    if (traits.hasIntel) score += 10;
    if (traits.hasArm) score -= 20;
    return score;
  }

  if (traits.isWindows || traits.isLinux) return Number.NEGATIVE_INFINITY;
  if (platform === 'mac-arm64' && traits.hasIntel) return Number.NEGATIVE_INFINITY;
  if (platform === 'mac-intel' && traits.hasArm) return Number.NEGATIVE_INFINITY;

  let score = traits.isMac ? 100 : 0;
  if (/\.dmg$/i.test(traits.name)) score += 35;
  if (/\.pkg$/i.test(traits.name)) score += 30;
  if (/\.zip$/i.test(traits.name) && traits.hasMacName) score += 15;

  if (platform === 'mac-arm64' && traits.hasArm) score += 50;
  if (platform === 'mac-intel' && traits.hasIntel) score += 50;
  if (platform === 'mac' && traits.hasArm) score += 30;
  if (platform === 'mac' && traits.hasIntel) score += 15;

  return score;
}

function selectReleaseAsset(release: GithubRelease, platform: DownloadPlatform) {
  return release.assets
    .map((asset) => ({ asset, score: scoreAsset(asset, platform) }))
    .filter(({ score }) => Number.isFinite(score) && score > 0)
    .sort((left, right) => right.score - left.score)[0]?.asset;
}

function formatBytes(bytes: number) {
  if (!Number.isFinite(bytes) || bytes <= 0) return '';

  const units = ['B', 'KB', 'MB', 'GB'];
  let size = bytes;
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size >= 10 || unitIndex === 0 ? Math.round(size) : size.toFixed(1)} ${units[unitIndex]}`;
}

function toDownloadAssetPayload(platform: DownloadPlatform, asset?: GithubReleaseAsset): DownloadAssetPayload {
  if (!asset) {
    return {
      platform,
      label: PLATFORM_LABELS[platform],
      fileName: '',
      sizeLabel: '',
      downloadUrl: null,
      isAvailable: false,
      unavailableReason: 'Not published in latest release',
    };
  }

  return {
    platform,
    label: PLATFORM_LABELS[platform],
    fileName: asset.name,
    sizeLabel: formatBytes(asset.size),
    downloadUrl: `/api/downloads/file?platform=${encodeURIComponent(platform)}`,
    isAvailable: true,
  };
}

async function fetchLatestRelease(): Promise<GithubRelease> {
  const repository = getReleaseRepository();
  const releaseTag = process.env.TALIO_RELEASE_TAG || process.env.GITHUB_RELEASE_TAG;
  const releasePath = releaseTag ? `releases/tags/${encodeURIComponent(releaseTag)}` : 'releases/latest';
  let response: Response;

  try {
    response = await fetch(`https://api.github.com/repos/${repository}/${releasePath}`, {
      headers: getGithubHeaders(),
    });
  } catch {
    throw new DownloadReleaseError(502, 'GitHub release downloads are unavailable right now.');
  }

  if (!response.ok) {
    if (response.status === 401 || response.status === 403) {
      throw new DownloadReleaseError(502, 'The GitHub release token is invalid or does not have access to this repository.');
    }

    if (response.status === 404 && !getGithubToken()) {
      throw new DownloadReleaseError(502, 'The release repository is private. Configure GITHUB_RELEASE_TOKEN on the server.');
    }

    if (response.status === 404) {
      throw new DownloadReleaseError(502, 'The configured repository or release was not found, or the token cannot access it.');
    }

    throw new DownloadReleaseError(502, 'GitHub release downloads are unavailable right now.');
  }

  const release = (await response.json()) as GithubRelease;

  if (!release.tag_name || !Array.isArray(release.assets)) {
    throw new DownloadReleaseError(502, 'GitHub returned an invalid release response.');
  }

  return release;
}

export async function getLatestDownloadsPayload() {
  const release = await fetchLatestRelease();
  const downloads: Partial<Record<DownloadPlatform, DownloadAssetPayload>> = {};

  for (const platform of SUPPORTED_PLATFORMS) {
    downloads[platform] = toDownloadAssetPayload(platform, selectReleaseAsset(release, platform));
  }

  return {
    tagName: release.tag_name,
    version: release.name || release.tag_name,
    release_version: release.tag_name,
    published_at: release.published_at,
    release_name: release.name,
    downloads,
  };
}

export async function getDownload(platformValue: unknown): Promise<DownloadResult> {
  const platform = normalizePlatform(platformValue);
  const release = await fetchLatestRelease();
  const asset = selectReleaseAsset(release, platform);

  if (!asset) {
    throw new DownloadReleaseError(404, 'No installer is available for this platform.');
  }

  const token = getGithubToken();

  if (!token) {
    return {
      kind: 'redirect',
      fileName: asset.name,
      contentType: asset.content_type,
      location: asset.browser_download_url,
    };
  }

  let response: Response;

  try {
    response = await fetch(asset.url, {
      headers: getGithubHeaders('application/octet-stream'),
      redirect: 'manual',
    });
  } catch {
    throw new DownloadReleaseError(502, 'The installer could not be retrieved from GitHub.');
  }

  const location = response.headers.get('location');

  if (location && response.status >= 300 && response.status < 400) {
    return {
      kind: 'redirect',
      fileName: asset.name,
      contentType: asset.content_type,
      location,
    };
  }

  if (!response.ok) {
    throw new DownloadReleaseError(502, 'The installer could not be retrieved from GitHub.');
  }

  // GitHub normally returns a short-lived signed redirect. This proxy fallback
  // covers API responses that return the asset bytes directly instead.
  return {
    kind: 'proxy',
    fileName: asset.name,
    contentType: asset.content_type,
    response,
  };
}

export function getDownloadErrorResponse(error: unknown) {
  if (error instanceof DownloadReleaseError) {
    return { status: error.status, body: { error: error.message } };
  }

  console.error('Unexpected download service error:', error);
  return { status: 500, body: { error: 'Unexpected download service error.' } };
}

export function getDownloadCacheHeader() {
  return CACHE_HEADER;
}
