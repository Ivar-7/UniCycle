import { useCallback, useState } from 'react';
import { useAsyncState, type AsyncStatus } from '@/shared/hooks/useAsyncState';
import {
  getInitialAuthSession,
  registerStudentWithFirebase,
  SEED_AUTH_SESSION,
  signInStudentWithFirebase,
  signOutStudentFromFirebase,
} from '../api/auth.api';
import type { AuthSessionSummary } from '../api/auth.types';

export function useStudentAuth() {
  const { state, setLoading, setEmpty, setSuccess, setError } = useAsyncState<AuthSessionSummary>(
    getInitialAuthSession(),
    'success',
  );
  const [universityEmail, setUniversityEmail] = useState<string>(SEED_AUTH_SESSION.email);
  const [password, setPassword] = useState<string>('campuspass123');
  const [fullName, setFullName] = useState<string>(SEED_AUTH_SESSION.fullName);
  const [residenceHall, setResidenceHall] = useState<string>(SEED_AUTH_SESSION.residenceHall);

  const submitSignIn = useCallback(async () => {
    setLoading();
    try {
      const session = await signInStudentWithFirebase({ universityEmail, password });
      setSuccess(session);
    } catch (err: unknown) {
      setError(err);
    }
  }, [password, setError, setLoading, setSuccess, universityEmail]);

  const submitRegister = useCallback(async () => {
    setLoading();
    try {
      const session = await registerStudentWithFirebase({
        universityEmail,
        password,
        fullName,
        residenceHall,
      });
      setSuccess(session);
    } catch (err: unknown) {
      setError(err);
    }
  }, [fullName, password, residenceHall, setError, setLoading, setSuccess, universityEmail]);

  const signOutStudent = useCallback(async () => {
    setLoading();
    try {
      await signOutStudentFromFirebase();
      setEmpty();
    } catch (err: unknown) {
      setError(err);
    }
  }, [setEmpty, setError, setLoading]);

  const simulateStatus = useCallback(
    (status: AsyncStatus) => {
      if (status === 'loading') {
        setLoading();
      } else if (status === 'empty') {
        setEmpty();
      } else if (status === 'error') {
        setError(new Error('Invalid university credentials'));
      } else {
        setSuccess(SEED_AUTH_SESSION);
      }
    },
    [setEmpty, setError, setLoading, setSuccess],
  );

  return {
    status: state.status,
    session: state.data,
    error: state.error,
    universityEmail,
    setUniversityEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    residenceHall,
    setResidenceHall,
    submitSignIn,
    submitRegister,
    signOutStudent,
    simulateStatus,
  };
}
