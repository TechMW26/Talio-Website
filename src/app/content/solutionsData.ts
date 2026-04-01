import { Building2, Landmark, Globe, Users, type LucideIcon } from 'lucide-react';

export interface SolutionItem {
  icon: LucideIcon;
  title: string;
  gradient: string;
  desc: string;
  features: string[];
  stats: Array<{ value: string; label: string }>;
}

export const solutions: SolutionItem[] = [
  {
    icon: Building2,
    title: 'Small Business',
    gradient: 'from-blue-500 to-cyan-500',
    desc: 'A practical operating utility for growing teams that need daily visibility and HR workflows without extra tool sprawl.',
    features: [
      '5-minute setup',
      'Daily visibility dashboard',
      'Automated attendance & leave',
      'Connected payroll inputs',
      '24/7 email support',
    ],
    stats: [
      { value: '5min', label: 'setup' },
      { value: '50+', label: 'employees managed' },
    ],
  },
  {
    icon: Landmark,
    title: 'Enterprise',
    gradient: 'from-purple-500 to-pink-500',
    desc: 'Scale with deeper controls, integrations, and deployment flexibility for operations-heavy organizations.',
    features: [
      'Multi-location support',
      'Advanced role-based access',
      'Centralized access controls',
      'Dedicated account manager',
      'Deployment flexibility',
      'Operational reporting layers',
    ],
    stats: [
      { value: '10K+', label: 'employees' },
      { value: '99.9%', label: 'uptime SLA' },
    ],
  },
  {
    icon: Globe,
    title: 'Remote Teams',
    gradient: 'from-green-500 to-emerald-500',
    desc: 'Keep distributed teams accountable with better visibility, coordination, and HR workflows in one system.',
    features: [
      'Timezone-aware tracking',
      'Desktop productivity visibility',
      'Async collaboration tools',
      'Virtual office presence',
      'Global payroll support',
    ],
    stats: [
      { value: '24+', label: 'timezones' },
      { value: '100%', label: 'remote ready' },
    ],
  },
  {
    icon: Users,
    title: 'HR Teams',
    gradient: 'from-orange-500 to-amber-500',
    desc: 'Give HR teams the add-ons they need while staying connected to the company’s daily operating layer.',
    features: [
      'Comprehensive employee database',
      'Automated onboarding',
      'Performance management',
      'Advanced reporting',
      'Document management',
      'MIRA workflow support',
    ],
    stats: [
      { value: '80%', label: 'time saved' },
      { value: '50+', label: 'reports' },
    ],
  },
];