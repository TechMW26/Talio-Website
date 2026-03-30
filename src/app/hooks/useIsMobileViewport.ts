import { useEffect, useState } from 'react';

const MOBILE_BREAKPOINT_QUERY = '(max-width: 767px)';
const MOBILE_DEVICE_PATTERN = /iPhone|iPod|Android.+Mobile|Windows Phone|webOS|BlackBerry|IEMobile|Opera Mini/i;

function getIsMobileViewport() {
  if (typeof window === 'undefined') {
    return false;
  }

  const narrowViewport = window.matchMedia(MOBILE_BREAKPOINT_QUERY).matches;
  const mobileDevice = MOBILE_DEVICE_PATTERN.test(window.navigator.userAgent);

  return narrowViewport || mobileDevice;
}

export function useIsMobileViewport() {
  const [isMobileViewport, setIsMobileViewport] = useState(getIsMobileViewport);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_BREAKPOINT_QUERY);

    const updateViewportMode = () => {
      setIsMobileViewport(getIsMobileViewport());
    };

    updateViewportMode();

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', updateViewportMode);
    } else {
      mediaQuery.addListener(updateViewportMode);
    }

    window.addEventListener('orientationchange', updateViewportMode);

    return () => {
      if (typeof mediaQuery.removeEventListener === 'function') {
        mediaQuery.removeEventListener('change', updateViewportMode);
      } else {
        mediaQuery.removeListener(updateViewportMode);
      }

      window.removeEventListener('orientationchange', updateViewportMode);
    };
  }, []);

  return isMobileViewport;
}