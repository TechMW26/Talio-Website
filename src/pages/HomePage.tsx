import { Hero } from '@/app/components/Hero';
import { KeyboardSection } from '@/app/components/KeyboardSection';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { ProjectManagement } from '@/app/components/ProjectManagement';
import { PayrollSection } from '@/app/components/PayrollSection';
import { OKRSection } from '@/app/components/OKRSection';
import { AISection } from '@/app/components/AISection';
import { LanguagesSection } from '@/app/components/LanguagesSection';
import { PrivacySection } from '@/app/components/PrivacySection';
import { PricingCTA } from '@/app/components/PricingCTA';

export function HomePage() {
  usePageMeta('', 'Transform your workforce management with Talio\'s AI-powered platform. Smart attendance, automated payroll, project management, OKRs, and MIRA AI assistant — all in one place.');

  return (
    <div style={{ position: 'relative' }} className="md:[scroll-snap-type:y_proximity]">
      <Hero />
      <KeyboardSection />
      <ProjectManagement />
      <PayrollSection />
      <OKRSection />
      <AISection />
      <PrivacySection />
      <LanguagesSection />
      <PricingCTA />
    </div>
  );
}