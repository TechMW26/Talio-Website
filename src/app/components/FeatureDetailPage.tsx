import { Link, useParams } from 'react-router';
import { ArrowLeft, ArrowRight, Check, Plus } from 'lucide-react';
import { featureHref, getProductFeature, productFeatures } from '@/app/content/productFeatures';
import { ProductPreview } from './ProductPreview';
import { FeatureArtwork, FeatureReveal } from './FeatureMotion';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import '@/styles/product.css';

export function FeatureDetailPage({ slug }: { slug?: string }) {
  const params = useParams();
  const feature = getProductFeature(slug || params.slug || '');
  usePageMeta(feature ? `${feature.name} — Features` : 'Feature not found', feature?.description || 'Explore what is available in Talio.');
  if (!feature) {
    return (
      <main className="product-page">
        <div className="product-wrap product-hero">
          <h1>Feature not found.</h1>
          <Link className="product-button" to="/features">Browse all features <ArrowRight /></Link>
        </div>
      </main>
    );
  }

  const related = productFeatures.filter(item => item.category === feature.category && item.slug !== feature.slug).slice(0, 3);

  return (
    <main className="product-page feature-detail" data-category={feature.category}>
      <section className="product-wrap product-hero feature-hero">
        <div className="product-hero-copy feature-hero-enter">
          <Link className="product-back" to="/features"><ArrowLeft /> All features</Link>
          <span className="product-eyebrow"><feature.icon /> {feature.name}</span>
          <h1>{feature.headline.replace('\n', ' ')}</h1>
          <p className="product-lead">{feature.description}</p>
          <div className="product-actions">
            <Link to="/get-started" className="product-button">Try Talio <ArrowRight /></Link>
            <Link to="/contact" className="product-text-link">See it with your team <ArrowRight /></Link>
          </div>
        </div>
        <div className="feature-preview-stage">
          <div className="feature-art-grid" aria-hidden="true" />
          <FeatureReveal><ProductPreview key={feature.slug} feature={feature} /></FeatureReveal>
        </div>
      </section>

      <section className="product-wrap product-section">
        <FeatureReveal className="product-section-heading">
          <h2>What you can do</h2>
        </FeatureReveal>
        <div className="product-capabilities">
          {feature.capabilities.map(([title, description]) => (
            <FeatureReveal className="feature-capability" key={title}>
              <span className="product-icon"><Check /></span>
              <h3>{title}</h3>
              <p>{description}</p>
            </FeatureReveal>
          ))}
        </div>
      </section>

      <section className="product-wrap product-section">
        <div className="product-workflow">
          <FeatureArtwork />
          <FeatureReveal className="feature-workflow-copy">
            <h2>How it works</h2>
            <ol>
              {feature.flow.map(([title, description]) => (
                <li key={title}>
                  <div><h3>{title}</h3><p>{description}</p></div>
                </li>
              ))}
            </ol>
          </FeatureReveal>
        </div>
      </section>

      <section className="product-wrap product-section product-faq">
        <FeatureReveal><h2>Before you start</h2></FeatureReveal>
        <FeatureReveal>
          <details open>
            <summary>What does this feature need? <Plus /></summary>
            <p>{feature.note}</p>
          </details>
          <details>
            <summary>Will everyone in my company see it? <Plus /></summary>
            <p>Your role and your workspace’s enabled modules determine what you can access.</p>
          </details>
        </FeatureReveal>
      </section>

      <section className="product-wrap product-section">
        <FeatureReveal className="product-section-heading product-heading-inline">
          <h2>Explore related features</h2>
          <Link to="/features" className="product-text-link">All features <ArrowRight /></Link>
        </FeatureReveal>
        <div className="product-related">
          {related.map(item => (
            <Link key={item.slug} to={featureHref(item.slug)}>
              <item.icon /><span>{item.name}</span><ArrowRight />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
