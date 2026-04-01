import { useZoomCompensatedViewport } from '@/app/hooks/useZoomCompensatedViewport';

const MOBILE_BREAKPOINT = 767;
const MOBILE_DEVICE_PATTERN = /iPhone|iPod|Android.+Mobile|Windows Phone|webOS|BlackBerry|IEMobile|Opera Mini/i;

export function useIsMobileViewport() {
  const { width } = useZoomCompensatedViewport();

  if (typeof window === 'undefined') {
    return false;
  }

  return MOBILE_DEVICE_PATTERN.test(window.navigator.userAgent) || width <= MOBILE_BREAKPOINT;
}