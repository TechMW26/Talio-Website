import { lazy, Suspense, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router';
import { motion, useInView } from 'motion/react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, CalendarDays, Check, Folder, ListTodo, Pause, Play, ShieldCheck, UserRound } from 'lucide-react';
import { miraUseCases } from '@/app/content/miraUseCases';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import appIcon from '@/assets/mira/mira-app-icon.webp';
import { StoryPath, type StoryChapter } from './StoryPath';
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

const launchChapters: StoryChapter[] = [
  {
    id: 'mira-request',
    label: 'The request',
    title: 'Start with the outcome.',
    description: 'You need a project for the partner launch and a checklist for Priya. Say both in one request. Give MIRA the dates, the owner and the due date, or let it ask for the detail it needs.',
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
    label: 'The context',
    title: 'Match the request to your workspace.',
    description: 'MIRA looks up Priya in Talio and checks which actions your role allows. If two people share the name, you can choose the right one before the task is assigned.',
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
    label: 'The result',
    title: 'Turn a plan into assigned work.',
    description: 'MIRA creates the project first, then uses that confirmed project to add the checklist. If an earlier action fails, dependent steps wait. You can review what changed and what still needs attention.',
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
          <h1 id="mira-heading">One request.<br /><em>Work in motion.</em></h1>
          <p>MIRA is the Super Intelligence (SI) assistant in Talio. Ask it to set up a project, assign the next step, or bring the right people into a review.</p>
          <div className="mira-actions">
            <a className="mira-primary" href="#mira-explainer">Follow a request <ArrowDown size="1em" /></a>
            <a className="mira-secondary" href="#mira-demo">Explore use cases <ArrowRight size="1em" /></a>
          </div>
        </motion.div>
        <motion.div className="mira-hero-graphic" {...reveal}><MiraMascot reduceMotion={reduceMotion} /></motion.div>
      </section>

      <section className="mira-wrap mira-section mira-story" id="mira-explainer" aria-labelledby="mira-story-heading">
        <motion.div className="mira-explainer" {...reveal}>
          <h2 id="mira-story-heading">How Super Intelligence works in Talio</h2>
          <p>SI connects a conversation to the work you can see and do in Talio. Follow a sample request from a launch brief to a project with an owner, a due date and an assigned task.</p>
        </motion.div>
        <StoryPath chapters={launchChapters} ariaLabel="Follow a MIRA request" />
      </section>

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
