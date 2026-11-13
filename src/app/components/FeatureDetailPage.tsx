import { Link, useParams } from 'react-router';
import { ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { featureHref, getProductFeature, productFeatures } from '@/app/content/productFeatures';
import { featureScrollChapters } from '@/app/content/featureScrollChapters';
import { featureFaqs } from '@/app/content/featureFaqs';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { FeatureNarrative, featureScenes } from './FeatureNarrative';
import { LandingFaq } from './LandingFaq';
import { ParticleChapters } from './ParticleChapters';
import { ParticleIllustration } from './ParticleIllustration';
import '@/styles/product.css';

export function FeatureDetailPage({ slug }: { slug?: string }) {
  const params = useParams();
  const feature = getProductFeature(slug || params.slug || '');
  const scene = feature && featureScenes[feature.slug];
  usePageMeta(feature ? `${feature.name} — Features` : 'Feature not found', feature?.description || 'Explore what is available in Talio.');
  if (!feature || !scene) {
    return (
      <main className="product-page">
        <div className="product-wrap product-hero">
          <h1>Feature not found.</h1>
          <Link className="product-button" to="/features">Browse all features <ArrowRight /></Link>
        </div>
      </main>
    );
  }

  const chapters = featureScrollChapters[feature.slug];
  const related = productFeatures
    .filter(item => item.category === feature.category && item.slug !== feature.slug)
    .slice(0, 3);

  return (
    <main className={`product-page feature-detail feature-${scene.mode}`} data-feature={feature.slug}>
      <section className="product-wrap feature-intro" aria-labelledby="feature-title">
        <div className="feature-intro-copy">
          <Link className="product-back" to="/features"><ArrowLeft /> All features</Link>
          <span className="product-eyebrow"><feature.icon aria-hidden="true" /> {feature.name}</span>
          <h1 id="feature-title">{feature.headline.replace('\n', ' ')}</h1>
          <p className="product-lead">{feature.description}</p>
          <div className="product-actions">
            <a href="#workflow" className="product-button">See how it works <ArrowDown /></a>
            <a href="#in-practice" className="product-text-link">Jump to scenes <ArrowRight /></a>
          </div>
        </div>
        <div className="feature-intro-art">
          <ParticleIllustration shapes={[scene.shapes[0]]} label={`${feature.name} particle illustration`} />
        </div>
      </section>

      <section className="product-wrap feature-workflow" id="workflow" aria-labelledby="workflow-heading">
        <div className="feature-workflow-heading">
          <h2 id="workflow-heading">{scene.hook}</h2>
          <nav aria-label={`${feature.name} chapters`}>
            {feature.story.map((chapter, index) => <a key={chapter.label} href={`#step-${index + 1}`}>{chapter.label}</a>)}
          </nav>
        </div>
        <FeatureNarrative key={feature.slug} chapters={feature.story} scene={scene} />
        <p className="feature-setup-note">{feature.note}</p>
      </section>

      <ParticleChapters chapters={chapters.slice(0, 6)} heading={`${feature.name} in practice`} id="in-practice" className={`particle-chapters-${scene.mode}`} />
      <ParticleChapters chapters={chapters.slice(6)} heading="Follow the work through" id="follow-through" className={`particle-chapters-reverse particle-chapters-${scene.mode}`} />

      <LandingFaq title={`${feature.name} FAQ`} items={featureFaqs[feature.slug]} />

      <section className="product-wrap product-section" aria-labelledby="related-features-heading">
        <div className="product-section-heading product-heading-inline">
          <h2 id="related-features-heading">Continue exploring</h2>
          <Link to="/get-started" className="product-text-link">Try Talio <ArrowRight /></Link>
        </div>
        <div className="product-related">
          {related.map(item => (
            <Link key={item.slug} to={featureHref(item.slug)}>
              <item.icon aria-hidden="true" /><span>{item.name}</span><ArrowRight aria-hidden="true" />
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
