# 🎯 Agent Reference — Koto by Pingo

Quick guide to the most common tasks. Use it as a checklist.

The app's own interface is pt-BR, so UI labels and learning content quoted below stay in
Portuguese on purpose — they are product text, not prose.

---

## 1️⃣ Add a word to the vocabulary

**Goal:** add a new N5 word to the vocabulary.

**Files:**
- `artifacts/koto/src/data/vocabulary.ts`
- `artifacts/koto/src/types/vocabulary.ts` (only if a new field is needed)

**Steps:**
1. Edit `vocabulary.ts` → append an object to the list:
   ```ts
   {
     id: 'v-046',
     japanese: '猫',
     kana: 'ねこ',
     romaji: 'neko',
     meaningPt: 'gato',
     category: 'animais',
     level: 'N5',
   }
   ```
2. The category is picked up automatically through a `Set` — no need to update `categories`
3. Start the dev server: `pnpm --filter @workspace/koto run dev`
4. Try it at `/vocabulario/treinar` — the word must show up in all 4 modes
5. Validate: `pnpm --filter @workspace/koto run build`
6. Commit: `git add artifacts/koto/src/data/vocabulary.ts && git commit -m "Add vocabulary: 猫 (neko)"`

**Checklist:**
- [ ] The word carries all 7 fields (id, japanese, kana, romaji, meaningPt, category, level)
- [ ] `id` is unique and follows the `v-NNN` pattern
- [ ] The category is one of the existing ones (`animais`, `alimentos`, `escola`, `trabalho`, …)
- [ ] The build passes
- [ ] Tried on the dev server

---

## 2️⃣ Add a question to a mock exam

**Goal:** add a multiple-choice question to a mock exam (N5 Mini or N4 Mini).

**Files:**
- `artifacts/koto/src/data/mockExams.ts`

**Steps:**
1. Edit `mockExams.ts` → append the question to the matching exam. The question content is
   product text and is authored in pt-BR:
   ```ts
   {
     id: 'n5-q-35',
     type: 'vocabulary',
     prompt: 'A frase abaixo significa?',
     japaneseText: '毎日、学校に行きます。',
     options: [
       { id: 'a', text: 'Vou à escola todo dia' },
       { id: 'b', text: 'Vou à escola uma vez por semana' },
       { id: 'c', text: 'Fico na escola todo dia' },
       { id: 'd', text: 'Deixo a escola todo dia' },
     ],
     correctOptionId: 'a',
     explanation: '毎日 = todo dia, 学校 = escola, に = para, 行く = ir',
     tags: ['n5', 'verbs'],
     difficulty: 2,
   }
   ```
2. Check the shape: unique id, 4 options, a valid `correctOptionId`, a clear explanation
3. Run: `pnpm --filter @workspace/koto run dev`
4. Try it at `/simulados/{examId}` — the question must appear in the right position
5. Build: `pnpm --filter @workspace/koto run build`
6. Commit: `git add artifacts/koto/src/data/mockExams.ts && git commit -m "Add exam question: n5-q-35"`

**Checklist:**
- [ ] The question is complete (id, type, prompt, japaneseText, options[4], correctOptionId, explanation, tags, difficulty)
- [ ] `id` is unique and follows the `n5-q-NN` or `n4-q-NN` pattern
- [ ] 4 options with meaningful text (no throwaway distractors)
- [ ] The correct answer is actually in `options` (check `correctOptionId`)
- [ ] The explanation is written in clear pt-BR, like the rest of the learning content
- [ ] Tried on the dev server
- [ ] The build passes

---

## 3️⃣ Change the kana mastery criteria

**Goal:** adjust the mastered / troublesome / never-seen thresholds for kana.

**Current criteria:**
| Status | Attempts | Accuracy |
|--------|----------|----------|
| Mastered | ≥ 5 | ≥ 85% |
| Troublesome | ≥ 3 | < 60% |
| Never seen | 0 | — |

**Files:**
- `artifacts/koto/src/services/progress/progress.local.ts` (`getWeakKana`, `getMasteredKana`)
- Check the result on `artifacts/koto/src/pages/KanaStatsPage.tsx`

**Steps:**
1. Edit `progress.local.ts`:
   ```ts
   // Example: require ≥ 5 attempts AND ≥ 90% for "mastered"
   export function getMasteredKana(kanaIds: string[]) {
     return kanaIds.filter(id => {
       const stats = getKanaCharacterStats(id);
       return stats.attempts >= 5 && stats.accuracy >= 0.90;  // ← CHANGED from 0.85 to 0.90
     });
   }
   ```
2. Check `/kana/estatisticas` — the mastered counter must move
3. Build + commit

**Checklist:**
- [ ] The function was edited correctly
- [ ] The comparison reads right (>= or <, not inverted)
- [ ] Checked on the stats page
- [ ] The build passes

---

## 4️⃣ New kana training mode

**Goal:** implement a new kana training mode (e.g. Reverse Flashcards).

**Files:**
- Create: `artifacts/koto/src/components/kana/modes/ReverseFlashcardsMode.tsx`
- Edit: `artifacts/koto/src/components/kana/modes/index.ts` (register the component)
- Edit: `artifacts/koto/src/types/kana.ts` (add `'reverse_flashcards'` to `KanaTrainingMode`)

**Steps:**
1. Create the component in `modes/ReverseFlashcardsMode.tsx`:
   ```tsx
   export interface ReverseFlashcardsModeProp {
     items: KanaItem[];
     showRomajiHint?: boolean;
   }
   
   export function ReverseFlashcardsMode({ items, showRomajiHint }: ReverseFlashcardsModeProp) {
     const trainer = useKanaQueue(items);
     // ... implementation
     return <div>...</div>;
   }
   ```
2. Register it in `components/kana/modes/index.ts`:
   ```ts
   import { ReverseFlashcardsMode } from './ReverseFlashcardsMode';
   
   export const KANA_MODE_COMPONENTS: Record<KanaTrainingMode, React.ComponentType<any>> = {
     // ... the existing ones
     reverse_flashcards: ReverseFlashcardsMode,  // ← ADD
   };
   ```
3. Add it to `KanaTrainingMode` in `types/kana.ts`:
   ```ts
   type KanaTrainingMode =
     | 'typing'
     | 'flashcards'
     | 'multiple_choice'
     | 'matching_pairs'
     | 'listening'
     | 'word_builder'
     | 'tracing'
     | 'reverse_flashcards';  // ← ADD
   ```
4. Check `/kana/treinar` — the new mode must appear in the selector
5. Build + commit

**Checklist:**
- [ ] The component takes `KanaItem[]` + `showRomajiHint?`
- [ ] It uses `useKanaQueue(items)` internally
- [ ] Registered in `KANA_MODE_COMPONENTS`
- [ ] The type was added to `KanaTrainingMode`
- [ ] Tried on the dev server
- [ ] The build passes

---

## 5️⃣ Add a new page (e.g. AulasExtrasPage)

**Goal:** create the `/aulas` page with supplementary content.

**Files:**
- Create: `artifacts/koto/src/pages/AulasExtrasPage.tsx`
- Edit: `artifacts/koto/src/App.tsx` (add the route)
- Edit: `artifacts/koto/src/components/layout/DesktopSidebar.tsx` (nav link)
- Edit: `artifacts/koto/src/components/layout/MobileBottomNav.tsx` (nav link)

**Steps:**
1. Create the page. The visible copy is pt-BR, like every other page:
   ```tsx
   import { PageHeader } from '../components/ui/PageHeader';
   import { updatePageSEO } from '../utils/seo';
   
   export function AulasExtrasPage() {
     useEffect(() => {
       updatePageSEO('Aulas Extras', 'Material complementar de japonês');
     }, []);
   
     return (
       <>
         <PageHeader
           title="Aulas Extras"
           description="Material complementar"
           color="#ac2b2f"
         />
         <div className="max-w-6xl mx-auto px-4 py-6">
           {/* content */}
         </div>
       </>
     );
   }
   ```
2. Add the route in `App.tsx`:
   ```tsx
   <Route path="/aulas" component={AulasExtrasPage} />
   ```
3. Add the link in `DesktopSidebar.tsx` and `MobileBottomNav.tsx`:
   ```tsx
   <Link href="/aulas">Aulas Extras</Link>
   ```
4. Check navigation on the dev server
5. Build + commit

**Checklist:**
- [ ] The page uses `PageHeader` + `updatePageSEO`
- [ ] The route was added to `App.tsx`
- [ ] The links were added to the sidebar + mobile nav
- [ ] The main container uses `max-w-6xl mx-auto px-4 py-6`
- [ ] Tried on the dev server (desktop + mobile)
- [ ] The build passes

---

## 6️⃣ Validate the build and the types

**Goal:** make sure the code compiles and passes type checking.

**Steps:**
1. Run the build:
   ```bash
   pnpm --filter @workspace/koto run build
   ```
2. Run the validation script:
   ```bash
   ./.claude/skills/validate-koto-build.sh
   ```
3. On failure, fix it:
   - TS errors: an implicit type, a missing import, etc
   - File errors: a deleted file, a wrong path
4. Commit only once the build passes

**Checklist:**
- [ ] `pnpm run build` passes with no errors
- [ ] No implicit-`any` warnings
- [ ] `./.claude/skills/validate-koto-build.sh` passes
- [ ] No errors in the dev-server console

---

## 7️⃣ Reset a user's progress (admin)

**Goal:** clear localStorage to test from scratch.

**Files:**
- `artifacts/koto/src/pages/KanaStatsPage.tsx` (the `Resetar Progresso` button — "reset progress")
- `artifacts/koto/src/services/progress/progress.local.ts` (`resetKanaProgress`)

**Steps:**
1. Go to `/kana/estatisticas`
2. Click `Resetar Progresso` (red, at the bottom of the page)
3. Confirm in the modal
4. localStorage is cleared (`koto:kana_progress`, `koto:sessions`, etc)
5. The page reloads back at zero

**Note:** no code change is needed for this — the feature already exists.

**Checklist:**
- [ ] The reset button is visible on `/kana/estatisticas`
- [ ] The confirmation modal appears
- [ ] localStorage is cleared after confirming
- [ ] The page reloads with the stats zeroed

---

## 8️⃣ Place an AdSense slot

**Goal:** add `<AdPlaceholder>` somewhere allowed.

**Rules:**
- ✅ Before a session starts
- ✅ After a session ends
- ✅ Right sidebar (desktop) with ≥ 16px spacing
- ✅ Between editorial blocks
- ❌ Inside a flashcard, a question, or a matching pair
- ❌ Next to action buttons (`Verificar`, `Próximo`, … — check, next)

**Files:**
- `artifacts/koto/src/components/ui/AdPlaceholder.tsx` (the component)
- The page you are placing it on (e.g. `KanaLearnPage.tsx`)

**Steps:**
1. Import the component:
   ```tsx
   import { AdPlaceholder } from '../components/ui/AdPlaceholder';
   ```
2. Add it somewhere allowed (e.g. right after `PageHeader`):
   ```tsx
   <PageHeader ... />
   <AdPlaceholder />  {/* ← ADD here */}
   <div className="max-w-6xl mx-auto px-4 py-6">
     {/* content */}
   </div>
   ```
3. Check the dev server (the placeholder renders a grey rectangle)
4. Build + commit

**Checklist:**
- [ ] The position is allowed (before/after a session, or editorial)
- [ ] ≥ 16px spacing when in the sidebar
- [ ] Not inside a card, a question or an exercise
- [ ] The build passes

---

## 9️⃣ Sync with Cloudflare D1 (signed-in users)

**Goal:** push local progress to the backend once the user signs in.

**Note:** the feature already exists, through `SyncProgressBanner` on the dashboard.  
No code change is needed — only a check that Clerk + D1 are connected.

**Files:**
- `artifacts/koto/src/services/progress/progress.remote.ts` (sync logic)
- `artifacts/koto/src/pages/DashboardPage.tsx` (the sync banner)

**How to verify:**
1. Sign in with Clerk at `/entrar`
2. Go to `/progresso`
3. The `Sincronizar Progresso` banner ("sync progress") must appear
4. Click `Sincronizar` → the progress is pushed to D1

**Note:** this needs a real `CLERK_SECRET_KEY` and a real `wrangler d1 create` (see `docs/TODO_CLOUDFLARE_D1.md`).

**Checklist:**
- [ ] Clerk sign-in works
- [ ] The banner appears on `/progresso`
- [ ] Clicking sync raises no error
- [ ] (Production) The progress lands in D1

---

## 🔟 Run the validation scripts (audit)

**Goal:** validate the project before a large PR or a deploy.

**Steps:**
```bash
# Validate the build
./.claude/skills/validate-koto-build.sh

# Validate the content (kana, vocabulary, exams)
./.claude/skills/validate-learning-content.sh

# Full audit (draft/local checks)
./.claude/skills/full-audit.sh draft

# Live audit (only when ready to deploy)
./.claude/skills/full-audit.sh live
```

**Checklist:**
- [ ] `validate-koto-build.sh` passes (build + files)
- [ ] `validate-learning-content.sh` passes (vocabulary + kana + mock exams)
- [ ] `full-audit.sh draft` passes (local checks)
- [ ] For a large PR, run `full-audit.sh draft` before pushing

---

## 🔗 External skills

For deeper audits, see `EXTERNAL_SKILLS.md`:

- **Claude SEO:** check meta tags, canonical URLs, schema.org
- **AdSense Auditor:** check placement, revenue potential, compliance

Both are optional — reach for them on large PRs or before a deploy.

---

## ⚙️ Handy shortcuts

```bash
# Dev server
pnpm --filter @workspace/koto run dev          # port 5173

# Build
pnpm --filter @workspace/koto run build        # full build

# Preview
pnpm --filter @workspace/koto run preview      # local preview of the build

# Custom scripts
./.claude/skills/validate-koto-build.sh        # fast (2s)
./.claude/skills/validate-learning-content.sh  # medium (5s)
./.claude/skills/full-audit.sh draft          # full, local (30s)
```

---

## 📌 Before committing

```bash
# 1. The build passes
pnpm --filter @workspace/koto run build

# 2. The feature was tried on the dev server
pnpm --filter @workspace/koto run dev

# 3. Quick validation
./.claude/skills/validate-koto-build.sh

# 4. If OK → commit
git add artifacts/koto/
git commit -m "Feature/Fix: short description"
git push origin main
```

---

## 📚 References

- **CLAUDE.md** — full structure, hard constraints, conventions
- **INSTRUCTIONS.md** — onboarding (5 min)
- **EXTERNAL_SKILLS.md** — Claude SEO + AdSense Auditor
- **settings.json** — project config (build, permissions)
