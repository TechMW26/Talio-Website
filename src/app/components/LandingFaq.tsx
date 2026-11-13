import { useId } from 'react';
import { Plus } from 'lucide-react';
import '@/styles/landing-foundation.css';

export function LandingFaq({ items, title = 'Frequently asked questions' }: {
  items: readonly (readonly [question: string, answer: string])[];
  title?: string;
}) {
  const heading = useId();
  return (
    <section className="landing-faq" aria-labelledby={heading}>
      <h2 id={heading}>{title}</h2>
      <div className="landing-faq-questions">
        {items.map(([question, answer]) => (
          <details key={question}>
            <summary>{question}<Plus size="1em" aria-hidden="true" /></summary>
            <p>{answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
