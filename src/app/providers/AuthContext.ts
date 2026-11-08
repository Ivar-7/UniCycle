import type { User } from 'firebase/auth';
import { createContext } from 'react';
import type { AppError } from '@/shared/errors';

export interface AuthContextValue {
  readonly user: User | null;
  readonly isLoading: boolean;
  readonly error: AppError | null;
}

export const AuthContext = createContext<AuthContextValue | null>(null);
