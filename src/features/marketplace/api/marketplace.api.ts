import { fetchCollectionWithSeed, upsertCollectionDocument } from '@/shared/firebase';
import { marketplaceProductListSchema, marketplaceProductSchema } from './marketplace.schema';
import type {
  MarketplaceProduct,
  ProductCategory,
  ProductColour,
  RatingFilterValue,
  SortOptionValue,
} from './marketplace.types';

export const PRICE_MIN = 0;
export const PRICE_MAX = 400;

export const CATEGORIES: readonly { readonly value: ProductCategory; readonly label: string }[] = [
  { value: 'tech', label: 'Tech' },
  { value: 'furniture', label: 'Furniture' },
  { value: 'kitchenware', label: 'Kitchenware' },
  { value: 'bags', label: 'Bags' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'outdoor', label: 'Outdoor' },
];

export const COLOURS: readonly {
  readonly value: ProductColour;
  readonly label: string;
  readonly bgClass: string;
}[] = [
  { value: 'black', label: 'Black', bgClass: 'bg-zinc-900' },
  { value: 'white', label: 'White', bgClass: 'bg-stone-100' },
  { value: 'sand', label: 'Sand', bgClass: 'bg-amber-200' },
  { value: 'olive', label: 'Olive', bgClass: 'bg-lime-800' },
  { value: 'navy', label: 'Navy', bgClass: 'bg-indigo-950' },
];

export const RATINGS: readonly {
  readonly value: RatingFilterValue;
  readonly label: string;
  readonly min: number;
}[] = [
  { value: 'any', label: 'Any rating', min: 0 },
  { value: '4', label: '4 stars & up', min: 4 },
  { value: '3', label: '3 stars & up', min: 3 },
];

export const SORTS: readonly { readonly value: SortOptionValue; readonly label: string }[] = [
  { value: 'featured', label: 'Featured' },
  { value: 'price-asc', label: 'Price low to high' },
  { value: 'price-desc', label: 'Price high to low' },
  { value: 'newest', label: 'Newest' },
];

export const CATALOGUE_PRODUCTS: readonly MarketplaceProduct[] = [
  {
    id: 'atlas-headphones',
    name: 'Atlas Over-Ear Headphones',
    category: 'tech',
    colour: 'black',
    price: 249,
    rating: 4.8,
    reviews: 1204,
    inStock: true,
    added: '2026-09-10',
    image:
      'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=900&q=80',
    campusHall: 'North Hall Residence',
    sellerName: 'Maya · 2nd Year CS',
    condition: 'Mint',
    showcaseId: 'atlas-headphones',
  },
  {
    id: 'carryall-pack',
    name: 'Carryall Day Pack',
    category: 'bags',
    colour: 'olive',
    price: 96,
    rating: 4.7,
    reviews: 566,
    inStock: true,
    added: '2026-08-21',
    image:
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=900&q=80',
    campusHall: 'Oakwood Village',
    sellerName: 'Liam · Final Year Bio',
    condition: 'Like new',
    showcaseId: 'carryall-pack',
  },
  {
    id: 'meridian-watch',
    name: 'Meridian Chrono Watch',
    category: 'tech',
    colour: 'navy',
    price: 389,
    rating: 4.9,
    reviews: 318,
    inStock: true,
    added: '2026-07-14',
    image:
      'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
    campusHall: 'Central Union',
    sellerName: 'Noah · 3rd Year Econ',
    condition: 'Mint',
    showcaseId: 'meridian-watch',
  },
  {
    id: 'volt-runners',
    name: 'Kestrel Vapor Pace 3',
    category: 'apparel',
    colour: 'white',
    price: 240,
    rating: 4.6,
    reviews: 942,
    inStock: true,
    added: '2026-10-30',
    image:
      'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=900&q=80',
    campusHall: 'Eastgate Courts',
    sellerName: 'Elena · Postgrad Design',
    condition: 'Mint',
    showcaseId: 'kestrel-vapor-pace-3',
  },
  {
    id: 'horizon-sunglasses',
    name: 'Horizon Sunglasses',
    category: 'outdoor',
    colour: 'black',
    price: 74,
    rating: 4.5,
    reviews: 211,
    inStock: true,
    added: '2026-06-02',
    image:
      'https://images.unsplash.com/photo-1511499767150-a48a237f0083?auto=format&fit=crop&w=900&q=80',
    campusHall: 'Riverside Flats',
    sellerName: 'Sam · 2nd Year Media',
    condition: 'Like new',
    showcaseId: 'horizon-sunglasses',
  },
  {
    id: 'pioneer-camera',
    name: 'Pioneer Instant Camera',
    category: 'tech',
    colour: 'white',
    price: 179,
    rating: 4.7,
    reviews: 689,
    inStock: false,
    added: '2026-09-02',
    image:
      'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&w=900&q=80',
    campusHall: 'South Park Halls',
    sellerName: 'Chloe · 3rd Year Arts',
    condition: 'Good',
    showcaseId: 'pioneer-camera',
  },
  {
    id: 'nordic-desk-lamp',
    name: 'Nordic Architect Desk Lamp',
    category: 'furniture',
    colour: 'sand',
    price: 48,
    rating: 4.9,
    reviews: 412,
    inStock: true,
    added: '2026-10-18',
    image:
      'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=900&q=80',
    campusHall: 'North Hall Block B',
    sellerName: 'Alex · 2nd Year Arch',
    condition: 'Mint',
    showcaseId: 'nordic-desk-lamp',
  },
  {
    id: 'stagg-kettle',
    name: 'Stagg Pour-Over Electric Kettle',
    category: 'kitchenware',
    colour: 'black',
    price: 85,
    rating: 4.8,
    reviews: 730,
    inStock: true,
    added: '2026-10-22',
    image:
      'https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=900&q=80',
    campusHall: 'Westgate Student Village',
    sellerName: 'Zoe · Final Year Chem',
    condition: 'Like new',
    showcaseId: 'stagg-kettle',
  },
  {
    id: 'ergo-mesh-chair',
    name: 'Aero Ergonomic Mesh Study Chair',
    category: 'furniture',
    colour: 'black',
    price: 145,
    rating: 4.7,
    reviews: 289,
    inStock: true,
    added: '2026-10-12',
    image:
      'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?auto=format&fit=crop&w=900&q=80',
    campusHall: 'Central Campus Union',
    sellerName: 'Marcus · PhD Robotics',
    condition: 'Like new',
    showcaseId: 'ergo-mesh-chair',
  },
  {
    id: 'hydra-bottle',
    name: 'Hydra Steel Bottle, 750 ml',
    category: 'outdoor',
    colour: 'black',
    price: 32,
    rating: 4.4,
    reviews: 1870,
    inStock: true,
    added: '2026-05-18',
    image:
      'https://images.unsplash.com/photo-1602143407151-7111542de6e8?auto=format&fit=crop&w=900&q=80',
    campusHall: 'Sports Complex Hall',
    sellerName: 'Dan · 1st Year Physio',
    condition: 'Mint',
    showcaseId: 'hydra-bottle',
  },
  {
    id: 'dutch-oven-set',
    name: 'Cast-Iron Dutch Oven & Skillet',
    category: 'kitchenware',
    colour: 'olive',
    price: 64,
    rating: 4.6,
    reviews: 519,
    inStock: true,
    added: '2026-10-05',
    image:
      'https://images.unsplash.com/photo-1584990347449-a2d4c2c044c9?auto=format&fit=crop&w=900&q=80',
    campusHall: 'Oakwood Village',
    sellerName: 'Hannah · 3rd Year Nutrition',
    condition: 'Good',
    showcaseId: 'dutch-oven-set',
  },
  {
    id: 'field-cap',
    name: 'Field Cap, Organic Cotton',
    category: 'apparel',
    colour: 'sand',
    price: 28,
    rating: 4.3,
    reviews: 404,
    inStock: false,
    added: '2026-04-09',
    image:
      'https://images.unsplash.com/photo-1588850561407-ed78c282e89b?auto=format&fit=crop&w=900&q=80',
    campusHall: 'Founder Courts',
    sellerName: 'Toby · 2nd Year History',
    condition: 'Good',
    showcaseId: 'field-cap',
  },
];

export async function fetchMarketplaceProducts(): Promise<MarketplaceProduct[]> {
  return fetchCollectionWithSeed(
    'marketplace_products',
    marketplaceProductSchema,
    marketplaceProductListSchema,
    CATALOGUE_PRODUCTS,
  );
}

export async function upsertMarketplaceProduct(
  product: MarketplaceProduct,
): Promise<MarketplaceProduct> {
  return upsertCollectionDocument(
    'marketplace_products',
    product,
    marketplaceProductSchema,
    marketplaceProductListSchema,
    CATALOGUE_PRODUCTS,
  );
}
