export interface KanaWord {
  id: string;
  word: string;
  romaji: string;
  meaningPt: string;
  /** ids de KanaItem (hiragana) que formam a palavra, na ordem correta. */
  kanaIds: string[];
}

export const kanaWords: KanaWord[] = [
  { id: 'w-neko', word: 'ねこ', romaji: 'neko', meaningPt: 'gato', kanaIds: ['h-ne', 'h-ko'] },
  { id: 'w-inu', word: 'いぬ', romaji: 'inu', meaningPt: 'cachorro', kanaIds: ['h-i', 'h-nu'] },
  { id: 'w-sushi', word: 'すし', romaji: 'sushi', meaningPt: 'sushi', kanaIds: ['h-su', 'h-shi'] },
  { id: 'w-yama', word: 'やま', romaji: 'yama', meaningPt: 'montanha', kanaIds: ['h-ya', 'h-ma'] },
  { id: 'w-umi', word: 'うみ', romaji: 'umi', meaningPt: 'mar', kanaIds: ['h-u', 'h-mi'] },
  { id: 'w-hon', word: 'ほん', romaji: 'hon', meaningPt: 'livro', kanaIds: ['h-ho', 'h-n'] },
  { id: 'w-mizu', word: 'みず', romaji: 'mizu', meaningPt: 'água', kanaIds: ['h-mi', 'h-zu'] },
  { id: 'w-sakana', word: 'さかな', romaji: 'sakana', meaningPt: 'peixe', kanaIds: ['h-sa', 'h-ka', 'h-na'] },
  { id: 'w-sakura', word: 'さくら', romaji: 'sakura', meaningPt: 'cerejeira', kanaIds: ['h-sa', 'h-ku', 'h-ra'] },
  { id: 'w-kuruma', word: 'くるま', romaji: 'kuruma', meaningPt: 'carro', kanaIds: ['h-ku', 'h-ru', 'h-ma'] },
  { id: 'w-tamago', word: 'たまご', romaji: 'tamago', meaningPt: 'ovo', kanaIds: ['h-ta', 'h-ma', 'h-go'] },
  { id: 'w-tokei', word: 'とけい', romaji: 'tokei', meaningPt: 'relógio', kanaIds: ['h-to', 'h-ke', 'h-i'] },
  { id: 'w-denwa', word: 'でんわ', romaji: 'denwa', meaningPt: 'telefone', kanaIds: ['h-de', 'h-n', 'h-wa'] },
  { id: 'w-tomodachi', word: 'ともだち', romaji: 'tomodachi', meaningPt: 'amigo(a)', kanaIds: ['h-to', 'h-mo', 'h-da', 'h-chi'] },
];
