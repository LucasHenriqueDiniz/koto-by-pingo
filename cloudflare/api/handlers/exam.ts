import type { Env, ExamAttemptInput } from '../types';
import { jsonResponse } from '../cors';
import { generateId } from '../id';

export async function recordExamAttempt(env: Env, userId: string, origin: string | null, body: ExamAttemptInput): Promise<Response> {
  if (!body?.examId || !body.examSlug || !Array.isArray(body.answers)) {
    return jsonResponse({ error: 'examId, examSlug e answers são obrigatórios' }, { status: 400 }, origin);
  }

  const attemptId = generateId();
  const now = new Date().toISOString();

  const statements = [
    env.DB.prepare(
      `INSERT INTO exam_attempts (id, user_id, exam_id, exam_slug, started_at, completed_at, total_questions, correct_answers)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    ).bind(attemptId, userId, body.examId, body.examSlug, body.startedAt, body.completedAt ?? now, body.totalQuestions, body.correctAnswers),
    ...body.answers.map(answer =>
      env.DB.prepare(`INSERT INTO exam_answers (id, attempt_id, question_id, selected_option_id, is_correct) VALUES (?, ?, ?, ?, ?)`).bind(
        generateId(),
        attemptId,
        answer.questionId,
        answer.selectedOptionId,
        answer.isCorrect ? 1 : 0,
      ),
    ),
    env.DB.prepare(`UPDATE user_progress_summary SET exams_completed = exams_completed + 1, last_study_at = ?, updated_at = ? WHERE user_id = ?`).bind(
      now,
      now,
      userId,
    ),
  ];

  await env.DB.batch(statements);

  return jsonResponse({ ok: true, attemptId }, {}, origin);
}
