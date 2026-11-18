import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { reservePickupOrder } from '@/features/orders/api/orders.api';
import { getUserErrorMessage, logDiagnosticError } from '@/shared/errors';
import { useAsyncState } from '@/shared/hooks/useAsyncState';
import { useAuth } from '@/shared/hooks/useAuth';
import { useSavedItems } from '@/shared/hooks/useSavedItems';
import { fetchMarketplaceProducts } from '../api/marketplace.api';
import type { MarketplaceProduct } from '../api/marketplace.types';

export interface MarketplaceItemData {
  readonly product: MarketplaceProduct;
  readonly related: readonly MarketplaceProduct[];
}

/**
 * Loads a single marketplace listing by ID along with related items and
 * coordinates saved-bag and campus-pickup purchase actions.
 */
export function useMarketplaceItem(itemId: string | undefined) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { entries, isSaved, toggleItem, removeItem } = useSavedItems();
  const { state, setLoading, setEmpty, setSuccess, setError } = useAsyncState<MarketplaceItemData>(
    null,
    'loading',
  );

  const [isReserving, setIsReserving] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);
  const [bagNotice, setBagNotice] = useState<string | null>(null);
  const noticeTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (noticeTimerRef.current !== null) {
        window.clearTimeout(noticeTimerRef.current);
      }
    };
  }, []);

  const fetchAndPopulate = useCallback(
    async (id: string | undefined) => {
      if (!id) {
        setEmpty();
        return;
      }
      const normalizedId = id === 'kestrel-vapor-pace-3' ? 'volt-runners' : id;
      const all = await fetchMarketplaceProducts();
      const found = all.find((p) => p.id === normalizedId);
      if (!found) {
        setEmpty();
        return;
      }
      const related = all
        .filter((p) => p.id !== found.id && p.category === found.category)
        .slice(0, 4);
      setSuccess({ product: found, related });
    },
    [setEmpty, setSuccess],
  );

  const loadItem = useCallback(async () => {
    setLoading();
    setActionError(null);
    try {
      await fetchAndPopulate(itemId);
    } catch (err: unknown) {
      setError(err);
    }
  }, [fetchAndPopulate, itemId, setError, setLoading]);

  useEffect(() => {
    let active = true;
    void Promise.resolve()
      .then(() => fetchAndPopulate(itemId))
      .catch((err: unknown) => {
        if (active) {
          setError(err);
        }
      });
    return () => {
      active = false;
    };
  }, [fetchAndPopulate, itemId, setError]);

  const product = state.data?.product ?? null;
  const related = useMemo(() => state.data?.related ?? [], [state.data]);
  const saved = product ? isSaved(product.id) : false;

  const handleToggleBag = useCallback(async () => {
    if (!product) {
      return;
    }
    setActionError(null);
    try {
      const nowSaved = await toggleItem({
        listingId: product.id,
        title: product.name,
        price: product.price,
        campusLocation: product.campusHall,
        ...(product.sellerId ? { sellerId: product.sellerId } : {}),
        sellerName: product.sellerName,
        inStock: product.inStock,
      });
      setBagNotice(nowSaved ? 'Saved to your bag' : 'Removed from your bag');
      if (noticeTimerRef.current !== null) {
        window.clearTimeout(noticeTimerRef.current);
      }
      noticeTimerRef.current = window.setTimeout(() => setBagNotice(null), 2600);
    } catch (err: unknown) {
      logDiagnosticError(err, 'useMarketplaceItem:toggleBag');
      setActionError(getUserErrorMessage(err));
    }
  }, [product, toggleItem]);

  const handleBuyNow = useCallback(async () => {
    if (!product || !product.inStock || isReserving) {
      return;
    }
    if (!user) {
      void navigate(`/auth?redirect=${encodeURIComponent(`/item/${product.id}`)}`);
      return;
    }

    setActionError(null);
    setIsReserving(true);
    try {
      await reservePickupOrder({
        buyerId: user.uid,
        ...(product.sellerId ? { sellerId: product.sellerId } : {}),
        itemTitle: product.name,
        totalAmount: product.price,
        sellerName: product.sellerName,
        meetupSpot: product.campusHall,
      });

      const savedEntry = entries.find((entry) => entry.listingId === product.id);
      if (savedEntry) {
        await removeItem(savedEntry.id, savedEntry.listingId);
      }

      setIsReserving(false);
      void navigate('/orders');
    } catch (err: unknown) {
      logDiagnosticError(err, 'useMarketplaceItem:buyNow');
      setActionError(getUserErrorMessage(err));
      setIsReserving(false);
    }
  }, [entries, isReserving, navigate, product, removeItem, user]);

  return {
    user,
    status: state.status,
    error: state.error,
    product,
    related,
    saved,
    isReserving,
    actionError,
    clearActionError: () => setActionError(null),
    bagNotice,
    handleToggleBag,
    handleBuyNow,
    reload: loadItem,
  };
}
