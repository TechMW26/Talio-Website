import { motion, useInView, useScroll, useTransform, useMotionValue, useSpring, AnimatePresence } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { ShieldCheck, Lock, Eye, EyeOff, Database, Server, Fingerprint } from 'lucide-react';
import Lottie from 'lottie-react';

const PRIVACY_GRADIENT =
  'linear-gradient(90deg, #3E86C6 0%, #A666AA 24.78%, #EC4492 49.45%, #EE4454 74.21%, #F05427 100%)';

const PRIVACY_FEATURES = [
  {
    icon: Lock,
    title: 'End-to-End Encryption',
    description: 'AES-256 encryption at rest and TLS 1.3 in transit. Your data is locked tight.',
    color: 'from-blue-500/20 to-cyan-500/20',
    borderColor: 'border-blue-500/20',
    iconColor: 'text-blue-400',
  },
  {
    icon: EyeOff,
    title: 'Zero Data Sharing',
    description: 'We never sell, share, or monetize your data. Period.',
    color: 'from-purple-500/20 to-pink-500/20',
    borderColor: 'border-purple-500/20',
    iconColor: 'text-purple-400',
  },
  {
    icon: Database,
    title: 'SOC 2 Compliant',
    description: 'Enterprise-grade infrastructure with continuous compliance monitoring.',
    color: 'from-emerald-500/20 to-teal-500/20',
    borderColor: 'border-emerald-500/20',
    iconColor: 'text-emerald-400',
  },
  {
    icon: Fingerprint,
    title: 'Role-Based Access',
    description: 'Granular permissions ensure only the right people see the right data.',
    color: 'from-orange-500/20 to-amber-500/20',
    borderColor: 'border-orange-500/20',
    iconColor: 'text-orange-400',
  },
];

export function PrivacySection() {
  const ref = useRef(null);
  const sectionRef = useRef<HTMLElement>(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });
  const [lottieData, setLottieData] = useState<object | null>(null);
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  // Load Lottie JSON
  useEffect(() => {
    fetch('/lock-unlock.json')
      .then((res) => res.json())
      .then(setLottieData)
      .catch(() => {});
  }, []);

  // Scroll-mapped Lottie frame control
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });

  // Map scroll to Lottie frame (0 → 1 through the section)
  const lottieProgress = useTransform(scrollYProgress, [0.15, 0.65], [0, 1]);
  const smoothProgress = useSpring(lottieProgress, { stiffness: 80, damping: 20 });

  // Lottie ref for frame control
  const lottieRef = useRef<any>(null);

  useEffect(() => {
    return smoothProgress.on('change', (v) => {
      if (lottieRef.current) {
        const totalFrames = lottieRef.current.getDuration(true) || 75;
        lottieRef.current.goToAndStop(Math.round(v * totalFrames), true);
      }
    });
  }, [smoothProgress]);

  // Interactive glow position
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
    mouseY.set(e.clientY - rect.top);
  };

  return (
    <section
      ref={sectionRef}
      className="relative py-24 md:py-32 bg-black overflow-hidden"
      onMouseMove={handleMouseMove}
    >
      {/* Background effects */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Ambient glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-to-r from-blue-600/5 via-purple-600/5 to-pink-600/5 blur-3xl" />
      </div>

      <div ref={ref} className="relative max-w-7xl mx-auto px-6 md:px-8 lg:px-12">
        {/* Top section: Lottie + Heading side by side */}
        <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16 mb-20">
          {/* Left - Lottie Animation */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-48 h-48 md:w-64 md:h-64 lg:w-72 lg:h-72 flex-shrink-0"
          >
            {/* Glow ring behind the lock */}
            <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-2xl animate-pulse" />
            <div className="absolute inset-2 rounded-full border border-white/[0.06] bg-white/[0.02] backdrop-blur-sm" />
            <div className="relative w-full h-full flex items-center justify-center">
              {lottieData && (
                <Lottie
                  lottieRef={lottieRef}
                  animationData={lottieData}
                  autoplay={false}
                  loop={false}
                  className="w-32 h-32 md:w-44 md:h-44 lg:w-48 lg:h-48"
                />
              )}
            </div>
          </motion.div>

          {/* Right - Heading */}
          <div className="flex flex-col items-center lg:items-start text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-widest mb-10"
            >
              <ShieldCheck className="w-4 h-4" />
              Privacy First
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
              className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tighter"
            >
              Great powers come
              <br />
              <span className="text-white">with great </span>
              <span
                className="bg-clip-text text-transparent"
                style={{ backgroundImage: PRIVACY_GRADIENT }}
              >
                privacy.
              </span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-xl mt-8"
            >
              Your data is your greatest asset. We protect it with full encryption,
              zero sharing, and absolute control in your hands.
            </motion.p>
          </div>
        </div>

        {/* Feature Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {PRIVACY_FEATURES.map((feature, i) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              onMouseEnter={() => setHoveredCard(i)}
              onMouseLeave={() => setHoveredCard(null)}
              className={`group relative rounded-2xl border ${feature.borderColor} bg-white/[0.02] backdrop-blur-sm p-6 md:p-8 transition-all duration-500 cursor-default overflow-hidden ${
                hoveredCard === i ? 'border-white/20 bg-white/[0.04] scale-[1.02]' : 'hover:border-white/10'
              }`}
            >
              {/* Hover glow */}
              <AnimatePresence>
                {hoveredCard === i && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-40 pointer-events-none`}
                  />
                )}
              </AnimatePresence>

              <div className="relative z-10 flex items-start gap-5">
                <div className={`flex-shrink-0 w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center border border-white/[0.06] transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
                  <feature.icon className={`w-6 h-6 ${feature.iconColor}`} />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-white transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-500 leading-relaxed group-hover:text-gray-400 transition-colors">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Bottom trust bar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.7 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-8 md:gap-12"
        >
          {[
            { icon: Server, label: 'SOC 2 Type II' },
            { icon: Lock, label: 'AES-256 Encryption' },
            { icon: Eye, label: 'GDPR Compliant' },
            { icon: ShieldCheck, label: '99.9% Uptime SLA' },
          ].map((badge) => (
            <div key={badge.label} className="flex items-center gap-2.5 text-sm text-gray-500">
              <badge.icon className="w-4 h-4 text-gray-600" />
              {badge.label}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
