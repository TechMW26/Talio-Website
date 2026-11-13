import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { motion, useReducedMotion, useScroll, useTransform } from 'motion/react';
import { ArrowDown, ArrowRight, Search, X } from 'lucide-react';
import { categories, featureHref, productFeatures } from '@/app/content/productFeatures';
import { featureFaqs } from '@/app/content/featureFaqs';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { LandingFaq } from './LandingFaq';
import { ParticleIllustration, type ParticleShape } from './ParticleIllustration';
import '@/styles/product.css';

const workspaceShapes: readonly ParticleShape[] = ['workspace', 'project', 'team', 'spark'];

const workspaceStory = [
  {
    title: 'Give the work an owner.',
    description: 'Put the brief in a project. Assign the first draft, add a due date, and keep feedback with the task.',
    href: '/features/projects',
    action: 'Explore projects',
  },
  {
    title: 'Know who’s available.',
    description: 'Check leave balances, submit a request, and see the decision in the same place.',
    href: '/features/leaves',
    action: 'Explore leave & availability',
  },
  {
    title: 'Turn the next step into a task.',
    description: 'Ask MIRA to create the checklist you just agreed on and set a reminder to follow up. Talio checks access for each action.',
    href: '/mira#mira-demo',
    action: 'Try a MIRA scenario',
  },
];

export function FeaturesOverview() {
  usePageMeta('Features', 'Explore projects, team chat, people operations and MIRA Super Intelligence in Talio.');
  const [category, setCategory] = useState<(typeof categories)[number]>('All features');
  const [query, setQuery] = useState('');
  const stage = useRef<HTMLDivElement>(null);
  const art = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: stage, offset: ['start start', 'end 70%'] });
  const { scrollYProgress: artProgress } = useScroll({ target: art, offset: ['start 75%', 'end 30%'] });
  const morph = useTransform([scrollYProgress, artProgress], ([story, visual]: number[]) => Math.max(story, visual));
  const search = query.toLowerCase().trim();
  const filtered = productFeatures.filter(feature =>
    (category === 'All features' || feature.category === category)
    && `${feature.name} ${feature.description}`.toLowerCase().includes(search),
  );

  return (
    <main className="product-page feature-index">
      <div className="product-wrap overview-story" ref={stage}>
        <div className="overview-graphic" ref={art}>
          <ParticleIllustration shapes={workspaceShapes} progress={morph} label="A workspace forms into a project, a team, and MIRA" />
        </div>
        <div className="overview-story-copy">
          <section className="overview-intro" aria-labelledby="overview-title">
            <span className="product-eyebrow">The Talio workspace</span>
            <h1 id="overview-title">Keep work <em>moving.</em></h1>
            <p className="product-lead">
              Run a project, coordinate the team, and hand the next step to MIRA. See how it fits together in one working day.
            </p>
            <div className="product-actions">
              <a href="#working-day" className="product-button">Follow the day <ArrowDown /></a>
              <a href="#explore" className="product-text-link">Browse features <ArrowRight /></a>
            </div>
          </section>
          <div className="overview-chapters" id="working-day">
            <motion.div className="overview-progress" aria-hidden="true" style={{ scaleY: reduced ? 1 : scrollYProgress }} />
            {workspaceStory.map(chapter => (
              <article key={chapter.title}>
                <h2>{chapter.title}</h2>
                <p>{chapter.description}</p>
                <Link to={chapter.href} className="product-text-link">{chapter.action} <ArrowRight /></Link>
              </article>
            ))}
          </div>
        </div>
      </div>

      <section id="explore" className="product-wrap product-section" aria-labelledby="explore-heading">
        <div className="product-section-heading"><h2 id="explore-heading">Find the tool you need.</h2></div>
        <div className="product-tools">
          <div className="product-filters" role="group" aria-label="Filter features">
            {categories.map(item => (
              <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>{item}</button>
            ))}
          </div>
          <div className="product-search">
            <Search aria-hidden="true" />
            <input aria-label="Search features" placeholder="Find a feature…" value={query} onChange={event => setQuery(event.target.value)} />
            {query && <button aria-label="Clear search" onClick={() => setQuery('')}><X /></button>}
          </div>
        </div>
        <p className="product-count" aria-live="polite">
          {filtered.length} {filtered.length === 1 ? 'feature' : 'features'}
        </p>
        <ul className="feature-directory">
          {filtered.map(feature => (
            <li key={feature.slug}>
              <Link to={featureHref(feature.slug)}>
                <feature.icon strokeWidth={1.5} aria-hidden="true" />
                <div><h3>{feature.name}</h3><p>{feature.description}</p></div>
                <ArrowRight className="feature-directory-arrow" aria-hidden="true" />
              </Link>
            </li>
          ))}
        </ul>
        {!filtered.length && (
          <div className="product-empty">
            <h3>No features match your search.</h3>
            <button className="product-button" onClick={() => { setQuery(''); setCategory('All features'); }}>
              Show all features
            </button>
          </div>
        )}
      </section>
      <LandingFaq title="Questions about Talio" items={featureFaqs.overview} />
    </main>
  );
}
