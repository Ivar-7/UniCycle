import { onAuthStateChanged, type User } from 'firebase/auth';
import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { logDiagnosticError, normalizeError, type AppError } from '@/shared/errors';
import { firebaseAuth } from '@/shared/firebase';
import { AuthContext } from './AuthContext';

export interface AuthProviderProps {
  readonly children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<AppError | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(
      firebaseAuth,
      (firebaseUser) => {
        setUser(firebaseUser);
        setIsLoading(false);
        setError(null);
      },
      (authError) => {
        const normalized = normalizeError(authError, 'AUTH_UNAUTHORIZED');
        logDiagnosticError(authError, 'AuthProvider');
        setError(normalized);
        setIsLoading(false);
      },
    );

    return () => {
      unsubscribe();
    };
  }, []);

  const value = useMemo(
    () => ({
      user,
      isLoading,
      error,
    }),
    [user, isLoading, error],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
