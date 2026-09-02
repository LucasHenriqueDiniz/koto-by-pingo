# TODO — Gamification (streak, XP/level, achievements)

> **Status:** ❌ not implemented. The UI already exists as a **visual placeholder** (built during
> the 2026-06 design refactor). The numbers on screen (streak, XP, "Top 5%", achievements, weekly
> goals) are hard-coded mocks. This document describes what is missing to make them real.

The project rule still holds: **all persistent state goes through
`src/services/progress/progress.local.ts`** (prefix `koto:`). Do not add a parallel sync/auth
service — when there is a backend, extend `progress.remote.ts`.

---

## 1. Daily streak

**Where it shows (placeholder):** `src/pages/DashboardPage.tsx` (the `Ofensiva Atual` card —
"current streak" — showing `0`).

**To implement:**
- A type in `src/services/progress/progress.types.ts`:
  ```ts
  export interface StreakRecord {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string; // YYYY-MM-DD
  }
  ```
- A new localStorage key: `koto:streak`.
- A `recordDailyActivity()` function in `progress.local.ts`, called from within
  `recordKanaAttempt`, `recordWordAttempt` and on mock-exam completion:
  - if `lastActiveDate === today` → do nothing;
  - if `=== yesterday` → `currentStreak += 1`;
  - otherwise → `currentStreak = 1`;
  - update `longestStreak` and `lastActiveDate`.
- Expose `getStreak(): StreakRecord` and read it from the dashboard card.

---

## 2. XP / level

**Where it shows (placeholder):** `src/pages/DashboardPage.tsx` (the `Nível do Aprendizado` card —
"learning level" — with the XP bar and the `Top 5% este mês` badge, "top 5% this month").

**To implement:**
- A new key: `koto:xp` → `{ totalXp: number; level: number }`.
- An XP formula per action (suggestion): +10 for a correct answer, +2 for a wrong one, +50 for a
  completed mock exam.
- A level curve of progressive thresholds (e.g. level N requires `N * 150` accumulated XP).
- Award XP at the same points where progress is recorded (kana/vocab/exam).
- A `src/components/ui/LevelCard.tsx` component could be extracted from the current inline block.

**⚠️ The `Top 5% este mês` badge:** it compares users against each other, so it **requires
aggregated backend data** and sits outside the current local-first scope. It stays a fixed
placeholder by product decision. When implementing, either (a) hook it to a ranking endpoint on the
Worker/D1, or (b) swap it for a non-comparative metric (e.g. "your best week so far").

---

## 3. Achievements

**Where it shows (placeholder):** `src/pages/DashboardPage.tsx` (the `AchievementBadge` grid, all
`locked`) and `src/pages/KanaTrainPage.tsx` (the `Próxima recompensa` card — "next reward").
The component already exists: `src/components/ui/AchievementBadge.tsx`.

**To implement:**
- A catalogue in `src/data/achievements.ts`:
  ```ts
  export interface Achievement {
    id: string;
    label: string;
    description: string;
    icon: MaterialIconName;
    /** Evaluates the current progress and says whether this is unlocked. */
    isUnlocked: (ctx: AchievementContext) => boolean;
  }
  ```
- A new key: `koto:achievements` → `Record<achievementId, { unlockedAt: string }>`.
- Evaluate the conditions after each progress record; persist the unlocks.
- Example conditions: "master all of the basic hiragana", "a 7-day streak",
  "100% on a mock exam".

---

## 4. Weekly goals

**Where it shows (placeholder):** `src/pages/DashboardPage.tsx` (the `Metas Semanais` card —
"weekly goals" — with the bars at zero).

**To implement:** define the goals (new kana, study minutes, reviews) as configurable in
`src/services/settings/settings.local.ts` (`dailyGoalMinutes` already exists) and compute the
week's progress from `attempts[]` + the sessions.

---

## ✅ Already real (and not gamification)

- **Weekly activity** (`WeeklyActivityChart`): uses `getWeeklyActivity()` in `progress.local.ts`,
  aggregating real `attempts[].timestamp` values from kana + vocabulary.
- **Global / per-category accuracy**: `getKanaStats()`, `getKanaGroupStats()`, `getVocabStats()`.
