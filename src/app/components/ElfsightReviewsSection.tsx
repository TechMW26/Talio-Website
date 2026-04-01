import { useEffect, useRef } from 'react';
import { motion, useInView } from 'motion/react';

const ELFSIGHT_SCRIPT_ID = 'elfsight-platform-script';
const ELFSIGHT_SCRIPT_SRC = 'https://elfsightcdn.com/platform.js';
const ELFSIGHT_WIDGET_CLASS = 'elfsight-app-eb5085a4-6285-48e0-b117-937f8cad048f';

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
      <div className={containerClassName}>
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

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="mt-14 rounded-[2rem] border border-white/10 bg-white/[0.03] p-4 md:p-6"
        >
          <div
            className={ELFSIGHT_WIDGET_CLASS}
            data-elfsight-app-lazy
          />
        </motion.div>
      </div>
    </section>
  );
}