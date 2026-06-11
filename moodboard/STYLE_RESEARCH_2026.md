# NUX — Style Research 2026

**Источники:** styles.refero.design (основной — сайт доступен, ~2000 AI-readable design systems, проверено 4 релевантных стиля), web-research по трендам 2025–2026, Apple Newsroom (tvOS 26 / Liquid Glass).
**Контекст:** оценка и развитие уже принятого направления из `HIFI_DIRECTION.md` (тёплая тёмная лестница `#070606→#25211C`, amber `#C8922A`, Fraunces + Inter, ≤10% amber на экран). Этот док **не отменяет** HIFI_DIRECTION — он его проверяет на «2026-современность» и добавляет недостающий слой.

---

## 1. Резюме

Принятое направление NUX (warm dark + amber ink + Fraunces) — **уже в ядре премиум-тренда 2026**: исследование refero подтверждает, что топовые «кинематографичные» системы (Sequel, monopo saigon) строятся ровно на этом — тёмный холст, серифный display, дисциплина цвета, изображение как единственный источник цвета. NUX даже выгодно отличается: у refero-эталонов палитра 100% ахроматичная и потому анонимная, а тёплый amber даёт NUX узнаваемость, которой нет у HBO Max. «Вау» в 2026 даст не смена палитры, а **три добавки**: (1) геометрия pill для интерактива + «light-catch» блик на карточках (фирменный приём Sequel), (2) один инвертированный «бумажный» editorial-момент на страницу, (3) **слой моушна** — shared-element морфинг постер→детальная страница через View Transitions API — это главный недостающий ингредиент «современности», и он дешёвый в React+Vite.

---

## 2. Стилевые направления (refero.design)

styles.refero.design отдаёт по каждому стилю полный DESIGN.md: палитра с ролями, type scale, компоненты, do/don't. Из каталога релевантны четыре; первые два — кандидаты, вторые два — доноры приёмов.

### 2.1 Sequel — «blackbox gallery, lit by cinema» ★ главный референс

[styles.refero.design/style/1bd3b2ba-…](https://styles.refero.design/style/1bd3b2ba-9ad9-44ed-9130-03f9d94de821) · источник sequel.co · родственники по их же списку: **A24, Apple Vision Pro, Linear, Khosla Ventures**

- **Суть:** страница как галерея, а не дашборд. Чёрный холст `#000→#202020→#333`, фотография «один тёплый источник света в тёмной сцене», serif display (Bradford, аналоги Tiempos/Canela) только от 58px, body — гротеск **weight 300** («anti-emphasis: текст шепчет»).
- **Фирменные приёмы:**
  - **Бинарная геометрия радиусов:** только 10px (карточки/изображения) и 9999px (кнопки/бейджи). Ничего между.
  - **Многослойная тень image-карточек:** тёмный drop `rgba(0,0,0,.35) 0 10px 30px` + **inset-блик сверху** `rgba(255,255,255,.08) 0 1px 0` — карточка «ловит свет кинозала».
  - Один тёплый off-white панель-инверт (`#f5f5f0` Linen) — максимум 1 на страницу.
  - Бейджи — pill на `rgba(255,255,255,.08)` с inset-бликом, caps +0.08em.
- **Почему подходит NUX:** это буквально «Criterion × A24» в виде токенов; подтверждает решения NUX (тёмный холст, serif display, хэйрлайны, сдержанность).
- **Вердикт по совместимости:** **высокая, брать как структурный эталон.** Конфликт один: Sequel принципиально ахроматичен («0% colorfulness is the brand») — для контент-платформы это путь HBO Max (анонимность, уже отвергнуто в HIFI_DIRECTION §2). NUX правильно оставляет amber. Забрать: inset light-catch, бинарные радиусы, weight-300 для крупного вторичного текста, Linen-инверт (в тёплой версии).

### 2.2 monopo saigon — «cinematic darkroom with floating white type»

[styles.refero.design/style/3e52dd36-…](https://styles.refero.design/style/3e52dd36-6ab1-48c6-bc40-47ef6d33abc2) · monopo.vn · родственники: Pentagram, Locomotive, Active Theory

- **Суть:** ритм «тёмный иммерсивный кадр ↔ редакционная полоса», цвет живёт только в изображениях, display-шрифт **weight 300 на 94–225px** («whisper-weight monumentality»), pill — единственная кривая (75px), всё остальное острое, секции через 80–120px воздуха.
- **Почему подходит NUX:** ритм «полноэкранный кадр → выдох» — это готовая хореография home-страницы и editorial long-read'ов NUX; контраст масштаба (hero ÷ metadata 6×+) совпадает с правилом §3 HIFI_DIRECTION.
- **Вердикт:** **частичная.** Чередование с чисто-белыми полосами — приём промо-сайта, в стриминговом приложении убьёт night-friendly просмотр. Забрать идею, не реализацию: «выдохом» в NUX служит не белая полоса, а тёплый paper-инверт (см. §3) и 96–120px паузы. Также забрать: **лёгкое начертание на гигантском кегле** — Fraunces wght 380–420 на 80px+ выглядит «2026», а не «2019 bold serif».

### 2.3 Vivid+Co — «darkroom editorial spread» (донор)

[styles.refero.design/style/8875b14e-…](https://styles.refero.design/style/8875b14e-c59a-492f-8780-8027a480f21c) — типографика как единственный субъект: никаких карточек, призрачные прямоугольные кнопки 1px, display 105–136px с line-height 1.0 «pressed against the canvas». Для стриминга с постерной сеткой неприменим целиком, но это правильный эталон для **страниц эссе/манифеста NUX**: текст прямо на холсте, без контейнеров, lh у display ≤1.1.

### 2.4 Dylanbrouwer — «monolithic chrome in cinematic fog» (донор)

[styles.refero.design/style/b1e82907-…](https://styles.refero.design/style/b1e82907-d1cf-46cd-8ae7-3561c5b15fd0) — хром-градиенты в display-тексте (НЕ брать: конфликт с правилом «amber — это ink, без металлика») и **mono-шрифт для системной меты** (IBM Plex Mono 12–14px: версии, таймстампы). Для NUX уместно точечно: TV-pairing код уже monospaced (HIFI_ELEMENTS §6); можно расширить на технические бейджи (4K · HDR) — но не на DotMetaRow (там остаётся Inter tabular). Это «инженерный» акцент 2026 — применять ≤1 места на экран или не применять вовсе.

**Общий вывод по refero:** все четыре премиум-тёмных стиля сходятся в одном наборе: тёмный холст + serif/характерный display + лёгкие начертания на большом кегле + pill-кнопки + хэйрлайны вместо теней + цвет только из контента. NUX-направление этому соответствует на ~85%. Расхождения NUX (тёплый undertone, amber-акцент) — **осознанные преимущества**, не отставание.

---

## 3. Цвет — amber и тёплая лестница в 2026

**Вердикт: лестница `#070606→#0D0C0B→#161412→#1F1C19→#25211C` остаётся. Amber `#C8922A` остаётся.** Аргументы:

- Тренд 2026 «dark-first» (тёмная тема проектируется первой, >80% мобильных юзеров в dark mode — [Midrocket](https://midrocket.com/en/guides/ui-design-trends-2026/)) — NUX уже dark-first by design.
- Refero-эталоны показывают: чем премиальнее, тем **ахроматичнее хром**. Бюджет amber ≤10% — правильный; на browse-экранах предлагаю целиться в **5–8%** (фактически: 1 CTA + прогресс + эйбраузы). Полный отказ от акцента = анонимность (уже доказано на HBO Max).
- Дисциплина «dark-on-amber» для CTA (7.1:1) — соответствует и WCAG, и анти-казино правилам; не трогать.

**Три уточнения на 2026:**

1. **Paper-инверт (новый токен `surface/inverse`).** Приём Sequel Linen, отеплённый под NUX: **`#F2EDE3`** (тот же undertone, что text/primary `#F2EFE9`, чуть глубже). Использование: обложка завершённой коллекции, цитата-разворот в эссе, годовой «NUX Rewind», paywall-карточка. Текст на нём `#0D0C0B` (≈15.6:1), amber на нём НЕ использовать как текст (контраст к светлому фону низкий) — только как 2–3px линейку/бар. **Максимум 1 инверт-модуль на страницу** — редкость и есть эффект.
2. **Light-catch на изображениях.** К существующему inset-хэйрлайну `rgba(255,255,255,0.07)` добавить верхний блик: `box-shadow: inset 0 1px 0 rgba(255,255,255,0.06), inset 0 0 0 1px rgba(255,255,255,0.07)`. Микроскопическая стоимость, заметный «кино-свет» (Sequel-приём).
3. **Ambient tint от постера (осторожно).** Тренд 2026 для медиа-плееров: «интерфейс адаптирует цвета под играющий контент» ([Inverness](https://invernessdesignstudio.com/glassmorphism-what-it-is-and-how-to-use-it-in-2026), [Clay](https://clay.global/blog/glassmorphism-ui)). Для NUX — только на **detail-странице и в плеере**: за hero добавляется радиальный градиент доминантного цвета постера на **4–6% alpha поверх `#0D0C0B`** (скрим всё равно в page-color). Не на browse — там это превратит сетку в дискотеку. Это даёт «живой» отклик системы без потери бренда.

**Чего не делать в 2026:** металлик/хром на amber (Dylanbrouwer-градиенты — мимо бренда), неоновые акценты, mesh-градиенты, pure black вне плеера, цветные бордеры.

---

## 4. Типографика

**Display — Fraunces: оставить. Подтверждено внешними данными.**

- [Creative Boom Top 50 fonts 2026](https://www.creativeboom.com/resources/top-50-fonts-in-2026/) и [Made Good Designs](https://madegooddesigns.com/trending-fonts/): Fraunces ценится как «free serif that does not look like a free serif» — квирки и variable-оси дают характер без лицензии.
- Тренд года — «high-contrast editorial serifs» + «display serif maximalism» ([Fontfabric Top 10 2026](https://www.fontfabric.com/blog/top-typography-trends-for-2026/), [Zeenesia](https://zeenesia.com/2026/03/06/font-trends-2026-typography-styles-that-will-shape-modern-design/)) — Fraunces на `opsz 144` ровно это.
- **Важный анти-сигнал:** Instrument Serif (из списка альтернатив в HIFI_DIRECTION §3) к 2026 стал настолько вездесущим, что «designers complain it's starting to look lazy» ([Creative Bloq](https://www.creativebloq.com/design/fonts-typography/serif-fonts-are-back-in-fashion-and-i-couldnt-be-happier)). **Вычеркнуть из альтернатив.**

| Кандидат | Статус 2026 | Вердикт для NUX |
|---|---|---|
| **Fraunces** (Google, variable) | Уважаем, не заезжен, оси opsz/SOFT/WONK | **Оставить.** `opsz 144, SOFT 0, WONK 0`; новое: на кеглях 64px+ пробовать **wght 380–440** (whisper-weight тренд из monopo/Sequel) вместо 560–600 |
| Editorial New (Pangram Pangram, free tier) | «Самый популярный free display serif» — на пике, риск сходства с каждым вторым портфолио | Запасной, не основной |
| GT Alpina (Grilli Type, платный) | Топ списка Creative Boom 2026, «workhorse serif with expressive details» | **Платный апгрейд**, если у NUX появится бюджет на лицензию — ближайший по духу к Criterion |
| Tiempos (Klim, платный) | «Leading editorial serif» 2026 | Тише Fraunces; вариант если Fraunces покажется слишком характерным на скрин-тесте |

**UI — Inter: оставить.** Тренд 2026 — neo-grotesque вместо geometric ([Made Good Designs](https://madegooddesigns.com/popular-fonts/)), что задним числом подтверждает решение убрать Plus Jakarta Sans. Inter — «#1 UI typeface of 2026» ([Made Good Designs / Inter](https://madegooddesigns.com/inter-font/)); Geist — отличный шрифт, но с прочной ассоциацией «developer brand / Vercel» — для кино-платформы это чужой голос. Один апгрейд: для заголовков функциональных экранов 20–32px использовать **Inter Display** (та же семья, оптика для крупных кеглей) вместо обычного Inter SemiBold.

**Пара и масштаб:** Fraunces (контент/темы) + Inter/Inter Display (функции) + Newsreader (тело эссе) — без изменений к HIFI_DIRECTION §3. Контраст масштаба 6×+ держать; добавить «editorial numerals» (01–07 на шельфах) во Fraunces **Light italic** — связка с whisper-weight трендом.

---

## 5. Анимации / моушн (слой «вау» — на будущий React+Vite билд)

Контекст трендов: View Transitions API и CSS scroll-driven animations стали стабильными в Chrome/Edge в 2025 — «Apple-style scroll storytelling за 30 строк CSS» ([Web Peak](https://webpeak.org/blog/css-js-animation-trends/)); генеральная линия 2026 — «minimalist, purposeful animation», без флэша ([Loma](https://lomatechnology.com/blog/motion-ui-trends-2026/2911), [Figma](https://www.figma.com/resource-library/web-design-trends/)). Всё ниже — CSS-first, без тяжёлых библиотек; глобально оборачивается в `prefers-reduced-motion`.

1. **Постер → detail: shared-element морфинг (фирменный жест NUX).** `view-transition-name` на каждом постере; клик — постер физически «вырастает» в hero детальной страницы, остальное кроссфейдится 300ms. Реализация: `document.startViewTransition()` + React Router; Chrome/Edge/Safari поддерживают same-document VT, fallback — обычный fade. Это самый дешёвый «дорогой» эффект 2026.
2. **Hero-хореография.** Key art: медленный scale 1.0→1.04 за 10–12s (ease linear, «дыхание», не Ken Burns-аттракцион); title-lockup — staggered fade+rise 12px, 500–600ms, задержка 80ms между eyebrow → заголовок → мета → CTA; трейлер — crossfade 400ms после 3s dwell (правило из HIFI_DIRECTION §4 остаётся).
3. **Card hover/focus.** Web: уже специфицировано (scale 1.02, hairline brighten); добавить reveal меты — title/meta под карточкой подсвечивается `text/secondary→primary` 150ms. tvOS: только системный фокус (scale 1.08 + parallax + sheen, HIFI_ELEMENTS §1) — не переизобретать, Liquid Glass рендерит система ([Apple Newsroom](https://www.apple.com/newsroom/2025/06/apple-tv-brings-a-beautiful-redesign-and-enhanced-home-entertainment-experience/)).
4. **Scroll-хореография (editorial-страницы только).** CSS `animation-timeline: view()`: номерные Fraunces-нумералы едут с лёгким параллаксом (translateY ±24px), изображения в эссе появляются opacity 0→1 + translateY 16px при входе во вьюпорт, у long-read — тонкий amber progress-бар по scroll-timeline. Браузеры без поддержки получают статичную страницу — прогрессивное улучшение, нулевой риск. На browse-сетках скролл-эффектов **нет** — там скорость важнее кино.
5. **Микро-интеракции.** Чип-выбор: spring 1.0→1.05→1.0 (уже есть); save/My List: иконка spring scale + краткий amber flash 200ms (без партиклов); прогресс-бары анимируют заполнение 400ms ease-out при маунте; кнопки: pressed scale 0.96. Toast — slide+fade 250ms.
6. **Loading.** Skeleton в тёплых тонах (`#161412→#25211C` shimmer 1.2s) → кроссфейд в контент 200ms; постеры — blur-up (LQIP 16px-превью → чёткое изображение 300ms). Грейн-оверлей на скелетонах маскирует «пустоту» лучше спиннера.
7. **Kinetic typography — дозированно.** Letter-stagger заголовка только в onboarding и годовых/маркетинговых моментах, никогда в browse. Тренд жив, но в продукте 2026 читается как шум, если применять везде.

React+Vite: всё выше — CSS + ~50 строк JS для View Transitions. Если позже захочется больше — Motion (ex-framer-motion) для spring-микро-интеракций, GSAP только для editorial long-read'ов. Не закладывать Lottie/3D в первую версию.

---

## 6. Элементы — дельты к HIFI_DIRECTION/HIFI_ELEMENTS под выбранное направление

Направление называю **«Cinema Ink»**: структура Sequel (blackbox gallery) + тёплая палитра и amber-чернила NUX.

- **Радиусы — ввести бинарную дисциплину (Sequel):** изображения/карточки **10px** (вместо разнобоя 6/12; tvOS остаётся 12), модалки/шторки 16px, **все кнопки и чипы — pill 9999px**, поля ввода 10px. Pill-кнопки — самый заметный «2026-маркер» из всех дешёвых; текущие прямоугольные 10px-кнопки читаются как 2022.
- **Карточки:** inset-хэйрлайн + light-catch (см. §3.2); hover-тень `0 12px 40px rgba(0,0,0,0.55)` остаётся; меты под карточкой — Inter, reveal на hover.
- **Кнопки:** Primary — amber pill, текст `#0D0C0B`, padding 14×24; Secondary — ghost pill, 1px `border/default`, белый текст; на инверт-панели — тёмная pill. Без теней (тень только у плавающих кнопок, Sequel-правило).
- **Чипы/бейджи:** pill; surface-бейджи на изображениях — `rgba(13,12,11,0.72)` + blur 8px + inset-блик `rgba(255,255,255,.08)` сверху (Sequel badge anatomy) — заменяет плоский вариант из §5 HIFI_DIRECTION.
- **Плеер:** хром — самое «стеклянное» место NUX (тренд: glass на оверлеях, не на контенте — [Orizon](https://www.orizon.co/blog/glassmorphism-in-2026-how-to-use-frosted-glass-without-killing-ux)): транспорт-бар на `rgba(13,12,11,0.6)` + `backdrop-filter: blur(24px) saturate(1.6)`, amber-скраббер по спеку HIFI_ELEMENTS §2–3. На tvOS — системный плеер, стекло отдаёт ОС.
- **Навигация:** blur-материал уже специфицирован (§7 HIFI_DIRECTION) — это и есть правильная доза glass 2026; не расширять стекло на карточки/панели.
- **Editorial-модули:** нумералы Fraunces Light 96–120px на 12–15% white; paper-инверт модуль (§3.1); эссе — текст на холсте без карточек (Vivid+Co-урок), 68ch.
- **Hero detail-страницы:** ambient tint 4–6% от постера + морфинг-вход (§5.1) — связка, которая делает detail-страницу «вау»-моментом продукта.

Итого изменений к существующим докам немного: pill-геометрия, light-catch, paper-инверт, ambient tint, моушн-слой. Всё остальное в HIFI_DIRECTION подтверждено исследованием.

---

## 7. Источники

**refero (основной):**
- https://styles.refero.design/ — каталог
- Sequel: https://styles.refero.design/style/1bd3b2ba-9ad9-44ed-9130-03f9d94de821
- monopo saigon: https://styles.refero.design/style/3e52dd36-6ab1-48c6-bc40-47ef6d33abc2
- Vivid+Co: https://styles.refero.design/style/8875b14e-c59a-492f-8780-8027a480f21c
- Dylanbrouwer: https://styles.refero.design/style/b1e82907-d1cf-46cd-8ae7-3561c5b15fd0

**Типографика 2026:**
- https://www.creativeboom.com/resources/top-50-fonts-in-2026/
- https://www.fontfabric.com/blog/top-typography-trends-for-2026/
- https://madegooddesigns.com/trending-fonts/ · https://madegooddesigns.com/popular-fonts/ · https://madegooddesigns.com/inter-font/
- https://www.creativebloq.com/design/fonts-typography/serif-fonts-are-back-in-fashion-and-i-couldnt-be-happier (Instrument Serif — анти-сигнал)
- https://zeenesia.com/2026/03/06/font-trends-2026-typography-styles-that-will-shape-modern-design/

**UI/glass/dark 2026:**
- https://midrocket.com/en/guides/ui-design-trends-2026/
- https://invernessdesignstudio.com/glassmorphism-what-it-is-and-how-to-use-it-in-2026
- https://clay.global/blog/glassmorphism-ui
- https://www.orizon.co/blog/glassmorphism-in-2026-how-to-use-frosted-glass-without-killing-ux

**Моушн:**
- https://webpeak.org/blog/css-js-animation-trends/ (View Transitions + scroll-driven в стабильных браузерах)
- https://lomatechnology.com/blog/motion-ui-trends-2026/2911
- https://www.figma.com/resource-library/web-design-trends/
- https://acodez.in/micro-interactions-motion-design/

**Apple / tvOS 26:**
- https://www.apple.com/newsroom/2025/06/apple-tv-brings-a-beautiful-redesign-and-enhanced-home-entertainment-experience/
- https://www.apple.com/newsroom/2025/06/apple-introduces-a-delightful-and-elegant-new-software-design/
- https://www.macrumors.com/2025/09/15/apple-releases-tvos-26/
