# CLAUDE.md — Koto by Pingo

Guia para agentes de IA trabalhando neste projeto. Leia antes de editar qualquer arquivo.

---

## O que é este projeto

**Koto by Pingo** é um app web de aprendizado de japonês para estudantes brasileiros.
Slogan: _"Japonês em pequenos treinos diários."_

- **localStorage é a fonte primária.** Todo progresso continua funcionando 100% offline,
  com ou sem login.
- **Autenticação real via Clerk** (`@clerk/react`). Login é opcional — usuários anônimos
  usam o app normalmente.
- **Backend opcional via Cloudflare D1 + Workers** (`cloudflare/`) — sincroniza o progresso
  local com a conta do usuário quando ele faz login (sync sob demanda, ver
  `docs/TODO_CLOUDFLARE_D1.md`).
- **Funciona 100% offline** depois do primeiro carregamento, mesmo logado.

Artifact principal: `artifacts/koto/` — app React + Vite + TypeScript.

---

## Stack

| Camada | Tecnologia |
|--------|-----------|
| Framework | React 19 + Vite + TypeScript |
| Roteamento | **Wouter** (não React Router) |
| Estilização | Tailwind CSS |
| Animações | framer-motion |
| Ícones | **Material Symbols Outlined** (via `<MaterialIcon name="..." />` em `components/ui/MaterialIcon.tsx`) — lucide-react foi removido |
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
│   ├── kana/
│   │   ├── KanaInput.tsx / KanaStats.tsx        ← input de romaji + painel de estatísticas de sessão
│   │   ├── KanaCharacterCard.tsx                ← card de exibição de um kana (sm/md/lg, com romaji opcional)
│   │   ├── KanaModeSelector.tsx                 ← grid de seleção dos 7 KanaTrainingMode + KANA_MODE_LABELS
│   │   ├── KanaGroupFilter.tsx                  ← filtro de script + grupos (KANA_GROUP_LABELS) + "apenas problemáticos"
│   │   ├── KanaSubNav.tsx                       ← sub-navegação entre as 6 páginas /kana/*
│   │   └── modes/                               ← 7 modos de treino + KANA_MODE_COMPONENTS (registry)
│   │       ├── TypingMode.tsx        (digitação — usa useKanaTrainer)
│   │       ├── FlashcardsMode.tsx    (flip card)
│   │       ├── MultipleChoiceMode.tsx
│   │       ├── MatchingPairsMode.tsx (pares kana ↔ romaji, em lotes)
│   │       ├── ListeningMode.tsx     (Web Speech API)
│   │       ├── WordBuilderMode.tsx   (monta palavras com kanaWords)
│   │       └── TracingMode.tsx       (placeholder — ver docs/TODO_TRACING.md)
│   ├── layout/                  ← AppLayout, DesktopSidebar, ResponsiveAppShell,
│   │                              MobileBottomNav, MobileTopBar, RightStudyPanel, Footer
│   ├── quiz/                    ← MultipleChoiceQuestion, QuizCard, ResultSummary
│   ├── vocabulary/              ← FlashcardMode, WordSelectionMode, MatchingPairsMode,
│   │                              TranslationQuizMode, VocabularyCard, VocabularyQuiz
│   └── ui/                      ← Shadcn + componentes custom (AdPlaceholder, PageHeader,
│                                  StatCard, ProgressBar, ModuleBadge, Spinner...)
│
├── data/
│   ├── kana.ts                  ← 46 hiragana + 46 katakana + dakuten/handakuten/yōon,
│   │                              com group ('basic'|'dakuten'|'handakuten'|'yoon') e row
│   ├── kanaWords.ts             ← palavras curtas (KanaWord[]) usadas pelo WordBuilderMode
│   ├── vocabulary.ts            ← 45 palavras N5 em 9 categorias + helpers
│   └── mockExams.ts             ← N5 Mini + N4 Mini (questões + seções)
│
├── hooks/
│   ├── useKanaQueue.ts          ← fila/sessão genérica (queue, current, registerResult, endSession...)
│   ├── useKanaTrainer.ts        ← wrapper de useKanaQueue<KanaItem> p/ TypingMode (aceita KanaItem[])
│   ├── useKanaFilters.ts        ← preferências compartilhadas de script/grupos/"apenas problemáticos"
│   ├── useLocalStorage.ts       ← hook genérico de localStorage tipado
│   ├── useStudyProgress.ts      ← lê e expõe getProgressSummary() com refresh/reset
│   └── use-mobile.tsx           ← detecta viewport < 768px
│
├── pages/
│   ├── HomePage.tsx             ← landing com hero, features, módulos
│   ├── KanaHubPage.tsx          ← /kana — visão geral + atalhos para as 5 sub-páginas
│   ├── KanaLearnPage.tsx        ← /kana/aprender — tabela de referência por grupo/linha
│   ├── KanaTrainPage.tsx        ← /kana/treinar — seletor de modo + filtros + KANA_MODE_COMPONENTS
│   ├── KanaReviewPage.tsx       ← /kana/revisar — difíceis, nunca vistos, dominados
│   ├── KanaStatsPage.tsx        ← /kana/estatisticas — precisão geral e por grupo + reset
│   ├── KanaSettingsPage.tsx     ← /kana/configurar — grupos, modo padrão, dica de romaji
│   ├── VocabularyLibraryPage.tsx ← /vocabulario — biblioteca naveg. (busca, filtro N5-N2, paginação)
│   ├── VocabularyPage.tsx       ← /vocabulario/treinar — 4 modos + filtros inteligentes
│   ├── AulasExtrasPage.tsx      ← /aulas — material complementar (placeholder, ver docs/TODO_AULAS_EXTRAS.md)
│   ├── ExamsPage.tsx            ← hub de simulados (hero, níveis N1-N5, histórico)
│   ├── ExamDetailPage.tsx       ← execução + revisão de simulado
│   ├── DashboardPage.tsx        ← /progresso — stats reais + placeholders de gamificação
│   ├── LoginPage.tsx            ← /entrar — split-screen + <SignIn/> Clerk (fora do AppLayout)
│   ├── SettingsPage.tsx         ← /configuracoes — perfil + tema + preferências (settings.local.ts)
│   ├── AboutPage.tsx / ContactPage.tsx / PrivacyPage.tsx / TermsPage.tsx
│   └── not-found.tsx
│
├── services/
│   ├── auth/
│   │   ├── auth.clerk.ts        ← useCurrentUser() / useSignOut() (Clerk)
│   │   └── auth.types.ts
│   ├── exams/
│   │   ├── exams.local.ts       ← salvar/buscar tentativas de simulado
│   │   └── exams.types.ts
│   ├── progress/
│   │   ├── progress.local.ts    ← ÚNICA fonte de leitura/escrita de progresso (localStorage)
│   │   │                          inclui getWeeklyActivity() (atividade semanal real, derivada dos attempts)
│   │   ├── progress.remote.ts   ← syncProgressToRemote() / fetchProgressFromRemote() (D1 via Workers)
│   │   └── progress.types.ts    ← tipos internos do serviço
│   └── settings/
│       └── settings.local.ts    ← preferências de app (tema, sons, romaji); applyTheme() aplica .dark
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

### 3. Clerk + Cloudflare D1 já estão integrados
- Auth: `src/services/auth/auth.clerk.ts` (`@clerk/react`, `<ClerkProvider>` em `main.tsx`)
- Sync remoto: `src/services/progress/progress.remote.ts` (Workers API em `cloudflare/api/`)

Login é **opcional**: sem login, tudo continua em `localStorage`. Com login, o usuário
pode sincronizar o progresso local com a conta (banner `SyncProgressBanner` no Dashboard).
Não crie um segundo serviço de auth ou de sync paralelo — estenda os existentes.

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
Container principal: `<div className="max-w-6xl mx-auto px-4 py-6">`.

### Layout responsivo
```
Desktop (>= 1024px):   DesktopSidebar (w-60 fixa) + main com lg:pl-60
                       xl+ mostra também RightStudyPanel
Tablet (768–1023px):   sem sidebar — MobileTopBar + MobileBottomNav (mesmo padrão do mobile)
Mobile (< 768px):      MobileTopBar + MobileBottomNav (pb-16 no main, até lg)
```

O `AppLayout` → `ResponsiveAppShell` já cuida de tudo. Não recrie nav em páginas.

### Progresso de kana

**Critérios:**
| Classificação | Tentativas | Precisão |
|--------------|-----------|---------|
| Dominado | ≥ 5 | ≥ 85% |
| Difícil | ≥ 3 | < 60% |
| Nunca visto | 0 | — |

Tentativas com `skipped: true` não contam para nenhuma métrica.

Funções: `getWeakKana(ids, limit?)`, `getMasteredKana(ids)`, `getNeverSeenKana(ids)`, `getKanaFilterStats(ids)`,
`getKanaStats()` (totais globais), `getKanaCharacterStats(kanaId)` (attempts/correct/errors/skipped/accuracy
por caractere), `getKanaGroupStats()` (precisão agregada por grupo: basic/dakuten/handakuten/yoon),
`resetKanaProgress()` (reseta só o progresso de kana, sem afetar vocabulário/simulados).

`recordKanaAttempt(kanaId, correct, { mode?, skipped?, group? })` registra o modo de treino e o grupo do
caractere junto com a tentativa.

### Progresso de vocabulário

Mesmo critério de dominada/difícil.
Cada tentativa registra `WeakReason`: `'reading' | 'meaning' | 'listening' | 'typing'`.

Funções: `recordWordAttempt(input)`, `getWeakWords(limit)`, `getMasteredWords()`, `getNeverSeenWords()`, `getVocabStats()`.

### Páginas e rotas de Kana
```
/kana                ← KanaHubPage      (visão geral + atalhos)
/kana/aprender       ← KanaLearnPage    (tabela de referência por grupo/linha)
/kana/treinar        ← KanaTrainPage    (seletor de modo + filtros + treino)
/kana/revisar        ← KanaReviewPage   (difíceis, nunca vistos, dominados)
/kana/estatisticas   ← KanaStatsPage    (precisão geral/por grupo + reset)
/kana/configurar     ← KanaSettingsPage (grupos, modo padrão, dica de romaji)
```
A `KanaSubNav` é renderizada no topo de todas as 6 páginas (abaixo do `PageHeader`).

### Grupos de kana e modos de treino
```ts
type KanaGroup = 'basic' | 'dakuten' | 'handakuten' | 'yoon';
// basic: hiragana/katakana básico (a~n) · dakuten: が ざ だ ば... · handakuten: ぱぴぷぺぽ · yoon: きゃ しゅ ぎょ...

type KanaTrainingMode =
  | 'typing'         // TypingMode.tsx        — digitar o romaji
  | 'flashcards'      // FlashcardsMode.tsx    — virar carta e avaliar
  | 'multiple_choice' // MultipleChoiceMode.tsx — escolher romaji entre 4 opções
  | 'matching_pairs'  // MatchingPairsMode.tsx — combinar kana ↔ romaji em lotes
  | 'listening'       // ListeningMode.tsx     — ouvir e responder (Web Speech API)
  | 'word_builder'    // WordBuilderMode.tsx   — montar palavras com data/kanaWords.ts
  | 'tracing';        // TracingMode.tsx       — placeholder, ver docs/TODO_TRACING.md
```
`KANA_MODE_COMPONENTS` (em `components/kana/modes/index.ts`) mapeia cada modo ao seu componente,
todos com a mesma interface `{ items: KanaItem[]; showRomajiHint?: boolean }`.

### Filtros compartilhados de kana
```tsx
// useKanaFilters() centraliza script + grupos habilitados + "apenas problemáticos"
const { script, groupPrefs, onlyWeak, groupFilteredItems, filteredItems } = useKanaFilters();
// groupFilteredItems: itens do script atual restritos aos grupos habilitados
// filteredItems: groupFilteredItems + filtro "apenas problemáticos" (com fallback se vazio)
```
Usado por `KanaTrainPage`, `KanaLearnPage` e `KanaSettingsPage`.

### Hook de treino de kana (modo digitação)
```tsx
// useKanaTrainer aceita KanaItem[] (não KanaType)
const trainer = useKanaTrainer(filteredItems);
// Resetar com nova lista:
trainer.resetQueue(newItems);
```
Para os demais modos, use `useKanaQueue<T>(items)` diretamente — retorna
`{ queue, current, currentIndex, sessionCorrect, sessionTotal, sessionSkipped, sessionAccuracy, next, reset, registerResult, registerSkip, endSession }`.

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
| `koto:kana_type` | `KanaType` (script preferido: hiragana/katakana/mixed) |
| `koto:kana_romaji_hint` | `boolean` (mostrar romaji como dica) |
| `koto:kana_group_prefs` | `Record<KanaGroup, boolean>` (grupos habilitados: basic/dakuten/handakuten/yoon) |
| `koto:kana_only_weak` | `boolean` (filtro "apenas problemáticos") |
| `koto:kana_train_mode` | `KanaTrainingMode` (modo de treino padrão/último usado) |
| `koto:tracing_practice` | `Record<kanaId, number>` (contagem de "marcar como praticado" no TracingMode) |
| `koto:remote_sync` | `boolean` (indica que o progresso local já foi sincronizado com a conta via D1) |

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

## Documentação de funcionalidades

| Arquivo | Assunto | Status |
|---------|---------|--------|
| `docs/TODO_CLERK_AUTH.md` | Autenticação com Clerk | ✅ implementado |
| `docs/TODO_CLOUDFLARE_D1.md` | Backend Cloudflare D1 + Workers | ✅ implementado (falta apenas `wrangler d1 create` real + `CLERK_SECRET_KEY`) |

## TODOs documentados (não implementar sem instrução)

| Arquivo | Assunto |
|---------|---------|
| `docs/TODO_TRACING.md` | Feature de traçado de kana (SVG stroke order) |
| `docs/TODO_EXAMS.md` | Expansão dos simulados JLPT N3/N2/N1, timer, histórico |
| `docs/TODO_AULAS_EXTRAS.md` | Página `/aulas` (material complementar estilo Cure Dolly) — placeholder visual |

---

## O que NÃO fazer

- ❌ `localStorage.getItem/setItem` direto em componentes
- ❌ Instalar `react-router-dom` (usa Wouter)
- ❌ Instalar `@clerk/clerk-react` (descontinuado — usar `@clerk/react`, já integrado)
- ❌ Criar um segundo serviço de auth ou de sync paralelo a `auth.clerk.ts`/`progress.remote.ts`
- ❌ Usar `any` implícito no TypeScript
- ❌ Colocar `<AdPlaceholder>` dentro de cards de exercício
- ❌ Duplicar lógica de nav (AppLayout já gerencia tudo)
- ❌ Acessar `import.meta.env` fora de `main.tsx` ou `App.tsx` para base URL

---

## Marca

- **Cor primária:** `#ac2b2f` (vermelho Koto — atualizado no refactor de design; tokens completos em `src/index.css`)
- **Headline:** `'Plus Jakarta Sans', sans-serif` (`font-heading`) — corpo continua `Inter`
- **Fonte japonesa:** `'Noto Sans JP', sans-serif` — aplicar via `style={{ fontFamily: ... }}` ou `font-japanese`
- **Mascote:** Pingo-sensei, pinguim preto com detalhes vermelhos
- **Público-alvo:** estudantes brasileiros iniciantes em japonês

---

## Documentação de funcionalidades

| Arquivo | Assunto | Status |
|---------|---------|--------|
| `docs/TODO_CLERK_AUTH.md` | Autenticação com Clerk | ✅ implementado |
| `docs/TODO_CLOUDFLARE_D1.md` | Backend Cloudflare D1 + Workers | ✅ implementado (falta apenas `wrangler d1 create` real + `CLERK_SECRET_KEY`) |
| `docs/TODO_GAMIFICATION.md` | Streak, XP/nível, conquistas (placeholders visuais do refactor de design) | ❌ não implementado |
