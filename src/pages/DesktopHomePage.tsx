import { Hero } from '@/app/components/Hero';
import { KeyboardSection } from '@/app/components/KeyboardSection';
import { ProjectManagement } from '@/app/components/ProjectManagement';
import { PayrollSection } from '@/app/components/PayrollSection';
import { OKRSection } from '@/app/components/OKRSection';
import { AISection } from '@/app/components/AISection';
import { LanguagesSection } from '@/app/components/LanguagesSection';
import { PrivacySection } from '@/app/components/PrivacySection';
import { PricingCTA } from '@/app/components/PricingCTA';

export function DesktopHomePage() {
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