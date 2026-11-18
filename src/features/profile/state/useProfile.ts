import { useCallback, useEffect, useState } from 'react';
import { getUserErrorMessage, logDiagnosticError } from '@/shared/errors';
import { useAsyncState } from '@/shared/hooks/useAsyncState';
import { useAuth } from '@/shared/hooks/useAuth';
import { fetchStudentProfile, updateStudentProfile } from '../api/profile.api';
import type { StudentProfile, UpdateProfileInput } from '../api/profile.types';

export function useProfile() {
  const { user, isLoading: authLoading } = useAuth();
  const { state, setLoading, setEmpty, setSuccess, setError } =
    useAsyncState<StudentProfile | null>(null, 'loading');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [saveSuccess, setSaveSuccess] = useState<boolean>(false);

  const loadProfile = useCallback(async () => {
    if (!user) {
      setEmpty();
      return;
    }
    setLoading();
    try {
      const profile = await fetchStudentProfile(user);
      setSuccess(profile);
    } catch (err: unknown) {
      setError(err);
    }
  }, [setEmpty, setError, setLoading, setSuccess, user]);

  useEffect(() => {
    if (!authLoading) {
      void loadProfile();
    }
  }, [authLoading, loadProfile]);

  const saveProfile = useCallback(
    async (input: UpdateProfileInput, avatarFile?: File | null): Promise<boolean> => {
      if (!state.data || !user) {
        return false;
      }
      setIsSaving(true);
      setSaveError(null);
      setSaveSuccess(false);
      try {
        const updated = await updateStudentProfile(state.data, user.uid, input, avatarFile);
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
    [setSuccess, state.data, user],
  );

  return {
    user,
    authLoading,
    status: state.status,
    profile: state.data,
    error: state.error,
    isSaving,
    saveError,
    saveSuccess,
    saveProfile,
    reload: loadProfile,
  };
}
