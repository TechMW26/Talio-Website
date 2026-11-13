import { useRef } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';

export function FeatureArtwork() {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-3%', '5%']);

  return (
    <div className="feature-art" ref={ref}>
      <div className="feature-art-grid" aria-hidden="true" />
      <div className="feature-art-ring" aria-hidden="true" />
      <motion.picture className="feature-art-picture" style={reduced ? undefined : { y }}>
        <img
          src="/landing/workspace.webp"
          srcSet="/landing/workspace-small.webp 480w, /landing/workspace.webp 960w"
          sizes="(max-width: 720px) 90vw, 36rem"
          width={960}
          height={960}
          alt=""
          {...{ fetchpriority: 'high' }}
          decoding="async"
        />
      </motion.picture>
    </div>
  );
}

const route = 'M 40 206 H 108 C 148 206 152 168 175 140 C 200 112 224 112 256 112 H 278 C 313 112 315 72 344 55 C 363 43 382 38 430 38';

export function FeatureRoute({ labels }: { labels: readonly string[] }) {
  const stage = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: stage, offset: ['start 88%', 'end 25%'] });
  const length = useTransform(scrollYProgress, [0, 1], [.23, 1]);

  return (
    <div className="feature-route" ref={stage}>
      <div className="feature-art-grid" aria-hidden="true" />
      <svg viewBox="0 0 470 248" aria-hidden="true" focusable="false">
        <path className="feature-route-track" d={route} />
        <motion.path className="feature-route-draw" d={route} style={{ pathLength: reduced ? 1 : length }} />
        <circle cx="40" cy="206" r="4" />
        <circle cx="256" cy="112" r="4" />
        <circle cx="430" cy="38" r="4" />
      </svg>
      <ol>
        {labels.map((label, index) => <li key={label}><a href={`#step-${index + 1}`}>{label}</a></li>)}
      </ol>
    </div>
  );
}
