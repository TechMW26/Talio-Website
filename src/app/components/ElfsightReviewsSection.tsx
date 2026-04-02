import { useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';
import { Star } from 'lucide-react';

const ELFSIGHT_SCRIPT_ID = 'elfsight-platform-script';
const ELFSIGHT_SCRIPT_SRC = 'https://elfsightcdn.com/platform.js';
const ELFSIGHT_WIDGET_CLASS = 'elfsight-app-eb5085a4-6285-48e0-b117-937f8cad048f';

function GoogleLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.76h3.56c2.08-1.92 3.28-4.74 3.28-8.09z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.76c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

type ElfsightReviewsSectionProps = {
  eyebrow?: string;
  title?: string;
  subtitle?: string;
  sectionClassName?: string;
  containerClassName?: string;
};

export function ElfsightReviewsSection({
  eyebrow = '✦ Google Reviews',
  title = 'See What Customers Say',
  subtitle = 'Live Google reviews from teams already using Talio.',
  sectionClassName = 'relative bg-black py-20 md:py-28 overflow-hidden',
  containerClassName = 'mx-auto max-w-7xl px-6 md:px-8 lg:px-12',
}: ElfsightReviewsSectionProps) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, margin: '-10%' });

  useEffect(() => {
    if (typeof window === 'undefined') {
      return undefined;
    }

    const existingScript = document.getElementById(ELFSIGHT_SCRIPT_ID) as HTMLScriptElement | null;

    if (existingScript) {
      return undefined;
    }

    const script = document.createElement('script');
    script.id = ELFSIGHT_SCRIPT_ID;
    script.src = ELFSIGHT_SCRIPT_SRC;
    script.async = true;
    document.body.appendChild(script);

    return undefined;
  }, []);

  return (
    <section ref={sectionRef} className={sectionClassName}>
      {/* ── Ambient glow orbs ── */}
      <div className="pointer-events-none absolute inset-0">
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5 }}
          className="absolute -top-32 left-1/4 h-[28rem] w-[28rem] rounded-full bg-purple-600/[0.06] blur-[120px]"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="absolute -bottom-24 right-1/4 h-[22rem] w-[22rem] rounded-full bg-blue-600/[0.06] blur-[100px]"
        />
      </div>

      <div className={containerClassName}>
        {/* ── Heading group ── */}
        <div className="flex flex-col items-center px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-widest text-gray-500 mb-10"
          >
            {eyebrow}
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white leading-[1.05] tracking-tighter text-center mb-10"
          >
            {title}
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-2xl text-lg md:text-xl text-gray-400 font-light leading-relaxed text-center"
          >
            {subtitle}
          </motion.p>
        </div>

        {/* ── Trust badge row ── */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.22 }}
          className="mt-10 flex items-center justify-center gap-6"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-white/[0.08] bg-white/[0.03] backdrop-blur-sm pl-4 pr-5 py-2.5">
            <GoogleLogo className="w-5 h-5 flex-shrink-0" />
            <div className="flex gap-0.5">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
              ))}
            </div>
            <span className="text-sm font-medium text-white/70">5.0 on Google</span>
          </div>
        </motion.div>
      </div>

      {/* ── Widget — full width, directly under heading ── */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={isInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.9, delay: 0.3, ease: [0.16, 1, 0.3, 1] }}
        className="relative mt-12"
      >
        <div
          className={ELFSIGHT_WIDGET_CLASS}
          data-elfsight-app-lazy
        />
        {/* Patch over Elfsight branding badge */}
        <div className="absolute bottom-[2.25rem] left-1/2 -translate-x-1/2 z-10 w-72 h-20 rounded-full bg-[#111]" />
      </motion.div>
    </section>
  );
}
