import { createContext } from 'react';
import type { WishlistEntry } from '@/features/wishlist/api/wishlist.types';
import type { AppError } from '@/shared/errors';
import type { AsyncStatus } from '@/shared/hooks/useAsyncState';

export interface SaveWishlistInput {
  readonly listingId: string;
  readonly title: string;
  readonly price: number;
  readonly campusLocation: string;
  readonly sellerId?: string;
  readonly sellerName?: string;
  readonly inStock: boolean;
}

export interface WishlistContextValue {
  readonly status: AsyncStatus;
  readonly entries: readonly WishlistEntry[];
  readonly error: AppError | null;
  readonly isSaved: (listingId: string) => boolean;
  readonly saveItem: (input: SaveWishlistInput) => Promise<void>;
  readonly removeItem: (id: string, listingId: string) => Promise<void>;
  readonly toggleItem: (input: SaveWishlistInput) => Promise<boolean>;
  readonly reload: () => Promise<void>;
}

export const WishlistContext = createContext<WishlistContextValue | null>(null);
