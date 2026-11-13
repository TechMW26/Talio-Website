import { useEffect, useId, useRef, useState } from 'react';
import { useMotionValue } from 'motion/react';
import { ArrowLeft, ArrowRight } from 'lucide-react';
import { ParticleIllustration, type ParticleShape } from './ParticleIllustration';
import '@/styles/particle-chapters.css';

export type ScrollChapter = {
  title: string;
  body: string;
  detail: string;
  shape: ParticleShape;
};

export function ParticleChapters({ chapters, heading, id, className }: {
  chapters: readonly ScrollChapter[];
  heading: string;
  id: string;
  className?: string;
}) {
  const titleId = useId();
  const track = useRef<HTMLDivElement>(null);
  const steps = useRef<(HTMLElement | null)[]>([]);
  const phase = useMotionValue(0);
  const [active, setActive] = useState(0);
  const last = Math.max(0, chapters.length - 1);
  const shapes = chapters.map(chapter => chapter.shape);

  useEffect(() => {
    const root = track.current;
    if (!root) return;
    let frame = 0;
    let current = -1;
    let readingLine = 0;

    function update() {
      frame = 0;
      // The current chapter changes at the reading position, independent of its height.
      const first = steps.current[0];
      if (!first) return;
      const visible = steps.current.findIndex(step => step && step.getBoundingClientRect().bottom > readingLine);
      const next = visible < 0 ? last : Math.min(visible, last);
      if (next === current) return;
      current = next;
      phase.set(last ? next / last : 0);
      setActive(next);
    }

    function schedule() {
      if (!frame) frame = requestAnimationFrame(update);
    }

    function measure() {
      const first = steps.current[0];
      if (!first) return;
      readingLine = (parseFloat(getComputedStyle(first).scrollMarginTop) || 0) + 2;
      schedule();
    }

    const observer = new ResizeObserver(measure);
    observer.observe(root);
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', measure);
    measure();
    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', measure);
      cancelAnimationFrame(frame);
    };
  }, [last, phase]);

  function goTo(index: number) {
    steps.current[index]?.scrollIntoView({ block: 'start' });
  }

  const selected = chapters[active] ?? chapters[0];
  if (!selected) return null;
  return (
    <section id={id} className={`particle-chapters${className ? ` ${className}` : ''}`} aria-labelledby={titleId}>
      <h2 id={titleId}>{heading}</h2>
      <div className="particle-chapters-track" ref={track}>
        <figure className="particle-chapters-stage">
          <div className="particle-chapters-visual">
            <ParticleIllustration shapes={shapes} progress={phase} label={`Particle illustration: ${selected.title}`} />
          </div>
          <div className="particle-chapters-meter" aria-hidden="true">
            {chapters.map((chapter, index) => <span key={chapter.title} data-reached={index <= active} />)}
          </div>
          <figcaption className="particle-chapters-caption">
            <span className="particle-chapters-count">{active + 1} / {chapters.length}</span>
            <span className="particle-chapters-current">{selected.title}</span>
            <div className="particle-chapters-controls">
              <button type="button" aria-label="Previous scene" disabled={active === 0} onClick={() => goTo(active - 1)}>
                <ArrowLeft size="1em" aria-hidden="true" />
              </button>
              <button type="button" aria-label="Next scene" disabled={active === last} onClick={() => goTo(active + 1)}>
                <ArrowRight size="1em" aria-hidden="true" />
              </button>
            </div>
          </figcaption>
        </figure>

        <div className="particle-chapters-copy">
          {chapters.map((chapter, index) => {
            const chapterId = `${id}-${index + 1}`;
            return (
              <section
                id={chapterId}
                key={chapter.title}
                ref={element => { steps.current[index] = element; }}
                className="particle-chapter"
                aria-labelledby={`${chapterId}-title`}
                data-active={index === active}
              >
                <div>
                  <h3 id={`${chapterId}-title`}>{chapter.title}</h3>
                  <p>{chapter.body}</p>
                  <p className="particle-chapter-detail">{chapter.detail}</p>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </section>
  );
}
