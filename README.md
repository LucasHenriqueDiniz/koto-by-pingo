# Koto by Pingo

**"Japonês em pequenos treinos diários."** — Japanese in small daily drills.

Koto by Pingo is a Brazilian web app for practising Japanese: kana, vocabulary, listening and
JLPT-style mock exams. The interface and the learning content are pt-BR.

---

## About the brand

Koto is a product of [Pingo Concursos](https://pingoconcursos.com.br), a Brazilian brand for exam
and certification prep.

The **Pingo** mascot is a black penguin. In Koto he shows up as **Pingo-sensei**, the guide for the
Japanese studies.

---

## Swapping the placeholder for the real mascot

The `PingoMascot` component loads `/brand/pingo.png` automatically when it is present.

1. Drop the Pingo image at `artifacts/koto/public/brand/pingo.png`
2. The component then uses the real image in every variant
3. When the image is missing, the SVG placeholder is shown instead

See `artifacts/koto/public/brand/README.md` for the details.

---

## Running locally

```bash
# Install the dependencies
pnpm install

# Start the dev server
pnpm --filter @workspace/koto run dev
```

The app is then served at `http://localhost:<PORT>`.

---

## Production build

```bash
pnpm --filter @workspace/koto run build
```

The build lands in `artifacts/koto/dist/public`.

---

## Project structure

```
artifacts/koto/src/
  App.tsx        — router and app setup (Wouter)
  components/
    brand/       — Logo, BrandMark, AppIcon, PingoMascot, MascotMessage
    layout/      — AppLayout, ResponsiveAppShell, DesktopSidebar, MobileTopBar,
                   MobileBottomNav, RightStudyPanel, Footer
    ui/          — generic components (Shadcn/UI + ProgressBar, StatCard, AdPlaceholder, etc.)
    kana/        — KanaInput, KanaStats, KanaCharacterCard, KanaModeSelector, KanaGroupFilter,
                   KanaSubNav, modes/ (the 7 kana training modes)
    vocabulary/  — FlashcardMode, WordSelectionMode, MatchingPairsMode,
                   TranslationQuizMode, VocabularyCard, VocabularyQuiz
    quiz/        — QuizCard, MultipleChoiceQuestion, ResultSummary
  pages/         — every page of the app (including KanaHubPage and the 5 /kana/* sub-pages)
  data/          — kana.ts, kanaWords.ts, vocabulary.ts, mockExams.ts
  hooks/         — useLocalStorage, useStudyProgress, useKanaQueue, useKanaTrainer, useKanaFilters
  services/
    progress/    — localStorage access (never reach for it directly)
    auth/        — Clerk placeholder
    exams/       — mock-exam logic
  types/         — TypeScript types
  utils/         — kana, scoring, seo, storage

cloudflare/      — SQL schema and migrations for Cloudflare D1
```

---

## How localStorage works

All user progress is stored locally in the browser.

**The rule:** no component and no page touches `localStorage` directly. Every access goes through
`src/services/progress/progress.local.ts`.

Keys in use (prefix `koto:`):
- `koto:kana_progress` — history of kana attempts
- `koto:vocab_progress` — history of vocabulary attempts
- `koto:exam_attempts` — completed mock exams
- `koto:sessions` — study sessions

---

## How Clerk comes in later

`src/services/auth/auth.placeholder.ts` carries `TODO` comments marking each integration point.

To wire Clerk up:
1. `pnpm --filter @workspace/koto add @clerk/clerk-react`
2. Add `VITE_CLERK_PUBLISHABLE_KEY` to the environment variables
3. Wrap `<App>` in `<ClerkProvider>`
4. Replace the placeholder functions with the Clerk APIs

---

## How Cloudflare D1 comes in later

`cloudflare/schema.sql` holds every table that is needed.

To turn it on:
1. Create the database: `npx wrangler d1 create koto_by_pingo`
2. Copy `wrangler.example.toml` → `wrangler.toml` and fill in `database_id`
3. Apply the migrations: `npx wrangler d1 migrations apply koto_by_pingo`
4. Implement the API routes under `cloudflare/api/`
5. Replace the stubs in `services/progress/progress.remote.placeholder.ts`

---

## Publishing to Cloudflare Pages

1. Build it: `pnpm --filter @workspace/koto run build`
2. The output directory is `artifacts/koto/dist/public`
3. In the Cloudflare Pages dashboard, set:
   - Build command: `pnpm --filter @workspace/koto run build`
   - Build output directory: `artifacts/koto/dist/public`
4. To run Cloudflare Workers/Functions alongside Pages, see the official documentation.

---

## Technology

- **React 19** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (styling)
- **Wouter** (routing)
- **Framer Motion** (animation)
- **localStorage** (local persistence)

---

## License

Property of Pingo Concursos. Personal and educational use permitted.
