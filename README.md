# Koto by Pingo

**Japonês em pequenos treinos diários.**

Koto by Pingo é um app web brasileiro para treinar japonês com kana, vocabulário, escuta e simulados estilo JLPT.

---

## Sobre a marca

O Koto é um produto da [Pingo Concursos](https://pingoconcursos.com.br), marca brasileira de preparação para exames e certificações.

O mascote **Pingo** é um pinguim preto. No Koto, ele aparece como **Pingo-sensei**, guia dos estudos de japonês.

---

## Como trocar o placeholder pelo mascote real

O componente `PingoMascot` carrega automaticamente `/brand/pingo.png` quando disponível.

1. Coloque a imagem do Pingo em `artifacts/koto/public/brand/pingo.png`
2. O componente usará a imagem real em todas as variantes
3. Se a imagem não existir, o placeholder SVG é exibido automaticamente

Veja `artifacts/koto/public/brand/README.md` para mais detalhes.

---

## Rodando localmente

```bash
# Instalar dependências
pnpm install

# Iniciar o servidor de desenvolvimento
pnpm --filter @workspace/koto run dev
```

O app estará disponível em `http://localhost:<PORT>`.

---

## Build para produção

```bash
pnpm --filter @workspace/koto run build
```

O build é gerado em `artifacts/koto/dist/public`.

---

## Estrutura do projeto

```
artifacts/koto/src/
  app/           — Router e configuração do app
  components/
    brand/       — Logo, BrandMark, AppIcon, PingoMascot, MascotMessage
    layout/      — AppLayout, Navbar, Footer, MobileBottomNav
    ui/          — Componentes genéricos (ProgressBar, StatCard, etc.)
    kana/        — KanaTrainer, KanaInput, KanaStats
    vocabulary/  — VocabularyCard, VocabularyQuiz
    quiz/        — QuizCard, MultipleChoiceQuestion, ResultSummary
  pages/         — Todas as páginas do app
  data/          — kana.ts, vocabulary.ts, mockExams.ts
  hooks/         — useLocalStorage, useStudyProgress, useKanaTrainer
  services/
    progress/    — Acesso ao localStorage (nunca acessar direto)
    auth/        — Placeholder para Clerk
    exams/       — Lógica de simulados
  types/         — Tipos TypeScript
  utils/         — kana, scoring, seo, storage

cloudflare/      — Schema SQL e migrations para Cloudflare D1
```

---

## Como o LocalStorage funciona

Todo o progresso do usuário é armazenado localmente no navegador.

**Regra:** Nenhum componente ou página acessa o `localStorage` diretamente. Todo acesso passa por `src/services/progress/progress.local.ts`.

Chaves utilizadas (prefixo `koto:`):
- `koto:kana_progress` — histórico de tentativas de kana
- `koto:vocab_progress` — histórico de tentativas de vocabulário
- `koto:exam_attempts` — simulados completados
- `koto:sessions` — sessões de estudo

---

## Como o Clerk entrará depois

O arquivo `src/services/auth/auth.placeholder.ts` tem comentários `TODO` indicando cada ponto de integração.

Para integrar o Clerk:
1. `pnpm --filter @workspace/koto add @clerk/clerk-react`
2. Adicionar `VITE_CLERK_PUBLISHABLE_KEY` às variáveis de ambiente
3. Envolver `<App>` com `<ClerkProvider>`
4. Substituir as funções do placeholder pelas APIs do Clerk

---

## Como o Cloudflare D1 entrará depois

O arquivo `cloudflare/schema.sql` contém todas as tabelas necessárias.

Para ativar:
1. Criar o banco: `npx wrangler d1 create koto_by_pingo`
2. Copiar `wrangler.example.toml` → `wrangler.toml` e preencher `database_id`
3. Aplicar migrations: `npx wrangler d1 migrations apply koto_by_pingo`
4. Implementar as rotas da API em `cloudflare/api/`
5. Substituir os stubs em `services/progress/progress.remote.placeholder.ts`

---

## Como publicar no Cloudflare Pages

1. Faça o build: `pnpm --filter @workspace/koto run build`
2. O diretório de saída é `artifacts/koto/dist/public`
3. No painel do Cloudflare Pages, configure:
   - Build command: `pnpm --filter @workspace/koto run build`
   - Build output directory: `artifacts/koto/dist/public`
4. Para usar Cloudflare Workers/Functions junto com Pages, veja a documentação oficial.

---

## Tecnologia

- **React 19** + **TypeScript**
- **Vite** (build tool)
- **Tailwind CSS** (estilização)
- **Wouter** (roteamento)
- **Framer Motion** (animações)
- **localStorage** (persistência local)

---

## Licença

Propriedade da Pingo Concursos. Uso pessoal e educacional permitido.
