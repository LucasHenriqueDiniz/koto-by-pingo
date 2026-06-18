const BASE = 'https://cdn.jsdelivr.net/gh/KanjiVG/kanjivg@master/kanji/';

const cache = new Map<string, string[] | 'not-found'>();

function toHex(character: string): string | null {
  const cp = character.codePointAt(0);
  return cp !== undefined ? cp.toString(16).padStart(5, '0') : null;
}

export async function fetchStrokes(character: string): Promise<string[]> {
  const hex = toHex(character);
  if (!hex) return [];

  const cached = cache.get(hex);
  if (cached !== undefined) return cached === 'not-found' ? [] : cached;

  try {
    const res = await fetch(`${BASE}${hex}.svg`);
    if (!res.ok) { cache.set(hex, 'not-found'); return []; }

    const text = await res.text();
    const doc = new DOMParser().parseFromString(text, 'image/svg+xml');

    const strokeGroup = doc.querySelector('[id^="kvg:StrokePaths"]');
    const nodes = strokeGroup
      ? strokeGroup.querySelectorAll('path')
      : doc.querySelectorAll('path');

    const strokes = Array.from(nodes)
      .map(p => p.getAttribute('d') ?? '')
      .filter(d => d.length > 0);

    if (strokes.length === 0) { cache.set(hex, 'not-found'); return []; }
    cache.set(hex, strokes);
    return strokes;
  } catch {
    cache.set(hex, 'not-found');
    return [];
  }
}
