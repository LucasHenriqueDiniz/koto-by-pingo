export interface AuthUser {
  id: string;
  displayName: string;
  email?: string;
  isAnonymous: boolean;
}

export interface AuthSession {
  user: AuthUser | null;
  isAuthenticated: boolean;
}
