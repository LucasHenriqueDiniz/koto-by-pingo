import { useState, useCallback, useRef } from 'react';
import { shuffle, generateId } from '../utils/scoring';
import { saveSession } from '../services/progress/progress.local';
import type { StudySessionRecord } from '../services/progress/progress.types';

/**
 * Generic queue and session stats, shared by the kana training modes.
 * Does not check answers — each mode records its own result.
 */
export function useKanaQueue<T>(items: T[]) {
  const [queue, setQueue] = useState<T[]>(() => shuffle([...items]));
  const [currentIndex, setCurrentIndex] = useState(0);
  const [sessionCorrect, setSessionCorrect] = useState(0);
  const [sessionTotal, setSessionTotal] = useState(0);
  const [sessionSkipped, setSessionSkipped] = useState(0);
  const sessionStartRef = useRef(new Date().toISOString());
  const sessionIdRef = useRef(generateId());

  const current = queue[currentIndex % queue.length];

  const reset = useCallback((newItems: T[]) => {
    setQueue(shuffle([...newItems]));
    setCurrentIndex(0);
    setSessionCorrect(0);
    setSessionTotal(0);
    setSessionSkipped(0);
    sessionStartRef.current = new Date().toISOString();
    sessionIdRef.current = generateId();
  }, []);

  const next = useCallback(() => {
    setCurrentIndex(i => i + 1);
  }, []);

  const registerResult = useCallback((correct: boolean) => {
    setSessionTotal(t => t + 1);
    if (correct) setSessionCorrect(c => c + 1);
  }, []);

  const registerSkip = useCallback(() => {
    setSessionSkipped(s => s + 1);
  }, []);

  const endSession = useCallback((module: StudySessionRecord['module'] = 'kana') => {
    if (sessionTotal > 0) {
      saveSession({
        module,
        startedAt: sessionStartRef.current,
        endedAt: new Date().toISOString(),
        itemsCount: sessionTotal,
        correctCount: sessionCorrect,
      });
    }
  }, [sessionTotal, sessionCorrect]);

  return {
    queue,
    current,
    currentIndex,
    sessionCorrect,
    sessionTotal,
    sessionSkipped,
    sessionAccuracy: sessionTotal > 0 ? Math.round((sessionCorrect / sessionTotal) * 100) : 0,
    next,
    reset,
    registerResult,
    registerSkip,
    endSession,
  };
}
