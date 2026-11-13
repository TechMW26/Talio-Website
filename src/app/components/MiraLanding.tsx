import { lazy, Suspense, useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { Link } from 'react-router';
import { motion, useInView } from 'motion/react';
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUpRight, CircleHelp, Pause, Play, Search, ShieldCheck, Sparkles } from 'lucide-react';
import { miraUseCases } from '@/app/content/miraUseCases';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import appIcon from '@/assets/mira/mira-app-icon.webp';
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

const principles = [
  {
    title: 'Understands the request',
    icon: CircleHelp,
    description: 'Talk or type in your own words. MIRA can ask for a project name, a time or another detail it needs to continue.',
  },
  {
    title: 'Uses your workspace',
    icon: Search,
    description: 'MIRA can look up the people, projects and tasks your Talio account can access.',
  },
  {
    title: 'Acts within your access',
    icon: ShieldCheck,
    description: 'For supported requests, MIRA can take a step inside Talio and tell you what happened. Your role still determines what it can do.',
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
      <div className="mira-stage-identity"><img src={appIcon} alt="" width="36" height="36" /> MIRA</div>
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
          <h1 id="mira-heading">Super Intelligence<br />inside <em>Talio.</em></h1>
          <p>Meet MIRA. Turn a request into assigned work, bring the right people into a review, and get the context you need to make a decision.</p>
          <div className="mira-actions">
            <a className="mira-primary" href="#mira-demo">Explore use cases <ArrowDown size="1em" /></a>
            <Link className="mira-secondary" to="/get-started">Get started <ArrowUpRight size="1em" /></Link>
          </div>
        </motion.div>
        <motion.div className="mira-hero-graphic" {...reveal}><MiraMascot reduceMotion={reduceMotion} /></motion.div>
      </section>

      <section className="mira-wrap mira-section" aria-labelledby="mira-explainer">
        <motion.div className="mira-explainer" {...reveal}>
          <h2 id="mira-explainer">What is Super Intelligence?</h2>
          <p>Super Intelligence (SI) is Talio’s name for the capabilities behind MIRA. It connects what you ask in conversation with the work you can see and do in Talio.</p>
        </motion.div>
        <div className="mira-principles">
          {principles.map(({ title, icon: Icon, description }, index) => (
            <motion.article
              key={title}
              className="mira-principle"
              {...reveal}
              transition={{ ...reveal.transition, delay: reduceMotion ? 0 : index * 0.08 }}
            >
              <span className="mira-principle-icon"><Icon size="1.35em" aria-hidden="true" /></span>
              <h3>{title}</h3>
              <p>{description}</p>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="mira-wrap mira-section mira-demo" id="mira-demo" aria-labelledby="mira-demo-heading">
        <motion.div className="mira-demo-intro" {...reveal}>
          <h2 id="mira-demo-heading">What would you ask MIRA?</h2>
          <p>Explore ten sample conversations, from automating a launch to spotting delivery risk.</p>
        </motion.div>
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
              <span>{title}{type === 'Concept' && <small>Concept</small>}</span>
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
              <div className="mira-prompt"><span>You</span><p>{example.prompt}</p></div>
              <div className="mira-reply"><span>MIRA</span><p>{example.response}</p></div>
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
          <Sparkles size="1.6em" aria-hidden="true" />
          <h2 id="mira-cta-heading">Meet MIRA in your workspace.</h2>
          <p>Sign in to Talio to use the MIRA tools your organisation has enabled. Voice and screen tools depend on your device and settings.</p>
          <div className="mira-actions">
            <Link className="mira-primary" to="/get-started">Get started <ArrowRight size="1em" /></Link>
            <Link className="mira-secondary" to="/downloads">Download Talio <ArrowUpRight size="1em" /></Link>
          </div>
        </motion.div>
      </section>
    </main>
  );
}
