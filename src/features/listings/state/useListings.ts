import { useCallback, useEffect, useState } from 'react';
import { getUserErrorMessage, logDiagnosticError } from '@/shared/errors';
import { useAsyncState, type AsyncStatus } from '@/shared/hooks/useAsyncState';
import { useAuth } from '@/shared/hooks/useAuth';
import {
  createSellerListing,
  deleteSellerListing,
  fetchSellerListings,
  updateSellerListingStatus,
} from '../api/listings.api';
import type { CreateListingInput, ListingStatus, SellerListing } from '../api/listings.types';

export function useListings() {
  const { user } = useAuth();
  const { state, setLoading, setEmpty, setSuccess, setError } = useAsyncState<SellerListing[]>(
    [],
    'loading',
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState<string | null>(null);

  const loadListings = useCallback(async () => {
    setLoading();
    try {
      const data = await fetchSellerListings();
      if (data.length === 0) {
        setEmpty();
      } else {
        setSuccess(data);
      }
    } catch (err: unknown) {
      logDiagnosticError(err, 'useListings:loadListings');
      setError(err);
    }
  }, [setEmpty, setError, setLoading, setSuccess]);

  useEffect(() => {
    void loadListings();
  }, [loadListings]);

  const handleCreate = useCallback(
    async (input: CreateListingInput): Promise<boolean> => {
      setIsSubmitting(true);
      setActionError(null);
      try {
        const userId = user ? user.uid : 'student-demo-uid';
        const created = await createSellerListing(input, userId);
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
      setActionError(null);
      const nextStatus: ListingStatus =
        listing.status === 'active'
          ? 'reserved'
          : listing.status === 'reserved'
            ? 'sold'
            : 'active';
      try {
        const updated = await updateSellerListingStatus(listing, nextStatus);
        const current = state.data ?? [];
        setSuccess(current.map((item) => (item.id === updated.id ? updated : item)));
      } catch (err: unknown) {
        logDiagnosticError(err, 'useListings:handleToggleStatus');
        setActionError(getUserErrorMessage(err));
      }
    },
    [setSuccess, state.data],
  );

  const handleDelete = useCallback(
    async (id: string) => {
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
    [setEmpty, setSuccess, state.data],
  );

  const simulateStatus = useCallback(
    (status: AsyncStatus) => {
      if (status === 'loading') {
        setLoading();
      } else if (status === 'empty') {
        setEmpty();
      } else if (status === 'error') {
        setError(new Error('Simulated seller listings error'));
      } else {
        void loadListings();
      }
    },
    [loadListings, setEmpty, setError, setLoading],
  );

  return {
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
    simulateStatus,
  };
}
