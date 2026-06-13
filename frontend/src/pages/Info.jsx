import { useParams } from 'react-router-dom';
import NotFound from './NotFound.jsx';
import usePageTitle from '../lib/usePageTitle.js';
import './Info.css';

const PAGES = {
  about: {
    title: 'About NUX',
    body: [
      ['p', 'NUX is an editorial streaming platform for films, documentaries, games and courses — curated by editors who care. Instead of an infinite algorithmic wall, the catalog is organised by narrative theme: finite, human-curated collections with a point of view.'],
      ['h2', 'Why we exist'],
      ['p', 'Choice fatigue is the default experience of modern streaming. NUX is built on the opposite belief — that the right film, surfaced with context and conviction, is worth more than ten thousand thumbnails.'],
      ['h2', 'The catalog'],
      ['p', 'This showcase is built on British cinema — from The Third Man and Black Narcissus to Aftersun and Saint Maud — with real posters, stills and trailers. The genre artwork and fictional titles are original, generated in a single editorial style.'],
      ['p', 'NUX is a design-system project: every screen is built on one token set that flips between wireframe and hi-fi, and shipped as a responsive React app on a self-hosted server.'],
    ],
  },
  help: {
    title: 'Help & Support',
    body: [
      ['p', 'This is a portfolio showcase, so playback streams real trailers rather than full films. Here’s how to get around.'],
      ['h2', 'Playing something'],
      ['p', 'Press Play on any film, game or course to open the player. The player has speed control, captions, volume and fullscreen — press the gear for settings, or use the keyboard: Space to play/pause, ← → to seek, ↑ ↓ for volume, F for fullscreen.'],
      ['h2', 'My List'],
      ['p', 'Select + on any title to save it. Your list lives in this browser and appears under My List.'],
      ['h2', 'Downloads & account'],
      ['p', 'Downloads, Profile and Settings are demonstrations of the flows; toggles and forms respond but don’t persist to a server.'],
    ],
  },
  privacy: {
    title: 'Privacy',
    body: [
      ['p', 'NUX is a demonstration project and does not run analytics, tracking or third-party advertising.'],
      ['h2', 'What’s stored'],
      ['p', 'Your saved titles, watch history and player volume are stored locally in your own browser (localStorage). Nothing is sent to a server and nothing is shared. Clearing your browser data removes it.'],
      ['h2', 'Third parties'],
      ['p', 'Trailers are embedded from YouTube’s privacy-enhanced (no-cookie) domain. YouTube’s own terms apply to that video playback.'],
    ],
  },
  terms: {
    title: 'Terms of Service',
    body: [
      ['p', 'NUX is a non-commercial design and engineering showcase. It is provided as-is, for demonstration purposes.'],
      ['h2', 'Content'],
      ['p', 'Film posters, stills and trailers belong to their respective rights holders and are used here for illustrative, non-commercial purposes. Genre artwork and fictional titles are original to this project.'],
      ['h2', 'Use'],
      ['p', 'There is no membership, payment or account. Feel free to explore.'],
    ],
  },
};

export default function Info() {
  const { slug } = useParams();
  const page = PAGES[slug];
  usePageTitle(page?.title);
  if (!page) return <NotFound message="That page doesn't exist." />;

  return (
    <main className="info">
      <h1 className="info-title" tabIndex={-1}>
        {page.title}
      </h1>
      <div className="info-body">
        {page.body.map(([tag, text], i) =>
          tag === 'h2' ? (
            <h2 key={i} className="info-h2">
              {text}
            </h2>
          ) : (
            <p key={i}>{text}</p>
          )
        )}
      </div>
    </main>
  );
}
