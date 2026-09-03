---
status: todo
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
