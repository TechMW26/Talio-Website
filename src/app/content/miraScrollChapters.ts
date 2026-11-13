import type { ScrollChapter } from '@/app/components/ParticleChapters';

export const miraRequestChapters: readonly ScrollChapter[] = [
  {
    title: 'Find the work by name.',
    body: 'Ask MIRA to open the task, project, or meeting you have in mind. Give it a title and a clue that distinguishes it from similar records.',
    detail: '“Open the launch checklist in Partner Launch.”',
    shape: 'project',
  },
  {
    title: 'Give a task an owner and a deadline.',
    body: 'Name the project, assignee, and due date in the same request. If you need two tasks, describe each one so the work lands with the right person.',
    detail: '“Assign Maya the regression checklist in Launch Readiness, due Friday.”',
    shape: 'tasks',
  },
  {
    title: 'Set up a review with an agenda.',
    body: 'Include the attendees, time window, and the decision they need to make. That gives people the context to prepare for the meeting.',
    detail: '“Book a 20-minute release review tomorrow at 10 with Maya and Leo.”',
    shape: 'calendar',
  },
  {
    title: 'Put the follow-up in the right conversation.',
    body: 'Specify who should receive the message and what you want it to say. Check that the message went to the person you intended.',
    detail: '“Tell Leo the release review needs his input on the rollback plan.”',
    shape: 'chat',
  },
  {
    title: 'Leave yourself a reminder.',
    body: 'Give MIRA a time and the thing you need to follow up on. A personal reminder can sit alongside the task without changing its deadline.',
    detail: '“Remind me Thursday at 3 p.m. to check the sign-off responses.”',
    shape: 'bell',
  },
  {
    title: 'Tie the steps together.',
    body: 'If one action depends on another, make that sequence explicit. For example, the project needs to exist before the checklist can be added to it.',
    detail: '“Create Partner Launch, then add the checklist to that project.”',
    shape: 'workflow',
  },
];

export const miraReviewChapters: readonly ScrollChapter[] = [
  {
    title: 'Resolve a match before moving on.',
    body: 'When multiple people or records match a request, check the options MIRA finds. Use team or project context to identify the one you meant.',
    detail: 'Choose the right Priya before assigning the task.',
    shape: 'team',
  },
  {
    title: 'Work with the access you have.',
    body: 'MIRA uses the permissions of your Talio account. If you cannot access a project or perform an action, ask the workspace owner to review your role.',
    detail: 'A request in chat cannot grant extra permissions.',
    shape: 'shield',
  },
  {
    title: 'Read the result, step by step.',
    body: 'Open the affected record to see what changed. If the project could not be created, the task that depends on it waits for that result.',
    detail: 'Check the project and the assigned checklist separately.',
    shape: 'check',
  },
  {
    title: 'Return to a meeting with its context.',
    body: 'Ask MIRA to open a meeting you can access. Review Talio’s meeting insights where notes or a transcript are available, and check key decisions against the source.',
    detail: 'Open the release review and compare its action items with the notes.',
    shape: 'video',
  },
  {
    title: 'Review a forecast with the team.',
    body: 'Open the project overview to see whether the forecast suggests a delay. Use Risk Radar to identify overdue work, then check owners and estimates before changing the plan.',
    detail: 'A forecast is a signal to review with the team.',
    shape: 'chart',
  },
  {
    title: 'Decide when updates should reach you.',
    body: 'Where proactive updates are enabled, choose what MIRA should surface and set quiet hours. Start with signals you can act on, such as an overdue task or an upcoming meeting.',
    detail: 'Example: keep meeting reminders and quiet the rest after work.',
    shape: 'clock',
  },
];
