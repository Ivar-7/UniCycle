export interface WishlistEntry {
  readonly id: string;
  readonly listingId: string;
  readonly title: string;
  readonly price: number;
  readonly campusLocation: string;
  readonly inStock: boolean;
  readonly savedAt: string;
}
