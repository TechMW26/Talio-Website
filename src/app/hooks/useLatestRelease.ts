import { useCallback, useEffect, useState } from 'react';
import { parseRelease } from '../lib/downloads';

type Release = { tagName: string; downloads: Record<string, { isAvailable: boolean; sizeLabel?: string }> };

export function useLatestRelease() {
  const [release, setRelease] = useState<Release | null>(null);
  const [status, setStatus] = useState<'loading' | 'ready' | 'error'>('loading');
  const [attempt, setAttempt] = useState(0);
  const retry = useCallback(() => setAttempt(value => value + 1), []);

  useEffect(() => {
    let active = true;
    let controller: AbortController | undefined;
    const refresh = async () => {
      controller?.abort();
      const request = new AbortController();
      controller = request;
      const timeout = window.setTimeout(() => request.abort(), 15000);
      try {
        const response = await fetch('/api/latest-release', { cache: 'no-store', signal: request.signal });
        if (!response.ok) throw new Error('Release lookup failed');
        const next = parseRelease(await response.json());
        if (active && controller === request) { setRelease(next); setStatus('ready'); }
      } catch {
        if (active && controller === request) { setRelease(null); setStatus('error'); }
      } finally { window.clearTimeout(timeout); }
    };
    setStatus('loading');
    void refresh();
    const onVisible = () => { if (document.visibilityState === 'visible') void refresh(); };
    const interval = window.setInterval(onVisible, 60000);
    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('online', onVisible);
    return () => {
      active = false;
      controller?.abort();
      window.clearInterval(interval);
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('online', onVisible);
    };
  }, [attempt]);

  return { release, status, retry };
}
