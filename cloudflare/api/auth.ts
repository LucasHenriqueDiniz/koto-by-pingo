import { verifyToken } from '@clerk/backend';
import type { Env } from './types';

/** Retorna o clerk_id (sub) do token de sessão, ou null se ausente/inválido. */
export async function requireUserId(request: Request, env: Env): Promise<string | null> {
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

/** Garante que existe uma linha em `users` e `user_progress_summary` para este clerk_id. */
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
