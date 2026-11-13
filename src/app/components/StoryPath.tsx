import { useId, useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll } from 'motion/react';
import '@/styles/story-path.css';

export type StoryChapter = {
  id: string;
  label: string;
  title: string;
  description: string;
  visual?: ReactNode;
  children?: ReactNode;
};

export function StoryPath({ chapters, ariaLabel = 'Story chapters' }: {
  chapters: readonly StoryChapter[];
  ariaLabel?: string;
}) {
  const track = useRef<HTMLDivElement>(null);
  const gradientId = useId();
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 72%', 'end 64%'] });

  return (
    <div className="story-path">
      <nav className="story-chapter-nav" aria-label={ariaLabel}>
        {chapters.map(chapter => <a key={chapter.id} href={`#${chapter.id}`}>{chapter.label}</a>)}
      </nav>
      <div className="story-track" ref={track}>
        <svg className="story-spine" viewBox="0 0 32 800" preserveAspectRatio="none" aria-hidden="true" focusable="false">
          <defs>
            <linearGradient id={gradientId} x1="0" x2="0" y1="0" y2="800" gradientUnits="userSpaceOnUse">
              <stop offset="0%" stopColor="#ddc7ff" />
              <stop offset="52%" stopColor="#aa86f4" />
              <stop offset="100%" stopColor="#a7eed1" />
            </linearGradient>
          </defs>
          <path className="story-spine-track" d="M 15 0 V 800" />
          <motion.path
            className="story-spine-draw"
            d="M 15 0 V 800"
            stroke={`url(#${gradientId})`}
            style={{ pathLength: reducedMotion ? 1 : scrollYProgress }}
          />
        </svg>
        {chapters.map(chapter => (
          <article className="story-chapter" id={chapter.id} key={chapter.id} aria-labelledby={`${chapter.id}-heading`}>
            <motion.span
              className="story-junction"
              aria-hidden="true"
              initial={reducedMotion ? false : { opacity: .45 }}
              whileInView={{ opacity: 1 }}
              viewport={{ margin: '0px 0px -18% 0px' }}
              transition={{ duration: .3 }}
            />
            <div className="story-chapter-copy">
              <p className="story-chapter-label">{chapter.label}</p>
              <h3 id={`${chapter.id}-heading`}>{chapter.title}</h3>
              <p className="story-chapter-description">{chapter.description}</p>
              {chapter.children && <div className="story-chapter-extra">{chapter.children}</div>}
            </div>
            {chapter.visual && <div className="story-chapter-visual">{chapter.visual}</div>}
          </article>
        ))}
      </div>
    </div>
  );
}

const signalLines = [
  'M2 83 H48 Q74 83 93 63 L138 21 Q157 3 180 3 H308',
  'M2 66 H53 Q78 66 94 50 L115 29 Q127 17 145 17 H180 Q201 17 222 9 Q240 3 257 3 H308',
  'M2 83 H50 Q75 83 89 69 L110 48 Q125 33 145 33 H199 Q216 33 233 19 Q251 3 275 3 H308',
];

/** A schematic for example records. The line does not encode measured data. */
export function StorySignals({ signals, variation = 0 }: {
  signals: readonly (readonly [label: string, value: string])[];
  variation?: number;
}) {
  const ref = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 87%', 'end 56%'] });
  const line = signalLines[variation % signalLines.length];

  return (
    <figure ref={ref} className="story-signals">
      <figcaption>Illustrative workspace</figcaption>
      <svg viewBox="0 0 310 88" className="story-signal-line" aria-hidden="true" focusable="false">
        <path className="story-signal-track" d={line} />
        <motion.path className="story-signal-draw" d={line} style={{ pathLength: reducedMotion ? 1 : scrollYProgress }} />
        <circle cx="2" cy={variation % 3 === 1 ? 66 : 83} r="2" />
        <circle cx="307" cy="3" r="3" />
      </svg>
      <dl>
        {signals.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </figure>
  );
}
