import { useState, useCallback, useRef } from 'react';
import type { KanaItem, KanaType } from '../types/kana';
import { getKanaByType } from '../data/kana';
import { checkAnswer } from '../utils/kana';
import { shuffle, generateId } from '../utils/scoring';
import { recordKanaAttempt, saveSession } from '../services/progress/progress.local';

type FeedbackState = 'idle' | 'correct' | 'wrong';

export function useKanaTrainer(type: KanaType) {
  const [queue, setQueue] = useState<KanaItem[]>(() => shuffle(getKanaByType(type)));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [feedback, setFeedback] = useState<FeedbackState>('idle');
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const sessionStartRef = useRef(new Date().toISOString());
  const sessionIdRef = useRef(generateId());

  const current = queue[currentIndex % queue.length];

  const resetQueue = useCallback((newType: KanaType) => {
    setQueue(shuffle(getKanaByType(newType)));
    setCurrentIndex(0);
    setFeedback('idle');
    setSessionCorrect(0);
    setSessionTotal(0);
    sessionStartRef.current = new Date().toISOString();
    sessionIdRef.current = generateId();
  }, []);

  const submit = useCallback((input: string): boolean => {
    if (!current) return false;
    const isCorrect = checkAnswer(input, current.romaji);
    setFeedback(isCorrect ? 'correct' : 'wrong');
    recordKanaAttempt(current.id, isCorrect);
    setSessionTotal(t => t + 1);
    if (isCorrect) setSessionCorrect(c => c + 1);
    return isCorrect;
  }, [current]);

  const next = useCallback(() => {
    setFeedback('idle');
    setCurrentIndex(i => i + 1);
  }, []);

  const skip = useCallback(() => {
    setFeedback('idle');
    setCurrentIndex(i => i + 1);
  }, []);

  const endSession = useCallback(() => {
    if (sessionTotal > 0) {
      saveSession({
        module: 'kana',
        startedAt: sessionStartRef.current,
        endedAt: new Date().toISOString(),
        itemsCount: sessionTotal,
        correctCount: sessionCorrect,
      });
    }
  }, [sessionTotal, sessionCorrect]);

  return {
    current,
    feedback,
    sessionCorrect,
    sessionTotal,
    sessionAccuracy: sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0,
    submit,
    next,
    skip,
    resetQueue,
    endSession,
  };
}
