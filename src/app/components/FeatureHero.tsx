import type { ReactNode } from 'react';
import { particleShapePath, type ParticleShape } from './particleShapes';

type Form = readonly [shape: ParticleShape, x: number, y: number, size: number, weight?: 'primary' | 'secondary'];

const heroForms: Readonly<Record<string, readonly Form[]>> = {
  overview: [['workspace', 57, 105, 380], ['checklist', 365, 36, 151, 'secondary'], ['team', 405, 327, 145]],
  projects: [['project', 46, 81, 390], ['tasks', 359, 185, 190], ['flag', 396, 30, 122, 'secondary']],
  productivity: [['chart', 60, 108, 373], ['clock', 380, 36, 156, 'secondary'], ['laptop', 343, 282, 204]],
  attendance: [['pin', 67, 64, 360], ['clock', 343, 228, 209], ['fingerprint', 394, 34, 122, 'secondary']],
  leaves: [['calendar', 63, 70, 385], ['check', 349, 262, 178], ['sun', 397, 20, 132, 'secondary']],
  payroll: [['wallet', 56, 152, 375], ['file', 345, 40, 184], ['check', 429, 292, 105, 'secondary']],
  goals: [['target', 54, 73, 382], ['chart', 352, 241, 201], ['flag', 395, 22, 124, 'secondary']],
  workflows: [['workflow', 58, 83, 375], ['file', 376, 29, 135, 'secondary'], ['check', 375, 278, 168]],
  'team-chat': [['chat', 47, 85, 405], ['file', 404, 38, 126, 'secondary'], ['check', 391, 311, 144]],
  meetings: [['video', 47, 133, 413], ['calendar', 347, 29, 165, 'secondary'], ['team', 396, 302, 135]],
  whiteboard: [['board', 43, 73, 423], ['spark', 432, 44, 97, 'secondary'], ['layers', 385, 302, 166]],
  people: [['team', 37, 85, 390], ['checklist', 376, 61, 160], ['shield', 404, 293, 137, 'secondary']],
  recruitment: [['briefcase', 40, 126, 409], ['person', 364, 22, 158, 'secondary'], ['check', 384, 282, 151]],
  operations: [['laptop', 28, 163, 455], ['headset', 330, 33, 195], ['check', 435, 306, 105, 'secondary']],
  documents: [['file', 76, 58, 362], ['shield', 342, 217, 196], ['layers', 406, 35, 117, 'secondary']],
  notifications: [['bell', 55, 80, 392], ['clock', 382, 36, 144, 'secondary'], ['inbox', 381, 287, 168]],
};

// Crop each composition to its last visible mark so all artwork ends on the hero baseline.
const heroBaselines: Readonly<Record<string, number>> = {
  overview: 458, projects: 411, productivity: 457, attendance: 426,
  leaves: 431, payroll: 485, goals: 428, workflows: 437,
  'team-chat': 478, meetings: 465, whiteboard: 466, people: 432,
  recruitment: 472, operations: 550, documents: 403, notifications: 462,
};

export function FeatureHero({ slug, label, title, description, actions }: {
  slug: string;
  label: string;
  title: string;
  description: string;
  actions: ReactNode;
}) {
  const forms = heroForms[slug] ?? heroForms.overview;
  return (
    <section className="feature-cinema-hero" aria-labelledby="feature-title">
      <div className="product-wrap feature-cinema-layout">
        <div className="feature-cinema-copy">
          <span className="product-eyebrow">{label}</span>
          <h1 id="feature-title">{title}</h1>
          <p className="product-lead">{description}</p>
          <div className="product-actions">{actions}</div>
        </div>
        <div className="feature-cinema-art">
          <svg viewBox={`0 0 575 ${heroBaselines[slug] ?? heroBaselines.overview}`} fill="none" aria-hidden="true" focusable="false">
            {forms.map(([shape, x, y, size, weight], index) => (
              <g key={shape} transform={`translate(${x} ${y}) scale(${size / 24})`}>
                <path
                  d={particleShapePath(shape)}
                  stroke={weight === 'secondary' ? '#9ca3af' : '#fff'}
                  strokeWidth={index === 0 ? .68 : .58}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </g>
            ))}
          </svg>
        </div>
      </div>
    </section>
  );
}
