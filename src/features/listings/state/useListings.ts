import { useCallback, useEffect, useState } from 'react';
import { getUserErrorMessage, logDiagnosticError } from '@/shared/errors';
import { useAsyncState } from '@/shared/hooks/useAsyncState';
import { useAuth } from '@/shared/hooks/useAuth';
import { resolveDisplayName } from '@/shared/utils/user';
import {
  createSellerListing,
  deleteSellerListing,
  fetchSellerListings,
  updateSellerListingStatus,
} from '../api/listings.api';
import type { CreateListingInput, ListingStatus, SellerListing } from '../api/listings.types';

export function useListings() {
  const { user, isLoading: authLoading } = useAuth();
  const { state, setLoading, setEmpty, setSuccess, setError } = useAsyncState<SellerListing[]>(
    [],
    'loading',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadListings = useCallback(async () => {
    if (!user) {
      setEmpty();
      return;
    }
    setLoading();
    try {
      const data = await fetchSellerListings(user.uid);
      if (data.length === 0) {
        setEmpty();
      } else {
        setSuccess(data);
      }
    } catch (err: unknown) {
      logDiagnosticError(err, 'useListings:loadListings');
      setError(err);
    }
  }, [setEmpty, setError, setLoading, setSuccess, user]);

  useEffect(() => {
    if (!authLoading) {
      void loadListings();
    }
  }, [authLoading, loadListings]);

  const handleCreate = useCallback(
    async (input: CreateListingInput): Promise<boolean> => {
      if (!user) {
        setActionError('Please sign in with your university account to publish a listing.');
        return false;
      }
      setIsSubmitting(true);
      setActionError(null);
      try {
        const sellerName = resolveDisplayName(user, 'Student Seller');
        const created = await createSellerListing(input, user.uid, sellerName);
        const current = state.data ?? [];
        setSuccess([created, ...current]);
        setIsSubmitting(false);
        return true;
      } catch (err: unknown) {
        logDiagnosticError(err, 'useListings:handleCreate');
        setActionError(getUserErrorMessage(err));
        setIsSubmitting(false);
        return false;
      }
    },
    [setSuccess, state.data, user],
  );

  const handleToggleStatus = useCallback(
    async (listing: SellerListing) => {
      if (!user) {
        return;
      }
      setActionError(null);
      const nextStatus: ListingStatus =
        listing.status === 'active'
          ? 'reserved'
          : listing.status === 'reserved'
            ? 'sold'
            : 'active';
      try {
        const sellerName = resolveDisplayName(user, 'Student Seller');
        const updated = await updateSellerListingStatus(listing, nextStatus, sellerName);
        const current = state.data ?? [];
        setSuccess(current.map((item) => (item.id === updated.id ? updated : item)));
      } catch (err: unknown) {
        logDiagnosticError(err, 'useListings:handleToggleStatus');
        setActionError(getUserErrorMessage(err));
      }
    },
    [setSuccess, state.data, user],
  );

  const handleDelete = useCallback(
    async (id: string) => {
      if (!user) {
        return;
      }
      setActionError(null);
      try {
        await deleteSellerListing(id);
        const remaining = (state.data ?? []).filter((item) => item.id !== id);
        if (remaining.length === 0) {
          setEmpty();
        } else {
          setSuccess(remaining);
        }
      } catch (err: unknown) {
        logDiagnosticError(err, 'useListings:handleDelete');
        setActionError(getUserErrorMessage(err));
      }
    },
    [setEmpty, setSuccess, state.data, user],
  );

  return {
    user,
    authLoading,
    status: state.status,
    listings: state.data ?? [],
    error: state.error,
    isSubmitting,
    actionError,
    setActionError,
    handleCreate,
    handleToggleStatus,
    handleDelete,
    reload: loadListings,
  };
}
