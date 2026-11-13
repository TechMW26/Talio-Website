import { useEffect, useState } from 'react';

type ViewportSnapshot = {
  width: number;
  height: number;
  zoomFactor: number;
};

function getViewportSnapshot(): ViewportSnapshot {
  if (typeof window === 'undefined') {
    return {
      width: 0,
      height: 0,
      zoomFactor: 1,
    };
  }

  // Desktop page zoom changes the ratio between the window and layout viewport.
  // Touch browsers keep their native pinch zoom and viewport breakpoints.
  const touchDevice = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent)
    || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const ratio = window.innerWidth ? window.outerWidth / window.innerWidth : 1;
  // Chrome changes devicePixelRatio at page zoom. An emulated viewport or
  // docked inspector can change the widths alone, so reject unlikely base scales.
  const basePixelRatio = window.devicePixelRatio / ratio;
  const displayScale = Math.round(basePixelRatio * 4) / 4;
  const plausibleZoom = displayScale >= 1 && Math.abs(basePixelRatio - displayScale) < 0.04;
  const zoomFactor = !touchDevice && plausibleZoom && Number.isFinite(ratio)
    && ratio > 0 && (ratio <= 0.95 || ratio >= 1.05) ? ratio : 1;

  return {
    width: Math.round(window.innerWidth * zoomFactor),
    height: Math.round(window.innerHeight * zoomFactor),
    zoomFactor,
  };
}

export function getBrowserZoomFactor() {
  return getViewportSnapshot().zoomFactor;
}

export function getZoomCompensatedViewportWidth() {
  return getViewportSnapshot().width;
}

export function getZoomCompensatedViewportHeight() {
  return getViewportSnapshot().height;
}

export function useZoomCompensatedViewport() {
  const [viewport, setViewport] = useState<ViewportSnapshot>(getViewportSnapshot);

  useEffect(() => {
    const updateViewport = () => {
      setViewport(getViewportSnapshot());
    };

    const visualViewport = window.visualViewport;

    updateViewport();

    window.addEventListener('resize', updateViewport);
    window.addEventListener('orientationchange', updateViewport);
    visualViewport?.addEventListener('resize', updateViewport);

    return () => {
      window.removeEventListener('resize', updateViewport);
      window.removeEventListener('orientationchange', updateViewport);
      visualViewport?.removeEventListener('resize', updateViewport);
    };
  }, []);

  return viewport;
}

export function useCompensatedMinWidth(minWidth: number) {
  const { width } = useZoomCompensatedViewport();

  return width >= minWidth;
}