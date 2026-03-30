import { Suspense, lazy } from 'react';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { useIsMobileViewport } from '@/app/hooks/useIsMobileViewport';

const DesktopHomePage = lazy(() => import('@/pages/DesktopHomePage').then((module) => ({ default: module.DesktopHomePage })));
const MobileHomePage = lazy(() => import('@/pages/MobileHomePage').then((module) => ({ default: module.MobileHomePage })));

export function HomePage() {
  usePageMeta('', 'Transform your workforce management with Talio\'s AI-powered platform. Smart attendance, automated payroll, project management, OKRs, and MIRA AI assistant — all in one place.');
  const isMobileViewport = useIsMobileViewport();

  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      {isMobileViewport ? <MobileHomePage /> : <DesktopHomePage />}
    </Suspense>
  );
}