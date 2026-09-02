# 🇯🇵 Koto by Pingo — Instructions for Agents

Quick guide for AI agents working on this project.

---

## What Koto by Pingo is

A Japanese-learning web app for Brazilian students. Fully offline-first, with optional Clerk authentication.

**Stack:** React 19 + Vite + TypeScript + Tailwind + Wouter + @tanstack/react-query  
**Storage:** localStorage as the primary source + Cloudflare D1 (optional, only when signed in)  
**Icons:** Material Symbols Outlined (lucide-react was removed)

---

## Hard constraints — never violate

1. **localStorage only through the service**
   ```js
   ✅ import { recordKanaAttempt } from '../services/progress/progress.local';
   ❌ localStorage.setItem(...)  // forbidden in components
   ```

2. **Wouter, not React Router**
   ```tsx
   ✅ import { Link, useLocation } from 'wouter';
   ❌ react-router-dom  // forbidden
   ```

3. **No implicit `any`** — TypeScript is strict
   ```bash
   pnpm --filter @workspace/koto run build  # must pass
   ```

4. **AdSense: never inside a card** (flashcard, question)
   - ✅ Before/after a session, right sidebar, between editorial blocks
   - ❌ Between answer options, next to action buttons, inside exercises

5. **Clerk + D1 are already wired** — do not add a second auth service

---

## Folder structure (short version)

```
artifacts/koto/src/
├── App.tsx                    # Routes (Wouter)
├── pages/                     # 6 Kana pages + 4 Vocabulary pages + mock exams + dashboard
├── components/
│   ├── kana/modes/            # 7 training modes (typing, flashcards, multiple_choice, etc)
│   ├── layout/                # AppLayout, DesktopSidebar, MobileBottomNav
│   └── ui/                    # Shadcn + custom components
├── services/progress/         # THE ONLY localStorage entry point
├── data/
│   ├── kana.ts               # 46 hiragana + 46 katakana + variants
│   ├── vocabulary.ts         # 45 N5 words across 9 categories
│   └── mockExams.ts          # N5/N4 mock exams
└── types/                    # KanaItem, VocabularyWord, Attempt, etc
```

**`CLAUDE.md` at the repo root** carries the full structure.

---

## Standard workflow

1. **Clone / pick up a task**
   ```bash
   pnpm install
   pnpm --filter @workspace/koto run dev  # port 5173
   ```

2. **Read the context**
   - Read `CLAUDE.md` (hard constraints)
   - Read `AGENT_REFERENCE.md` (specific tasks)
   - Open the app preview in a browser

3. **Implement**
   - Edit the code as instructed
   - Follow the conventions (see AGENT_REFERENCE.md)
   - Go through the progress services for localStorage

4. **Validate**
   ```bash
   ./.claude/skills/validate-koto-build.sh  # build + types + files
   pnpm --filter @workspace/koto run build  # full build
   ```

5. **Commit + push**
   ```bash
   git add artifacts/koto/
   git commit -m "Feature: short description"
   git push origin main
   ```

6. **Optional audit** (large PRs)
   ```bash
   ./.claude/skills/full-audit.sh draft  # local checks
   ```

---

## Most common tasks

| Task | Files | Command |
|------|-------|---------|
| Add a word | `data/vocabulary.ts` | `pnpm run dev` → try it at `/vocabulario/treinar` |
| Add a question | `data/mockExams.ts` | `pnpm run dev` → try it at `/simulados` |
| New training mode | `components/kana/modes/` | create the file + register it in `index.ts` |
| Adjust the criteria | `services/progress/progress.local.ts` | check getWeakKana, getMasteredKana |
| Add a page | `pages/SomePage.tsx` → `App.tsx` | add the route + the nav entry |

See `AGENT_REFERENCE.md` for the details.

---

## Validation before committing

```bash
# 1. The build passes with no TS errors
pnpm --filter @workspace/koto run build

# 2. The dev server runs
pnpm --filter @workspace/koto run dev

# 3. Try the feature in the browser (http://localhost:5173)

# 4. Validate with the script
./.claude/skills/validate-koto-build.sh
```

---

## SEO and AdSense

- **Meta tags:** `updatePageSEO(title, description)` on every page
- **AdPlaceholder:** use with care (see CLAUDE.md, section "AdSense rules")
- **External audits:** see `EXTERNAL_SKILLS.md` (Claude SEO, AdSense Auditor)

---

## Quick references

- **CLAUDE.md** — everything about the project (stack, rules, routes, types)
- **AGENT_REFERENCE.md** — tasks with exact steps
- **EXTERNAL_SKILLS.md** — Claude SEO + AdSense Auditor
- **settings.json** — project config
- **docs/** — TODO_CLERK_AUTH.md, TODO_CLOUDFLARE_D1.md, TODO_TRACING.md, etc

---

## Contact / help

Read AGENT_REFERENCE.md for a specific task.  
Read CLAUDE.md for the hard constraints and conventions.  
Run `./.claude/skills/validate-koto-build.sh` before committing.
