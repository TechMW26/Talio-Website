import { useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router';
import { motion } from 'motion/react';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { miraUseCases } from '@/app/content/miraUseCases';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import appIcon from '@/assets/mira/mira-app-icon.webp';
import { miraFaq } from '@/app/content/miraFaq';
import { miraRequestChapters, miraReviewChapters } from '@/app/content/miraScrollChapters';
import { LandingFaq } from './LandingFaq';
import { ParticleChapters, type ScrollChapter } from './ParticleChapters';
import { MiraHero } from './MiraHero';
import '@/styles/mira-landing.css';

const reducedMotionQuery = '(prefers-reduced-motion: reduce)';

function subscribeToReducedMotion(onChange: () => void) {
  const query = window.matchMedia(reducedMotionQuery);
  query.addEventListener('change', onChange);
  return () => query.removeEventListener('change', onChange);
}

function useReducedMotion() {
  return useSyncExternalStore(
    subscribeToReducedMotion,
    () => window.matchMedia(reducedMotionQuery).matches,
    () => true,
  );
}

const miraStory: readonly ScrollChapter[] = [
  {
    id: 'mira-request',
    title: 'Ask for a launch project and a checklist in the same conversation.',
    body: 'Give MIRA the launch dates, task owner and deadline. It can ask for the missing details.',
    detail: '“Set up Partner Launch for the first two weeks of next month. Add Priya and assign her the checklist by day three.”',
    shape: 'chat',
  },
  {
    id: 'mira-context',
    title: 'Choose the right teammate before MIRA assigns the task.',
    body: 'MIRA finds matching people and checks what your role allows.',
    detail: 'If more than one Priya matches, use the team or project to choose.',
    shape: 'team',
  },
  {
    id: 'mira-action',
    title: 'MIRA creates the project, then adds the checklist.',
    body: 'Open the results to verify both records. If project creation fails, the checklist waits.',
    detail: 'Partner Launch · Checklist assigned to Priya',
    shape: 'checklist',
  },
  ...miraRequestChapters.map((chapter, index) => ({
    ...chapter,
    aliases: index === 0 ? ['mira-requests', 'mira-requests-1'] : [`mira-requests-${index + 1}`],
  })),
  ...miraReviewChapters.map((chapter, index) => ({
    ...chapter,
    aliases: index === 0 ? ['mira-review', 'mira-review-1'] : [`mira-review-${index + 1}`],
  })),
];

export function MiraLanding() {
  usePageMeta('MIRA · Super Intelligence', 'Explore how MIRA Super Intelligence helps automate tasks, review workforce activity and coordinate project follow-ups in Talio.');
  const reduceMotion = useReducedMotion();
  const [selected, setSelected] = useState(0);
  const example = miraUseCases[selected];
  const reveal = reduceMotion ? {} : {
    initial: { opacity: 0.45, y: 20 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, amount: 0.12 },
    transition: { duration: 0.55, ease: 'easeOut' as const },
  };

  return (
    <main className="mira-landing">
      <MiraHero reduceMotion={reduceMotion} />

      <ParticleChapters
        id="mira-explainer"
        heading="From a request to finished work"
        chapters={miraStory}
        flight="rise"
      />

      <section className="mira-wrap mira-section mira-demo" id="mira-demo" aria-labelledby="mira-demo-heading">
        <motion.div className="mira-demo-intro" {...reveal}>
          <h2 id="mira-demo-heading">What would you ask MIRA?</h2>
          <p>Choose a situation to see the request, the response and what you can verify afterward.</p>
        </motion.div>
        <label className="mira-scenario-select">
          Choose a use case
          <select value={selected} onChange={event => setSelected(Number(event.target.value))} aria-controls="mira-sample">
            {miraUseCases.map(({ id, title, type }, index) => (
              <option key={id} value={index}>{title}{type === 'Concept' ? ' · Concept' : ''}</option>
            ))}
          </select>
        </label>
        <motion.div className="mira-options" role="group" aria-label="MIRA use cases" {...reveal}>
          {miraUseCases.map(({ id, title, icon: Icon, type }, index) => (
            <button
              key={id}
              type="button"
              aria-pressed={selected === index}
              aria-controls="mira-sample"
              onClick={() => setSelected(index)}
            >
              <Icon size="1.1em" aria-hidden="true" />
              <span>{title}{type === 'Concept' && <> <small>Concept</small></>}</span>
            </button>
          ))}
        </motion.div>
        <motion.div className="mira-demo-window" id="mira-sample" {...reveal}>
          <div className="mira-demo-window-title">
            <img src={appIcon} alt="" width="36" height="36" loading="lazy" />
            <strong>MIRA</strong>
            <span>Sample conversation</span>
          </div>
          <div className="mira-conversation" role="status">
            <motion.div
              key={example.id}
              initial={reduceMotion ? false : { opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: reduceMotion ? 0 : 0.24 }}
            >
              <div className="mira-scenario-heading">
                <h3>{example.title}</h3>
                <span data-concept={example.type === 'Concept'}>{example.type}</span>
              </div>
              <div className="mira-transcript">
                <div className="mira-prompt"><span>You</span><p>{example.prompt}</p></div>
                <div className="mira-reply"><span>MIRA</span><p>{example.response}</p></div>
              </div>
              <ul className="mira-results" aria-label="Sample outcomes">
                {example.details.map(detail => <li key={detail}>{detail}</li>)}
              </ul>
              <p className="mira-context">{example.context}</p>
            </motion.div>
          </div>
        </motion.div>
      </section>

      <div className="mira-wrap mira-faq"><LandingFaq items={miraFaq} title="MIRA FAQs" /></div>

      <section className="mira-wrap mira-section" aria-labelledby="mira-cta-heading">
        <motion.div className="mira-cta" {...reveal}>
          <div>
            <h2 id="mira-cta-heading">Try MIRA in your workspace.</h2>
            <p>Sign in to Talio to use the MIRA tools your organisation has enabled. Voice and screen tools depend on your device and settings.</p>
          </div>
          <div className="mira-actions">
            <Link className="mira-primary" to="/get-started">Get started <ArrowRight size="1em" /></Link>
            <Link className="mira-secondary" to="/downloads">Download Talio <ArrowUpRight size="1em" /></Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
