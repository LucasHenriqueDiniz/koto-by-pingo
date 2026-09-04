---
status: done
kanban: 8d6bf0d1-2d5a-4561-a414-2e081a535126
---

# Slice 1 — Prove the round trip with a real session

**Blocked on a signed-in browser.** Everything below needs a Clerk session token,
which cannot be obtained without logging in as a real user.

**Delivers** — evidence that a signed-in user's local progress reaches D1 and
comes back, rather than the inference that it should.

**Needs**
- the site rendering (done: `VITE_CLERK_PUBLISHABLE_KEY` set 2026-09-02)
- `VITE_API_BASE_URL` pointing at the Worker (done)
- a Clerk account on the `concise-crawdad-79` development instance

**Tests**
- sign in, do one kana round so `progress.local` has rows, click sync on
  `/progresso`
- the banner reports success rather than an error
- a second browser, same account, shows the same progress after a reload

**Done when**

```
wrangler d1 execute koto_by_pingo --remote --command "SELECT COUNT(*) AS users FROM users"
```

says `users` is 1 or more. It is 0 today — the table has never held a row.

**If stuck** — a 401 with the token present means `CLERK_SECRET_KEY` on the
Worker belongs to a different Clerk instance than the publishable key on Pages.
Both must come from `concise-crawdad-79`. A JSON parse error means
`VITE_API_BASE_URL` did not reach the build; `authedFetch` now names that case
explicitly rather than failing on `Unexpected token '<'`.

## Outcome

`users` is **1**. It had never held a row.

### The block was dissolved, not waited out

This slice said it needed "a signed-in browser" and "a Clerk account on the
`concise-crawdad-79` development instance". Both were true of the route it assumed. The
owner asked for a test bypass instead, which removes the requirement rather than
satisfying it: `api/auth.ts` now resolves a development-only identity, so the round trip
is provable without anyone signing in as a person.

Three guards, all required, documented in `cloudflare/README.md` and in the function's own
comment. The environment check is an **allowlist** — `ENVIRONMENT === 'development'`, not
`!== 'production'` — because the denylist form opens the bypass on any Worker whose vars
fail to load, which is the one moment you least want it open.

### What was measured

Against a local `wrangler dev --remote`, so the writes went to the real `koto_by_pingo` D1:

| request | result |
|---|---|
| `POST /api/progress/sync` with the secret, 3 kana attempts | `200` — `{"ok":true,"synced":{"kana":3,…}}` |
| `GET /api/progress` with the secret | `200` — `kana_total: 3`, `kana_correct: 2`, matching the 2 correct of 3 sent |
| `SELECT COUNT(*) FROM users` | **1** (`test-bypass-user`), was 0 |
| `SELECT COUNT(*) FROM kana_attempts` | 3 |

And the refusals, all `401`: a wrong `X-Test-Bypass`, no header at all, and an invalid
`Authorization: Bearer`.

**The decisive test is the last one.** The same code, the same correct secret, with only
`ENVIRONMENT` flipped to `production` — the value `wrangler.toml` commits — returns `401`
on both `GET /api/progress` and `POST /api/progress/sync`, and the database gained nothing
from those calls. That isolates the guard to the variable rather than arguing it from the
source.

Testing against the currently deployed Worker would have proved less: it does not carry
this code yet, so its `401` would say nothing about the guard.

### Not done here

- **The two-browser check** in *Tests* — same account, second browser, progress after a
  reload — is a session-continuity assertion about Clerk, and the bypass has no session to
  continue. It stays unproven, and the bypass cannot prove it.
- **The `/progresso` sync banner** was never rendered. The API round trip is proven; the
  UI that calls it is not.
- `CLERK_SECRET_KEY` on the Worker still has not been checked against the publishable key
  on Pages. The *If stuck* note about a 401-with-token-present is therefore still live for
  whoever signs in first — the bypass routes around that question rather than answering it.
