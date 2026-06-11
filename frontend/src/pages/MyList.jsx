import { PosterCard } from '../components/Rail.jsx';
import './Browse.css';

const SAVED = ['the-third-man', 'lawrence-of-arabia', 'the-red-shoes', 'aftersun', 'senna', 'the-wicker-man'];

export default function MyList() {
  return (
    <main className="browse">
      <header className="browse-head">
        <h1 className="page-title">My List</h1>
      </header>
      <section className="browse-grid-wrap" aria-label="Saved titles">
        <div className="browse-grid">
          {SAVED.map((id) => (
            <PosterCard key={id} filmId={id} />
          ))}
        </div>
      </section>
    </main>
  );
}
