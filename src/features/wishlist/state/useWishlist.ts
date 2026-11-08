import { useCallback, useEffect, useState } from 'react';
import { createStudentOrder } from '@/features/orders/api/orders.api';
import { useAsyncState, type AsyncStatus } from '@/shared/hooks/useAsyncState';
import { addWishlistEntry, fetchWishlistEntries, removeWishlistEntry } from '../api/wishlist.api';
import type { WishlistEntry } from '../api/wishlist.types';

export function useWishlist() {
  const { state, setLoading, setEmpty, setSuccess, setError } = useAsyncState<WishlistEntry[]>(
    [],
    'loading',
  );
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  const loadWishlist = useCallback(async () => {
    setLoading();
    try {
      const entries = await fetchWishlistEntries();
      if (entries.length === 0) {
        setEmpty();
      } else {
        setSuccess(entries);
      }
    } catch (err: unknown) {
      setError(err);
    }
  }, [setEmpty, setError, setLoading, setSuccess]);

  useEffect(() => {
    void loadWishlist();
  }, [loadWishlist]);

  const handleRemoveEntry = useCallback(
    async (id: string) => {
      try {
        await removeWishlistEntry(id);
        const remaining = (state.data ?? []).filter((e) => e.id !== id);
        if (remaining.length === 0) {
          setEmpty();
        } else {
          setSuccess(remaining);
        }
      } catch (err: unknown) {
        setError(err);
      }
    },
    [setEmpty, setError, setSuccess, state.data],
  );

  const handleAddEntry = useCallback(
    async (entry: WishlistEntry) => {
      try {
        const saved = await addWishlistEntry(entry);
        const current = state.data ?? [];
        setSuccess([saved, ...current.filter((e) => e.id !== saved.id)]);
      } catch (err: unknown) {
        setError(err);
      }
    },
    [setError, setSuccess, state.data],
  );

  const handleCheckoutAll = useCallback(async (): Promise<boolean> => {
    const items = state.data ?? [];
    if (items.length === 0) {
      return false;
    }
    setIsCheckingOut(true);
    try {
      for (const item of items) {
        await createStudentOrder({
          id: `ord-${Date.now().toString().slice(-4)}-${item.id.slice(-2)}`,
          itemTitle: item.title,
          totalAmount: item.price,
          sellerName: 'Verified Campus Seller',
          meetupSpot: item.campusLocation,
          status: 'scheduled-pickup',
          pickupCode: `UC-${Math.floor(1000 + Math.random() * 9000)}`,
          orderedAt: new Date().toISOString(),
        });
        await removeWishlistEntry(item.id);
      }
      setEmpty();
      setIsCheckingOut(false);
      return true;
    } catch (err: unknown) {
      setIsCheckingOut(false);
      setError(err);
      return false;
    }
  }, [setEmpty, setError, state.data]);

  const simulateStatus = useCallback(
    (status: AsyncStatus) => {
      if (status === 'loading') {
        setLoading();
      } else if (status === 'empty') {
        setEmpty();
      } else if (status === 'error') {
        setError(new Error('Simulated wishlist error'));
      } else {
        void loadWishlist();
      }
    },
    [loadWishlist, setEmpty, setError, setLoading],
  );

  return {
    status: state.status,
    entries: state.data ?? [],
    error: state.error,
    isCheckingOut,
    handleRemoveEntry,
    handleAddEntry,
    handleCheckoutAll,
    reload: loadWishlist,
    simulateStatus,
  };
}
