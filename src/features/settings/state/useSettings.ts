import { useCallback, useEffect, useState } from 'react';
import { getUserErrorMessage, logDiagnosticError } from '@/shared/errors';
import { clearLocalSeedCache } from '@/shared/firebase';
import { useAsyncState } from '@/shared/hooks/useAsyncState';
import { useAuth } from '@/shared/hooks/useAuth';
import { usePreferences } from '@/shared/hooks/usePreferences';
import { fetchStudentSettings, saveStudentSettings } from '../api/settings.api';
import type { StudentSettings } from '../api/settings.types';

export function useSettings() {
  const { user, isLoading: authLoading } = useAuth();
  const userId = user?.uid ?? null;
  const { syncFromSettings } = usePreferences();
  const { state, setLoading, setSuccess, setError } = useAsyncState<StudentSettings | null>(
    null,
    'loading',
  );
  const [savedBanner, setSavedBanner] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    setLoading();
    try {
      const data = await fetchStudentSettings(userId);
      setSuccess(data);
      syncFromSettings(data);
    } catch (err: unknown) {
      setError(err);
    }
  }, [setError, setLoading, setSuccess, syncFromSettings, userId]);

  useEffect(() => {
    if (authLoading) {
      return;
    }
    let active = true;
    void fetchStudentSettings(userId)
      .then((data) => {
        if (!active) {
          return;
        }
        setSuccess(data);
        syncFromSettings(data);
      })
      .catch((err: unknown) => {
        if (active) {
          setError(err);
        }
      });
    return () => {
      active = false;
    };
  }, [authLoading, setError, setSuccess, syncFromSettings, userId]);

  const updateSetting = useCallback(
    async <K extends keyof StudentSettings>(key: K, value: StudentSettings[K]) => {
      if (!state.data) {
        return;
      }
      setActionError(null);
      const optimistic: StudentSettings = {
        ...state.data,
        [key]: value,
      };
      setSuccess(optimistic);
      syncFromSettings(optimistic);
      try {
        const persisted = await saveStudentSettings(optimistic, userId);
        setSuccess(persisted);
        syncFromSettings(persisted);
        setSavedBanner(true);
      } catch (err: unknown) {
        logDiagnosticError(err, 'useSettings.updateSetting');
        setActionError(getUserErrorMessage(err));
      }
    },
    [setSuccess, state.data, syncFromSettings, userId],
  );

  const resetLocalCache = useCallback(async () => {
    clearLocalSeedCache();
    setSavedBanner(true);
    await loadSettings();
  }, [loadSettings]);

  return {
    user,
    status: state.status,
    settings: state.data,
    error: state.error,
    actionError,
    savedBanner,
    setSavedBanner,
    updateSetting,
    resetLocalCache,
    reload: loadSettings,
  };
}
