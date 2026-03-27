import { FeatureDetailPage } from '@/app/components/FeatureDetailPage';
import { Filter, Bell, Mail, Moon, Settings, Inbox } from 'lucide-react';

export function NotificationsFeature() {
  return (
    <FeatureDetailPage
      badge="SMART NOTIFICATIONS"
      title="Smart Notifications"
      titleGradient="from-amber-400 to-orange-400"
      subtitle="AI-prioritized alerts delivered across multiple channels with fully customizable preferences."
      accentColor="text-orange-400"
      gradientFrom="to-orange-950/30"
      stats={[
        { value: 'AI', label: 'Smart Priority' },
        { value: 'Multi', label: 'Channel Delivery' },
        { value: 'Custom', label: 'Preferences' },
        { value: 'Zero', label: 'Noise' },
      ]}
      features={[
        {
          icon: Filter,
          title: 'Smart Filtering',
          description: 'AI prioritization with context awareness and smart grouping.',
          details: ['AI prioritization', 'Context awareness', 'Smart grouping'],
        },
        {
          icon: Bell,
          title: 'Push Notifications',
          description: 'Real-time push notifications on iOS and Android with rich media.',
          details: ['iOS & Android', 'Real-time push', 'Rich notifications'],
        },
        {
          icon: Mail,
          title: 'Email Digests',
          description: 'Daily digests and weekly summaries on your schedule.',
          details: ['Daily digests', 'Weekly summaries', 'Custom schedules'],
        },
        {
          icon: Moon,
          title: 'Quiet Hours',
          description: 'Respect work hours with weekend silence and urgent overrides.',
          details: ['Work hours setup', 'Weekend silence', 'Urgent overrides'],
        },
        {
          icon: Settings,
          title: 'Custom Preferences',
          description: 'Per-category settings with channel selection and threshold controls.',
          details: ['Per-category', 'Channel selection', 'Thresholds'],
        },
        {
          icon: Inbox,
          title: 'Notification Center',
          description: 'Unified inbox with quick actions, search, and filtering.',
          details: ['Unified inbox', 'Quick actions', 'Search & filter'],
        },
      ]}
      steps={[
        { step: '1', title: 'Set Preferences', description: 'Choose what notifications matter most to you.' },
        { step: '2', title: 'Choose Channels', description: 'Pick how you want to receive alerts.' },
        { step: '3', title: 'Stay Informed', description: 'Get the right notifications at the right time.' },
      ]}
      testimonial={{
        quote: "I finally don't get overwhelmed by notifications. Talio's smart filtering shows me only what matters.",
        author: 'Deepa Krishnan',
        role: 'Team Lead, InnovateTech',
      }}
    />
  );
}
