# TODO — Authentication: Clerk

**Status:** implemented. `src/services/auth/auth.clerk.ts` replaces the old placeholder.

---

## Why Clerk

- Managed authentication with no infrastructure of our own.
- Social login (Google, GitHub), magic link, email + password.
- A React SDK (`@clerk/clerk-react`) with ready-made hooks.
- The Clerk `userId` becomes the logical foreign key in Cloudflare D1.
- Compatible with Cloudflare Workers (edge runtime).

---

## Planned authentication flow

```
1. Anonymous visitor
   └── Uses the app on localStorage
   └── No account, no server

2. The visitor decides to create an account
   └── Clicks "Criar conta" (create account) or "Entrar" (sign in)
   └── Clerk opens the sign-in/sign-up modal
   └── After authentication: userId is available through useUser()

3. Post-login
   └── The app checks whether there is data in localStorage
   └── If there is: ask "Deseja sincronizar?" (sync it?)
   └── If yes: POST /api/progress/sync
   └── The progress is now tied to the Clerk userId

4. Active session
   └── Attempts are sent to D1 as they happen
   └── localStorage acts as a cache

5. Sign-out
   └── The local localStorage is left untouched
   └── The data in D1 stays tied to the account
   └── The next sign-in reloads it from D1
```

---

## How it was implemented

### 1. Dependency

```bash
pnpm --filter @workspace/koto add @clerk/react
```

> Note: `@clerk/clerk-react` was discontinued in favour of `@clerk/react` (Clerk "Core 3").

### 2. Environment variable

`artifacts/koto/.env.local` (not versioned):
```bash
VITE_CLERK_PUBLISHABLE_KEY=pk_test_...
```

### 3. The app wrapped in `ClerkProvider`

`src/main.tsx`:
```tsx
import { ClerkProvider } from '@clerk/react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

<ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
  <App />
</ClerkProvider>
```

### 4. The auth service

`src/services/auth/auth.clerk.ts` exposes `useCurrentUser()` (built on `useUser()`) and
`useSignOut()` (built on `useClerk()`), mapping onto the `AuthUser`/`AuthSession` types in
`auth.types.ts`. It replaces the old `auth.placeholder.ts`.

### 5. Sign-in buttons (UI)

`<Show when="signed-out">` + `<SignInButton mode="modal">` / `<Show when="signed-in">` +
`<UserButton />`, both from `@clerk/react`.

---

## Where Clerk shows up in the UI

| Place | Component | Status |
|-------|-----------|--------|
| Sidebar (desktop) | the `Entrar` button ("sign in") or `<UserButton>` | ✅ `DesktopSidebar.tsx` |
| MobileTopBar | profile icon | ✅ `MobileTopBar.tsx` |
| Dashboard | the `Sincronize seu progresso` banner ("sync your progress") | ✅ `SyncProgressBanner.tsx` |
| After finishing a mock exam | `Salvar resultado na conta` ("save the result to the account") | not implemented |

---

## Status

| Step | Status |
|------|--------|
| Clerk integration (`@clerk/react`) | ✅ implemented |
| `auth.clerk.ts` | ✅ implemented |
| Sign-in UI (sidebar + mobile) | ✅ implemented |
| Post-login sync flow | ✅ implemented — see `docs/TODO_CLOUDFLARE_D1.md` |
| `CLERK_SECRET_KEY` on the Worker (backend) | pending — `wrangler secret put CLERK_SECRET_KEY` |
