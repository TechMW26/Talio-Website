import { Suspense, lazy } from 'react';
import { useIsMobileViewport } from '@/app/hooks/useIsMobileViewport';

const DesktopFeaturesOverview = lazy(() => import('@/app/components/FeaturesOverview').then((module) => ({ default: module.FeaturesOverview })));
const MobileFeaturesPage = lazy(() => import('@/pages/MobileFeaturesPage').then((module) => ({ default: module.MobileFeaturesPage })));

export function FeaturesPage() {
  const isMobileViewport = useIsMobileViewport();

  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      {isMobileViewport ? <MobileFeaturesPage /> : <DesktopFeaturesOverview />}
    </Suspense>
  );
}