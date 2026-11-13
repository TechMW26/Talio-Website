import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowDown, ArrowRight, CalendarDays, Layers3, Search, Sparkles, X } from 'lucide-react';
import { categories, featureHref, productFeatures } from '@/app/content/productFeatures';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { FeatureArtwork, FeatureReveal } from './FeatureMotion';
import '@/styles/product.css';

export function FeaturesOverview() {
  usePageMeta('Features', 'Explore projects, team chat, attendance, payroll and MIRA Super Intelligence in Talio.');
  const [category, setCategory] = useState<(typeof categories)[number]>('All features');
  const [query, setQuery] = useState('');
  const search = query.toLowerCase().trim();
  const filtered = productFeatures.filter(feature =>
    (category === 'All features' || feature.category === category)
    && `${feature.name} ${feature.description}`.toLowerCase().includes(search),
  );

  return (
    <main className="product-page feature-index">
      <section className="product-wrap product-hero feature-hero">
        <div className="product-hero-copy feature-hero-enter">
          <span className="product-eyebrow"><i /> The Talio workspace</span>
          <h1>Good work <em>fits together.</em></h1>
          <p className="product-lead">
            Plan the work, take care of your team, and ask MIRA for help along the way.
            Everything has a place in Talio.
          </p>
          <div className="product-actions">
            <a href="#explore" className="product-button">Explore features <ArrowDown /></a>
            <Link to="/mira" className="product-text-link">Meet MIRA <ArrowRight /></Link>
          </div>
        </div>
        <FeatureArtwork priority>
          <div className="feature-art-label feature-art-label-work"><Layers3 /> Projects & tasks</div>
          <div className="feature-art-label feature-art-label-people"><CalendarDays /> People & HR</div>
          <div className="feature-art-label feature-art-label-si"><Sparkles /> MIRA Super Intelligence</div>
        </FeatureArtwork>
      </section>

      <section id="explore" className="product-wrap product-section" aria-labelledby="explore-heading">
        <FeatureReveal className="product-section-heading">
          <h2 id="explore-heading">Find the tools your team needs.</h2>
        </FeatureReveal>
        <div className="product-tools">
          <div className="product-filters" role="group" aria-label="Filter features">
            {categories.map(item => (
              <button key={item} aria-pressed={category === item} onClick={() => setCategory(item)}>
                {item}
              </button>
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
        <div className="product-feature-grid">
          {filtered.map(feature => (
            <FeatureReveal key={feature.slug}>
              <Link className="product-feature-card" to={featureHref(feature.slug)} data-category={feature.category}>
                <div className="product-card-top">
                  <span className="product-icon"><feature.icon strokeWidth={1.6} /></span>
                  <ArrowRight className="product-card-arrow" aria-hidden="true" />
                </div>
                <span className="product-card-category">{feature.category}</span>
                <h3>{feature.name}</h3>
                <p>{feature.description}</p>
              </Link>
            </FeatureReveal>
          ))}
        </div>
        {!filtered.length && (
          <div className="product-empty">
            <h3>No features match your search.</h3>
            <button className="product-button" onClick={() => { setQuery(''); setCategory('All features'); }}>
              Show all features
            </button>
          </div>
        )}
        <p className="product-footnote">
          Your role and your company’s enabled modules determine what you can access.
        </p>
      </section>

      <section className="product-wrap product-section">
        <FeatureReveal className="feature-si-banner">
          <span className="product-icon"><Sparkles /></span>
          <div>
            <h2>What is Super Intelligence?</h2>
            <p>It’s how MIRA connects a request to your work in Talio. Ask it to find a project, summarize available notes, or create a task you have permission to add.</p>
          </div>
          <Link className="product-button" to="/mira">Try a MIRA example <ArrowRight /></Link>
        </FeatureReveal>
      </section>
    </main>
  );
}
