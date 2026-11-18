import { useCallback, useMemo, useState } from 'react';
import { getUserErrorMessage } from '@/shared/errors';
import { useAuth } from '@/shared/hooks/useAuth';
import {
  buildSessionSummary,
  registerStudentWithFirebase,
  sendStudentPasswordReset,
  signInStudentWithFirebase,
} from '../api/auth.api';

export function useStudentAuth() {
  const { user, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');

  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [resetMessage, setResetMessage] = useState<string | null>(null);

  const session = useMemo(() => (user ? buildSessionSummary(user) : null), [user]);

  const submitSignIn = useCallback(async (): Promise<boolean> => {
    setIsSubmitting(true);
    setFormError(null);
    setResetMessage(null);
    try {
      await signInStudentWithFirebase({ email, password });
      setPassword('');
      setIsSubmitting(false);
      return true;
    } catch (err: unknown) {
      setFormError(getUserErrorMessage(err));
      setIsSubmitting(false);
      return false;
    }
  }, [email, password]);

  const submitRegister = useCallback(async (): Promise<boolean> => {
    setIsSubmitting(true);
    setFormError(null);
    setResetMessage(null);
    try {
      await registerStudentWithFirebase({
        email,
        password,
        fullName,
      });
      setPassword('');
      setIsSubmitting(false);
      return true;
    } catch (err: unknown) {
      setFormError(getUserErrorMessage(err));
      setIsSubmitting(false);
      return false;
    }
  }, [email, fullName, password]);

  const submitPasswordReset = useCallback(async () => {
    setIsSubmitting(true);
    setFormError(null);
    setResetMessage(null);
    try {
      await sendStudentPasswordReset(email);
      setResetMessage('Password reset instructions sent to your email inbox.');
    } catch (err: unknown) {
      setFormError(getUserErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }, [email]);

  return {
    authLoading,
    session,
    isSubmitting,
    formError,
    setFormError,
    resetMessage,
    email,
    setEmail,
    password,
    setPassword,
    fullName,
    setFullName,
    submitSignIn,
    submitRegister,
    submitPasswordReset,
  };
}
