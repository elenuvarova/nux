# NUX — UX Best Practices & Research

Собранные данные из UX-исследований, статей NN/G, Accedo, Eleken, LogRocket и других источников.
Каждый раздел заканчивается прямым выводом для NUX.

---

## 1. СТРИМИНГ: ОБНАРУЖЕНИЕ КОНТЕНТА

### Парадокс выбора — главная проблема стриминга
Netflix, HBO, Disney+ страдают от "контентной перегрузки" (content abundance anxiety).
Исследование Accedo: пользователи тратят в среднем **18 минут** на выбор контента прежде чем что-то включить. Если ничего не нашли за 15–20 мин — уходят.

**Алгоритм vs. Курация:**
- Netflix: 80% просмотров идёт через рекомендации алгоритма, не поиск
- MUBI: намеренно ограниченный каталог (~30 фильмов единовременно) — антитезис Netflix
- MUBI реплицирует "рекомендацию от умного друга", персонализируя через editorial notes ("Our Take")

**Что работает на практике:**
- Персональные рекомендации повышают engagement до +50%
- Netflix заменил 5-звёздочный рейтинг на 👍/👎 — простота увеличила участие в разы
- Персонализированные обложки (разные пользователи видят разный арт одного фильма) поднимают CTR на 20–30%
- 70% пользователей используют watchlist для планирования просмотров

**Вывод для NUX:**
Не делать "Netflix с маленьким каталогом". Делать как MUBI — *editorial curation* является фичей, а не ограничением.
Каждый фильм получает "NUX Take" — короткую редакционную заметку (2–3 предложения от команды).
Простой двоичный фидбек (нравится/не нравится) лучше звёзд для начального этапа.

---

## 2. НАВИГАЦИЯ СТРИМИНГОВОГО САЙТА

### Структура
4 основных раздела: **Home / Browse / My List / Search**
На мобайле — bottom tab bar (не hamburger), thumb-zone оптимизация.

### Hover-expand карточки
Netflix показывает трейлер + мета-данные при наведении через ~1.5–2 секунды задержки.
Задержка критична — без неё карточки открываются при случайном движении мыши.

**Рекомендуемый timing:**
```
hover-delay: 300–500ms (чтобы не срабатывало при пролистывании)
video-autoplay-delay: 1500ms после hover
mute: всегда по умолчанию (закон большинства стримингов)
```

**Вывод для NUX:**
```css
/* card hover sequence */
.card:hover .card-overlay { opacity: 1; transition-delay: 300ms; }
.card:hover .card-video { opacity: 1; transition-delay: 1500ms; }
```
Трейлер всегда заглушён, кнопка звука опциональна в оверлее.

---

## 3. ВИДЕОПЛЕЕР

### Обязательные контролы (по приоритету)
1. Play/Pause
2. Seek slider (с превью кадра при scrubbing)
3. Volume + Mute
4. Субтитры/Аудио
5. Fullscreen
6. Скорость воспроизведения (0.75x / 1x / 1.25x / 1.5x / 2x)
7. Перемотка ±10 сек (особенно важно для mobile)

### Авто-скрытие контролов
- Скрывать через **3 секунды** бездействия во время воспроизведения
- Немедленно показывать при движении мыши / тапе
- Всегда показывать при паузе

### Буферизация
- Каждая лишняя секунда буферизации снижает удовлетворённость на **16%** (Mux research)
- Показывать skeleton/blur вместо чёрного экрана при загрузке
- Сохранять позицию просмотра — resume with 5-sec overlap ("продолжить с...")

### Субтитры и аудио (паттерн)
Disney+/Netflix: два столбца (Audio | Subtitles), overlay поверх видео, checkmark на активном.
Лучшая практика: открывать через иконку CC на панели управления, закрывать Esc или клик вне панели.

**Вывод для NUX:**
Кастомный плеер поверх `<video>`, не нативный.
Использовать `HLS.js` или `Shaka Player` для adaptive streaming.
Resume: хранить `{ contentId, position, timestamp }` в localStorage + sync с сервером.

---

## 4. МОДАЛЬНЫЕ ОКНА

### Когда использовать модал
Только для задач, требующих полного внимания пользователя:
- Подтверждение необратимого действия
- Форма быстрого ввода (не больше 2–3 полей)
- Просмотр медиа (трейлер, превью)
- Upsell (paywall)

**Не использовать модал для:**
- Длинного контента (более 3 скроллов)
- Вложенных модалов (nested modals — запрещено)
- Авто-открытия без триггера пользователя
- Критических предупреждений (лучше inline)

### Анатомия модала
```
Overlay: rgba(0,0,0,0.7), backdrop-filter: blur(4px)
Dialog: max-width 480–560px, border-radius 12px
Заголовок: max 1 строка
Тело: max 2–3 предложения
Кнопки: max 2 (primary + secondary/cancel)
Закрытие: Esc + клик по overlay + кнопка ✕
Focus trap: Tab должен ходить только внутри модала
```

### ARIA для модала
```html
<div role="dialog" aria-modal="true" aria-labelledby="modal-title">
  <h2 id="modal-title">Заголовок</h2>
  ...
</div>
```
При открытии: фокус переводить на заголовок или первую интерактивную кнопку.
При закрытии: фокус возвращать на элемент, открывший модал.

### Деструктивные диалоги
- Нейтральная кнопка (Cancel) слева, деструктивная (Delete) справа
- Деструктивная кнопка — красный или явно отличающийся цвет
- Текст диалога: одно предложение, объясняющее последствие
- НЕ использовать "Да/Нет" — использовать конкретные глаголы: "Delete account" / "Keep account"

**Вывод для NUX:**
Для "Remove from watchlist", "Cancel subscription" — маленький centered dialog (не fullscreen).
Для просмотра трейлера — большой modal с видео, max-width 800px.

---

## 5. DROPDOWNS И КОНТЕКСТНЫЕ МЕНЮ

### Когда dropdown vs. radio buttons
- До 5 вариантов → radio buttons или chip group (видно все сразу)
- 5–15 вариантов → dropdown/select
- 15+ вариантов → searchable dropdown

### Keyboard interaction (обязательно)
```
Enter/Space → открыть
Arrow Up/Down → навигация по опциям
Enter → выбрать
Esc → закрыть без выбора
Tab → переход к следующему элементу (закрывает dropdown)
Первая буква → jump to option
```

### Контекстное меню карточки (···)
Максимум 5–7 пунктов. Группировать по смыслу с разделителем.
Типичная структура для NUX:
```
▶ Watch now
+ Add to Watchlist
— Remove from Watchlist
────────────────
✓ Mark as watched
✕ Not interested
────────────────
⤴ Share
```

### Позиционирование
Открывать в сторону свободного пространства (не обрезать viewport).
Минимум 8px отступ от края экрана.

**Вывод для NUX:**
Использовать `@floating-ui/react` — автоматически выбирает сторону открытия.
`role="menu"` + `role="menuitem"` на элементах.

---

## 6. EMPTY STATES

### Три уровня пустых состояний
1. **First-use empty** — пользователь ещё ничего не сделал ("Your watchlist is empty")
2. **User-cleared empty** — пользователь удалил всё контент намеренно
3. **No-results empty** — поиск/фильтр ничего не нашёл

### Формула
```
[Иконка/иллюстрация] + [Заголовок 1 строка] + [Подзаголовок 1–2 строки] + [CTA кнопка]
```

### Тон сообщений
- Избегать технического языка ("No data found") — писать по-человечески
- Для поиска: "We couldn't find anything for '[запрос]'" — повторить запрос пользователя
- Для watchlist: "Nothing saved yet — start exploring" + кнопка Browse
- Не быть смешным если контекст может быть фрустрирующим (ошибка, потеря данных)

### Иллюстрации
- Простые, не отвлекают от CTA
- Соответствуют общему визуальному языку (не stock clipart)
- Один смысловой образ, не набор иконок

**Вывод для NUX:**
Watchlist empty: тёмная иконка кино-хлопушки (монолинейная) + "Your list is empty" + "Browse films"
Search 0 results: лупа + "Nothing found for '[query]'" + "Clear filters" или "Browse all"

---

## 7. TOAST-УВЕДОМЛЕНИЯ

### Позиция
- **Top-right** — де-факто стандарт для web apps (не перекрывает основной контент)
- **Bottom-center** — лучше для мобайла (thumb zone)
- НЕ bottom-left — не читается, маска на nav

### Тайминг
```
Успех (без действия):  3 секунды
Информация:           4 секунды
Ошибка:               не авто-скрывать (пользователь должен прочитать)
Правило: 1 секунда на каждые 3 слова + 3 секунды базы
```

### Типы и цвета
| Тип | Цвет | Когда |
|-----|------|-------|
| Success | Зелёный или акцентный | Действие выполнено |
| Info | Нейтральный/серый | Системная информация |
| Warning | Жёлтый/оранжевый | Возможная проблема |
| Error | Красный | Действие не выполнено |

### Accessibility (WCAG 2.2)
- `role="status"` для success/info (polite announcement)
- `role="alert"` для error/warning (assertive announcement)
- Кнопка ✕ для ручного закрытия
- `prefers-reduced-motion` — отключать анимацию появления
- Контраст текста: минимум 4.5:1

**Вывод для NUX:**
```jsx
// Toast для NUX
<div role="status" aria-live="polite" className="toast toast--success">
  ✓ Added to watchlist
  <button aria-label="Dismiss">✕</button>
</div>
```
Позиция: top-right на desktop, bottom-center на mobile.
Анимация: slide-in 200ms ease-out, fade-out 150ms.

---

## 8. SKELETON LOADERS

### Skeleton vs. Spinner: когда что
| Ситуация | Что использовать |
|---------|-----------------|
| Загрузка страницы/раздела | Skeleton |
| Загрузка карточек/сетки | Skeleton |
| Submit формы (<2 сек) | Spinner на кнопке |
| Оплата/авторизация | Spinner + текст |
| Операция >5 сек | Skeleton + progress bar |

### Психология восприятия
- Skeleton воспринимается вдвое быстрее спиннера при одинаковом реальном времени (NN/G)
- Shimmer (gradient слева→вправо) воспринимается быстрее пульсирующего fade
- Форма скелетона должна максимально совпадать с реальным контентом

### Реализация шиммера
```css
@keyframes shimmer {
  0%   { background-position: -200% 0; }
  100% { background-position: 200% 0; }
}
.skeleton {
  background: linear-gradient(
    90deg,
    rgba(255,255,255,0.05) 25%,
    rgba(255,255,255,0.12) 50%,
    rgba(255,255,255,0.05) 75%
  );
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}
```

**Вывод для NUX:**
Скелетон-карточки при загрузке home page rows.
Aspect ratio 16:9 (как реальные карточки), такой же border-radius.
Анимация shimmer, не pulse.
`prefers-reduced-motion`: убирать shimmer, оставлять статичный серый блок.

---

## 9. ПРОФИЛЬ / ПЕРЕКЛЮЧАТЕЛЬ АККАУНТОВ

### Паттерн "Who's watching?"
Все крупные стриминги используют отдельный экран (не модал, не dropdown) для выбора профиля.
Причина: это первое действие после входа — заслуживает полного экрана.

### Дизайн аватаров
- Netflix: яркие квадратные тайлы с персонажами — радость, не утилитарность
- HBO Max: круглые с инициалами + цветное кольцо — минимализм
- Disney+: круглые с IP-персонажами + lock icon для пин-профиля

**Вывод для NUX:**
V1: один профиль (упростить онбординг).
V2: до 3 профилей. Минималистичный подход — круглые аватары, монограмма по умолчанию, опция загрузки фото.

---

## 10. WATCHLIST / ОЧЕРЕДЬ ПРОСМОТРА

### UX-исследования по watchlist
- 70% пользователей используют watchlist для планирования
- Главная боль: watchlist растёт и становится "второй главной страницей" где сложно выбрать
- Решение Netflix: "Continue Watching" отдельно от "My List" (принципиально разные намерения)

### Типы списков
| Тип | Намерение |
|-----|-----------|
| Watchlist / My List | Хочу посмотреть |
| Continue Watching | Начал, не закончил |
| Watched | Посмотрел (история) |
| Liked | Понравилось |

### Порядок в watchlist
По умолчанию — по дате добавления (новые сверху), пользователь может переключить на другой порядок.

**Вывод для NUX:**
Разделить "My List" и "Continue Watching" с самого начала.
Continue Watching — максимум 10 тайтлов, иначе теряет смысл.
"Finished" пункты авто-убираются из Continue Watching.

---

## 11. MUBI-СПЕЦИФИКА (референс для NUX editorial стиля)

### Что делает MUBI особенным с UX-точки зрения
1. **"Our Take"** — редакционная заметка к каждому фильму от команды MUBI (100–200 слов)
2. **Finite catalog** — ограниченное число фильмов снимает "paradox of choice"
3. **Expiring films** — фильм доступен ограниченное время → создаёт FOMO и ощущение события
4. **Director/Country browsing** — как в хорошем книжном, не по жанру-мейнстриму
5. **"Film of the Day"** — один рекомендованный фильм в день (editorial, не алгоритм)

### Академическое исследование (ResearchGate, 2018)
MUBI использует curation как *экономический актив* — редакция = бренд.
Ключевой дифференциатор от Netflix: вместо "больше контента" → "правильный контент".
Пользователи MUBI: люди, устали от алгоритмической ленты и хотят "discover, not consume".

**Вывод для NUX:**
Принять editorial-модель MUBI, не алгоритмическую модель Netflix.
"NUX Editorial Team" as a character — человеческий голос кураторства.
Каждый тайтл: 1 редакционная заметка + 3–5 тегов от команды (не auto-generated).

---

## 12. ТЁМНЫЕ ПАТТЕРНЫ — ЧТО НЕ ДЕЛАТЬ

### Академическое исследование ACM DIS 2022
Исследование "Are You Still Watching?" (Chaudhary et al., ACM 2022) — дневниковое исследование 22 пользователей, 228 сессий на YouTube, Netflix, Amazon, Disney+.

**Ключевые данные:**
| Тёмный паттерн | Эффект |
|---------------|--------|
| Autoplay следующего эпизода | +24.8% "бессознательного просмотра" к концу сессии |
| Рекомендации без конца | +34% пользовательского сожаления ("зачем я это смотрел") |
| Бесконечный скролл | Пользователи теряют понимание сколько времени провели на платформе |
| Скрытая кнопка выхода | Увеличивает время на платформе, но снижает доверие |

### Список тёмных паттернов стриминга
1. **Autoplay-таймер без явной кнопки отмены** — пользователь не успевает решить
2. **Превью с авто-звуком** — NN/G: пользователи ненавидят неожиданный звук
3. **Скрытая отмена подписки** — многошаговый процесс отмены (MUBI жалуется пользователи)
4. **"Продолжить просмотр" на весь экран** — давление продолжать, а не открывать новое
5. **Бесконечный скролл без маркеров** — нет ощущения "где я нахожусь в каталоге"
6. **Авто-воспроизведение трейлера при наведении без задержки** — случайные срабатывания

### NN/G про autoplay
> "Autoplay video prevents the user from controlling the presentation of content. Don't use autoplay audio or video."
> — Nielsen Norman Group, Video Usability Research

### Вывод для NUX
NUX — анти-Netflix по замыслу. Намеренно избегаем тёмных паттернов:
- Нет autoplay следующего тайтла без явного "Play next" действия
- Трейлер при hover только через 1.5 сек задержки, всегда без звука
- Отмена подписки — одна страница, один клик
- Нет infinite scroll — показываем пагинацию или явную кнопку "Load more"
- Нет агрессивных pop-up upsell во время просмотра

---

## 13. NN/G: РЕКОМЕНДАТЕЛЬНЫЙ КОНТЕНТ

Источник: [UX Guidelines for Recommended Content](https://www.nngroup.com/articles/recommendation-guidelines/) + [Individualized Recommendations](https://www.nngroup.com/articles/recommendation-expectations/)

### Ключевые правила NN/G
1. **Чем выше на странице — тем лучше.** Рекомендации в верхней части homepage видны и используются значительно чаще
2. **Раздельные полки лучше одной большой.** "Continued Watching", "Because you liked X", "New this week" — раздельные, а не одна "Recommendations"
3. **Объяснять WHY.** "Because you watched Bergman" → пользователи больше доверяют и кликают
4. **Прозрачность данных.** Указывать на каких данных построена рекомендация
5. **Давать контроль.** Кнопка "Not interested" / "Don't recommend this" повышает доверие к системе
6. **Не все пользователи дают фидбек.** Большинство просто кликают или нет — только активные пользователи улучшают модель

### Типы рекомендательных полок для NUX
```
"Continue watching"          → resume (позиция + прогресс)
"Because you watched [X]"   → item-based filtering
"New from directors you like"→ director-based
"NUX Picks this week"       → editorial curation (ручная)
"Trending in [genre]"        → popularity signal
"You might have missed"      → anti-recency bias
```

**Вывод для NUX:**
Editorial полка "NUX Picks" должна быть выше алгоритмических.
Каждая полка — 6–8 тайтлов (не 20+). Ясный заголовок объясняет критерий.

---

## 14. NETFLIX UX — ЧТО СЛОМАЛИ В 2025 (АНТИПАТТЕРНЫ)

Источник: Rolling Stone, What's on Netflix, Tapptic — 2025 backlash

### Конкретные жалобы пользователей
- **Карточки стали огромными**: было 7 постеров в ряду → стало 3–4. Пользователи видят меньше на большом экране, чем на телефоне
- **Автопревью занимает весь экран** при выборе тайтла, нельзя быстро прочитать описание
- **Убрали "New & Popular" таб** → нет быстрого способа посмотреть Top-10 и новинки
- **Слишком много скролла**: то, что раньше было в 3 движениях, теперь требует 10+
- **Нельзя быстро проверить свою оценку** тайтла

### Пользователи создали Change.org-петицию → беспрецедентно для стримингового сервиса

**Вывод для NUX:**
Информационная плотность важна. Маленькие карточки позволяют видеть больше.
Не жертвовать навигабельностью ради "кинематографичности".
6-col сетка на desktop (16:9 карточки) позволяет одновременно видеть 12+ тайтлов.

---

## 15. MUBI — РЕАЛЬНЫЕ ОТЗЫВЫ ПОЛЬЗОВАТЕЛЕЙ (Trustpilot)

### Что хвалят
- Качество кураторства — "лучший выбор фильмов в принципе"
- Editorial notes "Our Take" — уникальная ценность
- Чистый, минималистичный дизайн на web
- Ощущение "рекомендации от умного друга"

### Главные боли
1. **TV-приложение** — "clunky", нет базовой функции поиска
2. **Субтитры** — настройки не сохраняются между сессиями, особенно на Smart TV
3. **Offline скачивание** — часто падает на 80%+
4. **Отмена подписки** — неясно, подтверждена ли отмена
5. **Медленное приложение** при навигации между страницами
6. **Приоритет эстетики над читаемостью** — мелкий шрифт, слабый контраст в некоторых разделах

**Вывод для NUX:**
MUBI — отличный референс по *кураторской философии*, но не по *технической реализации*.
NUX должен решить именно те боли, которые MUBI не решает:
- Субтитры сохраняются в профиле
- Поиск — всегда доступен, не спрятан
- Отмена подписки — один шаг, немедленное подтверждение на экране

---

## 16. HBO MAX UX — ЧТО РАБОТАЕТ И ЧТО НЕТ

Источник: Built for Mars, Baymard, Medium case studies

### Проблемы HBO Max
- **Style over function** — визуально красиво, но трудно найти нужное
- **Плохие рекомендации** — нет персонализации уровня Netflix
- **Информация о контенте скудная** — Cast & Crew без фото, нельзя кликнуть на актёра
- **Мелкие элементы управления** в top navigation
- **Родительский контроль** — нужно выходить и входить в детский аккаунт

### Что делает хорошо
- Дизайн аудио/субтитрового панели (overlay поверх видео — лаконично)
- "Who Is Watching?" — с цветными кольцами, Add Adult/Kid разделены

**Вывод для NUX:**
Богатые метаданные — конкурентное преимущество. Не просто постер и описание, а:
Director → filmography link, Cast → все фильмы этого актёра на платформе, Year → другие фильмы года.

---

## 17. РОССИЙСКИЙ РЫНОК СТРИМИНГА

### Рыночная карта 2025
| Платформа | Аудитория (2025) | Доля | Особенность |
|-----------|-----------------|------|-------------|
| Кинопоиск | 14.1 млн (+21%) | 32.7% | Часть Яндекса, лучшая интеграция с рейтингами |
| Иви (ivi) | 10 млн (+18%) | ~20% | Самый удобный поиск, широкий каталог |
| Okko | 9.6 млн (+34%) | 15.1% | Лучший детский раздел, удобный UX |
| KION (МТС) | — | — | Хорошая эстетика, но проблемы с производительностью |
| Premier | — | — | ТНТ/НТВПЛЮС контент |
| Start | — | — | 26 оригинальных проектов в 2025, быстрый рост |

### Что ценят российские пользователи (исследование)
1. Качество изображения/звука — **54%**
2. Доступная цена подписки — **50%**
3. Минимум рекламы — **48%**
4. Удобный интерфейс — важен, но не в топ-3 (берут за контент)

### UX проблемы российских платформ (из отзывов)
**Кинопоиск:**
- Лучший по контенту, но интерфейс перегружен рейтинговой информацией
- Авторизация через Яндекс — барьер для некоторых пользователей

**Okko:**
- Поиск слабее чем у ivi
- Проблемы с автоматической попыткой списания после отмены подписки
- Тёмная тема у некоторых вызывает дискомфорт

**ivi:**
- Лучший поиск из российских
- Cluttered интерфейс с рекламой на бесплатном тарифе
- Нет чёткого разделения платного и бесплатного контента

### Рынок в целом
- OTT рынок России: $2.3 млрд в 2024 → $4.5 млрд к 2033 (рост 7.1% ежегодно)
- После ухода Netflix (2022): пользователи активно перешли на отечественные сервисы
- Тренд: рост потребления локального контента, оригинальные проекты становятся ключевым дифференциатором

### Позиционирование NUX в контексте RU рынка
Ни один из российских сервисов не занял нишу "кинофильная платформа с редакционной курацией" (MUBI-ниша пустует после его ухода).
Аудитория киноманов в России — недообслуженный сегмент.

---

## Источники

- [Streaming App UX Best Practices — Fora Soft](https://www.forasoft.com/blog/article/streaming-app-ux-best-practices)
- [Streaming Service UX Best Practices — Accedo](https://www.accedo.tv/insights-and-news/streaming-service-ott-ux-best-practices)
- [Netflix UX/UI Case Study — Net Solutions](https://www.netsolutions.com/insights/video-streaming-apps-ux-design/)
- [Beyond Netflix and Amazon: MUBI and the curation of on-demand film — ResearchGate](https://www.researchgate.net/publication/329645156_Beyond_Netflix_and_Amazon_MUBI_and_the_curation_of_on-demand_film)
- [MUBI UX Case Study — Pete Keenlyside / Medium](https://pete-keenlyside.medium.com/i-gave-myself-an-hour-to-redesign-mubi-ux-case-study-8c63088bbd6b)
- [Streaming movie UX/UI reviews: Criterion, MUBI, Kanopy — The Content Technologist](https://www.content-technologist.com/streaming-ux-ui-criterion-mubi-kanopy/)
- [Modal UX Design — LogRocket Blog](https://blog.logrocket.com/ux-design/modal-ux-design-patterns-examples-best-practices/)
- [Mastering Modal UX — Eleken](https://www.eleken.co/blog-posts/modal-ux)
- [When to Use Modal vs Non-Modal Dialog — a11y-collective](https://www.a11y-collective.com/blog/modal-vs-dialog/)
- [Skeleton Screens 101 — Nielsen Norman Group](https://www.nngroup.com/articles/skeleton-screens/)
- [Skeleton Screens vs. Loading Spinners — Onething Design](https://www.onething.design/post/skeleton-screens-vs-loading-spinners)
- [Drop-Down Menus Design Guidelines — NN/G](https://www.nngroup.com/articles/drop-down-menus/)
- [Dropdown Menu UI Best Practices — Eleken](https://www.eleken.co/blog-posts/dropdown-menu-ui)
- [Empty State UX Design — Toptal](https://www.toptal.com/designers/ux/empty-state-ux-design)
- [Empty States in UX done right — LogRocket](https://blog.logrocket.com/ux-design/empty-states-ux-examples/)
- [Toast Notifications UX — LogRocket](https://blog.logrocket.com/ux-design/toast-notifications/)
- [Designing Toast Messages for Accessibility — Sheri Byrne-Haber](https://sheribyrnehaber.medium.com/designing-toast-messages-for-accessibility-fb610ac364be)
- [Video Player UX Best Practices — Vidzflow](https://www.vidzflow.com/blog/mastering-video-player-controls-ux-best-practices)
- [Best Practices for Video Playback — Mux](https://www.mux.com/articles/best-practices-for-video-playback-a-complete-guide-2025)

### Тёмные паттерны и академические исследования
- ["Are You Still Watching?" Dark Patterns on Streaming Platforms — ACM DIS 2022](https://dl.acm.org/doi/fullHtml/10.1145/3532106.3533562)
- [An Experimental Study of Netflix Autoplay — ACM CSCW 2025](https://dl.acm.org/doi/abs/10.1145/3710928)
- [Autoplay and Infinite Scroll — René Otto / Medium](https://rene-otto.medium.com/autoplay-and-infinite-scroll-8607abe52bb7)
- [Netflix's New UI Update Sparks Criticism — What's on Netflix](https://www.whats-on-netflix.com/news/netflixs-new-ui-update-sparks-backlash-as-global-rollout-continues/)
- [Netflix and its new TV interface: poor UX design — Tapptic](https://www.tapptic.com/netflix-and-its-new-tv-interface-when-poor-ux-design-makes-users-switch-off/)

### NN/G специфические статьи
- [UX Guidelines for Recommended Content — NN/G](https://www.nngroup.com/articles/recommendation-guidelines/)
- [Individualized Recommendations: Users' Expectations — NN/G](https://www.nngroup.com/articles/recommendation-expectations/)
- [Video Usability — NN/G](https://www.nngroup.com/articles/video-and-streaming-media/)
- [Skeleton Screens 101 — NN/G](https://www.nngroup.com/articles/skeleton-screens/)
- [Drop-Down Menus Design Guidelines — NN/G](https://www.nngroup.com/articles/drop-down-menus/)

### Пользовательские отзывы / кейс-стади
- [HBO Max UX vs Netflix — Built for Mars](https://builtformars.com/case-studies/hbo-max)
- [HBO Max Usability Flaws — Georgy Vasilyev / Medium](https://medium.com/design-bootcamp/hbo-max-usability-flaws-2533e414293a)
- [MUBI User Reviews — Trustpilot](https://www.trustpilot.com/review/mubi.com)
- [MUBI UX Case Study — Emily T / Medium](https://medium.com/@emilytyx719/ui-ux-case-study-mubi-2e27045f4a90)
- [Streaming UX/UI: Criterion, MUBI, Kanopy — The Content Technologist](https://www.content-technologist.com/streaming-ux-ui-criterion-mubi-kanopy/)
- [Creativity vs UX on Netflix/HBO — Braingineers](https://www.braingineers.com/post/video-streaming-platforms)
- [Why All Streaming Interfaces Are Terrible — InsideHook](https://www.insidehook.com/article/internet/streaming-services-bad-user-interface)

### Академические исследования стриминга
- [Usability Study on Streaming Service UI — ResearchGate/Open Access](https://openaccess.cms-conferences.org/publications/book/978-1-958651-86-5/article/978-1-958651-86-5_24)
- [UX Evaluation of Video Streaming with Teenage Users — ResearchGate](https://www.researchgate.net/publication/320416737_UX_Evaluation_of_Video_Streaming_Application_with_Teenage_Users)
- [MUBI and the Curation of On-Demand Film — Springer](https://link.springer.com/book/10.1007/978-3-030-80076-5)
- [Beyond Netflix and Amazon: MUBI curation — ResearchGate](https://www.researchgate.net/publication/329645156_Beyond_Netflix_and_Amazon_MUBI_and_the_curation_of_on-demand_film)

### Российский рынок
- [Итоги 2025 года для онлайн-кинотеатров России — Кинометро](https://www.kinometro.ru/analytics/show/name/russtreaming_itogi25_06052026)
- [Исследование онлайн-кинотеатров за 2024 год — Cinemaplex](https://cinemaplex.ru/2025/02/26/issledovanie-onlajn-kinoteatrov-za-2024-god.html)
- [Сравнение стриминг-сервисов России — iXBT](https://www.ixbt.com/live/sw/sravnenie-glavnyh-striming-servisov-rossii-plyusy-i-minusy-kazhdogo-kinopoisk-premier-kion-i-okko.html)
- [Russia OTT Market Forecast — IMARC Group](https://www.imarcgroup.com/russia-over-the-top-market)
- [Video Streaming Russia — Statista](https://www.statista.com/outlook/dmo/digital-media/video-on-demand/video-streaming-svod/russia)
