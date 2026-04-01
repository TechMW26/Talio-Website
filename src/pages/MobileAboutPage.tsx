import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowRight, Lightbulb, Users, Shield, TrendingUp, Sparkles } from 'lucide-react';
import { usePageMeta } from '@/app/hooks/usePageMeta';

const aboutHighlights = [
  {
    title: 'Unified Flexibility',
    description: 'A complete workforce ecosystem that adapts to different business models without adding operational clutter.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    title: 'Making Ideas Work',
    description: 'We focus on turning ambitious operations into systems that teams can actually use every day.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    title: 'Real Innovation',
    description: 'AI, analytics, and workflow design come together to solve practical workforce problems.',
    gradient: 'from-violet-500 to-indigo-500',
  },
  {
    title: 'Strategic Execution',
    description: 'We care about long-term operational excellence, not just launching features for the sake of novelty.',
    gradient: 'from-orange-500 to-red-500',
  },
];

const values = [
  {
    icon: Lightbulb,
    title: 'Innovation First',
    description: 'We build ahead of the market, but we only ship what improves how real teams operate.',
    gradient: 'from-blue-500 to-cyan-500',
  },
  {
    icon: Users,
    title: 'People Centric',
    description: 'Every workflow starts with the people who use it, not just the dashboard that reports on it.',
    gradient: 'from-purple-500 to-pink-500',
  },
  {
    icon: Shield,
    title: 'Trust & Security',
    description: 'Enterprise-grade protection is a product requirement, not a premium add-on.',
    gradient: 'from-green-500 to-emerald-500',
  },
  {
    icon: TrendingUp,
    title: 'Customer Success',
    description: 'We measure our value by whether Talio helps teams move faster with more confidence.',
    gradient: 'from-orange-500 to-red-500',
  },
];

const stats = [
  { value: 'AI-first', label: 'Product direction' },
  { value: 'Daily-use', label: 'Operating model' },
  { value: 'One stack', label: 'Platform philosophy' },
  { value: 'Ops-ready', label: 'Team fit' },
];

export function MobileAboutPage() {
  usePageMeta('About', 'Learn how Talio is building an AI-powered productivity utility with Mira and HRMS add-ons for modern teams.');

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden pt-28 pb-20">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-blue-600/10 blur-3xl" />
          <div className="absolute right-0 bottom-0 h-56 w-56 rounded-full bg-purple-600/10 blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
          <div className="mobile-hero-stack flex flex-col items-center text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="mobile-hero-eyebrow inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400"
            >
              ✦ About us
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="mobile-hero-title text-[clamp(2.8rem,10vw,4.75rem)] font-bold tracking-tighter leading-[0.98]"
            >
              Building the future
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">
                of workforce productivity
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="mobile-hero-copy max-w-md text-base font-light leading-relaxed text-gray-400"
            >
              Talio is a venture of MW FutureTech, built to turn workforce operations into a more intelligent, measurable, and human-centered system.
            </motion.p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
          <div className="rounded-[2.5rem] border border-white/10 bg-gray-900/60 p-6">
            <span className="text-xs font-semibold uppercase tracking-[0.18em] text-gray-500">Venture story</span>
            <div className="mt-6 grid gap-4">
              <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-5">
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-blue-300">01 Core mission</span>
                <span className="mt-3 block text-lg font-semibold text-white">
                  MW FutureTech acts as the modern catalyst and innovation arm behind Talio.
                </span>
              </div>
              <div className="rounded-[2rem] border border-white/8 bg-white/[0.03] p-5">
                <span className="block text-xs font-semibold uppercase tracking-[0.18em] text-purple-300">02 Our approach</span>
                <span className="mt-3 block text-sm leading-relaxed text-gray-400">
                  We introduce industry-grade software with design, clarity, and execution quality that make advanced operations feel practical on the ground.
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gray-400">
              <Sparkles className="h-4 w-4" /> What we build for
            </span>
            <h2 className="mt-6 text-4xl font-bold tracking-tighter leading-[1.02] text-white">A sharper operating system for modern teams</h2>
          </div>

          <div className="mt-12 grid gap-4">
            {aboutHighlights.map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                className="rounded-[2rem] border border-white/10 bg-gray-900/50 p-5"
              >
                <div className={`h-1.5 w-16 rounded-full bg-gradient-to-r ${item.gradient}`} />
                <span className="mt-5 block text-xl font-semibold text-white">{item.title}</span>
                <span className="mt-2 block text-sm leading-relaxed text-gray-400">{item.description}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
          <div className="grid grid-cols-2 gap-4">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.05 }}
                className="rounded-[2rem] border border-white/10 bg-gray-900/60 p-5 text-center"
              >
                <span className="block text-3xl font-bold tracking-tighter text-white">{stat.value}</span>
                <span className="mt-2 block text-xs uppercase tracking-[0.18em] text-gray-500">{stat.label}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
          <div className="flex flex-col items-center text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-blue-400">The way we work</span>
            <h2 className="mt-6 text-4xl font-bold tracking-tighter leading-[1.02] text-white">What drives us forward</h2>
          </div>

          <div className="mt-12 grid gap-4">
            {values.map((value, index) => (
              <motion.div
                key={value.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
                className="rounded-[2rem] border border-white/10 bg-gray-900/50 p-5"
              >
                <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${value.gradient}`}>
                  <value.icon className="h-5 w-5 text-white" />
                </div>
                <span className="mt-5 block text-xl font-semibold text-white">{value.title}</span>
                <span className="mt-2 block text-sm leading-relaxed text-gray-400">{value.description}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
          <div className="rounded-[2.5rem] border border-white/10 bg-black p-6 text-center shadow-[0_0_60px_rgba(79,70,229,0.18)]">
            <h2 className="text-3xl font-bold tracking-tighter leading-[1.02] text-white">Ready to transform your workforce?</h2>
            <p className="mt-4 text-sm font-light leading-relaxed text-white/85">
              Join the teams already using Talio to operate faster, communicate better, and make decisions with more confidence.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Link to="/get-started" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition hover:bg-gray-100">
                <span>Start Today</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/contact" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/20 bg-white/10 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/15">
                <span>Contact Sales</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}