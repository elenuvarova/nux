import { describe, it, expect } from 'vitest';
import { FILMS, byId, anyTitleById, RAILS, COLLECTIONS, GENRES, HERO_ROTATION } from './catalog.js';

describe('catalog integrity', () => {
  it('every film has a unique id, title, year, genre, poster', () => {
    const ids = new Set();
    for (const f of FILMS) {
      expect(f.id, 'id').toBeTruthy();
      expect(ids.has(f.id), `duplicate id ${f.id}`).toBe(false);
      ids.add(f.id);
      expect(f.title).toBeTruthy();
      expect(typeof f.year).toBe('number');
      expect(f.genre).toBeTruthy();
      expect(f.poster).toMatch(/^\/assets\//);
    }
  });

  it('no film appears twice within one rail', () => {
    for (const rail of RAILS) {
      const seen = new Set();
      for (const id of rail.filmIds) {
        expect(seen.has(id), `${id} duplicated in ${rail.id}`).toBe(false);
        seen.add(id);
        expect(byId(id), `${id} missing from catalog`).toBeTruthy();
      }
    }
  });

  it('rail + collection + hero ids all resolve to real films', () => {
    for (const r of RAILS) r.filmIds.forEach((id) => expect(byId(id)).toBeTruthy());
    for (const slug of Object.keys(COLLECTIONS)) {
      COLLECTIONS[slug].entries.forEach(([id]) => expect(byId(id), `${id} in ${slug}`).toBeTruthy());
    }
    HERO_ROTATION.forEach((s) => expect(byId(s.filmId)).toBeTruthy());
  });

  it('anyTitleById resolves films and the game/course extras', () => {
    expect(anyTitleById('the-third-man')?.type).toBe('FILM');
    expect(anyTitleById('neon-drift')?.type).toBe('GAME');
    expect(anyTitleById('art-of-editing')?.type).toBe('COURSE');
    expect(anyTitleById('does-not-exist')).toBeNull();
  });

  it('has 12 genres each with image + label', () => {
    expect(GENRES).toHaveLength(12);
    GENRES.forEach((g) => {
      expect(g.id).toBeTruthy();
      expect(g.label).toBeTruthy();
      expect(g.image).toMatch(/^\/assets\//);
    });
  });
});
