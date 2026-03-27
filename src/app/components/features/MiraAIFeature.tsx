import { FeatureDetailPage } from '@/app/components/FeatureDetailPage';
import { MessageCircle, FileBarChart, Lightbulb, Cog, HelpCircle, Brain } from 'lucide-react';

export function MiraAIFeature() {
  return (
    <FeatureDetailPage
      badge="MIRA AI ASSISTANT"
      title="MIRA AI"
      titleGradient="from-violet-400 to-purple-400"
      subtitle="Your natural language HR companion — ask anything, get instant answers, and automate tasks."
      accentColor="text-purple-400"
      gradientFrom="to-purple-950/30"
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
          title: 'Employee Helper',
          description: 'Self-service queries for policies, payslips, and leave balances.',
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
        { step: '2', title: 'Get Instant Response', description: 'MIRA analyzes and responds in seconds.' },
        { step: '3', title: 'Take Action', description: 'Act on insights or let MIRA automate the task.' },
      ]}
      testimonial={{
        quote: "MIRA has become our team's go-to for HR questions. It's like having a personal HR assistant.",
        author: 'Priya Sharma',
        role: 'HR Head, TechVentures Ltd',
      }}
    />
  );
}
