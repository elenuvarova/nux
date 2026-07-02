import { STOCKED_GENRES } from '../data/catalog.js';
import './GenreTastePicker.css';

// Genre-taste chip grid shared by onboarding (Welcome step 2) and Settings →
// Your taste. Controlled: `picked` is a Set of genre ids, `onToggle(id)` flips
// one chip — persistence stays with the host.
export default function GenreTastePicker({ picked, onToggle }) {
  return (
    <div className="taste-grid" role="group" aria-label="Genres">
      {STOCKED_GENRES.map((g) => (
        <button
          key={g.id}
          type="button"
          className={`taste-chip ${picked.has(g.id) ? 'taste-chip--on' : ''}`}
          aria-pressed={picked.has(g.id)}
          onClick={() => onToggle(g.id)}
        >
          <img src={g.image} alt="" loading="lazy" />
          <span>{g.label}</span>
          {picked.has(g.id) && (
            <span className="taste-check" aria-hidden="true">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M2.5 7.5 6 11l5.5-7" />
              </svg>
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
