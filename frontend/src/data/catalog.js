// NUX catalog — real British cinema (posters/stills sourced via Wikimedia,
// manifest in design/posters/MANIFEST.json). Mirrors the Figma hi-fi content.
// Facts (director/runtime/synopsis) are real; ratings shown only where set.

const poster = (f) => `/assets/posters/${f}`;
const still = (f) => `/assets/stills/${f}`;
const genreImg = (f) => `/assets/genres/${f}`;
const castImg = (f) => `/assets/cast/${f}`;

// name → asset slug (must match scripts/fetch-cast.mjs)
const slug = (name) =>
  name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const FILMS = [
  {
    id: 'the-third-man',
    title: 'The Third Man',
    year: 1949,
    genre: 'Film-Noir',
    runtime: '1h 44m',
    runtimeMin: 104,
    rating: 8.1,
    certificate: 'PG',
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
  {
    id: 'brief-encounter',
    title: 'Brief Encounter',
    year: 1945,
    genre: 'Romance',
    runtime: '1h 26m',
    runtimeMin: 86,
    type: 'FILM',
    poster: poster('poster-brief-encounter.jpg'),
    director: 'David Lean',
    synopsis:
      'A married woman and a doctor meet by chance in a railway station tearoom — and fall, impossibly, in love. Noël Coward and David Lean turn restraint itself into heartbreak.',
    rating: 8.0,
    certificate: 'PG',
    country: 'UK',
    language: 'English',
    cast: [
      { name: 'Celia Johnson', role: 'Laura Jesson' },
      { name: 'Trevor Howard', role: 'Dr Alec Harvey' },
      { name: 'Stanley Holloway', role: 'Albert Godby' },
      { name: 'Joyce Carey', role: 'Myrtle Bagot' },
      { name: 'Cyril Raymond', role: 'Fred Jesson' },
    ],
  },
  {
    id: 'black-narcissus',
    title: 'Black Narcissus',
    year: 1947,
    genre: 'Drama',
    runtime: '1h 41m',
    runtimeMin: 101,
    type: 'FILM',
    poster: poster('poster-black-narcissus.jpg'),
    backdrop: still('still2-black-narcissus.jpg'),
    director: 'Powell & Pressburger',
    synopsis:
      'A convent of nuns sets up a school in an abandoned palace high in the Himalayas, where the wind, the altitude and memory begin to undo them. Technicolor delirium from Powell & Pressburger.',
    rating: 7.8,
    certificate: 'PG',
    country: 'UK',
    language: 'English',
    cast: [
      { name: 'Deborah Kerr', role: 'Sister Clodagh' },
      { name: 'David Farrar', role: 'Mr Dean' },
      { name: 'Kathleen Byron', role: 'Sister Ruth' },
      { name: 'Sabu', role: 'The Young General' },
      { name: 'Jean Simmons', role: 'Kanchi' },
      { name: 'Flora Robson', role: 'Sister Philippa' },
    ],
  },
  {
    id: 'the-red-shoes',
    title: 'The Red Shoes',
    year: 1948,
    genre: 'Romance',
    runtime: '2h 15m',
    runtimeMin: 135,
    type: 'FILM',
    poster: poster('poster-red-shoes.jpg'),
    backdrop: still('still2-red-shoes.jpg'),
    director: 'Powell & Pressburger',
    synopsis:
      'A young ballerina is torn between the impresario who demands everything for art and the composer she loves. The dance film all dance films answer to.',
    rating: 8.1,
    certificate: 'U',
    country: 'UK',
    language: 'English',
    cast: [
      { name: 'Moira Shearer', role: 'Victoria Page' },
      { name: 'Anton Walbrook', role: 'Boris Lermontov' },
      { name: 'Marius Goring', role: 'Julian Craster' },
      { name: 'Robert Helpmann', role: 'Ivan Boleslawsky' },
      { name: 'Léonide Massine', role: 'Grischa Ljubov' },
    ],
  },
  {
    id: 'peeping-tom',
    title: 'Peeping Tom',
    year: 1960,
    genre: 'Horror',
    runtime: '1h 41m',
    runtimeMin: 101,
    type: 'FILM',
    poster: poster('poster-peeping-tom.jpg'),
    director: 'Michael Powell',
    synopsis:
      'A shy focus-puller films his victims as they die, hunting the perfect image of fear. The film that scandalised Britain in 1960 — and was rediscovered as a masterpiece.',
    rating: 7.6,
    certificate: '15',
    country: 'UK',
    language: 'English',
    cast: [
      { name: 'Karlheinz Böhm', role: 'Mark Lewis' },
      { name: 'Anna Massey', role: 'Helen Stephens' },
      { name: 'Moira Shearer', role: 'Vivian' },
      { name: 'Maxine Audley', role: 'Mrs Stephens' },
      { name: 'Brenda Bruce', role: 'Dora' },
    ],
  },
  {
    id: 'lawrence-of-arabia',
    title: 'Lawrence of Arabia',
    year: 1962,
    genre: 'Epic',
    runtime: '3h 47m',
    runtimeMin: 227,
    rating: 8.3,
    type: 'FILM',
    poster: poster('poster-lawrence-of-arabia.jpg'),
    backdrop: still('still-lawrence-of-arabia.jpg'),
    backdrop2: still('still-lawrence-of-arabia-2.jpg'),
    director: 'David Lean',
    synopsis:
      "David Lean's monumental account of T. E. Lawrence — archaeologist, soldier, enigma — and the desert war that made and unmade him.",
    certificate: 'PG',
    country: 'UK',
    language: 'English',
    cast: [
      { name: "Peter O'Toole", role: 'T. E. Lawrence' },
      { name: 'Alec Guinness', role: 'Prince Faisal' },
      { name: 'Anthony Quinn', role: 'Auda abu Tayi' },
      { name: 'Jack Hawkins', role: 'General Allenby' },
      { name: 'Omar Sharif', role: 'Sherif Ali' },
      { name: 'Claude Rains', role: 'Mr Dryden' },
    ],
  },
  {
    id: 'billy-liar',
    title: 'Billy Liar',
    year: 1963,
    genre: 'Comedy',
    runtime: '1h 38m',
    runtimeMin: 98,
    type: 'FILM',
    poster: poster('poster-billy-liar.jpg'),
    director: 'John Schlesinger',
    synopsis:
      'An undertaker\'s clerk in a northern town lies his way through life and daydreams of escape to London. A bittersweet landmark of the British New Wave.',
    rating: 7.3,
    certificate: 'PG',
    country: 'UK',
    language: 'English',
    cast: [
      { name: 'Tom Courtenay', role: 'Billy Fisher' },
      { name: 'Julie Christie', role: 'Liz' },
      { name: 'Wilfred Pickles', role: 'Geoffrey Fisher' },
      { name: 'Mona Washbourne', role: 'Alice Fisher' },
      { name: 'Rodney Bewes', role: 'Arthur Crabtree' },
    ],
  },
  {
    id: 'if',
    title: 'If....',
    year: 1968,
    genre: 'Drama',
    runtime: '1h 51m',
    runtimeMin: 111,
    type: 'FILM',
    poster: poster('poster-if.jpg'),
    director: 'Lindsay Anderson',
    synopsis:
      'At an English boarding school ruled by tradition and cruelty, three boys drift from rebellion into insurrection. Lindsay Anderson\'s Palme d\'Or-winning provocation.',
    rating: 7.5,
    certificate: '15',
    country: 'UK',
    language: 'English',
    cast: [
      { name: 'Malcolm McDowell', role: 'Mick Travis' },
      { name: 'David Wood', role: 'Johnny' },
      { name: 'Richard Warwick', role: 'Wallace' },
      { name: 'Christine Noonan', role: 'The Girl' },
      { name: 'Robert Swann', role: 'Rowntree' },
    ],
  },
  {
    id: 'dont-look-now',
    title: "Don't Look Now",
    year: 1973,
    genre: 'Horror',
    runtime: '1h 50m',
    runtimeMin: 110,
    type: 'FILM',
    poster: poster('poster-dont-look-now.jpg'),
    director: 'Nicolas Roeg',
    synopsis:
      'A grieving couple moves to wintry Venice after their daughter\'s death, where a red coat keeps flickering at the edge of sight. Roeg\'s shattering mosaic of grief and premonition.',
    rating: 7.2,
    certificate: '15',
    country: 'UK, Italy',
    language: 'English',
    cast: [
      { name: 'Julie Christie', role: 'Laura Baxter' },
      { name: 'Donald Sutherland', role: 'John Baxter' },
      { name: 'Hilary Mason', role: 'Heather' },
      { name: 'Clelia Matania', role: 'Wendy' },
    ],
  },
  {
    id: 'the-wicker-man',
    title: 'The Wicker Man',
    year: 1973,
    genre: 'Horror',
    runtime: '1h 28m',
    runtimeMin: 88,
    type: 'FILM',
    poster: poster('poster-wicker-man.jpg'),
    director: 'Robin Hardy',
    synopsis:
      'A devout policeman searches a remote Scottish island for a missing girl, and finds a community that worships older gods. The benchmark of folk horror.',
    rating: 7.5,
    certificate: '15',
    country: 'UK',
    language: 'English',
    cast: [
      { name: 'Edward Woodward', role: 'Sergeant Howie' },
      { name: 'Christopher Lee', role: 'Lord Summerisle' },
      { name: 'Britt Ekland', role: 'Willow' },
      { name: 'Diane Cilento', role: 'Miss Rose' },
      { name: 'Ingrid Pitt', role: 'Librarian' },
    ],
  },
  {
    id: 'withnail-and-i',
    title: 'Withnail and I',
    year: 1987,
    genre: 'Comedy',
    runtime: '1h 47m',
    runtimeMin: 107,
    type: 'FILM',
    poster: poster('poster-withnail-and-i.jpg'),
    director: 'Bruce Robinson',
    synopsis:
      'Two unemployed actors flee 1969 Camden for a disastrous holiday in the Lake District. The most quotable film in British cinema.',
    rating: 8.0,
    certificate: '15',
    country: 'UK',
    language: 'English',
    cast: [
      { name: 'Richard E. Grant', role: 'Withnail' },
      { name: 'Paul McGann', role: 'Marwood' },
      { name: 'Richard Griffiths', role: 'Uncle Monty' },
      { name: 'Ralph Brown', role: 'Danny' },
    ],
  },
  {
    id: 'naked',
    title: 'Naked',
    year: 1993,
    genre: 'Drama',
    runtime: '2h 12m',
    runtimeMin: 132,
    type: 'FILM',
    poster: poster('poster-naked.jpg'),
    director: 'Mike Leigh',
    synopsis:
      'Johnny talks his way through a long London night — brilliant, cruel, and burning down to the end of himself. Mike Leigh at his darkest; Thewlis at his best.',
    rating: 7.7,
    certificate: '18',
    country: 'UK',
    language: 'English',
    cast: [
      { name: 'David Thewlis', role: 'Johnny' },
      { name: 'Lesley Sharp', role: 'Louise' },
      { name: 'Katrin Cartlidge', role: 'Sophie' },
      { name: 'Greg Cruttwell', role: 'Jeremy' },
    ],
  },
  {
    id: 'sexy-beast',
    title: 'Sexy Beast',
    year: 2000,
    genre: 'Crime',
    runtime: '1h 29m',
    runtimeMin: 89,
    type: 'FILM',
    poster: poster('poster-sexy-beast.jpg'),
    director: 'Jonathan Glazer',
    synopsis:
      'A retired safecracker sunning himself in Spain is visited by the one man who won\'t take no for an answer. Ben Kingsley as cinema\'s most terrifying houseguest.',
    rating: 7.3,
    certificate: '18',
    country: 'UK, Spain',
    language: 'English',
    cast: [
      { name: 'Ray Winstone', role: 'Gal Dove' },
      { name: 'Ben Kingsley', role: 'Don Logan' },
      { name: 'Ian McShane', role: 'Teddy Bass' },
      { name: 'Amanda Redman', role: 'DeeDee' },
    ],
  },
  {
    id: 'billy-elliot',
    title: 'Billy Elliot',
    year: 2000,
    genre: 'Drama',
    runtime: '1h 50m',
    runtimeMin: 110,
    type: 'FILM',
    poster: poster('poster-billy-elliot.jpg'),
    director: 'Stephen Daldry',
    synopsis:
      'During the miners\' strike, a boy from a Durham pit village trades boxing gloves for ballet shoes — against everything his family knows.',
    rating: 7.7,
    certificate: '15',
    country: 'UK',
    language: 'English',
    cast: [
      { name: 'Jamie Bell', role: 'Billy Elliot' },
      { name: 'Julie Walters', role: 'Mrs Wilkinson' },
      { name: 'Gary Lewis', role: 'Jackie Elliot' },
      { name: 'Jamie Draven', role: 'Tony Elliot' },
    ],
  },
  {
    id: 'under-the-skin',
    title: 'Under the Skin',
    year: 2013,
    genre: 'Sci-Fi',
    runtime: '1h 48m',
    runtimeMin: 108,
    type: 'FILM',
    poster: poster('poster-under-the-skin.jpg'),
    director: 'Jonathan Glazer',
    synopsis:
      'Something wearing a woman\'s body drives a van through Glasgow, watching, luring, learning. Glazer\'s hypnotic alien gaze turned on us.',
    rating: 6.3,
    certificate: '15',
    country: 'UK',
    language: 'English',
    cast: [
      { name: 'Scarlett Johansson', role: 'The Female' },
      { name: 'Jeremy McWilliams', role: 'The Motorcyclist' },
      { name: 'Adam Pearson', role: 'The Deformed Man' },
      { name: 'Lynsey Taylor Mackay', role: 'Older Sister' },
    ],
  },
  {
    id: '45-years',
    title: '45 Years',
    year: 2015,
    genre: 'Drama',
    runtime: '1h 35m',
    runtimeMin: 95,
    type: 'FILM',
    poster: poster('poster-45-years.jpg'),
    director: 'Andrew Haigh',
    synopsis:
      'A week before their 45th anniversary, a letter arrives and a marriage quietly begins to subside. Rampling and Courtenay, devastating in miniature.',
    rating: 7.1,
    certificate: '15',
    country: 'UK',
    language: 'English',
    cast: [
      { name: 'Charlotte Rampling', role: 'Kate Mercer' },
      { name: 'Tom Courtenay', role: 'Geoff Mercer' },
      { name: 'Geraldine James', role: 'Lena' },
      { name: 'Dolly Wells', role: 'Charlotte' },
    ],
  },
  {
    id: 'the-souvenir',
    title: 'The Souvenir',
    year: 2019,
    genre: 'Drama',
    runtime: '2h 0m',
    runtimeMin: 120,
    type: 'FILM',
    poster: poster('poster-the-souvenir.jpg'),
    director: 'Joanna Hogg',
    synopsis:
      'A film student in 1980s London falls into a consuming relationship with a charming, untrustworthy older man. Joanna Hogg\'s exacting memory-piece.',
    rating: 6.6,
    certificate: '15',
    country: 'UK',
    language: 'English',
    cast: [
      { name: 'Honor Swinton Byrne', role: 'Julie' },
      { name: 'Tom Burke', role: 'Anthony' },
      { name: 'Tilda Swinton', role: 'Rosalind' },
      { name: 'Richard Ayoade', role: 'Patrick' },
    ],
  },
  {
    id: 'saint-maud',
    title: 'Saint Maud',
    year: 2019,
    genre: 'Horror',
    runtime: '1h 24m',
    runtimeMin: 84,
    type: 'FILM',
    poster: poster('poster-saint-maud.jpg'),
    director: 'Rose Glass',
    synopsis:
      'A devout hospice nurse becomes convinced God has a mission for her dying patient\'s soul. Rose Glass\'s razor-wire debut about faith curdling into obsession.',
    rating: 6.7,
    certificate: '15',
    country: 'UK',
    language: 'English',
    cast: [
      { name: 'Morfydd Clark', role: 'Maud' },
      { name: 'Jennifer Ehle', role: 'Amanda' },
      { name: 'Lily Frazer', role: 'Carol' },
      { name: 'Turlough Convery', role: 'Joy' },
    ],
  },
  {
    id: 'aftersun',
    title: 'Aftersun',
    year: 2022,
    genre: 'Drama',
    runtime: '1h 42m',
    runtimeMin: 102,
    type: 'FILM',
    poster: poster('poster-aftersun.jpg'),
    director: 'Charlotte Wells',
    synopsis:
      'A woman replays camcorder tapes of a Turkish package holiday with her young father, looking for the sadness she missed at eleven. Quietly devastating.',
    rating: 7.6,
    certificate: '12A',
    country: 'UK, USA',
    language: 'English',
    cast: [
      { name: 'Paul Mescal', role: 'Calum' },
      { name: 'Frankie Corio', role: 'Sophie' },
      { name: 'Celia Rowlson-Hall', role: 'Adult Sophie' },
      { name: 'Sally Messham', role: 'Belinda' },
    ],
  },
  {
    id: 'touching-the-void',
    title: 'Touching the Void',
    year: 2003,
    genre: 'Documentary',
    runtime: '1h 46m',
    runtimeMin: 106,
    type: 'DOC',
    poster: poster('poster-touching-the-void.jpg'),
    director: 'Kevin Macdonald',
    synopsis:
      'Two climbers, one rope, an impossible decision in the Peruvian Andes — and the crawl back that shouldn\'t have been survivable. Docudrama at its most gripping.',
    rating: 8.0,
    certificate: '15',
    country: 'UK',
    language: 'English',
    cast: [
      { name: 'Joe Simpson', role: 'Himself' },
      { name: 'Simon Yates', role: 'Himself' },
      { name: 'Brendan Mackey', role: 'Joe Simpson (dramatisation)' },
      { name: 'Nicholas Aaron', role: 'Simon Yates (dramatisation)' },
    ],
  },
  {
    id: 'senna',
    title: 'Senna',
    year: 2010,
    genre: 'Documentary',
    runtime: '1h 46m',
    runtimeMin: 106,
    type: 'DOC',
    poster: poster('poster-senna.jpg'),
    director: 'Asif Kapadia',
    synopsis:
      'Ayrton Senna\'s decade in Formula One — faith, genius, politics and the weekend at Imola — told entirely through archive footage.',
    rating: 8.5,
    certificate: '12A',
    country: 'UK',
    language: 'English, Portuguese',
    cast: [
      { name: 'Ayrton Senna', role: 'Himself' },
      { name: 'Alain Prost', role: 'Himself' },
      { name: 'Frank Williams', role: 'Himself' },
      { name: 'Ron Dennis', role: 'Himself' },
    ],
  },
];

// Headshots sourced from Wikimedia by scripts/fetch-cast.mjs. Cast members
// not in this set render an initials monogram instead; a global CSS filter
// gives every avatar the same warm-mono treatment regardless of era/source.
const CAST_PHOTOS = new Set([
  'trevor-howard', 'stanley-holloway', 'deborah-kerr', 'david-farrar', 'kathleen-byron',
  'sabu', 'jean-simmons', 'flora-robson', 'moira-shearer', 'anton-walbrook', 'marius-goring',
  'leonide-massine', 'karlheinz-bohm', 'anna-massey', 'peter-o-toole', 'alec-guinness',
  'anthony-quinn', 'jack-hawkins', 'omar-sharif', 'claude-rains', 'tom-courtenay',
  'julie-christie', 'rodney-bewes', 'malcolm-mcdowell', 'donald-sutherland', 'clelia-matania',
  'edward-woodward', 'christopher-lee', 'britt-ekland', 'diane-cilento', 'richard-e-grant',
  'paul-mcgann', 'richard-griffiths', 'ralph-brown', 'david-thewlis', 'lesley-sharp',
  'katrin-cartlidge', 'greg-cruttwell', 'ray-winstone', 'ben-kingsley', 'ian-mcshane',
  'amanda-redman', 'jamie-bell', 'julie-walters', 'gary-lewis', 'scarlett-johansson',
  'jeremy-mcwilliams', 'adam-pearson', 'charlotte-rampling', 'dolly-wells', 'honor-swinton-byrne',
  'tom-burke', 'tilda-swinton', 'richard-ayoade', 'morfydd-clark', 'jennifer-ehle', 'paul-mescal',
  'celia-rowlson-hall', 'joe-simpson', 'ayrton-senna', 'alain-prost', 'frank-williams', 'ron-dennis',
]);

for (const f of FILMS) {
  if (!f.cast) continue;
  for (const p of f.cast) {
    if (!p.photo && CAST_PHOTOS.has(slug(p.name))) {
      p.photo = castImg(`cast-${slug(p.name)}.jpg`);
    }
  }
}

// O(1) lookup — byId is called once per card on every Browse/Home render, so a
// linear scan over ~25 films added up across a grid
const _filmById = new Map(FILMS.map((f) => [f.id, f]));
export const byId = (id) => _filmById.get(id);

// ── Home page composition (mirrors the Figma hi-fi Home) ──────────
export const HERO = {
  filmId: 'lawrence-of-arabia',
  eyebrow: 'NUX Exclusive',
  meta: 'Epic · 1962 · 3h 47m · ★ 8.3',
};

// rotating featured titles on the Home hero (all have landscape art)
export const HERO_ROTATION = [
  { filmId: 'lawrence-of-arabia', eyebrow: 'NUX Exclusive' },
  { filmId: 'the-third-man', eyebrow: 'Restored in 4K' },
  { filmId: 'black-narcissus', eyebrow: 'Editor’s Pick' },
  { filmId: 'the-red-shoes', eyebrow: 'The Powell & Pressburger Collection' },
];

// Honest pairs only: each still actually belongs to the film it labels.
export const CONTINUE_WATCHING = [
  { filmId: 'the-third-man', still: still('still-third-man-660.jpg'), minutesLeft: 31 },
  { filmId: 'black-narcissus', still: still('still-black-narcissus-660.jpg'), minutesLeft: 22 },
  { filmId: 'lawrence-of-arabia', still: still('still-lawrence-of-arabia-660.jpg'), minutesLeft: 96 },
  { filmId: 'the-red-shoes', still: still('still2-red-shoes-660.jpg'), minutesLeft: 47 },
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
    id: 'restorations',
    title: 'New Restorations',
    filmIds: ['the-souvenir', 'saint-maud', 'aftersun', 'touching-the-void', 'senna', 'the-third-man', 'brief-encounter'],
  },
];

export const EDITORIAL_PICK = {
  eyebrow: 'Editorial Pick',
  title: 'The Essential Ten',
  dek: 'Ten films we keep returning to — the canon we’d hand a newcomer first',
  cta: 'Read the list',
  image: genreImg('genre-arthouse.jpg'),
  slug: 'best-2026',
};

export const COLLECTIONS = {
  'best-2026': {
    eyebrow: 'The Curator’s Canon',
    title: 'The Essential Ten',
    intro:
      'The ten we’d start anyone with — restorations that arrived like new releases, and modern films already built to last. Each one earned a second, third, fourth watch.',
    cover: genreImg('genre-arthouse.jpg'),
    entries: [
      ['aftersun', 'A camcorder holiday becomes the saddest film about memory in years — the one we kept coming back to.'],
      ['the-souvenir', 'Joanna Hogg’s exacting memory-piece: love as a slow, deliberate undoing.'],
      ['saint-maud', 'Faith curdles into obsession in 84 razor-wire minutes.'],
      ['under-the-skin', 'An alien gaze turned on us — still the most hypnotic thing on the platform.'],
      ['45-years', 'A marriage subsides in a single week; Rampling’s final shot is the year’s best.'],
      ['the-red-shoes', 'The 4K restoration that played like the boldest new release of the year.'],
      ['black-narcissus', 'Technicolor delirium, restored — altitude, wind and memory undoing a convent.'],
      ['the-third-man', 'Shadow-soaked Vienna, sharper than ever in the new transfer.'],
      ['lawrence-of-arabia', 'Still the widest screen cinema can offer.'],
      ['naked', 'Thewlis talks through one long London night; Leigh at his darkest.'],
    ],
  },
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

// map each genre card to the catalog genre labels it gathers — shared by the
// Genre page and Home's personalized "Because you like…" rail. Empty list =
// honest "coming soon" shelf (no British titles in the demo catalog yet).
export const GENRE_MATCH = {
  drama: ['Drama'],
  thriller: ['Film-Noir', 'Thriller'],
  documentary: ['Documentary'],
  horror: ['Horror'],
  'sci-fi': ['Sci-Fi'],
  romance: ['Romance'],
  history: ['Epic'],
  crime: ['Crime'],
  'art-house': ['Sci-Fi', 'Drama'],
  comedy: ['Comedy'],
  animation: [],
  musical: [],
};

// ── Fictional non-film content (generated key art) ────────────────
export const EXTRAS = {
  game: {
    id: 'neon-drift',
    title: 'Neon Drift',
    type: 'GAME',
    genre: 'Action-Adventure',
    meta: 'Action-Adventure · 2026 · Cloud Play',
    rating: 7.1,
    poster: genreImg('genre-poster-neondrift.jpg'),
    synopsis:
      'Pilot a salvaged starfighter through the neon ruins of a dead empire. A reflex-driven roguelite with handcrafted runs, online co-op and a synthwave score.',
    features: ['Single-player', 'Online co-op', 'Cloud Play', 'Controller'],
  },
  course: {
    id: 'art-of-editing',
    title: 'The Art of Editing',
    type: 'COURSE',
    genre: 'Filmmaking',
    meta: 'by A. Okonkwo · 12 lessons · 4h 30m · ★ 4.8',
    poster: genreImg('genre-poster-course.jpg'),
    synopsis:
      'Twelve lessons on the invisible craft — rhythm, the cut on motion, the eyeline match, and how an edit makes you feel. Taught through the films in the NUX library.',
    lessons: [
      { n: 1, title: 'Cutting on Motion', len: '18 min' },
      { n: 2, title: 'The Invisible Cut', len: '22 min' },
      { n: 3, title: 'Rhythm & the Pause', len: '24 min' },
      { n: 4, title: 'Eyelines & Geography', len: '19 min' },
      { n: 5, title: 'Montage & Meaning', len: '26 min' },
      { n: 6, title: 'Sound Before Picture', len: '21 min' },
    ],
  },
  welcomeBg: genreImg('genre-welcome-bg.jpg'),
};

// Game + Course are also addressable as detail pages.
const EXTRA_TITLES = {
  'neon-drift': { ...EXTRAS.game, backdrop: EXTRAS.game.poster },
  'art-of-editing': { ...EXTRAS.course, backdrop: EXTRAS.course.poster },
};

export const anyTitleById = (id) => byId(id) || EXTRA_TITLES[id] || null;
