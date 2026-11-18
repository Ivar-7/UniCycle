import {
  removeMarketplaceProduct,
  upsertMarketplaceProduct,
} from '@/features/marketplace/api/marketplace.api';
import type { ProductCategory } from '@/features/marketplace/api/marketplace.types';
import {
  deleteUserDocument,
  fetchUserCollection,
  uploadImageToFirebaseStorage,
  upsertUserDocument,
} from '@/shared/firebase';
import { createListingInputSchema, sellerListingSchema } from './listings.schema';
import type { CreateListingInput, ListingStatus, SellerListing } from './listings.types';

const DEFAULT_CATEGORY_IMAGES: Record<ProductCategory, string> = {
  tech: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
  furniture:
    'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
  kitchenware: 'https://live.staticflickr.com/65535/52220711420_7496ae6182_b.jpg',
  bags: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
  apparel:
    'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
  outdoor:
    'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
};

export async function fetchSellerListings(sellerId: string): Promise<SellerListing[]> {
  return fetchUserCollection('listings', sellerListingSchema, {
    filterField: 'sellerId',
    filterOp: '==',
    userId: sellerId,
    orderByField: 'updatedAt',
  });
}

export async function createSellerListing(
  input: CreateListingInput,
  sellerId: string,
  sellerName: string,
): Promise<SellerListing> {
  const validated = createListingInputSchema.parse({
    title: input.title.trim(),
    category: input.category,
    price: input.price,
    pickupHall: input.pickupHall.trim(),
  });

  let imageUrl = DEFAULT_CATEGORY_IMAGES[validated.category];
  let storageSource: 'firebase-storage' | 'seed' = 'seed';

  if (input.imageFile) {
    const uploadResult = await uploadImageToFirebaseStorage('listings', sellerId, input.imageFile);
    imageUrl = uploadResult.downloadUrl;
    storageSource = uploadResult.source;
  }

  const listingId = `sell-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
  const nowIso = new Date().toISOString();

  const newListing: SellerListing = {
    id: listingId,
    sellerId,
    title: validated.title,
    category: validated.category,
    price: validated.price,
    status: 'active',
    viewsCount: 0,
    pickupHall: validated.pickupHall,
    imageUrl,
    storageSource,
    updatedAt: nowIso,
  };

  const savedListing = await upsertUserDocument(
    'listings',
    listingId,
    newListing,
    sellerListingSchema,
  );

  await upsertMarketplaceProduct({
    id: savedListing.id,
    sellerId,
    name: savedListing.title,
    category: savedListing.category,
    colour: 'black',
    price: savedListing.price,
    rating: 5.0,
    reviews: 1,
    inStock: true,
    added: savedListing.updatedAt.slice(0, 10),
    image: savedListing.imageUrl,
    campusHall: savedListing.pickupHall,
    sellerName: sellerName || 'Verified Student',
    condition: 'Like new',
  });

  return savedListing;
}

export async function updateSellerListingStatus(
  listing: SellerListing,
  status: ListingStatus,
  sellerName: string,
): Promise<SellerListing> {
  const updated: SellerListing = {
    ...listing,
    status,
    updatedAt: new Date().toISOString(),
  };

  const saved = await upsertUserDocument('listings', listing.id, updated, sellerListingSchema);

  await upsertMarketplaceProduct({
    id: saved.id,
    sellerId: saved.sellerId,
    name: saved.title,
    category: saved.category,
    colour: 'black',
    price: saved.price,
    rating: 5.0,
    reviews: 1,
    inStock: saved.status === 'active',
    added: saved.updatedAt.slice(0, 10),
    image: saved.imageUrl,
    campusHall: saved.pickupHall,
    sellerName: sellerName || 'Verified Student',
    condition: 'Like new',
  });

  return saved;
}

export async function deleteSellerListing(id: string): Promise<void> {
  await deleteUserDocument('listings', id);
  await removeMarketplaceProduct(id);
}
