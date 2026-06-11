# NUX Genre Imagery — промпты для Higgsfield (Nano Banana Pro, 2K, Unlimited)

Веб-UI: выбери **Nano Banana Pro**, resolution **2K**, включи тумблер **Unlimited**.
Жанры — aspect **3:2**; постеры — **2:3**; welcome — **16:9**.

## Базовый рецепт (общий хвост каждого промпта)

```
single subject centered on a deep warm near-black background, dramatic single warm amber key light from the upper left, deep soft shadows, shallow depth of field, subtle 35mm film grain, muted tones with warm golden highlights, minimalist editorial composition in the style of Criterion Collection key art, photographic realism, no text, no people
```

## Жанры (3:2) — `Cinematic still life photograph: <ОБЪЕКТ>, <базовый рецепт>`

| Жанр | Объект |
|---|---|
| Drama | a heavy crumpled red velvet theater curtain |
| Thriller | a vintage black telephone handset dangling on its coiled cord |
| Documentary | a 16mm film reel with a strip of celluloid unspooling |
| Horror | a single melted dripping candle with a trembling flame in darkness |
| Sci-Fi | a polished chrome sphere on dark surface reflecting a single tiny window of warm light |
| Romance | two champagne coupe glasses touching, warm bokeh lights behind |
| History | an antique brass pocket watch on a chain, lid half open |
| Animation | a fan of colored pencils, tips toward camera |
| Crime | scattered vintage playing cards on a dark table with a thin ribbon of cigarette smoke rising through the light beam |
| Art House | a vintage film projector casting a visible beam of light through haze |
| Comedy | a single red clown nose on a dark seat |
| Musical | a vinyl record with dramatic light reflection across the grooves |

## Постеры вымышленного контента (2:3)

**Neon Drift (игра):**
```
Retro synthwave video game key art: a lone starfighter flying through neon ruins of a dead empire at night, deep blacks with warm amber and magenta neon glow, atmospheric haze, subtle film grain, painterly cinematic style, vertical movie poster composition, no text
```

**The Art of Editing (курс):**
```
Cinematic still life photograph: a vintage film editing splicer with strips of celluloid film on a dark editing desk, warm desk lamp glow, <базовый рецепт>
```

## Welcome-фон (16:9)

```
Dark empty cinema auditorium, single projector beam of warm amber light cutting through haze from behind, rows of seats barely visible in deep warm darkness, cinematic, subtle 35mm film grain, moody minimalist, no text, no people
```

## После генерации

Сложи 2K-файлы в `design/genres/` с теми же именами (`genre-drama.png`, …, `genre-poster-neondrift.png`, `genre-poster-course.png`, `genre-welcome-bg.png`) — скажи мне, и я заменю их в Figma одной операцией.
