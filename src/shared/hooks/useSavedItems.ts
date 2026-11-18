import { useContext } from 'react';
import { WishlistContext, type WishlistContextValue } from '@/app/providers/WishlistContext';

export function useSavedItems(): WishlistContextValue {
  const ctx = useContext(WishlistContext);
  if (!ctx) {
    throw new Error('useSavedItems must be used within WishlistProvider');
  }
  return ctx;
}
