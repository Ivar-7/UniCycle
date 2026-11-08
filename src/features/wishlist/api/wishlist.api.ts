import {
  fetchCollectionWithSeed,
  removeCollectionDocument,
  upsertCollectionDocument,
} from '@/shared/firebase';
import { wishlistEntryListSchema, wishlistEntrySchema } from './wishlist.schema';
import type { WishlistEntry } from './wishlist.types';

export const SEED_WISHLIST_ENTRIES: readonly WishlistEntry[] = [
  {
    id: 'wish-ergo-chair-01',
    listingId: 'ergo-mesh-chair',
    title: 'Aero Ergonomic Mesh Study Chair',
    price: 145,
    campusLocation: 'Central Campus Union',
    inStock: true,
    savedAt: '2026-11-07T11:00:00.000Z',
  },
  {
    id: 'wish-nordic-lamp-02',
    listingId: 'nordic-desk-lamp',
    title: 'Nordic Architect Desk Lamp',
    price: 48,
    campusLocation: 'North Hall Block B',
    inStock: true,
    savedAt: '2026-11-06T20:10:00.000Z',
  },
  {
    id: 'wish-kestrel-03',
    listingId: 'kestrel-vapor-pace-3',
    title: 'Kestrel Vapor Pace 3 (CLOUD · 36)',
    price: 240,
    campusLocation: 'Eastgate Courts · Block A',
    inStock: true,
    savedAt: '2026-11-08T08:15:00.000Z',
  },
];

export async function fetchWishlistEntries(): Promise<WishlistEntry[]> {
  return fetchCollectionWithSeed(
    'wishlists',
    wishlistEntrySchema,
    wishlistEntryListSchema,
    SEED_WISHLIST_ENTRIES,
  );
}

export async function addWishlistEntry(entry: WishlistEntry): Promise<WishlistEntry> {
  return upsertCollectionDocument(
    'wishlists',
    entry,
    wishlistEntrySchema,
    wishlistEntryListSchema,
    SEED_WISHLIST_ENTRIES,
  );
}

export async function removeWishlistEntry(id: string): Promise<void> {
  return removeCollectionDocument('wishlists', id, wishlistEntryListSchema, SEED_WISHLIST_ENTRIES);
}
