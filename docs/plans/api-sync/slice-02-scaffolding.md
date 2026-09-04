---
status: done
kanban: 29989fe3-d5e8-4bed-9a38-221fc814fcf3
---

# Slice 2 — Decide what happens to the backend that lost

Two backends exist for one app. `cloudflare/api` has 522 lines and the seven
routes the app calls; `artifacts/api-server` has 98 lines and a single
`/health`. The second was never wired to anything and has one commit, from
three months ago.

**Delivers** — one backend in the tree instead of two, or a written reason why
both stay.

**Needs** — nothing. This is a decision, not a dependency.

The four library packages hang off the loser: `lib/api-zod` and `lib/db` are
imported only by `artifacts/api-server`, and `lib/api-spec` and
`lib/api-client-react` are imported by nothing at all. Deleting the server
without them leaves four orphans; keeping them without it leaves four packages
the workspace compiles for no reason.

**Tests**
- `pnpm run build` still passes with whatever is removed
- the Worker still deploys: its config lives in `cloudflare/`, untouched by this

**Done when**

```
pnpm -r list --depth -1 | grep -c '@workspace/'
```

reports the number this decision settles on, and `pnpm run typecheck` exits 0.
It reports 10 today.

**If stuck** — if the intent is to finish `api-server` rather than delete it,
this slice becomes "say so in `docs/deploy.md`" and stops there. Deleting is not
the only resolution; leaving it undecided is.

## Outcome — one backend, and four packages that described a server nobody built

The workspace went from **9 `@workspace/` packages to 4**: `koto`, `cloudflare-api`,
`mockup-sandbox`, `scripts`. 31 files deleted.

The owner asked for a review before the delete — *"se for algo bom podemos adaptar"* — so this
records what was actually in there, since "we looked" is worth nothing without what was found.

**`artifacts/api-server`** is an **Express** app: `express.json()`, `cors()`, `pino-http`, one
`/health` route, last touched by its own "Initial commit" on 2026-05-28. Nothing in it is portable —
Express middleware does not run on a Worker, which is the runtime that actually serves this app.

**The three generated packages all describe a server that was never built.** `lib/api-spec` holds a
36-line `openapi.yaml` with exactly one path, `/healthz`. `lib/api-zod` and `lib/api-client-react`
are orval output from that file, so 524 of their 559 lines are generated boilerplate for a health
check. The Worker's seven real routes — `/api/progress`, `/api/progress/sync`,
`/api/progress/reset`, `/api/kana/attempt`, `/api/vocab/attempt`, `/api/exam/attempt`,
`/api/user/preferences` — appear in none of it.

**`lib/db`** is an empty scaffold: its `schema/index.ts` is entirely commented-out template
instructions, and the example it gives is `pgTable` from `drizzle-orm/pg-core`. This project's
database is D1, which is SQLite. Wrong dialect, zero content.

### The one thing worth carrying forward is an idea, not a file

The shape those packages gestured at — one OpenAPI spec generating a Zod validator for the server
and a typed client for the app — is good, and this repo has neither half. **The Worker validates
nothing**: `cloudflare/api/index.ts:35` does `body as SyncPayload` and line 52 does
`body as KanaAttemptInput`, which are TypeScript casts erased at runtime. Whatever a client posts is
trusted. `zod` is not a dependency. That is filed separately rather than smuggled into a deletion.

### Plumbing the delete exposed

`typecheck` failed afterwards with `TS5083: Cannot read file '.../lib/api-zod/tsconfig.json'`. The
root `tsconfig.json` held project references to exactly the three deleted libs and nothing else, so
`typecheck:libs` existed solely to build them. The script is gone, the CI step with it, and the
`references` array is empty with a note saying why — `tsc --build` on an empty array succeeds
without compiling anything, so a script wrapping it would report success for work it never did.

`pnpm run typecheck` and `pnpm run build` both exit 0 across the four remaining packages.
