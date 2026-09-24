import test from 'node:test';
import assert from 'node:assert/strict';
import { detectPlatform, parseRelease, releaseDownload } from '../src/app/lib/downloads.js';

for (const [userAgent, maxTouchPoints, expected] of [
  ['Windows NT 10.0', 0, 'windows'], ['Macintosh Intel Mac OS X', 0, 'mac'],
  ['Macintosh Intel Mac OS X', 5, 'ios'], ['iPhone', 1, 'ios'],
  ['Linux Android 15', 5, 'android'], ['X11 Linux x86_64', 0, 'linux'], ['unknown', 0, null],
]) test(`device detection: ${userAgent}/${maxTouchPoints}`, () => {
  assert.equal(detectPlatform({ userAgent, maxTouchPoints }), expected);
});

test('missing assets stay unavailable without invented sizes', () => {
  assert.deepEqual(releaseDownload(null, 'mac-intel', 'Intel', 'x64'), {
    name: 'Intel', arch: 'x64', url: '/api/downloads/file?platform=mac-intel', isAvailable: false,
  });
});
test('new releases update metadata while download routes remain stable', () => {
  for (const tagName of ['v6.0.5', 'v7.0.0']) {
    const release = parseRelease({tagName, downloads: { windows: {isAvailable: true, sizeLabel: '83 MB', downloadUrl: 'https://untrusted.example'} }});
    const download = releaseDownload(release, 'windows', 'Windows', 'x64');
    assert.equal(release.tagName, tagName);
    assert.equal(download.url, '/api/downloads/file?platform=windows');
    assert.equal(download.arch, 'x64 • 83 MB');
    assert.equal(download.isAvailable, true);
  }
});
test('rejects invalid API responses', () => {
  for (const value of [null, {}, {error:'offline'}, {tagName: 'v6.0.5'}]) assert.throws(() => parseRelease(value));
});
