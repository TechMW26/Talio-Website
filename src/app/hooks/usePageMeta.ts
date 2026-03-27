import { useEffect } from 'react';

export function usePageMeta(title: string, description: string) {
  useEffect(() => {
    const base = 'Talio';
    document.title = title ? `${title} — ${base}` : `${base} — AI-Powered Workforce Management Platform`;

    let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
    if (!meta) {
      meta = document.createElement('meta');
      meta.name = 'description';
      document.head.appendChild(meta);
    }
    meta.content = description;
  }, [title, description]);
}
