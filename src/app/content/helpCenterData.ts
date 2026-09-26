import {
  Rocket,
  Clock,
  CalendarDays,
  DollarSign,
  Bot,
  Settings,
  BookOpen,
  Code,
  Headphones,
  type LucideIcon,
} from 'lucide-react';

export interface DocArticle {
  title: string;
  content: string;
}

export interface CategoryData {
  icon: LucideIcon;
  title: string;
  desc: string;
  articles: DocArticle[];
}

export interface HelpResource {
  icon: LucideIcon;
  title: string;
  desc: string;
  link: string;
}

export const categories: CategoryData[] = [
  {
    icon: Rocket,
    title: 'Getting Started',
    desc: 'Set up your account and get running',
    articles: [
      {
        title: 'Creating Your Account',
        content:
          "Visit app.talio.in and click 'Start Free Trial'. Enter your work email, create a password, and fill in your organization details. You'll receive a verification email within seconds. Click the link to activate your account and access the full dashboard.",
      },
      {
        title: 'Setting Up Your Organization',
        content:
          'After logging in, navigate to Settings → Organization. Add your company name, logo, timezone, and work schedule. Configure your departments and designations. You can import employees via CSV or add them manually from the Team section.',
      },
      {
        title: 'Inviting Team Members',
        content:
          "Go to Team → Invite Members. Enter email addresses (comma-separated for multiple invites). Choose their role (Admin, Manager, or Employee) and assign them to a department. They'll receive an invitation email with setup instructions.",
      },
      {
        title: 'Installing Desktop & Mobile Apps',
        content:
          'Download Talio from the /downloads page. Desktop apps are available for macOS (Apple Silicon & Intel) and Windows. The iOS app is on the App Store. Sign in with your work email to sync your data across all devices.',
      },
    ],
  },
  {
    icon: Clock,
    title: 'Attendance',
    desc: 'GPS, geofencing, and tracking help',
    articles: [
      {
        title: 'How GPS Check-In Works',
        content:
          "Talio uses your device's GPS to verify your location when you check in. Your admin configures geofenced zones (office locations). When you're within an approved zone, tap 'Check In' — your location, time, and device are recorded. If you're outside the zone, the check-in will be flagged for review.",
      },
      {
        title: 'Setting Up Geofences',
        content:
          'Admins can configure geofences under Settings → Attendance → Geofences. Search for your office address, set the radius (50m–500m), and name the zone. You can add multiple zones for different office locations, client sites, or remote work areas.',
      },
      {
        title: 'Overtime Tracking',
        content:
          "Overtime is calculated automatically based on your organization's configured work hours. Go to Settings → Attendance → Overtime Rules to set thresholds, rates (1.5x, 2x), and maximum allowed hours. Overtime appears on employee dashboards and payroll summaries.",
      },
      {
        title: 'Viewing Attendance Reports',
        content:
          'Navigate to Reports → Attendance for detailed analytics. Filter by date range, department, or individual. View daily/weekly/monthly summaries, late arrivals, early departures, and total work hours. Export reports as CSV or PDF.',
      },
    ],
  },
  {
    icon: CalendarDays,
    title: 'Leave Management',
    desc: 'Requests, approvals, and policies',
    articles: [
      {
        title: 'Applying for Leave',
        content:
          "Go to Leave → Apply Leave. Select start and end dates, choose the leave type (Casual, Sick, Earned, etc.), add any notes, and submit. Your manager receives an instant notification and can approve or reject from their dashboard or mobile app.",
      },
      {
        title: 'Configuring Leave Policies',
        content:
          'Admins can set up leave policies under Settings → Leave → Policies. Define leave types, annual entitlements, carry-forward rules, and probation restrictions. Assign policies to departments or individual employees. Changes take effect from the next leave cycle.',
      },
      {
        title: 'Checking Leave Balance',
        content:
          "Your leave balance is visible on your dashboard or under Leave → My Balance. It shows allocated, used, and remaining leaves for each type. Managers can view their team's balances under Team → Leave Balances.",
      },
      {
        title: 'Holiday Calendar',
        content:
          'Admins manage the holiday calendar under Settings → Leave → Holidays. Add public holidays, optional holidays, and restricted holidays. Employees can view upcoming holidays from the Leave section. Holidays are automatically excluded from attendance calculations.',
      },
    ],
  },
  {
    icon: DollarSign,
    title: 'Payroll',
    desc: 'Salary, taxes, and payslips',
    articles: [
      {
        title: 'Running Monthly Payroll',
        content:
          'Go to Payroll → Generate Payroll. Select the month, review the auto-calculated amounts (base salary + overtime – deductions – taxes), make any manual adjustments, and click Generate. Payslips are created instantly and can be distributed to employees via email or the app.',
      },
      {
        title: 'Salary Structure Setup',
        content:
          'Configure salary components under Settings → Payroll → Salary Structure. Define basic pay, HRA, conveyance, special allowances, and other components. Set up tax deduction rules (TDS, PF, ESI) and statutory compliance settings for your region.',
      },
      {
        title: 'Downloading Payslips',
        content:
          'Employees can download payslips from Payroll → My Payslips. Select the month and click the download icon to get a PDF. Managers and admins can bulk-download payslips for their team or entire organization under Payroll → Reports.',
      },
      {
        title: 'Tax Reports & Compliance',
        content:
          'Access tax reports under Payroll → Tax Reports. View TDS summaries, PF contributions, and ESI deductions. Generate Form 16, Form 24Q, and other statutory reports. Talio automatically calculates tax liability based on the latest tax slab configurations.',
      },
    ],
  },
  {
    icon: Bot,
    title: 'MIRA AI',
    desc: 'AI assistant tips and tricks',
    articles: [
      {
        title: 'What is MIRA?',
        content:
          "MIRA is Talio's AI assistant that understands natural language. Ask questions like 'Who's on leave today?', 'Show me overtime trends this quarter', or 'Generate this month's payroll summary'. MIRA can also execute actions like approving leave requests or sending reminders.",
      },
      {
        title: 'Talking to MIRA',
        content:
          'Access MIRA from the chat icon in the bottom-right corner of any page, or press Ctrl+K / Cmd+K. Type your question naturally — MIRA understands context and follow-up questions. You can ask for reports, request data, or trigger workflows through conversation.',
      },
      {
        title: 'MIRA Commands & Actions',
        content:
          "MIRA can execute tasks when you ask: 'Approve John's leave request', 'Add a new employee named…', 'Send payslips for March'. MIRA will show a confirmation before executing any action. You can undo recent MIRA actions from the Activity Log.",
      },
      {
        title: 'MIRA Insights & Alerts',
        content:
          'MIRA proactively alerts you about potential issues: upcoming compliance deadlines, employees at risk of burnout (high overtime), understaffing on particular days, and anomalous attendance patterns. Configure alert preferences under Settings → MIRA → Notifications.',
      },
    ],
  },
  {
    icon: Settings,
    title: 'Settings',
    desc: 'Account and organization settings',
    articles: [
      {
        title: 'Profile & Security',
        content:
          'Update your profile under Settings → My Profile. Change your name, avatar, phone number, and password. Enable two-factor authentication (2FA) via authenticator app or SMS for additional security. View your active sessions and revoke any suspicious ones.',
      },
      {
        title: 'Organization Settings',
        content:
          'Admins can configure org-wide settings under Settings → Organization. Update company details, manage departments and designations, configure work schedules (shifts, flexible hours), and set up approval hierarchies for leave and expenses.',
      },
      {
        title: 'Roles & Permissions',
        content:
          'Talio supports role-based access control. Under Settings → Roles & Permissions, admins can create custom roles, define access levels for each module (View, Edit, Manage), and assign roles to employees. Default roles include Super Admin, Admin, Manager, and Employee.',
      },
      {
        title: 'Integrations',
        content:
          'Connect Talio with your existing tools under Settings → Integrations. Available integrations include Slack, Microsoft Teams, Google Workspace, Zoom, and 50+ other apps. Each integration has a simple toggle-based setup with optional configuration for webhooks and data sync preferences.',
      },
    ],
  },
];

export const faqs = [
  {
    q: 'How do I reset my password?',
    a: "Go to the login page and click 'Forgot Password'. Enter your email to receive a reset link.",
  },
  {
    q: 'How does GPS-based attendance work?',
    a: "Talio uses your device's GPS to verify your location against your organization's configured geofenced zones. When you're within range, you can check in/out with a single tap.",
  },
  {
    q: 'Can I access Talio on multiple devices?',
    a: 'Yes! Talio works on web, mobile, and desktop. Your data syncs across all devices in real-time. Note: attendance check-ins are limited to your primary device for security.',
  },
  {
    q: 'How do I apply for leave?',
    a: "Navigate to the Leave section, click 'Apply Leave', select your dates and leave type, add any notes, and submit. Your manager will be notified instantly.",
  },
  {
    q: 'What is MIRA?',
    a: "MIRA is Talio's AI assistant. Ask her questions in natural language about your attendance, leave balance, payroll, and more. She can also generate reports and automate tasks.",
  },
  {
    q: 'How is overtime calculated?',
    a: "Overtime is calculated based on your organization's policy. Common rates are 1.5x or 2x regular pay. Your admin can configure overtime rules in Settings.",
  },
  {
    q: 'How do I download my payslip?',
    a: 'Go to the Payroll section, select the month you need, and click the download icon. Payslips are available as PDF.',
  },
  {
    q: 'How secure is my data?',
    a: 'Talio uses role-based access to control who can view and manage workspace information. Contact our team for current security documentation and to discuss your organisation’s requirements.',
  },
];

export const resources: HelpResource[] = [
  { icon: BookOpen, title: 'Documentation', desc: 'Browse comprehensive guides', link: '/documents' },
  { icon: Code, title: 'API Reference', desc: 'Developer documentation', link: '/documents' },
  { icon: Headphones, title: 'Contact Support', desc: 'Talk to our support team', link: '/contact' },
];