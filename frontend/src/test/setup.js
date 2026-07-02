import '@testing-library/jest-dom/vitest';

// jsdom lacks these; stub so components that probe them don't throw
if (!window.matchMedia) {
  window.matchMedia = (q) => ({
    matches: false,
    media: q,
    addEventListener() {},
    removeEventListener() {},
    addListener() {},
    removeListener() {},
  });
}

// used by Reveal for the scroll-in effect; never fires in tests (content
// simply stays in its pre-reveal state, which is fine for assertions)
if (!window.IntersectionObserver) {
  window.IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}
