/**
 * Preloads all sound effect files into the browser Cache API on page load.
 * Files are stored in a persistent cache so they are available offline
 * and on future visits without re-downloading.
 *
 * Call this once from SoundProvider on mount. It is non-render-blocking —
 * uses requestIdleCallback (with setTimeout fallback) so it doesn't
 * delay first paint, but the files will typically be cached well before
 * the user scrolls to any section that uses them.
 */

const CACHE_NAME = 'talio-sound-effects-v1';

const SOUND_URLS = [
  '/sounds/pop-reverb.mp3',
  '/sounds/key-pop.mp3',
  '/sounds/keyboard-click.mp3',
];

let _preloaded = false;

export function preloadSoundEffects() {
  if (_preloaded) return;
  _preloaded = true;

  const run = async () => {
    try {
      if (!('caches' in window)) {
        // Fallback: just fetch them (browser HTTP cache will keep them)
        await Promise.all(SOUND_URLS.map(url => fetch(url).catch(() => {})));
        return;
      }

      const cache = await caches.open(CACHE_NAME);

      // Only fetch files not already cached
      await Promise.all(
        SOUND_URLS.map(async (url) => {
          const existing = await cache.match(url);
          if (!existing) {
            try {
              const response = await fetch(url);
              if (response.ok) {
                await cache.put(url, response);
              }
            } catch {
              // Network error — skip silently
            }
          }
        })
      );
    } catch {
      // Cache API not available or quota exceeded — ignore
    }
  };

  // Schedule after main thread is idle
  if ('requestIdleCallback' in window) {
    (window as any).requestIdleCallback(() => run(), { timeout: 3000 });
  } else {
    setTimeout(run, 500);
  }
}
