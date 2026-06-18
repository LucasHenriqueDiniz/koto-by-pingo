# TODO — Backend: Cloudflare D1

**Status:** implementado (Workers API + D1) — pendente apenas criar o banco remoto real
(`wrangler d1 create`) e configurar `CLERK_SECRET_KEY` em produção. O app continua
funcionando 100% com localStorage quando o usuário não está logado.

---

## O que fica no localStorage agora

| Chave | Conteúdo |
|-------|----------|
| `koto:kana_progress` | tentativas de kana por caractere |
| `koto:vocab_progress` | tentativas de vocabulário (agregado) |
| `koto:word_progress` | progresso granular por palavra |
| `koto:exam_attempts` | simulados completados |
| `koto:sessions` | sessões de estudo |

Todos os dados são locais ao dispositivo e ao navegador.
A limpeza de dados do browser apaga o progresso.

---

## O que vai para o D1 depois

| Tabela | Propósito |
|--------|-----------|
| `users` | perfil básico + FK para Clerk userId |
| `kana_attempts` | histórico de tentativas de kana por usuário (inclui modo/grupo/skipped) |
| `vocabulary_attempts` | histórico de tentativas por palavra |
| `word_progress` | progresso consolidado por palavra |
| `exam_attempts` | simulados realizados |
| `exam_answers` | respostas por questão por simulado |
| `study_sessions` | sessões de estudo |
| `user_preferences` | preferências do usuário (JSON) |

Schema completo disponível em: `cloudflare/schema.sql` (migrations: `cloudflare/migrations/`)

---

## Estratégia de migração

### Fase 0 (atual)
- Usuário acessa sem conta.
- Todo progresso fica em `localStorage`.
- Nenhum dado vai para servidor.

### Fase 1 — Login com Clerk
- Usuário cria conta via Clerk.
- App detecta que há dados locais.
- Pergunta: _"Você tem progresso local. Deseja sincronizar com sua conta?"_
- Se sim:
  - `POST /api/progress/sync` — envia payload completo do localStorage
  - API escreve no D1 vinculado ao `clerk_id`
- Se não: localStorage e conta ficam separados

### Fase 2 — Sincronização contínua
- Após login, toda tentativa é salva simultaneamente no localStorage E enviada para a API.
- Se offline, enfileira em `IndexedDB` e sincroniza ao retomar conexão.
- `GET /api/progress` ao carregar o app para reconciliar estado.

### Fase 3 — Multi-dispositivo
- Progresso disponível em qualquer dispositivo via conta Clerk.
- localStorage vira cache local; D1 é a fonte de verdade.

---

## Endpoints futuros previstos

```
POST   /api/progress/sync         — sincronizar progresso local
GET    /api/progress              — buscar progresso do usuário
POST   /api/kana/attempt          — registrar tentativa de kana
POST   /api/vocab/attempt         — registrar tentativa de vocabulário
POST   /api/exam/attempt          — salvar resultado de simulado
GET    /api/user/preferences      — buscar preferências
PUT    /api/user/preferences      — salvar preferências
DELETE /api/progress/reset        — resetar progresso
```

---

## Configuração

1. ✅ Banco criado: `npx wrangler d1 create koto_by_pingo` → ID `5a9c4ef0-dc81-4720-96aa-ec883cb34461`
2. ✅ Migrations aplicadas: `npx wrangler d1 migrations apply koto_by_pingo --remote`
3. ✅ `wrangler.toml` atualizado com o `database_id` real
4. ✅ `CLERK_SECRET_KEY` configurado via `wrangler secret put CLERK_SECRET_KEY`
5. ✅ Worker deployado: `https://koto-by-pingo.lucas-hdo.workers.dev`
6. ✅ `VITE_API_BASE_URL` definido em `artifacts/koto/.env.local`

---

## Status

| Etapa | Status |
|-------|--------|
| Schema SQL | ✅ `cloudflare/schema.sql` |
| Migrations | ✅ aplicadas no banco remoto (9 tabelas) |
| Workers API | ✅ `cloudflare/api/` — todos os endpoints autenticados via `@clerk/backend` |
| `progress.remote.ts` | ✅ `syncProgressToRemote()` / `fetchProgressFromRemote()` |
| Banner de sync pós-login | ✅ `SyncProgressBanner` no Dashboard |
| Banco D1 remoto real | ✅ `koto_by_pingo` — ID `5a9c4ef0-dc81-4720-96aa-ec883cb34461` |
| `CLERK_SECRET_KEY` em produção | ✅ configurado via `wrangler secret put` |
| Worker deployado | ✅ `https://koto-by-pingo.lucas-hdo.workers.dev` |
| Sync automático (Fase 2) | não implementado — sync atual é sob demanda (Fase 1) |
| Offline queue (Fase 2) | não implementado |
