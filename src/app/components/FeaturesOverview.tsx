import { useState } from 'react';
import { Link } from 'react-router';
import { ArrowRight, Search, X } from 'lucide-react';
import { categories, productFeatures } from '@/app/content/productFeatures';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { ProductPreview } from './ProductPreview';
import '@/styles/product.css';

export function FeaturesOverview() {
  usePageMeta('Features', 'Explore the real tools in Talio: projects, team chat, meetings, MIRA, attendance, payroll and employee operations.');
  const [category, setCategory] = useState('All features');
  const [query, setQuery] = useState('');
  const filtered = productFeatures.filter(feature => (category === 'All features' || feature.category === category) && `${feature.name} ${feature.description}`.toLowerCase().includes(query.toLowerCase().trim()));
  return <main className="product-page">
    <section className="product-wrap product-hero feature-hero"><div className="product-hero-copy"><span className="product-eyebrow"><i /> THE TALIO WORKSPACE</span><h1>Work has a lot<br />of moving parts.<br /><em>Bring them together.</em></h1><p className="product-lead">The project. The people. The quick question. Talio gives everyday work and people operations a shared home, with MIRA there when you need a hand.</p><div className="product-actions"><a href="#explore" className="product-button">Find your tools <ArrowRight size={17} /></a><Link className="product-text-link" to="/contact">See it with your team <ArrowRight size={16} /></Link></div><div className="product-hero-note"><span>Projects & conversations</span><span>People & HR</span><span>MIRA</span></div></div><ProductPreview feature={productFeatures[0]} /></section>
    <section id="explore" className="product-wrap product-section">
      <div className="product-section-heading product-heading-inline"><div><span className="product-eyebrow">FIND YOUR STARTING POINT</span><h2>A workspace for your working day.</h2></div><p>Explore what’s inside.<br />Choose what fits your team.</p></div>
      <div className="product-tools"><div className="product-filters" aria-label="Filter features">{categories.map(item => <button key={item} aria-pressed={category === item} className={category === item ? 'active' : ''} onClick={() => setCategory(item)}>{item}</button>)}</div><label className="product-search"><Search size={17} /><input aria-label="Search features" placeholder="Find a feature…" value={query} onChange={event => setQuery(event.target.value)} />{query && <button aria-label="Clear search" onClick={() => setQuery('')}><X size={15} /></button>}</label></div>
      <p className="product-count" aria-live="polite">{filtered.length} {filtered.length === 1 ? 'feature' : 'features'}{category !== 'All features' ? ` in ${category.toLowerCase()}` : ' to explore'}</p>
      <div className="product-feature-grid">{filtered.map(feature => <Link className="product-feature-card" to={`/features/${feature.slug}`} key={feature.slug}><div className="product-card-top"><span className="product-icon"><feature.icon size={23} strokeWidth={1.5} /></span><ArrowRight className="product-card-arrow" size={20} /></div><span className="product-card-category">{feature.category}</span><h3>{feature.name}</h3><p>{feature.description}</p><span className="product-card-link">Take a closer look</span></Link>)}</div>
      {!filtered.length && <div className="product-empty"><h3>No match just yet.</h3><p>Try a different word, or browse the complete workspace.</p><button className="product-button" onClick={() => { setQuery(''); setCategory('All features'); }}>Show all features</button></div>}
      <p className="product-footnote">Your company’s enabled modules and your role determine which tools you can use. Need a specific workflow? <Link to="/contact">Let’s check it together.</Link></p>
    </section>
    <section className="product-wrap product-endcap"><span className="product-eyebrow">START WITH YOUR TEAM</span><h2>What would make your day easier?</h2><p>Show us how you work. We’ll help you find the right place to start.</p><Link className="product-button" to="/contact">Talk it through <ArrowRight size={17} /></Link></section>
  </main>;
}
