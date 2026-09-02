# TODO — Feature: JLPT mock exams

**Status:** MVP implemented with the N5 and N4 minis. Expansion planned.

---

## Current structure

- 2 mock exams: JLPT N5 Mini (7 questions) and JLPT N4 Mini (5 questions)
- Sections: vocabulary, reading, grammar
- A result screen with per-question review and explanations
- Progress saved in localStorage

---

## Breakdown by JLPT level

| Level | Target | Vocabulary | Kanji | Grammar |
|-------|--------|------------|-------|---------|
| N5 | beginner | ~800 words | ~100 | basic structures |
| N4 | elementary | ~1,500 words | ~300 | verb forms |
| N3 | intermediate | ~3,750 words | ~650 | complex structures |
| N2 | advanced | ~6,000 words | ~1,000 | advanced grammar |
| N1 | proficient | ~10,000 words | ~2,000 | native level |

---

## Sections in a full mock exam

Every real JLPT exam has 4 sections:

```ts
type SectionType = 'vocabulary' | 'grammar' | 'reading' | 'listening';
```

| Section | What it tests | Notes |
|---------|---------------|-------|
| Vocabulary | reading, meaning, contextual use | ✅ implemented |
| Grammar | particles, conjugation, structure | ✅ implemented (N4) |
| Reading | interpreting a Japanese text | 🔲 in progress |
| Listening | audio recognition | 🔲 blocked on audio |

---

## Planned features

### Per-section timer
- [ ] A countdown per section (e.g. 25 min for vocabulary)
- [ ] A warning when 5 minutes are left
- [ ] Automatic submission when it expires
- [ ] Record the time spent per question

### Attempt history
- [ ] List every mock exam taken, with date and score
- [ ] Compare performance across attempts
- [ ] An evolution chart per exam

### Review by mistake
- [ ] After the exam: filter down to the wrong answers
- [ ] A "redo only the mistakes" mode
- [ ] Save the troublesome questions

### Question bank
- [ ] A structure that holds >100 questions per level
- [ ] Topic tags (e.g. particles, verb tense, N3 reading)
- [ ] Difficulty per question (1–5)
- [ ] Random selection by difficulty

### Content import
- [ ] A JSON format for importing a question bank
- [ ] Schema validation
- [ ] An admin panel for managing questions (later)

---

## Next mock exams to author

| Exam | Priority | Expected questions |
|------|----------|--------------------|
| N5 Full | High | 35 questions, 3 sections |
| N4 Full | High | 35 questions, 3 sections |
| N5 Grammar | Medium | 15 questions |
| N3 Mini | Low | 10 questions |

---

## How to add questions

Edit `src/data/mockExams.ts`. The content fields and the topic tags are product data, authored in
pt-BR like the rest of the learning content:

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
| N5 Mini exam | ✅ implemented |
| N4 Mini exam | ✅ implemented |
| Per-section timer | not implemented |
| Full history | partial (localStorage) |
| Review by mistake | ✅ implemented |
| Question bank | minimal |
| N3 / N2 / N1 | not implemented |
