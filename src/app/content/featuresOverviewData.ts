import {
  Clock,
  DollarSign,
  CalendarDays,
  LayoutGrid,
  Target,
  Sparkles,
  Bot,
  MessageSquare,
  Bell,
  type LucideIcon,
} from 'lucide-react';

export interface FeatureOverviewItem {
  icon: LucideIcon;
  title: string;
  description: string;
  gradient: string;
  href: string;
}

export const coreFeatures: FeatureOverviewItem[] = [
  {
    icon: Clock,
    title: 'Smart Attendance',
    description: 'GPS check-ins and geofencing keep attendance tied to real operating context, approvals, and daily visibility.',
    gradient: 'from-blue-500 to-cyan-500',
    href: '/features/attendance',
  },
  {
    icon: DollarSign,
    title: 'Auto Payroll',
    description: 'Keep payroll workflows connected to attendance, approvals, and cleaner operating data instead of scattered exports.',
    gradient: 'from-green-500 to-emerald-500',
    href: '/features/payroll',
  },
  {
    icon: CalendarDays,
    title: 'Leave Management',
    description: 'Manage leave requests, balances, and approvals in the same system managers use for daily execution.',
    gradient: 'from-orange-500 to-amber-500',
    href: '/features/leaves',
  },
  {
    icon: LayoutGrid,
    title: 'Project Management',
    description: 'Coordinate tasks, deadlines, and approvals in one workflow layer instead of switching across fragmented tools.',
    gradient: 'from-purple-500 to-pink-500',
    href: '/features/projects',
  },
  {
    icon: Target,
    title: 'Goals & OKRs',
    description: 'Give leaders and teams a shared view of priorities, progress, and accountability across day-to-day work.',
    gradient: 'from-red-500 to-rose-500',
    href: '/features/goals',
  },
  {
    icon: Sparkles,
    title: 'AI Workflows',
    description: 'Use Mira-driven automation to reduce manual follow-up, drafting, and repetitive operational work.',
    gradient: 'from-indigo-500 to-violet-500',
    href: '/features/workflows',
  },
];

export const communicationFeatures: FeatureOverviewItem[] = [
  {
    icon: Bot,
    title: 'Mira',
    description: 'Embedded workflow intelligence that helps teams answer questions, generate output, and act faster inside daily work.',
    gradient: 'from-violet-500 to-purple-500',
    href: '/features/mira-ai',
  },
  {
    icon: MessageSquare,
    title: 'Team Chat',
    description: 'Keep team coordination, updates, and operating context in one place instead of scattering work across side channels.',
    gradient: 'from-sky-500 to-blue-500',
    href: '/features/team-chat',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'Surface the right alerts, approvals, and blockers early so managers can respond before issues compound.',
    gradient: 'from-amber-500 to-orange-500',
    href: '/features/notifications',
  },
];