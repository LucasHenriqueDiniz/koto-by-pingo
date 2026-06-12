# TODO — Feature: Traçado de Kana

**Status:** placeholder criado — `TracingMode.tsx` existe como modo de treino ("Traçado") e
registra prática via `koto:tracing_practice`, mas ainda sem animação de stroke order ou
verificação real do desenho.

---

## Objetivo

Permitir que o usuário treine a escrita correta dos caracteres japoneses (kana e kanji),
seguindo a ordem e direção dos traços conforme a convenção padrão da língua japonesa.

---

## Abordagens possíveis

### 1. SVG com stroke order (animado, read-only)
- Mostrar o kana com animação de traçado usando SVG pré-definido.
- Usuário acompanha visualmente e confirma com "Pratiquei".
- **Prós:** simples, sem necessidade de reconhecimento.
- **Contras:** apenas visual, sem verificação real.

### 2. Canvas com entrada touch/mouse (interativo)
- Usuário desenha o caractere em um canvas HTML.
- App compara o desenho com o traçado esperado por algoritmo de similaridade.
- **Prós:** verificação real da escrita.
- **Contras:** alta complexidade; algoritmos de comparação são não-triviais.

### 3. Checklist manual por traço
- Mostrar o traço um a um como animação SVG.
- Usuário clica "Próximo traço" para avançar.
- Confirma com "Pratiquei esta sequência".
- **Prós:** intermediário — sem complexidade de IA, mas com estrutura pedagógica.

---

## Dados necessários (por caractere)

```ts
interface KanaStrokeData {
  kanaId: string;       // ex: 'h-a' (あ)
  character: string;   // ex: 'あ'
  strokes: StrokePath[];
}

interface StrokePath {
  order: number;         // 1, 2, 3...
  svgPath: string;       // path SVG do traço
  direction: string;     // "top-left to bottom-right"
  boundingBox: { x: number; y: number; width: number; height: number };
}
```

**Fonte de dados sugerida:**
- KanjiVG project (CC BY-SA 3.0): https://kanjivg.tagaini.net
- Cobrir primeiro todos os 46 hiragana + 46 katakana básicos

---

## MVP futuro (fase 1)

- [ ] Mostrar animação SVG do traçado completo (stroke-dashoffset animation)
- [ ] Exibir número de traços
- [x] Botão "Marcar como praticado" para registrar tentativa positiva (`TracingMode.tsx`)
- [x] Integrar como modo opcional "Traçado" em `/kana/treinar` (via `KanaModeSelector` + `KANA_MODE_COMPONENTS`)
- [x] Salvar no localStorage: `koto:tracing_practice` (`getTracingPracticeMap`/`recordTracingPractice` em `progress.local.ts`)

## Versão avançada (fase 2)

- [ ] Usuário desenha no canvas (touch + mouse)
- [ ] App compara sequência de traços via bounding box similarity
- [ ] Pontuação por traço (direção, ordem, proporção)
- [ ] Salvar métricas: `accuracy_per_stroke`, `direction_errors`, `order_errors`
- [ ] Mostrar overlay: traço esperado (verde) vs. traço do usuário (vermelho)

---

## Como integrar (próximos passos)

1. Criar componente `src/components/kana/KanaStrokeViewer.tsx` com a animação SVG do traçado
2. Adicionar os dados de `StrokePath[]` (ex: via KanjiVG) e consumi-los em `TracingMode.tsx`
3. Exibir o número de traços e a animação dentro do placeholder já existente em `TracingMode.tsx`
4. (Fase 2) Canvas interativo + comparação de traços + novas métricas em `koto:tracing_practice`

---

## Status

| Fase | Status |
|------|--------|
| Placeholder de UI (`TracingMode.tsx`) | ✅ implementado |
| Contador de prática (`koto:tracing_practice`) | ✅ implementado |
| Dados SVG (stroke order) | não criados |
| Animação | não implementada |
| Canvas interativo | não implementado |
