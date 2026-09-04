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

## Proving the sync round trip without a browser session

`api/auth.ts` carries a development-only bypass. It exists because the alternative was
signing in as the owner, and nothing in this repo should require that.

It fires only when all three of these hold, and any one failing falls through to real
Clerk verification — so an attempt against the deployed Worker is indistinguishable from
a request with no credentials at all:

1. `ENVIRONMENT` is exactly `development`. An allowlist, not `!== 'production'`: that
   form would open the bypass on any Worker whose vars failed to load. `wrangler.toml`
   commits `ENVIRONMENT = "production"` in `[vars]`, so the deployed Worker is closed.
2. `TEST_BYPASS_SECRET` is set. Only ever in `.dev.vars`, which is gitignored. **Never
   `wrangler secret put`** — a deploy must not be able to carry it.
3. The request presents that exact secret in `X-Test-Bypass`.

To use it:

```bash
# cloudflare/.dev.vars — gitignored, never committed
ENVIRONMENT = "development"
TEST_BYPASS_SECRET = "<openssl rand -hex 24>"
CLERK_SECRET_KEY = "sk_test_unused_by_the_bypass"
```

```bash
op run --env-file=<your cloudflare env file> -- \
  npx wrangler dev --remote --config cloudflare/wrangler.toml --port 8799

curl -X POST http://127.0.0.1:8799/api/progress/sync \
  -H "X-Test-Bypass: $SECRET" -H 'Content-Type: application/json' \
  -d '{"kana":[{"kanaId":"a","correct":true}]}'
```

`--remote` is the point: the local Worker writes to the real `koto_by_pingo` D1, which is
what makes this evidence rather than a simulation.

### The row it leaves behind

The bypass runs as `test-bypass-user`, a fixed and obviously-fake id. It is the only row
in `users` — the database held none before 2026-09-03. It is deliberately **not** deleted,
because `docs/plans/api-sync/slice-01-round-trip.md` proves itself with a live query that
counts it. When real users arrive and it is in the way:

```bash
npx wrangler d1 execute koto_by_pingo --remote --config cloudflare/wrangler.toml \
  --command "DELETE FROM users WHERE id = 'test-bypass-user'"
```

The dependent rows go with it where the schema cascades; check before assuming they do.
