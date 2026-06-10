# TODO — Feature: Simulados JLPT

**Status:** MVP implementado com N5 e N4 mini. Expansão planejada.

---

## Estrutura atual

- 2 simulados: JLPT N5 Mini (7 questões) e JLPT N4 Mini (5 questões)
- Seções: vocabulário, leitura, gramática
- Resultado com revisão por questão e explicações
- Progresso salvo no localStorage

---

## Organização por nível JLPT

| Nível | Alvo | Vocabulário | Kanji | Gramática |
|-------|------|-------------|-------|-----------|
| N5 | iniciante | ~800 palavras | ~100 | estruturas básicas |
| N4 | básico | ~1.500 palavras | ~300 | formas verbais |
| N3 | intermediário | ~3.750 palavras | ~650 | estruturas complexas |
| N2 | avançado | ~6.000 palavras | ~1.000 | gramática avançada |
| N1 | proficiente | ~10.000 palavras | ~2.000 | nível nativo |

---

## Seções por simulado completo

Cada simulado JLPT real tem 4 seções:

```ts
type SectionType = 'vocabulary' | 'grammar' | 'reading' | 'listening';
```

| Seção | O que testa | Obs. |
|-------|-------------|------|
| Vocabulário | leitura, significado, uso contextual | ✅ implementado |
| Gramática | partículas, conjugação, estrutura | ✅ implementado (N4) |
| Leitura | interpretação de texto japonês | 🔲 em desenvolvimento |
| Escuta | reconhecimento auditivo | 🔲 depende de áudio |

---

## Features planejadas

### Timer por seção
- [ ] Contador regressivo por seção (ex: 25 min para vocabulário)
- [ ] Alerta ao restarem 5 minutos
- [ ] Submissão automática ao expirar
- [ ] Salvar tempo gasto por questão

### Histórico de tentativas
- [ ] Listar todos os simulados realizados com data e pontuação
- [ ] Comparar performance entre tentativas
- [ ] Gráfico de evolução por simulado

### Revisão por erro
- [ ] Após o simulado: filtrar questões erradas
- [ ] Modo "Refazer apenas erros"
- [ ] Salvar questões problemáticas

### Banco de questões
- [ ] Estrutura para >100 questões por nível
- [ ] Tags por tópico (ex: "partículas", "tempo verbal", "leitura N3")
- [ ] Dificuldade por questão (1–5)
- [ ] Seleção aleatória por dificuldade

### Importação de conteúdo
- [ ] Formato JSON para importar banco de questões
- [ ] Validação de schema
- [ ] Admin panel para gerenciar questões (futuro)

---

## Próximos simulados a criar

| Simulado | Prioridade | Questões previstas |
|----------|------------|-------------------|
| N5 Completo | Alta | 35 questões, 3 seções |
| N4 Completo | Alta | 35 questões, 3 seções |
| N5 Gramática | Média | 15 questões |
| N3 Mini | Baixa | 10 questões |

---

## Como adicionar questões

Editar `src/data/mockExams.ts`:

```ts
{
  id: 'n5-q-XX',
  type: 'vocabulary',
  prompt: 'Pergunta aqui',
  japaneseText: '漢字',
  reading: 'かんじ',
  options: [
    { id: 'a', text: 'opção A' },
    { id: 'b', text: 'opção B' },
    { id: 'c', text: 'opção C' },
    { id: 'd', text: 'opção D' },
  ],
  correctOptionId: 'a',
  explanation: 'Explicação detalhada aqui.',
  tags: ['vocabulário', 'n5'],
  difficulty: 2,
}
```

---

## Status

| Feature | Status |
|---------|--------|
| Simulado N5 Mini | ✅ implementado |
| Simulado N4 Mini | ✅ implementado |
| Timer por seção | não implementado |
| Histórico completo | parcial (localStorage) |
| Revisão por erro | ✅ implementado |
| Banco de questões | mínimo |
| N3 / N2 / N1 | não implementado |
