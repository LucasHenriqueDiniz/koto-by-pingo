# TODO — Feature: kana stroke tracing

**Status:** placeholder in place — `TracingMode.tsx` exists as a training mode (`Traçado`,
"tracing") and records practice through `koto:tracing_practice`, but there is still no stroke-order
animation and no real checking of the drawing.

---

## Goal

Let the user practise writing the Japanese characters (kana and kanji) correctly, following the
stroke order and direction that the standard Japanese convention prescribes.

---

## Possible approaches

### 1. SVG with stroke order (animated, read-only)
- Show the kana with a tracing animation from a pre-authored SVG.
- The user follows along visually and confirms with `Pratiquei` ("I practised").
- **Pros:** simple, no recognition needed.
- **Cons:** purely visual, nothing is actually checked.

### 2. Canvas with touch/mouse input (interactive)
- The user draws the character on an HTML canvas.
- The app compares the drawing against the expected strokes with a similarity algorithm.
- **Pros:** the writing is really checked.
- **Cons:** high complexity; the comparison algorithms are non-trivial.

### 3. Manual per-stroke checklist
- Show one stroke at a time as an SVG animation.
- The user clicks `Próximo traço` ("next stroke") to advance.
- Confirms with `Pratiquei esta sequência` ("I practised this sequence").
- **Pros:** a middle ground — no AI complexity, but still pedagogically structured.

---

## Data needed (per character)

```ts
interface KanaStrokeData {
  kanaId: string;      // e.g. 'h-a' (あ)
  character: string;   // e.g. 'あ'
  strokes: StrokePath[];
}

interface StrokePath {
  order: number;         // 1, 2, 3...
  svgPath: string;       // the stroke's SVG path
  direction: string;     // "top-left to bottom-right"
  boundingBox: { x: number; y: number; width: number; height: number };
}
```

**Suggested data source:**
- The KanjiVG project (CC BY-SA 3.0): https://kanjivg.tagaini.net
- Cover all 46 basic hiragana + 46 basic katakana first

---

## Future MVP (phase 1)

- [ ] Show an SVG animation of the full tracing (stroke-dashoffset animation)
- [ ] Display the stroke count
- [x] A `Marcar como praticado` button ("mark as practised") to record a positive attempt (`TracingMode.tsx`)
- [x] Wire it in as the optional `Traçado` mode on `/kana/treinar` (through `KanaModeSelector` + `KANA_MODE_COMPONENTS`)
- [x] Persist to localStorage: `koto:tracing_practice` (`getTracingPracticeMap`/`recordTracingPractice` in `progress.local.ts`)

## Advanced version (phase 2)

- [ ] The user draws on a canvas (touch + mouse)
- [ ] The app compares the stroke sequence by bounding-box similarity
- [ ] Score per stroke (direction, order, proportion)
- [ ] Persist metrics: `accuracy_per_stroke`, `direction_errors`, `order_errors`
- [ ] Show an overlay: expected stroke (green) vs. the user's stroke (red)

---

## How to wire it in (next steps)

1. Add a `src/components/kana/KanaStrokeViewer.tsx` component with the SVG tracing animation
2. Add the `StrokePath[]` data (e.g. from KanjiVG) and read it in `TracingMode.tsx`
3. Show the stroke count and the animation inside the placeholder that `TracingMode.tsx` already has
4. (Phase 2) Interactive canvas + stroke comparison + new metrics in `koto:tracing_practice`

---

## Status

| Phase | Status |
|-------|--------|
| UI placeholder (`TracingMode.tsx`) | ✅ implemented |
| Practice counter (`koto:tracing_practice`) | ✅ implemented |
| SVG stroke-order data | not authored |
| Animation | not implemented |
| Interactive canvas | not implemented |
