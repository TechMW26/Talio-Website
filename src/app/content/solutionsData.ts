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
    desc: 'Everything you need to manage a growing team — no IT required.',
    features: [
      '5-minute setup',
      'Intuitive mobile app',
      'Automated attendance & leave',
      'Simple payroll',
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
    desc: 'Scale confidently with enterprise-grade tools and dedicated support.',
    features: [
      'Multi-location support',
      'Advanced role-based access',
      'SSO & enterprise auth',
      'Dedicated account manager',
      'Custom SLA',
      'Compliance & audit logs',
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
    desc: 'Bridge the distance gap with tools built for distributed teams.',
    features: [
      'Timezone-aware tracking',
      'Desktop productivity monitoring',
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
    desc: 'Empower your HR team with comprehensive automation and insights.',
    features: [
      'Comprehensive employee database',
      'Automated onboarding',
      'Performance management',
      'Advanced reporting',
      'Document management',
      'MIRA AI for HR queries',
    ],
    stats: [
      { value: '80%', label: 'time saved' },
      { value: '50+', label: 'reports' },
    ],
  },
];