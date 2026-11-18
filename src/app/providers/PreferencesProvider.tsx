import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  fetchStudentSettings,
  readLocalPreferences,
  writeLocalPreferences,
} from '@/features/settings/api/settings.api';
import type { StudentSettings } from '@/features/settings/api/settings.types';
import { logDiagnosticError } from '@/shared/errors';
import { useAuth } from '@/shared/hooks/useAuth';
import { formatCurrency } from '@/shared/utils/format';
import { PreferencesContext } from './PreferencesContext';

export interface PreferencesProviderProps {
  readonly children: ReactNode;
}

export function PreferencesProvider({ children }: PreferencesProviderProps) {
  const { user } = useAuth();
  const [prefs, setPrefs] = useState<StudentSettings>(readLocalPreferences);

  useEffect(() => {
    let active = true;
    void fetchStudentSettings(user?.uid ?? null)
      .then((loaded) => {
        if (active) {
          setPrefs(loaded);
        }
      })
      .catch((err: unknown) => {
        logDiagnosticError(err, 'PreferencesProvider:fetchStudentSettings');
      });
    return () => {
      active = false;
    };
  }, [user?.uid]);

  const syncFromSettings = useCallback((nextSettings: StudentSettings) => {
    writeLocalPreferences(nextSettings);
    setPrefs(nextSettings);
  }, []);

  const formatPrice = useCallback(
    (amount: number) => formatCurrency(amount, prefs.preferredCurrency),
    [prefs.preferredCurrency],
  );

  const value = useMemo(
    () => ({
      currency: prefs.preferredCurrency,
      defaultCampusHall: prefs.defaultCampusHall,
      formatPrice,
      syncFromSettings,
    }),
    [formatPrice, prefs.defaultCampusHall, prefs.preferredCurrency, syncFromSettings],
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}
