import { upsertMarketplaceProduct } from '@/features/marketplace/api/marketplace.api';
import {
  fetchCollectionWithSeed,
  removeCollectionDocument,
  uploadImageToFirebaseStorage,
  upsertCollectionDocument,
} from '@/shared/firebase';
import {
  createListingInputSchema,
  sellerListingListSchema,
  sellerListingSchema,
} from './listings.schema';
import type { CreateListingInput, ListingStatus, SellerListing } from './listings.types';

export const SEED_SELLER_LISTINGS: readonly SellerListing[] = [
  {
    id: 'sell-nordic-lamp-01',
    title: 'Nordic Architect Desk Lamp',
    category: 'furniture',
    price: 48,
    status: 'active',
    viewsCount: 64,
    pickupHall: 'North Hall Block B',
    imageUrl:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    storageSource: 'seed',
    updatedAt: '2026-11-07T12:00:00.000Z',
  },
  {
    id: 'sell-stagg-kettle-02',
    title: 'Stagg Pour-Over Electric Kettle',
    category: 'kitchenware',
    price: 85,
    status: 'reserved',
    viewsCount: 92,
    pickupHall: 'Westgate Student Village',
    imageUrl:
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80',
    storageSource: 'seed',
    updatedAt: '2026-11-06T16:45:00.000Z',
  },
  {
    id: 'sell-atlas-audio-03',
    title: 'Atlas Over-Ear Headphones',
    category: 'tech',
    price: 249,
    status: 'active',
    viewsCount: 118,
    pickupHall: 'North Hall Residence',
    imageUrl:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    storageSource: 'seed',
    updatedAt: '2026-11-08T09:10:00.000Z',
  },
];

const DEFAULT_FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?auto=format&fit=crop&w=900&q=80';

export async function fetchSellerListings(): Promise<SellerListing[]> {
  return fetchCollectionWithSeed(
    'listings',
    sellerListingSchema,
    sellerListingListSchema,
    SEED_SELLER_LISTINGS,
  );
}

export async function createSellerListing(
  input: CreateListingInput,
  userId: string,
): Promise<SellerListing> {
  const validated = createListingInputSchema.parse({
    title: input.title.trim(),
    category: input.category,
    price: input.price,
    pickupHall: input.pickupHall.trim(),
  });

  let imageUrl = DEFAULT_FALLBACK_IMAGE;
  let storageSource: 'firebase-storage' | 'local-preview' | 'seed' = 'seed';

  if (input.imageFile) {
    const uploadResult = await uploadImageToFirebaseStorage('listings', userId, input.imageFile);
    imageUrl = uploadResult.downloadUrl;
    storageSource = uploadResult.source;
  }

  const newListing: SellerListing = {
    id: `sell-${Date.now()}`,
    title: validated.title,
    category: validated.category,
    price: validated.price,
    status: 'active',
    viewsCount: 1,
    pickupHall: validated.pickupHall,
    imageUrl,
    storageSource,
    updatedAt: new Date().toISOString(),
  };

  const savedListing = await upsertCollectionDocument(
    'listings',
    newListing,
    sellerListingSchema,
    sellerListingListSchema,
    SEED_SELLER_LISTINGS,
  );

  // Sync newly listed item to the main Marketplace Catalogue in Firestore
  await upsertMarketplaceProduct({
    id: savedListing.id,
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
    sellerName: 'Alex · Verified Student',
    condition: 'Like new',
    showcaseId: 'nordic-desk-lamp',
  });

  return savedListing;
}

export async function updateSellerListingStatus(
  listing: SellerListing,
  status: ListingStatus,
): Promise<SellerListing> {
  return upsertCollectionDocument(
    'listings',
    {
      ...listing,
      status,
      updatedAt: new Date().toISOString(),
    },
    sellerListingSchema,
    sellerListingListSchema,
    SEED_SELLER_LISTINGS,
  );
}

export async function deleteSellerListing(id: string): Promise<void> {
  return removeCollectionDocument('listings', id, sellerListingListSchema, SEED_SELLER_LISTINGS);
}
