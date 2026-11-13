import { useId, useRef, useState } from 'react';
import { motion, useMotionValueEvent, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { ParticleIllustration, type ParticleShape } from './ParticleIllustration';
import '@/styles/particle-chapters.css';

export type ScrollChapter = {
  title: string;
  body: string;
  detail: string;
  shape: ParticleShape;
  id?: string;
  aliases?: readonly string[];
};

type StoryFlight = 'rise' | 'sweep' | 'wave' | 'fold';

export function ParticleChapters({ chapters, heading, id, flight = 'rise' }: {
  chapters: readonly ScrollChapter[];
  heading: string;
  id: string;
  flight?: StoryFlight;
}) {
  const titleId = useId();
  const track = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const reducedMotion = useReducedMotion();
  const last = Math.max(0, chapters.length - 1);
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  const scene = useTransform(scrollYProgress, value => value * last);

  useMotionValueEvent(scene, 'change', value => setActive(Math.min(last, Math.max(0, Math.round(value)))));
  const textOpacity = useTransform(scene, value => {
    const distance = Math.abs(value - Math.round(value));
    return distance < .24 ? 1 : 1 - ((distance - .24) / .26) * .26;
  });
  const textY = useTransform(scene, value => {
    const offset = value - Math.round(value);
    return `${-offset * 1.15}rem`;
  });

  function goTo(index: number) {
    const bounds = track.current?.getBoundingClientRect();
    if (!bounds || !last) return;
    const distance = Math.max(0, bounds.height - window.innerHeight);
    window.scrollTo({ top: window.scrollY + bounds.top + distance * index / last, behavior: 'instant' });
  }

  const selected = chapters[active] ?? chapters[0];
  if (!selected) return null;
  const statement = /[.!?]$/.test(selected.title) ? selected.title : `${selected.title}.`;

  return (
    <section id={id} className="particle-chapters" aria-labelledby={titleId} data-flight={flight}>
      <h2 id={titleId} className="sr-only">{heading}</h2>
      <div className="particle-story-track" ref={track}>
        <div className="particle-story-stage" data-scene={active + 1}>
          <motion.p className="particle-story-statement" aria-hidden="true" style={reducedMotion ? undefined : { opacity: textOpacity, y: textY }}>
            {statement}
          </motion.p>
          <ParticleIllustration
            shapes={chapters.map(chapter => chapter.shape)}
            progress={scrollYProgress}
            label={`Particle illustration: ${selected.title}`}
            flight={flight}
            align="bottom"
            className="particle-story-art"
          />
          <nav className="particle-story-controls" aria-label={`${heading} scene navigation`}>
            <button type="button" aria-label="Previous scene" aria-disabled={active === 0} onClick={() => active > 0 && goTo(active - 1)}>
              <ArrowLeft size="1.05em" aria-hidden="true" />
            </button>
            <span aria-live="off" aria-label={`Scene ${active + 1} of ${chapters.length}`}>{active + 1} / {chapters.length}</span>
            <button type="button" aria-label="Next scene" aria-disabled={active === last} onClick={() => active < last && goTo(active + 1)}>
              <ArrowRight size="1.05em" aria-hidden="true" />
            </button>
          </nav>
        </div>

        <div className="particle-story-stops">
          {chapters.map((chapter, index) => {
            const chapterId = chapter.id ?? `${id}-${index + 1}`;
            return (
              <section
                id={chapterId}
                key={chapterId}
                className="particle-chapter"
                aria-labelledby={`${chapterId}-title`}
              >
                {chapter.aliases?.map(alias => <span id={alias} key={alias} className="particle-story-anchor" aria-hidden="true" />)}
                <h3 id={`${chapterId}-title`} className="sr-only">{chapter.title}</h3>
              </section>
            );
          })}
        </div>
      </div>

      <details className="particle-story-transcript">
        <summary>Read the walkthrough <ArrowDown size="1em" aria-hidden="true" /></summary>
        <ol>
          {chapters.map((chapter, index) => (
            <li key={chapter.id ?? index}>
              <h3>{chapter.title}</h3>
              <p>{chapter.body}</p>
              {chapter.detail && <p className="particle-transcript-detail">{chapter.detail}</p>}
            </li>
          ))}
        </ol>
      </details>
    </section>
  );
}
