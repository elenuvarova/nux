import { useEffect } from 'react';

const DEFAULT_DESC =
  'An editorial home for films, documentaries, games and courses — chosen by people, not an algorithm.';
const DEFAULT_IMAGE = '/og.jpg?v=2';

/* Sets document.title, the meta description, the canonical link and the
   Open Graph / Twitter Card tags per route, so every view is distinguishable
   in tabs, history, share cards and SEO.

   options.image — a per-route share image (films pass film.backdrop). Relative
   paths are resolved to an absolute URL against the current origin, as required
   by OG/Twitter. Falls back to the site default so a previous route's image
   never leaks into a route that has none. */
export default function usePageTitle(title, description, options = {}) {
  const { image } = options;
  useEffect(() => {
    const full = title ? `${title} — NUX` : 'NUX — Cinema for Curious Minds';
    const desc = description || DEFAULT_DESC;
    const img = absolute(image || DEFAULT_IMAGE);
    const canonical = window.location.origin + window.location.pathname;

    document.title = full;
    setMeta('description', desc);

    setProp('og:title', full);
    setProp('og:description', desc);
    setProp('og:url', canonical);
    setProp('og:image', img);

    setMeta('twitter:title', full);
    setMeta('twitter:description', desc);
    setMeta('twitter:image', img);

    setLink('canonical', canonical);
  }, [title, description, image]);
}

/* Resolve a root-relative path (e.g. /assets/stills/x.jpg) to an absolute URL;
   pass through values that are already absolute. */
function absolute(url) {
  if (!url) return url;
  if (/^https?:\/\//.test(url)) return url;
  return window.location.origin + (url.startsWith('/') ? url : `/${url}`);
}

function setMeta(name, content) {
  let el = document.head.querySelector(`meta[name="${name}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('name', name);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setProp(prop, content) {
  let el = document.head.querySelector(`meta[property="${prop}"]`);
  if (!el) {
    el = document.createElement('meta');
    el.setAttribute('property', prop);
    document.head.appendChild(el);
  }
  el.setAttribute('content', content);
}

function setLink(rel, href) {
  let el = document.head.querySelector(`link[rel="${rel}"]`);
  if (!el) {
    el = document.createElement('link');
    el.setAttribute('rel', rel);
    document.head.appendChild(el);
  }
  el.setAttribute('href', href);
}
