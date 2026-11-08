import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { createStudentOrder } from '@/features/orders/api/orders.api';
import { addWishlistEntry, removeWishlistEntry } from '@/features/wishlist/api/wishlist.api';
import { logDiagnosticError } from '@/shared/errors';
import { useAsyncState } from '@/shared/hooks/useAsyncState';
import { fetchShowcaseProducts } from '../api/showcase.api';
import type { ShowcaseProduct, ShowcaseSizeOption, ShowcaseVariant } from '../api/showcase.types';

function isSizeSoldOut(size: ShowcaseSizeOption, variant: ShowcaseVariant): boolean {
  return Boolean(size.soldOut) || size.stock <= 0 || variant.soldOutSizes.includes(size.label);
}

export function useShowcase() {
  const [searchParams, setSearchParams] = useSearchParams();
  const requestedItemId = searchParams.get('item');

  const { state, setLoading, setEmpty, setSuccess, setError } = useAsyncState<ShowcaseProduct[]>(
    [],
    'loading',
  );

  const [selectedProductId, setSelectedProductId] = useState<string>(
    requestedItemId ?? 'kestrel-vapor-pace-3',
  );
  const [activeVariantIndex, setActiveVariantIndex] = useState<number>(1);
  const [selectedSizeLabel, setSelectedSizeLabel] = useState<string>('36');
  const [cartState, setCartState] = useState<'idle' | 'busy' | 'done'>('idle');
  const [toastNote, setToastNote] = useState<string | null>(null);
  const [liked, setLiked] = useState<boolean>(false);
  const [likePillText, setLikePillText] = useState<string | null>(null);
  const [viewerIndex, setViewerIndex] = useState<number | null>(null);
  const [viewerZoomed, setViewerZoomed] = useState<boolean>(false);
  const [holdingZoom, setHoldingZoom] = useState<boolean>(false);

  const timersRef = useRef<number[]>([]);

  const clearTimers = useCallback(() => {
    for (const timer of timersRef.current) {
      window.clearTimeout(timer);
    }
    timersRef.current = [];
  }, []);

  useEffect(() => {
    return () => {
      clearTimers();
    };
  }, [clearTimers]);

  const loadShowcase = useCallback(async () => {
    setLoading();
    try {
      const items = await fetchShowcaseProducts();
      if (items.length === 0) {
        setEmpty();
      } else {
        setSuccess(items);
      }
    } catch (err: unknown) {
      setError(err);
    }
  }, [setEmpty, setError, setLoading, setSuccess]);

  useEffect(() => {
    void loadShowcase();
  }, [loadShowcase]);

  const effectiveProductId = requestedItemId ?? selectedProductId;

  const products = useMemo(() => state.data ?? [], [state.data]);

  const activeProduct = useMemo<ShowcaseProduct | null>(() => {
    if (products.length === 0) {
      return null;
    }
    return products.find((p) => p.id === effectiveProductId) ?? products[0] ?? null;
  }, [products, effectiveProductId]);

  const selectProduct = useCallback(
    (productId: string) => {
      setSelectedProductId(productId);
      setSearchParams({ item: productId }, { replace: true });
      const target = products.find((p) => p.id === productId);
      if (target) {
        const defIdx = target.defaultVariantIndex;
        const variant = target.variants[defIdx] ?? target.variants[0]!;
        setActiveVariantIndex(defIdx);
        const firstAvailable =
          target.sizes.find((s) => !isSizeSoldOut(s, variant))?.label ??
          target.sizes[0]?.label ??
          '';
        setSelectedSizeLabel(firstAvailable);
      }
    },
    [products, setSearchParams],
  );

  const activeVariant = useMemo<ShowcaseVariant | null>(() => {
    if (!activeProduct) {
      return null;
    }
    return activeProduct.variants[activeVariantIndex] ?? activeProduct.variants[0] ?? null;
  }, [activeProduct, activeVariantIndex]);

  const selectVariant = useCallback(
    (index: number) => {
      if (!activeProduct) {
        return;
      }
      const nextVariant = activeProduct.variants[index];
      if (!nextVariant) {
        return;
      }
      setActiveVariantIndex(index);
      const currentSizeObj = activeProduct.sizes.find((s) => s.label === selectedSizeLabel);
      if (!currentSizeObj || isSizeSoldOut(currentSizeObj, nextVariant)) {
        const fallback =
          activeProduct.sizes.find((s) => !isSizeSoldOut(s, nextVariant))?.label ??
          activeProduct.sizes[0]?.label ??
          '';
        setSelectedSizeLabel(fallback);
      }
    },
    [activeProduct, selectedSizeLabel],
  );

  const activeSizeOption = useMemo<ShowcaseSizeOption | null>(() => {
    if (!activeProduct) {
      return null;
    }
    return (
      activeProduct.sizes.find((s) => s.label === selectedSizeLabel) ??
      activeProduct.sizes[0] ??
      null
    );
  }, [activeProduct, selectedSizeLabel]);

  const checkSizeSoldOut = useCallback(
    (size: ShowcaseSizeOption): boolean => {
      if (!activeVariant) {
        return false;
      }
      return isSizeSoldOut(size, activeVariant);
    },
    [activeVariant],
  );

  const handleAddToCart = useCallback(() => {
    if (cartState !== 'idle' || !activeProduct || !activeVariant || !activeSizeOption) {
      return;
    }
    if (isSizeSoldOut(activeSizeOption, activeVariant)) {
      return;
    }
    clearTimers();
    setCartState('busy');

    const entryTitle = `${activeProduct.title} (${activeVariant.name} · ${activeSizeOption.label})`;
    void addWishlistEntry({
      id: `wish-${activeProduct.id}-${activeVariant.id}-${activeSizeOption.label}`,
      listingId: activeProduct.id,
      title: entryTitle,
      price: activeSizeOption.price,
      campusLocation: activeProduct.campusHall,
      inStock: true,
      savedAt: new Date().toISOString(),
    }).catch((err: unknown) => {
      logDiagnosticError(err, 'useShowcase:addWishlistEntry');
    });

    void createStudentOrder({
      id: `ord-${Date.now().toString().slice(-4)}`,
      itemTitle: entryTitle,
      totalAmount: activeSizeOption.price,
      sellerName: activeProduct.sellerName,
      meetupSpot: activeProduct.campusHall,
      status: 'scheduled-pickup',
      pickupCode: `UC-${Math.floor(1000 + Math.random() * 9000)}`,
      orderedAt: new Date().toISOString(),
    }).catch((err: unknown) => {
      logDiagnosticError(err, 'useShowcase:createStudentOrder');
    });

    const t1 = window.setTimeout(() => {
      setCartState('done');
      setToastNote(`${activeVariant.name} · size ${activeSizeOption.label}`);
    }, 550);
    const t2 = window.setTimeout(() => {
      setCartState('idle');
    }, 2000);
    const t3 = window.setTimeout(() => {
      setToastNote(null);
    }, 3800);
    timersRef.current.push(t1, t2, t3);
  }, [activeProduct, activeSizeOption, activeVariant, cartState, clearTimers]);

  const handleToggleLike = useCallback(() => {
    setLiked((prev) => {
      const next = !prev;
      setLikePillText(next ? 'Saved to favourites' : 'Removed from favourites');
      if (activeProduct && activeVariant && activeSizeOption) {
        const wishId = `wish-${activeProduct.id}`;
        if (next) {
          void addWishlistEntry({
            id: wishId,
            listingId: activeProduct.id,
            title: `${activeProduct.title} (${activeVariant.name})`,
            price: activeSizeOption.price,
            campusLocation: activeProduct.campusHall,
            inStock: true,
            savedAt: new Date().toISOString(),
          }).catch((err: unknown) => {
            logDiagnosticError(err, 'useShowcase:like');
          });
        } else {
          void removeWishlistEntry(wishId).catch((err: unknown) => {
            logDiagnosticError(err, 'useShowcase:unlike');
          });
        }
      }
      const timer = window.setTimeout(() => {
        setLikePillText(null);
      }, 2000);
      timersRef.current.push(timer);
      return next;
    });
  }, [activeProduct, activeSizeOption, activeVariant]);

  const stepViewer = useCallback(
    (delta: number) => {
      if (!activeProduct) {
        return;
      }
      const total = activeProduct.angles.length;
      setViewerZoomed(false);
      setViewerIndex((curr) => (curr === null ? null : (curr + delta + total) % total));
    },
    [activeProduct],
  );

  return {
    status: state.status,
    error: state.error,
    products,
    activeProduct,
    activeVariant,
    activeVariantIndex,
    activeSizeOption,
    selectedSizeLabel,
    setSelectedSizeLabel,
    selectProduct,
    selectVariant,
    checkSizeSoldOut,
    cartState,
    toastNote,
    liked,
    likePillText,
    handleAddToCart,
    handleToggleLike,
    viewerIndex,
    setViewerIndex,
    viewerZoomed,
    setViewerZoomed,
    stepViewer,
    holdingZoom,
    setHoldingZoom,
    reload: loadShowcase,
  };
}
