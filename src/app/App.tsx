import { BrowserRouter, Routes, Route, useLocation } from 'react-router';
import { useEffect, useRef } from 'react';
import Lenis from 'lenis';
import { Navbar } from '@/app/components/Navbar';
import { Footer } from '@/app/components/Footer';
import { CustomCursor } from '@/app/components/CustomCursor';
import { HomePage } from '@/pages/HomePage';
import { About } from '@/app/components/About';
import { Downloads } from '@/app/components/Downloads';
import { Documents } from '@/app/components/Documents';
import { MiraComingSoon } from '@/app/components/MiraComingSoon';
import { MouseFollower } from '@/app/components/MouseFollower';
import { FeaturesOverview } from '@/app/components/FeaturesOverview';
import { Contact } from '@/app/components/Contact';
import { GetStarted } from '@/app/components/GetStarted';
import { HelpCenter } from '@/app/components/HelpCenter';
import { Partners } from '@/app/components/Partners';
import { Solutions } from '@/app/components/Solutions';
import { PricingPage } from '@/app/components/PricingPage';
import { PrivacyPolicy } from '@/app/components/PrivacyPolicy';
import { TermsOfService } from '@/app/components/TermsOfService';
import { AttendanceFeature } from '@/app/components/features/AttendanceFeature';
import { PayrollFeature } from '@/app/components/features/PayrollFeature';
import { LeavesFeature } from '@/app/components/features/LeavesFeature';
import { ProjectsFeature } from '@/app/components/features/ProjectsFeature';
import { GoalsFeature } from '@/app/components/features/GoalsFeature';
import { WorkflowsFeature } from '@/app/components/features/WorkflowsFeature';
import { MiraAIFeature } from '@/app/components/features/MiraAIFeature';
import { TeamChatFeature } from '@/app/components/features/TeamChatFeature';
import { NotificationsFeature } from '@/app/components/features/NotificationsFeature';
import { AdminDashboard } from '@/app/components/AdminDashboard';
import { AnalyticsTracker } from '@/app/components/AnalyticsTracker';

function ScrollToTop() {
  const { pathname } = useLocation();
  useEffect(() => {
    // Instant scroll to top — bypass Lenis smooth scroll for page navigation
    window.scrollTo({ top: 0, behavior: 'instant' as ScrollBehavior });
  }, [pathname]);
  return null;
}

function AppLayout() {
  const { pathname } = useLocation();
  const isAdmin = pathname === '/admin';
  const lenisRef = useRef<Lenis | null>(null);

  // Initialize Lenis smooth scroll
  useEffect(() => {
    const lenis = new Lenis({
      lerp: 0.08,          // Lower = smoother/slower interpolation (default 0.1)
      duration: 1.4,        // Scroll duration
      smoothWheel: true,
      wheelMultiplier: 0.8, // Slightly slower wheel scroll
      touchMultiplier: 1.5, // Good for mobile
    });
    lenisRef.current = lenis;

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }
    requestAnimationFrame(raf);

    return () => {
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  return (
    <div className="min-h-screen bg-gray-950 transition-colors duration-300 cursor-none relative" style={{ position: 'relative' }}>
      <CustomCursor />
      <MouseFollower />
      {!isAdmin && <AnalyticsTracker />}
      {!isAdmin && <Navbar />}
      <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/about" element={<About />} />
          <Route path="/downloads" element={<Downloads />} />
          <Route path="/documents" element={<Documents />} />
          <Route path="/mira-ai" element={<MiraComingSoon />} />
          <Route path="/features" element={<FeaturesOverview />} />
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
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/partners" element={<Partners />} />
          <Route path="/solutions" element={<Solutions />} />
          <Route path="/privacy" element={<PrivacyPolicy />} />
          <Route path="/terms" element={<TermsOfService />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
        {!isAdmin && <Footer />}
      </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <AppLayout />
    </BrowserRouter>
  );
}