import { useEffect, useState, useRef } from 'react';
import { Link, useLocation } from 'wouter';
import { useParams } from 'wouter';
import { motion, AnimatePresence } from 'framer-motion';
import { PageHeader } from '../components/ui/PageHeader';
import { MaterialIcon, type MaterialIconName } from '../components/ui/MaterialIcon';
import { updatePageSEO } from '../utils/seo';
import { mockExams } from '../data/mockExams';
import { saveExamAttempt } from '../services/progress/progress.local';
import { useRegisterActiveSession, CONFIRM_LEAVE_SESSION_MESSAGE } from '../contexts/ActiveSessionContext';
import type { Exam, Question, Section } from '../types/exams';

type ViewState = 'hub' | 'exam' | 'results';
type ExamMode = 'simulado' | 'treino';

export function ExamDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const [location, navigate] = useLocation();
  const [view, setView] = useState<ViewState>('hub');
  useRegisterActiveSession(view === 'exam');
  const [examMode, setExamMode] = useState<ExamMode>('simulado');
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);
  const [sectionIdx, setSectionIdx] = useState(0);
  const [questionIdx, setQuestionIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [revealed, setRevealed] = useState<Record<string, boolean>>({});
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const timerInterval = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (slug) {
      const exam = mockExams.find(e => e.slug === slug);
      if (exam) {
        setSelectedExam(exam);
        setView('exam');
        setExamMode('simulado');
      }
    }
    updatePageSEO('Simulados JLPT', 'Treine com simulados baseados no formato oficial do JLPT.');
  }, [slug]);

  useEffect(() => {
    if (!isTimerActive || !selectedExam) return;

    timerInterval.current = setInterval(() => {
      setTimerSeconds(prev => prev + 1);
    }, 1000);

    return () => {
      if (timerInterval.current) clearInterval(timerInterval.current);
    };
  }, [isTimerActive, selectedExam]);

  const startExam = (exam: Exam, mode: ExamMode) => {
    setSelectedExam(exam);
    setExamMode(mode);
    setSectionIdx(0);
    setQuestionIdx(0);
    setAnswers({});
    setRevealed({});
    setTimerSeconds(0);
    setView('exam');
    if (mode === 'simulado') {
      setIsTimerActive(true);
    }
  };

  const abandonExam = () => {
    if (confirm(CONFIRM_LEAVE_SESSION_MESSAGE)) {
      setIsTimerActive(false);
      setView('hub');
    }
  };

  const handleAnswer = (optionId: string) => {
    if (!selectedExam) return;
    const section = selectedExam.sections[sectionIdx];
    if (!section) return;
    const key = `${section.id}-${section.questions[questionIdx].id}`;
    setAnswers(prev => ({ ...prev, [key]: optionId }));
    setRevealed(prev => ({ ...prev, [key]: true }));
  };

  const goNextQuestion = () => {
    if (!selectedExam) return;
    const section = selectedExam.sections[sectionIdx];
    if (questionIdx < section.questions.length - 1) {
      setQuestionIdx(questionIdx + 1);
    } else if (sectionIdx < selectedExam.sections.length - 1) {
      setSectionIdx(sectionIdx + 1);
      setQuestionIdx(0);
    } else {
      finishExam();
    }
  };

  const goPrevQuestion = () => {
    if (questionIdx > 0) {
      setQuestionIdx(questionIdx - 1);
    } else if (sectionIdx > 0) {
      setSectionIdx(sectionIdx - 1);
      setQuestionIdx(selectedExam!.sections[sectionIdx - 1].questions.length - 1);
    }
  };

  const finishExam = () => {
    if (!selectedExam) return;
    setIsTimerActive(false);

    let correct = 0;
    let total = 0;
    const answersList: { questionId: string; selectedOptionId: string; isCorrect: boolean }[] = [];

    selectedExam.sections.forEach(sec => {
      sec.questions.forEach(q => {
        const key = `${sec.id}-${q.id}`;
        if (answers[key]) {
          total++;
          const isCorrect = answers[key] === q.correctOptionId;
          if (isCorrect) correct++;
          answersList.push({
            questionId: q.id,
            selectedOptionId: answers[key],
            isCorrect,
          });
        }
      });
    });

    const now = new Date().toISOString();
    saveExamAttempt({
      examId: selectedExam.id,
      examSlug: selectedExam.slug ?? `exam-${selectedExam.id}`,
      startedAt: new Date(Date.now() - timerSeconds * 1000).toISOString(),
      completedAt: now,
      totalQuestions: total,
      correctAnswers: correct,
      answers: answersList,
    });

    setView('results');
  };

  if (!selectedExam && view === 'hub') {
    return (
      <div>
        <PageHeader title="Simulados" description="Teste seus conhecimentos com simulados baseados no JLPT oficial." />
        <div className="max-w-6xl mx-auto px-4 py-8 space-y-7">
          {/* Mode selector */}
          <div className="flex gap-3 mb-6">
            <button
              onClick={() => setExamMode('simulado')}
              className={`flex items-center gap-3 px-5 py-4 rounded-xl border transition-all ${
                examMode === 'simulado'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:border-primary'
              }`}
            >
              <MaterialIcon name="timer" filled size={20} />
              <div className="text-left">
                <div className="font-bold text-sm">Simulado Oficial</div>
                <div className="text-xs opacity-70">Cronometrado · formato real</div>
              </div>
            </button>
            <button
              onClick={() => setExamMode('treino')}
              className={`flex items-center gap-3 px-5 py-4 rounded-xl border transition-all ${
                examMode === 'treino'
                  ? 'bg-primary text-primary-foreground border-primary'
                  : 'bg-card border-border hover:border-primary'
              }`}
            >
              <MaterialIcon name="school" filled size={20} />
              <div className="text-left">
                <div className="font-bold text-sm">Treino Livre</div>
                <div className="text-xs opacity-70">Sem timer · revise à vontade</div>
              </div>
            </button>
          </div>

          {/* Exam cards */}
          <div>
            <h2 className="font-heading text-xl font-bold mb-4">Escolha um simulado</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {mockExams.map(exam => (
                <div key={exam.id} className="bg-card border border-border rounded-2xl p-6 hover:border-primary hover:shadow-sm transition-all">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <div className="font-heading text-3xl font-bold text-primary mb-1">{exam.level}</div>
                      <div className="text-sm text-[--color-text-secondary] font-semibold">{exam.title}</div>
                    </div>
                    <div className="w-11 h-11 bg-accent rounded-lg flex items-center justify-center text-primary flex-shrink-0">
                      <MaterialIcon name="assignment" filled size={22} />
                    </div>
                  </div>
                  <p className="text-xs text-[--color-text-secondary] mb-4 leading-relaxed line-clamp-2">{exam.description}</p>
                  <div className="bg-background border border-border rounded-lg p-3 mb-4 flex items-center gap-2 text-xs text-[--color-text-secondary]">
                    <MaterialIcon name="schedule" size={16} />
                    <span className="font-semibold">{exam.estimatedMinutes} min no total</span>
                    <span className="ml-auto">
                      {exam.sections.reduce((sum, sec) => sum + sec.questions.length, 0)} questões
                    </span>
                  </div>
                  <button
                    onClick={() => startExam(exam, examMode)}
                    className="w-full bg-primary text-primary-foreground font-bold py-3 rounded-lg hover:opacity-90 transition-opacity"
                  >
                    Iniciar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (view === 'exam' && selectedExam) {
    const section = selectedExam.sections[sectionIdx];
    if (!section) return null;

    const question = section.questions[questionIdx];
    if (!question) return null;

    const answerKey = `${section.id}-${question.id}`;
    const selectedAnswer = answers[answerKey];
    const isAnswered = !!selectedAnswer;
    const totalQuestions = selectedExam.sections.reduce((sum, s) => sum + s.questions.length, 0);
    const answeredQuestions = Object.keys(answers).length;
    const timeFormatted = `${Math.floor(timerSeconds / 60)}:${(timerSeconds % 60).toString().padStart(2, '0')}`;
    const estimatedTotal = selectedExam.estimatedMinutes * 60;
    const timerPct = Math.max(0, Math.min(100, ((estimatedTotal - timerSeconds) / estimatedTotal) * 100));

    return (
      <div>
        <PageHeader title={`Simulado · ${selectedExam.level}`} description={selectedExam.title}>
          {examMode === 'simulado' && (
            <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-accent text-primary border border-primary/30 text-sm font-bold">
              <MaterialIcon name="schedule" size={16} />
              {timeFormatted}
            </div>
          )}
          <button
            onClick={abandonExam}
            className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary hover:text-primary transition-colors text-sm font-bold"
          >
            <MaterialIcon name="close" size={18} />
            Abandonar
          </button>
        </PageHeader>

        <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
          {/* Timer bar */}
          {examMode === 'simulado' && (
            <div className="h-1 bg-muted rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-primary rounded-full"
                initial={{ width: '100%' }}
                animate={{ width: `${timerPct}%` }}
                transition={{ type: 'tween', duration: 1 }}
              />
            </div>
          )}

          {examMode === 'treino' && (
            <div className="flex items-center gap-3 px-4 py-3 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-700 text-sm font-bold">
              <MaterialIcon name="school" filled size={18} />
              Treino Livre — sem limite de tempo
            </div>
          )}

          {/* Section tabs */}
          <div className="flex gap-2 flex-wrap">
            {selectedExam.sections.map((sec, idx) => {
              const secAnswered = selectedExam.sections[idx].questions.filter(q =>
                answers[`${sec.id}-${q.id}`]
              ).length;
              const isDone = secAnswered === sec.questions.length;

              return (
                <button
                  key={sec.id}
                  onClick={() => {
                    setSectionIdx(idx);
                    setQuestionIdx(0);
                  }}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-bold transition-all ${
                    sectionIdx === idx
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border hover:border-primary'
                  }`}
                >
                  <MaterialIcon name="assignment" size={16} />
                  {sec.title}
                  {isDone && <MaterialIcon name="check_circle" filled size={14} className="text-emerald-600" />}
                </button>
              );
            })}
          </div>

          {/* Question card */}
          <div className="bg-card border border-border rounded-2xl overflow-hidden">
            {/* Section header */}
            <div className="bg-foreground text-background px-7 py-5 flex items-center gap-4">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
                <MaterialIcon name="help_outline" filled size={20} />
              </div>
              <div>
                <div className="font-heading text-base font-bold">{section.title}</div>
                <div className="text-xs opacity-60 mt-0.5">{section.questions.length} questões nesta seção</div>
              </div>
              <div className="ml-auto text-xs opacity-70 font-semibold">
                Questão {questionIdx + 1} de {section.questions.length}
              </div>
            </div>

            {/* Question content */}
            <div className="px-7 py-8 space-y-6">
              <div>
                <div className="text-xs font-bold text-[--color-text-secondary] uppercase tracking-wider mb-2">Questão</div>
                <p className="text-base font-semibold leading-relaxed">{question.prompt}</p>
              </div>

              {question.japaneseText && (
                <div className="text-center p-4 bg-background border border-border rounded-lg">
                  <div className="font-japanese text-5xl font-bold">{question.japaneseText}</div>
                </div>
              )}

              {/* Options */}
              <div className="space-y-3">
                {question.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === opt.id;
                  const isCorrect = opt.id === question.correctOptionId;
                  const isWrong = isSelected && !isCorrect;
                  const shouldShow = isAnswered;

                  return (
                    <motion.button
                      key={opt.id}
                      onClick={() => handleAnswer(opt.id)}
                      className={`w-full flex items-center gap-4 p-4 rounded-lg border-2 transition-all text-left ${
                        isSelected
                          ? isCorrect
                            ? 'border-emerald-500 bg-emerald-50'
                            : 'border-red-500 bg-red-50'
                          : 'border-border bg-background hover:border-primary'
                      }`}
                      layout
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold flex-shrink-0 ${
                          isSelected
                            ? isCorrect
                              ? 'bg-emerald-500 text-white'
                              : 'bg-red-500 text-white'
                            : 'bg-muted text-[--color-text-secondary]'
                        }`}
                      >
                        {String.fromCharCode(65 + idx)}
                      </div>
                      <span className="font-japanese flex-1 font-semibold">{opt.text}</span>
                      <AnimatePresence>
                        {shouldShow && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.8 }}
                          >
                            {isCorrect ? (
                              <MaterialIcon name="check_circle" filled size={20} className="text-emerald-600" />
                            ) : isWrong ? (
                              <MaterialIcon name="cancel" filled size={20} className="text-red-600" />
                            ) : null}
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  );
                })}
              </div>

              {isAnswered && question.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-accent/20 border border-primary/30 rounded-lg p-4"
                >
                  <div className="text-xs font-bold text-primary uppercase mb-2">Explicação</div>
                  <p className="text-sm text-foreground leading-relaxed">{question.explanation}</p>
                </motion.div>
              )}
            </div>

            {/* Navigation */}
            <div className="border-t border-border px-7 py-4 flex items-center justify-between gap-4 bg-background">
              <button
                onClick={goPrevQuestion}
                disabled={questionIdx === 0 && sectionIdx === 0}
                className="flex items-center gap-2 px-4 py-2 rounded-lg border border-border hover:border-primary hover:text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-colors text-sm font-bold"
              >
                <MaterialIcon name="arrow_back" size={16} />
                Anterior
              </button>

              {/* Progress dots */}
              <div className="flex gap-1 flex-wrap justify-center flex-1 max-w-sm">
                {section.questions.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setQuestionIdx(idx)}
                    className={`w-2.5 h-2.5 rounded-full transition-all ${
                      idx === questionIdx
                        ? 'bg-primary w-8 rounded-full'
                        : answers[`${section.id}-${section.questions[idx].id}`]
                          ? 'bg-emerald-500'
                          : 'bg-border'
                    }`}
                    title={`Questão ${idx + 1}`}
                  />
                ))}
              </div>

              <button
                onClick={goNextQuestion}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:opacity-90 transition-opacity text-sm font-bold"
              >
                {questionIdx === section.questions.length - 1 && sectionIdx === selectedExam.sections.length - 1
                  ? 'Finalizar'
                  : 'Próximo'}
                <MaterialIcon name="arrow_forward" size={16} />
              </button>
            </div>
          </div>

          {/* Progress summary */}
          <div className="text-xs text-[--color-text-secondary] text-center font-semibold">
            {answeredQuestions} de {totalQuestions} questões respondidas
          </div>
        </div>
      </div>
    );
  }

  if (view === 'results' && selectedExam) {
    const correct = Object.entries(answers).filter(([key, optId]) => {
      const [secId, qId] = key.split('-');
      const section = selectedExam.sections.find(s => s.id === secId);
      const question = section?.questions.find(q => q.id === qId);
      return question?.correctOptionId === optId;
    }).length;

    const total = Object.keys(answers).length;
    const accuracy = Math.round((correct / total) * 100);
    const totalQuestions = selectedExam.sections.reduce((sum, s) => sum + s.questions.length, 0);

    const sectionResults = selectedExam.sections.map(sec => {
      const sectionAnswers = sec.questions.filter(q => answers[`${sec.id}-${q.id}`]);
      const sectionCorrect = sectionAnswers.filter(q => answers[`${sec.id}-${q.id}`] === q.correctOptionId).length;
      return {
        name: sec.title,
        score: sectionAnswers.length > 0 ? Math.round((sectionCorrect / sectionAnswers.length) * 100) : 0,
      };
    });

    return (
      <div>
        <PageHeader title="Resultado · Simulado" description={selectedExam.title} />
        <div className="max-w-2xl mx-auto px-4 py-8 space-y-7">
          {/* Score hero */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-foreground text-background rounded-2xl p-8 text-center space-y-6"
          >
            <div>
              <div className="text-xs font-bold opacity-50 uppercase tracking-widest mb-2">Resultado · JLPT {selectedExam.level}</div>
              <div className="font-heading text-6xl font-bold text-primary mb-2">{accuracy}%</div>
              <div className="text-lg font-bold">
                {accuracy >= 80 ? '✨ Excelente!' : accuracy >= 60 ? '👍 Bom!' : '💪 Continue praticando'}
              </div>
            </div>
            <div className="flex justify-center gap-8 pt-4 border-t border-border">
              <div className="text-center">
                <div className="font-heading text-2xl font-bold">{correct}</div>
                <div className="text-xs opacity-60 mt-1">Corretas</div>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <div className="font-heading text-2xl font-bold text-red-500">{total - correct}</div>
                <div className="text-xs opacity-60 mt-1">Incorretas</div>
              </div>
              <div className="w-px bg-border" />
              <div className="text-center">
                <div className="font-heading text-2xl font-bold opacity-40">{totalQuestions - total}</div>
                <div className="text-xs opacity-60 mt-1">Puladas</div>
              </div>
            </div>
          </motion.div>

          {/* Section breakdown */}
          <div className="bg-card border border-border rounded-2xl p-6 space-y-4">
            <h3 className="font-heading text-lg font-bold">Desempenho por seção</h3>
            {sectionResults.map((result, idx) => (
              <div key={idx} className="space-y-2">
                <div className="flex justify-between items-center text-sm font-semibold">
                  <span>{result.name}</span>
                  <span className="text-primary">{result.score}%</span>
                </div>
                <div className="h-2 bg-background rounded-full overflow-hidden">
                  <motion.div
                    className="h-full bg-primary rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${result.score}%` }}
                    transition={{ delay: idx * 0.1, duration: 0.6 }}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={() => startExam(selectedExam, examMode)}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-primary text-primary-foreground rounded-lg font-bold hover:opacity-90 transition-opacity"
            >
              <MaterialIcon name="replay" size={20} />
              Refazer simulado
            </button>
            <Link
              href="/simulados"
              className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-card border border-border rounded-lg font-bold hover:border-primary transition-colors"
            >
              <MaterialIcon name="home" size={20} />
              Voltar
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
