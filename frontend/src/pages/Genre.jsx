import { useParams, Link } from 'react-router-dom';
import { PosterCard } from '../components/Rail.jsx';
import NotFound from './NotFound.jsx';
import usePageTitle from '../lib/usePageTitle.js';
import { GENRES, FILMS } from '../data/catalog.js';
import './Genre.css';

// map a genre card to the catalog genre labels it should gather
const GENRE_MATCH = {
  drama: ['Drama'],
  thriller: ['Film-Noir', 'Thriller'],
  documentary: ['Documentary'],
  horror: ['Horror'],
  'sci-fi': ['Sci-Fi'],
  romance: ['Romance'],
  history: ['Epic'],
  crime: ['Crime'],
  'art-house': ['Drama', 'Film-Noir'],
  comedy: ['Comedy'],
};

const BLURB = {
  drama: 'Lives observed up close — the quiet films that earn a second watch.',
  thriller: 'Shadows, doubles and rain-wet streets. The genre NUX was built on.',
  documentary: 'True stories told like thrillers.',
  horror: 'Folk dread, faith curdled, and the dark at the edge of sight.',
  'sci-fi': 'The strange and the speculative, turned on us.',
  romance: 'Love as restraint, as ruin, as the thing left unsaid.',
  history: 'The widest screen cinema can offer.',
  crime: 'Heists, hard men and the one who won’t take no.',
  'art-house': 'For the patient eye — form as feeling.',
  comedy: 'The most quotable corner of British cinema.',
};

export default function Genre() {
  const { id } = useParams();
  const genre = GENRES.find((g) => g.id === id);
  usePageTitle(genre ? genre.label : 'Genre');
  if (!genre || !GENRE_MATCH[id]) return <NotFound message="That genre doesn't exist yet." />;

  const labels = GENRE_MATCH[id];
  const films = FILMS.filter((f) => labels.includes(f.genre));

  return (
    <main className="genre">
      <header className="genre-hero">
        <img className="genre-bg" src={genre.image} alt="" fetchpriority="high" />
        <div className="genre-headings">
          <p className="eyebrow">Collection</p>
          <h1 className="genre-title" tabIndex={-1}>
            {genre.label}
          </h1>
          <p className="genre-blurb">{BLURB[id]}</p>
        </div>
      </header>

      <section className="genre-body" aria-label={`${genre.label} titles`}>
        <h2 className="headline genre-count">
          {films.length} {films.length === 1 ? 'title' : 'titles'}
        </h2>
        {films.length > 0 ? (
          <div className="browse-grid">
            {films.map((f) => (
              <PosterCard key={f.id} filmId={f.id} />
            ))}
          </div>
        ) : (
          <div className="browse-empty">
            <p className="display-m">Coming soon</p>
            <p className="browse-empty-sub">We’re curating this shelf — check back after the next release window.</p>
            <Link to="/browse" className="btn btn-primary">
              Browse everything
            </Link>
          </div>
        )}
      </section>
    </main>
  );
}
