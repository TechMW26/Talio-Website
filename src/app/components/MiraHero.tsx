import { lazy, Suspense, useEffect, useRef, useState } from 'react';
import { useInView } from 'motion/react';
import { ArrowDown, ArrowUpRight, Pause, Play } from 'lucide-react';

const RobotHead = lazy(() => import('robot-heads').then(({ RobotHead }) => ({ default: RobotHead })));

function FlightSuit() {
  return (
    <svg className="mira-suit" viewBox="0 0 540 560" aria-hidden="true" focusable="false">
      <path d="M92 343 59 359 38 399v161h63l7-205ZM442 343l36 17 25 44v156h-72l-8-196Z" fill="#17191d" />
      <path d="m170 314-64 16-52 48L22 560h496l-32-182-52-48-64-16Z" fill="#e4e6ea" />
      <path d="m106 330-52 48L22 560h93l20-155 35-91Z" fill="#f4f4f6" />
      <path d="m434 330 52 48 32 182h-92l-21-155-35-91Z" fill="#f4f4f6" />
      <path d="m54 378 67 32 14-5-35-29-32-12Zm432 0-67 32-14-5 35-29 32-12Z" fill="#21232b" />
      <path d="m40 457 77 28-3 14-78-26Zm460 0-77 28 3 14 78-26Z" fill="#969ca9" />
      <path d="m104 460-18 100h18l18-105Zm332 0 18 100h-18l-18-105Z" fill="#b8bdc7" />
      <path d="m157 351 22-29h182l22 29-26 48H183Z" fill="#13151a" />
      <path d="M170 323c18-27 47-41 100-41s82 14 100 41l-20 39H190Z" fill="#eef0f3" />
      <path d="M189 334c23 11 51 16 81 16s58-5 81-16l-7 16c-22 11-46 16-74 16s-52-5-74-16Z" fill="#848c9d" />
      <path d="M105 147q9-18 34-16l22 24v109l-19 22q-35 4-43-21l-7-66q0-31 13-52Zm330 0q-9-18-34-16l-22 24v109l19 22q35 4 43-21l7-66q0-31-13-52Z" fill="#d8dbe1" />
      <path d="m105 168-5 33 5 53 28 5v-87Zm330 0 5 33-5 53-28 5v-87Z" fill="#373b46" />
      <path d="M270 31c84 0 151 66 151 151v41c0 66-60 106-151 106s-151-40-151-106v-41C119 97 186 31 270 31Z" fill="#f1f2f4" />
      <path d="M133 177c3-75 63-134 137-134 58 0 109 35 129 88-28-43-73-70-129-70-59 0-114 34-137 116Z" fill="#fff" />
      <path d="M270 70c72 0 130 50 130 122v31c0 52-55 87-130 87s-130-35-130-87v-31c0-72 58-122 130-122Z" fill="#a1a7b3" />
      <path d="M270 80c67 0 121 45 121 112v28c0 48-50 79-121 79s-121-31-121-79v-28c0-67 54-112 121-112Z" fill="#0b0c0e" />
      <path d="M161 183c7-47 49-85 97-89" fill="none" stroke="#8a92a1" strokeWidth="2" strokeLinecap="round" />
      <path d="M384 229c-6 24-26 43-56 54" fill="none" stroke="#333843" strokeWidth="2" strokeLinecap="round" />
      <path d="M156 295c26 20 63 31 114 31s88-11 114-31" fill="none" stroke="#575e6c" strokeWidth="3" strokeLinecap="round" />
      <path d="m194 399 31-14h90l31 14 18 69-25 19H201l-25-19Z" fill="#fff" />
      <path d="M202 414h136v51H202z" fill="#14161c" />
      <path d="M219 431h62m-62 15h32m44 0h26" fill="none" stroke="#d1d5de" strokeWidth="3" strokeLinecap="round" />
      <circle cx="316" cy="431" r="3.5" fill="#9caefa" />
      <path d="m150 496 48 26h144l48-26m-120 27v37" fill="none" stroke="#9da3af" strokeWidth="2" />
      <path d="M147 560l19-35 26 35Zm246 0-19-35-26 35Z" fill="#c0c5d0" />
    </svg>
  );
}

export function MiraHero({ reduceMotion }: { reduceMotion: boolean }) {
  const portrait = useRef<HTMLDivElement>(null);
  const timer = useRef<number | undefined>(undefined);
  const visible = useInView(portrait, { initial: true });
  const [size, setSize] = useState(210);
  const [waving, setWaving] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (!portrait.current) return;
    const observer = new ResizeObserver(([entry]) => {
      setSize(Math.max(72, Math.min(275, Math.round(entry.contentRect.width * .39))));
    });
    observer.observe(portrait.current);
    return () => observer.disconnect();
  }, []);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  function greet() {
    window.clearTimeout(timer.current);
    setWaving(true);
    timer.current = window.setTimeout(() => setWaving(false), 1800);
  }

  return (
    <section className="mira-hero" aria-labelledby="mira-heading">
      <div className="mira-wrap mira-hero-layout">
        <div className="mira-hero-copy">
          <p className="mira-kicker">MIRA for Talio</p>
          <h1 id="mira-heading">Give MIRA<br />the next step.</h1>
          <p className="mira-hero-description">Ask Talio’s Super Intelligence assistant to turn a conversation into assigned work.</p>
          <div className="mira-actions">
            <a className="mira-primary" href="#mira-explainer">See how it works <ArrowDown size="1em" aria-hidden="true" /></a>
            <a className="mira-secondary" href="#mira-demo">Try an example <ArrowUpRight size="1em" aria-hidden="true" /></a>
          </div>
        </div>

        <div className="mira-portrait" ref={portrait}>
          <FlightSuit />
          <button className="mira-mascot" type="button" aria-label="Say hello to the MIRA mascot" onClick={greet}>
            <Suspense fallback={<span className="mira-mascot-fallback" aria-hidden="true"><i /><i /></span>}>
              <RobotHead
                shape="circle"
                state={waving ? 'happy' : 'idle'}
                size={size}
                color="#505764"
                trimColor="#272b35"
                screenColor="#eef4ff"
                antenna={false}
                floorShadow={false}
                speed={0.62}
                interactive={visible && !reduceMotion && !paused}
                paused={!visible || reduceMotion || paused}
                aria-hidden="true"
              />
            </Suspense>
          </button>
          <div className="mira-portrait-controls">
            <span role="status">{waving ? 'Hello from MIRA' : ''}</span>
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
          </div>
        </div>
      </div>
    </section>
  );
}
