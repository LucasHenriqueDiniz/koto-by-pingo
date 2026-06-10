export function calcAccuracy(correct: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((correct / total) * 100);
}

export function calcScore(correct: number, total: number): string {
  return `${correct}/${total}`;
}

export function getAccuracyLabel(accuracy: number): string {
  if (accuracy >= 90) return 'Excelente';
  if (accuracy >= 75) return 'Bom';
  if (accuracy >= 50) return 'Regular';
  return 'Precisa melhorar';
}

export function getAccuracyColor(accuracy: number): string {
  if (accuracy >= 90) return '#16A34A';
  if (accuracy >= 75) return '#2F9E44';
  if (accuracy >= 50) return '#F59F00';
  return '#E5484D';
}

export function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}
