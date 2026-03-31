import { motion } from 'motion/react';
import { Link } from 'react-router';
import * as FlagIcons from 'country-flag-icons/react/3x2';
import {
  ArrowRight,
  Bot,
  Calendar,
  CheckCircle2,
  Clock,
  Globe,
  LockKeyhole,
  MessageCircle,
  Shield,
  Sparkles,
  Wallet,
} from 'lucide-react';
import { ComparisonPopupPanel } from '@/app/components/ComparisonPopupPanel';

type FlagCode = keyof typeof FlagIcons;

const workflowColumns = [
  {
    title: 'To Do',
    accent: 'text-amber-300',
    tasks: ['Approve leave requests', 'Review attendance anomalies'],
  },
  {
    title: 'In Progress',
    accent: 'text-sky-300',
    tasks: ['Prepare payroll batch', 'Finalize onboarding checklist'],
  },
  {
    title: 'Review',
    accent: 'text-violet-300',
    tasks: ['Manager approvals', 'MIRA recommendations'],
  },
  {
    title: 'Done',
    accent: 'text-emerald-300',
    tasks: ['Salaries released', 'Goals synced with leadership'],
  },
];

const attendanceHighlights = [
  {
    icon: Calendar,
    title: 'Clock-ins that verify themselves',
    description: 'GPS-backed attendance, instant approvals, and payroll-ready records in one mobile flow.',
  },
  {
    icon: Wallet,
    title: 'Payroll without the handoff chaos',
    description: 'Move from check-in to payout with fewer tabs, fewer exports, and fewer follow-ups.',
  },
  {
    icon: MessageCircle,
    title: 'Managers stay in the loop',
    description: 'Leave requests, exceptions, and nudges surface where decisions actually happen.',
  },
];

const goalCards = [
  { title: 'Customer satisfaction', value: '85%', progress: 85, gradient: 'from-emerald-400 to-teal-400' },
  { title: 'Product launch readiness', value: '60%', progress: 60, gradient: 'from-violet-400 to-fuchsia-400' },
  { title: 'Attrition reduction', value: '45%', progress: 45, gradient: 'from-sky-400 to-cyan-400' },
  { title: 'Cross-team alignment', value: '12 teams', progress: 72, gradient: 'from-amber-400 to-orange-400' },
];

const aiCapabilities = [
  { icon: Bot, title: 'MIRA answers', description: 'Policy, attendance, and people questions in seconds.' },
  { icon: Sparkles, title: 'Smart nudges', description: 'Flag delays, risks, and follow-ups before they become blockers.' },
  { icon: Clock, title: 'Weekly time savings', description: 'Automate repetitive HR operations that eat into the day.' },
  { icon: MessageCircle, title: 'Contextual support', description: 'Bring help, updates, and approvals into one conversation layer.' },
  { icon: Shield, title: 'Trusted decisions', description: 'Human-readable summaries make AI suggestions easier to act on.' },
  { icon: Globe, title: 'Ready for global teams', description: 'Support distributed teams with multilingual, mobile-friendly workflows.' },
];

const privacyFeatures = [
  { icon: LockKeyhole, title: 'End-to-end encryption', description: 'Sensitive workforce data stays encrypted in transit and at rest.' },
  { icon: Shield, title: 'Zero-sharing posture', description: 'Your employee data is not sold, repurposed, or exposed to third parties.' },
  { icon: CheckCircle2, title: 'Role-based access', description: 'Give teams exactly the visibility they need, and nothing more.' },
  { icon: Sparkles, title: 'Enterprise-ready controls', description: 'Built for auditability, compliance, and accountable operations.' },
];

const trustBadges = ['14-day free trial', 'No credit card required', 'Cancel anytime'];

const mobileFlags: FlagCode[] = [
  'US', 'GB', 'DE', 'FR', 'JP',
  'IN', 'BR', 'CN', 'KR', 'AU',
  'ES', 'IT', 'NL', 'SE', 'MX',
  'AE', 'ZA', 'SG', 'CA', 'NZ',
];

function SectionHeading({
  label,
  title,
  subtitle,
  accentClassName,
}: {
  label: string;
  title: string;
  subtitle: string;
  accentClassName: string;
}) {
  return (
    <div className="flex flex-col items-center px-1 text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className={`inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.18em] mb-5 ${accentClassName}`}
      >
        {label}
      </motion.div>
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
        className="max-w-[330px] text-[clamp(2rem,8vw,2.8rem)] font-bold text-white mb-4 leading-[1.02] tracking-tighter text-center"
      >
        {title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="max-w-[330px] text-sm text-gray-400 font-light leading-relaxed text-center"
      >
        {subtitle}
      </motion.p>
    </div>
  );
}

function PrimaryButtonLink({ to, children }: { to: string; children: string }) {
  return (
    <Link
      to={to}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-6 py-3.5 text-sm font-semibold text-black transition hover:bg-gray-100"
    >
      <span>{children}</span>
      <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

function SecondaryButtonLink({ to, children }: { to: string; children: string }) {
  return (
    <Link
      to={to}
      className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/15 bg-white/5 px-6 py-3.5 text-sm font-semibold text-white transition hover:border-white/25 hover:bg-white/10"
    >
      <span>{children}</span>
    </Link>
  );
}

export function MobileHomePage() {
  return (
    <div className="bg-black text-white">
      <section className="relative flex min-h-[100svh] items-center overflow-hidden bg-black pt-[92px] pb-8">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-purple-600/16 blur-3xl" />
          <div className="absolute right-0 top-1/3 h-52 w-52 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(125,91,255,0.10),transparent_35%)]" />
        </div>

        <div className="relative mx-auto flex min-h-[calc(100svh-108px)] w-full items-center px-4">
          <div className="flex w-full flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.18em] text-blue-300"
            >
              ✦ AI Workforce Operating System
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mt-9 text-[clamp(2.8rem,11vw,4.4rem)] font-bold leading-[0.95] tracking-tighter"
            >
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-white">
                Manage Your Team
              </span>
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-purple-500 via-blue-500 to-cyan-400">
                Smarter with AI
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mt-5 max-w-[320px] text-sm font-light leading-relaxed text-gray-400"
            >
              Talio brings attendance, payroll, goals, communication, and AI support into a mobile workflow that is fast to use and easy to trust.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mt-7 flex w-full flex-col gap-3"
            >
              <PrimaryButtonLink to="/get-started">Start Today</PrimaryButtonLink>
              <SecondaryButtonLink to="/pricing">View Plans & Pricing</SecondaryButtonLink>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="mt-5 flex max-w-[320px] flex-wrap items-center justify-center gap-2"
            >
              {trustBadges.map((badge) => (
                <span
                  key={badge}
                  className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] font-medium text-gray-300"
                >
                  {badge}
                </span>
              ))}
            </motion.div>
          </div>
        </div>
      </section>

      <section className="relative py-16 overflow-hidden bg-black">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            label="Integrations"
            title="Replace Your Entire Stack"
            subtitle="One platform to replace Jira, Trello, Asana, and dozens more. Everything your team needs, unified."
            accentClassName="text-purple-400"
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="relative mt-10"
          >
            <div className="pointer-events-none absolute inset-x-8 top-8 h-40 rounded-full bg-purple-600/12 blur-3xl" />
            <ComparisonPopupPanel className="relative z-10" />
          </motion.div>
        </div>
      </section>

      <section className="relative py-16 overflow-hidden bg-black">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            label="Productivity"
            title="Visual boards that keep work moving"
            subtitle="Organize projects, approvals, and execution in a clear workflow that keeps priorities obvious across every team."
            accentClassName="text-blue-400"
          />

          <div className="mt-10 space-y-4">
            {workflowColumns.map((column, index) => (
              <motion.div
                key={column.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="rounded-[2rem] border border-white/10 bg-gray-950/70 p-5"
              >
                <span className={`block text-sm font-semibold uppercase tracking-[0.18em] ${column.accent}`}>
                  {column.title}
                </span>
                <div className="mt-4 space-y-3">
                  {column.tasks.map((task) => (
                    <div key={task} className="rounded-2xl border border-white/8 bg-white/[0.03] px-4 py-4">
                      <span className="block text-sm font-medium text-white">{task}</span>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 overflow-hidden bg-black">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            label="HRMS Features"
            title="Attendance and payroll in one connected flow"
            subtitle="Keep attendance, leave, and payroll actions connected so teams move faster with cleaner approvals and fewer handoffs."
            accentClassName="text-gray-400"
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-10 grid gap-4"
          >
            <div className="w-full rounded-[2.25rem] border border-white/10 bg-gradient-to-b from-gray-900 to-black p-4 shadow-[0_0_40px_rgba(76,29,149,0.18)]">
              <div className="rounded-[1.75rem] border border-white/10 bg-[#090d16] p-5">
                <span className="block text-xs uppercase tracking-[0.18em] text-gray-500">Today</span>
                <span className="mt-3 block text-2xl font-semibold text-white">Checked In</span>
                <span className="mt-1 block text-sm text-gray-400">09:12 AM · Bangalore HQ</span>

                <div className="mt-5 rounded-2xl bg-gradient-to-r from-purple-600/20 to-blue-600/20 p-4">
                  <span className="block text-xs uppercase tracking-[0.18em] text-blue-300">Next action</span>
                  <span className="mt-2 block text-sm font-medium text-white">Payroll batch ready for review</span>
                </div>

                <div className="mt-4 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                    <span className="block text-xs text-gray-500">Attendance</span>
                    <span className="mt-1 block text-sm font-semibold text-white">Synced</span>
                  </div>
                  <div className="rounded-2xl border border-white/8 bg-white/[0.03] p-3">
                    <span className="block text-xs text-gray-500">Approvals</span>
                    <span className="mt-1 block text-sm font-semibold text-white">2 pending</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              {attendanceHighlights.map((item, index) => (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.55, delay: index * 0.08 }}
                  className="rounded-[2rem] border border-white/10 bg-gray-950/70 p-5"
                >
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-purple-500/20">
                      <item.icon className="h-5 w-5 text-blue-400" />
                    </div>
                    <div>
                      <span className="block text-base font-semibold text-white">{item.title}</span>
                      <span className="mt-1 block text-sm text-gray-400">{item.description}</span>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-16 overflow-hidden bg-black">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            label="Performance"
            title="Goals everyone can understand at a glance"
            subtitle="Progress cards replace the denser desktop grid so leaders and teams can scan status without zooming or hunting."
            accentClassName="text-blue-400"
          />

          <div className="mt-10 grid gap-4">
            {goalCards.map((card, index) => (
              <motion.div
                key={card.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.08 }}
                className="rounded-[2rem] border border-white/10 bg-gray-950/75 p-5"
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <span className="block text-sm text-gray-400">{card.title}</span>
                    <span className="mt-2 block text-3xl font-bold tracking-tight text-white">{card.value}</span>
                  </div>
                  <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium text-gray-300">
                    Live
                  </span>
                </div>
                <div className="mt-5 h-2 overflow-hidden rounded-full bg-white/10">
                  <div className={`h-full rounded-full bg-gradient-to-r ${card.gradient}`} style={{ width: `${card.progress}%` }} />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 overflow-hidden bg-black">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            label="AI"
            title="Workforce intelligence that teams can act on"
            subtitle="Useful AI, clearer signals, and action-ready recommendations that support faster decisions across the organization."
            accentClassName="text-gray-400"
          />

          <div className="mt-10 grid grid-cols-2 gap-3">
            {aiCapabilities.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                className="rounded-[1.75rem] border border-white/10 bg-gray-950/75 p-4"
              >
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-violet-500/20 to-blue-500/20">
                  <item.icon className="h-5 w-5 text-violet-300" />
                </div>
                <span className="mt-4 block text-sm font-semibold text-white">{item.title}</span>
                <span className="mt-2 block text-xs leading-relaxed text-gray-400">{item.description}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 overflow-hidden bg-black">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            label="Security"
            title="Great powers come with great privacy"
            subtitle="Protect workforce data with encryption, role-based access, and enterprise-ready controls built for accountable operations."
            accentClassName="text-gray-500"
          />

          <div className="mt-10 space-y-4">
            {privacyFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                className="rounded-[2rem] border border-white/10 bg-gray-950/80 p-5"
              >
                <div className="flex items-start gap-4">
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-emerald-500/15 to-cyan-500/15">
                    <feature.icon className="h-5 w-5 text-emerald-300" />
                  </div>
                  <div>
                    <span className="block text-base font-semibold text-white">{feature.title}</span>
                    <span className="mt-1 block text-sm text-gray-400">{feature.description}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 flex flex-wrap gap-3">
            {['SOC 2 ready', 'AES-256 encryption', 'Role-based access', 'Audit friendly'].map((item) => (
              <span key={item} className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-medium text-gray-300">
                {item}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 overflow-hidden bg-black">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <SectionHeading
            label="Global Reach"
            title="Available in every language"
            subtitle="Support distributed teams with a platform designed to feel familiar, clear, and ready across regions and languages."
            accentClassName="text-gray-400"
          />

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="mt-10 rounded-[2rem] border border-white/10 bg-gray-950/75 p-4"
          >
            <div className="mb-5 flex items-center justify-between gap-4">
              <span className="text-sm font-semibold uppercase tracking-[0.18em] text-cyan-300">99+ languages</span>
              <span className="text-xs text-gray-400">Built for distributed teams</span>
            </div>
            <div className="grid grid-cols-5 gap-3">
              {mobileFlags.map((code, index) => {
                const FlagIcon = FlagIcons[code] as any;

                return (
                  <motion.div
                    key={code}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.35, delay: index * 0.02 }}
                    className="rounded-xl border border-white/10 bg-white/5 p-2"
                  >
                    <FlagIcon className="h-auto w-full rounded-[3px]" />
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="relative py-16 overflow-hidden bg-black">
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6">
          <div className="rounded-[2.5rem] border border-white/10 bg-gradient-to-br from-gray-950 to-[#0c1324] p-6 shadow-[0_0_60px_rgba(59,130,246,0.08)]">
            <SectionHeading
              label="Pricing"
              title="Ready to transform your workforce?"
              subtitle="Start your free trial today or compare plans to find the right fit for your team."
              accentClassName="text-gray-500"
            />

            <div className="mt-8 flex flex-col gap-3">
              <PrimaryButtonLink to="/get-started">Start Today</PrimaryButtonLink>
              <SecondaryButtonLink to="/pricing">Compare Plans</SecondaryButtonLink>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}