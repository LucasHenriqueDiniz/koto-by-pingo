# 🇯🇵 Koto by Pingo — Instruções para Agentes

Guia rápido para agentes IA trabalhando neste projeto.

---

## O que é Koto by Pingo

App web de aprendizado de japonês para estudantes brasileiros. 100% offline-first com autenticação Clerk opcional.

**Stack:** React 19 + Vite + TypeScript + Tailwind + Wouter + @tanstack/react-query  
**Banco:** localStorage primary + Cloudflare D1 (opcional, quando logado)  
**Ícones:** Material Symbols Outlined (removeu lucide-react)

---

## Hard Constraints — Nunca viole

1. **localStorage via serviço only**
   ```js
   ✅ import { recordKanaAttempt } from '../services/progress/progress.local';
   ❌ localStorage.setItem(...)  // proibido em componentes
   ```

2. **Wouter, não React Router**
   ```tsx
   ✅ import { Link, useLocation } from 'wouter';
   ❌ react-router-dom  // proibido
   ```

3. **Sem `any` implícito** — TypeScript estrito
   ```bash
   pnpm --filter @workspace/koto run build  # deve passar
   ```

4. **AdSense: não colocar dentro de cards** (flashcard, questão)
   - ✅ Antes/depois de sessão, sidebar direita, entre blocos editoriais
   - ❌ Entre opções, adjacente a botões, dentro de exercícios

5. **Clerk + D1 já estão integrados** — não crie segundo serviço de auth

---

## Estrutura de pastas (rápido)

```
artifacts/koto/src/
├── App.tsx                    # Rotas (Wouter)
├── pages/                     # 6 páginas de Kana + 4 de Vocabulário + Simulados + Dashboard
├── components/
│   ├── kana/modes/            # 7 modos de treino (typing, flashcards, multiple_choice, etc)
│   ├── layout/                # AppLayout, DesktopSidebar, MobileBottomNav
│   └── ui/                    # Shadcn + componentes custom
├── services/progress/         # ÚNICA fonte de localStorage
├── data/
│   ├── kana.ts               # 46 hiragana + 46 katakana + variações
│   ├── vocabulary.ts         # 45 palavras N5 em 9 categorias
│   └── mockExams.ts          # Simulados N5/N4
└── types/                    # KanaItem, VocabularyWord, Attempt, etc
```

**CLAUDE.md no repo** tem estrutura completa.

---

## Fluxo padrão de trabalho

1. **Clonar / receber task**
   ```bash
   pnpm install
   pnpm --filter @workspace/koto run dev  # porta 5173
   ```

2. **Ler contexto**
   - Ler `CLAUDE.md` (hard constraints)
   - Ler `AGENT_REFERENCE.md` (tasks específicas)
   - Abrir preview do app em browser

3. **Implementar**
   - Editar código conforme instrução
   - Seguir convenções (ver AGENT_REFERENCE.md)
   - Usar serviços de progress para localStorage

4. **Validar**
   ```bash
   ./.claude/skills/validate-koto-build.sh  # build + types + files
   pnpm --filter @workspace/koto run build  # full build
   ```

5. **Commit + Push**
   ```bash
   git add artifacts/koto/
   git commit -m "Feature: descrição breve"
   git push origin main
   ```

6. **Audit opcional** (PRs grandes)
   ```bash
   ./.claude/skills/full-audit.sh draft  # local checks
   ```

---

## Tasks mais comuns

| Task | Arquivos | Comando |
|------|----------|---------|
| Adicionar palavra | `data/vocabulary.ts` | `pnpm run dev` → testar em `/vocabulario/treinar` |
| Adicionar questão | `data/mockExams.ts` | `pnpm run dev` → testar em `/simulados` |
| Novo modo de treino | `components/kana/modes/` | criar arquivo + registrar em `index.ts` |
| Ajustar critérios | `services/progress/progress.local.ts` | validar getWeakKana, getMasteredKana |
| Adicionar página | `pages/NomePage.tsx` → `App.tsx` | adicionar rota + nav |

Ver `AGENT_REFERENCE.md` para detalhes.

---

## Validação antes de commit

```bash
# 1. Build passa sem erros TS
pnpm --filter @workspace/koto run build

# 2. Dev server roda
pnpm --filter @workspace/koto run dev

# 3. Testar feature no browser (http://localhost:5173)

# 4. Validar com script
./.claude/skills/validate-koto-build.sh
```

---

## SEO e AdSense

- **Meta tags:** `updatePageSEO(title, description)` em toda página
- **AdPlaceholder:** Usar com cuidado (ver CLAUDE.md, seção "Regras de AdSense")
- **External audits:** Ver `EXTERNAL_SKILLS.md` (Claude SEO, AdSense Auditor)

---

## Referências rápidas

- **CLAUDE.md** — Tudo sobre o projeto (stack, regras, rotas, tipos)
- **AGENT_REFERENCE.md** — Tasks com exact steps
- **EXTERNAL_SKILLS.md** — Claude SEO + AdSense Auditor
- **settings.json** — Config do projeto
- **Docs/** — TODO_CLERK_AUTH.md, TODO_CLOUDFLARE_D1.md, TODO_TRACING.md, etc

---

## Contato / Ajuda

Leia AGENT_REFERENCE.md para task específica.  
Leia CLAUDE.md para hard constraints e convenções.  
Rode `./.claude/skills/validate-koto-build.sh` antes de commit.
