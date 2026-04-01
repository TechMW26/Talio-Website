import { useRef } from "react";
import { motion, useInView } from "motion/react";
import { Link } from "react-router";
import { usePageMeta } from '@/app/hooks/usePageMeta';
import {
  DollarSign,
  GraduationCap,
  Headphones,
  Megaphone,
  ArrowRight,
} from "lucide-react";
import { useCompensatedMinWidth } from '@/app/hooks/useZoomCompensatedViewport';

const benefits = [
  { icon: DollarSign, title: "Competitive Commissions", desc: "Earn up to 30% recurring commissions on every deal" },
  { icon: GraduationCap, title: "Partner Training", desc: "Access certification programs and expert training" },
  { icon: Headphones, title: "Dedicated Support", desc: "Get priority access to our partner support team" },
  { icon: Megaphone, title: "Marketing Resources", desc: "Co-branded materials and campaign support" },
];

const programs = [
  {
    title: "Referral Partners",
    badge: null,
    features: [
      "Up to 20% referral commission",
      "No minimum commitment",
      "Marketing materials provided",
    ],
  },
  {
    title: "Reseller Partners",
    badge: "Most Popular",
    features: [
      "Up to 30% margin",
      "White-label options",
      "Sales & technical training",
      "Priority support channel",
    ],
  },
  {
    title: "Technology Partners",
    badge: null,
    features: [
      "API access & documentation",
      "Co-marketing opportunities",
      "Joint GTM support",
    ],
  },
];

const steps = [
  { num: "1", title: "Apply", desc: "Submit partner application" },
  { num: "2", title: "Onboard", desc: "Training and credentials" },
  { num: "3", title: "Grow", desc: "Earn commissions" },
  { num: "4", title: "Succeed", desc: "Access advanced resources" },
];

export function Partners() {
  usePageMeta('Partners', 'Partner with Talio and grow your business. Explore referral, reseller, and technology partner programs with competitive benefits.');
  const hasBenefitsTwoColumnGrid = useCompensatedMinWidth(860);
  const hasProgramsThreeColumnGrid = useCompensatedMinWidth(1320);
  const hasProgramsTwoColumnGrid = useCompensatedMinWidth(900);
  const hasFourStepColumns = useCompensatedMinWidth(1320);
  const hasTwoStepColumns = useCompensatedMinWidth(860);

  const heroRef = useRef(null);
  const benefitsRef = useRef(null);
  const programsRef = useRef(null);
  const processRef = useRef(null);
  const ctaRef = useRef(null);

  const heroInView = useInView(heroRef, { once: true, margin: '-10%' });
  const benefitsInView = useInView(benefitsRef, { once: true, margin: '-10%' });
  const programsInView = useInView(programsRef, { once: true, margin: '-10%' });
  const processInView = useInView(processRef, { once: true, margin: '-10%' });
  const ctaInView = useInView(ctaRef, { once: true, margin: '-10%' });

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero */}
      <section ref={heroRef} className="pt-32 pb-20 text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={heroInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-4xl mx-auto px-6 md:px-8 lg:px-12 flex flex-col items-center"
        >
          <span className="inline-flex items-center gap-2 text-xs md:text-sm font-semibold text-violet-400 uppercase tracking-widest mb-10">
            ✦ PARTNERS
          </span>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-10 leading-[1.05] tracking-tighter text-center">
            <span className="bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
              Grow Together with Talio
            </span>
          </h1>
          <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl text-center">
            Join our partner ecosystem and build a profitable business with Talio.
          </p>
        </motion.div>
      </section>

      {/* Benefits */}
      <section ref={benefitsRef} className="pb-20">
        <div className={`max-w-7xl mx-auto px-6 md:px-8 lg:px-12 grid gap-6 ${hasBenefitsTwoColumnGrid ? 'grid-cols-2' : 'grid-cols-1'}`}>
          {benefits.map((b, i) => (
            <motion.div
              key={b.title}
              initial={{ opacity: 0, y: 30 }}
              animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: i * 0.1 }}
              className="bg-gray-900 border border-gray-800 rounded-3xl p-6 hover:border-gray-700 transition-colors"
            >
              <div className="w-12 h-12 rounded-2xl bg-gray-800 flex items-center justify-center mb-4">
                <b.icon className="w-6 h-6 text-violet-400" />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{b.title}</h3>
              <p className="text-gray-400 text-sm">{b.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Partner Programs */}
      <section ref={programsRef} className="py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={programsInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-16 tracking-tighter leading-[1.05]">Partner Programs</h2>
          <div className={`grid gap-6 ${hasProgramsThreeColumnGrid ? 'grid-cols-3' : hasProgramsTwoColumnGrid ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {programs.map((prog, i) => (
              <motion.div
                key={prog.title}
                initial={{ opacity: 0, y: 30 }}
                animate={programsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.5, delay: i * 0.15 }}
                className={`relative bg-gray-900 border rounded-3xl p-8 flex flex-col ${
                  prog.badge ? "border-violet-500/50" : "border-gray-800"
                }`}
              >
                {prog.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-violet-500 text-xs font-semibold text-white">
                    {prog.badge}
                  </span>
                )}
                <h3 className="text-xl font-bold text-white mb-6">{prog.title}</h3>
                <ul className="space-y-3 flex-1">
                  {prog.features.map((f) => (
                    <li key={f} className="flex items-start gap-3 text-gray-400 text-sm">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                      {f}
                    </li>
                  ))}
                </ul>
                <button className="mt-8 w-full py-3 rounded-xl bg-violet-500 hover:bg-violet-600 text-white font-medium transition-colors">
                  Apply Now
                </button>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* Process */}
      <section ref={processRef} className="py-20 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={processInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-7xl mx-auto px-6 md:px-8 lg:px-12"
        >
          <h2 className="text-4xl md:text-6xl lg:text-7xl font-bold text-center mb-16 tracking-tighter leading-[1.05]">How It Works</h2>
          <div className={`grid gap-6 ${hasFourStepColumns ? 'grid-cols-4' : hasTwoStepColumns ? 'grid-cols-2' : 'grid-cols-1'}`}>
            {steps.map((step, i) => (
              <motion.div
                key={step.title}
                initial={{ opacity: 0, y: 20 }}
                animate={processInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.15 }}
                className="text-center"
              >
                <div className="w-14 h-14 rounded-2xl bg-gray-900 border border-gray-800 flex items-center justify-center mx-auto mb-4">
                  <span className="text-xl font-bold bg-gradient-to-r from-violet-400 to-purple-400 bg-clip-text text-transparent">
                    {step.num}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-1">{step.title}</h3>
                <p className="text-gray-400 text-sm">{step.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CTA */}
      <section ref={ctaRef} className="pb-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={ctaInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-3xl mx-auto px-6 md:px-8 lg:px-12 text-center bg-gray-900 border border-gray-800 rounded-3xl p-12"
        >
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-10 tracking-tighter leading-[1.05] text-center">Ready to Partner with Talio?</h2>
          <p className="text-lg md:text-xl text-gray-400 font-light leading-relaxed mb-12 text-center">
            Join our growing partner network and unlock new revenue streams.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-black font-semibold rounded-full text-base hover:shadow-lg hover:shadow-white/10 transition-shadow duration-300"
          >
            Get Started <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
