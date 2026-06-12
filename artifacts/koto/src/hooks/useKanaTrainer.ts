import { useState, useCallback } from 'react';
import type { KanaItem } from '../types/kana';
import { checkAnswer } from '../utils/kana';
import { recordKanaAttempt } from '../services/progress/progress.local';
import { useKanaQueue } from './useKanaQueue';

type FeedbackState = 'idle' | 'correct' | 'wrong';

/** Modo Digitação: mostra o kana, usuário digita o romaji. */
export function useKanaTrainer(items: KanaItem[]) {
  const queue = useKanaQueue(items);
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const { current, registerResult, registerSkip, next: queueNext, reset } = queue;

  const submit = useCallback((input: string): boolean => {
    if (!current) return false;
    const isCorrect = checkAnswer(input, current.romaji);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    recordKanaAttempt(current.id, isCorrect, { mode: 'typing', group: current.group });
    registerResult(isCorrect);
    return isCorrect;
  }, [current, registerResult]);

  const next = useCallback(() => {
    setFeedback('idle');
    queueNext();
  }, [queueNext]);

  const skip = useCallback(() => {
    if (current) {
      recordKanaAttempt(current.id, false, { mode: 'typing', skipped: true, group: current.group });
    }
    registerSkip();
    setFeedback('idle');
    queueNext();
  }, [current, registerSkip, queueNext]);

  const resetQueue = useCallback((newItems: KanaItem[]) => {
    setFeedback('idle');
    reset(newItems);
  }, [reset]);

  return {
    current,
    feedback,
    sessionCorrect: queue.sessionCorrect,
    sessionTotal: queue.sessionTotal,
    sessionAccuracy: queue.sessionAccuracy,
    submit,
    next,
    skip,
    resetQueue,
    endSession: queue.endSession,
  };
}
