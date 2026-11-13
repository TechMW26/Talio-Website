import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowDown, ArrowRight, Search, X } from 'lucide-react';
import { categories, featureHref, productFeatures } from '@/app/content/productFeatures';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { FeatureArtwork } from './FeatureMotion';
import { StoryPath, StorySignals, type StoryChapter } from './StoryPath';
import '@/styles/product.css';

const dayInTalio: StoryChapter[] = [
  {
    id: 'plan-the-work',
    label: 'Plan the work',
    title: 'Give the next step an owner.',
    description: 'A website launch starts with a brief. Put it in a project, assign the first draft, and set a due date. When the team asks what needs review, the answer sits alongside the task and its conversation.',
    visual: <StorySignals signals={[[ 'Project', 'Website refresh' ], [ 'Next up', 'Review the first draft' ], [ 'Owner', 'Design lead' ]]} />,
    children: <Link to="/features/projects" className="product-text-link">Explore projects & tasks <ArrowRight /></Link>,
  },
  {
    id: 'coordinate-the-team',
    label: 'Coordinate the team',
    title: 'Make room for changes in the day.',
    description: 'A teammate requests Friday off. They can see their available balance before submitting, and the person responsible can review the request in Talio. The decision is recorded where the teammate can find it.',
    visual: <StorySignals variation={1} signals={[[ 'Request', 'Friday annual leave' ], [ 'Decision', 'Approved by manager' ]]} />,
    children: <Link to="/features/leaves" className="product-text-link">Explore leave & availability <ArrowRight /></Link>,
  },
  {
    id: 'act-with-mira',
    label: 'Act with MIRA',
    title: 'Turn the follow-up into work.',
    description: 'After the launch review, ask MIRA to create the agreed checklist task, assign it to the project member you name, and set a reminder for the sign-off. Talio applies your permissions to each action.',
    visual: <StorySignals variation={2} signals={[[ 'Task', 'Review launch checklist' ], [ 'Follow-up', 'Personal reminder for sign-off' ]]} />,
    children: <Link to="/mira#mira-demo" className="product-text-link">Try a MIRA example <ArrowRight /></Link>,
  },
];

export function FeaturesOverview() {
  usePageMeta('Features', 'See how a working day fits together in Talio, from projects and team chat to people operations and MIRA Super Intelligence.');
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
          <span className="product-eyebrow">The Talio workspace</span>
          <h1>A working day.<em>One workspace.</em></h1>
          <p className="product-lead">
            Follow a launch from its first brief to the team’s next decision.
            See where projects, people operations, and MIRA fit into the day.
          </p>
          <div className="product-actions">
            <a href="#working-day" className="product-button">Follow the story <ArrowDown /></a>
            <a href="#explore" className="product-text-link">Browse all features <ArrowRight /></a>
          </div>
        </div>
        <FeatureArtwork />
      </section>

      <section className="product-wrap product-section" id="working-day" aria-labelledby="working-day-heading">
        <div className="product-section-heading"><h2 id="working-day-heading">From a plan to the next decision</h2></div>
        <StoryPath chapters={dayInTalio} ariaLabel="A working day in Talio" />
      </section>

      <section id="explore" className="product-wrap product-section" aria-labelledby="explore-heading">
        <div className="product-section-heading"><h2 id="explore-heading">Browse the workspace</h2></div>
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
        <p className="product-footnote">Your role and your company’s enabled modules determine what you can access.</p>
      </section>
    </main>
  );
}
