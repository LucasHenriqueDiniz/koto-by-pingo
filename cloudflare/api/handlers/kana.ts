import type { Env, KanaAttemptInput } from '../types';
import { jsonResponse } from '../cors';
import { generateId } from '../id';

export async function recordKanaAttempt(env: Env, userId: string, origin: string | null, body: KanaAttemptInput): Promise<Response> {
  if (!body?.kanaId || typeof body.correct !== 'boolean') {
    return jsonResponse({ error: 'kanaId e correct são obrigatórios' }, { status: 400 }, origin);
  }

  const now = body.timestamp ?? new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO kana_attempts (id, user_id, session_id, kana_id, input, is_correct, attempted_at, mode, kana_group, skipped)
     VALUES (?, ?, ?, ?, '', ?, ?, ?, ?, ?)`,
  )
    .bind(generateId(), userId, body.sessionId ?? null, body.kanaId, body.correct ? 1 : 0, now, body.mode ?? null, body.group ?? null, body.skipped ? 1 : 0)
    .run();

  if (!body.skipped) {
    await env.DB.prepare(
      `UPDATE user_progress_summary
       SET kana_total = kana_total + 1, kana_correct = kana_correct + ?, last_study_at = ?, updated_at = ?
       WHERE user_id = ?`,
    )
      .bind(body.correct ? 1 : 0, now, now, userId)
      .run();
  }

  return jsonResponse({ ok: true }, {}, origin);
}
