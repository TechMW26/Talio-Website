import { motion, useInView } from 'motion/react';
import { useRef } from 'react';
import { ShieldCheck } from 'lucide-react';

const PRIVACY_GRADIENT =
  'linear-gradient(90deg, #3E86C6 0%, #A666AA 24.78%, #EC4492 49.45%, #EE4454 74.21%, #F05427 100%)';

export function PrivacySection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-80px' });

  return (
    <section className="relative py-20 md:py-28 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div
          className="absolute inset-0 opacity-[0.02]"
          style={{
            backgroundImage:
              'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
      </div>

      <div ref={ref} className="relative max-w-[900px] mx-auto px-6 md:px-8 lg:px-12">
        <div className="flex flex-col items-center text-center">
          {/* Icon */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.6 }}
            className="w-14 h-14 rounded-2xl flex items-center justify-center border border-white/10 mb-8"
            style={{
              background: 'linear-gradient(135deg, rgba(62,134,198,0.12) 0%, rgba(236,68,146,0.08) 100%)',
            }}
          >
            <ShieldCheck className="w-7 h-7 text-white/70" />
          </motion.div>

          {/* Heading — "Great powers come" + "with great privacy." */}
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tighter text-center"
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

          {/* Sub-text blocks */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-zinc-500 font-light leading-relaxed max-w-2xl text-center mt-8"
          >
            Your data is your greatest asset. We protect it with full encryption,
            zero sharing, and absolute control in your hands.
          </motion.p>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-lg md:text-xl text-zinc-500 font-light leading-relaxed max-w-2xl text-center mt-4"
          >
            Stay in control — from your first employee to your thousandth,
            and everything after.
          </motion.p>
        </div>
      </div>
    </section>
  );
}
