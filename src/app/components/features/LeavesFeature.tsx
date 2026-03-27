import { FeatureDetailPage } from '@/app/components/FeatureDetailPage';
import { CalendarPlus, CheckCheck, PieChart, ShieldCheck, CalendarDays, BarChart3 } from 'lucide-react';

export function LeavesFeature() {
  return (
    <FeatureDetailPage
      badge="LEAVE MANAGEMENT"
      title="Leave Management"
      titleGradient="from-orange-400 to-amber-400"
      subtitle="Smart leave tracking with approval workflows, balance monitoring, and complete policy compliance."
      accentColor="text-amber-400"
      gradientFrom="to-amber-950/30"
      stats={[
        { value: '90%', label: 'Faster Approvals' },
        { value: '100%', label: 'Policy Compliance' },
        { value: 'Zero', label: 'Manual Tracking' },
        { value: 'Real-time', label: 'Balance Updates' },
      ]}
      features={[
        {
          icon: CalendarPlus,
          title: 'Easy Leave Requests',
          description: 'One-tap requests with half-day support and document attachments.',
          details: ['One-tap requests', 'Half-day support', 'Attachments'],
        },
        {
          icon: CheckCheck,
          title: 'Quick Approvals',
          description: 'Push notification alerts with bulk approvals and delegation support.',
          details: ['Push notifications', 'Bulk approvals', 'Delegation'],
        },
        {
          icon: PieChart,
          title: 'Balance Tracking',
          description: 'Automatic accruals with carry forward rules and encashment tracking.',
          details: ['Auto accruals', 'Carry forward', 'Encashment'],
        },
        {
          icon: ShieldCheck,
          title: 'Policy Compliance',
          description: 'Custom policies with holiday calendars and blackout date management.',
          details: ['Custom policies', 'Holiday calendar', 'Blackout dates'],
        },
        {
          icon: CalendarDays,
          title: 'Team Calendar',
          description: 'Full team view with overlap detection and coverage planning.',
          details: ['Team view', 'Overlap detection', 'Coverage planning'],
        },
        {
          icon: BarChart3,
          title: 'Analytics & Reports',
          description: 'Usage pattern analysis with trend reports and custom filters.',
          details: ['Usage patterns', 'Trend analysis', 'Custom reports'],
        },
      ]}
      steps={[
        { step: '1', title: 'Submit Request', description: 'Apply for leave with a single tap from anywhere.' },
        { step: '2', title: 'Manager Notified', description: 'Your manager receives an instant notification to approve.' },
        { step: '3', title: 'Instant Update', description: 'Leave balance and team calendar update automatically.' },
      ]}
      testimonial={{
        quote: 'Leave management used to be our biggest headache. Talio made it completely seamless.',
        author: 'Priya Sharma',
        role: 'HR Manager, InnovateTech',
      }}
    />
  );
}
