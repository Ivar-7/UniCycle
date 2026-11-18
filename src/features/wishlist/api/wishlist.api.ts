import { logDiagnosticError } from '@/shared/errors';
import { deleteUserDocument, fetchUserCollection, upsertUserDocument } from '@/shared/firebase';
import { readJsonStorage, writeJsonStorage } from '@/shared/utils/storage';
import { wishlistEntryListSchema, wishlistEntrySchema } from './wishlist.schema';
import type { WishlistEntry } from './wishlist.types';

const GUEST_WISHLIST_KEY = 'unicycle.guest.wishlist.v1';

function readGuestWishlist(): WishlistEntry[] {
  return readJsonStorage(GUEST_WISHLIST_KEY, wishlistEntryListSchema) ?? [];
}

function writeGuestWishlist(entries: readonly WishlistEntry[]): void {
  writeJsonStorage(GUEST_WISHLIST_KEY, entries);
}

export async function fetchWishlistEntries(userId: string | null): Promise<WishlistEntry[]> {
  if (!userId) {
    return readGuestWishlist();
  }

  // Merge any items saved as guest into the signed-in user's account
  const guestEntries = readGuestWishlist();
  if (guestEntries.length > 0) {
    for (const entry of guestEntries) {
      const migrated: WishlistEntry = {
        ...entry,
        id: `${userId}_${entry.listingId}`,
        userId,
      };
      try {
        await upsertUserDocument('wishlists', migrated.id, migrated, wishlistEntrySchema);
      } catch (err: unknown) {
        logDiagnosticError(err, 'migrateGuestWishlist');
      }
    }
    writeGuestWishlist([]);
  }

  return fetchUserCollection('wishlists', wishlistEntrySchema, {
    filterField: 'userId',
    filterOp: '==',
    userId,
    orderByField: 'savedAt',
  });
}

export async function addWishlistEntry(
  entry: Omit<WishlistEntry, 'id' | 'userId'>,
  userId: string | null,
): Promise<WishlistEntry> {
  if (!userId) {
    const guestItem: WishlistEntry = {
      ...entry,
      id: `guest_${entry.listingId}`,
      userId: 'guest',
    };
    const validated = wishlistEntrySchema.parse(guestItem);
    const current = readGuestWishlist();
    const next = [validated, ...current.filter((item) => item.listingId !== validated.listingId)];
    writeGuestWishlist(next);
    return validated;
  }

  const docId = `${userId}_${entry.listingId}`;
  const fullEntry: WishlistEntry = {
    ...entry,
    id: docId,
    userId,
  };
  return upsertUserDocument('wishlists', docId, fullEntry, wishlistEntrySchema);
}

export async function removeWishlistEntry(
  id: string,
  listingId: string,
  userId: string | null,
): Promise<void> {
  if (!userId) {
    const current = readGuestWishlist();
    writeGuestWishlist(current.filter((item) => item.id !== id && item.listingId !== listingId));
    return;
  }
  const docId = id.startsWith(`${userId}_`) ? id : `${userId}_${listingId}`;
  await deleteUserDocument('wishlists', docId);
}
