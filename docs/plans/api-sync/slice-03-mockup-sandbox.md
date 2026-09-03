---
status: todo
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
