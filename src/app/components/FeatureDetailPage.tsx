import { Link, useParams } from 'react-router';
import { ArrowDown, ArrowLeft, ArrowRight, Plus } from 'lucide-react';
import { featureHref, getProductFeature, productFeatures } from '@/app/content/productFeatures';
import { ProductPreview } from './ProductPreview';
import { FeatureRoute } from './FeatureMotion';
import { StoryPath, StorySignals } from './StoryPath';
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
  const chapters = feature.story.map((chapter, index) => ({
    id: `step-${index + 1}`,
    label: chapter.label,
    title: chapter.title,
    description: chapter.description,
    visual: <StorySignals signals={chapter.signals} variation={index} />,
  }));

  return (
    <main className="product-page feature-detail" data-category={feature.category}>
      <section className="product-wrap product-hero feature-hero">
        <div className="product-hero-copy feature-hero-enter">
          <Link className="product-back" to="/features"><ArrowLeft /> All features</Link>
          <span className="product-eyebrow"><feature.icon /> {feature.name}</span>
          <h1>{feature.headline.replace('\n', ' ')}</h1>
          <p className="product-lead">{feature.description}</p>
          <div className="product-actions">
            <a href="#workflow" className="product-button">Follow the workflow <ArrowDown /></a>
            <Link to="/get-started" className="product-text-link">Try Talio <ArrowRight /></Link>
          </div>
        </div>
        <FeatureRoute labels={chapters.map(chapter => chapter.label)} />
      </section>

      <section className="product-wrap product-section" id="workflow" aria-labelledby="workflow-heading">
        <div className="product-section-heading">
          <h2 id="workflow-heading">{feature.name} in practice</h2>
        </div>
        <StoryPath chapters={chapters} ariaLabel={`${feature.name} workflow`} />
      </section>

      <section className="product-wrap product-section feature-preview-section" aria-labelledby="preview-heading">
        <div>
          <h2 id="preview-heading">Try the sample workspace</h2>
          <p>Choose an item to see what happens at that step.</p>
        </div>
        <ProductPreview key={feature.slug} feature={feature} />
      </section>

      <section className="product-wrap product-section product-faq" aria-labelledby="feature-setup-heading">
        <h2 id="feature-setup-heading">Before you start</h2>
        <div>
          <details open>
            <summary>What does this feature need? <Plus /></summary>
            <p>{feature.note}</p>
          </details>
          <details>
            <summary>Will everyone in my company see it? <Plus /></summary>
            <p>Your role and your workspace’s enabled modules determine what you can access.</p>
          </details>
        </div>
      </section>

      <section className="product-wrap product-section" aria-labelledby="related-features-heading">
        <div className="product-section-heading product-heading-inline">
          <h2 id="related-features-heading">Continue exploring</h2>
          <Link to="/features" className="product-text-link">All features <ArrowRight /></Link>
        </div>
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
