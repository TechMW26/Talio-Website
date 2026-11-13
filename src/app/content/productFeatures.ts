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
  eyebrow: string; headline: string; description: string; note: string;
  capabilities: [string, string][]; flow: [string, string][];
  story: readonly ProductStoryChapter[];
  preview: 'board' | 'conversation' | 'records'; rows: [string, string, string][];
};
export const productFeatures: ProductFeature[] = [
  {
    slug: 'projects', name: 'Projects & tasks', category: 'Daily work', icon: LayoutGrid,
    eyebrow: 'A place for the work', headline: 'Know what’s moving.\nAnd what needs a hand.',
    description: 'Give each project a team, a timeline and a clear next step. Keep tasks, notes and updates close to the work they belong to.',
    note: 'Project visibility and approval actions depend on your role and membership.',
    capabilities: [['Make ownership clear', 'Assign project heads and members, give tasks a priority, and set due dates.'], ['Keep the context', 'Use project notes, task conversations and activity history to explain what changed.'], ['Follow work through review', 'Track task status and project completion approvals without losing the original request.']],
    flow: [['Plan it', 'Create a project and invite the people doing the work.'], ['Work on it', 'Break it into tasks with owners and dates.'], ['Review it', 'Check progress and follow up on pending approvals.']],
    preview: 'board', rows: [['Outline the launch', 'Planning', 'Brief ready'], ['Review the first draft', 'In progress', 'Team review'], ['Share the final assets', 'Complete', 'Approved']],
    story: [
      {
        label: 'Set direction',
        title: 'Give the work a home before it starts.',
        description: 'Open a project for the website launch and set its dates, lead and members. The lead can see who is responsible before anyone starts assigning work.',
        signals: [['Project', 'Website launch'], ['Lead', 'Maya · Design']],
      },
      {
        label: 'Assign work',
        title: 'Put the handoff on the task.',
        description: 'Give the first draft an owner, a due date and a priority. When the brief changes, use the task conversation for decisions about the draft and project notes for context the whole team needs.',
        signals: [['Task', 'Review the first draft'], ['Due', 'Thursday']],
      },
      {
        label: 'Review progress',
        title: 'See what could move the launch date.',
        description: 'Review overdue work and blockers in the project overview. Its forecast draws on recorded progress and available estimates. When the team requests completion, the project head can review that request in Talio.',
        signals: [['Review', 'Overdue tasks'], ['Decision', 'Project completion']],
      },
    ],
  },
  {
    slug: 'mira', name: 'MIRA Super Intelligence', category: 'MIRA & insights', icon: Sparkles,
    eyebrow: 'Ask. Find. Get something done.', headline: 'A little less searching.\nA little more doing.',
    description: 'Talk or type to MIRA inside Talio. Find a project, create a task, arrange a meeting or get help making sense of your work.',
    note: 'MIRA uses your access permissions. Review MIRA’s output; voice, screen tools and image features depend on device support, permissions and provider availability.',
    capabilities: [['Turn a request into an action', 'Create tasks, projects and meetings, assign work, and send a message when you ask.'], ['Stay in the conversation', 'Use voice, a compact view, quick notes and personal reminders as you move through Talio.'], ['Bring in context', 'Ask about accessible work, attach supported files, or request help navigating the current app view.']],
    flow: [['Ask naturally', 'Describe what you need in text or voice.'], ['Fill in the gaps', 'MIRA asks for missing details or helps resolve a name.'], ['Check the outcome', 'See the result of the action and open the related work.']],
    preview: 'conversation', rows: [['You', 'Find the launch project.', 'Request'], ['MIRA', 'Which launch project do you mean?', 'Clarify'], ['You', 'The website launch. Open its tasks.', 'Continue']],
    story: [
      {
        label: 'Start anywhere',
        title: 'Describe the outcome in your own words.',
        description: 'Ask MIRA to find a project, schedule a review or turn agreed follow-ups into tasks. Include the names, dates and owners you already know so it can ask only for what is missing.',
        signals: [['Request', 'Schedule a release review'], ['Context', 'Project, attendees and time']],
      },
      {
        label: 'Ground it',
        title: 'Resolve the names before taking action.',
        description: 'MIRA can match a request to the projects and colleagues your account can access. When a name has multiple matches, you can choose the intended record before it continues.',
        signals: [['Workspace', 'Records you can access'], ['Match', 'Release Readiness']],
      },
      {
        label: 'Verify it',
        title: 'Open what MIRA actually created.',
        description: 'For supported multi-step work, MIRA uses the result of one step to inform the next. Check the reported outcome and open the meeting, project or task in Talio to confirm the details.',
        signals: [['First step', 'Create the project'], ['Next step', 'Add its checklist task']],
      },
    ],
  },
  {
    slug: 'productivity', name: 'Productivity insights', category: 'MIRA & insights', icon: Activity,
    eyebrow: 'Context for your working day', headline: 'Review the day.\nUnderstand the work.',
    description: 'Bring activity, captured screens and MIRA summaries into a daily view. Explore a date or an accessible team member when you need more context.',
    note: 'Desktop capture requires permissions and company configuration. Activity and MIRA summaries are context for a conversation, not proof of the quality of someone’s work.',
    capabilities: [['Look at a specific day', 'Choose a date and review the activity and captures available for it.'], ['Inspect the evidence', 'Open captured screens and move through a gallery rather than relying only on a summary.'], ['Use MIRA for a first pass', 'Request analysis of available captures and review the result alongside the source material.']],
    flow: [['Set up capture', 'Install the desktop app and follow your company’s permission setup.'], ['Choose a view', 'Look at your day or the team data your role can access.'], ['Review in context', 'Use the underlying captures to check MIRA’s observations.']],
    preview: 'records', rows: [['Daily activity', 'Selected day', 'Review'], ['Screen captures', 'Available captures', 'Open gallery'], ['MIRA summary', 'Review with context', 'Insights']],
    story: [
      {
        label: 'Pick a day',
        title: 'Start with one day and one question.',
        description: 'If you need context about a support handoff, select the date rather than comparing unrelated days. Review your activity, or choose a team member whose data your role can access.',
        signals: [['Date', 'Tuesday'], ['Question', 'What happened at handoff?']],
      },
      {
        label: 'Check captures',
        title: 'Look at the records behind the summary.',
        description: 'Open the available desktop captures for the period. A capture shows what was on screen at one moment. Use the gallery to verify timing and ask the person about any gaps.',
        signals: [['Source', 'Retained desktop captures'], ['Review', 'Handoff window']],
      },
      {
        label: 'Review context',
        title: 'Use the summary to guide a conversation.',
        description: 'Request a MIRA summary when available and compare its observations with the original captures. Use that evidence to ask better questions about the work.',
        signals: [['First pass', 'MIRA observations'], ['Follow-up', 'Verify with original captures']],
      },
    ],
  },
  {
    slug: 'attendance', name: 'Attendance', category: 'People & HR', icon: Clock,
    eyebrow: 'Start with a clear record', headline: 'Check in. Get on\nwith your day.',
    description: 'Record check-ins and check-outs, review attendance, and request corrections when something is missing. Location rules help match attendance to your workplace.',
    note: 'Location permissions and company geofence rules apply. Machine attendance requires a supported device and a configured integration.',
    capabilities: [['Check in with context', 'Use location-aware attendance and configured office boundaries.'], ['Correct a missed entry', 'Submit regularisation requests for a manager to review.'], ['See the record', 'Review attendance reports, check-in history and team attendance from the views available to your role.']],
    flow: [['Check in', 'Allow location access where your company requires it.'], ['Check your record', 'See your working day and check-out status.'], ['Resolve exceptions', 'Request a correction and follow its approval.']],
    preview: 'records', rows: [['Morning check-in', 'Office location', 'Recorded'], ['Missing check-out', 'Correction requested', 'Pending'], ['Attendance report', 'Selected month', 'Review']],
    story: [
      {
        label: 'Clock in',
        title: 'Record the start of the day.',
        description: 'Check in from Talio. If your company requires an approved location, allow location access and check in within the configured office boundary.',
        signals: [['Event', 'Morning check-in'], ['Rule', 'Office geofence']],
      },
      {
        label: 'Check history',
        title: 'Make sure the day has both entries.',
        description: 'After checking out, open your attendance history to confirm that the start and end of the shift were recorded. Team views are available to roles that can access them.',
        signals: [['Record', 'Tuesday attendance'], ['Entries', 'Check-in and check-out']],
      },
      {
        label: 'Fix omissions',
        title: 'Send the missing entry for review.',
        description: 'If you forgot to check out, submit a regularisation request with the correct time and reason. Follow its status while an authorised reviewer checks the correction.',
        signals: [['Request', 'Missing check-out'], ['Status', 'Pending review']],
      },
    ],
  },
  {
    slug: 'leaves', name: 'Leave & availability', category: 'People & HR', icon: CalendarDays,
    eyebrow: 'Make room for life', headline: 'Time off,\nwithout the back-and-forth.',
    description: 'Request leave, check your balance and follow approvals in one place. Keep work-from-home and early-leave requests alongside your attendance routines.',
    note: 'Leave types, allocations and approval rules are set by your company.',
    capabilities: [['Know what’s available', 'See leave balances and company allocations before making a request.'], ['Make a clear request', 'Choose dates, a leave type and the information your approver needs.'], ['Keep decisions visible', 'Review requests and track approval status, including WFH and early leave.']],
    flow: [['Check your balance', 'Review the leave available to you.'], ['Send a request', 'Add dates and a reason.'], ['Follow the decision', 'See whether it is pending, approved or rejected.']],
    preview: 'records', rows: [['Annual leave', 'Dates selected', 'Approved'], ['Work from home', 'Awaiting review', 'Pending'], ['Leave balance', 'Current allocation', 'View']],
    story: [
      {
        label: 'Check balance',
        title: 'See how much leave you have before asking.',
        description: 'Open your leave balance and check the allocation for the type you plan to use. Your company sets the leave types and the rules that apply to them.',
        signals: [['Leave type', 'Annual leave'], ['Record', 'Current allocation']],
      },
      {
        label: 'Request dates',
        title: 'Give the approver the dates and the reason.',
        description: 'Choose your leave type and dates, then add a reason. Use the separate work-from-home or early-leave request when that is what you need.',
        signals: [['Dates', 'Thursday and Friday'], ['Request', 'Annual leave']],
      },
      {
        label: 'Track decision',
        title: 'See when the dates are approved.',
        description: 'Open your requests to see whether the approver has acted. The status stays with the dates and request details, so you can check the decision before making plans.',
        signals: [['Submitted', 'Thursday and Friday'], ['Status', 'Approved']],
      },
    ],
  },
  {
    slug: 'payroll', name: 'Payroll & payslips', category: 'People & HR', icon: Wallet,
    eyebrow: 'A clearer monthly routine', headline: 'From payroll records\nto a payslip you can find.',
    description: 'Prepare payroll with employee salary details, attendance inputs and deductions. Review the records and make payslips available to employees.',
    note: 'Payroll depends on your salary setup and applicable rules. Talio records and calculations do not replace payroll review, statutory filing or bank disbursement.',
    capabilities: [['Prepare the period', 'Generate payroll records for a selected month and year, including bulk processing.'], ['Review the details', 'Check earnings, deductions and payroll status before completing your process.'], ['Find a payslip', 'Employees can access the payslips available to them.']],
    flow: [['Set up employee details', 'Keep salary and payroll information current.'], ['Generate and review', 'Check the period’s payroll records.'], ['Share the record', 'Make the resulting payslip accessible.']],
    preview: 'records', rows: [['Payroll period', 'Month selected', 'Prepared'], ['Earnings & deductions', 'Review inputs', 'Review'], ['Employee payslip', 'Payroll record', 'Available']],
    story: [
      {
        label: 'Set inputs',
        title: 'Get the inputs ready for the month.',
        description: 'Check employee salary details and the attendance inputs for the period. Resolve exceptions before preparing payroll, especially if a recent change affects earnings or deductions.',
        signals: [['Period', 'October'], ['Inputs', 'Salary and attendance']],
      },
      {
        label: 'Review records',
        title: 'Generate records and check the breakdown.',
        description: 'Choose a month and year to prepare payroll, including bulk processing where available. Review the resulting earnings, deductions and record status before completing your payroll process.',
        signals: [['Period', 'October'], ['Review', 'Earnings and deductions']],
      },
      {
        label: 'Access payslips',
        title: 'Give employees a place to find the record.',
        description: 'Employees can access payslips made available to them in Talio. A payroll record gives staff a reference for that period while payment and filing follow your organisation’s separate process.',
        signals: [['Record', 'October payslip'], ['Visibility', 'Employee access']],
      },
    ],
  },
  {
    slug: 'goals', name: 'Goals & performance', category: 'People & HR', icon: Target,
    eyebrow: 'Give progress some direction', headline: 'Make the goal clear.\nKeep the conversation going.',
    description: 'Set goals, update progress and bring performance reviews into one place. Give managers and employees something concrete to discuss.',
    note: 'Goal management, ratings and performance views are controlled by role and company settings.',
    capabilities: [['Set a goal', 'Create goals with the details and dates that define the work.'], ['Review progress', 'Update goals and look back at their status.'], ['Connect the discussion', 'Use performance ratings and reports alongside task and attendance context.']],
    flow: [['Agree on the goal', 'Describe the outcome and set a time frame.'], ['Keep it current', 'Update progress as work moves forward.'], ['Review together', 'Use the record to support a performance conversation.']],
    preview: 'records', rows: [['Improve onboarding', 'Team goal', 'In progress'], ['Review the handover', 'Next check-in', 'Scheduled'], ['Performance review', 'Current period', 'Draft']],
    story: [
      {
        label: 'Set outcome',
        title: 'Write a goal you can review together.',
        description: 'Give the goal a clear outcome and time frame. For example, ask the operations team to produce a checklist for new hires before the next joining date.',
        signals: [['Goal', 'Improve new-hire onboarding'], ['Target', 'Next joining date']],
      },
      {
        label: 'Update progress',
        title: 'Bring the latest status into the conversation.',
        description: 'Update the goal as work moves. Before a check-in, review the recorded progress and status so you can spend the meeting discussing what needs help.',
        signals: [['Goal', 'Onboarding checklist'], ['Status', 'In progress']],
      },
      {
        label: 'Review together',
        title: 'Give the review more than a score.',
        description: 'Bring the goal record into a performance discussion alongside the ratings and reports your role can view. Use task or attendance context where it helps explain a result.',
        signals: [['Review', 'Current period'], ['Context', 'Goal progress and task history']],
      },
    ],
  },
  {
    slug: 'workflows', name: 'Requests & approvals', category: 'People & HR', icon: GitBranch,
    eyebrow: 'Know where things stand', headline: 'Less “who has this?”\nMore clear next steps.',
    description: 'Follow the requests that move people and work forward: attendance corrections, leave, project completion and employee lifecycle steps.',
    note: 'These are Talio’s supported approval flows. Available steps depend on the module, your role and your company’s setup.',
    capabilities: [['Bring requests into the process', 'Use the relevant attendance, leave, project or people flow to submit work for review.'], ['Keep the decision attached', 'Review status, comments and recorded actions in the context of the request.'], ['Move to the next step', 'Track onboarding, probation and offboarding steps within employee operations.']],
    flow: [['Submit', 'Provide the information needed for a decision.'], ['Review', 'The authorised person reviews the request.'], ['Follow through', 'Check the outcome and continue the process.']],
    preview: 'records', rows: [['Leave request', 'Submitted by employee', 'Pending'], ['Project completion', 'Reviewed by project head', 'Approved'], ['Probation review', 'Employee lifecycle', 'Next step']],
    story: [
      {
        label: 'Submit details',
        title: 'Start in the module that owns the request.',
        description: 'A missed check-out belongs in attendance regularisation. Give the reviewer the missing time and reason there, so the request stays tied to the attendance record.',
        signals: [['Request', 'Attendance correction'], ['Details', 'Time and reason']],
      },
      {
        label: 'Route review',
        title: 'Give the decision to the right person.',
        description: 'Talio keeps approvals in their own context. Leave goes through the configured leave process, while a project completion request can go to the project head.',
        signals: [['Example', 'Project completion'], ['Reviewer', 'Project head']],
      },
      {
        label: 'Follow through',
        title: 'Check the decision and continue the work.',
        description: 'Return to the original request to check its status and recorded actions. For lifecycle work, use the employee record to see which onboarding, probation or offboarding steps still need attention.',
        signals: [['Record', 'Probation review'], ['Next step', 'Authorised decision']],
      },
    ],
  },
  {
    slug: 'team-chat', name: 'Team chat', category: 'Daily work', icon: MessageSquare,
    eyebrow: 'A conversation, close to the work', headline: 'Ask the quick question.\nKeep your place.',
    description: 'Message a teammate or bring a group together. Desktop chat popups let you keep the conversation open while you work elsewhere in Talio.',
    note: 'Chat access follows company membership and feature settings. Delivery and presence depend on connectivity.',
    capabilities: [['Talk one-to-one or as a group', 'Start a private conversation or create a group with colleagues.'], ['Share the details', 'Send files, mention teammates and react to messages.'], ['Keep work in view', 'Use floating conversations on desktop and the dedicated chat view on mobile.']],
    flow: [['Find your people', 'Choose a colleague or a group.'], ['Share the context', 'Write a message or attach a file.'], ['Carry on working', 'Keep the conversation nearby as you move through Talio.']],
    preview: 'conversation', rows: [['Design team', 'The updated brief is ready to review.', 'Message'], ['You', 'Thanks. I’ll add my notes to the project.', 'Reply'], ['Design team', 'Perfect, let’s keep the feedback there.', 'Follow-up']],
    story: [
      {
        label: 'Start a thread',
        title: 'Choose who needs to be in the conversation.',
        description: 'Start a private chat with a teammate for a quick check, or bring the people working on a brief into a group. Use a separate group for a different audience.',
        signals: [['Conversation', 'Design team'], ['Topic', 'Updated launch brief']],
      },
      {
        label: 'Share context',
        title: 'Send the file with the question.',
        description: 'Attach the brief and say which part needs feedback. In the group, mention the teammate who owns the decision so others can follow the same thread.',
        signals: [['Attachment', 'Launch brief'], ['Ask', 'Check the handover section']],
      },
      {
        label: 'Keep working',
        title: 'Read the reply without leaving your task.',
        description: 'Keep a floating conversation open on desktop while you work elsewhere in Talio. On mobile, return to the discussion from the dedicated chat view.',
        signals: [['Desktop', 'Floating conversation'], ['Mobile', 'Chat view']],
      },
    ],
  },
  {
    slug: 'meetings', name: 'Meetings', category: 'Daily work', icon: Video,
    eyebrow: 'Before, during and after', headline: 'Meet with a plan.\nLeave with context.',
    description: 'Schedule a meeting, invite the right people and keep the agenda nearby. Online meeting tools and MIRA summaries help you return to what was discussed.',
    note: 'Online calls need camera or microphone permissions as appropriate. Summaries need available transcript or notes and a configured model provider; review them for accuracy.',
    capabilities: [['Arrange the meeting', 'Choose a time, agenda and attendees for an online or offline meeting.'], ['Join the conversation', 'Use Talio’s online meeting room and supported screen-sharing tools.'], ['Return to the discussion', 'Generate or refresh a MIRA summary from the transcript and notes available.']],
    flow: [['Schedule', 'Set the agenda and invite attendees.'], ['Meet', 'Join online or use the offline location details.'], ['Follow up', 'Review the summary and carry decisions into your work.']],
    preview: 'records', rows: [['Weekly planning', 'Agenda & attendees', 'Scheduled'], ['Meeting room', 'Audio, video & sharing', 'Join'], ['Meeting summary', 'From notes or transcript', 'Review']],
    story: [
      {
        label: 'Make an agenda',
        title: 'Say what needs to be decided.',
        description: 'Schedule an online or offline meeting, invite the people involved and include the decision on the agenda. For an offline meeting, add a location so attendees know where to go.',
        signals: [['Meeting', 'Release review'], ['Agenda', 'Agree on the rollout plan']],
      },
      {
        label: 'Run the meeting',
        title: 'Bring the team into the same discussion.',
        description: 'Join the Talio meeting room for an online session. Use supported audio, video and screen sharing to walk through the material, with the required device permissions.',
        signals: [['Format', 'Online'], ['Share', 'Release checklist']],
      },
      {
        label: 'Review decisions',
        title: 'Return to the record when the call ends.',
        description: 'Generate or refresh the MIRA summary when notes or a transcript are available. Check the recorded decisions and action items against the source before carrying them into the project.',
        signals: [['Input', 'Notes or transcript'], ['Review', 'Decisions and follow-ups']],
      },
    ],
  },
  {
    slug: 'whiteboard', name: 'TalioBoard', category: 'Daily work', icon: PenTool,
    eyebrow: 'Space to think together', headline: 'Get the idea\nout of your head.',
    description: 'Use TalioBoard to sketch, arrange ideas and work through a plan on a shared canvas. Keep your boards within the same workspace as your team.',
    note: 'Board access and collaboration depend on membership, connectivity and enabled features.',
    capabilities: [['Start with a canvas', 'Create a board and organise ideas visually.'], ['Work with others', 'Use the board’s collaboration tools to develop an idea together.'], ['Get help from MIRA', 'Use the board’s MIRA sidebar when you need help developing your thinking.']],
    flow: [['Open a board', 'Give your idea a place to begin.'], ['Explore it', 'Sketch and organise the pieces.'], ['Keep the context', 'Return to the board as the work develops.']],
    preview: 'board', rows: [['The idea', 'Explore', 'What are we solving?'], ['The approach', 'Connect', 'What could work?'], ['The next step', 'Decide', 'What do we try first?']],
    story: [
      {
        label: 'Start sketching',
        title: 'Give the open question a canvas.',
        description: 'Create a board for the planning session and place the question at the centre. Use text and shapes to lay out options so the team can see what is being compared.',
        signals: [['Board', 'Release planning'], ['Question', 'How should we roll out?']],
      },
      {
        label: 'Connect ideas',
        title: 'Show which pieces depend on each other.',
        description: 'Arrange related ideas together and use connections to trace the sequence. Open MIRA’s board sidebar when you want help developing an outline you can edit.',
        signals: [['Diagram', 'Rollout sequence'], ['Draft', 'Editable outline']],
      },
      {
        label: 'Share the board',
        title: 'Give reviewers the access they need.',
        description: 'Share the board with a teammate and choose whether they can view or edit it. Keep the board available for the next planning session, with the thinking still visible.',
        signals: [['Reviewer', 'Release lead'], ['Access', 'View only']],
      },
    ],
  },
  {
    slug: 'people', name: 'People & lifecycle', category: 'People & HR', icon: Users,
    eyebrow: 'From the first day onwards', headline: 'People details.\nWith the next step attached.',
    description: 'Keep employee profiles, reporting relationships and lifecycle tasks together, from onboarding and probation to offboarding.',
    note: 'Lifecycle steps are configured by company and role. Some HR modules need additional setup before they can be used.',
    capabilities: [['Keep a useful directory', 'Find employee profiles, departments, designations and reporting relationships.'], ['Support the first weeks', 'Follow onboarding checklists and probation review decisions.'], ['Handle the handover', 'Track offboarding steps, asset clearance and settlement information.']],
    flow: [['Add the employee', 'Set up their profile and place in the team.'], ['Follow the milestones', 'Complete onboarding and review probation.'], ['Keep records current', 'Manage changes and the eventual handover.']],
    preview: 'records', rows: [['Employee profile', 'Department & reporting line', 'Current'], ['Onboarding checklist', 'Joining tasks', 'In progress'], ['Probation review', 'Approver assigned', 'Upcoming']],
    story: [
      {
        label: 'Set up profile',
        title: 'Give a new hire a place in the organisation.',
        description: 'Create the employee profile with department, designation and reporting manager. The directory gives authorised teammates one place to check those relationships.',
        signals: [['Department', 'Operations'], ['Reports to', 'Operations lead']],
      },
      {
        label: 'Track milestones',
        title: 'Make the first weeks easy to follow.',
        description: 'Use the onboarding checklist for items such as equipment and access. If probation applies, track its review date and record the authorised decision.',
        signals: [['Joining task', 'Issue equipment'], ['Milestone', 'Probation review']],
      },
      {
        label: 'Plan handover',
        title: 'Keep the return of equipment on the list.',
        description: 'During offboarding, track clearance and asset returns alongside other handover steps. HR can check the lifecycle record for anything that is still open.',
        signals: [['Checklist', 'Offboarding'], ['Clearance', 'Return assigned laptop']],
      },
    ],
  },
  {
    slug: 'recruitment', name: 'Recruitment', category: 'People & HR', icon: UserPlus,
    eyebrow: 'Keep the hiring story together', headline: 'From an open role\nto a new teammate.',
    description: 'Manage roles, candidates and interviews in Talio. Keep hiring progress visible and carry selected candidates into employee onboarding.',
    note: 'Recruitment permissions and enabled modules apply. External recruiting integrations require separate configuration.',
    capabilities: [['Manage open roles', 'Create and filter job records by status, department and employment type.'], ['Follow candidates', 'Maintain candidate records and move them through the hiring process.'], ['Coordinate the next step', 'Schedule interviews and convert a selected candidate into an employee record.']],
    flow: [['Define the role', 'Add the job and its requirements.'], ['Review candidates', 'Keep candidate information and interviews together.'], ['Prepare for joining', 'Carry the selected person into employee setup.']],
    preview: 'board', rows: [['Applications', 'Review', 'Candidate records'], ['Interviews', 'Discuss', 'Interview schedule'], ['Joining', 'Prepare', 'Employee setup']],
    story: [
      {
        label: 'Open the role',
        title: 'Give the hiring team a shared starting point.',
        description: 'Add the job record with its department and employment type. The jobs view can be filtered by those details and status, which helps the team see what is still open.',
        signals: [['Role', 'Operations coordinator'], ['Employment type', 'Full-time']],
      },
      {
        label: 'Coordinate interviews',
        title: 'Carry the candidate record through each stage.',
        description: 'Keep the candidate’s record attached to the hiring process and schedule interviews in Talio. Use the stage and interview schedule to see what comes next.',
        signals: [['Stage', 'Interview'], ['Next step', 'Interview schedule']],
      },
      {
        label: 'Prepare joining',
        title: 'Carry a selected candidate into employee setup.',
        description: 'Convert the selected candidate into an employee record when your team is ready. The people workflow then gives HR a place to manage joining and onboarding.',
        signals: [['Hiring stage', 'Selected'], ['Handoff', 'Employee setup']],
      },
    ],
  },
  {
    slug: 'operations', name: 'Assets & helpdesk', category: 'People & HR', icon: Briefcase,
    eyebrow: 'The practical side of work', headline: 'Track the equipment.\nFollow the request.',
    description: 'Keep asset records and employee support requests out of scattered spreadsheets and messages. Find the item, the issue and its current status.',
    note: 'Asset management and helpdesk access depend on your company’s enabled modules and your role.',
    capabilities: [['Maintain an asset register', 'Create, update and import asset records for your organisation.'], ['Keep support in one thread', 'Create helpdesk tickets and add comments as an issue is handled.'], ['Remember the return', 'Use asset clearance alongside offboarding so equipment is part of the handover.']],
    flow: [['Record it', 'Add an asset or describe a support issue.'], ['Keep it updated', 'Track the record and its status.'], ['Close the loop', 'Resolve the ticket or complete the asset handover.']],
    preview: 'records', rows: [['Work laptop', 'Employee assignment', 'Assigned'], ['Access request', 'Helpdesk conversation', 'Open'], ['Asset return', 'Offboarding checklist', 'Review']],
    story: [
      {
        label: 'Register equipment',
        title: 'Know which device went to which employee.',
        description: 'Add equipment to the asset register and record its assignment. When you already have a register elsewhere, import supported records rather than typing them one by one.',
        signals: [['Item', 'Work laptop'], ['Assignment', 'Alex · Operations']],
      },
      {
        label: 'Track support',
        title: 'Keep the symptoms and updates in one thread.',
        description: 'Open a helpdesk ticket for the faulty device and describe what happened. Add comments as support checks the issue and the ticket moves toward resolution.',
        signals: [['Ticket', 'Laptop charging issue'], ['Status', 'Open']],
      },
      {
        label: 'Record returns',
        title: 'Make the asset return part of offboarding.',
        description: 'Use the asset clearance step when someone leaves. Checking the return against the assignment helps HR and the equipment owner follow the same handover.',
        signals: [['Asset', 'Assigned laptop'], ['Clearance', 'Return for review']],
      },
    ],
  },
  {
    slug: 'documents', name: 'Documents & policies', category: 'People & HR', icon: FileText,
    eyebrow: 'A place to come back to', headline: 'Find the document.\nKnow which policy applies.',
    description: 'Keep company documents and policy information in Talio, alongside the employee workflows that need them.',
    note: 'Document visibility, upload permissions and available policies depend on company configuration.',
    capabilities: [['Store the record', 'Upload and organise documents in the company workspace.'], ['Find shared information', 'Use the documents and policies pages to return to the information you need.'], ['Support people processes', 'Keep employee lifecycle records and supporting documents in the same system.']],
    flow: [['Add the information', 'Upload the relevant document or policy.'], ['Make it accessible', 'Use the visibility available to your role.'], ['Return when needed', 'Find it from the workspace rather than an old message.']],
    preview: 'records', rows: [['Employee handbook', 'Company document', 'Available'], ['Leave policy', 'Company rules', 'Read'], ['Joining documents', 'Employee record', 'Review']],
    story: [
      {
        label: 'File the record',
        title: 'Put the file where you expect to find it.',
        description: 'Upload a document with a clear name and category. Talio distinguishes personal and company documents, so use the scope appropriate to the record and your access.',
        signals: [['File', 'Joining paperwork'], ['Category', 'Employment']],
      },
      {
        label: 'Share guidance',
        title: 'Point people to the policy itself.',
        description: 'Use the policies area when someone asks which rule applies. Company documents give employees a place to find shared material such as a handbook alongside the relevant policies.',
        signals: [['Policy', 'Leave policy'], ['Shared record', 'Employee handbook']],
      },
      {
        label: 'Return later',
        title: 'Keep supporting records near people workflows.',
        description: 'When an authorised reviewer needs a supporting document, return to its Talio record. Access depends on the document’s visibility and the reviewer’s role.',
        signals: [['Supporting file', 'Joining document'], ['Access', 'Authorised reviewer']],
      },
    ],
  },
  {
    slug: 'notifications', name: 'Notifications', category: 'Daily work', icon: Bell,
    eyebrow: 'Stay in the loop', headline: 'The updates\nthat bring you back.',
    description: 'Keep track of work updates, requests and reminders inside Talio. Use your notification preferences to choose how you hear about them.',
    note: 'Push delivery needs a supported device and notification permission. Reminder timing depends on processing and connectivity.',
    capabilities: [['See work updates', 'Receive notifications associated with messages, tasks and people workflows.'], ['Follow requests', 'Open actionable updates and respond where your role allows.'], ['Set your preferences', 'Manage notification settings and use MIRA to schedule a personal reminder.']],
    flow: [['Choose your settings', 'Enable the notifications you want to receive.'], ['Get the update', 'See the event in your notification feed.'], ['Return to the work', 'Open the related request or conversation.']],
    preview: 'records', rows: [['Task assigned', 'Website launch', 'New'], ['Leave request', 'Ready for review', 'Pending'], ['Personal reminder', 'Check the draft', 'Scheduled']],
    story: [
      {
        label: 'Set preferences',
        title: 'Choose how to hear about work.',
        description: 'Review notification preferences in Talio. If you want device alerts, enable them on a supported device and allow notification permission.',
        signals: [['Setting', 'Work updates'], ['Device alerts', 'Permission required']],
      },
      {
        label: 'Open the update',
        title: 'Go from the alert to the decision.',
        description: 'Open an update about an assigned task or a request that needs review. Follow its link into the relevant work, where the available actions depend on your role.',
        signals: [['Update', 'Leave request'], ['Destination', 'Request review']],
      },
      {
        label: 'Plan follow-up',
        title: 'Ask for a reminder at the right time.',
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
