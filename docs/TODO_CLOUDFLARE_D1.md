# TODO — Backend: Cloudflare D1

**Status:** implemented (Workers API + D1) — the only things left were creating the real remote
database (`wrangler d1 create`) and setting `CLERK_SECRET_KEY` in production. The app keeps working
entirely on localStorage while the user is not signed in.

---

## What lives in localStorage today

| Key | Content |
|-----|---------|
| `koto:kana_progress` | kana attempts, per character |
| `koto:vocab_progress` | vocabulary attempts (aggregate) |
| `koto:word_progress` | per-word progress |
| `koto:exam_attempts` | completed mock exams |
| `koto:sessions` | study sessions |

All of this data is local to the device and to the browser.
Clearing the browser's data wipes the progress.

---

## What moves to D1

| Table | Purpose |
|-------|---------|
| `users` | basic profile + FK to the Clerk userId |
| `kana_attempts` | per-user kana attempt history (includes mode/group/skipped) |
| `vocabulary_attempts` | per-word attempt history |
| `word_progress` | consolidated per-word progress |
| `exam_attempts` | mock exams taken |
| `exam_answers` | answers per question, per mock exam |
| `study_sessions` | study sessions |
| `user_preferences` | user preferences (JSON) |

The full schema is in `cloudflare/schema.sql` (migrations: `cloudflare/migrations/`)

---

## Migration strategy

### Phase 0 (the starting point)
- The user visits without an account.
- All progress stays in `localStorage`.
- No data leaves the device.

### Phase 1 — sign in with Clerk
- The user creates an account through Clerk.
- The app notices there is local data.
- It asks: _"Você tem progresso local. Deseja sincronizar com sua conta?"_ (you have local
  progress — sync it to your account?)
- If yes:
  - `POST /api/progress/sync` — sends the full localStorage payload
  - The API writes it to D1 against the `clerk_id`
- If no: localStorage and the account stay separate

### Phase 2 — continuous sync
- After login, every attempt is written to localStorage AND sent to the API.
- While offline, queue in `IndexedDB` and sync once the connection is back.
- `GET /api/progress` on app load, to reconcile state.

### Phase 3 — multi-device
- Progress available on any device through the Clerk account.
- localStorage becomes a local cache; D1 is the source of truth.

---

## Planned endpoints

```
POST   /api/progress/sync         — sync local progress
GET    /api/progress              — read the user's progress
POST   /api/kana/attempt          — record a kana attempt
POST   /api/vocab/attempt         — record a vocabulary attempt
POST   /api/exam/attempt          — save a mock-exam result
GET    /api/user/preferences      — read the preferences
PUT    /api/user/preferences      — save the preferences
DELETE /api/progress/reset        — reset the progress
```

---

## Setup

1. ✅ Database created: `npx wrangler d1 create koto_by_pingo` → ID `5a9c4ef0-dc81-4720-96aa-ec883cb34461`
2. ✅ Migrations applied: `npx wrangler d1 migrations apply koto_by_pingo --remote`
3. ✅ `wrangler.toml` updated with the real `database_id`
4. ✅ `CLERK_SECRET_KEY` set through `wrangler secret put CLERK_SECRET_KEY`
5. ✅ Worker deployed: `https://koto-by-pingo.lucas-hdo.workers.dev`
6. ✅ `VITE_API_BASE_URL` set in `artifacts/koto/.env.local`

---

## Status

| Step | Status |
|------|--------|
| SQL schema | ✅ `cloudflare/schema.sql` |
| Migrations | ✅ applied to the remote database (9 tables) |
| Workers API | ✅ `cloudflare/api/` — every endpoint authenticated through `@clerk/backend` |
| `progress.remote.ts` | ✅ `syncProgressToRemote()` / `fetchProgressFromRemote()` |
| Post-login sync banner | ✅ `SyncProgressBanner` on the dashboard |
| Real remote D1 database | ✅ `koto_by_pingo` — ID `5a9c4ef0-dc81-4720-96aa-ec883cb34461` |
| `CLERK_SECRET_KEY` in production | ✅ set through `wrangler secret put` |
| Worker deployed | ✅ `https://koto-by-pingo.lucas-hdo.workers.dev` |
| Automatic sync (phase 2) | not implemented — today's sync is on demand (phase 1) |
| Offline queue (phase 2) | not implemented |
