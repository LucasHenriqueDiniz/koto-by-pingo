# Cloudflare D1 + Workers API — Koto by Pingo

Backend opcional para sincronizar o progresso (kana, vocabulário, simulados) com a conta Clerk
do usuário, usando Cloudflare D1 (SQLite) + Workers.

## Configuração

1. Copie `wrangler.example.toml` (raiz do repo) para `wrangler.toml` (não versionado)
2. Crie o banco no Cloudflare:
   ```bash
   npx wrangler d1 create koto_by_pingo
   ```
3. Substitua `database_id` em `wrangler.toml` pelo ID gerado
4. Aplique as migrations:
   ```bash
   npx wrangler d1 migrations apply koto_by_pingo
   # ou --local para desenvolvimento
   ```
5. Configure a secret do Clerk (necessária para validar os tokens de sessão):
   ```bash
   npx wrangler secret put CLERK_SECRET_KEY
   ```

## Estrutura

- `schema.sql` — schema completo do banco (referência)
- `migrations/0001_initial.sql` — schema inicial (users, sessions, attempts, exams)
- `migrations/0002_word_progress_and_preferences.sql` — progresso granular por palavra,
  metadados de tentativas de kana (modo/grupo/skipped) e preferências do usuário
- `api/index.ts` — entrypoint do Worker (router)
- `api/auth.ts` — validação do token Clerk (`@clerk/backend`) e upsert de usuário
- `api/handlers/` — handlers de progresso, kana, vocabulário, simulados e preferências

## Endpoints

Todos exigem `Authorization: Bearer <token Clerk>`.

```
POST   /api/progress/sync         — sincroniza progresso local (uso único, pós-login)
GET    /api/progress              — busca progresso salvo na conta
DELETE /api/progress/reset         — reseta o progresso da conta
POST   /api/kana/attempt          — registra uma tentativa de kana
POST   /api/vocab/attempt         — registra uma tentativa de vocabulário
POST   /api/exam/attempt          — salva o resultado de um simulado
GET    /api/user/preferences      — busca preferências do usuário
PUT    /api/user/preferences      — salva preferências do usuário
```

## Desenvolvimento local

```bash
npx wrangler dev --config ../wrangler.toml --local
```

## Integração com o app

- `src/services/auth/auth.clerk.ts` — `useCurrentUser()` / `useSignOut()` (Clerk)
- `src/services/progress/progress.remote.ts` — `syncProgressToRemote()` / `fetchProgressFromRemote()`
- `src/components/ui/SyncProgressBanner.tsx` — banner pós-login no Dashboard que oferece
  sincronizar o progresso local com a conta
- A URL base da API é configurável via `VITE_API_BASE_URL` (vazio = mesma origem)
