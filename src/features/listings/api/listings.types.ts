import type { ProductCategory } from '@/features/marketplace/api/marketplace.types';

export type ListingStatus = 'active' | 'reserved' | 'sold';

export interface SellerListing {
  readonly id: string;
  readonly title: string;
  readonly category: ProductCategory;
  readonly price: number;
  readonly status: ListingStatus;
  readonly viewsCount: number;
  readonly pickupHall: string;
  readonly imageUrl: string;
  readonly storageSource?: 'firebase-storage' | 'local-preview' | 'seed';
  readonly updatedAt: string;
}

export interface CreateListingInput {
  readonly title: string;
  readonly category: ProductCategory;
  readonly price: number;
  readonly pickupHall: string;
  readonly imageFile?: File | null;
}
