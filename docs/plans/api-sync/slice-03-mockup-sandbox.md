---
status: done
kanban: 3dfdb11f-580e-4b20-b0f9-54e12477976c
---

# Slice 3 — Publish the mockup sandbox, or say why not

`artifacts/mockup-sandbox` is a second Vite app with its own build, touched 28
hours ago, and published nowhere. Cloudflare Pages serves only
`artifacts/koto`.

**Delivers** — either a second Pages project, or a line in `docs/deploy.md`
saying the sandbox is local-only and why.

**Needs** — a decision about whether its contents should be publicly reachable.
It is a design sandbox; that is a reason to keep it private, not a reason to
leave the question open.

**Tests**
- if published: the new project builds from `artifacts/mockup-sandbox` and its
  URL loads
- if not: CI still typechecks it, so it cannot rot unnoticed

**Done when**

```
grep -c 'mockup-sandbox' docs/deploy.md
```

is 1 or more — the file names every deployable in the repo, including the ones
deliberately not deployed.

**If stuck** — publishing costs nothing but a project; the real question is
whether the sandbox contains anything not meant to be seen. Check that before
deciding, not after.

## Outcome — not published, written down

`docs/deploy.md` names it in the deployables table as **none — deliberately**, plus a section
saying why. The gate reads 3.

Checked before deciding, in the order this slice asked for: 70 files, a gallery of shadcn/ui
components, **no API call anywhere in `src/`**, no key, no secret, nothing reading or writing real
data. So "is there anything not meant to be seen" answers cleanly — there is not.

It stays local anyway, because publishing buys nothing here. Nothing links to a component gallery,
so it would earn no visitors, and it would add a second Pages project to watch, a public URL of
unfinished design, and a deploy that can break unnoticed. The owner's stated constraint is having
less to maintain, not more hosting.

The condition this slice set for *not* publishing holds: `pnpm run typecheck` covers
`./artifacts/**`, so CI typechecks the sandbox on every run exactly as it does the site.
