import type { KanjiItem } from '../types/kanji';

/**
 * N5 seed (~100 kanji). `exampleWordIds` points at data/vocabulary.ts when the word
 * already exists there (kanji ↔ vocabulary cross-link); otherwise `examples` is used inline.
 */
export const kanji: KanjiItem[] = [
  // ---------- Numbers ----------
  { id: 'kj-001', character: '一', onyomi: ['イチ'], kunyomi: ['ひと'], meaningPt: 'um', jlptLevel: 'N5', strokeCount: 1, exampleWordIds: ['v-006'] },
  { id: 'kj-002', character: '二', onyomi: ['ニ'], kunyomi: ['ふた'], meaningPt: 'dois', jlptLevel: 'N5', strokeCount: 2, exampleWordIds: ['v-007'] },
  { id: 'kj-003', character: '三', onyomi: ['サン'], kunyomi: ['みっ'], meaningPt: 'três', jlptLevel: 'N5', strokeCount: 3, exampleWordIds: ['v-008'] },
  { id: 'kj-004', character: '四', onyomi: ['シ'], kunyomi: ['よん', 'よっ'], meaningPt: 'quatro', jlptLevel: 'N5', strokeCount: 5, exampleWordIds: ['v-009'] },
  { id: 'kj-005', character: '五', onyomi: ['ゴ'], kunyomi: ['いつ'], meaningPt: 'cinco', jlptLevel: 'N5', strokeCount: 4, exampleWordIds: ['v-010'] },
  { id: 'kj-006', character: '六', onyomi: ['ロク'], kunyomi: ['むっ'], meaningPt: 'seis', jlptLevel: 'N5', strokeCount: 4, examples: [{ japanese: '六つ', reading: 'むっつ', meaningPt: 'seis (coisas)' }] },
  { id: 'kj-007', character: '七', onyomi: ['シチ'], kunyomi: ['なな'], meaningPt: 'sete', jlptLevel: 'N5', strokeCount: 2, examples: [{ japanese: '七つ', reading: 'ななつ', meaningPt: 'sete (coisas)' }] },
  { id: 'kj-008', character: '八', onyomi: ['ハチ'], kunyomi: ['やっ'], meaningPt: 'oito', jlptLevel: 'N5', strokeCount: 2, examples: [{ japanese: '八つ', reading: 'やっつ', meaningPt: 'oito (coisas)' }] },
  { id: 'kj-009', character: '九', onyomi: ['キュウ'], kunyomi: ['ここの'], meaningPt: 'nove', jlptLevel: 'N5', strokeCount: 2, examples: [{ japanese: '九つ', reading: 'ここのつ', meaningPt: 'nove (coisas)' }] },
  { id: 'kj-010', character: '十', onyomi: ['ジュウ'], kunyomi: ['とお'], meaningPt: 'dez', jlptLevel: 'N5', strokeCount: 2, examples: [{ japanese: '十', reading: 'じゅう', meaningPt: 'dez' }] },
  { id: 'kj-011', character: '百', onyomi: ['ヒャク'], kunyomi: [], meaningPt: 'cem', jlptLevel: 'N5', strokeCount: 6, examples: [{ japanese: '百', reading: 'ひゃく', meaningPt: 'cem' }] },
  { id: 'kj-012', character: '千', onyomi: ['セン'], kunyomi: [], meaningPt: 'mil', jlptLevel: 'N5', strokeCount: 3, examples: [{ japanese: '千', reading: 'せん', meaningPt: 'mil' }] },
  { id: 'kj-013', character: '万', onyomi: ['マン'], kunyomi: [], meaningPt: 'dez mil', jlptLevel: 'N5', strokeCount: 3, examples: [{ japanese: '一万', reading: 'いちまん', meaningPt: 'dez mil' }] },
  { id: 'kj-014', character: '円', onyomi: ['エン'], kunyomi: [], meaningPt: 'iene / círculo', jlptLevel: 'N5', strokeCount: 4, examples: [{ japanese: '百円', reading: 'ひゃくえん', meaningPt: 'cem ienes' }] },

  // ---------- Family and people ----------
  { id: 'kj-015', character: '人', onyomi: ['ジン', 'ニン'], kunyomi: ['ひと'], meaningPt: 'pessoa', jlptLevel: 'N5', strokeCount: 2, examples: [{ japanese: '日本人', reading: 'にほんじん', meaningPt: 'japonês (pessoa)' }] },
  { id: 'kj-016', character: '母', onyomi: ['ボ'], kunyomi: ['かあ'], meaningPt: 'mãe', jlptLevel: 'N5', strokeCount: 5, exampleWordIds: ['v-011'] },
  { id: 'kj-017', character: '父', onyomi: ['フ'], kunyomi: ['とう'], meaningPt: 'pai', jlptLevel: 'N5', strokeCount: 4, exampleWordIds: ['v-012'] },
  { id: 'kj-018', character: '兄', onyomi: ['ケイ'], kunyomi: ['あに'], meaningPt: 'irmão mais velho', jlptLevel: 'N5', strokeCount: 5, exampleWordIds: ['v-013'] },
  { id: 'kj-019', character: '妹', onyomi: ['マイ'], kunyomi: ['いもうと'], meaningPt: 'irmã mais nova', jlptLevel: 'N5', strokeCount: 8, exampleWordIds: ['v-014'] },
  { id: 'kj-020', character: '女', onyomi: ['ジョ'], kunyomi: ['おんな'], meaningPt: 'mulher', jlptLevel: 'N5', strokeCount: 3, examples: [{ japanese: '女の子', reading: 'おんなのこ', meaningPt: 'menina' }] },
  { id: 'kj-021', character: '男', onyomi: ['ダン'], kunyomi: ['おとこ'], meaningPt: 'homem', jlptLevel: 'N5', strokeCount: 7, examples: [{ japanese: '男の子', reading: 'おとこのこ', meaningPt: 'menino' }] },
  { id: 'kj-022', character: '子', onyomi: ['シ'], kunyomi: ['こ'], meaningPt: 'criança', jlptLevel: 'N5', strokeCount: 3, examples: [{ japanese: '子供', reading: 'こども', meaningPt: 'criança' }] },
  { id: 'kj-023', character: '友', onyomi: ['ユウ'], kunyomi: ['とも'], meaningPt: 'amigo', jlptLevel: 'N5', strokeCount: 4, examples: [{ japanese: '友達', reading: 'ともだち', meaningPt: 'amigo(a)' }] },
  { id: 'kj-024', character: '先', onyomi: ['セン'], kunyomi: [], meaningPt: 'antes / à frente', jlptLevel: 'N5', strokeCount: 6, examples: [{ japanese: '先生', reading: 'せんせい', meaningPt: 'professor(a)' }] },
  { id: 'kj-025', character: '生', onyomi: ['セイ'], kunyomi: ['い'], meaningPt: 'nascer / vida', jlptLevel: 'N5', strokeCount: 5, examples: [{ japanese: '学生', reading: 'がくせい', meaningPt: 'estudante' }] },

  // ---------- Time ----------
  { id: 'kj-026', character: '今', onyomi: ['コン'], kunyomi: ['いま'], meaningPt: 'agora', jlptLevel: 'N5', strokeCount: 4, exampleWordIds: ['v-025'] },
  { id: 'kj-027', character: '日', onyomi: ['ニチ'], kunyomi: ['ひ', 'か'], meaningPt: 'dia / sol', jlptLevel: 'N5', strokeCount: 4, exampleWordIds: ['v-025'] },
  { id: 'kj-028', character: '明', onyomi: ['メイ'], kunyomi: ['あ'], meaningPt: 'claro / amanhã', jlptLevel: 'N5', strokeCount: 8, exampleWordIds: ['v-026'] },
  { id: 'kj-029', character: '昨', onyomi: ['サク'], kunyomi: [], meaningPt: 'ontem / passado', jlptLevel: 'N5', strokeCount: 9, exampleWordIds: ['v-027'] },
  { id: 'kj-030', character: '時', onyomi: ['ジ'], kunyomi: ['とき'], meaningPt: 'hora / tempo', jlptLevel: 'N5', strokeCount: 10, exampleWordIds: ['v-028'] },
  { id: 'kj-031', character: '間', onyomi: ['カン'], kunyomi: ['あいだ'], meaningPt: 'intervalo / entre', jlptLevel: 'N5', strokeCount: 12, exampleWordIds: ['v-028'] },
  { id: 'kj-032', character: '年', onyomi: ['ネン'], kunyomi: ['とし'], meaningPt: 'ano', jlptLevel: 'N5', strokeCount: 6, examples: [{ japanese: '今年', reading: 'こんねん', meaningPt: 'este ano' }] },
  { id: 'kj-033', character: '月', onyomi: ['ゲツ'], kunyomi: ['つき'], meaningPt: 'mês / lua', jlptLevel: 'N5', strokeCount: 4, examples: [{ japanese: '一月', reading: 'いちがつ', meaningPt: 'janeiro' }] },
  { id: 'kj-034', character: '午', onyomi: ['ゴ'], kunyomi: [], meaningPt: 'meio-dia', jlptLevel: 'N5', strokeCount: 4, examples: [{ japanese: '午前', reading: 'ごぜん', meaningPt: 'manhã (antes do meio-dia)' }] },
  { id: 'kj-035', character: '前', onyomi: ['ゼン'], kunyomi: ['まえ'], meaningPt: 'antes / frente', jlptLevel: 'N5', strokeCount: 9, examples: [{ japanese: '午前', reading: 'ごぜん', meaningPt: 'manhã' }] },
  { id: 'kj-036', character: '後', onyomi: ['ゴ'], kunyomi: ['あと'], meaningPt: 'depois / atrás', jlptLevel: 'N5', strokeCount: 9, examples: [{ japanese: '午後', reading: 'ごご', meaningPt: 'tarde (depois do meio-dia)' }] },
  { id: 'kj-037', character: '週', onyomi: ['シュウ'], kunyomi: [], meaningPt: 'semana', jlptLevel: 'N5', strokeCount: 11, examples: [{ japanese: '毎週', reading: 'まいしゅう', meaningPt: 'toda semana' }] },
  { id: 'kj-038', character: '毎', onyomi: ['マイ'], kunyomi: [], meaningPt: 'cada / todo', jlptLevel: 'N5', strokeCount: 6, examples: [{ japanese: '毎日', reading: 'まいにち', meaningPt: 'todos os dias' }] },

  // ---------- Nature and weekdays ----------
  { id: 'kj-039', character: '水', onyomi: ['スイ'], kunyomi: ['みず'], meaningPt: 'água', jlptLevel: 'N5', strokeCount: 4, exampleWordIds: ['v-015'] },
  { id: 'kj-040', character: '火', onyomi: ['カ'], kunyomi: ['ひ'], meaningPt: 'fogo', jlptLevel: 'N5', strokeCount: 4, examples: [{ japanese: '火曜日', reading: 'かようび', meaningPt: 'terça-feira' }] },
  { id: 'kj-041', character: '木', onyomi: ['モク'], kunyomi: ['き'], meaningPt: 'árvore / madeira', jlptLevel: 'N5', strokeCount: 4, examples: [{ japanese: '木曜日', reading: 'もくようび', meaningPt: 'quinta-feira' }] },
  { id: 'kj-042', character: '金', onyomi: ['キン'], kunyomi: ['かね'], meaningPt: 'dinheiro / ouro', jlptLevel: 'N5', strokeCount: 8, examples: [{ japanese: '金曜日', reading: 'きんようび', meaningPt: 'sexta-feira' }] },
  { id: 'kj-043', character: '土', onyomi: ['ド'], kunyomi: ['つち'], meaningPt: 'terra / solo', jlptLevel: 'N5', strokeCount: 3, examples: [{ japanese: '土曜日', reading: 'どようび', meaningPt: 'sábado' }] },
  { id: 'kj-044', character: '曜', onyomi: ['ヨウ'], kunyomi: [], meaningPt: 'dia da semana', jlptLevel: 'N5', strokeCount: 18, examples: [{ japanese: '何曜日', reading: 'なんようび', meaningPt: 'que dia da semana' }] },
  { id: 'kj-045', character: '山', onyomi: ['サン'], kunyomi: ['やま'], meaningPt: 'montanha', jlptLevel: 'N5', strokeCount: 3, examples: [{ japanese: '富士山', reading: 'ふじさん', meaningPt: 'monte Fuji' }] },
  { id: 'kj-046', character: '川', onyomi: ['セン'], kunyomi: ['かわ'], meaningPt: 'rio', jlptLevel: 'N5', strokeCount: 3, examples: [{ japanese: '川', reading: 'かわ', meaningPt: 'rio' }] },
  { id: 'kj-047', character: '天', onyomi: ['テン'], kunyomi: [], meaningPt: 'céu', jlptLevel: 'N5', strokeCount: 4, examples: [{ japanese: '天気', reading: 'てんき', meaningPt: 'clima' }] },
  { id: 'kj-048', character: '気', onyomi: ['キ'], kunyomi: [], meaningPt: 'ar / espírito', jlptLevel: 'N5', strokeCount: 6, examples: [{ japanese: '天気', reading: 'てんき', meaningPt: 'clima' }] },
  { id: 'kj-049', character: '雨', onyomi: ['ウ'], kunyomi: ['あめ'], meaningPt: 'chuva', jlptLevel: 'N5', strokeCount: 8, examples: [{ japanese: '雨', reading: 'あめ', meaningPt: 'chuva' }] },
  { id: 'kj-050', character: '花', onyomi: ['カ'], kunyomi: ['はな'], meaningPt: 'flor', jlptLevel: 'N5', strokeCount: 7, examples: [{ japanese: '花', reading: 'はな', meaningPt: 'flor' }] },

  // ---------- Food ----------
  { id: 'kj-051', character: '食', onyomi: ['ショク'], kunyomi: ['た'], meaningPt: 'comer / comida', jlptLevel: 'N5', strokeCount: 9, exampleWordIds: ['v-016'] },
  { id: 'kj-052', character: '飲', onyomi: ['イン'], kunyomi: ['の'], meaningPt: 'beber', jlptLevel: 'N5', strokeCount: 12, exampleWordIds: ['v-017'] },
  { id: 'kj-053', character: '飯', onyomi: ['ハン'], kunyomi: [], meaningPt: 'arroz cozido / refeição', jlptLevel: 'N5', strokeCount: 12, exampleWordIds: ['v-018'] },
  { id: 'kj-054', character: '魚', onyomi: ['ギョ'], kunyomi: ['さかな'], meaningPt: 'peixe', jlptLevel: 'N5', strokeCount: 11, exampleWordIds: ['v-020'] },
  { id: 'kj-055', character: '肉', onyomi: ['ニク'], kunyomi: [], meaningPt: 'carne', jlptLevel: 'N5', strokeCount: 6, examples: [{ japanese: '肉', reading: 'にく', meaningPt: 'carne' }] },
  { id: 'kj-056', character: '茶', onyomi: ['チャ'], kunyomi: [], meaningPt: 'chá', jlptLevel: 'N5', strokeCount: 9, examples: [{ japanese: 'お茶', reading: 'おちゃ', meaningPt: 'chá' }] },

  // ---------- Colors ----------
  { id: 'kj-057', character: '赤', onyomi: ['セキ'], kunyomi: ['あか'], meaningPt: 'vermelho', jlptLevel: 'N5', strokeCount: 7, exampleWordIds: ['v-021'] },
  { id: 'kj-058', character: '青', onyomi: ['セイ'], kunyomi: ['あお'], meaningPt: 'azul', jlptLevel: 'N5', strokeCount: 8, exampleWordIds: ['v-022'] },
  { id: 'kj-059', character: '白', onyomi: ['ハク'], kunyomi: ['しろ'], meaningPt: 'branco', jlptLevel: 'N5', strokeCount: 5, exampleWordIds: ['v-023'] },
  { id: 'kj-060', character: '黒', onyomi: ['コク'], kunyomi: ['くろ'], meaningPt: 'preto', jlptLevel: 'N5', strokeCount: 11, exampleWordIds: ['v-024'] },

  // ---------- Places ----------
  { id: 'kj-061', character: '学', onyomi: ['ガク'], kunyomi: [], meaningPt: 'estudo / aprendizado', jlptLevel: 'N5', strokeCount: 8, exampleWordIds: ['v-029'] },
  { id: 'kj-062', character: '校', onyomi: ['コウ'], kunyomi: [], meaningPt: 'escola', jlptLevel: 'N5', strokeCount: 10, exampleWordIds: ['v-029'] },
  { id: 'kj-063', character: '家', onyomi: ['カ'], kunyomi: ['いえ'], meaningPt: 'casa', jlptLevel: 'N5', strokeCount: 10, exampleWordIds: ['v-030'] },
  { id: 'kj-064', character: '駅', onyomi: ['エキ'], kunyomi: [], meaningPt: 'estação (trem)', jlptLevel: 'N5', strokeCount: 14, exampleWordIds: ['v-031'] },
  { id: 'kj-065', character: '本', onyomi: ['ホン'], kunyomi: [], meaningPt: 'livro / origem', jlptLevel: 'N5', strokeCount: 5, exampleWordIds: ['v-032'] },
  { id: 'kj-066', character: '屋', onyomi: ['オク'], kunyomi: ['や'], meaningPt: 'loja / casa', jlptLevel: 'N5', strokeCount: 9, exampleWordIds: ['v-032'] },
  { id: 'kj-067', character: '国', onyomi: ['コク'], kunyomi: ['くに'], meaningPt: 'país', jlptLevel: 'N5', strokeCount: 8, examples: [{ japanese: '外国', reading: 'がいこく', meaningPt: 'país estrangeiro' }] },
  { id: 'kj-068', character: '外', onyomi: ['ガイ'], kunyomi: ['そと'], meaningPt: 'fora / exterior', jlptLevel: 'N5', strokeCount: 5, examples: [{ japanese: '外国', reading: 'がいこく', meaningPt: 'país estrangeiro' }] },
  { id: 'kj-069', character: '店', onyomi: ['テン'], kunyomi: ['みせ'], meaningPt: 'loja', jlptLevel: 'N5', strokeCount: 8, examples: [{ japanese: 'お店', reading: 'おみせ', meaningPt: 'loja' }] },
  { id: 'kj-070', character: '社', onyomi: ['シャ'], kunyomi: [], meaningPt: 'empresa / santuário', jlptLevel: 'N5', strokeCount: 7, examples: [{ japanese: '会社', reading: 'かいしゃ', meaningPt: 'empresa' }] },
  { id: 'kj-071', character: '会', onyomi: ['カイ'], kunyomi: ['あ'], meaningPt: 'encontrar / reunião', jlptLevel: 'N5', strokeCount: 6, examples: [{ japanese: '会社', reading: 'かいしゃ', meaningPt: 'empresa' }] },
  { id: 'kj-072', character: '室', onyomi: ['シツ'], kunyomi: [], meaningPt: 'sala', jlptLevel: 'N5', strokeCount: 9, examples: [{ japanese: '教室', reading: 'きょうしつ', meaningPt: 'sala de aula' }] },
  { id: 'kj-073', character: '教', onyomi: ['キョウ'], kunyomi: ['おし'], meaningPt: 'ensinar', jlptLevel: 'N5', strokeCount: 11, examples: [{ japanese: '教室', reading: 'きょうしつ', meaningPt: 'sala de aula' }] },

  // ---------- Verbs ----------
  { id: 'kj-074', character: '行', onyomi: ['コウ'], kunyomi: ['い'], meaningPt: 'ir', jlptLevel: 'N5', strokeCount: 6, exampleWordIds: ['v-033'] },
  { id: 'kj-075', character: '来', onyomi: ['ライ'], kunyomi: ['く'], meaningPt: 'vir', jlptLevel: 'N5', strokeCount: 7, exampleWordIds: ['v-034'] },
  { id: 'kj-076', character: '見', onyomi: ['ケン'], kunyomi: ['み'], meaningPt: 'ver', jlptLevel: 'N5', strokeCount: 7, exampleWordIds: ['v-035'] },
  { id: 'kj-077', character: '聞', onyomi: ['ブン'], kunyomi: ['き'], meaningPt: 'ouvir / perguntar', jlptLevel: 'N5', strokeCount: 14, exampleWordIds: ['v-036'] },
  { id: 'kj-078', character: '話', onyomi: ['ワ'], kunyomi: ['はな'], meaningPt: 'falar', jlptLevel: 'N5', strokeCount: 13, exampleWordIds: ['v-037'] },
  { id: 'kj-079', character: '読', onyomi: ['ドク'], kunyomi: ['よ'], meaningPt: 'ler', jlptLevel: 'N5', strokeCount: 14, exampleWordIds: ['v-038'] },
  { id: 'kj-080', character: '書', onyomi: ['ショ'], kunyomi: ['か'], meaningPt: 'escrever', jlptLevel: 'N5', strokeCount: 10, exampleWordIds: ['v-039'] },
  { id: 'kj-081', character: '分', onyomi: ['ブン'], kunyomi: ['わ'], meaningPt: 'dividir / entender', jlptLevel: 'N5', strokeCount: 4, exampleWordIds: ['v-040'] },
  { id: 'kj-082', character: '出', onyomi: ['シュツ'], kunyomi: ['で'], meaningPt: 'sair', jlptLevel: 'N5', strokeCount: 5, examples: [{ japanese: '出る', reading: 'でる', meaningPt: 'saír' }] },
  { id: 'kj-083', character: '入', onyomi: ['ニュウ'], kunyomi: ['はい'], meaningPt: 'entrar', jlptLevel: 'N5', strokeCount: 2, examples: [{ japanese: '入る', reading: 'はいる', meaningPt: 'entrar' }] },
  { id: 'kj-084', character: '立', onyomi: ['リツ'], kunyomi: ['た'], meaningPt: 'ficar de pé', jlptLevel: 'N5', strokeCount: 5, examples: [{ japanese: '立つ', reading: 'たつ', meaningPt: 'levantar / ficar de pé' }] },
  { id: 'kj-085', character: '休', onyomi: ['キュウ'], kunyomi: ['やす'], meaningPt: 'descansar', jlptLevel: 'N5', strokeCount: 6, examples: [{ japanese: '休む', reading: 'やすむ', meaningPt: 'descansar' }] },
  { id: 'kj-086', character: '買', onyomi: ['バイ'], kunyomi: ['か'], meaningPt: 'comprar', jlptLevel: 'N5', strokeCount: 12, examples: [{ japanese: '買う', reading: 'かう', meaningPt: 'comprar' }] },
  { id: 'kj-087', character: '言', onyomi: ['ゲン'], kunyomi: ['い'], meaningPt: 'dizer', jlptLevel: 'N5', strokeCount: 7, examples: [{ japanese: '言う', reading: 'いう', meaningPt: 'dizer' }] },

  // ---------- Adjectives and qualities ----------
  { id: 'kj-088', character: '大', onyomi: ['ダイ'], kunyomi: ['おお'], meaningPt: 'grande', jlptLevel: 'N5', strokeCount: 3, exampleWordIds: ['v-041'] },
  { id: 'kj-089', character: '小', onyomi: ['ショウ'], kunyomi: ['こ'], meaningPt: 'pequeno', jlptLevel: 'N5', strokeCount: 3, exampleWordIds: ['v-042'] },
  { id: 'kj-090', character: '新', onyomi: ['シン'], kunyomi: ['あたら'], meaningPt: 'novo', jlptLevel: 'N5', strokeCount: 13, exampleWordIds: ['v-043'] },
  { id: 'kj-091', character: '古', onyomi: ['コ'], kunyomi: ['ふる'], meaningPt: 'velho / antigo', jlptLevel: 'N5', strokeCount: 5, exampleWordIds: ['v-044'] },
  { id: 'kj-092', character: '良', onyomi: ['リョウ'], kunyomi: ['よ'], meaningPt: 'bom', jlptLevel: 'N5', strokeCount: 7, exampleWordIds: ['v-045'] },
  { id: 'kj-093', character: '高', onyomi: ['コウ'], kunyomi: ['たか'], meaningPt: 'alto / caro', jlptLevel: 'N5', strokeCount: 10, examples: [{ japanese: '高い', reading: 'たかい', meaningPt: 'alto / caro' }] },
  { id: 'kj-094', character: '安', onyomi: ['アン'], kunyomi: ['やす'], meaningPt: 'barato / seguro', jlptLevel: 'N5', strokeCount: 6, examples: [{ japanese: '安い', reading: 'やすい', meaningPt: 'barato' }] },
  { id: 'kj-095', character: '長', onyomi: ['チョウ'], kunyomi: ['なが'], meaningPt: 'longo / chefe', jlptLevel: 'N5', strokeCount: 8, examples: [{ japanese: '長い', reading: 'ながい', meaningPt: 'longo' }] },
  { id: 'kj-096', character: '多', onyomi: ['タ'], kunyomi: ['おお'], meaningPt: 'muito', jlptLevel: 'N5', strokeCount: 6, examples: [{ japanese: '多い', reading: 'おおい', meaningPt: 'muitos' }] },
  { id: 'kj-097', character: '少', onyomi: ['ショウ'], kunyomi: ['すこ'], meaningPt: 'pouco', jlptLevel: 'N5', strokeCount: 4, examples: [{ japanese: '少ない', reading: 'すくない', meaningPt: 'pouco' }] },

  // ---------- Body, language and miscellaneous ----------
  { id: 'kj-098', character: '体', onyomi: ['タイ'], kunyomi: ['からだ'], meaningPt: 'corpo', jlptLevel: 'N5', strokeCount: 7, examples: [{ japanese: '体', reading: 'からだ', meaningPt: 'corpo' }] },
  { id: 'kj-099', character: '語', onyomi: ['ゴ'], kunyomi: [], meaningPt: 'língua / palavra', jlptLevel: 'N5', strokeCount: 14, examples: [{ japanese: '日本語', reading: 'にほんご', meaningPt: 'língua japonesa' }] },
  { id: 'kj-100', character: '名', onyomi: ['メイ'], kunyomi: ['な'], meaningPt: 'nome', jlptLevel: 'N5', strokeCount: 6, examples: [{ japanese: '名前', reading: 'なまえ', meaningPt: 'nome' }] },

  // ---------- N4 (first batch, ~45 kanji) ----------
  // Everyday actions
  { id: 'kj-101', character: '有', onyomi: ['ユウ'], kunyomi: ['あ'], meaningPt: 'ter / existir', jlptLevel: 'N4', strokeCount: 6, examples: [{ japanese: '有名', reading: 'ゆうめい', meaningPt: 'famoso' }] },
  { id: 'kj-102', character: '使', onyomi: ['シ'], kunyomi: ['つか'], meaningPt: 'usar', jlptLevel: 'N4', strokeCount: 8, examples: [{ japanese: '使う', reading: 'つかう', meaningPt: 'usar' }] },
  { id: 'kj-103', character: '働', onyomi: ['ドウ'], kunyomi: ['はたら'], meaningPt: 'trabalhar', jlptLevel: 'N4', strokeCount: 13, examples: [{ japanese: '働く', reading: 'はたらく', meaningPt: 'trabalhar' }] },
  { id: 'kj-104', character: '作', onyomi: ['サク', 'サ'], kunyomi: ['つく'], meaningPt: 'fazer / criar', jlptLevel: 'N4', strokeCount: 7, examples: [{ japanese: '作る', reading: 'つくる', meaningPt: 'fazer / criar' }] },
  { id: 'kj-105', character: '始', onyomi: ['シ'], kunyomi: ['はじ'], meaningPt: 'começar', jlptLevel: 'N4', strokeCount: 8, examples: [{ japanese: '始める', reading: 'はじめる', meaningPt: 'começar' }] },
  { id: 'kj-106', character: '終', onyomi: ['シュウ'], kunyomi: ['お'], meaningPt: 'terminar', jlptLevel: 'N4', strokeCount: 11, examples: [{ japanese: '終わる', reading: 'おわる', meaningPt: 'terminar' }] },
  { id: 'kj-107', character: '開', onyomi: ['カイ'], kunyomi: ['ひら', 'あ'], meaningPt: 'abrir', jlptLevel: 'N4', strokeCount: 12, examples: [{ japanese: '開く', reading: 'ひらく', meaningPt: 'abrir' }] },
  { id: 'kj-108', character: '閉', onyomi: ['ヘイ'], kunyomi: ['し'], meaningPt: 'fechar', jlptLevel: 'N4', strokeCount: 11, examples: [{ japanese: '閉める', reading: 'しめる', meaningPt: 'fechar' }] },
  { id: 'kj-109', character: '着', onyomi: ['チャク'], kunyomi: ['き', 'つ'], meaningPt: 'vestir / chegar', jlptLevel: 'N4', strokeCount: 12, examples: [{ japanese: '着く', reading: 'つく', meaningPt: 'chegar' }] },
  { id: 'kj-110', character: '急', onyomi: ['キュウ'], kunyomi: ['いそ'], meaningPt: 'urgente / apressar', jlptLevel: 'N4', strokeCount: 9, examples: [{ japanese: '急ぐ', reading: 'いそぐ', meaningPt: 'apressar-se' }] },

  // Transport and movement
  { id: 'kj-111', character: '乗', onyomi: ['ジョウ'], kunyomi: ['の'], meaningPt: 'embarcar', jlptLevel: 'N4', strokeCount: 9, examples: [{ japanese: '乗る', reading: 'のる', meaningPt: 'embarcar' }] },
  { id: 'kj-112', character: '降', onyomi: ['コウ'], kunyomi: ['お'], meaningPt: 'descer', jlptLevel: 'N4', strokeCount: 10, examples: [{ japanese: '降りる', reading: 'おりる', meaningPt: 'descer' }] },
  { id: 'kj-113', character: '歩', onyomi: ['ホ'], kunyomi: ['ある'], meaningPt: 'caminhar', jlptLevel: 'N4', strokeCount: 8, examples: [{ japanese: '歩く', reading: 'あるく', meaningPt: 'caminhar' }] },
  { id: 'kj-114', character: '走', onyomi: ['ソウ'], kunyomi: ['はし'], meaningPt: 'correr', jlptLevel: 'N4', strokeCount: 7, examples: [{ japanese: '走る', reading: 'はしる', meaningPt: 'correr' }] },
  { id: 'kj-115', character: '止', onyomi: ['シ'], kunyomi: ['と'], meaningPt: 'parar', jlptLevel: 'N4', strokeCount: 4, examples: [{ japanese: '止まる', reading: 'とまる', meaningPt: 'parar' }] },
  { id: 'kj-116', character: '道', onyomi: ['ドウ'], kunyomi: ['みち'], meaningPt: 'caminho / rua', jlptLevel: 'N4', strokeCount: 12, examples: [{ japanese: '道', reading: 'みち', meaningPt: 'caminho' }] },
  { id: 'kj-117', character: '運', onyomi: ['ウン'], kunyomi: ['はこ'], meaningPt: 'transportar / sorte', jlptLevel: 'N4', strokeCount: 12, examples: [{ japanese: '運ぶ', reading: 'はこぶ', meaningPt: 'transportar' }] },
  { id: 'kj-118', character: '転', onyomi: ['テン'], kunyomi: [], meaningPt: 'girar / mudar', jlptLevel: 'N4', strokeCount: 11, examples: [{ japanese: '運転', reading: 'うんてん', meaningPt: 'dirigir' }] },

  // Abstract concepts
  { id: 'kj-119', character: '自', onyomi: ['ジ', 'シ'], kunyomi: [], meaningPt: 'próprio', jlptLevel: 'N4', strokeCount: 6, examples: [{ japanese: '自分', reading: 'じぶん', meaningPt: 'eu mesmo' }] },
  { id: 'kj-120', character: '由', onyomi: ['ユ', 'ユウ'], kunyomi: [], meaningPt: 'motivo / razão', jlptLevel: 'N4', strokeCount: 5, examples: [{ japanese: '自由', reading: 'じゆう', meaningPt: 'liberdade' }] },
  { id: 'kj-121', character: '事', onyomi: ['ジ'], kunyomi: ['こと'], meaningPt: 'coisa / assunto', jlptLevel: 'N4', strokeCount: 8, examples: [{ japanese: '仕事', reading: 'しごと', meaningPt: 'trabalho' }] },
  { id: 'kj-122', character: '仕', onyomi: ['シ'], kunyomi: [], meaningPt: 'servir', jlptLevel: 'N4', strokeCount: 5, examples: [{ japanese: '仕事', reading: 'しごと', meaningPt: 'trabalho' }] },
  { id: 'kj-123', character: '集', onyomi: ['シュウ'], kunyomi: ['あつ'], meaningPt: 'reunir / juntar', jlptLevel: 'N4', strokeCount: 12, examples: [{ japanese: '集まる', reading: 'あつまる', meaningPt: 'reunir-se' }] },
  { id: 'kj-124', character: '習', onyomi: ['シュウ'], kunyomi: ['なら'], meaningPt: 'aprender / praticar', jlptLevel: 'N4', strokeCount: 11, examples: [{ japanese: '習う', reading: 'ならう', meaningPt: 'aprender' }] },
  { id: 'kj-125', character: '練', onyomi: ['レン'], kunyomi: [], meaningPt: 'treinar', jlptLevel: 'N4', strokeCount: 14, examples: [{ japanese: '練習', reading: 'れんしゅう', meaningPt: 'prática' }] },
  { id: 'kj-126', character: '質', onyomi: ['シツ'], kunyomi: [], meaningPt: 'qualidade', jlptLevel: 'N4', strokeCount: 15, examples: [{ japanese: '質問', reading: 'しつもん', meaningPt: 'pergunta' }] },
  { id: 'kj-127', character: '問', onyomi: ['モン'], kunyomi: ['と'], meaningPt: 'perguntar', jlptLevel: 'N4', strokeCount: 11, examples: [{ japanese: '質問', reading: 'しつもん', meaningPt: 'pergunta' }] },
  { id: 'kj-128', character: '答', onyomi: ['トウ'], kunyomi: ['こた'], meaningPt: 'responder', jlptLevel: 'N4', strokeCount: 12, examples: [{ japanese: '答える', reading: 'こたえる', meaningPt: 'responder' }] },
  { id: 'kj-129', character: '意', onyomi: ['イ'], kunyomi: [], meaningPt: 'intenção / significado', jlptLevel: 'N4', strokeCount: 13, examples: [{ japanese: '意味', reading: 'いみ', meaningPt: 'significado' }] },
  { id: 'kj-130', character: '味', onyomi: ['ミ'], kunyomi: ['あじ'], meaningPt: 'sabor / significado', jlptLevel: 'N4', strokeCount: 8, examples: [{ japanese: '意味', reading: 'いみ', meaningPt: 'significado' }] },

  // Qualities and comparisons
  { id: 'kj-131', character: '特', onyomi: ['トク'], kunyomi: [], meaningPt: 'especial', jlptLevel: 'N4', strokeCount: 10, examples: [{ japanese: '特に', reading: 'とくに', meaningPt: 'especialmente' }] },
  { id: 'kj-132', character: '別', onyomi: ['ベツ'], kunyomi: ['わか'], meaningPt: 'separado / diferente', jlptLevel: 'N4', strokeCount: 7, examples: [{ japanese: '別に', reading: 'べつに', meaningPt: 'separadamente' }] },
  { id: 'kj-133', character: '同', onyomi: ['ドウ'], kunyomi: ['おな'], meaningPt: 'mesmo', jlptLevel: 'N4', strokeCount: 6, examples: [{ japanese: '同じ', reading: 'おなじ', meaningPt: 'mesmo' }] },
  { id: 'kj-134', character: '悪', onyomi: ['アク'], kunyomi: ['わる'], meaningPt: 'mau / ruim', jlptLevel: 'N4', strokeCount: 11, examples: [{ japanese: '悪い', reading: 'わるい', meaningPt: 'ruim' }] },

  // Society and places
  { id: 'kj-135', character: '主', onyomi: ['シュ'], kunyomi: ['おも'], meaningPt: 'principal', jlptLevel: 'N4', strokeCount: 5, examples: [{ japanese: '主人', reading: 'しゅじん', meaningPt: 'marido / dono' }] },
  { id: 'kj-136', character: '世', onyomi: ['セ', 'セイ'], kunyomi: [], meaningPt: 'mundo / geração', jlptLevel: 'N4', strokeCount: 5, examples: [{ japanese: '世界', reading: 'せかい', meaningPt: 'mundo' }] },
  { id: 'kj-137', character: '界', onyomi: ['カイ'], kunyomi: [], meaningPt: 'mundo / limite', jlptLevel: 'N4', strokeCount: 9, examples: [{ japanese: '世界', reading: 'せかい', meaningPt: 'mundo' }] },
  { id: 'kj-138', character: '台', onyomi: ['ダイ'], kunyomi: [], meaningPt: 'plataforma / contador', jlptLevel: 'N4', strokeCount: 5, examples: [{ japanese: '台所', reading: 'だいどころ', meaningPt: 'cozinha' }] },
  { id: 'kj-139', character: '所', onyomi: ['ショ'], kunyomi: ['ところ'], meaningPt: 'lugar', jlptLevel: 'N4', strokeCount: 8, examples: [{ japanese: '台所', reading: 'だいどころ', meaningPt: 'cozinha' }] },

  // Sound and culture
  { id: 'kj-140', character: '声', onyomi: ['セイ'], kunyomi: ['こえ'], meaningPt: 'voz', jlptLevel: 'N4', strokeCount: 7, examples: [{ japanese: '声', reading: 'こえ', meaningPt: 'voz' }] },
  { id: 'kj-141', character: '音', onyomi: ['オン'], kunyomi: ['おと'], meaningPt: 'som', jlptLevel: 'N4', strokeCount: 9, examples: [{ japanese: '音楽', reading: 'おんがく', meaningPt: 'música' }] },
  { id: 'kj-142', character: '楽', onyomi: ['ガク', 'ラク'], kunyomi: ['たの'], meaningPt: 'divertido / música', jlptLevel: 'N4', strokeCount: 13, examples: [{ japanese: '楽しい', reading: 'たのしい', meaningPt: 'divertido' }] },
  { id: 'kj-143', character: '業', onyomi: ['ギョウ'], kunyomi: [], meaningPt: 'negócio / trabalho', jlptLevel: 'N4', strokeCount: 13, examples: [{ japanese: '授業', reading: 'じゅぎょう', meaningPt: 'aula' }] },
  { id: 'kj-144', character: '授', onyomi: ['ジュ'], kunyomi: [], meaningPt: 'ensinar / conceder', jlptLevel: 'N4', strokeCount: 11, examples: [{ japanese: '授業', reading: 'じゅぎょう', meaningPt: 'aula' }] },
  { id: 'kj-145', character: '族', onyomi: ['ゾク'], kunyomi: [], meaningPt: 'família / clã', jlptLevel: 'N4', strokeCount: 11, examples: [{ japanese: '家族', reading: 'かぞく', meaningPt: 'família' }] },
];

export function getKanjiByLevel(level: KanjiItem['jlptLevel']): KanjiItem[] {
  return kanji.filter(k => k.jlptLevel === level);
}

export const KANJI_LEVELS: KanjiItem['jlptLevel'][] = ['N5', 'N4', 'N3', 'N2', 'N1'];

/** Levels with data loaded in the app (the rest show as coming soon in the UI). */
export const KANJI_LEVELS_AVAILABLE: KanjiItem['jlptLevel'][] = ['N5', 'N4'];
