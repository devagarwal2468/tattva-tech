import { useEffect } from 'react';
import { company } from '../content/site';

const setMeta = (attr, key, content) => {
  if (!content) return;
  let el = document.head.querySelector(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
};

/**
 * Per-page <title>, description, canonical URL and social tags.
 * @param {{ title?: string, description?: string, path?: string, noindex?: boolean }} opts
 */
export function useSeo({ title, description, path, noindex = false } = {}) {
  useEffect(() => {
    const fullTitle = title ? `${title} | ${company.name}` : `${company.name} — Software, AI & Robotics Engineering`;
    document.title = fullTitle;
    const url = `${company.url}${path ?? window.location.pathname}`;

    const desc = description || company.summary;
    setMeta('name', 'description', desc);
    setMeta('property', 'og:title', fullTitle);
    setMeta('property', 'og:description', desc);
    setMeta('property', 'og:url', url);
    setMeta('name', 'twitter:title', fullTitle);
    setMeta('name', 'twitter:description', desc);
    setMeta('name', 'robots', noindex ? 'noindex, nofollow' : 'index, follow');

    let canonical = document.head.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement('link');
      canonical.setAttribute('rel', 'canonical');
      document.head.appendChild(canonical);
    }
    canonical.setAttribute('href', url);
  }, [title, description, path, noindex]);
}
