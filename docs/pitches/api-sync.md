---
status: active
epic: koto-api
---

# Progress sync between the app and the Worker

The Worker at `koto-by-pingo.lucas-hdo.workers.dev` has served seven routes
against a migrated D1 since 18 June 2026, and nothing has ever called it in
production. Not because the client is missing — `SyncProgressBanner` renders on
the dashboard and calls `syncProgressToRemote` — but because the app itself
never mounted: `VITE_CLERK_PUBLISHABLE_KEY` was absent, `main.tsx` threw before
`createRoot().render()`, and every deployment published a blank page.

Both variables are set now and the site renders. What remains is proving the
round trip works with a real session, and deciding what to do with the
scaffolding that lost the race to `cloudflare/api`.

See `docs/deploy.md` for the topology and which variable is fatal.
