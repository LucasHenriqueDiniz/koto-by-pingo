# TODO — Backend: Cloudflare D1

**Status:** planejado — não implementado no MVP. O app funciona 100% com localStorage.

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
| `kana_attempts` | histórico de tentativas de kana por usuário |
| `vocabulary_attempts` | histórico de tentativas por palavra |
| `word_progress` | progresso consolidado por palavra |
| `exam_attempts` | simulados realizados |
| `exam_answers` | respostas por questão por simulado |
| `study_sessions` | sessões de estudo |
| `user_preferences` | preferências do usuário (ex: showHint, pairMode) |

Schema completo disponível em: `cloudflare/schema.sql`

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

1. Criar banco: `npx wrangler d1 create koto_by_pingo`
2. Aplicar migration: `npx wrangler d1 migrations apply koto_by_pingo`
3. Configurar `wrangler.toml` (ver `wrangler.example.toml`)
4. Adicionar `CLERK_SECRET_KEY` via `wrangler secret put CLERK_SECRET_KEY`

---

## Stubs para substituição

- `src/services/progress/progress.remote.placeholder.ts` — substituir com chamadas reais à API
- `src/services/auth/auth.placeholder.ts` — substituir com Clerk SDK

---

## Status

| Etapa | Status |
|-------|--------|
| Schema SQL | ✅ criado em `cloudflare/schema.sql` |
| Migration inicial | ✅ criada em `cloudflare/migrations/0001_initial.sql` |
| Workers API | não implementado |
| Sync automático | não implementado |
| Offline queue | não implementado |
