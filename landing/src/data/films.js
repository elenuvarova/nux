// Curated poster data for the landing. Slugs match /public/assets/posters/poster-<slug>.jpg
// (copied from the app catalogue). Posters are the brand's strongest asset — the
// landing leads with them.
export const poster = (slug) => `/assets/posters/poster-${slug}.jpg`;

// Hero dome — a curated wall of recognisable British cinema.
export const DOME = [
  'third-man', 'red-shoes', 'brief-encounter', 'black-narcissus', 'peeping-tom',
  'billy-liar', 'if', 'the-ladykillers', 'the-innocents', 'the-servant',
  'walkabout', 'the-devils', 'get-carter', 'mona-lisa', 'this-is-england',
  'ratcatcher', 'kes', 'zulu', 'naked', 'withnail-and-i',
  'under-the-skin', 'sexy-beast', 'aftersun', 'dont-look-now', 'richard-iii',
  'the-lavender-hill-mob',
];

// Curator demo — the reply names these; posters shown alongside.
export const CURATOR = [
  { slug: 'brief-encounter', title: 'Brief Encounter' },
  { slug: 'aftersun', title: 'Aftersun' },
  { slug: 'the-souvenir', title: 'The Souvenir' },
];

// Catalogue rails — proof the library is real.
export const RAILS = [
  {
    label: 'This week’s picks',
    films: [
      { slug: 'third-man', title: 'The Third Man', meta: '1949 · Film-Noir' },
      { slug: 'red-shoes', title: 'The Red Shoes', meta: '1948 · Drama' },
      { slug: 'the-innocents', title: 'The Innocents', meta: '1961 · Horror' },
      { slug: 'performance', title: 'Performance', meta: '1970 · Crime' },
      { slug: 'aftersun', title: 'Aftersun', meta: '2022 · Drama' },
      { slug: 'black-narcissus', title: 'Black Narcissus', meta: '1947 · Drama' },
    ],
  },
  {
    label: 'Kitchen-sink realism',
    films: [
      { slug: 'kes', title: 'Kes', meta: '1969 · Drama' },
      { slug: 'saturday-night-and-sunday-morning', title: 'Saturday Night and Sunday Morning', meta: '1960 · Drama' },
      { slug: 'this-sporting-life', title: 'This Sporting Life', meta: '1963 · Drama' },
      { slug: 'billy-liar', title: 'Billy Liar', meta: '1963 · Comedy' },
      { slug: 'ratcatcher', title: 'Ratcatcher', meta: '1999 · Drama' },
      { slug: 'get-carter', title: 'Get Carter', meta: '1971 · Crime' },
    ],
  },
];

// Themed collections — curation with a point of view.
export const COLLECTIONS = [
  { title: 'The Angry Young Men', blurb: 'When British film got working-class and furious.', slug: 'saturday-night-and-sunday-morning' },
  { title: 'Ealing, with teeth', blurb: 'Comedies that were never really that nice.', slug: 'the-ladykillers' },
  { title: 'Powell & Pressburger', blurb: 'The lush, the strange, and the impossibly romantic.', slug: 'a-matter-of-life-and-death' },
  { title: 'Faces of the New Wave', blurb: 'The actors who broke the accent barrier.', slug: 'billy-liar' },
];
