// NUX catalog — real British cinema (posters/stills sourced via Wikimedia,
// manifest in design/posters/MANIFEST.json). Mirrors the Figma hi-fi content.

const poster = (f) => `/assets/posters/${f}`;
const still = (f) => `/assets/stills/${f}`;
const genreImg = (f) => `/assets/genres/${f}`;

export const FILMS = [
  {
    id: 'the-third-man',
    title: 'The Third Man',
    year: 1949,
    genre: 'Film-Noir',
    runtime: '1h 44m',
    rating: 7.1,
    certificate: '18',
    type: 'FILM',
    poster: poster('poster-third-man.jpg'),
    backdrop: still('still-third-man.jpg'),
    synopsis:
      "Pulp novelist Holly Martins arrives in postwar Vienna to bury an old friend — and finds the city's black market very much alive. Carol Reed's shadow-soaked masterpiece of friendship and betrayal.",
    director: 'Carol Reed',
    country: 'UK',
    language: 'English',
    cast: [
      { name: 'Joseph Cotten', role: 'Holly', photo: '/assets/cast/cast-joseph-cotten.jpg' },
      { name: 'Alida Valli', role: 'Anna', photo: '/assets/cast/cast-alida-valli.jpg' },
      { name: 'Orson Welles', role: 'Harry', photo: '/assets/cast/cast-orson-welles.jpg' },
      { name: 'Trevor Howard', role: 'Calloway', photo: '/assets/cast/cast-trevor-howard.jpg' },
      { name: 'Carol Reed', role: 'Director', photo: '/assets/cast/cast-carol-reed.jpg' },
      { name: 'Bernard Lee', role: 'Paine', photo: '/assets/cast/cast-bernard-lee.jpg' },
    ],
  },
  { id: 'brief-encounter', title: 'Brief Encounter', year: 1945, genre: 'Romance', type: 'FILM', poster: poster('poster-brief-encounter.jpg') },
  { id: 'black-narcissus', title: 'Black Narcissus', year: 1947, genre: 'Drama', type: 'FILM', poster: poster('poster-black-narcissus.jpg'), backdrop: still('still2-black-narcissus.jpg') },
  { id: 'the-red-shoes', title: 'The Red Shoes', year: 1948, genre: 'Drama', type: 'FILM', poster: poster('poster-red-shoes.jpg'), backdrop: still('still2-red-shoes.jpg') },
  { id: 'peeping-tom', title: 'Peeping Tom', year: 1960, genre: 'Horror', type: 'FILM', poster: poster('poster-peeping-tom.jpg') },
  {
    id: 'lawrence-of-arabia',
    title: 'Lawrence of Arabia',
    year: 1962,
    genre: 'Epic',
    runtime: '3h 47m',
    rating: 8.3,
    type: 'FILM',
    poster: poster('poster-lawrence-of-arabia.jpg'),
    backdrop: still('still-lawrence-of-arabia.jpg'),
    backdrop2: still('still-lawrence-of-arabia-2.jpg'),
    synopsis:
      "David Lean's monumental account of T. E. Lawrence — archaeologist, soldier, enigma — and the desert war that made and unmade him.",
  },
  { id: 'billy-liar', title: 'Billy Liar', year: 1963, genre: 'Comedy', type: 'FILM', poster: poster('poster-billy-liar.jpg') },
  { id: 'if', title: 'If....', year: 1968, genre: 'Drama', type: 'FILM', poster: poster('poster-if.jpg') },
  { id: 'dont-look-now', title: "Don't Look Now", year: 1973, genre: 'Horror', type: 'FILM', poster: poster('poster-dont-look-now.jpg') },
  { id: 'the-wicker-man', title: 'The Wicker Man', year: 1973, genre: 'Horror', type: 'FILM', poster: poster('poster-wicker-man.jpg') },
  { id: 'withnail-and-i', title: 'Withnail and I', year: 1987, genre: 'Comedy', type: 'FILM', poster: poster('poster-withnail-and-i.jpg') },
  { id: 'naked', title: 'Naked', year: 1993, genre: 'Drama', type: 'FILM', poster: poster('poster-naked.jpg') },
  { id: 'sexy-beast', title: 'Sexy Beast', year: 2000, genre: 'Crime', type: 'FILM', poster: poster('poster-sexy-beast.jpg') },
  { id: 'billy-elliot', title: 'Billy Elliot', year: 2000, genre: 'Drama', type: 'FILM', poster: poster('poster-billy-elliot.jpg') },
  { id: 'under-the-skin', title: 'Under the Skin', year: 2013, genre: 'Sci-Fi', type: 'FILM', poster: poster('poster-under-the-skin.jpg') },
  { id: '45-years', title: '45 Years', year: 2015, genre: 'Drama', type: 'FILM', poster: poster('poster-45-years.jpg') },
  { id: 'the-souvenir', title: 'The Souvenir', year: 2019, genre: 'Drama', type: 'FILM', poster: poster('poster-the-souvenir.jpg') },
  { id: 'saint-maud', title: 'Saint Maud', year: 2019, genre: 'Horror', type: 'FILM', poster: poster('poster-saint-maud.jpg') },
  { id: 'aftersun', title: 'Aftersun', year: 2022, genre: 'Drama', type: 'FILM', poster: poster('poster-aftersun.jpg') },
  { id: 'touching-the-void', title: 'Touching the Void', year: 2003, genre: 'Documentary', type: 'DOC', poster: poster('poster-touching-the-void.jpg') },
  { id: 'senna', title: 'Senna', year: 2010, genre: 'Documentary', type: 'DOC', poster: poster('poster-senna.jpg') },
];

export const byId = (id) => FILMS.find((f) => f.id === id);

// ── Home page composition (mirrors the Figma hi-fi Home) ──────────
export const HERO = {
  filmId: 'lawrence-of-arabia',
  eyebrow: 'NUX Exclusive',
  meta: 'Epic · 1962 · 3h 47m · ★ 8.3',
};

export const CONTINUE_WATCHING = [
  { filmId: 'the-third-man', still: still('still-third-man.jpg'), minutesLeft: 31 },
  { filmId: 'sexy-beast', still: still('still-get-carter.jpg'), minutesLeft: 47 },
  { filmId: 'black-narcissus', still: still('still-black-narcissus.jpg'), minutesLeft: 22 },
  { filmId: 'lawrence-of-arabia', still: still('still-lawrence-of-arabia.jpg'), minutesLeft: 96 },
  { filmId: 'brief-encounter', still: still('still-matter-life-death.jpg'), minutesLeft: 58 },
];

export const RAILS = [
  {
    id: 'trending',
    title: 'Trending Now',
    filmIds: ['black-narcissus', 'the-red-shoes', 'peeping-tom', 'lawrence-of-arabia', 'billy-liar', 'if', 'dont-look-now'],
  },
  {
    id: 'curated',
    title: 'Curated for You',
    filmIds: ['the-wicker-man', 'withnail-and-i', 'naked', 'sexy-beast', 'billy-elliot', 'under-the-skin', '45-years'],
  },
  {
    id: 'new',
    title: 'New Releases',
    filmIds: ['the-souvenir', 'saint-maud', 'aftersun', 'touching-the-void', 'senna', 'the-third-man', 'brief-encounter'],
  },
];

export const EDITORIAL_PICK = {
  eyebrow: 'Editorial Pick',
  title: 'The 10 Best Films of 2026',
  dek: 'Our critics select the most essential cinema of the year — from festival premieres to overlooked masterpieces.',
  cta: 'Read the list',
  image: still('still-matter-life-death.jpg'),
};

// ── Genres (Projection Still Life identity) ───────────────────────
export const GENRES = [
  { id: 'drama', label: 'Drama', image: genreImg('genre-drama.jpg') },
  { id: 'thriller', label: 'Thriller', image: genreImg('genre-thriller.jpg') },
  { id: 'documentary', label: 'Documentary', image: genreImg('genre-documentary.jpg') },
  { id: 'horror', label: 'Horror', image: genreImg('genre-horror.jpg') },
  { id: 'sci-fi', label: 'Sci-Fi', image: genreImg('genre-scifi.jpg') },
  { id: 'romance', label: 'Romance', image: genreImg('genre-romance.jpg') },
  { id: 'history', label: 'History', image: genreImg('genre-history.jpg') },
  { id: 'animation', label: 'Animation', image: genreImg('genre-animation.jpg') },
  { id: 'crime', label: 'Crime', image: genreImg('genre-crime.jpg') },
  { id: 'art-house', label: 'Art House', image: genreImg('genre-arthouse.jpg') },
  { id: 'comedy', label: 'Comedy', image: genreImg('genre-comedy.jpg') },
  { id: 'musical', label: 'Musical', image: genreImg('genre-musical.jpg') },
];

// ── Fictional non-film content (generated key art) ────────────────
export const EXTRAS = {
  game: {
    id: 'neon-drift',
    title: 'Neon Drift',
    type: 'GAME',
    meta: 'Action-Adventure · 2026 · Cloud Play',
    poster: genreImg('genre-poster-neondrift.jpg'),
    synopsis:
      'Pilot a salvaged starfighter through the neon ruins of a dead empire. A reflex-driven roguelite with handcrafted runs, online co-op and a synthwave score.',
  },
  course: {
    id: 'art-of-editing',
    title: 'The Art of Editing',
    type: 'COURSE',
    poster: genreImg('genre-poster-course.jpg'),
  },
  welcomeBg: genreImg('genre-welcome-bg.jpg'),
};
