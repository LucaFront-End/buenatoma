import { useEffect } from 'react';

/**
 * useSEO — Inyecta dinámicamente metadatos SEO: <title>, descripción, OpenGraph,
 * Twitter Cards y URL canónica por landing.
 */
export const useSEO = ({
  title,
  description,
  canonical,
  image,
  type = 'website'
} = {}) => {
  useEffect(() => {
    if (title) {
      document.title = title;
    }

    const setMeta = (attr, val, content) => {
      if (!content) return;
      let el = document.querySelector(`meta[${attr}="${val}"]`);
      if (!el) {
        el = document.createElement('meta');
        el.setAttribute(attr, val);
        document.head.appendChild(el);
      }
      el.content = content;
    };

    if (description) {
      setMeta('name', 'description', description);
      setMeta('property', 'og:description', description);
      setMeta('name', 'twitter:description', description);
    }

    if (title) {
      setMeta('property', 'og:title', title);
      setMeta('name', 'twitter:title', title);
    }

    document.documentElement.lang = 'es';

    const shareImage = image || 'https://buenatoma.mx/images/studio_setup.png';
    setMeta('property', 'og:image', shareImage);
    setMeta('name', 'twitter:image', shareImage);
    setMeta('name', 'twitter:card', 'summary_large_image');
    setMeta('property', 'og:type', type);
    setMeta('property', 'og:site_name', 'Buena Toma Estudio');

    let canonicalEl = document.querySelector('link[rel="canonical"]');
    if (!canonicalEl) {
      canonicalEl = document.createElement('link');
      canonicalEl.rel = 'canonical';
      document.head.appendChild(canonicalEl);
    }
    canonicalEl.href = canonical || (typeof window !== 'undefined' ? window.location.href : '');
  }, [title, description, canonical, image, type]);
};
