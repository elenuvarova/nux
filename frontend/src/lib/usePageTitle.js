import { useEffect } from 'react';

/* Sets document.title and the meta description / og:title per route, so
   every view is distinguishable in tabs, history, share cards and SEO. */
export default function usePageTitle(title, description) {
  useEffect(() => {
    const full = title ? `${title} — NUX` : 'NUX — Cinema for Curious Minds';
    document.title = full;
    setMeta('description', description || 'An editorial streaming platform for films, documentaries, games and courses — curated by editors who care.');
    setProp('og:title', full);
    if (description) setProp('og:description', description);
    setProp('og:url', window.location.href);
  }, [title, description]);
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
