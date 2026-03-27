import { FeatureDetailPage } from '@/app/components/FeatureDetailPage';
import { Target, BarChart3, GitBranch, CalendarCheck, LayoutDashboard, FileText } from 'lucide-react';

export function GoalsFeature() {
  return (
    <FeatureDetailPage
      badge="GOALS & OKRs"
      title="Goals & OKRs"
      titleGradient="from-red-400 to-rose-400"
      subtitle="Set company objectives, track key results, and align your entire team for maximum impact."
      accentColor="text-rose-400"
      gradientFrom="to-rose-950/30"
      stats={[
        { value: '3x', label: 'Goal Achievement' },
        { value: '100%', label: 'Team Alignment' },
        { value: 'Weekly', label: 'Check-ins' },
        { value: 'Real-time', label: 'Progress' },
      ]}
      features={[
        {
          icon: Target,
          title: 'Objective Setting',
          description: 'Set goals at company, team, and individual levels with cascading alignment.',
          details: ['Company/team/individual', 'Cascading goals', 'Custom timeframes'],
        },
        {
          icon: BarChart3,
          title: 'Key Results',
          description: 'Quantifiable metrics with auto progress calculation and confidence scoring.',
          details: ['Quantifiable metrics', 'Auto progress', 'Confidence scores'],
        },
        {
          icon: GitBranch,
          title: 'Goal Alignment',
          description: 'Visual dependency mapping with alignment view across teams.',
          details: ['Cascading goals', 'Dependency mapping', 'Alignment view'],
        },
        {
          icon: CalendarCheck,
          title: 'Weekly Check-ins',
          description: 'Weekly progress updates with blocker flagging and win celebrations.',
          details: ['Progress updates', 'Blocker flagging', 'Win celebrations'],
        },
        {
          icon: LayoutDashboard,
          title: 'Progress Dashboard',
          description: 'Health indicators with risk alerts and trend visualization.',
          details: ['Health indicators', 'Risk alerts', 'Trend charts'],
        },
        {
          icon: FileText,
          title: 'Quarterly Reviews',
          description: 'Auto scoring with retrospectives and quarter planning tools.',
          details: ['Auto scoring', 'Retrospectives', 'Quarter planning'],
        },
      ]}
      steps={[
        { step: '1', title: 'Set Objectives', description: 'Define company and team objectives for the quarter.' },
        { step: '2', title: 'Define Key Results', description: 'Add measurable key results to each objective.' },
        { step: '3', title: 'Track & Achieve', description: 'Monitor progress and celebrate wins along the way.' },
      ]}
      testimonial={{
        quote: 'OKR tracking used to be scattered across spreadsheets. Talio brought clarity to our entire organization.',
        author: 'Michael Roberts',
        role: 'CEO, ScaleUp Ventures',
      }}
    />
  );
}
