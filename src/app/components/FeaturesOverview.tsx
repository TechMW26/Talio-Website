import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { Link } from 'react-router';
import { ArrowRight } from 'lucide-react';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { AnimatedButton } from '@/app/components/AnimatedButton';
import { communicationFeatures, coreFeatures } from '@/app/content/featuresOverviewData';

export function FeaturesOverview() {
  usePageMeta('Features', 'Explore Talio\'s productivity utility modules, Mira workflow support, and built-in HRMS add-ons for attendance, leave, payroll, coordination, and team visibility.');

  const heroRef = useRef(null);
  const coreRef = useRef(null);
  const commRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: '-100px' });
  const coreInView = useInView(coreRef, { once: true, margin: '-100px' });
  const commInView = useInView(commRef, { once: true, margin: '-100px' });
  const ctaInView = useInView(ctaRef, { once: true, margin: '-100px' });

  return (
    <div className="bg-black relative transition-colors duration-300">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-[70vh] flex items-center justify-center py-20 md:py-32 overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1920&q=80"
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-gray-950 via-gray-950/80 to-gray-950" />
        </div>
        <div className="absolute inset-0">
          <motion.div
            animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
            transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
            className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-gradient-to-br from-indigo-900/20 via-purple-900/10 to-transparent rounded-full blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="relative flex flex-col items-center text-center z-10 px-6"
        >
          <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-widest mb-8">
            ✦ FEATURES
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tighter text-center" style={{ marginBottom: '1.5rem' }}>
            <span className="text-white">One System for Daily Work </span>
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">and HRMS Add-Ons</span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-xl text-center">
            Talio combines productivity visibility, coordination, Mira, and connected HR workflows so teams can run day-to-day operations from one platform.
          </p>
        </motion.div>
      </section>

      {/* Core Features */}
      <section ref={coreRef} className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={coreInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center "
          >
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">PRODUCTIVITY CORE</span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter leading-[1.05] text-center" style={{ marginBottom: '1rem' }}>
              Daily visibility and execution tools
            </h2>
            <p className="text-gray-400 font-light max-w-lg">
              Track work as it happens, coordinate faster, and keep leaders close to execution without stitching together separate tools.
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
            initial={{ opacity: 0, y: 30 }}
            animate={commInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center "
          >
            <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-gray-500 uppercase tracking-widest mb-6">Mira & Coordination</span>
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter leading-[1.05] text-center" style={{ marginBottom: '1rem' }}>
              Faster coordination with embedded intelligence
            </h2>
            <p className="text-gray-400 font-light max-w-lg">
              Keep communication, alerts, and Mira-driven workflow support inside the same operating layer your team already uses.
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
        <div className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex flex-col items-center text-center"
          >
            <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tighter leading-[1.05] text-center" style={{ marginBottom: '1rem' }}>
              Ready to Get Started?
            </h2>
            <p className="text-gray-400 font-light max-w-lg mb-12">
              See how Talio can replace fragmented visibility, coordination, and HR workflows with one daily-use utility.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link to="/get-started">
                <AnimatedButton label="Start Free Trial" />
              </Link>
              <Link to="/pricing">
                <AnimatedButton label="View Pricing" variant="secondary" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
