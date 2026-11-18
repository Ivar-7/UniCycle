import { ArrowUpRight, Heart, ImageOff, MapPin, MessageSquare } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { logDiagnosticError } from '@/shared/errors';
import { usePreferences } from '@/shared/hooks/usePreferences';
import { useSavedItems } from '@/shared/hooks/useSavedItems';
import { StarRating } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';
import { buildMessageSellerUrl, COLOURS } from '../api/marketplace.api';
import type { MarketplaceProduct } from '../api/marketplace.types';

export interface ProductGridCardProps {
  readonly product: MarketplaceProduct;
  readonly index: number;
}

export function ProductGridCard({ product, index }: ProductGridCardProps) {
  const { formatPrice } = usePreferences();
  const { isSaved, toggleItem } = useSavedItems();
  const [imageError, setImageError] = useState(false);

  const saved = isSaved(product.id);
  const colourLabel = COLOURS.find((c) => c.value === product.colour)?.label ?? product.colour;
  const isStudioCutout = product.image.endsWith('.webp');
  const itemUrl = `/item/${encodeURIComponent(product.id)}`;
  const messageUrl = buildMessageSellerUrl(product);

  const handleToggleWishlist = () => {
    void toggleItem({
      listingId: product.id,
      title: product.name,
      price: product.price,
      campusLocation: product.campusHall,
      ...(product.sellerId ? { sellerId: product.sellerId } : {}),
      sellerName: product.sellerName,
      inStock: product.inStock,
    }).catch((err: unknown) => {
      logDiagnosticError(err, 'ProductGridCard:toggleWishlist');
    });
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28, delay: Math.min(index, 8) * 0.03 }}
      className="group relative flex h-full flex-col gap-3"
    >
      {/* Card Visual & Campus Plinth */}
      <div className="relative flex flex-col overflow-hidden rounded-xl border border-zinc-200/90 bg-white shadow-xs transition-all duration-300 group-hover:-translate-y-0.5 group-hover:shadow-md dark:border-zinc-800 dark:bg-zinc-900">
        <Link
          to={itemUrl}
          className="relative aspect-4/3 w-full overflow-hidden bg-stone-100 dark:bg-zinc-800/80"
        >
          {imageError ? (
            <div className="flex h-full w-full items-center justify-center text-zinc-400 dark:text-zinc-600">
              <ImageOff className="h-8 w-8" />
            </div>
          ) : (
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              onError={() => setImageError(true)}
              className={cn(
                'h-full w-full transition-transform duration-500 ease-out group-hover:scale-105',
                isStudioCutout
                  ? 'object-contain p-4'
                  : 'object-cover dark:brightness-90 dark:contrast-105',
                !product.inStock && 'opacity-60 grayscale-25',
              )}
            />
          )}

          {!product.inStock ? (
            <span className="absolute top-2.5 left-2.5 rounded-full border border-zinc-300 bg-white/95 px-2.5 py-0.5 text-xs font-medium text-zinc-900 shadow-2xs backdrop-blur-xs dark:border-zinc-700 dark:bg-zinc-950/90 dark:text-zinc-100">
              Sold out
            </span>
          ) : (
            <span className="absolute top-2.5 left-2.5 rounded-full border border-zinc-200/90 bg-white/95 px-2.5 py-0.5 text-xs font-medium text-zinc-700 shadow-2xs backdrop-blur-xs dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-200">
              {product.condition}
            </span>
          )}
        </Link>

        <button
          type="button"
          aria-label={saved ? `Remove ${product.name} from saved` : `Save ${product.name}`}
          aria-pressed={saved}
          onClick={handleToggleWishlist}
          className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full border border-zinc-200/90 bg-white/95 text-zinc-700 shadow-xs backdrop-blur-xs transition-transform hover:scale-110 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-200"
        >
          <Heart
            className={cn(
              'h-4 w-4 transition-colors',
              saved ? 'fill-rose-500 text-rose-500' : 'fill-none',
            )}
          />
        </button>

        {/* Lower Plinth */}
        <div className="flex flex-col gap-2.5 border-t border-zinc-100 bg-zinc-50/75 p-3.5 dark:border-zinc-800/80 dark:bg-zinc-900">
          <div className="flex items-center justify-between gap-2 text-xs text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex min-w-0 items-center gap-1">
              <MapPin className="h-3 w-3 shrink-0" />
              <span className="truncate">{product.campusHall}</span>
            </span>
            <span className="shrink-0 truncate text-right">{product.sellerName}</span>
          </div>

          <div className="flex items-center justify-between gap-2 pt-0.5">
            <div className="flex shrink-0 items-center gap-1.5">
              <Link
                to={itemUrl}
                className={cn(
                  'inline-flex shrink-0 items-center gap-1 rounded-lg border px-2.5 py-1.5 text-xs font-semibold whitespace-nowrap transition-colors',
                  product.inStock
                    ? 'border-zinc-300 bg-white text-zinc-800 hover:border-sky-700 hover:bg-sky-700 hover:text-white dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:border-sky-600 dark:hover:bg-sky-700 dark:hover:text-sky-50'
                    : 'border-zinc-200 bg-transparent text-zinc-500 hover:border-zinc-400 hover:text-zinc-800 dark:border-zinc-800 dark:text-zinc-400 dark:hover:border-zinc-600 dark:hover:text-zinc-200',
                )}
              >
                <span>{product.inStock ? 'View & Buy' : 'View'}</span>
                <ArrowUpRight className="h-3.5 w-3.5 shrink-0" />
              </Link>
              <Link
                to={messageUrl}
                aria-label={`Message ${product.sellerName}`}
                title="Message Seller"
                className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-zinc-200 bg-white text-zinc-700 transition-colors hover:border-sky-700 hover:text-sky-700 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-200 dark:hover:border-sky-400 dark:hover:text-sky-300"
              >
                <MessageSquare className="h-3.5 w-3.5" />
              </Link>
            </div>
            <span className="shrink-0 text-xs font-medium uppercase tracking-normal text-zinc-500 dark:text-zinc-400">
              {product.category}
            </span>
          </div>
        </div>
      </div>

      {/* Product Metadata */}
      <div className="flex flex-1 flex-col gap-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="min-w-0 text-sm font-medium text-zinc-900 dark:text-zinc-100">
            <Link to={itemUrl} className="hover:underline focus-visible:outline-none">
              {product.name}
            </Link>
          </h3>
          <span className="shrink-0 text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
            {formatPrice(product.price)}
          </span>
        </div>

        <span className="text-xs text-zinc-500 dark:text-zinc-400">{colourLabel}</span>

        <span className="flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
          <StarRating value={product.rating} size="xs" />
          <span className="tabular-nums">{product.rating.toFixed(1)}</span>
          <span className="tabular-nums">({product.reviews.toLocaleString('en-US')})</span>
        </span>
      </div>
    </motion.article>
  );
}
