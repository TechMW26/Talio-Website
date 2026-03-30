import { Suspense, lazy } from 'react';
import { useIsMobileViewport } from '@/app/hooks/useIsMobileViewport';

const DesktopHelpCenter = lazy(() => import('@/app/components/HelpCenter').then((module) => ({ default: module.HelpCenter })));
const MobileHelpCenterPage = lazy(() => import('@/pages/MobileHelpCenterPage').then((module) => ({ default: module.MobileHelpCenterPage })));

export function HelpPage() {
  const isMobileViewport = useIsMobileViewport();

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950" />}>
      {isMobileViewport ? <MobileHelpCenterPage /> : <DesktopHelpCenter />}
    </Suspense>
  );
}