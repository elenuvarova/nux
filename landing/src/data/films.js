// Curated film data for the landing. Slugs match /public/assets/posters/poster-<slug>.jpg.
// Posters are the brand's strongest asset — the landing leads with them.
export const poster = (slug) => `/assets/posters/poster-${slug}.jpg`;

// Hero — a curated wall of recognisable British cinema (poster cylinder).
export const DOME = [
  'third-man', 'red-shoes', 'brief-encounter', 'black-narcissus', 'peeping-tom',
  'billy-liar', 'if', 'the-ladykillers', 'the-innocents', 'the-servant',
  'walkabout', 'the-devils', 'get-carter', 'mona-lisa', 'this-is-england',
  'ratcatcher', 'kes', 'zulu', 'naked', 'withnail-and-i',
  'under-the-skin', 'sexy-beast', 'aftersun', 'dont-look-now', 'richard-iii',
  'the-lavender-hill-mob',
];

// Proof wall — a dimmed collage that *shows* the depth of the catalogue.
export const WALL = [
  'third-man', 'kes', 'get-carter', 'red-shoes', 'naked', 'aftersun', 'zulu',
  'the-innocents', 'withnail-and-i', 'ratcatcher', 'black-narcissus', 'mona-lisa',
  'this-is-england', 'walkabout', 'under-the-skin', 'the-servant', 'dont-look-now',
  'peeping-tom', 'sexy-beast', 'the-devils', 'billy-liar', 'the-ladykillers',
  'performance', 'richard-iii', 'the-long-good-friday', 'distant-voices-still-lives',
  'saturday-night-and-sunday-morning', 'this-sporting-life', 'the-lavender-hill-mob',
  'brief-encounter', 'if', 'wicker-man', 'i-daniel-blake', 'red-road',
];

// Director surnames — a quiet marquee that signals the collection's pedigree.
export const DIRECTORS = [
  'Powell & Pressburger', 'Ken Loach', 'Carol Reed', 'Lynne Ramsay', 'Mike Leigh',
  'Nicolas Roeg', 'Andrea Arnold', 'David Lean', 'Terence Davies', 'Lindsay Anderson',
  'Jonathan Glazer', 'Mike Hodges', 'Shane Meadows', 'Charlotte Wells', 'Andrew Haigh',
  'Karel Reisz', 'Neil Jordan', 'Joseph Losey',
];

// Curator demo — one mood, a written reply, three picks each with a one-line reason.
export const CURATOR = {
  prompt: 'something quiet and rain-soaked, set up north',
  picks: [
    { slug: 'kes', title: 'Kes', director: 'Ken Loach', year: 1969, reason: 'a Barnsley boy and a kestrel — tenderness with the grain left in.' },
    { slug: 'ratcatcher', title: 'Ratcatcher', director: 'Lynne Ramsay', year: 1999, reason: 'a Glasgow canal in a bin-strike summer; beauty where you least expect it.' },
    { slug: 'aftersun', title: 'Aftersun', director: 'Charlotte Wells', year: 2022, reason: 'for when you can take the ache, slow and from a distance.' },
  ],
};

// Catalogue rails — proof the library is real. director · year · runtime · genre.
export const RAILS = [
  {
    label: 'This week’s picks',
    films: [
      { slug: 'third-man', title: 'The Third Man', director: 'Carol Reed', year: 1949, runtime: '1h 44m', genre: 'Film-Noir' },
      { slug: 'red-shoes', title: 'The Red Shoes', director: 'Powell & Pressburger', year: 1948, runtime: '2h 15m', genre: 'Romance' },
      { slug: 'the-innocents', title: 'The Innocents', director: 'Jack Clayton', year: 1961, runtime: '1h 40m', genre: 'Horror' },
      { slug: 'performance', title: 'Performance', director: 'Cammell & Roeg', year: 1970, runtime: '1h 45m', genre: 'Crime' },
      { slug: 'aftersun', title: 'Aftersun', director: 'Charlotte Wells', year: 2022, runtime: '1h 42m', genre: 'Drama' },
      { slug: 'black-narcissus', title: 'Black Narcissus', director: 'Powell & Pressburger', year: 1947, runtime: '1h 41m', genre: 'Drama' },
    ],
  },
  {
    label: 'Kitchen-sink realism',
    films: [
      { slug: 'kes', title: 'Kes', director: 'Ken Loach', year: 1969, runtime: '1h 50m', genre: 'Drama' },
      { slug: 'saturday-night-and-sunday-morning', title: 'Saturday Night and Sunday Morning', director: 'Karel Reisz', year: 1960, runtime: '1h 29m', genre: 'Drama' },
      { slug: 'this-sporting-life', title: 'This Sporting Life', director: 'Lindsay Anderson', year: 1963, runtime: '2h 14m', genre: 'Drama' },
      { slug: 'billy-liar', title: 'Billy Liar', director: 'John Schlesinger', year: 1963, runtime: '1h 38m', genre: 'Comedy' },
      { slug: 'ratcatcher', title: 'Ratcatcher', director: 'Lynne Ramsay', year: 1999, runtime: '1h 34m', genre: 'Drama' },
      { slug: 'get-carter', title: 'Get Carter', director: 'Mike Hodges', year: 1971, runtime: '1h 52m', genre: 'Crime' },
    ],
  },
];

// Full type-index — the catalogue set as a register, hover reveals the still.
export const INDEX = [
  { slug: 'third-man', title: 'The Third Man', director: 'Carol Reed', year: 1949, runtime: '1h 44m' },
  { slug: 'red-shoes', title: 'The Red Shoes', director: 'Powell & Pressburger', year: 1948, runtime: '2h 15m' },
  { slug: 'peeping-tom', title: 'Peeping Tom', director: 'Michael Powell', year: 1960, runtime: '1h 41m' },
  { slug: 'the-servant', title: 'The Servant', director: 'Joseph Losey', year: 1963, runtime: '1h 56m' },
  { slug: 'kes', title: 'Kes', director: 'Ken Loach', year: 1969, runtime: '1h 50m' },
  { slug: 'performance', title: 'Performance', director: 'Cammell & Roeg', year: 1970, runtime: '1h 45m' },
  { slug: 'walkabout', title: 'Walkabout', director: 'Nicolas Roeg', year: 1971, runtime: '1h 40m' },
  { slug: 'get-carter', title: 'Get Carter', director: 'Mike Hodges', year: 1971, runtime: '1h 52m' },
  { slug: 'dont-look-now', title: 'Don’t Look Now', director: 'Nicolas Roeg', year: 1973, runtime: '1h 50m' },
  { slug: 'wicker-man', title: 'The Wicker Man', director: 'Robin Hardy', year: 1973, runtime: '1h 28m' },
  { slug: 'the-long-good-friday', title: 'The Long Good Friday', director: 'John Mackenzie', year: 1980, runtime: '1h 54m' },
  { slug: 'mona-lisa', title: 'Mona Lisa', director: 'Neil Jordan', year: 1986, runtime: '1h 44m' },
  { slug: 'withnail-and-i', title: 'Withnail and I', director: 'Bruce Robinson', year: 1987, runtime: '1h 47m' },
  { slug: 'distant-voices-still-lives', title: 'Distant Voices, Still Lives', director: 'Terence Davies', year: 1988, runtime: '1h 25m' },
  { slug: 'naked', title: 'Naked', director: 'Mike Leigh', year: 1993, runtime: '2h 12m' },
  { slug: 'ratcatcher', title: 'Ratcatcher', director: 'Lynne Ramsay', year: 1999, runtime: '1h 34m' },
  { slug: 'this-is-england', title: 'This Is England', director: 'Shane Meadows', year: 2006, runtime: '1h 42m' },
  { slug: 'red-road', title: 'Red Road', director: 'Andrea Arnold', year: 2006, runtime: '1h 53m' },
  { slug: 'under-the-skin', title: 'Under the Skin', director: 'Jonathan Glazer', year: 2013, runtime: '1h 48m' },
  { slug: 'i-daniel-blake', title: 'I, Daniel Blake', director: 'Ken Loach', year: 2016, runtime: '1h 40m' },
  { slug: 'aftersun', title: 'Aftersun', director: 'Charlotte Wells', year: 2022, runtime: '1h 42m' },
];

// Themed collections — curation with a point of view. Still = the slug shown.
export const COLLECTIONS = [
  { title: 'The Angry Young Men', standfirst: 'When British film clocked off, got working-class, and stayed furious.', count: 6, slug: 'saturday-night-and-sunday-morning' },
  { title: 'Ealing, with teeth', standfirst: 'The comedies that were never really that nice about anyone.', count: 5, slug: 'the-ladykillers' },
  { title: 'Powell & Pressburger', standfirst: 'The lush, the strange and the impossibly romantic — Technicolor and all.', count: 7, slug: 'a-matter-of-life-and-death' },
  { title: 'Faces of the New Wave', standfirst: 'The actors who broke the accent barrier and never gave it back.', count: 8, slug: 'billy-liar' },
];
