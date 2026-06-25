# 🎯 Agent Reference — Koto by Pingo

Quick guide para as tasks mais comuns. Use como checklist.

---

## 1️⃣ Adicionar Palavra ao Vocabulário

**Goal:** Adicionar nova palavra N5 ao vocabulário.

**Files:**
- `artifacts/koto/src/data/vocabulary.ts`
- `artifacts/koto/src/types/vocabulary.ts` (se novo campo)

**Steps:**
1. Editar `vocabulary.ts` → adicionar objeto à lista:
   ```ts
   {
     id: 'v-046',
     japanese: '猫',
     kana: 'ねこ',
     romaji: 'neko',
     meaningPt: 'gato',
     category: 'animais',
     level: 'N5',
   }
   ```
2. Categoria detectada automaticamente via `Set` — no need to update `categories`
3. Rodar dev server: `pnpm --filter @workspace/koto run dev`
4. Testar em `/vocabulario/treinar` — palavra deve aparecer em todos os 4 modos
5. Validar: `pnpm --filter @workspace/koto run build`
6. Commit: `git add artifacts/koto/src/data/vocabulary.ts && git commit -m "Add vocabulary: 猫 (neko)"`

**Checklist:**
- [ ] Palavra adicionada com 7 campos (id, japanese, kana, romaji, meaningPt, category, level)
- [ ] `id` é único e segue padrão `v-NNN`
- [ ] Categoria é válida (animais, alimentos, escola, trabalho, etc)
- [ ] Build passa
- [ ] Testado em dev server

---

## 2️⃣ Adicionar Questão ao Simulado

**Goal:** Adicionar questão múltipla escolha aos simulados (N5 Mini ou N4 Mini).

**Files:**
- `artifacts/koto/src/data/mockExams.ts`

**Steps:**
1. Editar `mockExams.ts` → adicionar questão ao exame correspondente:
   ```ts
   {
     id: 'n5-q-35',
     type: 'vocabulary',
     prompt: 'A frase abaixo significa?',
     japaneseText: '毎日、学校に行きます。',
     options: [
       { id: 'a', text: 'Vou à escola todo dia' },
       { id: 'b', text: 'Vou à escola uma vez por semana' },
       { id: 'c', text: 'Fico na escola todo dia' },
       { id: 'd', text: 'Deixo a escola todo dia' },
     ],
     correctOptionId: 'a',
     explanation: '毎日 = todo dia, 学校 = escola, に = para, 行く = ir',
     tags: ['n5', 'verbs'],
     difficulty: 2,
   }
   ```
2. Validar estrutura: id único, 4 opções, correctOptionId válido, explanation clara
3. Rodar: `pnpm --filter @workspace/koto run dev`
4. Testar em `/simulados/{examId}` — questão deve aparecer na posição correta
5. Build: `pnpm --filter @workspace/koto run build`
6. Commit: `git add artifacts/koto/src/data/mockExams.ts && git commit -m "Add exam question: n5-q-35"`

**Checklist:**
- [ ] Questão tem estrutura completa (id, type, prompt, japaneseText, options[4], correctOptionId, explanation, tags, difficulty)
- [ ] `id` é único e segue padrão `n5-q-NN` ou `n4-q-NN`
- [ ] 4 opções com textos significativos (não triviais)
- [ ] Resposta correta está em `options` (validar `correctOptionId`)
- [ ] Explicação em português claro
- [ ] Testado em dev server
- [ ] Build passa

---

## 3️⃣ Corrigir Critério de Domínio (Kana)

**Goal:** Ajustar "Dominado", "Difícil", "Nunca visto" para kana.

**Current criteria:**
| Status | Tentativas | Precisão |
|--------|-----------|---------|
| Dominado | ≥ 5 | ≥ 85% |
| Difícil | ≥ 3 | < 60% |
| Nunca visto | 0 | — |

**Files:**
- `artifacts/koto/src/services/progress/progress.local.ts` (funções `getWeakKana`, `getMasteredKana`)
- Teste em `artifacts/koto/src/pages/KanaStatsPage.tsx`

**Steps:**
1. Editar `progress.local.ts`:
   ```ts
   // Exemplo: mudar "Dominado" para ≥ 5 AND ≥ 90%
   export function getMasteredKana(kanaIds: string[]) {
     return kanaIds.filter(id => {
       const stats = getKanaCharacterStats(id);
       return stats.attempts >= 5 && stats.accuracy >= 0.90;  // ← MUDOU 0.85 para 0.90
     });
   }
   ```
2. Testar em `/kana/estatisticas` — contador de "Dominado" deve mudar
3. Build + commit

**Checklist:**
- [ ] Função editada corretamente
- [ ] Lógica de comparação está clara (>= ou <, não invertida)
- [ ] Testado em stats page
- [ ] Build passa

---

## 4️⃣ Novo Modo de Treino (Kana)

**Goal:** Implementar novo modo de treino para kana (ex: Reverse Flashcards).

**Files:**
- Criar: `artifacts/koto/src/components/kana/modes/ReverseFlashcardsMode.tsx`
- Editar: `artifacts/koto/src/components/kana/modes/index.ts` (registrar componente)
- Editar: `artifacts/koto/src/types/kana.ts` (adicionar `'reverse_flashcards'` a `KanaTrainingMode`)

**Steps:**
1. Criar novo componente em `modes/ReverseFlashcardsMode.tsx`:
   ```tsx
   export interface ReverseFlashcardsModeProp {
     items: KanaItem[];
     showRomajiHint?: boolean;
   }
   
   export function ReverseFlashcardsMode({ items, showRomajiHint }: ReverseFlashcardsModeProp) {
     const trainer = useKanaQueue(items);
     // ... implementação
     return <div>...</div>;
   }
   ```
2. Registrar em `components/kana/modes/index.ts`:
   ```ts
   import { ReverseFlashcardsMode } from './ReverseFlashcardsMode';
   
   export const KANA_MODE_COMPONENTS: Record<KanaTrainingMode, React.ComponentType<any>> = {
     // ... existentes
     reverse_flashcards: ReverseFlashcardsMode,  // ← ADD
   };
   ```
3. Adicionar a `KanaTrainingMode` em `types/kana.ts`:
   ```ts
   type KanaTrainingMode =
     | 'typing'
     | 'flashcards'
     | 'multiple_choice'
     | 'matching_pairs'
     | 'listening'
     | 'word_builder'
     | 'tracing'
     | 'reverse_flashcards';  // ← ADD
   ```
4. Testar em `/kana/treinar` — novo modo deve aparecer no seletor
5. Build + commit

**Checklist:**
- [ ] Componente tem interface `KanaItem[]` + `showRomajiHint?`
- [ ] Usa `useKanaQueue(items)` internamente
- [ ] Registrado em `KANA_MODE_COMPONENTS`
- [ ] Tipo adicionado a `KanaTrainingMode`
- [ ] Testado em dev server
- [ ] Build passa

---

## 5️⃣ Adicionar Nova Página (ex: AulasExtrasPage)

**Goal:** Criar nova página `/aulas` com conteúdo complementar.

**Files:**
- Criar: `artifacts/koto/src/pages/AulasExtrasPage.tsx`
- Editar: `artifacts/koto/src/App.tsx` (adicionar rota)
- Editar: `artifacts/koto/src/components/layout/DesktopSidebar.tsx` (link nav)
- Editar: `artifacts/koto/src/components/layout/MobileBottomNav.tsx` (link nav)

**Steps:**
1. Criar página:
   ```tsx
   import { PageHeader } from '../components/ui/PageHeader';
   import { updatePageSEO } from '../utils/seo';
   
   export function AulasExtrasPage() {
     useEffect(() => {
       updatePageSEO('Aulas Extras', 'Material complementar de japonês');
     }, []);
   
     return (
       <>
         <PageHeader
           title="Aulas Extras"
           description="Material complementar"
           color="#ac2b2f"
         />
         <div className="max-w-6xl mx-auto px-4 py-6">
           {/* conteúdo */}
         </div>
       </>
     );
   }
   ```
2. Adicionar rota em `App.tsx`:
   ```tsx
   <Route path="/aulas" component={AulasExtrasPage} />
   ```
3. Adicionar link em `DesktopSidebar.tsx` e `MobileBottomNav.tsx`:
   ```tsx
   <Link href="/aulas">Aulas Extras</Link>
   ```
4. Testar navegação em dev server
5. Build + commit

**Checklist:**
- [ ] Página criada com `PageHeader` + `updatePageSEO`
- [ ] Rota adicionada em `App.tsx`
- [ ] Links adicionados em sidebar + mobile nav
- [ ] Container principal usa `max-w-6xl mx-auto px-4 py-6`
- [ ] Testado em dev server (desktop + mobile)
- [ ] Build passa

---

## 6️⃣ Validar Build e Types

**Goal:** Garantir que código compila e passa em type checking.

**Steps:**
1. Rodar build:
   ```bash
   pnpm --filter @workspace/koto run build
   ```
2. Rodar skill de validação:
   ```bash
   ./.claude/skills/validate-koto-build.sh
   ```
3. Se erros, corrigir:
   - TS errors: tipo implícito, falta import, etc
   - File errors: arquivo deletado, path incorreto
4. Commit apenas depois que build passa

**Checklist:**
- [ ] `pnpm run build` passa sem erros
- [ ] Sem warnings de tipo implícito (`any`)
- [ ] `./.claude/skills/validate-koto-build.sh` passa
- [ ] Sem erros no console do dev server

---

## 7️⃣ Resetar Progresso do Usuário (Admin)

**Goal:** Limpar localStorage para testar do zero.

**Files:**
- `artifacts/koto/src/pages/KanaStatsPage.tsx` (botão "Resetar Progresso")
- `artifacts/koto/src/services/progress/progress.local.ts` (função `resetKanaProgress`)

**Steps:**
1. Ir para `/kana/estatisticas`
2. Clicar botão "Resetar Progresso" (vermelho, no final da página)
3. Confirmar em modal
4. localStorage é limpo (`koto:kana_progress`, `koto:sessions`, etc)
5. Página recarrega e volta a zero

**Nota:** Não é necessário editar código para isto — feature já implementada.

**Checklist:**
- [ ] Botão "Resetar" visível em `/kana/estatisticas`
- [ ] Modal de confirmação aparece
- [ ] localStorage limpo após confirmar
- [ ] Página recarrega com stats zeradas

---

## 8️⃣ Integrar AdSense / Publicidade

**Goal:** Adicionar `<AdPlaceholder>` em local apropriado.

**Rules:**
- ✅ Antes de iniciar sessão
- ✅ Depois de encerrar sessão
- ✅ Sidebar direita (desktop) com ≥ 16px espaçamento
- ✅ Entre blocos editoriais
- ❌ Dentro de flashcard, questão, par de matching
- ❌ Adjacente a botões de ação (Verificar, Próximo, etc)

**Files:**
- `artifacts/koto/src/components/ui/AdPlaceholder.tsx` (componente)
- Página onde adicionar (ex: `KanaLearnPage.tsx`)

**Steps:**
1. Importar componente:
   ```tsx
   import { AdPlaceholder } from '../components/ui/AdPlaceholder';
   ```
2. Adicionar em local válido (ex: depois de `PageHeader`):
   ```tsx
   <PageHeader ... />
   <AdPlaceholder />  {/* ← ADD aqui */}
   <div className="max-w-6xl mx-auto px-4 py-6">
     {/* conteúdo */}
   </div>
   ```
3. Testar em dev server (placeholder mostra retângulo cinza)
4. Build + commit

**Checklist:**
- [ ] Local válido (antes/depois de sessão ou editorial)
- [ ] ≥ 16px espaçamento se em sidebar
- [ ] Não dentro de card/questão/exercício
- [ ] Build passa

---

## 9️⃣ Sync com Cloudflare D1 (Para Logados)

**Goal:** Sincronizar progresso local com backend quando usuário faz login.

**Note:** Feature já implementada via `SyncProgressBanner` em Dashboard.  
Não é necessário editar código — apenas validar que Clerk + D1 estão conectados.

**Files:**
- `artifacts/koto/src/services/progress/progress.remote.ts` (sync logic)
- `artifacts/koto/src/pages/DashboardPage.tsx` (banner de sync)

**Verificação:**
1. Login com Clerk em `/entrar`
2. Ir para `/progresso`
3. Banner "Sincronizar Progresso" deve aparecer
4. Clicar em "Sincronizar" → progresso é enviado para D1

**Note:** Requer `CLERK_SECRET_KEY` e `wrangler d1 create` real (ver `docs/TODO_CLOUDFLARE_D1.md`).

**Checklist:**
- [ ] Clerk login funciona
- [ ] Banner aparece em `/progresso`
- [ ] Clicar em sincronizar não gera erro
- [ ] (Production) Progresso é salvo em D1

---

## 🔟 Rodas Script de Validação (Audit)

**Goal:** Validar projeto antes de fazer PR grande ou deploy.

**Steps:**
```bash
# Validar build
./.claude/skills/validate-koto-build.sh

# Validar conteúdo (kana, vocabulary, exams)
./.claude/skills/validate-learning-content.sh

# Audit completo (draft/local checks)
./.claude/skills/full-audit.sh draft

# Audit live (se pronto para deploy)
./.claude/skills/full-audit.sh live
```

**Checklist:**
- [ ] `validate-koto-build.sh` passa (build + files)
- [ ] `validate-learning-content.sh` passa (vocabulário + kana + simulados)
- [ ] `full-audit.sh draft` passa (checks locais)
- [ ] Se PR grande, rodar `full-audit.sh draft` antes de push

---

## 🔗 External Skills

Para audits mais profundos, ver `EXTERNAL_SKILLS.md`:

- **Claude SEO:** Verificar meta tags, canonical URLs, schema.org
- **AdSense Auditor:** Validar placement, revenue potential, compliance

Ambas são opcionais — use para PRs grandes ou antes de deploy.

---

## ⚙️ Atalhos úteis

```bash
# Dev server
pnpm --filter @workspace/koto run dev          # porta 5173

# Build
pnpm --filter @workspace/koto run build        # full build

# Preview
pnpm --filter @workspace/koto run preview      # local preview do build

# Scripts customizados
./.claude/skills/validate-koto-build.sh        # rápido (2s)
./.claude/skills/validate-learning-content.sh  # médio (5s)
./.claude/skills/full-audit.sh draft          # completo local (30s)
```

---

## 📌 Antes de commit

```bash
# 1. Build passa
pnpm --filter @workspace/koto run build

# 2. Feature testada em dev server
pnpm --filter @workspace/koto run dev

# 3. Validação rápida
./.claude/skills/validate-koto-build.sh

# 4. Se OK → commit
git add artifacts/koto/
git commit -m "Feature/Fix: descrição breve"
git push origin main
```

---

## 📚 Referências

- **CLAUDE.md** — Estrutura completa, hard constraints, convenções
- **INSTRUCTIONS.md** — Onboarding (5 min)
- **EXTERNAL_SKILLS.md** — Claude SEO + AdSense Auditor
- **settings.json** — Config do projeto (build, perms)
