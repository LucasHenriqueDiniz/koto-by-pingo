# TODO — Autenticação: Clerk

**Status:** implementado. `src/services/auth/auth.clerk.ts` substitui o antigo placeholder.

---

## Por que Clerk

- Autenticação gerenciada sem infraestrutura própria.
- Login social (Google, GitHub), magic link, e-mail+senha.
- SDK React (`@clerk/clerk-react`) com hooks prontos.
- `userId` do Clerk será a chave externa lógica no Cloudflare D1.
- Compatível com Cloudflare Workers (edge runtime).

---

## Fluxo de autenticação planejado

```
1. Usuário anônimo
   └── Usa o app com localStorage
   └── Sem conta, sem servidor

2. Usuário decide criar conta
   └── Clique em "Criar conta" ou "Entrar"
   └── Clerk abre modal de login/cadastro
   └── Após autenticação: userId disponível via useUser()

3. Pós-login
   └── App verifica se há dados no localStorage
   └── Se sim: perguntar "Deseja sincronizar?"
   └── Se sim: POST /api/progress/sync
   └── Progresso agora associado ao userId do Clerk

4. Sessão ativa
   └── Tentativas enviadas simultaneamente ao D1
   └── localStorage funciona como cache

5. Logout
   └── localStorage local permanece intacto
   └── Dados no D1 permanecem associados à conta
   └── Próximo login recarrega do D1
```

---

## Como foi implementado

### 1. Dependência

```bash
pnpm --filter @workspace/koto add @clerk/react
```

> Nota: `@clerk/clerk-react` foi descontinuado em favor de `@clerk/react` (Clerk "Core 3").

### 2. Variável de ambiente

`artifacts/koto/.env.local` (não versionado):
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### 3. App envolvido com `ClerkProvider`

`src/main.tsx`:
```tsx
import { ClerkProvider } from '@clerk/react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

<ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
  <App />
</ClerkProvider>
```

### 4. Serviço de auth

`src/services/auth/auth.clerk.ts` expõe `useCurrentUser()` (baseado em `useUser()`) e
`useSignOut()` (baseado em `useClerk()`), mapeando para os tipos `AuthUser`/`AuthSession`
de `auth.types.ts`. Substitui o antigo `auth.placeholder.ts`.

### 5. Botões de login (UI)

`<Show when="signed-out">` + `<SignInButton mode="modal">` / `<Show when="signed-in">` +
`<UserButton />`, ambos de `@clerk/react`.

---

## Onde o Clerk aparece na UI

| Local | Componente | Status |
|-------|-----------|--------|
| Sidebar (desktop) | botão "Entrar" ou `<UserButton>` | ✅ `DesktopSidebar.tsx` |
| MobileTopBar | ícone de perfil | ✅ `MobileTopBar.tsx` |
| Dashboard | banner "Sincronize seu progresso" | ✅ `SyncProgressBanner.tsx` |
| Após completar simulado | "Salvar resultado na conta" | não implementado |

---

## Status

| Etapa | Status |
|-------|--------|
| Integração Clerk (`@clerk/react`) | ✅ implementado |
| `auth.clerk.ts` | ✅ implementado |
| UI de login (sidebar + mobile) | ✅ implementado |
| Fluxo de sync pós-login | ✅ implementado — ver `docs/TODO_CLOUDFLARE_D1.md` |
| `CLERK_SECRET_KEY` no Worker (backend) | pendente — `wrangler secret put CLERK_SECRET_KEY` |
