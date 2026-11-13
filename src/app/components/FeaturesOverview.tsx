import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowDown, ArrowRight, Search, X } from 'lucide-react';
import { categories, featureHref, productFeatures } from '@/app/content/productFeatures';
import { workspaceScrollChapters } from '@/app/content/workspaceScrollChapters';
import { featureFaqs } from '@/app/content/featureFaqs';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { LandingFaq } from './LandingFaq';
import { ParticleChapters } from './ParticleChapters';
import { FeatureHero } from './FeatureHero';
import '@/styles/product.css';

const workspaceChapters = workspaceScrollChapters.map((chapter, index) => ({
  ...chapter,
  id: index < 7 ? `working-day-${index + 1}` : `team-scenes-${index - 6}`,
  aliases: index === 7 ? ['team-scenes'] : undefined,
}));

export function FeaturesOverview() {
  usePageMeta('Features', 'Explore projects, team chat, people operations and MIRA Super Intelligence in Talio.');
  const [category, setCategory] = useState<(typeof categories)[number]>('All features');
  const [query, setQuery] = useState('');
  const search = query.toLowerCase().trim();
  const filtered = productFeatures.filter(feature =>
    (category === 'All features' || feature.category === category)
    && `${feature.name} ${feature.description}`.toLowerCase().includes(search),
  );

  return (
    <main className="product-page feature-index">
      <FeatureHero
        slug="overview"
        label="The Talio workspace"
        title="Keep work moving."
        description="Run projects, coordinate the team, and turn the next decision into work with MIRA."
        actions={
          <>
            <a href="#working-day" className="product-button">Follow the day <ArrowDown /></a>
            <a href="#explore" className="product-text-link">Browse features <ArrowRight /></a>
          </>
        }
      />
      <ParticleChapters chapters={workspaceChapters} heading="A working day in Talio" id="working-day" flight="wave" />

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
