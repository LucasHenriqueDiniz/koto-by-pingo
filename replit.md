# Koto by Pingo

App web brasileiro para treino de japonês (kana, vocabulário, escuta e simulados estilo JLPT). "Japonês em pequenos treinos diários."

## Run & Operate

- `pnpm --filter @workspace/koto run dev` — servidor de desenvolvimento
- `pnpm --filter @workspace/koto run build` — build de produção (saída em `artifacts/koto/dist/public`)
- `pnpm --filter @workspace/koto run typecheck` — typecheck do app (não roda como parte de `build`)
- `pnpm --filter @workspace/koto run preview` — preview do build
- Sem variáveis de ambiente obrigatórias além de `PORT` e `BASE_PATH` (usadas pelo `vite.config.ts`)

## Stack

- pnpm workspaces, Node.js 24, TypeScript 5.9
- App: React 19 + Vite + TypeScript
- Estilização: Tailwind CSS v4 + Shadcn/UI
- Roteamento: Wouter (não React Router)
- Animações: framer-motion · Ícones: lucide-react
- Persistência: `localStorage` (prefixo `koto:`), sem backend/DB/auth reais ainda

## Where things live

- `artifacts/koto/` — o app Koto (único artifact ativo). Veja `CLAUDE.md` na raiz para o mapa completo de pastas e regras do projeto.
- `artifacts/koto/src/services/progress/progress.local.ts` — única fonte de leitura/escrita de progresso (localStorage).
- `cloudflare/` — schema SQL e migrations para uma futura migração ao Cloudflare D1 (ainda não ativada).
- `docs/TODO_*.md` — planos documentados para Clerk, Cloudflare D1, traçado de kana e expansão de simulados.

## Architecture decisions

- O app é 100% client-side e funciona offline após o primeiro carregamento — sem API, sem banco ativo.
- Stubs de autenticação (`services/auth/auth.placeholder.ts`) e sync remoto (`services/progress/progress.remote.placeholder.ts`) existem, mas não estão integrados — não instalar Clerk nem implementar D1 real sem instrução explícita.
- `artifacts/api-server`, `artifacts/mockup-sandbox` e `lib/db`, `lib/api-spec`, `lib/api-zod`, `lib/api-client-react` são resíduos do template fullstack inicial do Replit e **não são usados pelo Koto**. Não fazem parte do escopo de build/typecheck do app (`pnpm --filter @workspace/koto run build`/`typecheck`).

## Product

Módulos: Kana (treino de hiragana/katakana), Vocabulário (4 modos: flashcards, seleção de palavras, combinar pares, quiz de tradução), Escuta (Web Speech API), Simulados (N5/N4 mini) e Progresso (dashboard com estatísticas de kana e vocabulário).

## Gotchas

- O script `build` do koto (`vite build`) **não roda `tsc`** — erros de tipo só aparecem em `pnpm --filter @workspace/koto run typecheck`. Rodar os dois antes de considerar o trabalho concluído.
- `pnpm-workspace.yaml` tem uma seção `overrides` que originalmente excluía todos os binários nativos não-Linux (esbuild/rollup/lightningcss/tailwindcss-oxide), pensada para o ambiente Replit (linux-x64). As entradas `win32-x64*` foram removidas para permitir build em Windows — se o build falhar com "Cannot find module @rollup/rollup-<platform>" ou similar em outra plataforma, verificar essa seção.
- Mascote Pingo-sensei usa SVG embutido por padrão; para usar a imagem real, adicionar `artifacts/koto/public/brand/pingo.png`.

## Pointers

- `CLAUDE.md` (raiz) — guia completo para agentes de IA: estrutura, regras, convenções, chaves de localStorage.
- `artifacts/koto/README.md` — README do app (stack, módulos, layout, regras de AdSense).
- See the `pnpm-workspace` skill for workspace structure, TypeScript setup, and package details.
