import { useCallback, useState } from 'react';
import { normalizeError, type AppError } from '@/shared/errors';

export type AsyncStatus = 'loading' | 'empty' | 'success' | 'error';

export interface AsyncState<T> {
  readonly status: AsyncStatus;
  readonly data: T | null;
  readonly error: AppError | null;
}

export interface UseAsyncStateReturn<T> {
  readonly state: AsyncState<T>;
  readonly setLoading: () => void;
  readonly setEmpty: () => void;
  readonly setSuccess: (data: T) => void;
  readonly setError: (error: unknown) => void;
}

export function useAsyncState<T>(
  initialData: T | null = null,
  initialStatus: AsyncStatus = 'success',
): UseAsyncStateReturn<T> {
  const [state, setState] = useState<AsyncState<T>>({
    status: initialStatus,
    data: initialData,
    error: null,
  });

  const setLoading = useCallback(() => {
    setState((prev) => ({
      status: 'loading',
      data: prev.data,
      error: null,
    }));
  }, []);

  const setEmpty = useCallback(() => {
    setState({
      status: 'empty',
      data: null,
      error: null,
    });
  }, []);

  const setSuccess = useCallback((data: T) => {
    setState({
      status: 'success',
      data,
      error: null,
    });
  }, []);

  const setError = useCallback((rawError: unknown) => {
    setState({
      status: 'error',
      data: null,
      error: normalizeError(rawError),
    });
  }, []);

  return {
    state,
    setLoading,
    setEmpty,
    setSuccess,
    setError,
  };
}
