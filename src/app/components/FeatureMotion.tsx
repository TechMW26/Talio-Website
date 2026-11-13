import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

export function FeatureReveal({ children, className }: { children: ReactNode; className?: string }) {
  const reduced = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduced ? false : { opacity: 0.75, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: reduced ? 0 : 0.55, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

export function FeatureArtwork({ children, priority = false }: { children?: ReactNode; priority?: boolean }) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-3%', '5%']);
  const scale = useTransform(scrollYProgress, [0, 0.55, 1], [0.94, 1, 1.04]);

  return (
    <div className="feature-art" ref={ref}>
      <div className="feature-art-grid" aria-hidden="true" />
      <div className="feature-art-ring" aria-hidden="true" />
      <motion.picture className="feature-art-picture" style={reduced ? undefined : { y, scale }}>
        <img
          src="/landing/workspace.webp"
          srcSet="/landing/workspace-small.webp 480w, /landing/workspace.webp 960w"
          sizes="(max-width: 720px) 90vw, 36rem"
          width={960}
          height={960}
          alt=""
          {...(priority ? { fetchpriority: 'high' } : {})}
          loading={priority ? 'eager' : 'lazy'}
          decoding="async"
        />
      </motion.picture>
      {children}
    </div>
  );
}
