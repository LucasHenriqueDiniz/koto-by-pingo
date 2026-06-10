import type { KanaItem } from '../types/kana';

export const hiragana: KanaItem[] = [
  // A-row
  { id: 'h-a', character: 'あ', romaji: 'a', type: 'hiragana', group: 'a-row' },
  { id: 'h-i', character: 'い', romaji: 'i', type: 'hiragana', group: 'a-row' },
  { id: 'h-u', character: 'う', romaji: 'u', type: 'hiragana', group: 'a-row' },
  { id: 'h-e', character: 'え', romaji: 'e', type: 'hiragana', group: 'a-row' },
  { id: 'h-o', character: 'お', romaji: 'o', type: 'hiragana', group: 'a-row' },
  // KA-row
  { id: 'h-ka', character: 'か', romaji: 'ka', type: 'hiragana', group: 'ka-row' },
  { id: 'h-ki', character: 'き', romaji: 'ki', type: 'hiragana', group: 'ka-row' },
  { id: 'h-ku', character: 'く', romaji: 'ku', type: 'hiragana', group: 'ka-row' },
  { id: 'h-ke', character: 'け', romaji: 'ke', type: 'hiragana', group: 'ka-row' },
  { id: 'h-ko', character: 'こ', romaji: 'ko', type: 'hiragana', group: 'ka-row' },
  // SA-row
  { id: 'h-sa', character: 'さ', romaji: 'sa', type: 'hiragana', group: 'sa-row' },
  { id: 'h-shi', character: 'し', romaji: 'shi', type: 'hiragana', group: 'sa-row' },
  { id: 'h-su', character: 'す', romaji: 'su', type: 'hiragana', group: 'sa-row' },
  { id: 'h-se', character: 'せ', romaji: 'se', type: 'hiragana', group: 'sa-row' },
  { id: 'h-so', character: 'そ', romaji: 'so', type: 'hiragana', group: 'sa-row' },
  // TA-row
  { id: 'h-ta', character: 'た', romaji: 'ta', type: 'hiragana', group: 'ta-row' },
  { id: 'h-chi', character: 'ち', romaji: 'chi', type: 'hiragana', group: 'ta-row' },
  { id: 'h-tsu', character: 'つ', romaji: 'tsu', type: 'hiragana', group: 'ta-row' },
  { id: 'h-te', character: 'て', romaji: 'te', type: 'hiragana', group: 'ta-row' },
  { id: 'h-to', character: 'と', romaji: 'to', type: 'hiragana', group: 'ta-row' },
  // NA-row
  { id: 'h-na', character: 'な', romaji: 'na', type: 'hiragana', group: 'na-row' },
  { id: 'h-ni', character: 'に', romaji: 'ni', type: 'hiragana', group: 'na-row' },
  { id: 'h-nu', character: 'ぬ', romaji: 'nu', type: 'hiragana', group: 'na-row' },
  { id: 'h-ne', character: 'ね', romaji: 'ne', type: 'hiragana', group: 'na-row' },
  { id: 'h-no', character: 'の', romaji: 'no', type: 'hiragana', group: 'na-row' },
  // HA-row
  { id: 'h-ha', character: 'は', romaji: 'ha', type: 'hiragana', group: 'ha-row' },
  { id: 'h-hi', character: 'ひ', romaji: 'hi', type: 'hiragana', group: 'ha-row' },
  { id: 'h-fu', character: 'ふ', romaji: 'fu', type: 'hiragana', group: 'ha-row' },
  { id: 'h-he', character: 'へ', romaji: 'he', type: 'hiragana', group: 'ha-row' },
  { id: 'h-ho', character: 'ほ', romaji: 'ho', type: 'hiragana', group: 'ha-row' },
  // MA-row
  { id: 'h-ma', character: 'ま', romaji: 'ma', type: 'hiragana', group: 'ma-row' },
  { id: 'h-mi', character: 'み', romaji: 'mi', type: 'hiragana', group: 'ma-row' },
  { id: 'h-mu', character: 'む', romaji: 'mu', type: 'hiragana', group: 'ma-row' },
  { id: 'h-me', character: 'め', romaji: 'me', type: 'hiragana', group: 'ma-row' },
  { id: 'h-mo', character: 'も', romaji: 'mo', type: 'hiragana', group: 'ma-row' },
  // YA-row
  { id: 'h-ya', character: 'や', romaji: 'ya', type: 'hiragana', group: 'ya-row' },
  { id: 'h-yu', character: 'ゆ', romaji: 'yu', type: 'hiragana', group: 'ya-row' },
  { id: 'h-yo', character: 'よ', romaji: 'yo', type: 'hiragana', group: 'ya-row' },
  // RA-row
  { id: 'h-ra', character: 'ら', romaji: 'ra', type: 'hiragana', group: 'ra-row' },
  { id: 'h-ri', character: 'り', romaji: 'ri', type: 'hiragana', group: 'ra-row' },
  { id: 'h-ru', character: 'る', romaji: 'ru', type: 'hiragana', group: 'ra-row' },
  { id: 'h-re', character: 'れ', romaji: 're', type: 'hiragana', group: 'ra-row' },
  { id: 'h-ro', character: 'ろ', romaji: 'ro', type: 'hiragana', group: 'ra-row' },
  // WA-row + N
  { id: 'h-wa', character: 'わ', romaji: 'wa', type: 'hiragana', group: 'wa-row' },
  { id: 'h-wo', character: 'を', romaji: 'wo', type: 'hiragana', group: 'wa-row' },
  { id: 'h-n', character: 'ん', romaji: 'n', type: 'hiragana', group: 'n' },
];

export const katakana: KanaItem[] = [
  // A-row
  { id: 'k-a', character: 'ア', romaji: 'a', type: 'katakana', group: 'a-row' },
  { id: 'k-i', character: 'イ', romaji: 'i', type: 'katakana', group: 'a-row' },
  { id: 'k-u', character: 'ウ', romaji: 'u', type: 'katakana', group: 'a-row' },
  { id: 'k-e', character: 'エ', romaji: 'e', type: 'katakana', group: 'a-row' },
  { id: 'k-o', character: 'オ', romaji: 'o', type: 'katakana', group: 'a-row' },
  // KA-row
  { id: 'k-ka', character: 'カ', romaji: 'ka', type: 'katakana', group: 'ka-row' },
  { id: 'k-ki', character: 'キ', romaji: 'ki', type: 'katakana', group: 'ka-row' },
  { id: 'k-ku', character: 'ク', romaji: 'ku', type: 'katakana', group: 'ka-row' },
  { id: 'k-ke', character: 'ケ', romaji: 'ke', type: 'katakana', group: 'ka-row' },
  { id: 'k-ko', character: 'コ', romaji: 'ko', type: 'katakana', group: 'ka-row' },
  // SA-row
  { id: 'k-sa', character: 'サ', romaji: 'sa', type: 'katakana', group: 'sa-row' },
  { id: 'k-shi', character: 'シ', romaji: 'shi', type: 'katakana', group: 'sa-row' },
  { id: 'k-su', character: 'ス', romaji: 'su', type: 'katakana', group: 'sa-row' },
  { id: 'k-se', character: 'セ', romaji: 'se', type: 'katakana', group: 'sa-row' },
  { id: 'k-so', character: 'ソ', romaji: 'so', type: 'katakana', group: 'sa-row' },
  // TA-row
  { id: 'k-ta', character: 'タ', romaji: 'ta', type: 'katakana', group: 'ta-row' },
  { id: 'k-chi', character: 'チ', romaji: 'chi', type: 'katakana', group: 'ta-row' },
  { id: 'k-tsu', character: 'ツ', romaji: 'tsu', type: 'katakana', group: 'ta-row' },
  { id: 'k-te', character: 'テ', romaji: 'te', type: 'katakana', group: 'ta-row' },
  { id: 'k-to', character: 'ト', romaji: 'to', type: 'katakana', group: 'ta-row' },
  // NA-row
  { id: 'k-na', character: 'ナ', romaji: 'na', type: 'katakana', group: 'na-row' },
  { id: 'k-ni', character: 'ニ', romaji: 'ni', type: 'katakana', group: 'na-row' },
  { id: 'k-nu', character: 'ヌ', romaji: 'nu', type: 'katakana', group: 'na-row' },
  { id: 'k-ne', character: 'ネ', romaji: 'ne', type: 'katakana', group: 'na-row' },
  { id: 'k-no', character: 'ノ', romaji: 'no', type: 'katakana', group: 'na-row' },
  // HA-row
  { id: 'k-ha', character: 'ハ', romaji: 'ha', type: 'katakana', group: 'ha-row' },
  { id: 'k-hi', character: 'ヒ', romaji: 'hi', type: 'katakana', group: 'ha-row' },
  { id: 'k-fu', character: 'フ', romaji: 'fu', type: 'katakana', group: 'ha-row' },
  { id: 'k-he', character: 'ヘ', romaji: 'he', type: 'katakana', group: 'ha-row' },
  { id: 'k-ho', character: 'ホ', romaji: 'ho', type: 'katakana', group: 'ha-row' },
  // MA-row
  { id: 'k-ma', character: 'マ', romaji: 'ma', type: 'katakana', group: 'ma-row' },
  { id: 'k-mi', character: 'ミ', romaji: 'mi', type: 'katakana', group: 'ma-row' },
  { id: 'k-mu', character: 'ム', romaji: 'mu', type: 'katakana', group: 'ma-row' },
  { id: 'k-me', character: 'メ', romaji: 'me', type: 'katakana', group: 'ma-row' },
  { id: 'k-mo', character: 'モ', romaji: 'mo', type: 'katakana', group: 'ma-row' },
  // YA-row
  { id: 'k-ya', character: 'ヤ', romaji: 'ya', type: 'katakana', group: 'ya-row' },
  { id: 'k-yu', character: 'ユ', romaji: 'yu', type: 'katakana', group: 'ya-row' },
  { id: 'k-yo', character: 'ヨ', romaji: 'yo', type: 'katakana', group: 'ya-row' },
  // RA-row
  { id: 'k-ra', character: 'ラ', romaji: 'ra', type: 'katakana', group: 'ra-row' },
  { id: 'k-ri', character: 'リ', romaji: 'ri', type: 'katakana', group: 'ra-row' },
  { id: 'k-ru', character: 'ル', romaji: 'ru', type: 'katakana', group: 'ra-row' },
  { id: 'k-re', character: 'レ', romaji: 're', type: 'katakana', group: 'ra-row' },
  { id: 'k-ro', character: 'ロ', romaji: 'ro', type: 'katakana', group: 'ra-row' },
  // WA-row + N
  { id: 'k-wa', character: 'ワ', romaji: 'wa', type: 'katakana', group: 'wa-row' },
  { id: 'k-wo', character: 'ヲ', romaji: 'wo', type: 'katakana', group: 'wa-row' },
  { id: 'k-n', character: 'ン', romaji: 'n', type: 'katakana', group: 'n' },
];

export const allKana: KanaItem[] = [...hiragana, ...katakana];

export function getKanaByType(type: 'hiragana' | 'katakana' | 'mixed'): KanaItem[] {
  if (type === 'hiragana') return hiragana;
  if (type === 'katakana') return katakana;
  return allKana;
}
