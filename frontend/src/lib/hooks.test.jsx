import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useMyList } from './useMyList.js';
import { useWatchHistory } from './useWatchHistory.js';
import { TRAILERS } from '../data/trailers.js';
import { FILMS } from '../data/catalog.js';

beforeEach(() => localStorage.clear());

describe('useMyList', () => {
  it('toggles a title on and off, persisting to localStorage', () => {
    const { result } = renderHook(() => useMyList());
    expect(result.current.has('the-third-man')).toBe(false);

    act(() => result.current.toggle('the-third-man', 'The Third Man'));
    expect(result.current.has('the-third-man')).toBe(true);
    expect(JSON.parse(localStorage.getItem('nux-my-list'))).toContain('the-third-man');

    act(() => result.current.toggle('the-third-man', 'The Third Man'));
    expect(result.current.has('the-third-man')).toBe(false);
  });

  it('keeps two mounted hooks in sync', () => {
    const a = renderHook(() => useMyList());
    const b = renderHook(() => useMyList());
    act(() => a.result.current.toggle('aftersun', 'Aftersun'));
    expect(b.result.current.has('aftersun')).toBe(true);
  });
});

describe('useWatchHistory', () => {
  it('records most-recent-first, deduped, capped at 8', () => {
    const { result } = renderHook(() => useWatchHistory());
    act(() => result.current.record('senna', 0.3, 1));
    act(() => result.current.record('aftersun', 0.5, 2));
    act(() => result.current.record('senna', 0.6, 3)); // re-watch moves to front, no dupe
    expect(result.current.history.map((h) => h.id)).toEqual(['senna', 'aftersun']);
    expect(result.current.history[0].frac).toBeCloseTo(0.6);
  });

  it('clamps the stored fraction into (0,1)', () => {
    const { result } = renderHook(() => useWatchHistory());
    act(() => result.current.record('naked', 5, 1));
    expect(result.current.history[0].frac).toBeLessThanOrEqual(0.95);
  });
});

describe('trailers', () => {
  it('every trailer id maps to a real film', () => {
    for (const id of Object.keys(TRAILERS)) {
      expect(FILMS.some((f) => f.id === id), `${id} not a film`).toBe(true);
      expect(TRAILERS[id].yt).toMatch(/^[\w-]{11}$/);
    }
  });
});
