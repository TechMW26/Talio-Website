import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { communicationFeatures, coreFeatures } from '@/app/content/featuresOverviewData';

export function MobileFeaturesPage() {
  usePageMeta('Features', 'Explore Talio\'s productivity utility modules, Mira workflow support, and built-in HRMS add-ons for attendance, leave, payroll, coordination, and team visibility.');

  return (
    <div className="min-h-screen bg-black text-white">
      <section className="relative overflow-hidden pt-28 pb-18">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-2 h-72 w-72 -translate-x-1/2 rounded-full bg-indigo-600/12 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
          <div className="mobile-hero-stack flex flex-col items-center text-center">
            <span className="mobile-hero-eyebrow inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-gray-400">
              ✦ Features
            </span>
            <h1 className="mobile-hero-title text-[clamp(2.7rem,10vw,4.6rem)] font-bold tracking-tighter leading-[0.98] text-white">
              One system for daily work
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
                and HRMS add-ons
              </span>
            </h1>
            <p className="mobile-hero-copy max-w-md text-base font-light leading-relaxed text-gray-400">
              Talio combines productivity visibility, coordination, Mira, and connected HR workflows in one daily-use platform.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
          <div className="flex flex-col items-center text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gray-500">Core platform</span>
            <h2 className="mt-6 text-4xl font-bold tracking-tighter leading-[1.02] text-white">Six powerful modules</h2>
          </div>
          <div className="mt-12 grid gap-4">
            {coreFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.05 }}
              >
                <Link to={feature.href} className="block rounded-[2rem] border border-white/10 bg-gray-900/60 p-5 transition hover:border-white/15">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${feature.gradient}`}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="mt-5 block text-xl font-semibold text-white">{feature.title}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-gray-400">{feature.description}</span>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-indigo-400">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-20 bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="mx-auto max-w-7xl px-4 pt-20 md:px-8 lg:px-12">
          <div className="flex flex-col items-center text-center">
            <span className="text-sm font-semibold uppercase tracking-widest text-gray-500">Communication & AI</span>
            <h2 className="mt-6 text-4xl font-bold tracking-tighter leading-[1.02] text-white">Stay connected, work smarter</h2>
          </div>
          <div className="mt-12 grid gap-4">
            {communicationFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55, delay: index * 0.06 }}
              >
                <Link to={feature.href} className="block rounded-[2rem] border border-white/10 bg-gray-800/40 p-5 transition hover:border-white/15">
                  <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${feature.gradient}`}>
                    <feature.icon className="h-5 w-5 text-white" />
                  </div>
                  <span className="mt-5 block text-xl font-semibold text-white">{feature.title}</span>
                  <span className="mt-2 block text-sm leading-relaxed text-gray-400">{feature.description}</span>
                  <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-purple-400">
                    Learn more <ArrowRight className="h-4 w-4" />
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="pb-28 pt-20">
        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
          <div className="rounded-[2.5rem] border border-white/10 bg-gray-900/60 p-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter leading-[1.02] text-white">Ready to get started?</h2>
            <p className="mt-4 text-sm font-light leading-relaxed text-gray-400">
              See how Talio can replace fragmented visibility, coordination, and HR workflows with one daily-use utility.
            </p>
            <div className="mt-8 flex flex-col gap-3">
              <Link to="/get-started" className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition hover:bg-gray-100">
                <span>Start Free Trial</span>
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/pricing" className="inline-flex w-full items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-8 py-4 text-base font-semibold text-white transition hover:bg-white/10">
                <span>View Pricing</span>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}