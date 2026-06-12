import type { Env, SyncPayload } from '../types';
import { jsonResponse } from '../cors';
import { generateId } from '../id';

export async function getProgress(env: Env, userId: string, origin: string | null): Promise<Response> {
  const [summary, wordProgress, kanaAttempts, exams, sessions] = await Promise.all([
    env.DB.prepare('SELECT * FROM user_progress_summary WHERE user_id = ?').bind(userId).first(),
    env.DB.prepare('SELECT * FROM word_progress WHERE user_id = ?').bind(userId).all(),
    env.DB.prepare('SELECT kana_id, is_correct, attempted_at, mode, kana_group, skipped FROM kana_attempts WHERE user_id = ? ORDER BY attempted_at DESC LIMIT 200')
      .bind(userId)
      .all(),
    env.DB.prepare('SELECT id, exam_id, exam_slug, started_at, completed_at, total_questions, correct_answers FROM exam_attempts WHERE user_id = ? ORDER BY started_at DESC')
      .bind(userId)
      .all(),
    env.DB.prepare('SELECT id, module, started_at, ended_at, items_count, correct_count FROM study_sessions WHERE user_id = ? ORDER BY started_at DESC LIMIT 100')
      .bind(userId)
      .all(),
  ]);

  return jsonResponse(
    {
      summary: summary ?? null,
      wordProgress: wordProgress.results,
      kanaAttempts: kanaAttempts.results,
      exams: exams.results,
      sessions: sessions.results,
    },
    {},
    origin,
  );
}

export async function resetProgress(env: Env, userId: string, origin: string | null): Promise<Response> {
  const now = new Date().toISOString();

  await env.DB.batch([
    env.DB.prepare('DELETE FROM kana_attempts WHERE user_id = ?').bind(userId),
    env.DB.prepare('DELETE FROM vocabulary_attempts WHERE user_id = ?').bind(userId),
    env.DB.prepare('DELETE FROM word_progress WHERE user_id = ?').bind(userId),
    env.DB.prepare('DELETE FROM exam_answers WHERE attempt_id IN (SELECT id FROM exam_attempts WHERE user_id = ?)').bind(userId),
    env.DB.prepare('DELETE FROM exam_attempts WHERE user_id = ?').bind(userId),
    env.DB.prepare('DELETE FROM study_sessions WHERE user_id = ?').bind(userId),
    env.DB.prepare(
      `UPDATE user_progress_summary
       SET total_sessions = 0, kana_total = 0, kana_correct = 0, vocab_total = 0, vocab_correct = 0, exams_completed = 0, last_study_at = NULL, updated_at = ?
       WHERE user_id = ?`,
    ).bind(now, userId),
  ]);

  return jsonResponse({ ok: true }, {}, origin);
}

export async function syncProgress(env: Env, userId: string, origin: string | null, body: SyncPayload): Promise<Response> {
  const now = new Date().toISOString();
  const statements: D1PreparedStatement[] = [];

  const kana = body.kana ?? [];
  for (const attempt of kana) {
    statements.push(
      env.DB.prepare(
        `INSERT INTO kana_attempts (id, user_id, session_id, kana_id, input, is_correct, attempted_at, mode, kana_group, skipped)
         VALUES (?, ?, NULL, ?, '', ?, ?, ?, ?, ?)`,
      ).bind(generateId(), userId, attempt.kanaId, attempt.correct ? 1 : 0, attempt.timestamp ?? now, attempt.mode ?? null, attempt.group ?? null, attempt.skipped ? 1 : 0),
    );
  }

  const wordProgress = body.wordProgress ?? [];
  for (const word of wordProgress) {
    statements.push(
      env.DB.prepare(
        `INSERT INTO word_progress (user_id, word_id, attempts, correct, last_seen, weak_reading, weak_meaning, weak_listening, weak_typing)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
         ON CONFLICT(user_id, word_id) DO UPDATE SET
           attempts = excluded.attempts,
           correct = excluded.correct,
           last_seen = excluded.last_seen,
           weak_reading = excluded.weak_reading,
           weak_meaning = excluded.weak_meaning,
           weak_listening = excluded.weak_listening,
           weak_typing = excluded.weak_typing`,
      ).bind(
        userId,
        word.wordId,
        word.attempts,
        word.correct,
        word.lastSeen,
        word.weakReasons.reading,
        word.weakReasons.meaning,
        word.weakReasons.listening,
        word.weakReasons.typing,
      ),
    );
  }

  const exams = body.exams ?? [];
  for (const exam of exams) {
    const attemptId = generateId();
    statements.push(
      env.DB.prepare(
        `INSERT INTO exam_attempts (id, user_id, exam_id, exam_slug, started_at, completed_at, total_questions, correct_answers)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      ).bind(attemptId, userId, exam.examId, exam.examSlug, exam.startedAt, exam.completedAt ?? now, exam.totalQuestions, exam.correctAnswers),
    );

    for (const answer of exam.answers) {
      statements.push(
        env.DB.prepare(`INSERT INTO exam_answers (id, attempt_id, question_id, selected_option_id, is_correct) VALUES (?, ?, ?, ?, ?)`).bind(
          generateId(),
          attemptId,
          answer.questionId,
          answer.selectedOptionId,
          answer.isCorrect ? 1 : 0,
        ),
      );
    }
  }

  const sessions = body.sessions ?? [];
  for (const session of sessions) {
    statements.push(
      env.DB.prepare(`INSERT INTO study_sessions (id, user_id, module, started_at, ended_at, items_count, correct_count) VALUES (?, ?, ?, ?, ?, ?, ?)`).bind(
        generateId(),
        userId,
        session.module,
        session.startedAt,
        session.endedAt,
        session.itemsCount,
        session.correctCount,
      ),
    );
  }

  if (statements.length > 0) {
    await env.DB.batch(statements);
  }

  const kanaTotal = kana.filter(a => !a.skipped).length;
  const kanaCorrect = kana.filter(a => !a.skipped && a.correct).length;
  const vocabTotal = wordProgress.reduce((sum, w) => sum + w.attempts, 0);
  const vocabCorrect = wordProgress.reduce((sum, w) => sum + w.correct, 0);

  await env.DB.prepare(
    `UPDATE user_progress_summary
     SET total_sessions = total_sessions + ?,
         kana_total = kana_total + ?,
         kana_correct = kana_correct + ?,
         vocab_total = vocab_total + ?,
         vocab_correct = vocab_correct + ?,
         exams_completed = exams_completed + ?,
         last_study_at = ?,
         updated_at = ?
     WHERE user_id = ?`,
  )
    .bind(sessions.length, kanaTotal, kanaCorrect, vocabTotal, vocabCorrect, exams.length, now, now, userId)
    .run();

  return jsonResponse(
    { ok: true, synced: { kana: kana.length, words: wordProgress.length, exams: exams.length, sessions: sessions.length } },
    {},
    origin,
  );
}
