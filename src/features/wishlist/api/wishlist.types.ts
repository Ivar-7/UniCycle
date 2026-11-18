export interface WishlistEntry {
  readonly id: string;
  readonly userId: string;
  readonly listingId: string;
  readonly title: string;
  readonly price: number;
  readonly campusLocation: string;
  readonly sellerId?: string;
  readonly sellerName?: string;
  readonly inStock: boolean;
  readonly savedAt: string;
}
