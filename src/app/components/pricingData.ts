import { Building2, Rocket, Sparkles, Wallet, type LucideIcon } from 'lucide-react';

export interface PricingFeature {
  name: string;
  included: boolean;
}

export interface PricingPlan {
  icon: LucideIcon;
  name: string;
  price: { monthly: number; annual: number };
  period: string;
  subtitle: string;
  featured: boolean;
  gradient: string;
  features: PricingFeature[];
  cta: string;
  ctaLink: string;
  badge?: string;
  priceLabel?: string;
}

export interface PricingFaq {
  question: string;
  answer: string;
}

export const pricingPlans: PricingPlan[] = [
  {
    icon: Wallet,
    name: 'Budget',
    price: { monthly: 99, annual: 79 },
    period: '/user/month',
    subtitle: 'Entry-level productivity control for small teams',
    featured: false,
    gradient: 'from-emerald-500 to-teal-500',
    features: [
      { name: 'Up to 50 users', included: true },
      { name: 'GPS attendance tracking', included: true },
      { name: 'Leave management', included: true },
      { name: 'Mobile app access', included: true },
      { name: 'Basic operational reports', included: true },
      { name: 'Team chat', included: false },
      { name: 'Mira workflow support', included: false },
    ],
    cta: 'Start Free Trial',
    ctaLink: '/get-started',
  },
  {
    icon: Sparkles,
    name: 'Starter',
    price: { monthly: 280, annual: 224 },
    period: '/user/month',
    subtitle: 'Operational discipline plus essential HRMS add-ons',
    featured: false,
    gradient: 'from-blue-500 to-cyan-500',
    features: [
      { name: 'Up to 100 users', included: true },
      { name: 'GPS attendance tracking', included: true },
      { name: 'Leave management', included: true },
      { name: 'Team chat', included: true },
      { name: 'Mobile app access', included: true },
      { name: 'Operational reports', included: true },
      { name: 'Mira workflow support', included: false },
    ],
    cta: 'Start Free Trial',
    ctaLink: '/get-started',
  },
  {
    icon: Rocket,
    name: 'Professional',
    badge: 'Most Popular',
    price: { monthly: 380, annual: 304 },
    period: '/user/month',
    subtitle: 'Full productivity utility with Mira and deeper visibility',
    featured: true,
    gradient: 'from-purple-500 to-pink-500',
    features: [
      { name: 'Up to 200 users', included: true },
      { name: 'GPS & geofencing', included: true },
      { name: 'Auto payroll', included: true },
      { name: 'Projects & task coordination', included: true },
      { name: 'Goals & OKRs', included: true },
      { name: 'Mira workflow assistance', included: true },
      { name: 'Priority support', included: true },
    ],
    cta: 'Start Free Trial',
    ctaLink: '/get-started',
  },
  {
    icon: Building2,
    name: 'Enterprise',
    price: { monthly: 0, annual: 0 },
    priceLabel: 'Custom',
    period: '',
    subtitle: 'Deployment flexibility, integrations, and strategic control',
    featured: false,
    gradient: 'from-orange-500 to-red-500',
    features: [
      { name: 'Everything in Professional', included: true },
      { name: 'Custom integrations', included: true },
      { name: 'Dedicated account manager', included: true },
      { name: 'Advanced control options', included: true },
      { name: 'Deployment flexibility', included: true },
      { name: 'Strategic AI enablement', included: true },
      { name: 'Priority support channels', included: true },
    ],
    cta: 'Contact Sales',
    ctaLink: '/contact',
  },
];

export const pricingFaqs: PricingFaq[] = [
  {
    question: 'Is there a free trial?',
    answer: 'Yes! Both Starter and Professional plans come with a 14-day free trial. No credit card required.',
  },
  {
    question: 'Can I change plans anytime?',
    answer: 'Absolutely. You can upgrade or downgrade at any time. Changes are pro-rated.',
  },
  {
    question: 'What payment methods do you accept?',
    answer: 'We accept all major credit cards, UPI, bank transfers, and invoice payments for enterprise plans.',
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes. Talio uses encrypted infrastructure, role-based access, and controlled operational data flows to protect customer information.',
  },
];