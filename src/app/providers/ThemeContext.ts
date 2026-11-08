import { createContext } from 'react';

export type ThemeMode = 'light' | 'dark';

export interface ThemeContextValue {
  readonly theme: ThemeMode;
  readonly toggleTheme: () => void;
  readonly setTheme: (theme: ThemeMode) => void;
}

export const ThemeContext = createContext<ThemeContextValue | null>(null);
