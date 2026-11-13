import { lazy, Suspense, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router';
import { motion, useInView, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Check, Folder, ListTodo, Pause, Play, ShieldCheck, UserRound } from 'lucide-react';
import { miraUseCases } from '@/app/content/miraUseCases';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import appIcon from '@/assets/mira/mira-app-icon.webp';
import { miraFaq } from '@/app/content/miraFaq';
import { miraRequestChapters, miraReviewChapters } from '@/app/content/miraScrollChapters';
import { LandingFaq } from './LandingFaq';
import { ParticleChapters } from './ParticleChapters';
import { ParticleIllustration, type ParticleShape } from './ParticleIllustration';
import '@/styles/mira-landing.css';

const RobotHead = lazy(() => import('robot-heads').then(({ RobotHead }) => ({ default: RobotHead })));
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

const miraShapes = ['chat', 'network', 'checklist'] as const satisfies readonly ParticleShape[];

const launchChapters = [
  {
    id: 'mira-request',
    label: 'Request',
    title: 'Say what needs to happen.',
    description: 'Give MIRA the launch dates, task owner and deadline. It can ask for anything it needs to complete the request.',
    visual: (
      <figure className="mira-request-example">
        <figcaption>Example request</figcaption>
        <blockquote>“Set up Partner Launch for the first two weeks of next month. Add Priya and assign her the checklist by day three.”</blockquote>
        <ul aria-label="Details in the request">
          <li><CalendarDays size="1em" aria-hidden="true" /> Launch dates</li>
          <li><UserRound size="1em" aria-hidden="true" /> Priya</li>
          <li><ListTodo size="1em" aria-hidden="true" /> Checklist due day three</li>
        </ul>
      </figure>
    ),
  },
  {
    id: 'mira-context',
    label: 'Context',
    title: 'Find the right person.',
    description: 'MIRA looks up Priya and checks what your role allows. If more than one person matches, pick the right colleague before it assigns the task.',
    visual: (
      <dl className="mira-context-example" aria-label="Context for the launch">
        <div><dt><UserRound size="1.1em" aria-hidden="true" /> Collaborator</dt><dd>Priya · Launch team</dd></div>
        <div><dt><ShieldCheck size="1.1em" aria-hidden="true" /> Your access</dt><dd>Create projects and tasks</dd></div>
        <div><dt><ListTodo size="1.1em" aria-hidden="true" /> Task owner</dt><dd>Priya, once added to the project</dd></div>
      </dl>
    ),
  },
  {
    id: 'mira-action',
    label: 'Action',
    title: 'See exactly what changed.',
    description: 'MIRA creates the project first and adds the checklist to it. If the project can’t be created, the checklist waits. Open the results to check what went through.',
    visual: (
      <ol className="mira-action-example" aria-label="Sample workflow results">
        <li><Folder size="1.1em" aria-hidden="true" /><div><strong>Partner Launch</strong><span>Project created · Priya added</span></div><Check size="1em" aria-hidden="true" /></li>
        <li><ListTodo size="1.1em" aria-hidden="true" /><div><strong>Partner checklist</strong><span>Assigned to Priya · Due day three</span></div><Check size="1em" aria-hidden="true" /></li>
      </ol>
    ),
  },
];

function MiraMascot({ reduceMotion }: { reduceMotion: boolean }) {
  const stage = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const visible = useInView(stage, { initial: true });
  const [size, setSize] = useState(224);
  const [waving, setWaving] = useState(false);
  const [paused, setPaused] = useState(false);
  const animateMascot = visible && !reduceMotion && !paused;

  useEffect(() => {
    if (!stage.current || typeof ResizeObserver === 'undefined') return;
    const observer = new ResizeObserver(([entry]) => {
      setSize(Math.max(112, Math.min(256, Math.round(entry.contentRect.width * 0.49))));
    });
    observer.observe(stage.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function greet() {
    window.clearTimeout(timer.current);
    setWaving(true);
    timer.current = window.setTimeout(() => setWaving(false), 1800);
  }

  return (
    <div className="mira-stage" ref={stage} data-mascot-visible={visible} data-mascot-animated={animateMascot}>
      <div className="mira-stage-grid" aria-hidden="true" />
      <div className="mira-orbit mira-orbit-outer" aria-hidden="true" />
      <div className="mira-orbit mira-orbit-inner" aria-hidden="true" />
      {!reduceMotion && (
        <button
          className="mira-pause"
          type="button"
          aria-label={paused ? 'Play mascot animation' : 'Pause mascot animation'}
          onClick={() => setPaused(!paused)}
        >
          {paused ? <Play size="1em" aria-hidden="true" /> : <Pause size="1em" aria-hidden="true" />}
        </button>
      )}
      <button className="mira-mascot" type="button" aria-label="Say hello to the MIRA mascot" onClick={greet}>
        <Suspense fallback={<img className="mira-mascot-fallback" src={appIcon} width="128" height="128" alt="" />}>
          <RobotHead
            shape="circle"
            state={waving ? 'happy' : 'idle'}
            size={size}
            color="#787878"
            trimColor="#2a2c31"
            screenColor="#e8f2ff"
            antenna={false}
            floorShadow={false}
            speed={0.72}
            interactive={animateMascot}
            paused={!animateMascot}
            aria-hidden="true"
          />
        </Suspense>
      </button>
      <span className="mira-mascot-hint" aria-live="polite">
        <span aria-hidden="true" />{waving ? 'Hello from MIRA' : 'Say hello to MIRA'}
      </span>
    </div>
  );
}

function MiraWorkflow() {
  const track = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: track, offset: ['start 66%', 'end 66%'] });
  const morph = useTransform(scrollYProgress, [0, 0.16, 0.84, 1], [0, 0, 1, 1]);

  return (
    <section className="mira-wrap mira-section mira-story" id="mira-explainer" aria-labelledby="mira-story-heading">
      <header className="mira-explainer">
        <h2 id="mira-story-heading">From one request to a launch checklist.</h2>
        <p>Follow what MIRA needs to know, what it checks, and what it does in Talio.</p>
      </header>
      <div className="mira-flow">
        <div className="mira-flow-visual">
          <ParticleIllustration
            className="mira-flow-particles"
            shapes={miraShapes}
            progress={morph}
            label="A conversation becomes a workspace network, then an assigned checklist"
          />
          <nav className="mira-flow-nav" aria-label="MIRA request stages">
            {launchChapters.map(chapter => <a key={chapter.id} href={`#${chapter.id}`}>{chapter.label}</a>)}
            <span className="mira-flow-line" aria-hidden="true">
              <motion.span style={{ scaleX: reduceMotion ? 1 : morph }} />
            </span>
          </nav>
        </div>
        <div className="mira-flow-chapters" ref={track}>
          {launchChapters.map(chapter => (
            <section key={chapter.id} id={chapter.id} className="mira-flow-chapter" aria-labelledby={`${chapter.id}-heading`}>
              <span className="mira-flow-label">{chapter.label}</span>
              <h3 id={`${chapter.id}-heading`}>{chapter.title}</h3>
              <p>{chapter.description}</p>
              {chapter.visual}
            </section>
          ))}
        </div>
      </div>
    </section>
  );
}

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
      <section className="mira-wrap mira-hero" aria-labelledby="mira-heading">
        <motion.div className="mira-hero-copy" {...reveal}>
          <Link className="mira-back" to="/features"><ArrowLeft size="1em" /> All features</Link>
          <h1 id="mira-heading">Ask MIRA.<br /><em>Move work forward.</em></h1>
          <p>Use Talio’s Super Intelligence (SI) assistant to create a project, assign a task, or set up a review in one conversation.</p>
          <div className="mira-actions">
            <a className="mira-primary" href="#mira-explainer">Follow a request <ArrowDown size="1em" /></a>
            <a className="mira-secondary" href="#mira-demo">Explore use cases <ArrowRight size="1em" /></a>
          </div>
        </motion.div>
        <motion.div className="mira-hero-graphic" {...reveal}><MiraMascot reduceMotion={reduceMotion} /></motion.div>
      </section>

      <MiraWorkflow />

      <ParticleChapters
        className="mira-wrap mira-request-tour"
        id="mira-requests"
        heading="What you can hand off to MIRA."
        chapters={miraRequestChapters}
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

      <ParticleChapters
        className="mira-wrap mira-review-tour particle-chapters-reverse"
        id="mira-review"
        heading="Stay in control of what happens next."
        chapters={miraReviewChapters}
      />

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
