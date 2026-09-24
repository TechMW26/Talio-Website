export const DOWNLOAD_ORIGIN = 'https://app.talio.in';

export function detectPlatform(navigator) {
  const ua = navigator.userAgent.toLowerCase();
  if (/android/.test(ua)) return 'android';
  if (/iphone|ipad|ipod/.test(ua) || (/mac/.test(ua) && navigator.maxTouchPoints > 1)) return 'ios';
  if (/mac/.test(ua)) return 'mac';
  if (/win/.test(ua)) return 'windows';
  if (/linux/.test(ua)) return 'linux';
  return null;
}

export function parseRelease(data) {
  if (typeof data?.tagName !== 'string' || !data.tagName.trim() || !data.downloads || typeof data.downloads !== 'object') {
    throw new Error('Invalid release metadata');
  }
  return data;
}

export function releaseDownload(release, key, name, arch) {
  const asset = release?.downloads[key];
  return {
    name,
    arch: [arch, asset?.sizeLabel].filter(Boolean).join(' • '),
    // Stable routes resolve the latest release when clicked, even on an old tab.
    url: `${DOWNLOAD_ORIGIN}/download/${key}`,
    isAvailable: asset?.isAvailable === true,
  };
}
