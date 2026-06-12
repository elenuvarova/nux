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
