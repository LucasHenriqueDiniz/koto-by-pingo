export interface ExamSession {
  examId: string;
  examSlug: string;
  currentQuestionIndex: number;
  answers: Map<string, string>;
  startedAt: string;
  isComplete: boolean;
}
