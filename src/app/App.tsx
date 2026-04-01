import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { Suspense, lazy, useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { Navbar } from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import { CustomCursor } from '@/app/components/CustomCursor';
import { MouseFollower } from '@/app/components/MouseFollower';
import { AnalyticsTracker } from '@/app/components/AnalyticsTracker';
import { SoundProvider } from '@/app/components/SoundContext';
import { SoundDisclaimer } from '@/app/components/SoundDisclaimer';
import { useIsMobileViewport } from '@/app/hooks/useIsMobileViewport';

const HomePage = lazy(() => import('@/pages/HomePage').then((module) => ({ default: module.HomePage })));
const AboutPage = lazy(() => import('@/pages/AboutPage').then((module) => ({ default: module.AboutPage })));
const FeaturesPage = lazy(() => import('@/pages/FeaturesPage').then((module) => ({ default: module.FeaturesPage })));
const SolutionsPage = lazy(() => import('@/pages/SolutionsPage').then((module) => ({ default: module.SolutionsPage })));
const HelpPage = lazy(() => import('@/pages/HelpPage').then((module) => ({ default: module.HelpPage })));
const PricingPage = lazy(() => import('@/app/components/PricingPage').then((module) => ({ default: module.PricingPage })));
const Downloads = lazy(() => import('@/app/components/Downloads').then((module) => ({ default: module.Downloads })));
const Documents = lazy(() => import('@/app/components/Documents').then((module) => ({ default: module.Documents })));
const MiraComingSoon = lazy(() => import('@/app/components/MiraComingSoon').then((module) => ({ default: module.MiraComingSoon })));
const Contact = lazy(() => import('@/app/components/Contact').then((module) => ({ default: module.Contact })));
const GetStarted = lazy(() => import('@/app/components/GetStarted').then((module) => ({ default: module.GetStarted })));
const Partners = lazy(() => import('@/app/components/Partners').then((module) => ({ default: module.Partners })));
const PrivacyPolicy = lazy(() => import('@/app/components/PrivacyPolicy').then((module) => ({ default: module.PrivacyPolicy })));
const TermsOfService = lazy(() => import('@/app/components/TermsOfService').then((module) => ({ default: module.TermsOfService })));
const AttendanceFeature = lazy(() => import('@/app/components/features/AttendanceFeature').then((module) => ({ default: module.AttendanceFeature })));
const PayrollFeature = lazy(() => import('@/app/components/features/PayrollFeature').then((module) => ({ default: module.PayrollFeature })));
const LeavesFeature = lazy(() => import('@/app/components/features/LeavesFeature').then((module) => ({ default: module.LeavesFeature })));
const ProjectsFeature = lazy(() => import('@/app/components/features/ProjectsFeature').then((module) => ({ default: module.ProjectsFeature })));
const GoalsFeature = lazy(() => import('@/app/components/features/GoalsFeature').then((module) => ({ default: module.GoalsFeature })));
const WorkflowsFeature = lazy(() => import('@/app/components/features/WorkflowsFeature').then((module) => ({ default: module.WorkflowsFeature })));
const MiraAIFeature = lazy(() => import('@/app/components/features/MiraAIFeature').then((module) => ({ default: module.MiraAIFeature })));
const TeamChatFeature = lazy(() => import('@/app/components/features/TeamChatFeature').then((module) => ({ default: module.TeamChatFeature })));
const NotificationsFeature = lazy(() => import('@/app/components/features/NotificationsFeature').then((module) => ({ default: module.NotificationsFeature })));
const AdminDashboard = lazy(() => import('@/app/components/AdminDashboard').then((module) => ({ default: module.AdminDashboard })));
const BlogPage = lazy(() => import('@/app/components/BlogPage').then((module) => ({ default: module.BlogPage })));
const BlogPostPage = lazy(() => import('@/app/components/BlogPostPage').then((module) => ({ default: module.BlogPostPage })));

function RouteFallback() {
  return <div className="min-h-[60vh] bg-gray-950" />;
}

function ScrollToTop({ lenisRef }: { lenisRef?: React.RefObject<Lenis | null> }) {
  const { pathname } = useLocation();
  useEffect(() => {
    // Force Lenis to scroll to top immediately, bypassing smooth interpolation
    if (lenisRef?.current) {
      lenisRef.current.scrollTo(0, { immediate: true });
    }
    // Also reset native scroll position as fallback
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
    document.documentElement.scrollTop = 0;
    document.body.scrollTop = 0;

    // Double-tap after a frame to guarantee it sticks even if Lenis re-renders
    requestAnimationFrame(() => {
      if (lenisRef?.current) {
        lenisRef.current.scrollTo(0, { immediate: true });
      }
      window.scrollTo(0, 0);
    });
  }, [pathname]);
  return null;
}

function AppLayout() {
  const { pathname } = useLocation();
  const isAdmin = pathname === '/admin';
  const isMobileViewport = useIsMobileViewport();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (isMobileViewport) {
      lenisRef.current?.destroy();
      lenisRef.current = null;
      document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');
      document.body.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped');
      document.documentElement.style.scrollBehavior = 'auto';
      document.body.style.scrollBehavior = 'auto';
      return;
    }

    const lenis = new Lenis({
      lerp: 0.08,
      duration: 1.4,
      smoothWheel: true,
      wheelMultiplier: 0.8,
      touchMultiplier: 1,
    });
    lenisRef.current = lenis;
    let rafId = 0;

    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [isMobileViewport]);

  return (
    <div className={`min-h-screen bg-gray-950 transition-colors duration-300 relative ${isMobileViewport ? '' : 'cursor-none'}`} style={{ position: 'relative' }}>
      <ScrollToTop lenisRef={lenisRef} />
      {!isMobileViewport && <CustomCursor />}
      {!isMobileViewport && <MouseFollower />}
      {!isAdmin && <AnalyticsTracker />}
      {!isAdmin && <Navbar />}
      <Suspense fallback={<RouteFallback />}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/mira-ai" element={<MiraComingSoon />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/features/attendance" element={<AttendanceFeature />} />
          <Route path="/features/payroll" element={<PayrollFeature />} />
          <Route path="/features/leaves" element={<LeavesFeature />} />
          <Route path="/features/projects" element={<ProjectsFeature />} />
          <Route path="/features/goals" element={<GoalsFeature />} />
          <Route path="/features/workflows" element={<WorkflowsFeature />} />
          <Route path="/features/mira-ai" element={<MiraAIFeature />} />
          <Route path="/features/team-chat" element={<TeamChatFeature />} />
          <Route path="/features/notifications" element={<NotificationsFeature />} />
          <Route path="/pricing" element={<PricingPage />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/get-started" element={<GetStarted />} />
          <Route path="/help" element={<HelpPage />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/solutions" element={<SolutionsPage />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/blog" element={<BlogPage />} />
          <Route path="/blog/:slug" element={<BlogPostPage />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </Suspense>
      {!isAdmin && <Footer />}
    </div>
  );
}

export default function App() {
  const isMobileViewport = useIsMobileViewport();

  return (
    <SoundProvider>
      <BrowserRouter>
        {!isMobileViewport && <SoundDisclaimer />}
        <AppLayout />
      </BrowserRouter>
    </SoundProvider>
  );
}