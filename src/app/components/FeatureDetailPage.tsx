import { Link, useParams } from 'react-router';
import { ArrowDown, ArrowRight } from 'lucide-react';
import { featureHref, getProductFeature, productFeatures } from '@/app/content/productFeatures';
import { featureScrollChapters } from '@/app/content/featureScrollChapters';
import { featureFaqs } from '@/app/content/featureFaqs';
import { usePageMeta } from '@/app/hooks/usePageMeta';
import { FeatureHero } from './FeatureHero';
import { LandingFaq } from './LandingFaq';
import { ParticleChapters, type ScrollChapter } from './ParticleChapters';
import '@/styles/product.css';

const featureMotion = {
  projects: { flight: 'rise', shapes: ['project', 'tasks', 'chart'] },
  productivity: { flight: 'wave', shapes: ['clock', 'laptop', 'chart'] },
  attendance: { flight: 'rise', shapes: ['pin', 'clock', 'check'] },
  leaves: { flight: 'fold', shapes: ['calendar', 'file', 'check'] },
  payroll: { flight: 'fold', shapes: ['calendar', 'wallet', 'file'] },
  goals: { flight: 'wave', shapes: ['target', 'chart', 'team'] },
  workflows: { flight: 'sweep', shapes: ['file', 'workflow', 'check'] },
  'team-chat': { flight: 'sweep', shapes: ['chat', 'file', 'laptop'] },
  meetings: { flight: 'rise', shapes: ['calendar', 'video', 'file'] },
  whiteboard: { flight: 'wave', shapes: ['board', 'workflow', 'team'] },
  people: { flight: 'rise', shapes: ['person', 'team', 'check'] },
  recruitment: { flight: 'sweep', shapes: ['briefcase', 'person', 'team'] },
  operations: { flight: 'fold', shapes: ['laptop', 'headset', 'check'] },
  documents: { flight: 'fold', shapes: ['file', 'shield', 'team'] },
  notifications: { flight: 'wave', shapes: ['bell', 'clock', 'tasks'] },
} as const satisfies Record<string, { flight: 'rise' | 'sweep' | 'wave' | 'fold'; shapes: readonly ScrollChapter['shape'][] }>;

export function FeatureDetailPage({ slug }: { slug?: string }) {
  const params = useParams();
  const feature = getProductFeature(slug || params.slug || '');
  const scene = feature && featureMotion[feature.slug as keyof typeof featureMotion];
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

  const introChapters = feature.story.map((chapter, index): ScrollChapter => ({
    id: `step-${index + 1}`,
    title: chapter.title,
    body: chapter.description,
    detail: chapter.signals.map(([label, value]) => `${label}: ${value}`).join(' · '),
    shape: scene.shapes[index % scene.shapes.length],
  }));
  const chapters = [
    ...introChapters,
    ...featureScrollChapters[feature.slug].map((chapter, index) => ({
      ...chapter,
      id: index < 6 ? `in-practice-${index + 1}` : `follow-through-${index - 5}`,
      aliases: index === 0 ? ['in-practice'] : index === 6 ? ['follow-through'] : undefined,
    })),
  ];
  const related = productFeatures
    .filter(item => item.category === feature.category && item.slug !== feature.slug)
    .slice(0, 3);

  return (
    <main className="product-page feature-detail" data-feature={feature.slug}>
      <FeatureHero
        slug={feature.slug}
        label={feature.name}
        title={feature.headline}
        description={feature.description}
        actions={
          <>
            <a href="#workflow" className="product-button">See how it works <ArrowDown /></a>
            <a href="#feature-questions" className="product-text-link">FAQ <ArrowRight /></a>
          </>
        }
      />
      <ParticleChapters key={feature.slug} chapters={chapters} heading={`${feature.name} in practice`} id="workflow" flight={scene.flight} />
      <div className="product-wrap feature-setup-note" id="feature-questions"><p>{feature.note}</p></div>
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
