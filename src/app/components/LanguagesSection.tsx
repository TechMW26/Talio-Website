import { motion, useInView } from 'motion/react';
import { useRef, useState, useEffect } from 'react';
import { Globe } from 'lucide-react';
import * as FlagIcons from 'country-flag-icons/react/3x2';

type FlagCode = keyof typeof FlagIcons;

/* ── Symmetric rows — each row has the same column count for a clean grid ── */
const ROWS: FlagCode[][] = [
  ['US','GB','DE','FR','JP','IN','BR','CN','KR','AU'],
  ['ES','IT','NL','SE','NO','DK','FI','PL','CZ','AT'],
  ['MX','AR','CL','CO','PE','UY','BO','PY','EC','VE'],
  ['TR','EG','SA','AE','IL','NG','ZA','KE','GH','MA'],
  ['TH','VN','ID','PH','MY','SG','KH','MM','LK','BD'],
  ['RU','UA','RO','HU','RS','BG','HR','GE','AM','GR'],
  ['PT','BE','CH','IE','LU','IS','LT','LV','EE','FJ'],
  ['CA','NZ','JM','TW','PK','ET','IQ','NP','TN','MC'],
];

export function LanguagesSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const [showFlags, setShowFlags] = useState(false);

  // Delay flag entrance by 0.8s after section enters viewport
  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShowFlags(true), 800);
      return () => clearTimeout(timer);
    }
  }, [isInView]);

  return (
    <section className="relative py-20 md:py-28 bg-black overflow-hidden">
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
      </div>

      <div ref={ref} className="relative mx-auto max-w-7xl px-6 md:px-8 lg:px-12">
        {/* Heading */}
        <div className="flex flex-col items-center text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 text-sm font-semibold text-gray-400 uppercase tracking-widest mb-10"
          >
            <Globe className="w-4 h-4" />
            Global Reach
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-white mb-10 leading-[1.05] tracking-tighter text-center"
          >
            Available in{' '}
            <span
              className="text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-blue-400 to-cyan-400"
              style={{ fontFamily: "'DynaPuff', cursive" }}
            >
              Every Language
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl text-center"
          >
            Your global team deserves a platform that speaks their language. Talio supports 99+ languages out of the box.
          </motion.p>
        </div>

        {/* Flag Grid — symmetric, bare icons */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={showFlags ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 1, delay: 0, ease: [0.16, 1, 0.3, 1] }}
          className="mt-16 md:mt-20"
        >
          <div className="flex flex-col items-center gap-5 md:gap-6">
            {ROWS.map((row, rowIdx) => {
              const showLabel = rowIdx === 4;

              return (
                <div key={rowIdx}>
                  {showLabel && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={showFlags ? { opacity: 1, scale: 1 } : {}}
                      transition={{ duration: 0.6, delay: 0.5 }}
                      className="flex items-center justify-center mb-5 md:mb-6"
                    >
                      <span
                        className="text-2xl md:text-3xl lg:text-4xl font-bold text-white tracking-tight"
                        style={{ fontFamily: "'DynaPuff', cursive" }}
                      >
                        99+ languages
                      </span>
                    </motion.div>
                  )}
                  <div className="flex items-center justify-center gap-4 md:gap-5 lg:gap-6">
                    {row.map((code, colIdx) => {
                      const FlagIcon = FlagIcons[code] as any;
                      const flatIdx = rowIdx * 10 + colIdx;

                      return (
                        <motion.div
                          key={`${code}-${flatIdx}`}
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={showFlags ? { opacity: 1, scale: 1 } : {}}
                          transition={{
                            duration: 0.35,
                            delay: flatIdx * 0.012,
                            ease: [0.16, 1, 0.3, 1],
                          }}
                          whileHover={{ scale: 1.2, y: -3 }}
                          className="cursor-default select-none"
                        >
                          <FlagIcon
                            className="w-10 h-auto md:w-12 lg:w-14 rounded-[0.1875rem] md:rounded-[0.25rem]"
                          />
                        </motion.div>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        </motion.div>
      </div>
    </section>
  );
}
