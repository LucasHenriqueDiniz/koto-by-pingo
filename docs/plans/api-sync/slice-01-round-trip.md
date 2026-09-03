---
status: blocked
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
