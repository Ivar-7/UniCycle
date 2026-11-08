export type ProductCategory = 'tech' | 'bags' | 'apparel' | 'outdoor' | 'furniture' | 'kitchenware';

export type ProductColour = 'black' | 'white' | 'sand' | 'olive' | 'navy';

export type RatingFilterValue = 'any' | '4' | '3';

export type SortOptionValue = 'featured' | 'price-asc' | 'price-desc' | 'newest';

export interface MarketplaceProduct {
  readonly id: string;
  readonly name: string;
  readonly category: ProductCategory;
  readonly colour: ProductColour;
  readonly price: number;
  readonly rating: number;
  readonly reviews: number;
  readonly inStock: boolean;
  readonly added: string;
  readonly image: string;
  readonly campusHall: string;
  readonly sellerName: string;
  readonly condition: 'Like new' | 'Good' | 'Mint';
  readonly showcaseId: string;
}

export interface MarketplaceFilters {
  readonly categories: ProductCategory[];
  readonly minPrice: number;
  readonly maxPrice: number;
  readonly colours: ProductColour[];
  readonly inStock: boolean;
  readonly rating: RatingFilterValue;
  readonly searchQuery: string;
}

export interface ActiveFilterChip {
  readonly key: string;
  readonly label: string;
  readonly onRemove: () => void;
}
