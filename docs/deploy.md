# Deploy

Two Cloudflare projects come out of this one repository, and they are wired
differently. Both deploy on a push to `main`; neither needs a secret in CI.

| | project | source | output |
| --- | --- | --- | --- |
| Site | Pages `koto-by-pingo` | repo root, `pnpm run build` | `artifacts/koto/dist/public` |
| API | Worker `koto-by-pingo` | root directory `cloudflare/`, `npx wrangler deploy` | the Worker itself |

Same name, different products. The Pages project serves
`koto-by-pingo.pages.dev`; the Worker answers on
`koto-by-pingo.lucas-hdo.workers.dev`.

## Why the wrangler config is not at the repo root

`cloudflare/wrangler.toml`, not `./wrangler.toml`. The Pages build runs from the
root, and a root config carrying `main` gets read by the Pages builder as its
own — which is how a sibling project's deploy broke. Keeping it one level down
means each builder only ever sees the config meant for it.

`.gitignore` still ignores `wrangler.toml` generally, with an exception for this
one path. The blanket rule sat under a "Environment secrets" heading, which was
the confusion: a wrangler config holds bindings and ids. Secrets go through
`wrangler secret put` and never touch a file.

## The API is cross-origin, and that is a configuration, not an accident

The app fetches `${VITE_API_BASE_URL}/api/...`. That variable is set on the
**Pages project**, not in a file, because Vite inlines it at build time — so
changing it requires a rebuild, not just a redeploy.

Leaving it empty is the failure worth knowing about. The request then goes to the
app's own origin, where the SPA catch-all answers `200 text/html` for any path it
does not recognise. `response.ok` is true, every status check passes, and the
only symptom is `Unexpected token '<'` out of `response.json()`. `authedFetch`
checks the content type for exactly this reason and names the cause instead.

## The site needs two build variables, and one of them is load-bearing

Both live on the **Pages project**, not in a file, because Vite inlines
`import.meta.env.VITE_*` at build time — so changing either requires a rebuild,
not a redeploy of the same artefact.

| variable | value | what breaks without it |
| --- | --- | --- |
| `VITE_CLERK_PUBLISHABLE_KEY` | `pk_test_…` for the Clerk instance | **the whole site** |
| `VITE_API_BASE_URL` | the Worker's URL | progress sync only |

The first one is not a graceful degradation. `src/main.tsx` throws
`Missing VITE_CLERK_PUBLISHABLE_KEY` at module load, *before*
`createRoot().render()`, so the bundle evaluates, throws, and `#root` stays
empty. The page returns HTTP 200 with a title and no content — nothing in the
response says the app failed, and the only signal is in the browser console.

That is not hypothetical. This variable was never set on the Pages project, and
the check has been in `main.tsx` since 2026-06-12. Every deployment between then
and 2026-09-02 published a blank page. It was found by opening the site, not by
any check: 14 deployments across three bundle hashes all carried the throw, and
none contained a `pk_` key — which is how we know the variable was absent rather
than removed, since Vite would have inlined it into the bundle of any build that
had it.

The Clerk key is *publishable*: it ships in client JavaScript by design and is
not a secret. The secret half, `CLERK_SECRET_KEY`, is on the Worker and never in
a file.

## Bindings and secrets

`DB` binds the `koto_by_pingo` D1 database, declared in the config with its id.
Both migrations are already recorded in `d1_migrations`; the nine tables exist.

`CLERK_SECRET_KEY` is a secret on the Worker, set through the dashboard or
`wrangler secret put`. Without it `verifyToken` throws, `requireUserId` returns
null, and every authenticated route answers 401 — indistinguishable from a
missing Authorization header, so check the secret before debugging the client.
