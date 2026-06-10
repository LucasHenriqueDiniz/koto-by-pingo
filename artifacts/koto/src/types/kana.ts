export interface KanaItem {
  id: string;
  character: string;
  romaji: string;
  type: 'hiragana' | 'katakana';
  group: string;
}

export type KanaType = 'hiragana' | 'katakana' | 'mixed';
