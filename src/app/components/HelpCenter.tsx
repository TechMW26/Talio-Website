import { useRef, useState, useEffect } from "react";
import { motion, useInView, AnimatePresence } from "motion/react";
import { Link } from "react-router";
import { usePageMeta } from '@/app/hooks/usePageMeta';
import {
  Rocket,
  Clock,
  CalendarDays,
  DollarSign,
  Bot,
  Settings,
  ChevronDown,
  BookOpen,
  Code,
  Headphones,
  X,
  CheckCircle,
  ArrowRight,
  type LucideIcon,
} from "lucide-react";

interface DocArticle {
  title: string;
  content: string;
}

interface CategoryData {
  icon: LucideIcon;
  title: string;
  desc: string;
  articles: DocArticle[];
}

const categories: CategoryData[] = [
  {
    icon: Rocket,
    title: "Getting Started",
    desc: "Set up your account and get running",
    articles: [
      {
        title: "Creating Your Account",
        content:
          "Visit app.talio.in and click 'Start Free Trial'. Enter your work email, create a password, and fill in your organization details. You'll receive a verification email within seconds. Click the link to activate your account and access the full dashboard.",
      },
      {
        title: "Setting Up Your Organization",
        content:
          "After logging in, navigate to Settings → Organization. Add your company name, logo, timezone, and work schedule. Configure your departments and designations. You can import employees via CSV or add them manually from the Team section.",
      },
      {
        title: "Inviting Team Members",
        content:
          "Go to Team → Invite Members. Enter email addresses (comma-separated for multiple invites). Choose their role (Admin, Manager, or Employee) and assign them to a department. They'll receive an invitation email with setup instructions.",
      },
      {
        title: "Installing Desktop & Mobile Apps",
        content:
          "Download Talio from the /downloads page. Desktop apps are available for macOS (Apple Silicon & Intel) and Windows. The iOS app is on the App Store. Sign in with your work email to sync your data across all devices.",
      },
    ],
  },
  {
    icon: Clock,
    title: "Attendance",
    desc: "GPS, geofencing, and tracking help",
    articles: [
      {
        title: "How GPS Check-In Works",
        content:
          "Talio uses your device's GPS to verify your location when you check in. Your admin configures geofenced zones (office locations). When you're within an approved zone, tap 'Check In' — your location, time, and device are recorded. If you're outside the zone, the check-in will be flagged for review.",
      },
      {
        title: "Setting Up Geofences",
        content:
          "Admins can configure geofences under Settings → Attendance → Geofences. Search for your office address, set the radius (50m–500m), and name the zone. You can add multiple zones for different office locations, client sites, or remote work areas.",
      },
      {
        title: "Overtime Tracking",
        content:
          "Overtime is calculated automatically based on your organization's configured work hours. Go to Settings → Attendance → Overtime Rules to set thresholds, rates (1.5x, 2x), and maximum allowed hours. Overtime appears on employee dashboards and payroll summaries.",
      },
      {
        title: "Viewing Attendance Reports",
        content:
          "Navigate to Reports → Attendance for detailed analytics. Filter by date range, department, or individual. View daily/weekly/monthly summaries, late arrivals, early departures, and total work hours. Export reports as CSV or PDF.",
      },
    ],
  },
  {
    icon: CalendarDays,
    title: "Leave Management",
    desc: "Requests, approvals, and policies",
    articles: [
      {
        title: "Applying for Leave",
        content:
          "Go to Leave → Apply Leave. Select start and end dates, choose the leave type (Casual, Sick, Earned, etc.), add any notes, and submit. Your manager receives an instant notification and can approve or reject from their dashboard or mobile app.",
      },
      {
        title: "Configuring Leave Policies",
        content:
          "Admins can set up leave policies under Settings → Leave → Policies. Define leave types, annual entitlements, carry-forward rules, and probation restrictions. Assign policies to departments or individual employees. Changes take effect from the next leave cycle.",
      },
      {
        title: "Checking Leave Balance",
        content:
          "Your leave balance is visible on your dashboard or under Leave → My Balance. It shows allocated, used, and remaining leaves for each type. Managers can view their team's balances under Team → Leave Balances.",
      },
      {
        title: "Holiday Calendar",
        content:
          "Admins manage the holiday calendar under Settings → Leave → Holidays. Add public holidays, optional holidays, and restricted holidays. Employees can view upcoming holidays from the Leave section. Holidays are automatically excluded from attendance calculations.",
      },
    ],
  },
  {
    icon: DollarSign,
    title: "Payroll",
    desc: "Salary, taxes, and payslips",
    articles: [
      {
        title: "Running Monthly Payroll",
        content:
          "Go to Payroll → Generate Payroll. Select the month, review the auto-calculated amounts (base salary + overtime – deductions – taxes), make any manual adjustments, and click Generate. Payslips are created instantly and can be distributed to employees via email or the app.",
      },
      {
        title: "Salary Structure Setup",
        content:
          "Configure salary components under Settings → Payroll → Salary Structure. Define basic pay, HRA, conveyance, special allowances, and other components. Set up tax deduction rules (TDS, PF, ESI) and statutory compliance settings for your region.",
      },
      {
        title: "Downloading Payslips",
        content:
          "Employees can download payslips from Payroll → My Payslips. Select the month and click the download icon to get a PDF. Managers and admins can bulk-download payslips for their team or entire organization under Payroll → Reports.",
      },
      {
        title: "Tax Reports & Compliance",
        content:
          "Access tax reports under Payroll → Tax Reports. View TDS summaries, PF contributions, and ESI deductions. Generate Form 16, Form 24Q, and other statutory reports. Talio automatically calculates tax liability based on the latest tax slab configurations.",
      },
    ],
  },
  {
    icon: Bot,
    title: "MIRA AI",
    desc: "AI assistant tips and tricks",
    articles: [
      {
        title: "What is MIRA?",
        content:
          "MIRA is Talio's AI assistant that understands natural language. Ask questions like 'Who's on leave today?', 'Show me overtime trends this quarter', or 'Generate this month's payroll summary'. MIRA can also execute actions like approving leave requests or sending reminders.",
      },
      {
        title: "Talking to MIRA",
        content:
          "Access MIRA from the chat icon in the bottom-right corner of any page, or press Ctrl+K / Cmd+K. Type your question naturally — MIRA understands context and follow-up questions. You can ask for reports, request data, or trigger workflows through conversation.",
      },
      {
        title: "MIRA Commands & Actions",
        content:
          "MIRA can execute tasks when you ask: 'Approve John's leave request', 'Add a new employee named…', 'Send payslips for March'. MIRA will show a confirmation before executing any action. You can undo recent MIRA actions from the Activity Log.",
      },
      {
        title: "MIRA Insights & Alerts",
        content:
          "MIRA proactively alerts you about potential issues: upcoming compliance deadlines, employees at risk of burnout (high overtime), understaffing on particular days, and anomalous attendance patterns. Configure alert preferences under Settings → MIRA → Notifications.",
      },
    ],
  },
  {
    icon: Settings,
    title: "Settings",
    desc: "Account and organization settings",
    articles: [
      {
        title: "Profile & Security",
        content:
          "Update your profile under Settings → My Profile. Change your name, avatar, phone number, and password. Enable two-factor authentication (2FA) via authenticator app or SMS for additional security. View your active sessions and revoke any suspicious ones.",
      },
      {
        title: "Organization Settings",
        content:
          "Admins can configure org-wide settings under Settings → Organization. Update company details, manage departments and designations, configure work schedules (shifts, flexible hours), and set up approval hierarchies for leave and expenses.",
      },
      {
        title: "Roles & Permissions",
        content:
          "Talio supports role-based access control. Under Settings → Roles & Permissions, admins can create custom roles, define access levels for each module (View, Edit, Manage), and assign roles to employees. Default roles include Super Admin, Admin, Manager, and Employee.",
      },
      {
        title: "Integrations",
        content:
          "Connect Talio with your existing tools under Settings → Integrations. Available integrations include Slack, Microsoft Teams, Google Workspace, Zoom, and 50+ other apps. Each integration has a simple toggle-based setup with optional configuration for webhooks and data sync preferences.",
      },
    ],
  },
];

const faqs = [
  {
    q: "How do I reset my password?",
    a: "Go to the login page and click 'Forgot Password'. Enter your email to receive a reset link.",
  },
  {
    q: "How does GPS-based attendance work?",
    a: "Talio uses your device's GPS to verify your location against your organization's configured geofenced zones. When you're within range, you can check in/out with a single tap.",
  },
  {
    q: "Can I access Talio on multiple devices?",
    a: "Yes! Talio works on web, mobile, and desktop. Your data syncs across all devices in real-time. Note: attendance check-ins are limited to your primary device for security.",
  },
  {
    q: "How do I apply for leave?",
    a: "Navigate to the Leave section, click 'Apply Leave', select your dates and leave type, add any notes, and submit. Your manager will be notified instantly.",
  },
  {
    q: "What is MIRA?",
    a: "MIRA is Talio's AI assistant. Ask her questions in natural language about your attendance, leave balance, payroll, and more. She can also generate reports and automate tasks.",
  },
  {
    q: "How is overtime calculated?",
    a: "Overtime is calculated based on your organization's policy. Common rates are 1.5x or 2x regular pay. Your admin can configure overtime rules in Settings.",
  },
  {
    q: "How do I download my payslip?",
    a: "Go to the Payroll section, select the month you need, and click the download icon. Payslips are available as PDF.",
  },
  {
    q: "How secure is my data?",
    a: "Talio uses 256-bit SSL/TLS encryption in transit and AES-256 at rest. We're SOC2 compliant and GDPR ready. Role-based access control ensures only authorized personnel see your data.",
  },
];

const resources = [
  { icon: BookOpen, title: "Documentation", desc: "Browse comprehensive guides", link: "#" },
  { icon: Code, title: "API Reference", desc: "Developer documentation", link: "#" },
  { icon: Headphones, title: "Contact Support", desc: "Talk to our support team", link: "/contact" },
];

export function HelpCenter() {
  usePageMeta('Help Center', 'Find answers to common questions about Talio. Browse FAQs, guides, and resources to get the most out of your workforce management platform.');

  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<CategoryData | null>(null);
  const [expandedArticle, setExpandedArticle] = useState<number | null>(null);

  const heroRef = useRef(null);
  const catRef = useRef(null);
  const faqRef = useRef(null);
  const resRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: "-100px" });
  const catInView = useInView(catRef, { once: true, margin: "-100px" });
  const faqInView = useInView(faqRef, { once: true, margin: "-100px" });
  const resInView = useInView(resRef, { once: true, margin: "-100px" });

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedCategory) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => { document.body.style.overflow = ''; };
  }, [selectedCategory]);

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      {/* Hero */}
      <section ref={heroRef} className="pt-32 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12 flex flex-col items-center"
        >
          <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-green-400 uppercase tracking-widest mb-10">
            ✦ HELP CENTER
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10 leading-[1.05] tracking-tighter text-center">
            <span className="bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              How Can We Help You?
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl text-center">
            Find answers to common questions and learn how to get the most out of Talio.
          </p>
        </motion.div>
      </section>

      {/* Categories */}
      <section ref={catRef} className="pb-20">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.title}
              initial={{ opacity: 0, y: 30 }}
              animate={catInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              onClick={() => { setSelectedCategory(cat); setExpandedArticle(null); }}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:border-gray-700 transition-colors text-left group cursor-pointer"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center mb-4 group-hover:bg-gray-700/80 transition-colors">
                <cat.icon className="w-6 h-6 text-green-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{cat.title}</h3>
              <p className="text-gray-400 text-sm mb-3">{cat.desc}</p>
              <span className="inline-flex items-center gap-1 text-green-400 text-sm font-medium group-hover:gap-2 transition-all">
                View docs <ArrowRight className="w-4 h-4" />
              </span>
            </motion.button>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section ref={faqRef} className="py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={faqInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto px-6 md:px-8 lg:px-12"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-16 tracking-tighter leading-[1.05]">
            Frequently Asked Questions
          </h2>
          <div className="space-y-3">
            {faqs.map((faq, i) => {
              const isOpen = openFaq === i;
              return (
                <div
                  key={i}
                  className="bg-gray-900 border border-gray-800 rounded-2xl overflow-hidden"
                >
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : i)}
                    className="w-full flex items-center justify-between p-5 text-left"
                  >
                    <span className="font-medium text-white pr-4">{faq.q}</span>
                    <ChevronDown
                      className={`w-5 h-5 text-gray-400 shrink-0 transition-transform duration-300 ${
                        isOpen ? "rotate-180" : ""
                      }`}
                    />
                  </button>
                  <motion.div
                    initial={false}
                    animate={{ height: isOpen ? "auto" : 0, opacity: isOpen ? 1 : 0 }}
                    transition={{ duration: 0.3 }}
                    className="overflow-hidden"
                  >
                    <p className="px-5 pb-5 text-gray-400 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Resources */}
      <section ref={resRef} className="pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={resInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-center mb-16 tracking-tighter leading-[1.05]">Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {resources.map((res, i) => {
              const inner = (
                <div className="bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:border-gray-700 transition-colors text-center">
                  <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center mx-auto mb-4">
                    <res.icon className="w-6 h-6 text-green-400" />
                  </div>
                  <h3 className="text-lg font-semibold text-white mb-2">{res.title}</h3>
                  <p className="text-gray-400 text-sm">{res.desc}</p>
                </div>
              );

              return res.link.startsWith("/") ? (
                <Link key={i} to={res.link}>
                  {inner}
                </Link>
              ) : (
                <a key={i} href={res.link}>
                  {inner}
                </a>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* Documentation Modal */}
      <AnimatePresence>
        {selectedCategory && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 md:p-8"
            onClick={() => setSelectedCategory(null)}
          >
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: 30, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.97 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="relative w-full max-w-3xl max-h-[85vh] bg-gray-900 border border-gray-800 rounded-3xl overflow-hidden flex flex-col"
            >
              {/* Modal Header */}
              <div className="flex items-center gap-4 px-8 py-6 border-b border-gray-800/60 shrink-0">
                <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center">
                  <selectedCategory.icon className="w-6 h-6 text-green-400" />
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white">{selectedCategory.title}</h2>
                  <p className="text-sm text-gray-500">{selectedCategory.desc}</p>
                </div>
                <button
                  onClick={() => setSelectedCategory(null)}
                  className="w-10 h-10 rounded-xl bg-gray-800 hover:bg-gray-700 flex items-center justify-center transition-colors"
                >
                  <X className="w-5 h-5 text-gray-400" />
                </button>
              </div>

              {/* Modal Content */}
              <div className="overflow-y-auto flex-1 px-8 py-6">
                <div className="space-y-3">
                  {selectedCategory.articles.map((article, idx) => {
                    const isExpanded = expandedArticle === idx;
                    return (
                      <div
                        key={idx}
                        className="bg-gray-800/40 border border-gray-800/60 rounded-2xl overflow-hidden"
                      >
                        <button
                          onClick={() => setExpandedArticle(isExpanded ? null : idx)}
                          className="w-full flex items-center gap-4 p-5 text-left hover:bg-gray-800/60 transition-colors"
                        >
                          <div className="w-8 h-8 rounded-lg bg-green-500/10 flex items-center justify-center shrink-0">
                            <CheckCircle className="w-4 h-4 text-green-400" />
                          </div>
                          <span className="font-medium text-white flex-1">{article.title}</span>
                          <ChevronDown
                            className={`w-5 h-5 text-gray-500 shrink-0 transition-transform duration-300 ${
                              isExpanded ? "rotate-180" : ""
                            }`}
                          />
                        </button>
                        <motion.div
                          initial={false}
                          animate={{ height: isExpanded ? "auto" : 0, opacity: isExpanded ? 1 : 0 }}
                          transition={{ duration: 0.3 }}
                          className="overflow-hidden"
                        >
                          <div className="px-5 pb-5 pl-[4.25rem]">
                            <p className="text-gray-400 text-sm leading-relaxed">
                              {article.content}
                            </p>
                          </div>
                        </motion.div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="px-8 py-5 border-t border-gray-800/60 shrink-0">
                <p className="text-sm text-gray-500">
                  Still need help?{" "}
                  <Link
                    to="/contact"
                    className="text-green-400 hover:text-green-300 font-medium"
                    onClick={() => setSelectedCategory(null)}
                  >
                    Contact our support team
                  </Link>
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
