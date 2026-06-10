# Cloudflare D1 — Koto by Pingo

Este diretório contém a estrutura para integração futura com Cloudflare D1 (banco de dados SQLite).

## Configuração

1. Copie `wrangler.example.toml` para `wrangler.toml` (não versionar)
2. Crie o banco no Cloudflare:
   ```bash
   npx wrangler d1 create koto_by_pingo
   ```
3. Substitua `database_id` no `wrangler.toml` pelo ID gerado
4. Aplique as migrations:
   ```bash
   npx wrangler d1 migrations apply koto_by_pingo
   ```

## Estrutura

- `schema.sql` — schema completo do banco
- `migrations/0001_initial.sql` — migration inicial

## Integração com o app

Quando o backend Cloudflare Workers for implementado:
1. Adicione as rotas da API em `cloudflare/api/`
2. Substitua os stubs em `src/services/progress/progress.remote.placeholder.ts`
3. Adicione o Clerk para autenticação (ver `src/services/auth/auth.placeholder.ts`)
