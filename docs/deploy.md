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

## Bindings and secrets

`DB` binds the `koto_by_pingo` D1 database, declared in the config with its id.
Both migrations are already recorded in `d1_migrations`; the nine tables exist.

`CLERK_SECRET_KEY` is a secret on the Worker, set through the dashboard or
`wrangler secret put`. Without it `verifyToken` throws, `requireUserId` returns
null, and every authenticated route answers 401 — indistinguishable from a
missing Authorization header, so check the secret before debugging the client.
