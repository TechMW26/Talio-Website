import { Suspense, lazy } from 'react';
import { useIsMobileViewport } from '@/app/hooks/useIsMobileViewport';

const DesktopSolutions = lazy(() => import('@/app/components/Solutions').then((module) => ({ default: module.Solutions })));
const MobileSolutionsPage = lazy(() => import('@/pages/MobileSolutionsPage').then((module) => ({ default: module.MobileSolutionsPage })));

export function SolutionsPage() {
  const isMobileViewport = useIsMobileViewport();

  return (
    <Suspense fallback={<div className="min-h-screen bg-gray-950" />}>
      {isMobileViewport ? <MobileSolutionsPage /> : <DesktopSolutions />}
    </Suspense>
  );
}