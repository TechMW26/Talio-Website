import { Link, useParams } from 'react-router';
import { ArrowLeft, ArrowRight, Check, Plus } from 'lucide-react';
import { getProductFeature, productFeatures } from '@/app/content/productFeatures';
import { ProductPreview } from './ProductPreview';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import '@/styles/product.css';

export function FeatureDetailPage({ slug }: { slug?: string }) {
  const params = useParams();
  const feature = getProductFeature(slug || params.slug || '');
  usePageMeta(feature ? `${feature.name} — Features` : 'Feature not found', feature?.description || 'Explore what is available in Talio.');
  if (!feature) return <main className="product-page"><div className="product-wrap product-hero"><h1>Let’s find the right feature.</h1><Link className="product-button" to="/features">Explore Talio <ArrowRight size={18} /></Link></div></main>;
  const related = productFeatures.filter(item => item.category === feature.category && item.slug !== feature.slug).slice(0, 3);
  return <main className="product-page">
    <section className="product-wrap product-hero feature-hero">
      <div className="product-hero-copy"><Link className="product-back" to="/features"><ArrowLeft size={15} /> All features</Link><span className="product-eyebrow"><feature.icon size={15} /> {feature.name}</span><h1>{feature.headline}</h1><p className="product-lead">{feature.description}</p><div className="product-actions"><Link to="/get-started" className="product-button">Try Talio <ArrowRight size={17} /></Link><Link to="/contact" className="product-text-link">Walk through it with us <ArrowRight size={16} /></Link></div></div>
      <ProductPreview key={feature.slug} feature={feature} />
    </section>
    <section className="product-wrap product-section">
      <div className="product-section-heading"><span className="product-eyebrow">{feature.eyebrow}</span><h2>Built for the everyday.</h2></div>
      <div className="product-capabilities">{feature.capabilities.map(([title, description], index) => <article key={title}><span className="product-number">0{index + 1}</span><h3>{title}</h3><p>{description}</p></article>)}</div>
    </section>
    <section className="product-wrap product-section"><div className="product-workflow"><div><span className="product-eyebrow">HOW IT FITS</span><h2>A simple way<br />to get going.</h2><p>Start with what you need today.<br />Keep the rest close by.</p></div><ol>{feature.flow.map(([title, description], index) => <li key={title}><span>{index + 1}</span><div><h3>{title}</h3><p>{description}</p></div><Check size={17} /></li>)}</ol></div></section>
    <section className="product-wrap product-section product-faq"><div><span className="product-eyebrow">A FEW USEFUL DETAILS</span><h2>Before you get started.</h2></div><div><details open><summary>What should I know about this feature?<Plus size={18} /></summary><p>{feature.note}</p></details><details><summary>Will everyone in my company see it?<Plus size={18} /></summary><p>Your workspace’s enabled modules and your role determine what you can access. We can walk through the setup with your team.</p></details></div></section>
    <section className="product-wrap product-section"><div className="product-section-heading product-heading-inline"><h2>Works well alongside.</h2><Link to="/features" className="product-text-link">All features <ArrowRight size={16} /></Link></div><div className="product-related">{related.map(item => <Link key={item.slug} to={`/features/${item.slug}`}><item.icon size={22} /><h3>{item.name}</h3><ArrowRight size={18} /></Link>)}</div></section>
    <section className="product-wrap product-endcap"><span className="product-eyebrow">MAKE IT PART OF YOUR DAY</span><h2>See how Talio fits your team.</h2><Link to="/contact" className="product-button">Let’s take a look <ArrowRight size={17} /></Link></section>
  </main>;
}
