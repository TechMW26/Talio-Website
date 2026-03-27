import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Link } from 'react-router';
import {
  Clock, DollarSign, CalendarDays, LayoutGrid, Target, Sparkles,
  Bot, MessageSquare, Bell, ArrowRight
} from 'lucide-react';
import { usePageMeta } from '@/app/hooks/usePageMeta';

const coreFeatures = [
  {
    icon: Clock,
    title: 'Smart Attendance',
    description: 'GPS check-ins with geofencing, facial recognition, and real-time tracking for accurate attendance management.',
    gradient: 'from-blue-500 to-cyan-500',
    href: '/features/attendance'
  },
  {
    icon: DollarSign,
    title: 'Auto Payroll',
    description: 'Automated salary calculations, tax deductions, and payslip generation — error-free and on time.',
    gradient: 'from-green-500 to-emerald-500',
    href: '/features/payroll'
  },
  {
    icon: CalendarDays,
    title: 'Leave Management',
    description: 'Smart leave tracking with approval workflows, balance monitoring, and policy compliance.',
    gradient: 'from-orange-500 to-amber-500',
    href: '/features/leaves'
  },
  {
    icon: LayoutGrid,
    title: 'Project Management',
    description: 'Kanban boards, task tracking, deadlines, and team collaboration all in one place.',
    gradient: 'from-purple-500 to-pink-500',
    href: '/features/projects'
  },
  {
    icon: Target,
    title: 'Goals & OKRs',
    description: 'Set company objectives, track key results, and align your team for maximum impact.',
    gradient: 'from-red-500 to-rose-500',
    href: '/features/goals'
  },
  {
    icon: Sparkles,
    title: 'AI Workflows',
    description: 'Automate repetitive tasks with intelligent automation — no code required.',
    gradient: 'from-indigo-500 to-violet-500',
    href: '/features/workflows'
  }
];

const communicationFeatures = [
  {
    icon: Bot,
    title: 'MIRA AI Assistant',
    description: 'Your natural language HR companion that answers questions, generates reports, and automates tasks.',
    gradient: 'from-violet-500 to-purple-500',
    href: '/features/mira-ai'
  },
  {
    icon: MessageSquare,
    title: 'Team Chat',
    description: 'Real-time messaging with channels, direct messages, file sharing, and Talio integration.',
    gradient: 'from-sky-500 to-blue-500',
    href: '/features/team-chat'
  },
  {
    icon: Bell,
    title: 'Smart Notifications',
    description: 'AI-prioritized alerts delivered across multiple channels with custom preferences.',
    gradient: 'from-amber-500 to-orange-500',
    href: '/features/notifications'
  }
];

export function FeaturesOverview() {
  usePageMeta('Features', 'Explore Talio\'s powerful features: smart attendance, automated payroll, leave management, project tracking, OKRs, AI workflows, MIRA AI, team chat, and notifications.');

  const heroRef = useRef(null);
  const coreRef = useRef(null);
  const commRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: '-100px' });
  const coreInView = useInView(coreRef, { once: true, margin: '-100px' });
  const commInView = useInView(commRef, { once: true, margin: '-100px' });
  const ctaInView = useInView(ctaRef, { once: true, margin: '-100px' });

  return (
    <div className="bg-gray-950 relative transition-colors duration-300">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center py-20 md:py-32 overflow-hidden bg-gradient-to-br from-gray-900 via-gray-950 to-indigo-950/30">
        <div className="absolute inset-0">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent rounded-full blur-3xl"
          />
        </div>

        <div className="relative max-w-5xl mx-auto px-6 md:px-8 lg:px-12 text-center z-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-10"
          >
            ✦ FEATURES
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10 leading-[1.05] tracking-tighter text-center"
          >
            <span className="text-white">Everything You Need to </span>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Manage Your Team</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl text-gray-400 leading-relaxed font-light max-w-2xl mx-auto text-center"
          >
            From attendance to AI — a complete suite of tools to streamline your workforce operations.
          </motion.p>
        </div>
      </section>

      {/* Core Features */}
      <section ref={coreRef} className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={coreInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center mb-20 md:mb-28"
          >
            <span className="text-xs md:text-sm font-semibold text-indigo-400 uppercase tracking-widest mb-10">CORE PLATFORM</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tighter mb-10 text-center">
              Six Powerful Modules
            </h2>
            <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl text-center">
              Each module works seamlessly together to give you full control over your workforce.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {coreFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={coreInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link to={feature.href} className="block group">
                  <div className="bg-gray-900/60 border border-gray-800/60 rounded-3xl p-8 h-full hover:border-gray-700/80 hover:bg-gray-900/80 transition-all duration-500">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed mb-4">{feature.description}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-indigo-400 group-hover:gap-3 transition-all">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Communication & AI Features */}
      <section ref={commRef} className="py-20 md:py-32 bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={commInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center mb-20 md:mb-28"
          >
            <span className="text-xs md:text-sm font-semibold text-purple-400 uppercase tracking-widest mb-10">COMMUNICATION & AI</span>
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tighter mb-10 text-center">
              Stay Connected, Work Smarter
            </h2>
            <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl text-center">
              AI-powered communication tools that keep your team aligned and productive.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            {communicationFeatures.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={commInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <Link to={feature.href} className="block group">
                  <div className="bg-gray-800/40 border border-gray-700/50 rounded-3xl p-8 h-full hover:border-gray-600/80 hover:bg-gray-800/60 transition-all duration-500">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 shadow-lg`}>
                      <feature.icon className="w-7 h-7 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed mb-4">{feature.description}</p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-purple-400 group-hover:gap-3 transition-all">
                      Learn more <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="py-20 md:py-32">
        <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-10 tracking-tighter leading-[1.05] text-center">
              Ready to Get Started?
            </h2>
            <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl mx-auto text-center mb-12">
              See how Talio can transform your workforce management. Start with a 14-day free trial.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/get-started">
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 bg-white text-black font-semibold rounded-full text-base hover:shadow-lg hover:shadow-white/10 transition-shadow duration-300"
                >
                  Start Free Trial
                </motion.div>
              </Link>
              <Link to="/pricing">
                <motion.div
                  whileHover={{ scale: 1.03, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  className="px-8 py-4 border border-white/15 text-white font-medium rounded-full text-base hover:bg-white/5 hover:border-white/25 transition-all duration-300"
                >
                  View Pricing
                </motion.div>
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
