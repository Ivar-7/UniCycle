import { useContext } from 'react';
import {
  PreferencesContext,
  type PreferencesContextValue,
} from '@/app/providers/PreferencesContext';

export function usePreferences(): PreferencesContextValue {
  const ctx = useContext(PreferencesContext);
  if (!ctx) {
    throw new Error('usePreferences must be used within PreferencesProvider');
  }
  return ctx;
}
