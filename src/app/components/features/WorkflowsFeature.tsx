import { FeatureDetailPage } from '@/app/components/FeatureDetailPage';
import { Workflow, Zap, Bot, GitBranch, Plug, LayoutTemplate } from 'lucide-react';

export function WorkflowsFeature() {
  return (
    <FeatureDetailPage
      badge="AI WORKFLOWS"
      title="AI Workflows"
      titleGradient="from-indigo-400 to-violet-400"
      subtitle="Automate repetitive tasks with intelligent automation — no code required."
      accentColor="text-violet-400"
      gradientFrom="to-violet-950/30"
      heroImage="https://images.unsplash.com/photo-1523961131990-5ea7c61b2107?auto=format&fit=crop&w=1920&q=80"
      stats={[
        { value: '70%', label: 'Less Manual Work' },
        { value: '24/7', label: 'Automation' },
        { value: '50+', label: 'Templates' },
        { value: 'Zero', label: 'Code Required' },
      ]}
      features={[
        {
          icon: Workflow,
          title: 'Visual Builder',
          description: 'Visual drag & drop flow design with instant preview of your automations.',
          details: ['Drag & drop', 'Visual flow design', 'Instant preview'],
        },
        {
          icon: Zap,
          title: 'Smart Triggers',
          description: 'Event-based triggers with scheduled runs and data change detection.',
          details: ['Event-based', 'Scheduled runs', 'Data detection'],
        },
        {
          icon: Bot,
          title: 'MIRA AI Actions',
          description: 'AI-powered text generation, data analysis, and smart routing.',
          details: ['Text generation', 'Data analysis', 'Smart routing'],
        },
        {
          icon: GitBranch,
          title: 'Conditional Logic',
          description: 'If-then-else branching with multiple conditions and data filters.',
          details: ['If-then-else', 'Multiple conditions', 'Data filters'],
        },
        {
          icon: Plug,
          title: 'Integrations',
          description: 'Connect with Email, Slack, WhatsApp and more for notifications.',
          details: ['Email', 'Slack', 'WhatsApp'],
        },
        {
          icon: LayoutTemplate,
          title: 'Pre-built Templates',
          description: '50+ pre-built flows for onboarding, approvals, and reminders.',
          details: ['Onboarding flows', 'Approval chains', 'Reminders'],
        },
      ]}
      steps={[
        { step: '1', title: 'Choose Trigger', description: 'Select what event starts your workflow.' },
        { step: '2', title: 'Add Actions', description: 'Define the steps your workflow should execute.' },
        { step: '3', title: 'Activate & Relax', description: 'Turn on your workflow and let automation handle the rest.' },
      ]}
      testimonial={{
        quote: "We automated 70% of our HR tasks with Talio's workflow builder. It's been a game-changer.",
        author: 'Anita Desai',
        role: 'HR Director, FastGrowth Corp',
      }}
    />
  );
}
