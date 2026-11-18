import { useCallback, useMemo, useState } from 'react';
import { getUserErrorMessage } from '@/shared/errors';
import { useAuth } from '@/shared/hooks/useAuth';
import {
  buildSessionSummary,
  registerStudentWithFirebase,
  sendStudentPasswordReset,
  signInStudentWithFirebase,
  signOutStudentFromFirebase,
} from '../api/auth.api';

export function useStudentAuth() {
  const { user, isLoading: authLoading } = useAuth();
  const [universityEmail, setUniversityEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [residenceHall, setResidenceHall] = useState<string>('North Hall Residence, Block B');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const session = useMemo(() => (user ? buildSessionSummary(user) : null), [user]);

  const submitSignIn = useCallback(async (): Promise<boolean> => {
    setIsSubmitting(true);
    setFormError(null);
    setResetMessage(null);
    try {
      await signInStudentWithFirebase({ universityEmail, password });
      setPassword('');
      setIsSubmitting(false);
      return true;
    } catch (err: unknown) {
      setFormError(getUserErrorMessage(err));
      setIsSubmitting(false);
      return false;
    }
  }, [password, universityEmail]);

  const submitRegister = useCallback(async (): Promise<boolean> => {
    setIsSubmitting(true);
    setFormError(null);
    setResetMessage(null);
    try {
      await registerStudentWithFirebase({
        universityEmail,
        password,
        fullName,
        residenceHall,
      });
      setPassword('');
      setIsSubmitting(false);
      return true;
    } catch (err: unknown) {
      setFormError(getUserErrorMessage(err));
      setIsSubmitting(false);
      return false;
    }
  }, [fullName, password, residenceHall, universityEmail]);

  const submitPasswordReset = useCallback(async () => {
    setIsSubmitting(true);
    setFormError(null);
    setResetMessage(null);
    try {
      await sendStudentPasswordReset(universityEmail);
      setResetMessage('Password reset instructions sent to your university inbox.');
    } catch (err: unknown) {
      setFormError(getUserErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }, [universityEmail]);

  const signOutStudent = useCallback(async () => {
    setIsSubmitting(true);
    setFormError(null);
    try {
      await signOutStudentFromFirebase();
    } catch (err: unknown) {
      setFormError(getUserErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }, []);

  return {
    authLoading,
    session,
    isSubmitting,
    formError,
    setFormError,
    resetMessage,
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
    submitPasswordReset,
    signOutStudent,
  };
}
