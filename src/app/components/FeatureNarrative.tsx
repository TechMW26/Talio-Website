import { useRef, type ReactNode } from 'react';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ParticleIllustration, type ParticleShape } from './ParticleIllustration';
import type { ProductStoryChapter } from '@/app/content/productFeatures';

export type NarrativeMode = 'split' | 'ledger' | 'timeline' | 'studio' | 'pipeline' | 'insights';

export type FeatureScene = {
  mode: NarrativeMode;
  dialogue?: readonly (readonly [speaker: string, message: string])[];
  shapes: readonly ParticleShape[];
  hook: string;
  example: string;
};

export const featureScenes: Readonly<Record<string, FeatureScene>> = {
  projects: { mode: 'split', shapes: ['project', 'tasks', 'chart'], hook: 'From brief to launch', example: 'Website launch' },
  productivity: { mode: 'insights', shapes: ['clock', 'laptop', 'chart'], hook: 'Make sense of a working day', example: 'Activity review' },
  attendance: { mode: 'timeline', shapes: ['pin', 'clock', 'check'], hook: 'A day, from arrival to correction', example: 'One office day' },
  leaves: { mode: 'pipeline', shapes: ['calendar', 'file', 'check'], hook: 'From time off to a decision', example: 'Friday leave request' },
  payroll: { mode: 'ledger', shapes: ['calendar', 'wallet', 'file'], hook: 'The monthly payroll run', example: 'Example pay period' },
  goals: { mode: 'insights', shapes: ['target', 'chart', 'team'], hook: 'A goal people can act on', example: 'Quarterly review' },
  workflows: { mode: 'pipeline', shapes: ['file', 'workflow', 'check'], hook: 'Trace the decision', example: 'A request in review' },
  'team-chat': {
    mode: 'studio', shapes: ['chat', 'file', 'laptop'], hook: 'Keep the conversation in reach', example: 'Launch team conversation',
    dialogue: [
      ['Maya', 'Can we check the handover before the launch review?'],
      ['Leo', 'I’ve attached the brief. @Maya, could you review the handover section?'],
      ['Maya', 'Done. I’m keeping the chat open while I update the project.'],
    ],
  },
  meetings: { mode: 'timeline', shapes: ['calendar', 'video', 'file'], hook: 'Before, during and after the call', example: 'Launch readiness review' },
  whiteboard: { mode: 'studio', shapes: ['board', 'workflow', 'team'], hook: 'Make an idea visible', example: 'Launch plan on a board' },
  people: { mode: 'split', shapes: ['person', 'team', 'check'], hook: 'Follow the employee journey', example: 'Employee lifecycle' },
  recruitment: { mode: 'pipeline', shapes: ['briefcase', 'person', 'team'], hook: 'From open role to day one', example: 'One hiring round' },
  operations: { mode: 'ledger', shapes: ['laptop', 'headset', 'check'], hook: 'Track equipment and support', example: 'Equipment and support record' },
  documents: { mode: 'ledger', shapes: ['file', 'shield', 'team'], hook: 'Follow a document through Talio', example: 'Company document' },
  notifications: { mode: 'timeline', shapes: ['bell', 'clock', 'tasks'], hook: 'Turn a signal into a next step', example: 'An update that needs attention' },
};

function ExampleDetails({ signals }: { signals: ProductStoryChapter['signals'] }) {
  return (
    <dl className="narrative-signals">
      {signals.map(([name, value]) => <div key={name}><dt>{name}</dt><dd>{value}</dd></div>)}
    </dl>
  );
}

function NarrativeChapter({ chapter, index, children }: {
  chapter: ProductStoryChapter;
  index: number;
  children?: ReactNode;
}) {
  return (
    <article id={`step-${index + 1}`} className="narrative-beat" aria-labelledby={`step-title-${index + 1}`}>
      <p className="narrative-label">{chapter.label}</p>
      <h3 id={`step-title-${index + 1}`}>{chapter.title}</h3>
      <p className="narrative-copy">{chapter.description}</p>
      {children}
    </article>
  );
}

export function FeatureNarrative({ chapters, scene }: {
  chapters: readonly ProductStoryChapter[];
  scene: FeatureScene;
}) {
  const journey = useRef<HTMLDivElement>(null);
  const artwork = useRef<HTMLElement>(null);
  const reducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: journey, offset: ['start 58%', 'end 72%'] });
  const { scrollYProgress: artProgress } = useScroll({ target: artwork, offset: ['start 75%', 'end 35%'] });
  const { mode, shapes, example } = scene;
  const pinned = mode === 'split' || mode === 'ledger';
  const progress = useTransform([scrollYProgress, artProgress], ([story, art]: number[]) =>
    pinned ? Math.max(story, art * 0.75) : art,
  );
  const illustration = (
    <figure className="narrative-illustration" ref={artwork}>
      <ParticleIllustration shapes={shapes} progress={progress} label={`${example} particle illustration`} />
      <figcaption>{example} · Illustration</figcaption>
    </figure>
  );

  const beats = chapters.map((chapter, index) => (
    <NarrativeChapter key={chapter.label} chapter={chapter} index={index}>
      {scene.dialogue?.[index] && (
        <blockquote className="narrative-dialogue">
          <cite>{scene.dialogue[index][0]}</cite>
          <span>{scene.dialogue[index][1]}</span>
        </blockquote>
      )}
      <ExampleDetails signals={chapter.signals} />
    </NarrativeChapter>
  ));

  return (
    <div className={`feature-narrative narrative-${mode}`} ref={journey}>
      {mode === 'timeline' && (
        <>
          {illustration}
          <div className="narrative-time-steps">
            <div className="narrative-time-line" aria-hidden="true">
              <motion.i style={{ scaleX: reducedMotion ? 1 : scrollYProgress }} />
            </div>
            {beats}
          </div>
        </>
      )}

      {mode === 'ledger' && (
        <div className="narrative-ledger-layout">
          <div className="narrative-ledger">
            <div className="narrative-ledger-title"><span>Example record</span><span>{example}</span></div>
            {beats}
          </div>
          {illustration}
        </div>
      )}

      {mode === 'studio' && (
        <>
          <div className="narrative-studio-stage">{illustration}</div>
          <div className={scene.dialogue ? 'narrative-transcript' : 'narrative-canvas-notes'}>{beats}</div>
        </>
      )}

      {mode === 'pipeline' && (
        <>
          {illustration}
          <div className="narrative-pipeline">
            {chapters.map((chapter, index) => (
              <div className="narrative-pipeline-node" key={chapter.label}>
                <span aria-hidden="true">{String(index + 1).padStart(2, '0')}</span>
                <NarrativeChapter chapter={chapter} index={index}><ExampleDetails signals={chapter.signals} /></NarrativeChapter>
              </div>
            ))}
          </div>
        </>
      )}

      {mode === 'insights' && (
        <>
          <div className="narrative-insights-display">
            {illustration}
            <dl className="narrative-insight-key">
              {chapters.map(chapter => (
                <div key={chapter.label}><dt>{chapter.signals[0][0]}</dt><dd>{chapter.signals[0][1]}</dd></div>
              ))}
            </dl>
          </div>
          <div className="narrative-insight-notes">{beats}</div>
        </>
      )}

      {mode === 'split' && (
        <>
          {illustration}
          <div className="narrative-split-notes">{beats}</div>
        </>
      )}
    </div>
  );
}
