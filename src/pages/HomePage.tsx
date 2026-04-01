import { Suspense, lazy } from 'react';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { useIsMobileViewport } from '@/app/hooks/useIsMobileViewport';

const DesktopHomePage = lazy(() => import('@/pages/DesktopHomePage').then((module) => ({ default: module.DesktopHomePage })));
const MobileHomePage = lazy(() => import('@/pages/MobileHomePage').then((module) => ({ default: module.MobileHomePage })));

export function HomePage() {
  usePageMeta('', 'Talio is an AI-powered productivity utility for modern teams, with MIRA inside workflows and built-in HRMS add-ons for attendance, leave, payroll, and employee management.');
  const isMobileViewport = useIsMobileViewport();

  return (
    <Suspense fallback={<div className="min-h-screen bg-black" />}>
      {isMobileViewport ? <MobileHomePage /> : <DesktopHomePage />}
    </Suspense>
  );
}