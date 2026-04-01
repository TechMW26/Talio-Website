import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Sparkles } from 'lucide-react';

export function PricingCTA() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <section className="relative py-24 md:py-32 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.15) 0.0625rem, transparent 0.0625rem)',
            backgroundSize: '2rem 2rem',
          }}
        />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[43.75rem] h-[31.25rem] bg-gradient-to-br from-violet-600/10 via-blue-500/8 to-cyan-400/5 rounded-full blur-[8.75rem]" />
      </div>

      <div ref={ref} className="relative mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
        <div className="flex flex-col items-center text-center">
          {/* Label */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-500 uppercase tracking-widest mb-10"
          >
            <Sparkles className="w-4 h-4" />
            Experience Talio
          </motion.div>

          {/* Heading */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-8 leading-[1.05] tracking-tighter text-center"
          >
            Ready to run{' '}
            <br className="hidden md:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400">
              work and HR together?
            </span>
          </motion.h2>

          {/* Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-500 font-light leading-relaxed max-w-xl text-center"
          >
            Start your free trial and see how Talio can replace fragmented visibility, coordination, and HR workflows with one daily-use utility.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center gap-4 mt-10"
          >
            <Link to="/pricing">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="group relative inline-flex items-center gap-3 px-8 py-4 rounded-2xl font-semibold text-white text-base overflow-hidden"
                style={{
                  background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 50%, #3b82f6 100%)',
                  boxShadow: '0 0 1.875rem rgba(139,92,246,0.3), 0 0 3.75rem rgba(99,102,241,0.15)',
                }}
              >
                {/* Shimmer */}
                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                  <div
                    className="absolute inset-0"
                    style={{
                      background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.15) 45%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0.15) 55%, transparent 60%)',
                      animation: 'shimmer 2s infinite',
                    }}
                  />
                </div>
                Get Started Free
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </motion.button>
            </Link>

            <Link to="/pricing">
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-semibold text-zinc-400 text-base border border-white/10 hover:border-white/20 hover:text-white transition-colors duration-300"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                View Plans & Pricing
              </motion.button>
            </Link>
          </motion.div>

          {/* Trust bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-6 mt-10 text-zinc-500 text-sm"
          >
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Free 14-day trial
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              No credit card
            </span>
            <span className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
              Cancel anytime
            </span>
          </motion.div>
        </div>
      </div>

      {/* Shimmer keyframe */}
      <style>{`
        @keyframes shimmer {
          0% { transform: translateX(-150%); }
          100% { transform: translateX(150%); }
        }
      `}</style>
    </section>
  );
}
