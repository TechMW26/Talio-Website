import {
  Activity, BellRing, CalendarClock, ClipboardList, FileSearch, ListTodo,
  Radio, Rocket, TrendingUp, UserPlus, type LucideIcon,
} from 'lucide-react';

type MiraUseCase = {
  id: string;
  title: string;
  icon: LucideIcon;
  type: 'MIRA workflow' | 'Talio insights' | 'Concept';
  prompt: string;
  response: string;
  details: readonly string[];
  context: string;
};

export const miraUseCases: readonly MiraUseCase[] = [
  {
    id: 'launch-automation',
    title: 'Launch automation',
    icon: Rocket,
    type: 'MIRA workflow',
    prompt: 'Set up Partner Launch for the first two weeks of next month. Make me the lead, add Priya, and assign her a high-priority partner checklist due on day three.',
    response: 'Partner Launch is ready. I added Priya to the project, then created the checklist in the new project.',
    details: ['Project created with dates and lead', 'High-priority task assigned to Priya'],
    context: 'MIRA uses the result of each step to carry out the next. Project and task permissions apply.',
  },
  {
    id: 'workforce-visibility',
    title: 'Workforce monitoring',
    icon: Activity,
    type: 'MIRA workflow',
    prompt: 'Open Maya’s recorded activity around 2 p.m. on Tuesday so I can review the context of the support handoff.',
    response: 'I found two retained captures within five minutes of 2 p.m. in your time zone. They’re ready to review in the activity gallery.',
    details: ['Time window applied', 'Retained captures opened'],
    context: 'Requires enabled desktop capture and permission to view the records. Captures show moments in time and need context from the team.',
  },
  {
    id: 'delivery-risk',
    title: 'Predictive delivery risk',
    icon: TrendingUp,
    type: 'Talio insights',
    prompt: 'Open Website Refresh so I can see whether we’re on track for Friday’s release.',
    response: 'I opened the project. In this example, its forecast projects completion on Monday, and Risk Radar surfaces two overdue tasks to review.',
    details: ['Projected finish: Monday', 'Review the two overdue tasks'],
    context: 'Talio’s project overview estimates completion from task progress and available effort data. The team decides how to respond to the forecast.',
  },
  {
    id: 'task-automation',
    title: 'Task automation',
    icon: ListTodo,
    type: 'MIRA workflow',
    prompt: 'Turn these agreed follow-ups into Launch Readiness tasks due Friday: assign regression testing to Maya and sign-off notes to Leo.',
    response: 'I created both tasks in Launch Readiness and set Friday as the due date. Each task has the owner you named.',
    details: ['Regression testing → Maya', 'Sign-off notes → Leo'],
    context: 'Use confirmed action items and eligible project members. MIRA can carry out multiple explicitly requested tasks.',
  },
  {
    id: 'blocker-escalation',
    title: 'Blocker escalation',
    icon: CalendarClock,
    type: 'MIRA workflow',
    prompt: 'Book an online release blocker review with Maya and Leo tomorrow from 10 to 10:20. Add rollback readiness to the agenda and tell Leo it needs his input.',
    response: 'The review is on the calendar with both attendees and the rollback item. I sent Leo the requested heads-up.',
    details: ['Review scheduled with agenda', 'Direct message sent to Leo'],
    context: 'MIRA can schedule a meeting and send a separate message when you provide the recipients and details.',
  },
  {
    id: 'proactive-briefing',
    title: 'Proactive work briefing',
    icon: Radio,
    type: 'MIRA workflow',
    prompt: 'Keep me up to date on the work that needs my attention.',
    response: 'Your launch checklist is overdue. The release review starts in 30 minutes. I’ve included links so you can go straight to each item.',
    details: ['Overdue task surfaced', 'Upcoming meeting surfaced'],
    context: 'Example of an opt-in MIRA update. Sources and delivery timing depend on your preferences, access, and quiet hours.',
  },
  {
    id: 'collaborator-onboarding',
    title: 'Collaborator onboarding',
    icon: UserPlus,
    type: 'MIRA workflow',
    prompt: 'Add Sam to Partner Launch and send a message asking them to start with the project brief.',
    response: 'Sam was added to Partner Launch. I sent the message after the project confirmed the invitation.',
    details: ['Project access updated', 'Welcome message sent'],
    context: 'Requires permission to add a project member and message the person. If the invitation fails, the dependent message can wait.',
  },
  {
    id: 'meeting-debrief',
    title: 'Meeting intelligence',
    icon: ClipboardList,
    type: 'Talio insights',
    prompt: 'Open yesterday’s Release Readiness meeting so I can review the decisions and action items.',
    response: 'I opened Release Readiness. Its saved summary lists the rollout decision and the two follow-ups recorded in the meeting.',
    details: ['Rollout decision surfaced', 'Recorded follow-ups ready for review'],
    context: 'Talio meeting insights use available notes or transcripts. Check the summary against the source before acting on it.',
  },
  {
    id: 'review-reminder',
    title: 'Follow-up automation',
    icon: BellRing,
    type: 'MIRA workflow',
    prompt: 'Create a high-priority task for me to collect the release sign-off by Friday. Then remind me Thursday at 3 p.m. to check the responses.',
    response: 'I created your sign-off task and scheduled a personal reminder for Thursday at 3 p.m. in your time zone.',
    details: ['Sign-off task created', 'Personal reminder scheduled'],
    context: 'MIRA can create a task and schedule a one-time Talio notification for the follow-up.',
  },
  {
    id: 'litigation-readiness',
    title: 'Litigation readiness',
    icon: FileSearch,
    type: 'Concept',
    prompt: 'Organize these supplied approval records into a timeline for counsel. Mark missing dates and link each entry to its source.',
    response: 'The draft timeline links each entry to its source. Two approval dates are missing from the supplied records and need verification.',
    details: ['Draft timeline with source references', 'Missing dates flagged for review'],
    context: 'Illustrative concept for counsel review. A lawyer verifies the records and determines the legal implications and next steps.',
  },
];
