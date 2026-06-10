# TODO — Autenticação: Clerk

**Status:** planejado — não implementado no MVP. Placeholder em `src/services/auth/auth.placeholder.ts`.

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

## Como integrar quando o momento chegar

### 1. Instalar

```bash
pnpm --filter @workspace/koto add @clerk/clerk-react
```

### 2. Variável de ambiente

```bash
# .env.local (nunca comitar)
VITE_CLERK_PUBLISHABLE_KEY=pk_live_...
```

Adicionar via `environment-secrets` no Replit.

### 3. Envolver o app

```tsx
// src/main.tsx
import { ClerkProvider } from '@clerk/clerk-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

<ClerkProvider publishableKey={PUBLISHABLE_KEY}>
  <App />
</ClerkProvider>
```

### 4. Substituir o placeholder

```ts
// src/services/auth/auth.placeholder.ts → substituir com:
import { useUser, useClerk } from '@clerk/clerk-react';

export function useCurrentUser() {
  const { user, isSignedIn } = useUser();
  return { user, isAuthenticated: !!isSignedIn };
}
```

### 5. Adicionar botão de login (UI)

```tsx
import { SignInButton, UserButton } from '@clerk/clerk-react';

// Se não autenticado:
<SignInButton mode="modal">Entrar</SignInButton>

// Se autenticado:
<UserButton />
```

---

## Onde o Clerk aparece na UI

| Local | Componente |
|-------|-----------|
| Sidebar (desktop) | botão "Entrar" ou `<UserButton>` |
| MobileTopBar | ícone de perfil |
| Após completar simulado | "Salvar resultado na conta" |
| Dashboard | banner "Sincronize seu progresso" |

---

## Não instalar ainda

O arquivo `src/services/auth/auth.placeholder.ts` já tem TODOs marcados para cada ponto de substituição.

Não instalar `@clerk/clerk-react` no MVP. A instalação prematura adiciona bundle sem funcionalidade.

---

## Status

| Etapa | Status |
|-------|--------|
| Placeholder de auth | ✅ criado |
| Integração Clerk | não implementado |
| Fluxo de sync pós-login | não implementado |
| UI de login na sidebar | não implementado |
