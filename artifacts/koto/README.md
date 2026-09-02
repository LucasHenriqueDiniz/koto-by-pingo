# Koto by Pingo

> "Japonês em pequenos treinos diários." — Japanese in small daily drills.

A Japanese web app for Brazilian learners. It works fully offline with no backend — all progress
lives in the browser's `localStorage`. The interface is pt-BR.

---

## Stack

- React + Vite + TypeScript
- Tailwind CSS + framer-motion
- Wouter (routing)
- lucide-react (icons)
- Web Speech API (listening mode)

---

## Modules

| Module | Description |
|--------|-------------|
| **Kana** | Trainer for hiragana, katakana and both mixed |
| **Vocabulary** | 45 N5 words across 4 training modes |
| **Listening** | Audio recognition through the Web Speech API |
| **Mock exams** | N5 Mini + N4 Mini, with per-question review |
| **Progress** | Dashboard with kana and vocabulary statistics |

---

## Vocabulary modes

1. **Flashcards** — flip the card, mark it right or wrong
2. **Word selection** — pick the correct romaji reading
3. **Matching pairs** — match Japanese words to their readings/meanings
4. **Translation quiz** — pick the correct pt-BR meaning

---

## Layout

- **Desktop (>= 1024px):** fixed left sidebar + content area + right study panel (xl+)
- **Tablet:** sidebar hidden, content centered
- **Mobile (< 768px):** top bar + bottom navigation, no sidebar

---

## AdSense / UX rules

> **IMPORTANT:** these rules must hold for any future integration of real ads.

### Forbidden

- ❌ An ad **inside an exercise card** (flashcard, question, matching pair)
- ❌ An ad **immediately before or after** action buttons (`Confirmar`, `Próxima`, `Acertei`, `Errei`, `Iniciar` — confirm, next, got it right, got it wrong, start)
- ❌ An ad **between answer options** in any quiz
- ❌ An ad that **interrupts the flow** of a session in progress
- ❌ A floating ad overlapping training content

### Allowed

- ✅ Before a session starts (between the filter selection and the card)
- ✅ After a session completes (on the result screen)
- ✅ In the desktop right sidebar, with safe spacing (≥ 16px from the cards)
- ✅ Between editorial content blocks (e.g. on the About page, between paragraphs)
- ✅ On the dashboard, after the statistics and before the reset button

### Component

Always use `<AdPlaceholder slot="banner" />` or `<AdPlaceholder slot="rectangle" />`.
Never put the marker inside a `<form>`, a `<dialog>`, or any question container.

---

## Progress

Every `localStorage` access goes exclusively through:

```
src/services/progress/progress.local.ts
```

No component and no page may call `localStorage` directly.

### Word classification criteria

| Classification | Attempts | Accuracy |
|----------------|----------|----------|
| **Mastered** | ≥ 5 | ≥ 85% |
| **Troublesome** | ≥ 3 | < 60% |
| **Never seen** | 0 | — |

---

## Future architecture

See the technical documentation in `/docs/`:

| File | Content |
|------|---------|
| `TODO_CLERK_AUTH.md` | Clerk authentication plan |
| `TODO_CLOUDFLARE_D1.md` | Migration to the Cloudflare D1 database |
| `TODO_TRACING.md` | Kana stroke-tracing feature |
| `TODO_EXAMS.md` | Expansion of the JLPT mock exams |

---

## Mascot

**Pingo-sensei** — a black penguin, the app's mascot.

- Inline SVG in 5 variants: `default`, `kana`, `listening`, `exam`, `progress`
- To use a real image: add `public/brand/pingo.png`

---

## Scripts

```bash
pnpm dev      # dev server
pnpm build    # production build
pnpm preview  # preview the build
```
