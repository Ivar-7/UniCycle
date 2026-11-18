import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  addWishlistEntry,
  fetchWishlistEntries,
  removeWishlistEntry,
} from '@/features/wishlist/api/wishlist.api';
import type { WishlistEntry } from '@/features/wishlist/api/wishlist.types';
import { logDiagnosticError, normalizeError, type AppError } from '@/shared/errors';
import type { AsyncStatus } from '@/shared/hooks/useAsyncState';
import { useAuth } from '@/shared/hooks/useAuth';
import { WishlistContext, type SaveWishlistInput } from './WishlistContext';

export interface WishlistProviderProps {
  readonly children: ReactNode;
}

export function WishlistProvider({ children }: WishlistProviderProps) {
  const { user, isLoading: authLoading } = useAuth();
  const userId = user?.uid ?? null;
  const [status, setStatus] = useState<AsyncStatus>('loading');
  const [entries, setEntries] = useState<WishlistEntry[]>([]);
  const [error, setError] = useState<AppError | null>(null);

  const reload = useCallback(async () => {
    setStatus('loading');
    setError(null);
    try {
      const list = await fetchWishlistEntries(userId);
      setEntries(list);
      setStatus(list.length === 0 ? 'empty' : 'success');
    } catch (err: unknown) {
      logDiagnosticError(err, 'WishlistProvider:reload');
      setError(normalizeError(err));
      setStatus('error');
    }
  }, [userId]);

  useEffect(() => {
    if (authLoading) {
      return;
    }
    let active = true;
    void fetchWishlistEntries(userId)
      .then((list) => {
        if (!active) {
          return;
        }
        setEntries(list);
        setError(null);
        setStatus(list.length === 0 ? 'empty' : 'success');
      })
      .catch((err: unknown) => {
        if (!active) {
          return;
        }
        logDiagnosticError(err, 'WishlistProvider:init');
        setError(normalizeError(err));
        setStatus('error');
      });
    return () => {
      active = false;
    };
  }, [authLoading, userId]);

  const savedIds = useMemo(() => new Set(entries.map((entry) => entry.listingId)), [entries]);

  const isSaved = useCallback((listingId: string) => savedIds.has(listingId), [savedIds]);

  const saveItem = useCallback(
    async (input: SaveWishlistInput) => {
      const saved = await addWishlistEntry(
        {
          listingId: input.listingId,
          title: input.title,
          price: input.price,
          campusLocation: input.campusLocation,
          ...(input.sellerId ? { sellerId: input.sellerId } : {}),
          ...(input.sellerName ? { sellerName: input.sellerName } : {}),
          inStock: input.inStock,
          savedAt: new Date().toISOString(),
        },
        userId,
      );
      setEntries((prev) => [saved, ...prev.filter((item) => item.listingId !== saved.listingId)]);
      setStatus('success');
    },
    [userId],
  );

  const removeItem = useCallback(
    async (id: string, listingId: string) => {
      await removeWishlistEntry(id, listingId, userId);
      setEntries((prev) => {
        const next = prev.filter((item) => item.id !== id && item.listingId !== listingId);
        setStatus(next.length === 0 ? 'empty' : 'success');
        return next;
      });
    },
    [userId],
  );

  const toggleItem = useCallback(
    async (input: SaveWishlistInput): Promise<boolean> => {
      const existing = entries.find((item) => item.listingId === input.listingId);
      if (existing) {
        await removeItem(existing.id, existing.listingId);
        return false;
      }
      await saveItem(input);
      return true;
    },
    [entries, removeItem, saveItem],
  );

  const value = useMemo(
    () => ({
      status,
      entries,
      error,
      isSaved,
      saveItem,
      removeItem,
      toggleItem,
      reload,
    }),
    [entries, error, isSaved, reload, removeItem, saveItem, status, toggleItem],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
}
