import { useCallback, useState } from 'react';
import { reservePickupOrder } from '@/features/orders/api/orders.api';
import { getUserErrorMessage, logDiagnosticError } from '@/shared/errors';
import { useAuth } from '@/shared/hooks/useAuth';
import { useSavedItems } from '@/shared/hooks/useSavedItems';

export type CheckoutResult = 'ok' | 'auth-required' | 'error';

export function useWishlist() {
  const { user } = useAuth();
  const { status, entries, error, removeItem, reload } = useSavedItems();
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const handleRemoveEntry = useCallback(
    async (id: string, listingId: string) => {
      setActionError(null);
      try {
        await removeItem(id, listingId);
      } catch (err: unknown) {
        logDiagnosticError(err, 'useWishlist:handleRemoveEntry');
        setActionError(getUserErrorMessage(err));
      }
    },
    [removeItem],
  );

  const handleCheckoutAll = useCallback(async (): Promise<CheckoutResult> => {
    if (!user) {
      return 'auth-required';
    }
    if (entries.length === 0) {
      return 'error';
    }

    setActionError(null);
    setIsCheckingOut(true);
    try {
      for (const item of entries) {
        await reservePickupOrder({
          buyerId: user.uid,
          ...(item.sellerId ? { sellerId: item.sellerId } : {}),
          itemTitle: item.title,
          totalAmount: item.price,
          sellerName: item.sellerName ?? 'Verified Campus Seller',
          meetupSpot: item.campusLocation,
        });
        await removeItem(item.id, item.listingId);
      }
      setIsCheckingOut(false);
      return 'ok';
    } catch (err: unknown) {
      logDiagnosticError(err, 'useWishlist:handleCheckoutAll');
      setActionError(getUserErrorMessage(err));
      setIsCheckingOut(false);
      return 'error';
    }
  }, [entries, removeItem, user]);

  return {
    user,
    status,
    entries,
    error,
    actionError,
    setActionError,
    isCheckingOut,
    handleRemoveEntry,
    handleCheckoutAll,
    reload,
  };
}
