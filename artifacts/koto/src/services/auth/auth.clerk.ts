import { useUser, useClerk } from '@clerk/react';
import type { AuthUser, AuthSession } from './auth.types';

const ANONYMOUS_USER: AuthUser = {
  id: 'anonymous',
  displayName: 'Visitante',
  isAnonymous: true,
};

/** Current user session, backed by Clerk. While the session loads, returns the anonymous visitor. */
export function useCurrentUser(): AuthSession {
  const { user, isSignedIn, isLoaded } = useUser();

  if (!isLoaded || !isSignedIn || !user) {
    return { user: ANONYMOUS_USER, isAuthenticated: false };
  }

  const authUser: AuthUser = {
    id: user.id,
    displayName: user.fullName ?? user.username ?? user.primaryEmailAddress?.emailAddress ?? 'Usuário',
    email: user.primaryEmailAddress?.emailAddress,
    isAnonymous: false,
  };

  return { user: authUser, isAuthenticated: true };
}

export function useSignOut() {
  const { signOut } = useClerk();
  return signOut;
}
