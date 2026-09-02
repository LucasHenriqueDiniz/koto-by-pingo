# CLAUDE.md — Koto by Pingo

A guide for AI agents working on this project. Read it before editing any file.

---

## Where the house rules come from

The conventions this repo follows are **skills in the `hexagram` plugin, not files on disk**. The
plugin is installed once per machine, and the repo picks up whatever version the person who cloned
it has installed. `hexagram` ships these skills, and they are the rules for this repo:

| skill | covers |
|---|---|
| `architecture` | the Deterministic Hexagon — where a file goes, ports, use cases |
| `naming` | what to call a folder, repo, resource, state key, slug |
| `git` | commits, branches, submodules, history |
| `language` | everything in the repo is written in English (see the note below) |
| `testing` | what to test at which layer, fakes vs. real infrastructure |
| `clean-code` | naming, function and file size, error handling |
| `diagrams` | C4 notation, Excalidraw, generator vs. hand-owned files |
| `workflow` | pitch → research → decision → plan → implement → postmortem |
| `terraform` | stack layout, remote state, when a resource earns a module |
| `setup-machine` | machine-level setup |
| `research` | how to look something up before deciding on it |
| `postmortem` | the record written when work closes out |
| `lint` | formatting, lint rules and types across the stack |

⚠️ **`.claude/rules/` does not exist here, and that is deliberate.** Nothing was forgotten and
nothing needs to be copied in. If you go looking for a local rules directory and find none, the
rules are in the plugin — invoke the skill (`/hexagram:<skill>`) rather than concluding this repo
has no standard.

**On `language` specifically:** code, comments, docstrings, test names, docs, README, commit
messages and branch names are all English. The **product** is pt-BR, and that is not an exception
to the rule — the app's UI copy, the learning content (`meaningPt`, exam prompts, explanations,
category and tag values) and the API error strings are the artefact being described, so they stay
in Portuguese. Translating them would be a product regression, not a cleanup.

---

## What this project is

**Koto by Pingo** is a Japanese-learning web app for Brazilian students.
Tagline: _"Japonês em pequenos treinos diários."_ (Japanese in small daily drills.)

- **localStorage is the primary source.** All progress keeps working fully offline, signed in or not.
- **Real authentication through Clerk** (`@clerk/react`). Signing in is optional — anonymous
  visitors use the app normally.
- **An optional backend on Cloudflare D1 + Workers** (`cloudflare/`) — it syncs local progress to
  the user's account once they sign in (on-demand sync, see `docs/TODO_CLOUDFLARE_D1.md`).
- **Works fully offline** after the first load, signed in or not.

Main artifact: `artifacts/koto/` — a React + Vite + TypeScript app.

---

## Ecosystem — 3 related repositories

This project is part of an ecosystem of 3 sibling repositories under `E:\Repositories\`, all under
the **Pingo** brand:

| Repo | Role | Stack |
|------|------|-------|
| **concursos-app** | Mobile/web app for practising Brazilian public-exam questions | Expo (React Native) + Expo Router + Zustand + React Query + NativeWind + Supabase |
| **concursos-scrapper** | Local scraper that downloads exams/answer keys and feeds the database (PCI, QConcursos, QSim, QuestoesAqui) | Python (scraping) + Vite/React/TS (ops interface) |
| **koto-by-pingo** (this one) | Japanese-learning web app for Brazilians ("Koto by Pingo") | React 19 + Vite + TS + Cloudflare D1/Workers + Clerk |

The Clerk + Cloudflare D1/Workers pattern in this repo (`cloudflare/api/auth.ts`, the wrangler
config, scoping data with `WHERE user_id = ?` instead of RLS) is the reference concursos-app is
using to migrate off Supabase onto Cloudflare — changes here may be worth mirroring there, and
vice versa.

## Task management — Todoist

Planning and the backlog for this ecosystem (app, scrapper and koto) live in Todoist, in the
**"Pingo — Koto & Concursos"** project, organised into sections by repo/area (e.g. `A Fazer`,
`Feito`, `Ideias` — to do, done, ideas) and by label (`app`, `scrapper`, `koto`). When planning
work or asking "what is left to do", consider checking that project for current context rather than
inferring it from the state of the code alone.

**When you finish something that corresponds to a Todoist item, update Todoist before ending the
session**: mark it complete (`complete-tasks`), or update the description if the work revealed the
task was incomplete or out of date, or create a new task if a finding or loose end came up that did
not exist before. The backlog is only a source of truth while it stays in sync with what was
actually done.

---

## Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 + Vite + TypeScript |
| Routing | **Wouter** (not React Router) |
| Styling | Tailwind CSS |
| Animation | framer-motion |
| Icons | **Material Symbols Outlined** (through `<MaterialIcon name="..." />` in `components/ui/MaterialIcon.tsx`) — lucide-react was removed |
| Base UI | Shadcn/UI (components in `src/components/ui/`) |
| Server state | @tanstack/react-query (client-side only, no real fetches) |
| Audio | The browser's native Web Speech API |

---

## Folder structure

```
artifacts/koto/src/
├── App.tsx                      ← main routing (Wouter)
├── main.tsx                     ← entry point
│
├── components/
│   ├── brand/                   ← Logo, BrandMark, PingoMascot (5 SVG variants)
│   ├── kana/
│   │   ├── KanaInput.tsx / KanaStats.tsx        ← romaji input + session statistics panel
│   │   ├── KanaCharacterCard.tsx                ← display card for one kana (sm/md/lg, optional romaji)
│   │   ├── KanaModeSelector.tsx                 ← selection grid for the 7 KanaTrainingMode + KANA_MODE_LABELS
│   │   ├── KanaGroupFilter.tsx                  ← script + group filter (KANA_GROUP_LABELS) + troublesome-only
│   │   ├── KanaSubNav.tsx                       ← sub-navigation across the 6 /kana/* pages
│   │   └── modes/                               ← 7 training modes + KANA_MODE_COMPONENTS (registry)
│   │       ├── TypingMode.tsx        (typing — uses useKanaTrainer)
│   │       ├── FlashcardsMode.tsx    (flip card)
│   │       ├── MultipleChoiceMode.tsx
│   │       ├── MatchingPairsMode.tsx (kana ↔ romaji pairs, in batches)
│   │       ├── ListeningMode.tsx     (Web Speech API)
│   │       ├── WordBuilderMode.tsx   (build words from kanaWords)
│   │       └── TracingMode.tsx       (placeholder — see docs/TODO_TRACING.md)
│   ├── layout/                  ← AppLayout, DesktopSidebar, ResponsiveAppShell,
│   │                              MobileBottomNav, MobileTopBar, RightStudyPanel, Footer
│   ├── quiz/                    ← MultipleChoiceQuestion, QuizCard, ResultSummary
│   ├── vocabulary/              ← FlashcardMode, WordSelectionMode, MatchingPairsMode,
│   │                              TranslationQuizMode, VocabularyCard, VocabularyQuiz
│   └── ui/                      ← Shadcn + custom components (AdPlaceholder, PageHeader,
│                                  StatCard, ProgressBar, ModuleBadge, Spinner...)
│
├── data/
│   ├── kana.ts                  ← 46 hiragana + 46 katakana + dakuten/handakuten/yoon,
│   │                              with group ('basic'|'dakuten'|'handakuten'|'yoon') and row
│   ├── kanaWords.ts             ← short words (KanaWord[]) used by WordBuilderMode
│   ├── vocabulary.ts            ← 105 words (45 N5 + 60 N4) across 15 categories + helpers
│   ├── kanji.ts                 ← KanjiItem[] by jlptLevel (N5, N4...), cross-linked to vocabulary.ts through exampleWordIds
│   ├── strokeData.ts            ← stroke-order data (see docs/TODO_TRACING.md)
│   └── mockExams.ts             ← N5 Mini + N4 Mini (questions + sections)
│
├── hooks/
│   ├── useKanaQueue.ts          ← generic queue/session (queue, current, registerResult, endSession...)
│   ├── useKanaTrainer.ts        ← useKanaQueue<KanaItem> wrapper for TypingMode (takes KanaItem[])
│   ├── useKanaFilters.ts        ← shared preferences for script/groups/troublesome-only
│   ├── useLocalStorage.ts       ← generic typed localStorage hook
│   ├── useStudyProgress.ts      ← reads and exposes getProgressSummary() with refresh/reset
│   └── use-mobile.tsx           ← detects a viewport under 768px
│
├── pages/
│   ├── HomePage.tsx             ← landing page with hero, features, modules
│   ├── KanaHubPage.tsx          ← /kana — overview + shortcuts to the 5 sub-pages
│   ├── KanaLearnPage.tsx        ← /kana/aprender — reference table by group/row
│   ├── KanaTrainPage.tsx        ← /kana/treinar — mode selector + filters + KANA_MODE_COMPONENTS
│   ├── KanaReviewPage.tsx       ← /kana/revisar — troublesome, never seen, mastered
│   ├── KanaStatsPage.tsx        ← /kana/estatisticas — overall and per-group accuracy + reset
│   ├── KanaSettingsPage.tsx     ← /kana/configurar — groups, default mode, romaji hint
│   ├── KanjiHubPage.tsx         ← /kanji — overview + shortcuts to the 5 sub-pages (unlocked from N5 on)
│   ├── KanjiLearnPage.tsx       ← /kanji/aprender — reference table by level (N5/N4...)
│   ├── KanjiTrainPage.tsx       ← /kanji/treinar — kanji training (reading/meaning)
│   ├── KanjiReviewPage.tsx      ← /kanji/revisar — troublesome, never seen, mastered
│   ├── KanjiStatsPage.tsx       ← /kanji/estatisticas — overall accuracy and accuracy per JLPT level
│   ├── KanjiSettingsPage.tsx    ← /kanji/configurar — kanji training preferences
│   ├── VocabularyLibraryPage.tsx ← /vocabulario — browsable library (search, N5-N2 filter, pagination)
│   ├── VocabularyPage.tsx       ← /vocabulario/treinar — 4 modes + smart filters
│   ├── AulasExtrasPage.tsx      ← /aulas — supplementary material (placeholder, see docs/TODO_AULAS_EXTRAS.md)
│   ├── ExamsPage.tsx            ← mock-exam hub (hero, N1-N5 levels, history)
│   ├── ExamDetailPage.tsx       ← taking and reviewing a mock exam
│   ├── DashboardPage.tsx        ← /progresso — real stats + gamification placeholders
│   ├── LoginPage.tsx            ← /entrar — split screen + Clerk <SignIn/> (outside AppLayout)
│   ├── SettingsPage.tsx         ← /configuracoes — profile + theme + preferences (settings.local.ts)
│   ├── AboutPage.tsx / ContactPage.tsx / PrivacyPage.tsx / TermsPage.tsx
│   └── not-found.tsx
│
├── services/
│   ├── auth/
│   │   ├── auth.clerk.ts        ← useCurrentUser() / useSignOut() (Clerk)
│   │   └── auth.types.ts
│   ├── exams/
│   │   ├── exams.local.ts       ← save/read mock-exam attempts
│   │   └── exams.types.ts
│   ├── progress/
│   │   ├── progress.local.ts    ← THE ONLY place progress is read from or written to (localStorage)
│   │   │                          includes getWeeklyActivity() (real weekly activity, derived from the attempts)
│   │   ├── progress.remote.ts   ← syncProgressToRemote() / fetchProgressFromRemote() (D1 through Workers)
│   │   └── progress.types.ts    ← the service's internal types
│   └── settings/
│       └── settings.local.ts    ← app preferences (theme, sounds, romaji); applyTheme() applies .dark
│
├── types/
│   ├── kana.ts                  ← KanaItem, KanaType
│   ├── vocabulary.ts            ← VocabularyWord, VocabularyTrainingMode, WeakReason, WordAttemptInput
│   ├── progress.ts              ← BaseAttempt, KanaAttempt, VocabAttempt, ExamAttempt...
│   ├── exams.ts                 ← Question, Section, Exam
│   └── user.ts                  ← AuthUser, AuthSession
│
└── utils/
    ├── kana.ts                  ← checkAnswer() (normalises the input)
    ├── scoring.ts               ← calcAccuracy, shuffle, generateId
    ├── seo.ts                   ← updatePageSEO()
    └── storage.ts               ← storageGet/storageSet/storageClear (prefix "koto:")
```

---

## Absolute rules — never violate

### 1. localStorage only through the service
```
✅ import { recordWordAttempt } from '../services/progress/progress.local';
❌ localStorage.setItem(...)   ← forbidden in components and pages
```
Every read and write of persistent state goes through `services/progress/progress.local.ts`.
All keys are prefixed `koto:` — defined in `utils/storage.ts`.

### 2. Routing is Wouter, not React Router
```tsx
✅ import { Link, useLocation } from 'wouter';
❌ import { Link } from 'react-router-dom';
```
The base path comes from `import.meta.env.BASE_URL` (already configured in App.tsx).

### 3. Clerk + Cloudflare D1 are already wired
- Auth: `src/services/auth/auth.clerk.ts` (`@clerk/react`, `<ClerkProvider>` in `main.tsx`)
- Remote sync: `src/services/progress/progress.remote.ts` (the Workers API in `cloudflare/api/`)

Signing in is **optional**: without it, everything stays in `localStorage`. With it, the user can
sync local progress to the account (the `SyncProgressBanner` banner on the dashboard).
Do not add a second auth or sync service alongside these — extend the existing ones.

### 4. AdSense rules
**Never put `<AdPlaceholder>` inside:**
- An exercise card (flashcard, question, matching pair)
- Next to action buttons (`Verificar`, `Próximo`, `Acertei`, `Errei`, `Confirmar` — check, next,
  got it right, got it wrong, confirm)
- Between answer options

**It may go:**
- Before a session starts (above the trainer)
- After a session ends (on the result screen)
- In the right sidebar (desktop), with ≥ 16px spacing
- Between editorial blocks (About page, between paragraphs)

### 5. Strict TypeScript — no implicit `any`
```bash
pnpm --filter @workspace/koto run build   # must pass with no errors
```

---

## Patterns and conventions

### Pages
Every page opens with `<PageHeader title="..." description="..." color="#hex" />`.
It calls `updatePageSEO(title, description)` in a `useEffect`.
Main container: `<div className="max-w-6xl mx-auto px-4 py-6">`.

### Responsive layout
```
Desktop (>= 1024px):   DesktopSidebar (fixed w-60) + main with lg:pl-60
                       xl+ also shows RightStudyPanel
Tablet (768–1023px):   no sidebar — MobileTopBar + MobileBottomNav (same pattern as mobile)
Mobile (< 768px):      MobileTopBar + MobileBottomNav (pb-16 on main, up to lg)
```

`AppLayout` → `ResponsiveAppShell` already handles all of it. Do not rebuild nav inside pages.

### Kana progress

**Criteria:**
| Classification | Attempts | Accuracy |
|----------------|----------|----------|
| Mastered | ≥ 5 | ≥ 85% |
| Troublesome | ≥ 3 | < 60% |
| Never seen | 0 | — |

Attempts carrying `skipped: true` count towards no metric at all.

Functions: `getWeakKana(ids, limit?)`, `getMasteredKana(ids)`, `getNeverSeenKana(ids)`, `getKanaFilterStats(ids)`,
`getKanaStats()` (global totals), `getKanaCharacterStats(kanaId)` (attempts/correct/errors/skipped/accuracy
per character), `getKanaGroupStats()` (accuracy aggregated by group: basic/dakuten/handakuten/yoon),
`resetKanaProgress()` (resets kana progress only, leaving vocabulary and mock exams alone).

`recordKanaAttempt(kanaId, correct, { mode?, skipped?, group? })` records the training mode and the
character's group alongside the attempt.

### Vocabulary progress

Same mastered/troublesome criteria.
Every attempt records a `WeakReason`: `'reading' | 'meaning' | 'listening' | 'typing'`.

Functions: `recordWordAttempt(input)`, `getWeakWords(limit)`, `getMasteredWords()`, `getNeverSeenWords()`, `getVocabStats()`.

### Kanji progress

The same mastered/troublesome/never-seen criteria as kana (above), applied per `jlptLevel`.

Functions (`services/progress/progress.local.ts`): `recordKanjiAttempt(kanjiId, correct, opts?)`,
`getWeakKanji(ids, limit?)`, `getMasteredKanji(ids)`, `getNeverSeenKanji(ids)`, `getKanjiFilterStats(ids)`,
`getKanjiStats()`, `getKanjiCharacterStats(kanjiId)`, `getKanjiLevelStats()` (accuracy per JLPT level),
`getKanjiAccuracy()`.

### Kana / Kanji pages and routes
```
/kana                ← KanaHubPage      (overview + shortcuts)
/kana/aprender       ← KanaLearnPage    (reference table by group/row)
/kana/treinar        ← KanaTrainPage    (mode selector + filters + training)
/kana/revisar        ← KanaReviewPage   (troublesome, never seen, mastered)
/kana/estatisticas   ← KanaStatsPage    (overall/per-group accuracy + reset)
/kana/configurar     ← KanaSettingsPage (groups, default mode, romaji hint)

/kanji               ← KanjiHubPage      (overview + shortcuts, unlocked after some N5 progress)
/kanji/aprender      ← KanjiLearnPage    (reference table by JLPT level)
/kanji/treinar       ← KanjiTrainPage    (reading/meaning training)
/kanji/revisar       ← KanjiReviewPage   (troublesome, never seen, mastered)
/kanji/estatisticas  ← KanjiStatsPage    (overall/per-level accuracy)
/kanji/configurar    ← KanjiSettingsPage (training preferences)
```
`KanaSubNav` — and its kanji equivalent — is rendered at the top of each module's pages (below
`PageHeader`).

### Kana groups and training modes
```ts
type KanaGroup = 'basic' | 'dakuten' | 'handakuten' | 'yoon';
// basic: plain hiragana/katakana (a~n) · dakuten: が ざ だ ば... · handakuten: ぱぴぷぺぽ · yoon: きゃ しゅ ぎょ...

type KanaTrainingMode =
  | 'typing'         // TypingMode.tsx        — type the romaji
  | 'flashcards'      // FlashcardsMode.tsx    — flip the card and self-grade
  | 'multiple_choice' // MultipleChoiceMode.tsx — pick the romaji out of 4 options
  | 'matching_pairs'  // MatchingPairsMode.tsx — match kana ↔ romaji in batches
  | 'listening'       // ListeningMode.tsx     — listen and answer (Web Speech API)
  | 'word_builder'    // WordBuilderMode.tsx   — build words from data/kanaWords.ts
  | 'tracing';        // TracingMode.tsx       — placeholder, see docs/TODO_TRACING.md
```
`KANA_MODE_COMPONENTS` (in `components/kana/modes/index.ts`) maps each mode to its component; all of
them share the same `{ items: KanaItem[]; showRomajiHint?: boolean }` interface.

### Shared kana filters
```tsx
// useKanaFilters() centralises script + enabled groups + troublesome-only
const { script, groupPrefs, onlyWeak, groupFilteredItems, filteredItems } = useKanaFilters();
// groupFilteredItems: items of the current script, restricted to the enabled groups
// filteredItems: groupFilteredItems + the troublesome-only filter (with a fallback when empty)
```
Used by `KanaTrainPage`, `KanaLearnPage` and `KanaSettingsPage`.

### Kana training hook (typing mode)
```tsx
// useKanaTrainer takes KanaItem[] (not KanaType)
const trainer = useKanaTrainer(filteredItems);
// Reset with a new list:
trainer.resetQueue(newItems);
```
For the other modes, use `useKanaQueue<T>(items)` directly — it returns
`{ queue, current, currentIndex, sessionCorrect, sessionTotal, sessionSkipped, sessionAccuracy, next, reset, registerResult, registerSkip, endSession }`.

### Vocabulary modes
```tsx
type VocabularyTrainingMode =
  | 'flashcards'        // FlashcardMode.tsx    — weakReason: 'meaning'
  | 'word_selection'    // WordSelectionMode.tsx — weakReason: 'reading'
  | 'matching_pairs'    // MatchingPairsMode.tsx — weakReason: 'reading'
  | 'translation_quiz'; // TranslationQuizMode.tsx — weakReason: 'meaning'
```

### The Pingo-sensei mascot
```tsx
<PingoMascot variant="default" size="md" />
// variants: 'default' | 'kana' | 'listening' | 'exam' | 'progress'
// sizes: 'sm' | 'md' | 'lg'
```
To use a real image: add `public/brand/pingo.png`.

---

## How to add a new page

1. Create `src/pages/SomePage.tsx`
2. Export the component function with `PageHeader` + `updatePageSEO`
3. Add the route in `App.tsx`
4. Add the link in `DesktopSidebar.tsx` and `MobileBottomNav.tsx`

## How to add vocabulary words

Edit `src/data/vocabulary.ts`. The meaning and the category are product data, in pt-BR:
```ts
{ id: 'v-046', japanese: '猫', kana: 'ねこ', romaji: 'neko',
  meaningPt: 'gato', category: 'animais', level: 'N5' }
```
`categories` is computed automatically through a `Set`.

## How to add mock-exam questions

Edit `src/data/mockExams.ts`. The prompt, options and explanation are product content, in pt-BR:
```ts
{
  id: 'n5-q-XX', type: 'vocabulary', prompt: '...', japaneseText: '...',
  options: [{ id: 'a', text: '...' }, ...],
  correctOptionId: 'a', explanation: '...', tags: ['n5'], difficulty: 2,
}
```

---

## localStorage keys (all prefixed `koto:`)

| Key | Content |
|-----|---------|
| `koto:kana_progress` | `{ attempts: KanaAttemptRecord[], lastUpdated }` |
| `koto:vocab_progress` | `{ attempts: VocabAttemptRecord[], lastUpdated }` (aggregate) |
| `koto:word_progress` | `Record<wordId, WordProgressRecord>` (per-word granularity) |
| `koto:exam_attempts` | `ExamAttemptRecord[]` |
| `koto:sessions` | `StudySessionRecord[]` |
| `koto:vocab_mode` | `VocabularyTrainingMode` (saved preference) |
| `koto:vocab_hint` | `boolean` (show the translation as a hint) |
| `koto:kana_type` | `KanaType` (preferred script: hiragana/katakana/mixed) |
| `koto:kana_romaji_hint` | `boolean` (show the romaji as a hint) |
| `koto:kana_group_prefs` | `Record<KanaGroup, boolean>` (enabled groups: basic/dakuten/handakuten/yoon) |
| `koto:kana_only_weak` | `boolean` (the troublesome-only filter) |
| `koto:kana_train_mode` | `KanaTrainingMode` (default / last-used training mode) |
| `koto:tracing_practice` | `Record<kanaId, number>` (how many times "mark as practised" was hit in TracingMode) |
| `koto:remote_sync` | `boolean` (local progress has already been synced to the account through D1) |

---

## Scripts

```bash
# Development
pnpm --filter @workspace/koto run dev

# Production build (must pass with no TS errors)
pnpm --filter @workspace/koto run build

# Preview the build
pnpm --filter @workspace/koto run preview
```

---

## Feature documentation

| File | Subject | Status |
|------|---------|--------|
| `docs/TODO_CLERK_AUTH.md` | Authentication with Clerk | ✅ implemented |
| `docs/TODO_CLOUDFLARE_D1.md` | Cloudflare D1 + Workers backend | ✅ implemented — real database (`koto_by_pingo`) and the Worker deployed to production |
| `docs/TODO_GAMIFICATION.md` | Streak, XP/level, achievements | ✅ implemented — only the weekly goals are missing |

## Documented TODOs (do not implement without being asked)

| File | Subject |
|------|---------|
| `docs/TODO_TRACING.md` | Kana stroke-tracing feature (SVG stroke order) |
| `docs/TODO_EXAMS.md` | Expanding the JLPT N3/N2/N1 mock exams, timer, history |
| `docs/TODO_AULAS_EXTRAS.md` | The `/aulas` page (supplementary Cure Dolly-style material) — visual placeholder |

---

## What NOT to do

- ❌ `localStorage.getItem/setItem` directly in a component
- ❌ Install `react-router-dom` (this repo uses Wouter)
- ❌ Install `@clerk/clerk-react` (discontinued — use `@clerk/react`, already wired in)
- ❌ Add a second auth or sync service alongside `auth.clerk.ts`/`progress.remote.ts`
- ❌ Use implicit `any` in TypeScript
- ❌ Put `<AdPlaceholder>` inside an exercise card
- ❌ Duplicate nav logic (AppLayout already handles all of it)
- ❌ Reach for `import.meta.env` outside `main.tsx` or `App.tsx` for the base URL

---

## Brand

- **Primary color:** `#ac2b2f` (Koto red — updated in the design refactor; the full tokens are in `src/index.css`)
- **Headline:** `'Plus Jakarta Sans', sans-serif` (`font-heading`) — body text stays on `Inter`
- **Japanese font:** `'Noto Sans JP', sans-serif` — apply through `style={{ fontFamily: ... }}` or `font-japanese`
- **Mascot:** Pingo-sensei, a black penguin with red details
- **Audience:** Brazilian students starting out in Japanese

## Commit hook

`.githooks/commit-msg` strips AI attribution trailers from commit messages. Git does not version
`.git/hooks`, so what makes the hook run is one line of local config — and a fresh clone does not
have it. The root `prepare` script sets it on `pnpm install`, and only when nothing else claims it:

```
git config --get core.hooksPath >/dev/null 2>&1 || git config core.hooksPath .githooks
```

If you already point `core.hooksPath` somewhere else, the script leaves your value alone and this
repo's hook stays inert — wire it by hand, or move the file into whatever directory you do use.
