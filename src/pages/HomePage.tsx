import { Hero } from '@/app/components/Hero';
import { Features } from '@/app/components/Features';
import { ProjectManagement } from '@/app/components/ProjectManagement';
import { PayrollSection } from '@/app/components/PayrollSection';
import { OKRSection } from '@/app/components/OKRSection';
import { AIWorkflows } from '@/app/components/AIWorkflows';
import { Pricing } from '@/app/components/Pricing';

export function HomePage() {
  return (
    <div style={{ position: 'relative' }}>
      <Hero />
      <Features />
      <ProjectManagement />
      <PayrollSection />
      <OKRSection />
      <AIWorkflows />
      <Pricing />
    </div>
  );
}