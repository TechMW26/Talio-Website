import type { ScrollChapter } from '@/app/components/ParticleChapters';

export const workspaceScrollChapters: readonly ScrollChapter[] = [
  {
    title: 'Give the launch a home.',
    body: 'Open a project with a clear lead, the people doing the work, and the dates everyone is working toward.',
    detail: 'A shared project gives the team one place to look for its current plan.',
    shape: 'project',
  },
  {
    title: 'Make the next handoff explicit.',
    body: 'Create a task for the first draft, set a due date, and assign the teammate who will carry it forward.',
    detail: 'Task ownership stays with the record when the conversation moves on.',
    shape: 'tasks',
  },
  {
    title: 'Send the brief with the question.',
    body: 'Attach the brief to a team conversation and call out the part that needs review. Mention the colleague who can answer.',
    detail: 'Use a direct conversation for a private check or a group for shared context.',
    shape: 'chat',
  },
  {
    title: 'Sketch the part that’s still unclear.',
    body: 'Use TalioBoard to arrange notes, connectors and diagrams when the team needs to see how an idea fits together.',
    detail: 'Check board access before asking colleagues to add their ideas.',
    shape: 'board',
  },
  {
    title: 'Make the meeting earn its time.',
    body: 'Set an agenda, invite the people needed for the decision, and review the available notes or summary afterward.',
    detail: 'MIRA meeting summaries depend on the notes or transcript available.',
    shape: 'video',
  },
  {
    title: 'Check what could slip.',
    body: 'Review overdue work and blockers in the project overview before committing to the next date.',
    detail: 'Talio’s completion estimate uses recorded progress and available effort data.',
    shape: 'chart',
  },
  {
    title: 'Keep the working day accurate.',
    body: 'Check the day’s attendance entries and submit a correction when a check-in or check-out is missing.',
    detail: 'The correction follows the company’s configured review process.',
    shape: 'clock',
  },
  {
    title: 'Plan around approved time off.',
    body: 'An employee checks their leave balance and sends a request with dates. The approver reviews it in the same workspace.',
    detail: 'Team availability should be based on the recorded decision.',
    shape: 'calendar',
  },
  {
    title: 'Move people through the next step.',
    body: 'Use the employee record to find onboarding, probation or offboarding work and see what is still open.',
    detail: 'Company settings and roles determine which lifecycle actions are available.',
    shape: 'team',
  },
  {
    title: 'Give the team the right document.',
    body: 'Keep a policy or working reference in the document area and make it available to the people who need it.',
    detail: 'Document visibility follows the access set in the workspace.',
    shape: 'file',
  },
  {
    title: 'Send decisions to the right reviewer.',
    body: 'Submit a project completion request when the team is ready to close the launch. Check its status before treating the project as finished.',
    detail: 'The project head can review the completion request in Talio.',
    shape: 'workflow',
  },
  {
    title: 'Prepare the payroll period.',
    body: 'Review the period and employee inputs before generating payroll records. Employees can access the payslips made available to them.',
    detail: 'The organisation reviews and runs its own bank payments.',
    shape: 'wallet',
  },
  {
    title: 'Return to the update that matters.',
    body: 'Open the notification tied to a task or request and go back to its record when it needs a response.',
    detail: 'Notification preferences affect which updates reach you and where.',
    shape: 'bell',
  },
  {
    title: 'Put the decision to work.',
    body: 'Ask MIRA to create the checklist the team just agreed on and set a reminder to follow up.',
    detail: 'Talio applies your access permissions to each supported action.',
    shape: 'spark',
  },
];
