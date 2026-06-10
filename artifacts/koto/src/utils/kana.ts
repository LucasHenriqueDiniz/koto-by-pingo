export function normalizeRomaji(input: string): string {
  return input.trim().toLowerCase();
}

export function checkAnswer(input: string, correctRomaji: string): boolean {
  const normalized = normalizeRomaji(input);
  const correct = normalizeRomaji(correctRomaji);
  // Accept alternate spellings
  const alternatives: Record<string, string[]> = {
    'shi': ['si'],
    'chi': ['ti'],
    'tsu': ['tu'],
    'fu': ['hu'],
    'wo': ['o'],
    'n': ['nn', 'n\''],
  };
  if (normalized === correct) return true;
  const alts = alternatives[correct] || [];
  return alts.includes(normalized);
}
