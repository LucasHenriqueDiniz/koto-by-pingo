# CLAUDE.md — Koto by Pingo

Guia para agentes de IA trabalhando neste projeto. Leia antes de editar qualquer arquivo.

---

## O que é este projeto

**Koto by Pingo** é um app web de aprendizado de japonês para estudantes brasileiros.
Slogan: _"Japonês em pequenos treinos diários."_

- **Sem backend.** Todo o estado é `localStorage`. Nenhuma API, nenhum banco ativo.
- **Sem autenticação real.** Há stubs para Clerk e D1, mas não estão integrados.
- **Funciona 100% offline** depois do primeiro carregamento.

Artifact principal: `artifacts/koto/` — app React + Vite + TypeScript.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 18 + Vite + TypeScript |
| Roteamento | **Wouter** (não React Router) |
| Estilização | Tailwind CSS |
| Animações | framer-motion |
| Ícones | lucide-react |
| UI base | Shadcn/UI (componentes em `src/components/ui/`) |
| State server | @tanstack/react-query (client-side only, sem fetches reais) |
| Áudio | Web Speech API nativa do browser |

---

## Estrutura de pastas

```
artifacts/koto/src/
├── App.tsx                      ← roteamento principal (Wouter)
├── main.tsx                     ← entry point
│
├── components/
│   ├── brand/                   ← Logo, BrandMark, PingoMascot (5 variantes SVG)
│   ├── kana/                    ← KanaTrainer, KanaInput, KanaStats
│   ├── layout/                  ← AppLayout, DesktopSidebar, ResponsiveAppShell,
│   │                              MobileBottomNav, MobileTopBar, RightStudyPanel, Footer
│   ├── quiz/                    ← MultipleChoiceQuestion, QuizCard, ResultSummary
│   ├── vocabulary/              ← FlashcardMode, WordSelectionMode, MatchingPairsMode,
│   │                              TranslationQuizMode, VocabularyCard, VocabularyQuiz
│   └── ui/                      ← Shadcn + componentes custom (AdPlaceholder, PageHeader,
│                                  StatCard, ProgressBar, ModuleBadge, Spinner...)
│
├── data/
│   ├── kana.ts                  ← 46 hiragana + 46 katakana, com group (a-row, ka-row...)
│   ├── vocabulary.ts            ← 45 palavras N5 em 9 categorias + helpers
│   └── mockExams.ts             ← N5 Mini + N4 Mini (questões + seções)
│
├── hooks/
│   ├── useKanaTrainer.ts        ← lógica de treino de kana (aceita KanaItem[])
│   ├── useLocalStorage.ts       ← hook genérico de localStorage tipado
│   ├── useStudyProgress.ts      ← lê e expõe getProgressSummary() com refresh/reset
│   └── use-mobile.tsx           ← detecta viewport < 768px
│
├── pages/
│   ├── HomePage.tsx             ← landing com hero, features, módulos
│   ├── KanaPage.tsx             ← trainer com filtros + grupos de linha + toggle de dica
│   ├── VocabularyPage.tsx       ← 4 modos + filtros inteligentes + grupos de categoria
│   ├── ListeningPage.tsx        ← treino auditivo via Web Speech API
│   ├── ExamsPage.tsx            ← lista de simulados disponíveis
│   ├── ExamDetailPage.tsx       ← execução + revisão de simulado
│   ├── DashboardPage.tsx        ← estatísticas de kana + vocabulário + simulados
│   ├── AboutPage.tsx / ContactPage.tsx / PrivacyPage.tsx / TermsPage.tsx
│   └── not-found.tsx
│
├── services/
│   ├── auth/
│   │   ├── auth.placeholder.ts  ← stub de autenticação (NÃO instalar Clerk ainda)
│   │   └── auth.types.ts
│   ├── exams/
│   │   ├── exams.local.ts       ← salvar/buscar tentativas de simulado
│   │   └── exams.types.ts
│   └── progress/
│       ├── progress.local.ts    ← ÚNICA fonte de leitura/escrita de progresso
│       ├── progress.remote.placeholder.ts ← stub de sync remoto
│       └── progress.types.ts    ← tipos internos do serviço
│
├── types/
│   ├── kana.ts                  ← KanaItem, KanaType
│   ├── vocabulary.ts            ← VocabularyWord, VocabularyTrainingMode, WeakReason, WordAttemptInput
│   ├── progress.ts              ← BaseAttempt, KanaAttempt, VocabAttempt, ExamAttempt...
│   ├── exams.ts                 ← Question, Section, Exam
│   └── user.ts                  ← AuthUser, AuthSession
│
└── utils/
    ├── kana.ts                  ← checkAnswer() (normaliza entrada)
    ├── scoring.ts               ← calcAccuracy, shuffle, generateId
    ├── seo.ts                   ← updatePageSEO()
    └── storage.ts               ← storageGet/storageSet/storageClear (prefixo "koto:")
```

---

## Regras absolutas — nunca viole

### 1. localStorage só via serviço
```
✅ import { recordWordAttempt } from '../services/progress/progress.local';
❌ localStorage.setItem(...)   ← proibido em componentes e páginas
```
Toda leitura e escrita de estado persistente passa por `services/progress/progress.local.ts`.
O prefixo de todas as chaves é `koto:` — definido em `utils/storage.ts`.

### 2. Roteamento é Wouter, não React Router
```tsx
✅ import { Link, useLocation } from 'wouter';
❌ import { Link } from 'react-router-dom';
```
O base path vem de `import.meta.env.BASE_URL` (já configurado no App.tsx).

### 3. Não instalar Clerk nem Cloudflare D1 ainda
Os stubs já existem:
- `src/services/auth/auth.placeholder.ts`
- `src/services/progress/progress.remote.placeholder.ts`

Quando chegar a hora, substitua os stubs — não crie paralelos.

### 4. Regras de AdSense
**Nunca coloque `<AdPlaceholder>` dentro de:**
- Cards de exercício (flashcard, questão, par de matching)
- Adjacente a botões de ação (Verificar, Próximo, Acertei, Errei, Confirmar)
- Entre opções de resposta

**Pode colocar:**
- Antes de iniciar uma sessão (acima do trainer)
- Depois de encerrar uma sessão (tela de resultado)
- Sidebar direita (desktop), com ≥ 16px de espaçamento
- Entre blocos editoriais (Sobre, entre parágrafos)

### 5. TypeScript estrito — sem `any` implícito
```bash
pnpm --filter @workspace/koto run build   # deve passar sem erros
```

---

## Padrões e convenções

### Páginas
Toda página usa `<PageHeader title="..." description="..." color="#hex" />` no topo.
Chama `updatePageSEO(title, description)` no `useEffect`.
Container principal: `<div className="max-w-5xl mx-auto px-4 py-6">`.

### Layout responsivo
```
Desktop (>= 1024px):   DesktopSidebar (w-56 fixa) + main com lg:pl-56
                       xl+ mostra também RightStudyPanel
Tablet (768–1023px):   sem sidebar, sem bottom nav
Mobile (< 768px):      MobileTopBar + MobileBottomNav (pb-16 no main)
```

O `AppLayout` → `ResponsiveAppShell` já cuida de tudo. Não recrie nav em páginas.

### Progresso de kana

**Critérios:**
| Classificação | Tentativas | Precisão |
|--------------|-----------|---------|
| Dominado | ≥ 5 | ≥ 85% |
| Difícil | ≥ 3 | < 60% |
| Nunca visto | 0 | — |

Funções: `getWeakKana(ids)`, `getMasteredKana(ids)`, `getNeverSeenKana(ids)`, `getKanaFilterStats(ids)`.

### Progresso de vocabulário

Mesmo critério de dominada/difícil.
Cada tentativa registra `WeakReason`: `'reading' | 'meaning' | 'listening' | 'typing'`.

Funções: `recordWordAttempt(input)`, `getWeakWords(limit)`, `getMasteredWords()`, `getNeverSeenWords()`, `getVocabStats()`.

### Hook de treino de kana
```tsx
// useKanaTrainer agora aceita KanaItem[] (não KanaType)
const trainer = useKanaTrainer(filteredItems);
// Resetar com nova lista:
trainer.resetQueue(newItems);
```

### Modos de vocabulário
```tsx
type VocabularyTrainingMode =
  | 'flashcards'        // FlashcardMode.tsx    — weakReason: 'meaning'
  | 'word_selection'    // WordSelectionMode.tsx — weakReason: 'reading'
  | 'matching_pairs'    // MatchingPairsMode.tsx — weakReason: 'reading'
  | 'translation_quiz'; // TranslationQuizMode.tsx — weakReason: 'meaning'
```

### Mascote Pingo-sensei
```tsx
<PingoMascot variant="default" size="md" />
// variants: 'default' | 'kana' | 'listening' | 'exam' | 'progress'
// sizes: 'sm' | 'md' | 'lg'
```
Para usar imagem real: adicione `public/brand/pingo.png`.

---

## Como adicionar uma nova página

1. Crie `src/pages/NomePage.tsx`
2. Exporte a função componente com `PageHeader` + `updatePageSEO`
3. Adicione a rota em `App.tsx`
4. Adicione o link em `DesktopSidebar.tsx` e `MobileBottomNav.tsx`

## Como adicionar palavras ao vocabulário

Edite `src/data/vocabulary.ts`:
```ts
{ id: 'v-046', japanese: '猫', kana: 'ねこ', romaji: 'neko',
  meaningPt: 'gato', category: 'animais', level: 'N5' }
```
`categories` é computado automaticamente via `Set`.

## Como adicionar questões ao simulado

Edite `src/data/mockExams.ts`. Estrutura:
```ts
{
  id: 'n5-q-XX', type: 'vocabulary', prompt: '...', japaneseText: '...',
  options: [{ id: 'a', text: '...' }, ...],
  correctOptionId: 'a', explanation: '...', tags: ['n5'], difficulty: 2,
}
```

---

## Chaves de localStorage (todas prefixadas com `koto:`)

| Chave | Conteúdo |
|-------|----------|
| `koto:kana_progress` | `{ attempts: KanaAttemptRecord[], lastUpdated }` |
| `koto:vocab_progress` | `{ attempts: VocabAttemptRecord[], lastUpdated }` (agregado) |
| `koto:word_progress` | `Record<wordId, WordProgressRecord>` (granular por palavra) |
| `koto:exam_attempts` | `ExamAttemptRecord[]` |
| `koto:sessions` | `StudySessionRecord[]` |
| `koto:vocab_mode` | `VocabularyTrainingMode` (preferência salva) |
| `koto:vocab_hint` | `boolean` (mostrar tradução como dica) |
| `koto:kana_type` | `KanaType` (preferência salva) |
| `koto:kana_romaji_hint` | `boolean` (mostrar romaji como dica) |

---

## Scripts

```bash
# Desenvolvimento
pnpm --filter @workspace/koto run dev

# Build de produção (deve passar sem erros TS)
pnpm --filter @workspace/koto run build

# Preview do build
pnpm --filter @workspace/koto run preview
```

---

## TODOs documentados (não implementar sem instrução)

| Arquivo | Assunto |
|---------|---------|
| `docs/TODO_CLERK_AUTH.md` | Integração de autenticação com Clerk |
| `docs/TODO_CLOUDFLARE_D1.md` | Banco remoto com Cloudflare D1 + Workers |
| `docs/TODO_TRACING.md` | Feature de traçado de kana (SVG stroke order) |
| `docs/TODO_EXAMS.md` | Expansão dos simulados JLPT N3/N2/N1, timer, histórico |

---

## O que NÃO fazer

- ❌ `localStorage.getItem/setItem` direto em componentes
- ❌ Instalar `react-router-dom` (usa Wouter)
- ❌ Instalar `@clerk/clerk-react` antes de instrução explícita
- ❌ Criar backend/API sem instrução explícita
- ❌ Usar `any` implícito no TypeScript
- ❌ Colocar `<AdPlaceholder>` dentro de cards de exercício
- ❌ Duplicar lógica de nav (AppLayout já gerencia tudo)
- ❌ Acessar `import.meta.env` fora de `main.tsx` ou `App.tsx` para base URL

---

## Marca

- **Cor primária:** `#E5484D` (vermelho Koto)
- **Fonte japonesa:** `'Noto Sans JP', sans-serif` — aplicar via `style={{ fontFamily: ... }}`
- **Mascote:** Pingo-sensei, pinguim preto com detalhes vermelhos
- **Público-alvo:** estudantes brasileiros iniciantes em japonês
