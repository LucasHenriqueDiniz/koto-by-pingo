import { useState, useCallback } from 'react';
import { getProgressSummary, resetAllProgress } from '../services/progress/progress.local';

export function useStudyProgress() {
  const [summary, setSummary] = useState(() => getProgressSummary());

  const refresh = useCallback(() => {
    setSummary(getProgressSummary());
  }, []);

  const reset = useCallback(() => {
    resetAllProgress();
    setSummary(getProgressSummary());
  }, []);

  return { summary, refresh, reset };
}
