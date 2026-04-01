import { motion } from 'motion/react';
import { Link } from 'react-router';
import { ArrowRight, Check } from 'lucide-react';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { solutions } from '@/app/content/solutionsData';

export function MobileSolutionsPage() {
  usePageMeta('Solutions', 'Talio workforce management solutions for businesses of all sizes. From startups to enterprise, find the right plan for your team.');

  return (
    <div className="min-h-screen bg-gray-950 text-white">
      <section className="relative overflow-hidden pt-28 pb-18">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute left-1/2 top-0 h-72 w-72 -translate-x-1/2 rounded-full bg-teal-500/10 blur-3xl" />
        </div>
        <div className="relative mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
          <div className="mobile-hero-stack flex flex-col items-center text-center">
            <span className="mobile-hero-eyebrow inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-teal-400">
              ✦ Solutions
            </span>
            <h1 className="mobile-hero-title text-[clamp(2.7rem,10vw,4.6rem)] font-bold tracking-tighter leading-[0.98]">
              Built for teams
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-cyan-400">
                of every size
              </span>
            </h1>
            <p className="mobile-hero-copy max-w-md text-base font-light leading-relaxed text-gray-400">
              From startups to enterprises, Talio adapts to the structure, speed, and complexity of your team.
            </p>
          </div>
        </div>
      </section>

      <section className="pb-20">
        <div className="mx-auto grid max-w-7xl gap-5 px-4 md:px-8 lg:px-12">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.55, delay: index * 0.06 }}
              className="rounded-[2rem] border border-white/10 bg-gray-900/60 p-5"
            >
              <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${solution.gradient}`}>
                <solution.icon className="h-6 w-6 text-white" />
              </div>
              <span className="mt-5 block text-2xl font-semibold text-white">{solution.title}</span>
              <span className="mt-2 block text-sm leading-relaxed text-gray-400">{solution.desc}</span>

              <div className="mt-5 flex flex-wrap gap-3">
                {solution.stats.map((stat) => (
                  <div key={stat.label} className="rounded-2xl border border-white/10 bg-white/[0.04] px-4 py-3">
                    <span className={`block text-xl font-bold bg-gradient-to-r ${solution.gradient} bg-clip-text text-transparent`}>
                      {stat.value}
                    </span>
                    <span className="mt-1 block text-[11px] uppercase tracking-[0.14em] text-gray-500">{stat.label}</span>
                  </div>
                ))}
              </div>

              <div className="mt-5 space-y-3">
                {solution.features.map((feature) => (
                  <div key={feature} className="flex items-start gap-3">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
                    <span className="text-sm text-gray-300">{feature}</span>
                  </div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      <section className="pb-28">
        <div className="mx-auto max-w-7xl px-4 md:px-8 lg:px-12">
          <div className="rounded-[2.5rem] border border-white/10 bg-gray-900/60 p-6 text-center">
            <h2 className="text-3xl font-bold tracking-tighter leading-[1.02] text-white">Find the right solution for your team</h2>
            <p className="mt-4 text-sm font-light leading-relaxed text-gray-400">
              Talk to our team and discover the best Talio setup for your organization.
            </p>
            <Link to="/get-started" className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-white px-8 py-4 text-base font-semibold text-black transition hover:bg-gray-100">
              <span>Get Started</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}