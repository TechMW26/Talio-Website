import { useEffect, useId, useRef, useState } from 'react';
import { useInView, useMotionValueEvent, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { getBrowserZoomFactor } from '@/app/hooks/useZoomCompensatedViewport';
import { ParticleIllustration, type ParticleShape } from './ParticleIllustration';
import StoryLoadingText from './StoryLoadingText';
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
  const stage = useRef<HTMLDivElement>(null);
  const stops = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);
  const inView = useInView(stage, { amount: 0.6 });
  const last = Math.max(0, chapters.length - 1);
  const { scrollYProgress } = useScroll({ target: track, offset: ['start start', 'end end'] });
  const scene = useTransform(scrollYProgress, value => Math.round(value * last));
  const particleProgress = useTransform(scene, index => last ? index / last : 0);

  useMotionValueEvent(scene, 'change', setActive);

  useEffect(() => {
    const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReducedMotion(preference.matches);
    update();
    preference.addEventListener('change', update);
    return () => preference.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    const field = stage.current;
    if (!inView || reducedMotion || !field) return;

    function advanceOnWheel(event: WheelEvent) {
      if (!event.cancelable || event.ctrlKey || event.shiftKey || Math.abs(event.deltaX) >= Math.abs(event.deltaY)) return;

      const index = scene.get();
      const direction = Math.sign(event.deltaY);
      const anchors = stops.current?.children;
      const current = anchors?.[index];
      if (!current || !field || Math.abs(current.getBoundingClientRect().top) > 16) return;

      // A mouse wheel notch can fall within the browser's snap-back range.
      // Keep fine trackpad movement and large swipes on native scroll snapping.
      const next = anchors?.[index + direction];
      const delta = Math.abs(event.deltaY) * getBrowserZoomFactor();
      const notch = event.deltaMode === WheelEvent.DOM_DELTA_LINE || (
        event.deltaMode === WheelEvent.DOM_DELTA_PIXEL && delta >= 64 && delta <= 160
      );
      if (!notch) return;

      event.preventDefault();
      if (next) next.scrollIntoView({ block: 'start', behavior: 'smooth' });
      else window.scrollBy({ top: direction * field.clientHeight * .45, behavior: 'smooth' });
    }

    field.addEventListener('wheel', advanceOnWheel, { passive: false });
    return () => field.removeEventListener('wheel', advanceOnWheel);
  }, [inView, reducedMotion, scene]);

  function goTo(index: number) {
    stops.current?.children[index]?.scrollIntoView({ block: 'start', behavior: 'instant' });
  }

  const selected = chapters[active] ?? chapters[0];
  if (!selected) return null;
  const statement = /[.!?]$/.test(selected.title) ? selected.title : `${selected.title}.`;

  return (
    <section id={id} className="particle-chapters" aria-labelledby={titleId} data-flight={flight}>
      <h2 id={titleId} className="sr-only">{heading}</h2>
      <div className="particle-story-track" ref={track}>
        <div className="particle-story-stage" data-scene={active + 1} ref={stage}>
          <ParticleIllustration
            shapes={chapters.map(chapter => chapter.shape)}
            progress={particleProgress}
            label={`Particle illustration: ${selected.title}`}
            flight={flight}
            className="particle-story-art"
          />
          <p className="particle-story-statement" aria-hidden="true">
            <StoryLoadingText key={active} animate={inView && !reducedMotion}>{statement}</StoryLoadingText>
          </p>
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

        <div className="particle-story-stops" ref={stops}>
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
