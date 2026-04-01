import { Suspense, lazy } from 'react';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { useIsMobileViewport } from '@/app/hooks/useIsMobileViewport';

const DesktopPricingPage = lazy(() => import('@/app/components/DesktopPricingPage').then((module) => ({ default: module.DesktopPricingPage })));
const MobilePricingPage = lazy(() => import('@/app/components/MobilePricingPage').then((module) => ({ default: module.MobilePricingPage })));

export function PricingPage() {
  usePageMeta('Pricing', 'Talio is priced for operational value: one daily-use productivity utility with MIRA and built-in HRMS add-ons for attendance, leave, payroll, and employee management.');
  const isMobileViewport = useIsMobileViewport();

  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      {isMobileViewport ? <MobilePricingPage /> : <DesktopPricingPage />}
    </Suspense>
  );
}
