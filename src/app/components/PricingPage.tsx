import { Suspense, lazy } from 'react';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { useIsMobileViewport } from '@/app/hooks/useIsMobileViewport';

const DesktopPricingPage = lazy(() => import('@/app/components/DesktopPricingPage').then((module) => ({ default: module.DesktopPricingPage })));
const MobilePricingPage = lazy(() => import('@/app/components/MobilePricingPage').then((module) => ({ default: module.MobilePricingPage })));

export function PricingPage() {
  usePageMeta('Pricing', 'Simple, transparent pricing for teams of all sizes. Start free, upgrade when you need. Explore Talio Starter, Professional, and Enterprise plans.');
  const isMobileViewport = useIsMobileViewport();

  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      {isMobileViewport ? <MobilePricingPage /> : <DesktopPricingPage />}
    </Suspense>
  );
}
