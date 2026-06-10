# TODO — Feature: Traçado de Kana

**Status:** planned — não implementado no MVP

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
- [ ] Botão "Pratiquei" para registrar tentativa positiva
- [ ] Integrar no KanaTrainer como modo opcional: "Treino" / "Traçado"
- [ ] Salvar no localStorage: `koto:tracing_practice`

## Versão avançada (fase 2)

- [ ] Usuário desenha no canvas (touch + mouse)
- [ ] App compara sequência de traços via bounding box similarity
- [ ] Pontuação por traço (direção, ordem, proporção)
- [ ] Salvar métricas: `accuracy_per_stroke`, `direction_errors`, `order_errors`
- [ ] Mostrar overlay: traço esperado (verde) vs. traço do usuário (vermelho)

---

## Como integrar

1. Criar componente `src/components/kana/KanaStrokeViewer.tsx`
2. Criar serviço `src/services/tracing/tracing.local.ts`
3. Adicionar chave `koto:tracing_progress` no storage
4. Registrar via `recordTracingAttempt(kanaId, result)`
5. Adicionar tab "Traçado" na `KanaPage`

---

## Status

| Fase | Status |
|------|--------|
| Dados SVG | não criados |
| Animação | não implementada |
| Canvas interativo | não implementado |
| Integração com progresso | não implementada |
