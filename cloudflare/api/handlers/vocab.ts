import type { Env, WordAttemptInput } from '../types';
import { jsonResponse } from '../cors';
import { generateId } from '../id';

const WEAK_REASON_COLUMNS = {
  reading: 'weak_reading',
  meaning: 'weak_meaning',
  listening: 'weak_listening',
  typing: 'weak_typing',
} as const;

export async function recordVocabAttempt(env: Env, userId: string, origin: string | null, body: WordAttemptInput): Promise<Response> {
  if (!body?.wordId || typeof body.correct !== 'boolean') {
    return jsonResponse({ error: 'wordId e correct são obrigatórios' }, { status: 400 }, origin);
  }

  const now = new Date().toISOString();

  await env.DB.prepare(
    `INSERT INTO vocabulary_attempts (id, user_id, session_id, vocab_id, is_correct, attempted_at) VALUES (?, ?, ?, ?, ?, ?)`,
  )
    .bind(generateId(), userId, body.sessionId ?? null, body.wordId, body.correct ? 1 : 0, now)
    .run();

  const weakColumn = body.weakReason ? WEAK_REASON_COLUMNS[body.weakReason] : undefined;
  const existing = await env.DB.prepare('SELECT word_id FROM word_progress WHERE user_id = ? AND word_id = ?').bind(userId, body.wordId).first();

  if (existing) {
    if (body.correct) {
      await env.DB.prepare(`UPDATE word_progress SET attempts = attempts + 1, correct = correct + 1, last_seen = ? WHERE user_id = ? AND word_id = ?`)
        .bind(now, userId, body.wordId)
        .run();
    } else if (weakColumn) {
      await env.DB.prepare(`UPDATE word_progress SET attempts = attempts + 1, last_seen = ?, ${weakColumn} = ${weakColumn} + 1 WHERE user_id = ? AND word_id = ?`)
        .bind(now, userId, body.wordId)
        .run();
    } else {
      await env.DB.prepare(`UPDATE word_progress SET attempts = attempts + 1, last_seen = ? WHERE user_id = ? AND word_id = ?`)
        .bind(now, userId, body.wordId)
        .run();
    }
  } else {
    const weak = { reading: 0, meaning: 0, listening: 0, typing: 0 };
    if (!body.correct && body.weakReason) weak[body.weakReason] = 1;
    await env.DB.prepare(
      `INSERT INTO word_progress (user_id, word_id, attempts, correct, last_seen, weak_reading, weak_meaning, weak_listening, weak_typing)
       VALUES (?, ?, 1, ?, ?, ?, ?, ?, ?)`,
    )
      .bind(userId, body.wordId, body.correct ? 1 : 0, now, weak.reading, weak.meaning, weak.listening, weak.typing)
      .run();
  }

  await env.DB.prepare(
    `UPDATE user_progress_summary SET vocab_total = vocab_total + 1, vocab_correct = vocab_correct + ?, last_study_at = ?, updated_at = ? WHERE user_id = ?`,
  )
    .bind(body.correct ? 1 : 0, now, now, userId)
    .run();

  return jsonResponse({ ok: true }, {}, origin);
}
