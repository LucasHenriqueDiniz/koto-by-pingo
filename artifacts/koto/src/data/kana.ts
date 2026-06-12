import type { KanaItem, KanaScript, KanaGroup, KanaExample, KanaType } from '../types/kana';

interface KanaCell {
  /** Sufixo único do id (ex: 'a', 'shi', 'kya'). Combinado com o prefixo do script vira o id final. */
  id: string;
  hira: string;
  kata: string;
  romaji: string;
  row: string;
  column: string;
  group: KanaGroup;
  /** ids (sufixo) de kana parecidos, no mesmo script. */
  similarTo?: string[];
  /** Exemplo de palavra (aplicado apenas ao hiragana). */
  example?: KanaExample;
}

const CELLS: KanaCell[] = [
  // ---------- BÁSICO: A-row ----------
  { id: 'a', hira: 'あ', kata: 'ア', romaji: 'a', row: 'a', column: 'a', group: 'basic', example: { word: 'あさ', reading: 'asa', meaningPt: 'manhã' } },
  { id: 'i', hira: 'い', kata: 'イ', romaji: 'i', row: 'a', column: 'i', group: 'basic', example: { word: 'いぬ', reading: 'inu', meaningPt: 'cachorro' } },
  { id: 'u', hira: 'う', kata: 'ウ', romaji: 'u', row: 'a', column: 'u', group: 'basic', example: { word: 'うみ', reading: 'umi', meaningPt: 'mar' } },
  { id: 'e', hira: 'え', kata: 'エ', romaji: 'e', row: 'a', column: 'e', group: 'basic', example: { word: 'えき', reading: 'eki', meaningPt: 'estação' } },
  { id: 'o', hira: 'お', kata: 'オ', romaji: 'o', row: 'a', column: 'o', group: 'basic', example: { word: 'おちゃ', reading: 'ocha', meaningPt: 'chá' } },

  // ---------- BÁSICO: KA-row ----------
  { id: 'ka', hira: 'か', kata: 'カ', romaji: 'ka', row: 'ka', column: 'a', group: 'basic', example: { word: 'かさ', reading: 'kasa', meaningPt: 'guarda-chuva' } },
  { id: 'ki', hira: 'き', kata: 'キ', romaji: 'ki', row: 'ka', column: 'i', group: 'basic', example: { word: 'きいろ', reading: 'kiiro', meaningPt: 'amarelo' } },
  { id: 'ku', hira: 'く', kata: 'ク', romaji: 'ku', row: 'ka', column: 'u', group: 'basic', similarTo: ['ta'], example: { word: 'くつ', reading: 'kutsu', meaningPt: 'sapato' } },
  { id: 'ke', hira: 'け', kata: 'ケ', romaji: 'ke', row: 'ka', column: 'e', group: 'basic', example: { word: 'けさ', reading: 'kesa', meaningPt: 'esta manhã' } },
  { id: 'ko', hira: 'こ', kata: 'コ', romaji: 'ko', row: 'ka', column: 'o', group: 'basic', example: { word: 'こども', reading: 'kodomo', meaningPt: 'criança' } },

  // ---------- BÁSICO: SA-row ----------
  { id: 'sa', hira: 'さ', kata: 'サ', romaji: 'sa', row: 'sa', column: 'a', group: 'basic', example: { word: 'さかな', reading: 'sakana', meaningPt: 'peixe' } },
  { id: 'shi', hira: 'し', kata: 'シ', romaji: 'shi', row: 'sa', column: 'i', group: 'basic', similarTo: ['tsu', 'n', 'so'], example: { word: 'しお', reading: 'shio', meaningPt: 'sal' } },
  { id: 'su', hira: 'す', kata: 'ス', romaji: 'su', row: 'sa', column: 'u', group: 'basic', example: { word: 'すし', reading: 'sushi', meaningPt: 'sushi' } },
  { id: 'se', hira: 'せ', kata: 'セ', romaji: 'se', row: 'sa', column: 'e', group: 'basic', example: { word: 'せんせい', reading: 'sensei', meaningPt: 'professor(a)' } },
  { id: 'so', hira: 'そ', kata: 'ソ', romaji: 'so', row: 'sa', column: 'o', group: 'basic', similarTo: ['shi', 'tsu', 'n'], example: { word: 'そら', reading: 'sora', meaningPt: 'céu' } },

  // ---------- BÁSICO: TA-row ----------
  { id: 'ta', hira: 'た', kata: 'タ', romaji: 'ta', row: 'ta', column: 'a', group: 'basic', similarTo: ['ku'], example: { word: 'たまご', reading: 'tamago', meaningPt: 'ovo' } },
  { id: 'chi', hira: 'ち', kata: 'チ', romaji: 'chi', row: 'ta', column: 'i', group: 'basic', example: { word: 'ちず', reading: 'chizu', meaningPt: 'mapa' } },
  { id: 'tsu', hira: 'つ', kata: 'ツ', romaji: 'tsu', row: 'ta', column: 'u', group: 'basic', similarTo: ['shi', 'n', 'so'], example: { word: 'つくえ', reading: 'tsukue', meaningPt: 'mesa' } },
  { id: 'te', hira: 'て', kata: 'テ', romaji: 'te', row: 'ta', column: 'e', group: 'basic', example: { word: 'てがみ', reading: 'tegami', meaningPt: 'carta' } },
  { id: 'to', hira: 'と', kata: 'ト', romaji: 'to', row: 'ta', column: 'o', group: 'basic', example: { word: 'とけい', reading: 'tokei', meaningPt: 'relógio' } },

  // ---------- BÁSICO: NA-row ----------
  { id: 'na', hira: 'な', kata: 'ナ', romaji: 'na', row: 'na', column: 'a', group: 'basic', example: { word: 'なつ', reading: 'natsu', meaningPt: 'verão' } },
  { id: 'ni', hira: 'に', kata: 'ニ', romaji: 'ni', row: 'na', column: 'i', group: 'basic', example: { word: 'にく', reading: 'niku', meaningPt: 'carne' } },
  { id: 'nu', hira: 'ぬ', kata: 'ヌ', romaji: 'nu', row: 'na', column: 'u', group: 'basic', similarTo: ['me'], example: { word: 'ぬの', reading: 'nuno', meaningPt: 'tecido' } },
  { id: 'ne', hira: 'ね', kata: 'ネ', romaji: 'ne', row: 'na', column: 'e', group: 'basic', similarTo: ['wa', 're', 'ru'], example: { word: 'ねこ', reading: 'neko', meaningPt: 'gato' } },
  { id: 'no', hira: 'の', kata: 'ノ', romaji: 'no', row: 'na', column: 'o', group: 'basic', example: { word: 'のみもの', reading: 'nomimono', meaningPt: 'bebida' } },

  // ---------- BÁSICO: HA-row ----------
  { id: 'ha', hira: 'は', kata: 'ハ', romaji: 'ha', row: 'ha', column: 'a', group: 'basic', similarTo: ['ho', 'ma'], example: { word: 'はな', reading: 'hana', meaningPt: 'flor' } },
  { id: 'hi', hira: 'ひ', kata: 'ヒ', romaji: 'hi', row: 'ha', column: 'i', group: 'basic', example: { word: 'ひと', reading: 'hito', meaningPt: 'pessoa' } },
  { id: 'fu', hira: 'ふ', kata: 'フ', romaji: 'fu', row: 'ha', column: 'u', group: 'basic', example: { word: 'ふゆ', reading: 'fuyu', meaningPt: 'inverno' } },
  { id: 'he', hira: 'へ', kata: 'ヘ', romaji: 'he', row: 'ha', column: 'e', group: 'basic', example: { word: 'へや', reading: 'heya', meaningPt: 'quarto' } },
  { id: 'ho', hira: 'ほ', kata: 'ホ', romaji: 'ho', row: 'ha', column: 'o', group: 'basic', similarTo: ['ha', 'ma'], example: { word: 'ほん', reading: 'hon', meaningPt: 'livro' } },

  // ---------- BÁSICO: MA-row ----------
  { id: 'ma', hira: 'ま', kata: 'マ', romaji: 'ma', row: 'ma', column: 'a', group: 'basic', similarTo: ['ha', 'ho'], example: { word: 'まど', reading: 'mado', meaningPt: 'janela' } },
  { id: 'mi', hira: 'み', kata: 'ミ', romaji: 'mi', row: 'ma', column: 'i', group: 'basic', example: { word: 'みず', reading: 'mizu', meaningPt: 'água' } },
  { id: 'mu', hira: 'む', kata: 'ム', romaji: 'mu', row: 'ma', column: 'u', group: 'basic', example: { word: 'むし', reading: 'mushi', meaningPt: 'inseto' } },
  { id: 'me', hira: 'め', kata: 'メ', romaji: 'me', row: 'ma', column: 'e', group: 'basic', similarTo: ['nu'], example: { word: 'めがね', reading: 'megane', meaningPt: 'óculos' } },
  { id: 'mo', hira: 'も', kata: 'モ', romaji: 'mo', row: 'ma', column: 'o', group: 'basic', example: { word: 'もも', reading: 'momo', meaningPt: 'pêssego' } },

  // ---------- BÁSICO: YA-row ----------
  { id: 'ya', hira: 'や', kata: 'ヤ', romaji: 'ya', row: 'ya', column: 'a', group: 'basic', example: { word: 'やま', reading: 'yama', meaningPt: 'montanha' } },
  { id: 'yu', hira: 'ゆ', kata: 'ユ', romaji: 'yu', row: 'ya', column: 'u', group: 'basic', example: { word: 'ゆき', reading: 'yuki', meaningPt: 'neve' } },
  { id: 'yo', hira: 'よ', kata: 'ヨ', romaji: 'yo', row: 'ya', column: 'o', group: 'basic', example: { word: 'よる', reading: 'yoru', meaningPt: 'noite' } },

  // ---------- BÁSICO: RA-row ----------
  { id: 'ra', hira: 'ら', kata: 'ラ', romaji: 'ra', row: 'ra', column: 'a', group: 'basic', example: { word: 'らいねん', reading: 'rainen', meaningPt: 'ano que vem' } },
  { id: 'ri', hira: 'り', kata: 'リ', romaji: 'ri', row: 'ra', column: 'i', group: 'basic', example: { word: 'りんご', reading: 'ringo', meaningPt: 'maçã' } },
  { id: 'ru', hira: 'る', kata: 'ル', romaji: 'ru', row: 'ra', column: 'u', group: 'basic', similarTo: ['ne', 're', 'wa'], example: { word: 'るす', reading: 'rusu', meaningPt: 'ausência' } },
  { id: 're', hira: 'れ', kata: 'レ', romaji: 're', row: 'ra', column: 'e', group: 'basic', similarTo: ['ne', 'wa', 'ru'], example: { word: 'れいぞうこ', reading: 'reizouko', meaningPt: 'geladeira' } },
  { id: 'ro', hira: 'ろ', kata: 'ロ', romaji: 'ro', row: 'ra', column: 'o', group: 'basic', example: { word: 'ろうか', reading: 'rouka', meaningPt: 'corredor' } },

  // ---------- BÁSICO: WA-row + N ----------
  { id: 'wa', hira: 'わ', kata: 'ワ', romaji: 'wa', row: 'wa', column: 'a', group: 'basic', similarTo: ['ne', 're', 'ru'], example: { word: 'わたし', reading: 'watashi', meaningPt: 'eu' } },
  { id: 'wo', hira: 'を', kata: 'ヲ', romaji: 'wo', row: 'wa', column: 'o', group: 'basic', example: { word: 'ほんをよむ', reading: 'hon o yomu', meaningPt: 'ler o livro' } },
  { id: 'n', hira: 'ん', kata: 'ン', romaji: 'n', row: 'n', column: 'n', group: 'basic', similarTo: ['shi', 'tsu', 'so'], example: { word: 'にほん', reading: 'nihon', meaningPt: 'Japão' } },

  // ---------- DAKUTEN: GA-row ----------
  { id: 'ga', hira: 'が', kata: 'ガ', romaji: 'ga', row: 'ga', column: 'a', group: 'dakuten' },
  { id: 'gi', hira: 'ぎ', kata: 'ギ', romaji: 'gi', row: 'ga', column: 'i', group: 'dakuten' },
  { id: 'gu', hira: 'ぐ', kata: 'グ', romaji: 'gu', row: 'ga', column: 'u', group: 'dakuten' },
  { id: 'ge', hira: 'げ', kata: 'ゲ', romaji: 'ge', row: 'ga', column: 'e', group: 'dakuten' },
  { id: 'go', hira: 'ご', kata: 'ゴ', romaji: 'go', row: 'ga', column: 'o', group: 'dakuten' },

  // ---------- DAKUTEN: ZA-row ----------
  { id: 'za', hira: 'ざ', kata: 'ザ', romaji: 'za', row: 'za', column: 'a', group: 'dakuten' },
  { id: 'ji', hira: 'じ', kata: 'ジ', romaji: 'ji', row: 'za', column: 'i', group: 'dakuten' },
  { id: 'zu', hira: 'ず', kata: 'ズ', romaji: 'zu', row: 'za', column: 'u', group: 'dakuten' },
  { id: 'ze', hira: 'ぜ', kata: 'ゼ', romaji: 'ze', row: 'za', column: 'e', group: 'dakuten' },
  { id: 'zo', hira: 'ぞ', kata: 'ゾ', romaji: 'zo', row: 'za', column: 'o', group: 'dakuten' },

  // ---------- DAKUTEN: DA-row ----------
  { id: 'da', hira: 'だ', kata: 'ダ', romaji: 'da', row: 'da', column: 'a', group: 'dakuten' },
  { id: 'di', hira: 'ぢ', kata: 'ヂ', romaji: 'ji', row: 'da', column: 'i', group: 'dakuten' },
  { id: 'du', hira: 'づ', kata: 'ヅ', romaji: 'zu', row: 'da', column: 'u', group: 'dakuten' },
  { id: 'de', hira: 'で', kata: 'デ', romaji: 'de', row: 'da', column: 'e', group: 'dakuten' },
  { id: 'do', hira: 'ど', kata: 'ド', romaji: 'do', row: 'da', column: 'o', group: 'dakuten' },

  // ---------- DAKUTEN: BA-row ----------
  { id: 'ba', hira: 'ば', kata: 'バ', romaji: 'ba', row: 'ba', column: 'a', group: 'dakuten' },
  { id: 'bi', hira: 'び', kata: 'ビ', romaji: 'bi', row: 'ba', column: 'i', group: 'dakuten' },
  { id: 'bu', hira: 'ぶ', kata: 'ブ', romaji: 'bu', row: 'ba', column: 'u', group: 'dakuten' },
  { id: 'be', hira: 'べ', kata: 'ベ', romaji: 'be', row: 'ba', column: 'e', group: 'dakuten' },
  { id: 'bo', hira: 'ぼ', kata: 'ボ', romaji: 'bo', row: 'ba', column: 'o', group: 'dakuten' },

  // ---------- HANDAKUTEN: PA-row ----------
  { id: 'pa', hira: 'ぱ', kata: 'パ', romaji: 'pa', row: 'pa', column: 'a', group: 'handakuten' },
  { id: 'pi', hira: 'ぴ', kata: 'ピ', romaji: 'pi', row: 'pa', column: 'i', group: 'handakuten' },
  { id: 'pu', hira: 'ぷ', kata: 'プ', romaji: 'pu', row: 'pa', column: 'u', group: 'handakuten' },
  { id: 'pe', hira: 'ぺ', kata: 'ペ', romaji: 'pe', row: 'pa', column: 'e', group: 'handakuten' },
  { id: 'po', hira: 'ぽ', kata: 'ポ', romaji: 'po', row: 'pa', column: 'o', group: 'handakuten' },

  // ---------- YŌON: KY (き) ----------
  { id: 'kya', hira: 'きゃ', kata: 'キャ', romaji: 'kya', row: 'ky', column: 'a', group: 'yoon' },
  { id: 'kyu', hira: 'きゅ', kata: 'キュ', romaji: 'kyu', row: 'ky', column: 'u', group: 'yoon' },
  { id: 'kyo', hira: 'きょ', kata: 'キョ', romaji: 'kyo', row: 'ky', column: 'o', group: 'yoon' },

  // ---------- YŌON: SH (し) ----------
  { id: 'sha', hira: 'しゃ', kata: 'シャ', romaji: 'sha', row: 'sh', column: 'a', group: 'yoon' },
  { id: 'shu', hira: 'しゅ', kata: 'シュ', romaji: 'shu', row: 'sh', column: 'u', group: 'yoon' },
  { id: 'sho', hira: 'しょ', kata: 'ショ', romaji: 'sho', row: 'sh', column: 'o', group: 'yoon' },

  // ---------- YŌON: CH (ち) ----------
  { id: 'cha', hira: 'ちゃ', kata: 'チャ', romaji: 'cha', row: 'ch', column: 'a', group: 'yoon' },
  { id: 'chu', hira: 'ちゅ', kata: 'チュ', romaji: 'chu', row: 'ch', column: 'u', group: 'yoon' },
  { id: 'cho', hira: 'ちょ', kata: 'チョ', romaji: 'cho', row: 'ch', column: 'o', group: 'yoon' },

  // ---------- YŌON: NY (に) ----------
  { id: 'nya', hira: 'にゃ', kata: 'ニャ', romaji: 'nya', row: 'ny', column: 'a', group: 'yoon' },
  { id: 'nyu', hira: 'にゅ', kata: 'ニュ', romaji: 'nyu', row: 'ny', column: 'u', group: 'yoon' },
  { id: 'nyo', hira: 'にょ', kata: 'ニョ', romaji: 'nyo', row: 'ny', column: 'o', group: 'yoon' },

  // ---------- YŌON: HY (ひ) ----------
  { id: 'hya', hira: 'ひゃ', kata: 'ヒャ', romaji: 'hya', row: 'hy', column: 'a', group: 'yoon' },
  { id: 'hyu', hira: 'ひゅ', kata: 'ヒュ', romaji: 'hyu', row: 'hy', column: 'u', group: 'yoon' },
  { id: 'hyo', hira: 'ひょ', kata: 'ヒョ', romaji: 'hyo', row: 'hy', column: 'o', group: 'yoon' },

  // ---------- YŌON: MY (み) ----------
  { id: 'mya', hira: 'みゃ', kata: 'ミャ', romaji: 'mya', row: 'my', column: 'a', group: 'yoon' },
  { id: 'myu', hira: 'みゅ', kata: 'ミュ', romaji: 'myu', row: 'my', column: 'u', group: 'yoon' },
  { id: 'myo', hira: 'みょ', kata: 'ミョ', romaji: 'myo', row: 'my', column: 'o', group: 'yoon' },

  // ---------- YŌON: RY (り) ----------
  { id: 'rya', hira: 'りゃ', kata: 'リャ', romaji: 'rya', row: 'ry', column: 'a', group: 'yoon' },
  { id: 'ryu', hira: 'りゅ', kata: 'リュ', romaji: 'ryu', row: 'ry', column: 'u', group: 'yoon' },
  { id: 'ryo', hira: 'りょ', kata: 'リョ', romaji: 'ryo', row: 'ry', column: 'o', group: 'yoon' },

  // ---------- YŌON: GY (ぎ) ----------
  { id: 'gya', hira: 'ぎゃ', kata: 'ギャ', romaji: 'gya', row: 'gy', column: 'a', group: 'yoon' },
  { id: 'gyu', hira: 'ぎゅ', kata: 'ギュ', romaji: 'gyu', row: 'gy', column: 'u', group: 'yoon' },
  { id: 'gyo', hira: 'ぎょ', kata: 'ギョ', romaji: 'gyo', row: 'gy', column: 'o', group: 'yoon' },

  // ---------- YŌON: J (じ) ----------
  { id: 'ja', hira: 'じゃ', kata: 'ジャ', romaji: 'ja', row: 'j', column: 'a', group: 'yoon' },
  { id: 'ju', hira: 'じゅ', kata: 'ジュ', romaji: 'ju', row: 'j', column: 'u', group: 'yoon' },
  { id: 'jo', hira: 'じょ', kata: 'ジョ', romaji: 'jo', row: 'j', column: 'o', group: 'yoon' },

  // ---------- YŌON: BY (び) ----------
  { id: 'bya', hira: 'びゃ', kata: 'ビャ', romaji: 'bya', row: 'by', column: 'a', group: 'yoon' },
  { id: 'byu', hira: 'びゅ', kata: 'ビュ', romaji: 'byu', row: 'by', column: 'u', group: 'yoon' },
  { id: 'byo', hira: 'びょ', kata: 'ビョ', romaji: 'byo', row: 'by', column: 'o', group: 'yoon' },

  // ---------- YŌON: PY (ぴ) ----------
  { id: 'pya', hira: 'ぴゃ', kata: 'ピャ', romaji: 'pya', row: 'py', column: 'a', group: 'yoon' },
  { id: 'pyu', hira: 'ぴゅ', kata: 'ピュ', romaji: 'pyu', row: 'py', column: 'u', group: 'yoon' },
  { id: 'pyo', hira: 'ぴょ', kata: 'ピョ', romaji: 'pyo', row: 'py', column: 'o', group: 'yoon' },
];

function buildKana(script: KanaScript): KanaItem[] {
  const prefix = script === 'hiragana' ? 'h' : 'k';
  return CELLS.map(cell => ({
    id: `${prefix}-${cell.id}`,
    character: script === 'hiragana' ? cell.hira : cell.kata,
    romaji: cell.romaji,
    script,
    group: cell.group,
    row: cell.row,
    column: cell.column,
    similarTo: cell.similarTo?.map(s => `${prefix}-${s}`),
    examples: script === 'hiragana' && cell.example ? [cell.example] : undefined,
  }));
}

export const hiragana: KanaItem[] = buildKana('hiragana');
export const katakana: KanaItem[] = buildKana('katakana');
export const allKana: KanaItem[] = [...hiragana, ...katakana];

export function getKanaByType(type: KanaType): KanaItem[] {
  if (type === 'hiragana') return hiragana;
  if (type === 'katakana') return katakana;
  return allKana;
}

export function getKanaByScript(script: KanaScript): KanaItem[] {
  return script === 'hiragana' ? hiragana : katakana;
}

export function getKanaByGroup(items: KanaItem[], group: KanaGroup): KanaItem[] {
  return items.filter(k => k.group === group);
}

export const KANA_GROUPS: KanaGroup[] = ['basic', 'dakuten', 'handakuten', 'yoon'];

const ROW_LABELS: Record<string, string> = {
  a: 'A', ka: 'KA', sa: 'SA', ta: 'TA', na: 'NA', ha: 'HA', ma: 'MA', ya: 'YA', ra: 'RA', wa: 'WA', n: 'N',
  ga: 'GA', za: 'ZA', da: 'DA', ba: 'BA', pa: 'PA',
  ky: 'KYA/KYU/KYO', sh: 'SHA/SHU/SHO', ch: 'CHA/CHU/CHO', ny: 'NYA/NYU/NYO', hy: 'HYA/HYU/HYO',
  my: 'MYA/MYU/MYO', ry: 'RYA/RYU/RYO', gy: 'GYA/GYU/GYO', j: 'JA/JU/JO', by: 'BYA/BYU/BYO', py: 'PYA/PYU/PYO',
};

export function getRowLabel(row: string): string {
  return ROW_LABELS[row] ?? row.toUpperCase();
}
