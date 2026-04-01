import { motion, useInView } from 'motion/react';
import { useRef, useState } from 'react';
import { Link, useLocation } from 'react-router';
import { ArrowRight, CheckCircle, Loader2, type LucideIcon } from 'lucide-react';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { useCompensatedMinWidth } from '@/app/hooks/useZoomCompensatedViewport';
import { submitLead } from '@/lib/firebase';
import { getPageLabelFromPath } from '@/lib/leadAttribution';

interface FeatureCard {
  icon: LucideIcon;
  title: string;
  description: string;
  details: string[];
}

interface Stat {
  value: string;
  label: string;
}

interface Step {
  step: string;
  title: string;
  description: string;
}

interface FeatureDetailPageProps {
  badge: string;
  title: string;
  titleGradient?: string;
  subtitle: string;
  stats: Stat[];
  features: FeatureCard[];
  steps: Step[];
  testimonial?: {
    quote: string;
    author: string;
    role: string;
  };
  gradientFrom?: string;
  accentColor?: string;
  heroImage?: string;
}

export function FeatureDetailPage({
  badge,
  title,
  titleGradient = 'from-blue-400 to-purple-400',
  subtitle,
  stats,
  features,
  steps,
  testimonial: _testimonial,
  gradientFrom = 'to-black',
  accentColor = 'text-blue-400',
  heroImage
}: FeatureDetailPageProps) {
  usePageMeta(`${badge} — Features`, `${subtitle} Discover how Talio's ${badge.toLowerCase()} features support daily productivity, coordination, and connected HR workflows.`);

  const heroRef = useRef(null);
  const statsRef = useRef(null);
  const featuresRef = useRef(null);
  const stepsRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: '-10%' });
  const statsInView = useInView(statsRef, { once: true, margin: '-10%' });
  const featuresInView = useInView(featuresRef, { once: true, margin: '-10%' });
  const stepsInView = useInView(stepsRef, { once: true, margin: '-10%' });
  const ctaInView = useInView(ctaRef, { once: true, margin: '-10%' });
  const hasFourStatColumns = useCompensatedMinWidth(1200);
  const hasThreeFeatureColumns = useCompensatedMinWidth(1320);
  const hasTwoFeatureColumns = useCompensatedMinWidth(920);
  const hasThreeStepColumns = useCompensatedMinWidth(1180);
  const hasTwoStepColumns = useCompensatedMinWidth(860);
  const hasLeadSplitLayout = useCompensatedMinWidth(1140);

  return (
    <div className="bg-black relative transition-colors duration-300">
      {/* Hero */}
      <section ref={heroRef} className={`relative min-h-[60vh] flex items-center justify-center py-20 md:py-32 overflow-hidden ${!heroImage ? 'bg-black' : ''}`}>
        {heroImage && (
          <div className="absolute inset-0">
            <img
              src={heroImage}
              alt=""
              className="absolute inset-0 w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/55" />
            <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/85 to-black" />
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_42%)]" />
          </div>
        )}

        <div className="relative max-w-5xl mx-auto px-6 md:px-8 lg:px-12 text-center z-10">
          <motion.span
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.2 }}
            className={`inline-flex items-center gap-2 text-xs md:text-sm font-semibold ${accentColor} uppercase tracking-widest mb-10`}
          >
            ✦ {badge}
          </motion.span>
          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 1, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10 leading-[1.05] tracking-tighter text-center"
          >
            <span className="text-white [text-shadow:0_1.125rem_3rem_rgba(0,0,0,0.55)]">{title}</span>
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="text-lg md:text-xl text-gray-400 leading-relaxed font-light max-w-2xl mx-auto text-center"
          >
            {subtitle}
          </motion.p>
        </div>
      </section>

      {/* Stats */}
      <section ref={statsRef} className="py-16 border-b border-gray-800/50">
        <div className="max-w-6xl mx-auto px-6 md:px-8 lg:px-12">
          <div className={`grid gap-8 ${hasFourStatColumns ? 'grid-cols-4' : 'grid-cols-2'}`}>
            {stats.map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={statsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                className="text-center"
              >
                <div className={`text-3xl md:text-4xl font-bold bg-gradient-to-r ${titleGradient} bg-clip-text text-transparent mb-2`}>
                  {stat.value}
                </div>
                <div className="text-sm text-gray-500">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Feature Cards */}
      <section ref={featuresRef} className="py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center "
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tighter mb-10 text-center">
              Key Capabilities
            </h2>
            <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl text-center">
              Explore the features that make this module powerful and easy to use.
            </p>
          </motion.div>

          <div className={`grid gap-6 ${hasThreeFeatureColumns ? 'grid-cols-3' : hasTwoFeatureColumns ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {features.map((feature, i) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 30 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.08 }}
                className="bg-gray-900/60 border border-gray-800/60 rounded-3xl p-8 hover:border-gray-700/80 hover:bg-gray-900/80 transition-all duration-500"
              >
                <div className="w-12 h-12 rounded-xl bg-gray-800 flex items-center justify-center mb-5">
                  <feature.icon className={`w-6 h-6 ${accentColor}`} />
                </div>
                <h3 className="text-lg font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-4">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.details.map((detail, idx) => (
                    <li key={idx} className="flex items-center gap-2 text-sm text-gray-500">
                      <span className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${titleGradient} flex-shrink-0`} />
                      {detail}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section ref={stepsRef} className="py-20 md:py-32 bg-gradient-to-b from-gray-950 to-gray-900">
        <div className="max-w-5xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={stepsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8 }}
            className="flex flex-col items-center text-center "
          >
            <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-10 leading-[1.05] tracking-tighter text-center">
              How It Works
            </h2>
          </motion.div>

          <div className={`grid gap-8 ${hasThreeStepColumns ? 'grid-cols-3' : hasTwoStepColumns ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 30 }}
                animate={stepsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.6, delay: i * 0.15 }}
                className="text-center"
              >
                <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${titleGradient} flex items-center justify-center text-white text-2xl font-bold mb-6 shadow-lg`}>
                  {step.step}
                </div>
                <h3 className="text-xl font-bold text-white mb-3">{step.title}</h3>
                <p className="text-gray-400 leading-relaxed">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Lead Form */}
      <section ref={ctaRef} className="py-20 md:py-32 bg-gradient-to-b from-gray-900 to-gray-950">
        <div className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={ctaInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className={`grid items-center gap-12 ${hasLeadSplitLayout ? 'grid-cols-2 lg:gap-20' : 'grid-cols-1'}`}
          >
            {/* Left - Info */}
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tighter leading-[1.05]">
                Ready to manage your team smarter?
              </h2>
              <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed mb-10">
                Start your free 14-day trial and see the difference AI makes.
              </p>
              <div className="space-y-4">
                {['14-day free trial', 'No credit card required', 'Cancel anytime'].map((benefit) => (
                  <div key={benefit} className="flex items-center gap-3 text-gray-300">
                    <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
                    <span>{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right - Form */}
            <LeadForm source={badge} accentColor={accentColor} titleGradient={titleGradient} />
          </motion.div>
        </div>
      </section>
    </div>
  );
}

/* ─── Lead Form Component ─── */
function LeadForm({ source, accentColor, titleGradient }: { source: string; accentColor: string; titleGradient: string }) {
  const location = useLocation();
  const [formState, setFormState] = useState<'idle' | 'submitting' | 'success'>('idle');
  const hasTwoColumnFormFields = useCompensatedMinWidth(900);
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    companyName: '',
    companySize: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormState('submitting');

    try {
      await submitLead({
        ...formData,
        source: `feature-${source.toLowerCase().replace(/\s+/g, '-')}`,
        sourcePagePath: location.pathname,
        sourcePageName: getPageLabelFromPath(location.pathname),
        submittedAt: new Date().toISOString(),
      });
      setFormState('success');
    } catch {
      setFormState('idle');
    }
  };

  if (formState === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="site-dark-panel rounded-3xl border p-10 text-center"
      >
        <div className={`w-16 h-16 mx-auto rounded-full bg-gradient-to-br ${titleGradient} flex items-center justify-center mb-6`}>
          <CheckCircle className="w-8 h-8 text-white" />
        </div>
        <h3 className="text-2xl font-bold text-white mb-3">You're all set!</h3>
        <p className="text-gray-400">We'll send you login details shortly.</p>
      </motion.div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="site-dark-panel rounded-3xl border p-8 md:p-10 space-y-5">
      <div className={`grid gap-4 ${hasTwoColumnFormFields ? 'grid-cols-2' : 'grid-cols-1'}`}>
        <input
          type="text"
          name="firstName"
          placeholder="First Name"
          required
          value={formData.firstName}
          onChange={handleChange}
          className="site-dark-input w-full px-4 py-3.5 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none transition-colors"
        />
        <input
          type="text"
          name="lastName"
          placeholder="Last Name"
          required
          value={formData.lastName}
          onChange={handleChange}
          className="site-dark-input w-full px-4 py-3.5 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none transition-colors"
        />
      </div>
      <input
        type="email"
        name="email"
        placeholder="Work Email"
        required
        value={formData.email}
        onChange={handleChange}
        className="site-dark-input w-full px-4 py-3.5 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none transition-colors"
      />
      <div className={`grid gap-4 ${hasTwoColumnFormFields ? 'grid-cols-2' : 'grid-cols-1'}`}>
        <input
          type="text"
          name="companyName"
          placeholder="Company Name"
          required
          value={formData.companyName}
          onChange={handleChange}
          className="site-dark-input w-full px-4 py-3.5 rounded-xl text-white placeholder-gray-500 text-sm focus:outline-none transition-colors"
        />
        <select
          name="companySize"
          required
          value={formData.companySize}
          onChange={handleChange}
          className="site-dark-input w-full px-4 py-3.5 rounded-xl text-sm focus:outline-none transition-colors appearance-none"
          style={{ color: formData.companySize ? 'white' : '#6b7280' }}
        >
          <option value="" disabled>Company Size</option>
          <option value="1-10">1-10 employees</option>
          <option value="11-50">11-50 employees</option>
          <option value="51-200">51-200 employees</option>
          <option value="201-500">201-500 employees</option>
          <option value="501+">501+ employees</option>
        </select>
      </div>
      <motion.button
        type="submit"
        disabled={formState === 'submitting'}
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        className="group w-full px-8 py-4 bg-white text-black font-semibold rounded-full text-base hover:shadow-lg hover:shadow-white/10 transition-shadow duration-300 flex items-center justify-center gap-2 disabled:opacity-70 overflow-hidden relative"
      >
        {formState === 'submitting' ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Processing...
          </>
        ) : (
          <span className="relative z-10 flex items-center gap-2">
            <span className="flex overflow-hidden">
              {"Get Started Free".split('').map((char, i) => (
                <span key={i} className="relative inline-flex flex-col h-[1.5em] overflow-hidden">
                  <span className="group-hover:-translate-y-full transition-transform duration-500 ease-[0.22,1,0.36,1]" style={{ transitionDelay: `${i * 0.025}s` }}>
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                  <span className="absolute top-0 left-0 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-[0.22,1,0.36,1]" style={{ transitionDelay: `${i * 0.025}s` }}>
                    {char === ' ' ? '\u00A0' : char}
                  </span>
                </span>
              ))}
            </span>
            <ArrowRight className="w-5 h-5 transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </motion.button>
    </form>
  );
}
