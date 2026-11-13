import { Suspense, lazy } from 'react';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { useIsMobileViewport } from '@/app/hooks/useIsMobileViewport';

const DesktopHomePage = lazy(() => import('@/pages/DesktopHomePage').then((module) => ({ default: module.DesktopHomePage })));
const MobileHomePage = lazy(() => import('@/pages/MobileHomePage').then((module) => ({ default: module.MobileHomePage })));

export function HomePage() {
  usePageMeta('', 'Manage projects, coordinate teams, and handle attendance, leave, and payroll in Talio. Ask MIRA for help using Super Intelligence (SI).');
  const isMobileViewport = useIsMobileViewport();

  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      {isMobileViewport ? <MobileHomePage /> : <DesktopHomePage />}
    </Suspense>
  );
}