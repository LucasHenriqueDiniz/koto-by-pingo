import { verifyToken } from '@clerk/backend';
import type { Env } from './types';

/**
 * The identity a bypassed request runs as. A fixed, obviously-fake id rather than a
 * real user's: the row it creates in `users` is meant to be recognisable as a test
 * artefact and deletable with one statement.
 */
export const TEST_BYPASS_USER_ID = 'test-bypass-user';

/**
 * A development-only identity, so the sync round trip can be proven without a
 * browser session. It exists because the alternative was signing in as the owner,
 * and nothing here should ever require that.
 *
 * Three conditions, all independent, all required:
 *
 * 1. `ENVIRONMENT` is exactly `development`. This is an allowlist and not a
 *    denylist on purpose — `!== 'production'` would open the bypass on any Worker
 *    whose vars failed to load, which is the one moment you least want it open.
 *    The deployed Worker sets `production` in `[vars]`, in the repo, in git.
 * 2. `TEST_BYPASS_SECRET` is present. It is only ever set in `.dev.vars`, which is
 *    gitignored. It is never a `wrangler secret`, so a deploy cannot carry it.
 * 3. The request presents that exact secret in `X-Test-Bypass`, compared in
 *    constant time.
 *
 * Any one of the three failing falls through to real Clerk verification, so a
 * bypass attempt against production is indistinguishable from a request with no
 * credentials at all: 401.
 */
function testBypassUserId(request: Request, env: Env): string | null {
  if (env.ENVIRONMENT !== 'development') return null;

  const expected = env.TEST_BYPASS_SECRET;
  if (!expected) return null;

  const offered = request.headers.get('X-Test-Bypass');
  if (!offered || !constantTimeEquals(offered, expected)) return null;

  return TEST_BYPASS_USER_ID;
}

/**
 * Length is compared first and returns early, which does leak the secret's length.
 * That is deliberate: the secret lives in a gitignored file on one laptop and gates
 * a local dev session, so a padded comparison would buy nothing and read as though
 * this were protecting something remote.
 */
function constantTimeEquals(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let diff = 0;
  for (let i = 0; i < a.length; i++) {
    diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return diff === 0;
}

/** Returns the clerk_id (sub) from the session token, or null when absent/invalid. */
export async function requireUserId(request: Request, env: Env): Promise<string | null> {
  const bypassed = testBypassUserId(request, env);
  if (bypassed) return bypassed;

  const authHeader = request.headers.get('Authorization');
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice('Bearer '.length);

  try {
    const payload = await verifyToken(token, { secretKey: env.CLERK_SECRET_KEY });
    return payload.sub ?? null;
  } catch {
    return null;
  }
}

/** Ensures a row exists in `users` and `user_progress_summary` for this clerk_id. */
export async function ensureUser(db: D1Database, userId: string, displayName?: string, email?: string): Promise<void> {
  const now = new Date().toISOString();
  const existing = await db.prepare('SELECT id FROM users WHERE id = ?').bind(userId).first();

  if (existing) {
    if (displayName || email) {
      await db
        .prepare('UPDATE users SET display_name = COALESCE(?, display_name), email = COALESCE(?, email), updated_at = ? WHERE id = ?')
        .bind(displayName ?? null, email ?? null, now, userId)
        .run();
    }
    return;
  }

  await db
    .prepare('INSERT INTO users (id, clerk_id, display_name, email, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?)')
    .bind(userId, userId, displayName ?? 'Usuário', email ?? null, now, now)
    .run();

  await db.prepare('INSERT INTO user_progress_summary (user_id, updated_at) VALUES (?, ?)').bind(userId, now).run();
}
