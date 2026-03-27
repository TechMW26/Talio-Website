import { FeatureDetailPage } from '@/app/components/FeatureDetailPage';
import { LayoutGrid, ListChecks, Users, Clock, MessageSquare, TrendingUp } from 'lucide-react';

export function ProjectsFeature() {
  return (
    <FeatureDetailPage
      badge="PROJECT MANAGEMENT"
      title="Project Management"
      titleGradient="from-purple-400 to-pink-400"
      subtitle="Kanban boards, task tracking, deadlines, and team collaboration all in one place."
      accentColor="text-pink-400"
      gradientFrom="to-pink-950/30"
      stats={[
        { value: '40%', label: 'Faster Delivery' },
        { value: '100%', label: 'Task Visibility' },
        { value: 'Real-time', label: 'Collaboration' },
        { value: 'Unlimited', label: 'Projects' },
      ]}
      features={[
        {
          icon: LayoutGrid,
          title: 'Kanban Boards',
          description: 'Visual boards with drag & drop, custom columns, and WIP limits.',
          details: ['Drag & drop', 'Custom columns', 'WIP limits'],
        },
        {
          icon: ListChecks,
          title: 'Task Management',
          description: 'Rich tasks with subtasks, checklists, file attachments, and priority levels.',
          details: ['Subtasks', 'Checklists', 'Priority levels'],
        },
        {
          icon: Users,
          title: 'Team Assignments',
          description: 'Multiple assignees with workload views and automated notifications.',
          details: ['Multiple assignees', 'Workload view', 'Notifications'],
        },
        {
          icon: Clock,
          title: 'Deadlines & Timeline',
          description: 'Due dates with Gantt charts and milestone markers for tracking.',
          details: ['Due dates', 'Gantt charts', 'Milestones'],
        },
        {
          icon: MessageSquare,
          title: 'Comments & Updates',
          description: 'Threaded comments with @mentions and full activity logging.',
          details: ['Threaded comments', '@mentions', 'Activity log'],
        },
        {
          icon: TrendingUp,
          title: 'Progress Analytics',
          description: 'Burndown charts, team velocity metrics, and status reports.',
          details: ['Burndown charts', 'Team velocity', 'Status reports'],
        },
      ]}
      steps={[
        { step: '1', title: 'Create Project', description: 'Set up your project with boards, milestones, and team members.' },
        { step: '2', title: 'Add Tasks', description: 'Break down work into tasks with priorities and deadlines.' },
        { step: '3', title: 'Track & Deliver', description: 'Monitor progress in real-time and deliver on schedule.' },
      ]}
      testimonial={{
        quote: "Our delivery timelines improved by 40% after switching to Talio's project management.",
        author: 'Alex Chen',
        role: 'Product Manager, DigitalWave',
      }}
    />
  );
}
