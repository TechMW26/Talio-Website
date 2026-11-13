import { useRef, useState } from 'react';
import { Link } from 'react-router';
import { useScroll } from 'motion/react';
import { ArrowDown, ArrowRight, Search, X } from 'lucide-react';
import { categories, featureHref, productFeatures } from '@/app/content/productFeatures';
import { workspaceScrollChapters } from '@/app/content/workspaceScrollChapters';
import { featureFaqs } from '@/app/content/featureFaqs';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { LandingFaq } from './LandingFaq';
import { ParticleChapters } from './ParticleChapters';
import { ParticleIllustration, type ParticleShape } from './ParticleIllustration';
import '@/styles/product.css';

const workspaceShapes: readonly ParticleShape[] = ['workspace', 'project', 'team', 'spark'];

export function FeaturesOverview() {
  usePageMeta('Features', 'Explore projects, team chat, people operations and MIRA Super Intelligence in Talio.');
  const [category, setCategory] = useState<(typeof categories)[number]>('All features');
  const [query, setQuery] = useState('');
  const stage = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: stage, offset: ['start 10%', 'end 45%'] });
  const search = query.toLowerCase().trim();
  const filtered = productFeatures.filter(feature =>
    (category === 'All features' || feature.category === category)
    && `${feature.name} ${feature.description}`.toLowerCase().includes(search),
  );

  return (
    <main className="product-page feature-index">
      <div className="product-wrap overview-story" ref={stage}>
        <div className="overview-graphic">
          <ParticleIllustration shapes={workspaceShapes} progress={scrollYProgress} label="A workspace forms into a project, a team, and MIRA" />
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
        </div>
      </div>

      <ParticleChapters chapters={workspaceScrollChapters.slice(0, 7)} heading="Take a launch from brief to review" id="working-day" />
      <ParticleChapters chapters={workspaceScrollChapters.slice(7)} heading="Keep the team moving around the work" id="team-scenes" className="particle-chapters-reverse" />

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
