import { FeatureDetailPage } from '@/app/components/FeatureDetailPage';
import { MessageCircle, FileBarChart, Lightbulb, Cog, HelpCircle, Brain } from 'lucide-react';

export function MIRAAIFeature() {
  return (
    <FeatureDetailPage
      badge="MIRA INSIDE WORKFLOWS"
      title="MIRA"
      titleGradient="from-violet-400 to-purple-400"
      subtitle="Talio's embedded intelligence layer for summaries, drafting, reporting, and faster execution across daily workflows."
      accentColor="text-purple-400"
      gradientFrom="to-purple-950/30"
      heroImage="https://images.unsplash.com/photo-1700427296131-0cc4c4610fc6?auto=format&fit=crop&w=1920&q=80"
      stats={[
        { value: '10x', label: 'Faster Answers' },
        { value: '95%', label: 'Query Accuracy' },
        { value: '24/7', label: 'Available' },
        { value: '50+', label: 'Languages' },
      ]}
      features={[
        {
          icon: MessageCircle,
          title: 'Natural Language',
          description: 'Conversational queries with context awareness and multi-language support.',
          details: ['Conversational', 'Context-aware', 'Multi-language'],
        },
        {
          icon: FileBarChart,
          title: 'Instant Reports',
          description: 'Auto-generated charts with export to PDF/Excel and custom templates.',
          details: ['Auto-generated charts', 'PDF/Excel export', 'Custom templates'],
        },
        {
          icon: Lightbulb,
          title: 'Smart Insights',
          description: 'Trend analysis with predictive alerts and anomaly detection.',
          details: ['Trend analysis', 'Predictive alerts', 'Anomaly detection'],
        },
        {
          icon: Cog,
          title: 'Task Automation',
          description: 'Smart reminders, recurring task setup, and workflow trigger creation.',
          details: ['Smart reminders', 'Recurring tasks', 'Workflow triggers'],
        },
        {
          icon: HelpCircle,
          title: 'Team Self-Service',
          description: 'Help employees answer policy, payslip, and leave questions without extra manager follow-up.',
          details: ['Policy lookups', 'Payslip queries', 'Leave balances'],
        },
        {
          icon: Brain,
          title: 'Learning AI',
          description: "Personalized responses that improve with your company's data over time.",
          details: ['Personalized', 'Company knowledge', 'Continuous learning'],
        },
      ]}
      steps={[
        { step: '1', title: 'Ask Anything', description: 'Type your question in natural language.' },
        { step: '2', title: 'Get Instant Response', description: 'MIRA analyzes context and responds in seconds.' },
        { step: '3', title: 'Take Action', description: 'Act on insights or let MIRA accelerate the workflow.' },
      ]}
      testimonial={{
        quote: "MIRA helps our managers move faster because summaries, reports, and follow-ups happen inside the work itself.",
        author: 'Priya Sharma',
        role: 'HR Head, TechVentures Ltd',
      }}
    />
  );
}
