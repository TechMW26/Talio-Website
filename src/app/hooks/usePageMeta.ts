import { useEffect } from 'react';
import { useLocation } from 'react-router';

export function setPageCanonical(pathname: string) {
  const url = new URL('https://talio.in');
  url.pathname = pathname.replace(/\/+$/, '') || '/';
  document.querySelector<HTMLLinkElement>('link[rel="canonical"]')?.setAttribute('href', url.href);
  return url.href;
}

export function usePageMeta(title: string, description: string) {
  const { pathname } = useLocation();

  useEffect(() => {
    const pageTitle = title ? `${title} — Talio` : 'Talio — Work and People Operations with Super Intelligence';
    const url = setPageCanonical(pathname);
    document.title = pageTitle;

    const tags = [
      ['name', 'title', pageTitle],
      ['name', 'description', description],
      ['property', 'og:title', pageTitle],
      ['property', 'og:description', description],
      ['property', 'og:type', 'website'],
      ['property', 'og:url', url],
      ['name', 'twitter:title', pageTitle],
      ['name', 'twitter:description', description],
      ['name', 'twitter:url', url],
    ];
    for (const [attribute, key, content] of tags) {
      const existing = document.querySelector<HTMLMetaElement>(`meta[name="${key}"], meta[property="${key}"]`);
      if (existing) {
        existing.content = content;
        continue;
      }
      const meta = document.createElement('meta');
      meta.setAttribute(attribute, key);
      meta.content = content;
      document.head.appendChild(meta);
    }
  }, [title, description, pathname]);
}
