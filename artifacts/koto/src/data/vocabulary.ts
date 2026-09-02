import type { VocabularyWord } from '../types/vocabulary';

export const vocabulary: VocabularyWord[] = [
  // Greetings
  { id: 'v-001', japanese: 'こんにちは', kana: 'こんにちは', romaji: 'konnichiwa', meaningPt: 'olá / boa tarde', category: 'saudações', level: 'N5' },
  { id: 'v-002', japanese: 'ありがとう', kana: 'ありがとう', romaji: 'arigatou', meaningPt: 'obrigado', category: 'saudações', level: 'N5' },
  { id: 'v-003', japanese: 'すみません', kana: 'すみません', romaji: 'sumimasen', meaningPt: 'com licença / desculpe', category: 'saudações', level: 'N5' },
  { id: 'v-004', japanese: 'はい', kana: 'はい', romaji: 'hai', meaningPt: 'sim', category: 'saudações', level: 'N5' },
  { id: 'v-005', japanese: 'いいえ', kana: 'いいえ', romaji: 'iie', meaningPt: 'não', category: 'saudações', level: 'N5' },
  // Numbers
  { id: 'v-006', japanese: '一', kana: 'いち', romaji: 'ichi', meaningPt: 'um', category: 'números', level: 'N5', kanjiIds: ['kj-001'] },
  { id: 'v-007', japanese: '二', kana: 'に', romaji: 'ni', meaningPt: 'dois', category: 'números', level: 'N5', kanjiIds: ['kj-002'] },
  { id: 'v-008', japanese: '三', kana: 'さん', romaji: 'san', meaningPt: 'três', category: 'números', level: 'N5', kanjiIds: ['kj-003'] },
  { id: 'v-009', japanese: '四', kana: 'よん', romaji: 'yon', meaningPt: 'quatro', category: 'números', level: 'N5', kanjiIds: ['kj-004'] },
  { id: 'v-010', japanese: '五', kana: 'ご', romaji: 'go', meaningPt: 'cinco', category: 'números', level: 'N5', kanjiIds: ['kj-005'] },
  // Family
  { id: 'v-011', japanese: 'お母さん', kana: 'おかあさん', romaji: 'okaasan', meaningPt: 'mãe', category: 'família', level: 'N5', kanjiIds: ['kj-016'] },
  { id: 'v-012', japanese: 'お父さん', kana: 'おとうさん', romaji: 'otousan', meaningPt: 'pai', category: 'família', level: 'N5', kanjiIds: ['kj-017'] },
  { id: 'v-013', japanese: '兄', kana: 'あに', romaji: 'ani', meaningPt: 'irmão mais velho', category: 'família', level: 'N5', kanjiIds: ['kj-018'] },
  { id: 'v-014', japanese: '妹', kana: 'いもうと', romaji: 'imouto', meaningPt: 'irmã mais nova', category: 'família', level: 'N5', kanjiIds: ['kj-019'] },
  // Food
  { id: 'v-015', japanese: '水', kana: 'みず', romaji: 'mizu', meaningPt: 'água', category: 'comida', level: 'N5', kanjiIds: ['kj-039'] },
  { id: 'v-016', japanese: '食べる', kana: 'たべる', romaji: 'taberu', meaningPt: 'comer', category: 'verbos', level: 'N5', kanjiIds: ['kj-051'] },
  { id: 'v-017', japanese: '飲む', kana: 'のむ', romaji: 'nomu', meaningPt: 'beber', category: 'verbos', level: 'N5', kanjiIds: ['kj-052'] },
  { id: 'v-018', japanese: 'ご飯', kana: 'ごはん', romaji: 'gohan', meaningPt: 'arroz / refeição', category: 'comida', level: 'N5', kanjiIds: ['kj-053'] },
  { id: 'v-019', japanese: 'パン', kana: 'パン', romaji: 'pan', meaningPt: 'pão', category: 'comida', level: 'N5' },
  { id: 'v-020', japanese: '魚', kana: 'さかな', romaji: 'sakana', meaningPt: 'peixe', category: 'comida', level: 'N5', kanjiIds: ['kj-054'] },
  // Colors
  { id: 'v-021', japanese: '赤い', kana: 'あかい', romaji: 'akai', meaningPt: 'vermelho', category: 'cores', level: 'N5', kanjiIds: ['kj-057'] },
  { id: 'v-022', japanese: '青い', kana: 'あおい', romaji: 'aoi', meaningPt: 'azul', category: 'cores', level: 'N5', kanjiIds: ['kj-058'] },
  { id: 'v-023', japanese: '白い', kana: 'しろい', romaji: 'shiroi', meaningPt: 'branco', category: 'cores', level: 'N5', kanjiIds: ['kj-059'] },
  { id: 'v-024', japanese: '黒い', kana: 'くろい', romaji: 'kuroi', meaningPt: 'preto', category: 'cores', level: 'N5', kanjiIds: ['kj-060'] },
  // Time
  { id: 'v-025', japanese: '今日', kana: 'きょう', romaji: 'kyou', meaningPt: 'hoje', category: 'tempo', level: 'N5', kanjiIds: ['kj-026', 'kj-027'] },
  { id: 'v-026', japanese: '明日', kana: 'あした', romaji: 'ashita', meaningPt: 'amanhã', category: 'tempo', level: 'N5', kanjiIds: ['kj-028', 'kj-027'] },
  { id: 'v-027', japanese: '昨日', kana: 'きのう', romaji: 'kinou', meaningPt: 'ontem', category: 'tempo', level: 'N5', kanjiIds: ['kj-029', 'kj-027'] },
  { id: 'v-028', japanese: '時間', kana: 'じかん', romaji: 'jikan', meaningPt: 'tempo / hora', category: 'tempo', level: 'N5', kanjiIds: ['kj-030', 'kj-031'] },
  // Places
  { id: 'v-029', japanese: '学校', kana: 'がっこう', romaji: 'gakkou', meaningPt: 'escola', category: 'lugares', level: 'N5', kanjiIds: ['kj-061', 'kj-062'] },
  { id: 'v-030', japanese: '家', kana: 'いえ', romaji: 'ie', meaningPt: 'casa', category: 'lugares', level: 'N5', kanjiIds: ['kj-063'] },
  { id: 'v-031', japanese: '駅', kana: 'えき', romaji: 'eki', meaningPt: 'estação (trem)', category: 'lugares', level: 'N5', kanjiIds: ['kj-064'] },
  { id: 'v-032', japanese: '本屋', kana: 'ほんや', romaji: 'honya', meaningPt: 'livraria', category: 'lugares', level: 'N5', kanjiIds: ['kj-065', 'kj-066'] },
  // Verbs
  { id: 'v-033', japanese: '行く', kana: 'いく', romaji: 'iku', meaningPt: 'ir', category: 'verbos', level: 'N5', kanjiIds: ['kj-074'] },
  { id: 'v-034', japanese: '来る', kana: 'くる', romaji: 'kuru', meaningPt: 'vir', category: 'verbos', level: 'N5', kanjiIds: ['kj-075'] },
  { id: 'v-035', japanese: '見る', kana: 'みる', romaji: 'miru', meaningPt: 'ver', category: 'verbos', level: 'N5', kanjiIds: ['kj-076'] },
  { id: 'v-036', japanese: '聞く', kana: 'きく', romaji: 'kiku', meaningPt: 'ouvir / perguntar', category: 'verbos', level: 'N5', kanjiIds: ['kj-077'] },
  { id: 'v-037', japanese: '話す', kana: 'はなす', romaji: 'hanasu', meaningPt: 'falar', category: 'verbos', level: 'N5', kanjiIds: ['kj-078'] },
  { id: 'v-038', japanese: '読む', kana: 'よむ', romaji: 'yomu', meaningPt: 'ler', category: 'verbos', level: 'N5', kanjiIds: ['kj-079'] },
  { id: 'v-039', japanese: '書く', kana: 'かく', romaji: 'kaku', meaningPt: 'escrever', category: 'verbos', level: 'N5', kanjiIds: ['kj-080'] },
  { id: 'v-040', japanese: '分かる', kana: 'わかる', romaji: 'wakaru', meaningPt: 'entender', category: 'verbos', level: 'N5', kanjiIds: ['kj-081'] },
  // Adjectives
  { id: 'v-041', japanese: '大きい', kana: 'おおきい', romaji: 'ookii', meaningPt: 'grande', category: 'adjetivos', level: 'N5', kanjiIds: ['kj-088'] },
  { id: 'v-042', japanese: '小さい', kana: 'ちいさい', romaji: 'chiisai', meaningPt: 'pequeno', category: 'adjetivos', level: 'N5', kanjiIds: ['kj-089'] },
  { id: 'v-043', japanese: '新しい', kana: 'あたらしい', romaji: 'atarashii', meaningPt: 'novo', category: 'adjetivos', level: 'N5', kanjiIds: ['kj-090'] },
  { id: 'v-044', japanese: '古い', kana: 'ふるい', romaji: 'furui', meaningPt: 'velho / antigo', category: 'adjetivos', level: 'N5', kanjiIds: ['kj-091'] },
  { id: 'v-045', japanese: '良い', kana: 'よい', romaji: 'yoi', meaningPt: 'bom', category: 'adjetivos', level: 'N5', kanjiIds: ['kj-092'] },
];

export const categories = [...new Set(vocabulary.map(w => w.category))];

export function getByCategory(category: string): VocabularyWord[] {
  return vocabulary.filter(w => w.category === category);
}

export function getRandomWords(count: number, exclude?: string[]): VocabularyWord[] {
  const pool = exclude ? vocabulary.filter(w => !exclude.includes(w.id)) : [...vocabulary];
  const shuffled = pool.sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}
