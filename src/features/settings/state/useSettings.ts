import { useCallback, useEffect, useState } from 'react';
import { getUserErrorMessage, logDiagnosticError } from '@/shared/errors';
import { useAsyncState } from '@/shared/hooks/useAsyncState';
import {
  fetchStudentSettings,
  resetAllCampusSeedCache,
  saveStudentSettings,
} from '../api/settings.api';
import type { StudentSettings } from '../api/settings.types';

export function useSettings() {
  const { state, setLoading, setSuccess, setError } = useAsyncState<StudentSettings | null>(
    null,
    'loading',
  );
  const [savedBanner, setSavedBanner] = useState<boolean>(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadSettings = useCallback(async () => {
    setLoading();
    try {
      const data = await fetchStudentSettings();
      setSuccess(data);
    } catch (err: unknown) {
      setError(err);
    }
  }, [setError, setLoading, setSuccess]);

  useEffect(() => {
    void loadSettings();
  }, [loadSettings]);

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
      try {
        const persisted = await saveStudentSettings(optimistic);
        setSuccess(persisted);
        setSavedBanner(true);
      } catch (err: unknown) {
        logDiagnosticError(err, 'useSettings.updateSetting');
        setActionError(getUserErrorMessage(err));
      }
    },
    [setSuccess, state.data],
  );

  const resetSeedData = useCallback(async () => {
    resetAllCampusSeedCache();
    setSavedBanner(true);
    await loadSettings();
  }, [loadSettings]);

  return {
    status: state.status,
    settings: state.data,
    error: state.error,
    actionError,
    savedBanner,
    setSavedBanner,
    updateSetting,
    resetSeedData,
    reload: loadSettings,
  };
}
