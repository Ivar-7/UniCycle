import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getUserErrorMessage, logDiagnosticError } from '@/shared/errors';
import { useAsyncState } from '@/shared/hooks/useAsyncState';
import { useAuth } from '@/shared/hooks/useAuth';
import {
  fetchConversationThreads,
  sendThreadMessage,
  startConversationThread,
} from '../api/messages.api';
import type { ConversationThread } from '../api/messages.types';

export function useMessages() {
  const { user, isLoading: authLoading } = useAuth();
  const userId = user?.uid ?? null;
  const [searchParams, setSearchParams] = useSearchParams();
  const { state, setLoading, setEmpty, setSuccess, setError } = useAsyncState<ConversationThread[]>(
    [],
    'loading',
  );
  const [actionError, setActionError] = useState<string | null>(null);
  const [activeThreadId, setActiveThreadId] = useState<string | null>(null);

  const fetchAndSync = useCallback(
    async (uid: string | null) => {
      if (!uid) {
        setEmpty();
        return;
      }
      let threads = await fetchConversationThreads(uid);
      const itemParam = searchParams.get('item');
      const sellerParam = searchParams.get('seller');
      const sellerIdParam = searchParams.get('sellerId') ?? undefined;
      if (itemParam && sellerParam) {
        const existing = threads.find(
          (t) => t.itemTitle === itemParam && t.peerStudentName === sellerParam,
        );
        if (existing) {
          setActiveThreadId(existing.id);
        } else {
          const created = await startConversationThread(
            uid,
            sellerParam,
            itemParam,
            undefined,
            sellerIdParam,
          );
          threads = [created, ...threads];
          setActiveThreadId(created.id);
        }
        setSearchParams({}, { replace: true });
      }

      if (threads.length === 0) {
        setEmpty();
      } else {
        setSuccess(threads);
      }
    },
    [searchParams, setEmpty, setSearchParams, setSuccess],
  );

  const loadThreads = useCallback(async () => {
    setLoading();
    try {
      await fetchAndSync(userId);
    } catch (err: unknown) {
      setError(err);
    }
  }, [fetchAndSync, setError, setLoading, userId]);

  useEffect(() => {
    if (authLoading) {
      return;
    }
    let active = true;
    void Promise.resolve()
      .then(() => fetchAndSync(userId))
      .catch((err: unknown) => {
        if (active) {
          setError(err);
        }
      });
    return () => {
      active = false;
    };
  }, [authLoading, fetchAndSync, setError, userId]);

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

  return {
    user,
    authLoading,
    status: state.status,
    threads: state.data ?? [],
    activeThreadId,
    setActiveThreadId,
    error: state.error,
    actionError,
    sendMessage,
    reload: loadThreads,
  };
}
