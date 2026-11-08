import { useCallback, useEffect, useState } from 'react';
import { getUserErrorMessage, logDiagnosticError } from '@/shared/errors';
import { useAsyncState, type AsyncStatus } from '@/shared/hooks/useAsyncState';
import { fetchStudentProfile, updateStudentProfile } from '../api/profile.api';
import type { StudentProfile, UpdateProfileInput } from '../api/profile.types';

export function useProfile() {
  const { state, setLoading, setEmpty, setSuccess, setError } =
    useAsyncState<StudentProfile | null>(null, 'loading');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const loadProfile = useCallback(async () => {
    setLoading();
    try {
      const profile = await fetchStudentProfile();
      setSuccess(profile);
    } catch (err: unknown) {
      setError(err);
    }
  }, [setError, setLoading, setSuccess]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile]);

  const saveProfile = useCallback(
    async (input: UpdateProfileInput, avatarFile?: File | null): Promise<boolean> => {
      if (!state.data) {
        return false;
      }
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(false);
      try {
        const updated = await updateStudentProfile(state.data, input, avatarFile);
        setSuccess(updated);
        setSaveSuccess(true);
        setIsSaving(false);
        return true;
      } catch (err: unknown) {
        logDiagnosticError(err, 'useProfile.saveProfile');
        setSaveError(getUserErrorMessage(err));
        setIsSaving(false);
        return false;
      }
    },
    [setSuccess, state.data],
  );

  const simulateStatus = useCallback(
    (status: AsyncStatus) => {
      if (status === 'loading') {
        setLoading();
      } else if (status === 'empty') {
        setEmpty();
      } else if (status === 'error') {
        setError(new Error('Simulated profile fetch error'));
      } else {
        void loadProfile();
      }
    },
    [loadProfile, setEmpty, setError, setLoading],
  );

  return {
    status: state.status,
    profile: state.data,
    error: state.error,
    isSaving,
    saveError,
    saveSuccess,
    saveProfile,
    reload: loadProfile,
    simulateStatus,
  };
}
