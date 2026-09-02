# Cloudflare D1 + Workers API — Koto by Pingo

An optional backend that syncs progress (kana, vocabulary, mock exams) to the user's Clerk account,
on Cloudflare D1 (SQLite) + Workers.

## Setup

1. Copy `wrangler.example.toml` (repo root) to `wrangler.toml` (not versioned)
2. Create the database on Cloudflare:
   ```bash
   npx wrangler d1 create koto_by_pingo
   ```
3. Replace `database_id` in `wrangler.toml` with the generated ID
4. Apply the migrations:
   ```bash
   npx wrangler d1 migrations apply koto_by_pingo
   # or --local for development
   ```
5. Set the Clerk secret (needed to validate the session tokens):
   ```bash
   npx wrangler secret put CLERK_SECRET_KEY
   ```

## Structure

- `schema.sql` — the complete database schema (reference)
- `migrations/0001_initial.sql` — initial schema (users, sessions, attempts, exams)
- `migrations/0002_word_progress_and_preferences.sql` — per-word progress, kana attempt
  metadata (mode/group/skipped) and user preferences
- `api/index.ts` — the Worker entrypoint (router)
- `api/auth.ts` — Clerk token validation (`@clerk/backend`) and the user upsert
- `api/handlers/` — handlers for progress, kana, vocabulary, mock exams and preferences

## Endpoints

All of them require `Authorization: Bearer <Clerk token>`.

```
POST   /api/progress/sync         — syncs local progress (one-shot, right after login)
GET    /api/progress              — reads the progress stored on the account
DELETE /api/progress/reset         — resets the account's progress
POST   /api/kana/attempt          — records one kana attempt
POST   /api/vocab/attempt         — records one vocabulary attempt
POST   /api/exam/attempt          — saves a mock-exam result
GET    /api/user/preferences      — reads the user's preferences
PUT    /api/user/preferences      — saves the user's preferences
```

Note that the error bodies these endpoints return are pt-BR strings, because they surface in the
app's own interface.

## Local development

```bash
npx wrangler dev --config ../wrangler.toml --local
```

## How the app uses it

- `src/services/auth/auth.clerk.ts` — `useCurrentUser()` / `useSignOut()` (Clerk)
- `src/services/progress/progress.remote.ts` — `syncProgressToRemote()` / `fetchProgressFromRemote()`
- `src/components/ui/SyncProgressBanner.tsx` — the post-login banner on the dashboard that offers
  to sync local progress to the account
- The API base URL is configurable through `VITE_API_BASE_URL` (empty = same origin)
