import { Suspense, lazy } from 'react';
import { useIsMobileViewport } from '@/app/hooks/useIsMobileViewport';

const DesktopAbout = lazy(() => import('@/app/components/About').then((module) => ({ default: module.About })));
const MobileAboutPage = lazy(() => import('@/pages/MobileAboutPage').then((module) => ({ default: module.MobileAboutPage })));

export function AboutPage() {
  const isMobileViewport = useIsMobileViewport();

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950" />}>
      {isMobileViewport ? <MobileAboutPage /> : <DesktopAbout />}
    </Suspense>
  );
}