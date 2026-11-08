import { useCallback, useEffect, useState } from 'react';
import { getUserErrorMessage, logDiagnosticError } from '@/shared/errors';
import { useAsyncState, type AsyncStatus } from '@/shared/hooks/useAsyncState';
import { fetchConversationThreads, sendThreadMessage } from '../api/messages.api';
import type { ConversationThread } from '../api/messages.types';

export function useMessages() {
  const { state, setLoading, setEmpty, setSuccess, setError } = useAsyncState<ConversationThread[]>(
    [],
    'loading',
  );
  const [actionError, setActionError] = useState<string | null>(null);

  const loadThreads = useCallback(async () => {
    setLoading();
    try {
      const threads = await fetchConversationThreads();
      if (threads.length === 0) {
        setEmpty();
      } else {
        setSuccess(threads);
      }
    } catch (err: unknown) {
      setError(err);
    }
  }, [setEmpty, setError, setLoading, setSuccess]);

  useEffect(() => {
    void loadThreads();
  }, [loadThreads]);

  const sendMessage = useCallback(
    async (thread: ConversationThread, text: string) => {
      setActionError(null);
      try {
        const updated = await sendThreadMessage(thread, text);
        const nextList = (state.data ?? []).map((item) =>
          item.id === updated.id ? updated : item,
        );
        setSuccess(nextList);
      } catch (err: unknown) {
        logDiagnosticError(err, 'useMessages.sendMessage');
        setActionError(getUserErrorMessage(err));
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
        setError(new Error('Simulated messaging error'));
      } else {
        void loadThreads();
      }
    },
    [loadThreads, setEmpty, setError, setLoading],
  );

  return {
    status: state.status,
    threads: state.data ?? [],
    error: state.error,
    actionError,
    sendMessage,
    reload: loadThreads,
    simulateStatus,
  };
}
