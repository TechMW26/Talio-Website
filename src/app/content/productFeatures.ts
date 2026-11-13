import { Clock, Wallet, CalendarDays, LayoutGrid, Target, GitBranch, Sparkles, MessageSquare, Bell, Activity, Video, PenTool, Users, UserPlus, Briefcase, FileText } from 'lucide-react';

export const categories = ['All features', 'Daily work', 'People & HR', 'MIRA & insights'] as const;
export type ProductStoryChapter = {
  label: string;
  title: string;
  description: string;
  signals: readonly (readonly [label: string, value: string])[];
};

export type ProductFeature = {
  slug: string; name: string; category: typeof categories[number]; icon: typeof Clock;
  headline: string; description: string; note: string;
  story: readonly ProductStoryChapter[];
};
export const productFeatures: ProductFeature[] = [
  {
    slug: 'projects', name: 'Projects & tasks', category: 'Daily work', icon: LayoutGrid,
    headline: 'Make the next handoff clear.',
    description: 'Assign tasks, share decisions and see what could delay the project.',
    note: 'Project visibility and approval actions depend on your role and membership.',
    story: [
      {
        label: 'Set direction',
        title: 'Name the project and its lead.',
        description: 'Open a project for the website launch and set its dates, lead and members. The lead can see who is responsible before anyone starts assigning work.',
        signals: [['Project', 'Website launch'], ['Lead', 'Maya · Design']],
      },
      {
        label: 'Assign work',
        title: 'Give the draft an owner and a date.',
        description: 'Give the first draft an owner, a due date and a priority. When the brief changes, use the task conversation for decisions about the draft and project notes for context the whole team needs.',
        signals: [['Task', 'Review the first draft'], ['Due', 'Thursday']],
      },
      {
        label: 'Review progress',
        title: 'Spot what could delay the launch.',
        description: 'Review overdue work and blockers in the project overview. Its forecast draws on recorded progress and available estimates. When the team requests completion, the project head can review that request in Talio.',
        signals: [['Review', 'Overdue tasks'], ['Decision', 'Project completion']],
      },
    ],
  },
  {
    slug: 'mira', name: 'MIRA Super Intelligence', category: 'MIRA & insights', icon: Sparkles,
    headline: 'Turn one request into progress.',
    description: 'Ask MIRA to find a project, assign a task or bring the right people into a review.',
    note: 'MIRA uses your access permissions. Review MIRA’s output; voice, screen tools and image features depend on device support, permissions and provider availability.',
    story: [
      {
        label: 'Start anywhere',
        title: 'Ask for the outcome.',
        description: 'Ask MIRA to find a project, schedule a review or turn agreed follow-ups into tasks. Include the names, dates and owners you already know so it can ask only for what is missing.',
        signals: [['Request', 'Schedule a release review'], ['Context', 'Project, attendees and time']],
      },
      {
        label: 'Ground it',
        title: 'Pick the right project or teammate.',
        description: 'MIRA can match a request to the projects and colleagues your account can access. When a name has multiple matches, you can choose the intended record before it continues.',
        signals: [['Workspace', 'Records you can access'], ['Match', 'Release Readiness']],
      },
      {
        label: 'Verify it',
        title: 'Check what changed in Talio.',
        description: 'For supported multi-step work, MIRA uses the result of one step to inform the next. Check the reported outcome and open the meeting, project or task in Talio to confirm the details.',
        signals: [['First step', 'Create the project'], ['Next step', 'Add its checklist task']],
      },
    ],
  },
  {
    slug: 'productivity', name: 'Productivity insights', category: 'MIRA & insights', icon: Activity,
    headline: 'See the context behind a workday.',
    description: 'Review recorded activity and desktop captures for a specific day, then check MIRA’s observations against the source.',
    note: 'Desktop capture requires permissions and company configuration. Activity and MIRA summaries are context for a conversation, not proof of the quality of someone’s work.',
    story: [
      {
        label: 'Pick a day',
        title: 'Pick a day to review.',
        description: 'If you need context about a support handoff, select the date rather than comparing unrelated days. Review your activity, or choose a team member whose data your role can access.',
        signals: [['Date', 'Tuesday'], ['Question', 'What happened at handoff?']],
      },
      {
        label: 'Check captures',
        title: 'Open the original captures.',
        description: 'Open the available desktop captures for the period. A capture shows what was on screen at one moment. Use the gallery to verify timing and ask the person about any gaps.',
        signals: [['Source', 'Retained desktop captures'], ['Review', 'Handoff window']],
      },
      {
        label: 'Review context',
        title: 'Bring the context to the conversation.',
        description: 'Request a MIRA summary when available and compare its observations with the original captures. Use that evidence to ask better questions about the work.',
        signals: [['First pass', 'MIRA observations'], ['Follow-up', 'Verify with original captures']],
      },
    ],
  },
  {
    slug: 'attendance', name: 'Attendance', category: 'People & HR', icon: Clock,
    headline: 'Know what was logged.',
    description: 'Check in, check out and request a correction when an entry is missing.',
    note: 'Location permissions and company geofence rules apply. Machine attendance requires a supported device and a configured integration.',
    story: [
      {
        label: 'Clock in',
        title: 'Clock in at your work location.',
        description: 'Check in from Talio. If your company requires an approved location, allow location access and check in within the configured office boundary.',
        signals: [['Event', 'Morning check-in'], ['Rule', 'Office geofence']],
      },
      {
        label: 'Check history',
        title: 'Check the start and end times.',
        description: 'After checking out, open your attendance history to confirm that the start and end of the shift were recorded. Team views are available to roles that can access them.',
        signals: [['Record', 'Tuesday attendance'], ['Entries', 'Check-in and check-out']],
      },
      {
        label: 'Fix omissions',
        title: 'Ask a reviewer to fix the entry.',
        description: 'If you forgot to check out, submit a regularisation request with the correct time and reason. Follow its status while an authorised reviewer checks the correction.',
        signals: [['Request', 'Missing check-out'], ['Status', 'Pending review']],
      },
    ],
  },
  {
    slug: 'leaves', name: 'Leave & availability', category: 'People & HR', icon: CalendarDays,
    headline: 'Know where your time off stands.',
    description: 'Check your balance, request dates and follow the decision in Talio.',
    note: 'Leave types, allocations and approval rules are set by your company.',
    story: [
      {
        label: 'Check balance',
        title: 'Check your leave balance first.',
        description: 'Open your leave balance and check the allocation for the type you plan to use. Your company sets the leave types and the rules that apply to them.',
        signals: [['Leave type', 'Annual leave'], ['Record', 'Current allocation']],
      },
      {
        label: 'Request dates',
        title: 'Send the dates and the reason.',
        description: 'Choose your leave type and dates, then add a reason. Use the separate work-from-home or early-leave request when that is what you need.',
        signals: [['Dates', 'Thursday and Friday'], ['Request', 'Annual leave']],
      },
      {
        label: 'Track decision',
        title: 'Confirm the decision.',
        description: 'Open your requests to see whether the approver has acted. The status stays with the dates and request details, so you can check the decision before making plans.',
        signals: [['Submitted', 'Thursday and Friday'], ['Status', 'Approved']],
      },
    ],
  },
  {
    slug: 'payroll', name: 'Payroll & payslips', category: 'People & HR', icon: Wallet,
    headline: 'Close the month with a clear payslip.',
    description: 'Prepare payroll from salary and attendance records, review deductions and give employees access to their payslips.',
    note: 'Payroll depends on your salary setup and applicable rules. Talio records and calculations do not replace payroll review, statutory filing or bank disbursement.',
    story: [
      {
        label: 'Set inputs',
        title: 'Check salary and attendance.',
        description: 'Check employee salary details and the attendance inputs for the period. Resolve exceptions before preparing payroll, especially if a recent change affects earnings or deductions.',
        signals: [['Period', 'October'], ['Inputs', 'Salary and attendance']],
      },
      {
        label: 'Review records',
        title: 'Review earnings and deductions.',
        description: 'Choose a month and year to prepare payroll, including bulk processing where available. Review the resulting earnings, deductions and record status before completing your payroll process.',
        signals: [['Period', 'October'], ['Review', 'Earnings and deductions']],
      },
      {
        label: 'Access payslips',
        title: 'Give employees access to payslips.',
        description: 'Employees can access payslips made available to them in Talio. A payroll record gives staff a reference for that period while payment and filing follow your organisation’s separate process.',
        signals: [['Record', 'October payslip'], ['Visibility', 'Employee access']],
      },
    ],
  },
  {
    slug: 'goals', name: 'Goals & performance', category: 'People & HR', icon: Target,
    headline: 'Give the next review a starting point.',
    description: 'Set a goal with a due date and keep its progress current for the next check-in.',
    note: 'Goal management, ratings and performance views are controlled by role and company settings.',
    story: [
      {
        label: 'Set outcome',
        title: 'Give the goal a due date.',
        description: 'Give the goal a clear outcome and time frame. For example, ask the operations team to produce a checklist for new hires before the next joining date.',
        signals: [['Goal', 'Improve new-hire onboarding'], ['Target', 'Next joining date']],
      },
      {
        label: 'Update progress',
        title: 'Update progress before the check-in.',
        description: 'Update the goal as work moves. Before a check-in, review the recorded progress and status so you can spend the meeting discussing what needs help.',
        signals: [['Goal', 'Onboarding checklist'], ['Status', 'In progress']],
      },
      {
        label: 'Review together',
        title: 'Bring the work into the review.',
        description: 'Bring the goal record into a performance discussion alongside the ratings and reports your role can view. Use task or attendance context where it helps explain a result.',
        signals: [['Review', 'Current period'], ['Context', 'Goal progress and task history']],
      },
    ],
  },
  {
    slug: 'workflows', name: 'Requests & approvals', category: 'People & HR', icon: GitBranch,
    headline: 'Send requests to the right reviewer.',
    description: 'Track leave, attendance corrections, project completion and employee lifecycle decisions in the workflow that owns them.',
    note: 'These are Talio’s supported approval flows. Available steps depend on the module, your role and your company’s setup.',
    story: [
      {
        label: 'Submit details',
        title: 'Keep the request with its record.',
        description: 'A missed check-out belongs in attendance regularisation. Give the reviewer the missing time and reason there, so the request stays tied to the attendance record.',
        signals: [['Request', 'Attendance correction'], ['Details', 'Time and reason']],
      },
      {
        label: 'Route review',
        title: 'Find the right reviewer.',
        description: 'Talio keeps approvals in their own context. Leave goes through the configured leave process, while a project completion request can go to the project head.',
        signals: [['Example', 'Project completion'], ['Reviewer', 'Project head']],
      },
      {
        label: 'Follow through',
        title: 'Return to the decision.',
        description: 'Return to the original request to check its status and recorded actions. For lifecycle work, use the employee record to see which onboarding, probation or offboarding steps still need attention.',
        signals: [['Record', 'Probation review'], ['Next step', 'Authorised decision']],
      },
    ],
  },
  {
    slug: 'team-chat', name: 'Team chat', category: 'Daily work', icon: MessageSquare,
    headline: 'Get the answer. Stay on task.',
    description: 'Send the brief in chat and keep the reply within reach while you work.',
    note: 'Chat access follows company membership and feature settings. Delivery and presence depend on connectivity.',
    story: [
      {
        label: 'Start a thread',
        title: 'Choose a direct message or a group.',
        description: 'Start a private chat with a teammate for a quick check, or bring the people working on a brief into a group. Use a separate group for a different audience.',
        signals: [['Conversation', 'Design team'], ['Topic', 'Updated launch brief']],
      },
      {
        label: 'Share context',
        title: 'Send the brief with your question.',
        description: 'Attach the brief and say which part needs feedback. In the group, mention the teammate who owns the decision so others can follow the same thread.',
        signals: [['Attachment', 'Launch brief'], ['Ask', 'Check the handover section']],
      },
      {
        label: 'Keep working',
        title: 'Keep the reply in view.',
        description: 'Keep a floating conversation open on desktop while you work elsewhere in Talio. On mobile, return to the discussion from the dedicated chat view.',
        signals: [['Desktop', 'Floating conversation'], ['Mobile', 'Chat view']],
      },
    ],
  },
  {
    slug: 'meetings', name: 'Meetings', category: 'Daily work', icon: Video,
    headline: 'Make the meeting lead somewhere.',
    description: 'Set an agenda, bring in the right people and check decisions against the notes after the call.',
    note: 'Online calls need camera or microphone permissions as appropriate. Summaries need available transcript or notes and a configured model provider; review them for accuracy.',
    story: [
      {
        label: 'Make an agenda',
        title: 'Put the decision on the agenda.',
        description: 'Schedule an online or offline meeting, invite the people involved and include the decision on the agenda. For an offline meeting, add a location so attendees know where to go.',
        signals: [['Meeting', 'Release review'], ['Agenda', 'Agree on the rollout plan']],
      },
      {
        label: 'Run the meeting',
        title: 'Join and share the material.',
        description: 'Join the Talio meeting room for an online session. Use supported audio, video and screen sharing to walk through the material, with the required device permissions.',
        signals: [['Format', 'Online'], ['Share', 'Release checklist']],
      },
      {
        label: 'Review decisions',
        title: 'Check decisions against the notes.',
        description: 'Generate or refresh the MIRA summary when notes or a transcript are available. Check the recorded decisions and action items against the source before carrying them into the project.',
        signals: [['Input', 'Notes or transcript'], ['Review', 'Decisions and follow-ups']],
      },
    ],
  },
  {
    slug: 'whiteboard', name: 'TalioBoard', category: 'Daily work', icon: PenTool,
    headline: 'Make the idea visible.',
    description: 'Sketch a plan, map the dependencies and share the board with the people who need to weigh in.',
    note: 'Board access and collaboration depend on membership, connectivity and enabled features.',
    story: [
      {
        label: 'Start sketching',
        title: 'Put the question on the board.',
        description: 'Create a board for the planning session and place the question at the centre. Use text and shapes to lay out options so the team can see what is being compared.',
        signals: [['Board', 'Release planning'], ['Question', 'How should we roll out?']],
      },
      {
        label: 'Connect ideas',
        title: 'Map the dependencies.',
        description: 'Arrange related ideas together and use connections to trace the sequence. Open MIRA’s board sidebar when you want help developing an outline you can edit.',
        signals: [['Diagram', 'Rollout sequence'], ['Draft', 'Editable outline']],
      },
      {
        label: 'Share the board',
        title: 'Share for viewing or editing.',
        description: 'Share the board with a teammate and choose whether they can view or edit it. Keep the board available for the next planning session, with the thinking still visible.',
        signals: [['Reviewer', 'Release lead'], ['Access', 'View only']],
      },
    ],
  },
  {
    slug: 'people', name: 'People & lifecycle', category: 'People & HR', icon: Users,
    headline: 'Know what each employee needs next.',
    description: 'Manage employee records, track onboarding and probation, and see what is still open during offboarding.',
    note: 'Lifecycle steps are configured by company and role. Some HR modules need additional setup before they can be used.',
    story: [
      {
        label: 'Set up profile',
        title: 'Add the person and their manager.',
        description: 'Create the employee profile with department, designation and reporting manager. The directory gives authorised teammates one place to check those relationships.',
        signals: [['Department', 'Operations'], ['Reports to', 'Operations lead']],
      },
      {
        label: 'Track milestones',
        title: 'Track onboarding and probation.',
        description: 'Use the onboarding checklist for items such as equipment and access. If probation applies, track its review date and record the authorised decision.',
        signals: [['Joining task', 'Issue equipment'], ['Milestone', 'Probation review']],
      },
      {
        label: 'Plan handover',
        title: 'Check equipment off the handover.',
        description: 'During offboarding, track clearance and asset returns alongside other handover steps. HR can check the lifecycle record for anything that is still open.',
        signals: [['Checklist', 'Offboarding'], ['Clearance', 'Return assigned laptop']],
      },
    ],
  },
  {
    slug: 'recruitment', name: 'Recruitment', category: 'People & HR', icon: UserPlus,
    headline: 'Keep the next hiring step in sight.',
    description: 'Track candidates from an open role through interviews and into employee setup.',
    note: 'Recruitment permissions and enabled modules apply. External recruiting integrations require separate configuration.',
    story: [
      {
        label: 'Open the role',
        title: 'Open the role with clear requirements.',
        description: 'Add the job record with its department and employment type. The jobs view can be filtered by those details and status, which helps the team see what is still open.',
        signals: [['Role', 'Operations coordinator'], ['Employment type', 'Full-time']],
      },
      {
        label: 'Coordinate interviews',
        title: 'See who is ready for an interview.',
        description: 'Keep the candidate’s record attached to the hiring process and schedule interviews in Talio. Use the stage and interview schedule to see what comes next.',
        signals: [['Stage', 'Interview'], ['Next step', 'Interview schedule']],
      },
      {
        label: 'Prepare joining',
        title: 'Hand the hire over to onboarding.',
        description: 'Convert the selected candidate into an employee record when your team is ready. The people workflow then gives HR a place to manage joining and onboarding.',
        signals: [['Hiring stage', 'Selected'], ['Handoff', 'Employee setup']],
      },
    ],
  },
  {
    slug: 'operations', name: 'Assets & helpdesk', category: 'People & HR', icon: Briefcase,
    headline: 'Know who has the laptop.',
    description: 'Track equipment assignments, support tickets and returns in Talio.',
    note: 'Asset management and helpdesk access depend on your company’s enabled modules and your role.',
    story: [
      {
        label: 'Register equipment',
        title: 'Match the device to its owner.',
        description: 'Add equipment to the asset register and record its assignment. When you already have a register elsewhere, import supported records rather than typing them one by one.',
        signals: [['Item', 'Work laptop'], ['Assignment', 'Alex · Operations']],
      },
      {
        label: 'Track support',
        title: 'Put the issue in a support ticket.',
        description: 'Open a helpdesk ticket for the faulty device and describe what happened. Add comments as support checks the issue and the ticket moves toward resolution.',
        signals: [['Ticket', 'Laptop charging issue'], ['Status', 'Open']],
      },
      {
        label: 'Record returns',
        title: 'Record the return.',
        description: 'Use the asset clearance step when someone leaves. Checking the return against the assignment helps HR and the equipment owner follow the same handover.',
        signals: [['Asset', 'Assigned laptop'], ['Clearance', 'Return for review']],
      },
    ],
  },
  {
    slug: 'documents', name: 'Documents & policies', category: 'People & HR', icon: FileText,
    headline: 'Find the file. Get back to work.',
    description: 'Find shared policies and keep personal employee documents in their own workspace view.',
    note: 'Document visibility, upload permissions and available policies depend on company configuration.',
    story: [
      {
        label: 'File the record',
        title: 'File the record in the right scope.',
        description: 'Upload a document with a clear name and category. Talio distinguishes personal and company documents, so use the scope appropriate to the record and your access.',
        signals: [['File', 'Joining paperwork'], ['Category', 'Employment']],
      },
      {
        label: 'Share guidance',
        title: 'Find the policy people need.',
        description: 'Use the policies area when someone asks which rule applies. Company documents give employees a place to find shared material such as a handbook alongside the relevant policies.',
        signals: [['Policy', 'Leave policy'], ['Shared record', 'Employee handbook']],
      },
      {
        label: 'Return later',
        title: 'Return to the supporting record.',
        description: 'When an authorised reviewer needs a supporting document, return to its Talio record. Access depends on the document’s visibility and the reviewer’s role.',
        signals: [['Supporting file', 'Joining document'], ['Access', 'Authorised reviewer']],
      },
    ],
  },
  {
    slug: 'notifications', name: 'Notifications', category: 'Daily work', icon: Bell,
    headline: 'Go from alert to action.',
    description: 'Open a task or approval request directly from its update, or ask MIRA to remind you later.',
    note: 'Push delivery needs a supported device and notification permission. Reminder timing depends on processing and connectivity.',
    story: [
      {
        label: 'Set preferences',
        title: 'Set your alert preferences.',
        description: 'Review notification preferences in Talio. If you want device alerts, enable them on a supported device and allow notification permission.',
        signals: [['Setting', 'Work updates'], ['Device alerts', 'Permission required']],
      },
      {
        label: 'Open the update',
        title: 'Open the related task or request.',
        description: 'Open an update about an assigned task or a request that needs review. Follow its link into the relevant work, where the available actions depend on your role.',
        signals: [['Update', 'Leave request'], ['Destination', 'Request review']],
      },
      {
        label: 'Plan follow-up',
        title: 'Tell MIRA when to remind you.',
        description: 'Give MIRA a specific time and task, such as checking the draft tomorrow morning. The reminder is scheduled for you in Talio and delivery depends on processing and connectivity.',
        signals: [['Reminder', 'Check the draft'], ['Time', 'Tomorrow at 9 a.m.']],
      },
    ],
  },
];
export function getProductFeature(slug: string) { return productFeatures.find(feature => feature.slug === slug); }

export function featureHref(slug: string) {
  return slug === 'mira' ? '/mira' : `/features/${slug}`;
}
