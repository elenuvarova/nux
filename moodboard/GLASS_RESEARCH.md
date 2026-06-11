# NUX — Glass Research: подходит ли нам стекло и где именно

**Вопрос:** «может нам стекло подойдёт вообще?» — оценка glassmorphism / Liquid Glass / translucent materials для NUX (premium dark streaming, Criterion × MUBI × Apple TV).
**Контекст:** проверяет и развивает §7 `HIFI_DIRECTION.md` (доктрина «ink, not glass») и §6 `STYLE_RESEARCH_2026.md`. Этот док **не отменяет** Cinema Ink — он отвечает, сколько стекла система выдерживает и где оно работает на «вау», а не против бренда.
**Источники:** styles.refero.design (2 glass-стиля из каталога разобраны полностью), NN/g по Liquid Glass, Apple Newsroom / 9to5mac / AppleInsider по tvOS 26 и Apple TV app, trend-press 2026.

---

## 1. Резюме-вердикт

**Да — но selective glass, не glass system.** Стекло в NUX уместно ровно там, где под ним есть что преломлять — постеры, кадры, видео: floating nav/tab bar, бейджи поверх артов, транспорт плеера, scrim за шторками — и нигде на плоских ink-поверхностях. Это не компромисс, а буквально то, как стекло используют лучшие 2026-системы (Apple TV app, и это же пишет каждый серьёзный разбор: «glass на оверлеях, не на контенте»). Смелый вариант — glass-карточки и glass-чипы по всему UI — отвергаем осознанно: на плоском `#0D0C0B` стекло «мёртвое» (нечего размывать), поверх постеров оно убивает контраст (главный документированный провал iOS 26 по NN/g), и оно растворяет editorial-ink идентичность NUX в общем «AI-dashboard 2026» виде. Формула: **система — ink, всё плавающее над контентом — glass**; amber остаётся чернилами и на стекло не наносится никогда. «Вау» добираем не количеством стекла, а его качеством: `saturate(1.8)` (цвета постеров цветут в блюре), light-catch блик, floating pill tab bar, glass-транспорт плеера поверх видео.

---

## 2. «Стекло-2026» vs glassmorphism-2021

| | Glassmorphism 2021 (Dribbble-волна) | Glass 2026 (production: Apple, Linear-класс) |
|---|---|---|
| Где применяется | Везде: карточки, формы, целые страницы из стекла | **Selective:** floating toolbar, modal, player overlay, бейдж — 1–2 элемента на экран ([Clay](https://clay.global/blog/glassmorphism-ui), [Inverness](https://invernessdesignstudio.com/glassmorphism-what-it-is-and-how-to-use-it-in-2026)) |
| Фон под стеклом | Декоративные mesh-градиенты, придуманные специально под стекло | **Реальный контент** — стекло честно зарабатывает блюр тем, что под ним скроллится UI/имиджи; в стриминге/музыке «интерфейс адаптирует цвета под играющий контент» — это уже стандарт жанра ([Dark Glassmorphism, Medium](https://medium.com/@developer_89726/dark-glassmorphism-the-aesthetic-that-will-define-ui-in-2026-93aa4153088f)) |
| Прозрачность | 10–30% fill — «красиво на шоте, нечитаемо в проде» | **60–85% fill** + blur 20–24px: блюр виден по краям и в движении, текст всегда читается |
| Светотень | Белые borders 1–2px по всему контуру, радужные тени | **Hairline 1px на 8–12% + один inset light-catch сверху** (`inset 0 1px 0 rgba(255,255,255,.06)`) — «стекло ловит свет», не «обведено фломастером» |
| Цвет стекла | Подкрашенное брендом (фиолетовое, голубое) | **Нейтральное / в цвет холста** + `saturate(1.4–1.8)` — насыщенность достаёт из контента, не из краски |
| Роль | Декорация, «вид» | **Структура:** стекло = слой «хром поверх контента», ink = слой «система». Liquid Glass у Apple — system-rendered рефракция в реальном времени; на web её не симулируют, web-стекло остаётся честным frosted blur |
| Статус | Тренд → выгорел за год | «Design infrastructure, not trend» — но с задокументированным a11y-провалом при передозировке (NN/g ниже) |

Ключевая проверка из refero (стиль Dimension, дословно): **«Glassmorphism on flat #0a0a0a looks dead; it needs something colorful or lit behind it to read as glass.»** Это центральный аргумент всей карты ниже.

---

## 3. Находки: refero + реальные продукты

### 3.1 refero.design — стекло в премиум-каталоге почти отсутствует, и это сигнал

Из ~2000 систем каталога стекло как материал заявляют **две**. Все премиум-тёмные «кино»-эталоны (Sequel, monopo saigon, Vivid+Co — см. STYLE_RESEARCH_2026) — матовые: ink + hairlines. Вывод №1 уже здесь: editorial-премиум 2026 стеклом **не** строится.

**Dimension — «pre-dawn glassmorphic command deck»** · [styles.refero.design/style/fbcf9cbb-…](https://styles.refero.design/style/fbcf9cbb-7c6b-449d-862a-bce521a8ab1d) · родственники: Linear, Vercel, Raycast, Arc
- Рецепт стекла: `rgba(29,29,29,0.85)` + `backdrop-filter: blur(20–24px)` + border 1px `#e5e5e5` @ 8–10% + опц. `inset 0 1px 0 rgba(255,255,255,.06)`.
- Стеклянные компоненты: **floating pill navigation** (radius 9999), status pills, один hero-«glass artifact». Карточки контента — НЕ стекло.
- Их же правило: стекло всегда плавает **над** градиентом/слоями, никогда на плоском фоне. Иерархия — weight/opacity, не цвет.
- Урок для NUX: анатомия современного стекла (fill ≥0.85 в тоне холста, hairline, light-catch, pill) — берём; «glass artifact как герой» — не берём, у NUX герой — постер.

**Authkit — «blueprint on midnight glass»** · [styles.refero.design/style/e80231a2-…](https://styles.refero.design/style/e80231a2-e4d6-406a-a2c9-2e6109679690) · родственники: Linear, Vercel, Clerk, Resend
- Несмотря на слово «glass» в названии — **демонстративно отказывается от backdrop-blur**: глубина через inset-hairlines `rgba(186,215,247,.12)` и мягкие внутренние свечения, «light drawn on dark paper».
- Урок для NUX: даже «стеклянные» бренды 2026 на плоских тёмных поверхностях рисуют светом, а не блюром — ровно наша ink-доктрина. Подтверждает: карточкам NUX стекло не нужно.

### 3.2 Реальные продукты

- **Apple TV app (iOS 26 / tvOS 26)** — главный референс-конкурент: Liquid Glass на **tab bar, Control Center, player controls** — «controls float above your video without obstructing what's happening underneath»; контент-тайлы и постеры остались непрозрачными ([9to5mac](https://9to5mac.com/2025/07/16/apples-tv-app-gets-fresh-design-in-ios-26-and-tvos-26-heres-whats-new/), [AppleInsider](https://appleinsider.com/articles/25/06/18/tvos-26-hands-on-sleek-liquid-glass-redesign-new-control-center-and-more), [Apple Newsroom](https://www.apple.com/newsroom/2025/06/apple-tv-brings-a-beautiful-redesign-and-enhanced-home-entertainment-experience/)). То есть лучший стриминг-UI индустрии = ровно selective-карта, к которой мы приходим.
- **Third-party adoption iOS 26:** Apple ведёт Design Gallery (AllTrails, Fantastical, Carrot Weather, Trello, Le Monde…) — паттерн одинаковый: tab bars, nav buttons, bottom toolbars; никто не делает стеклянный контент ([MacObserver](https://www.macobserver.com/news/apple-updates-liquid-glass-design-gallery-with-new-third-party-app-examples/), [MacRumors](https://www.macrumors.com/2026/04/06/apple-liquid-glass-design-gallery-update/)).
- **Обратная сторона:** adoption iOS 26 ~15% за 4 месяца (vs 63% у iOS 18) на фоне backlash к Liquid Glass ([NotebookCheck](https://www.notebookcheck.net/iOS-26-reportedly-struggling-for-adoption-amid-Liquid-Glass-UI-backlash.1201110.0.html)); **NN/g**: «restless, needy, less legible» — плавающий search блендится с фоном, полупрозрачные tab bars нечитаемы на пёстром контенте, пользователи массово включали Reduce Transparency ([NN/g — Liquid Glass Is Cracked](https://www.nngroup.com/articles/liquid-glass/)). Apple отступила: в iOS 26.1 добавлен переключатель opacity «tinted/clear» ([FindArticles](https://www.findarticles.com/ios-26-1-gets-liquid-glass-opacity-control/)), к WWDC 2026 — рефайнменты ([TechTimes](https://www.techtimes.com/articles/317975/20260608/apple-liquid-glass-ios-27-wwdc-2026-brings-refinements-developers-must-adopt-today.htm)). Перевод: рынок уже оплатил эксперимент «стекла много» и откатился к «стекло плотное и точечное».

---

## 4. Карта применения для NUX

**Принцип одной строкой: плавает над контентом → glass; лежит в системе → ink.** Всё стекло — в тоне холста `rgba(13,12,11,…)` (никогда нейтрально-чёрное и никогда подкрашенное amber), всегда с hairline + light-catch.

### 4.1 GLASS — да

| Компонент | Зачем стекло (что под ним) | Спека |
|---|---|---|
| **Tab bar iPhone — floating pill** | Постеры скроллятся под баром — самый дешёвый «премиум» системы | отделён от края (bottom 12px, inset 16px), radius 9999/24px; `background: rgba(13,12,11,0.72); backdrop-filter: blur(20px) saturate(1.8); border: 1px solid rgba(255,255,255,0.10); box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), 0 8px 32px rgba(0,0,0,0.4)` |
| **Top nav / sticky header (web, iPad)** | Hero и сетка уезжают под шапку | `rgba(13,12,11,0.72)` + `blur(20px) saturate(1.8)`; `border-bottom: 1px solid rgba(255,255,255,0.08)`; до первого скролла — полностью прозрачный (над hero работает top-scrim из §4 HIFI_DIRECTION), стекло включается по scroll-edge |
| **Бейджи на артворке** (FILM/DOC/GAME/COURSE, EDITOR'S PICK) | Лежат прямо на постере | уже специфицировано: `rgba(13,12,11,0.72)` + `blur(8px)`, border `rgba(255,255,255,0.12)`, + light-catch `inset 0 1px 0 rgba(255,255,255,0.08)`; текст `#F2EFE9`, amber — только текст+hairline EDITOR'S PICK |
| **Player transport / контролы плеера (web, iOS)** | Под ними живое видео — идеальный субстрат | `rgba(13,12,11,0.60)` + `blur(24px) saturate(1.6)`; border `rgba(255,255,255,0.10)` + light-catch; amber-скраббер ПОВЕРХ стекла (fill бара, не tint стекла); айфон-кнопки — glass-pills той же рецептуры |
| **Scrim за sheet/modal** | За шторкой — страница с постерами | дим-слой `rgba(13,12,11,0.5)` + `backdrop-filter: blur(12px)`; **сама шторка остаётся ink** `#1F1C19` (паттерн Letterboxd: opaque sheet над blurred page) |
| **Quick-action pills на hover карточки** (web: ▶ / + My List поверх постера) | Появляются на самом изображении | та же анатомия, что бейджи: `rgba(13,12,11,0.72)` + `blur(8px)`, radius 9999 |
| **tvOS — всё стеклянное** | — | **только system Liquid Glass**: системный плеер, фокус, Control Center. В своём слое — ноль самодельного стекла (Apple TV 4K gen2+ рендерит рефракцию железом; подделка на gen1 и в кастомных вью выглядит дешевле системы) |

### 4.2 INK — никогда не стекло

| Компонент | Почему |
|---|---|
| Карточки/постеры, editorial-модули, essay-страницы | Лежат на плоском `#0D0C0B` — стеклу нечего преломлять («glass on flat canvas looks dead», Dimension); плюс blur-под-каждой-карточкой в сетке = производительность в ноль |
| Primary CTA (amber) | Amber — пигмент (правило §2 HIFI_DIRECTION «ink, not foil»); полупрозрачный amber = фольга/казино + контраст dark-on-amber 7.1:1 разваливается на непредсказуемом фоне |
| Page/raised/overlay поверхности, sheets (сама панель), inputs, формы, Settings | Системный слой; читаемость форм важнее эффекта |
| Chips/фильтры в статичном положении на странице | На `#0D0C0B` стекло = грязно-серый прямоугольник |
| Toasts | Гарантированный контраст важнее: `#1F1C19` + hairline + ambient shadow |

### 4.3 СПОРНО — решаем скрин-тестом

| Компонент | За | Против | Лин по умолчанию |
|---|---|---|---|
| **Sticky filter-bar**, прилипающий над скроллящейся сеткой | под ним едут постеры → субстрат есть | третий glass-элемент в вьюпорте рядом с nav | glass только в sticky-состоянии (как top nav), статично — ink |
| **Метаданные-плашка в hero** (рейтинг, 4K·HDR на key art) | лежит на арте | hero уже защищён скримом — может хватить голого текста | сначала текст на скриме; glass-pill — если арт слишком пёстрый |
| **Desktop floating pill nav** (Dimension-style, вместо полосы) | максимально «2026» | NUX-навигация уже специфицирована полосой; pill-nav пахнет лендингом, не продуктом | оставить полосу; pill — только если будет редизайн шапки |

**Бюджет: максимум 2 glass-элемента в одном вьюпорте** (примеры: nav + бейджи; плеер: транспорт + glass-pills считаются одним слоем хрома). Третий = передозировка iOS-26-образца.

---

## 5. Риски и правила

1. **Контраст поверх постеров — измеряется, не оценивается на глаз.** Fill стекла в тоне холста с alpha **≥0.60** (плеер) / **≥0.72** (nav, бейджи). Проверка worst-case: текст `#F2EFE9` на `rgba(13,12,11,0.72)` поверх белого кадра даёт ~5.5:1 (AA ✓); при alpha 0.5 уже проваливается. Любой новый glass-элемент тестируем на самом светлом постере каталога. Amber-текст на стекле запрещён (его 7:1 живёт только на стабильном `#0D0C0B`); на стекле — только `text/primary` и белые иконки, без `text/tertiary`.
2. **Фолбэк без backdrop-filter обязателен:** `@supports not (backdrop-filter: blur(1px)) { background: rgba(13,12,11,0.94); }` — старые браузеры/«энергосбережение» получают почти-непрозрачный ink, ничего не ломается.
3. **`prefers-reduced-transparency` уважаем:** media query → все glass-элементы становятся `#161412`/`#1F1C19` непрозрачными. Это прямой урок NN/g (люди включали Reduce Transparency как «починку дизайна» — наш UI должен чинится сам).
4. **Performance:** `backdrop-filter` — дорогой композитинг. Только на фиксированных/плавающих элементах (nav, transport, scrim), никогда в скроллящихся списках и никогда на n элементах сетки. На мобиле blur ≤24px.
5. **Не симулировать Liquid Glass.** Рефракция, спекуляры, «линзы» — system-rendered у Apple; web-подделка выглядит как кейс «хотели как у Apple». Web/iOS-стекло NUX = честный frosted: fill + blur + saturate + hairline + один light-catch. tvOS — отдать системе целиком (правило №8 HIFI_DIRECTION остаётся).
6. **Стекло не подкрашивать.** Ни amber-tint, ни цветных границ — цвет стеклу даёт контент через `saturate(1.8)`. Подкрашенное стекло = 2021.
7. **Грейн на стекло не наносить** (двойной шум с блюром = компрессия); грейн остаётся на плоских поверхностях и скримах по §7 HIFI_DIRECTION.
8. **Формулировка доктрины обновляется так:** было «NUX — это ink, не glass»; становится — **«система NUX — ink; хром, плавающий над контентом, — glass»**. Список glass-мест закрыт (§4.1); расширение списка — только через скрин-тест против ink-версии.

---

## 6. Источники

**refero.design:**
- Каталог: https://styles.refero.design/
- Dimension (glassmorphic command deck): https://styles.refero.design/style/fbcf9cbb-7c6b-449d-862a-bce521a8ab1d
- Authkit (blueprint on midnight glass): https://styles.refero.design/style/e80231a2-e4d6-406a-a2c9-2e6109679690

**Apple / Liquid Glass / streaming:**
- https://www.apple.com/newsroom/2025/06/apple-tv-brings-a-beautiful-redesign-and-enhanced-home-entertainment-experience/
- https://9to5mac.com/2025/07/16/apples-tv-app-gets-fresh-design-in-ios-26-and-tvos-26-heres-whats-new/
- https://appleinsider.com/articles/25/06/18/tvos-26-hands-on-sleek-liquid-glass-redesign-new-control-center-and-more
- https://www.macrumors.com/2025/09/15/apple-releases-tvos-26/
- https://www.macobserver.com/news/apple-updates-liquid-glass-design-gallery-with-new-third-party-app-examples/
- https://www.macrumors.com/2026/04/06/apple-liquid-glass-design-gallery-update/
- https://www.techtimes.com/articles/317975/20260608/apple-liquid-glass-ios-27-wwdc-2026-brings-refinements-developers-must-adopt-today.htm

**Критика / accessibility:**
- NN/g — Liquid Glass Is Cracked: https://www.nngroup.com/articles/liquid-glass/
- https://www.notebookcheck.net/iOS-26-reportedly-struggling-for-adoption-amid-Liquid-Glass-UI-backlash.1201110.0.html
- iOS 26.1 opacity control: https://www.findarticles.com/ios-26-1-gets-liquid-glass-opacity-control/

**Glass-2026 дискурс:**
- https://clay.global/blog/glassmorphism-ui
- https://invernessdesignstudio.com/glassmorphism-what-it-is-and-how-to-use-it-in-2026
- https://www.orizon.co/blog/glassmorphism-in-2026-how-to-use-frosted-glass-without-killing-ux
- https://medium.com/@developer_89726/dark-glassmorphism-the-aesthetic-that-will-define-ui-in-2026-93aa4153088f
- https://medium.com/design-bootcamp/ui-design-trend-2026-2-glassmorphism-and-liquid-design-make-a-comeback-50edb60ca81e
