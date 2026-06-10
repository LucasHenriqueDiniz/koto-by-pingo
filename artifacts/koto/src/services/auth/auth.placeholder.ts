// TODO: Replace with Clerk integration.
// When Clerk is added:
//   1. Install @clerk/clerk-react
//   2. Wrap <App> with <ClerkProvider publishableKey={...}>
//   3. Replace getCurrentUser() with useUser() from @clerk/clerk-react
//   4. Replace signInPlaceholder() with Clerk's <SignIn /> component or redirect
//   5. Replace signOutPlaceholder() with signOut() from useClerk()

import type { AuthUser, AuthSession } from './auth.types';

const ANONYMOUS_USER: AuthUser = {
  id: 'anonymous',
  displayName: 'Visitante',
  isAnonymous: true,
};

export function getCurrentUser(): AuthUser {
  // TODO: return useUser().user from Clerk
  return ANONYMOUS_USER;
}

export function isAuthenticated(): boolean {
  // TODO: return useUser().isSignedIn from Clerk
  return false;
}

export function getSession(): AuthSession {
  return {
    user: ANONYMOUS_USER,
    isAuthenticated: false,
  };
}

export async function signInPlaceholder(): Promise<void> {
  // TODO: redirect to Clerk sign-in page or open modal
  console.warn('[auth.placeholder] Sign-in not yet implemented. Clerk will be integrated here.');
}

export async function signOutPlaceholder(): Promise<void> {
  // TODO: call Clerk signOut()
  console.warn('[auth.placeholder] Sign-out not yet implemented. Clerk will be integrated here.');
}
