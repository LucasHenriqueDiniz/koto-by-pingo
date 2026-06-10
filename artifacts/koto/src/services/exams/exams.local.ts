import { mockExams, getExamBySlug, getAllQuestions } from '../../data/mockExams';
import { saveExamAttempt } from '../progress/progress.local';
import type { Exam, Question } from '../../types/exams';

export { mockExams, getExamBySlug };

export function getExamQuestions(slug: string): Question[] {
  const exam = getExamBySlug(slug);
  if (!exam) return [];
  return getAllQuestions(exam);
}

export function submitExam(
  exam: Exam,
  answers: Record<string, string>
) {
  const questions = getAllQuestions(exam);
  const answerDetails = questions.map(q => ({
    questionId: q.id,
    selectedOptionId: answers[q.id] ?? '',
    isCorrect: answers[q.id] === q.correctOptionId,
  }));

  const correctAnswers = answerDetails.filter(a => a.isCorrect).length;

  const attempt = saveExamAttempt({
    examId: exam.id,
    examSlug: exam.slug,
    startedAt: new Date().toISOString(),
    completedAt: new Date().toISOString(),
    totalQuestions: questions.length,
    correctAnswers,
    answers: answerDetails,
  });

  return {
    attempt,
    correctAnswers,
    totalQuestions: questions.length,
    accuracy: Math.round((correctAnswers / questions.length) * 100),
    answerDetails,
  };
}
