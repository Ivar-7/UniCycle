import { useCallback, useEffect, useState } from 'react';
import { useAsyncState } from '@/shared/hooks/useAsyncState';
import { fetchAboutOverview } from '../api/about.api';
import type { AboutOverviewData } from '../api/about.types';

export function useAbout() {
  const { state, setLoading, setSuccess, setError } = useAsyncState<AboutOverviewData | null>(
    null,
    'loading',
  );
  const [openFaqId, setOpenFaqId] = useState<string | null>('faq-1');

  const loadAbout = useCallback(async () => {
    setLoading();
    try {
      const data = await fetchAboutOverview();
      setSuccess(data);
    } catch (err: unknown) {
      setError(err);
    }
  }, [setError, setLoading, setSuccess]);

  useEffect(() => {
    void loadAbout();
  }, [loadAbout]);

  const toggleFaq = useCallback((id: string) => {
    setOpenFaqId((prev) => (prev === id ? null : id));
  }, []);

  return {
    status: state.status,
    data: state.data,
    error: state.error,
    openFaqId,
    toggleFaq,
    reload: loadAbout,
  };
}
