import { FeatureDetailPage } from '@/app/components/FeatureDetailPage';
import { Hash, MessageSquare, Paperclip, AtSign, Search, Plug } from 'lucide-react';

export function TeamChatFeature() {
  return (
    <FeatureDetailPage
      badge="TEAM CHAT"
      title="Team Chat"
      titleGradient="from-sky-400 to-blue-400"
      subtitle="Real-time messaging with channels, direct messages, file sharing, and deep Talio integration."
      accentColor="text-sky-400"
      gradientFrom="to-sky-950/30"
      stats={[
        { value: '100%', label: 'Real-time Sync' },
        { value: '50GB', label: 'File Storage' },
        { value: 'Unlimited', label: 'Channels' },
        { value: 'E2E', label: 'Encryption' },
      ]}
      features={[
        {
          icon: Hash,
          title: 'Channels',
          description: 'Team and project channels with private groups for focused collaboration.',
          details: ['Team channels', 'Project channels', 'Private groups'],
        },
        {
          icon: MessageSquare,
          title: 'Direct Messages',
          description: '1-on-1 and group direct messages with read receipts.',
          details: ['1-on-1', 'Group DMs', 'Read receipts'],
        },
        {
          icon: Paperclip,
          title: 'File Sharing',
          description: 'Drag & drop file sharing with in-chat preview and organization.',
          details: ['Drag & drop', 'In-chat preview', 'Organization'],
        },
        {
          icon: AtSign,
          title: 'Mentions & Reactions',
          description: '@mentions for people, emoji reactions, and threaded conversations.',
          details: ['@mentions', 'Emoji reactions', 'Threading'],
        },
        {
          icon: Search,
          title: 'Search Everything',
          description: 'Full-text search with filters by date, user, and file type.',
          details: ['Full-text search', 'Date/user filters', 'File search'],
        },
        {
          icon: Plug,
          title: 'Talio Integration',
          description: 'Leave updates, task notifications, and quick actions right in chat.',
          details: ['Leave updates', 'Task notifications', 'Quick actions'],
        },
      ]}
      steps={[
        { step: '1', title: 'Create Channels', description: 'Set up channels for teams, projects, or topics.' },
        { step: '2', title: 'Start Conversations', description: 'Send messages, share files, and collaborate.' },
        { step: '3', title: 'Stay Connected', description: 'Keep your team in sync with real-time updates.' },
      ]}
      testimonial={{
        quote: "Having chat integrated with our HR tools means we don't need a separate Slack subscription.",
        author: 'Rahul Verma',
        role: 'Operations Director, GrowthWorks',
      }}
    />
  );
}
