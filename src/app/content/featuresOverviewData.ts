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
    description: 'GPS check-ins with geofencing, facial recognition, and real-time tracking for accurate attendance management.',
    gradient: 'from-blue-500 to-cyan-500',
    href: '/features/attendance',
  },
  {
    icon: DollarSign,
    title: 'Auto Payroll',
    description: 'Automated salary calculations, tax deductions, and payslip generation — error-free and on time.',
    gradient: 'from-green-500 to-emerald-500',
    href: '/features/payroll',
  },
  {
    icon: CalendarDays,
    title: 'Leave Management',
    description: 'Smart leave tracking with approval workflows, balance monitoring, and policy compliance.',
    gradient: 'from-orange-500 to-amber-500',
    href: '/features/leaves',
  },
  {
    icon: LayoutGrid,
    title: 'Project Management',
    description: 'Kanban boards, task tracking, deadlines, and team collaboration all in one place.',
    gradient: 'from-purple-500 to-pink-500',
    href: '/features/projects',
  },
  {
    icon: Target,
    title: 'Goals & OKRs',
    description: 'Set company objectives, track key results, and align your team for maximum impact.',
    gradient: 'from-red-500 to-rose-500',
    href: '/features/goals',
  },
  {
    icon: Sparkles,
    title: 'AI Workflows',
    description: 'Automate repetitive tasks with intelligent automation — no code required.',
    gradient: 'from-indigo-500 to-violet-500',
    href: '/features/workflows',
  },
];

export const communicationFeatures: FeatureOverviewItem[] = [
  {
    icon: Bot,
    title: 'MIRA AI Assistant',
    description: 'Your natural language HR companion that answers questions, generates reports, and automates tasks.',
    gradient: 'from-violet-500 to-purple-500',
    href: '/features/mira-ai',
  },
  {
    icon: MessageSquare,
    title: 'Team Chat',
    description: 'Real-time messaging with channels, direct messages, file sharing, and Talio integration.',
    gradient: 'from-sky-500 to-blue-500',
    href: '/features/team-chat',
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'AI-prioritized alerts delivered across multiple channels with custom preferences.',
    gradient: 'from-amber-500 to-orange-500',
    href: '/features/notifications',
  },
];