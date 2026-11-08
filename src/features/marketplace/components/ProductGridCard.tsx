import { Box, Heart, MapPin } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { addWishlistEntry, removeWishlistEntry } from '@/features/wishlist/api/wishlist.api';
import { logDiagnosticError } from '@/shared/errors';
import { StarRating } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';
import { COLOURS } from '../api/marketplace.api';
import type { MarketplaceProduct } from '../api/marketplace.types';

export interface ProductGridCardProps {
  readonly product: MarketplaceProduct;
  readonly index: number;
}

export function ProductGridCard({ product, index }: ProductGridCardProps) {
  const [saved, setSaved] = useState(false);
  const colourLabel = COLOURS.find((c) => c.value === product.colour)?.label ?? product.colour;

  const handleToggleWishlist = () => {
    const next = !saved;
    setSaved(next);
    const wishId = `wish-${product.id}`;
    if (next) {
      void addWishlistEntry({
        id: wishId,
        listingId: product.showcaseId,
        title: product.name,
        price: product.price,
        campusLocation: product.campusHall,
        inStock: product.inStock,
        savedAt: new Date().toISOString(),
      }).catch((err: unknown) => {
        logDiagnosticError(err, 'ProductGridCard:addWishlistEntry');
      });
    } else {
      void removeWishlistEntry(wishId).catch((err: unknown) => {
        logDiagnosticError(err, 'ProductGridCard:removeWishlistEntry');
      });
    }
  };

  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: Math.min(index, 8) * 0.04 }}
      className="group relative flex flex-col gap-3"
    >
      {/* Split Architectural Studio Frame (matches image-1.png!) */}
      <div className="relative flex h-80 flex-col overflow-hidden rounded-lg border border-zinc-200 bg-zinc-100 transition-colors dark:border-zinc-800 dark:bg-zinc-900">
        <div className="relative h-52 w-full overflow-hidden bg-zinc-200/60 dark:bg-zinc-800/60">
          <img
            src={product.image}
            alt={product.name}
            loading="lazy"
            className={cn(
              'h-full w-full object-cover transition-transform duration-500 ease-out group-hover:scale-105',
              !product.inStock && 'opacity-60 grayscale-25',
            )}
          />
          {!product.inStock ? (
            <span className="absolute top-2.5 left-2.5 rounded-full border border-zinc-300 bg-white/90 px-2.5 py-0.5 text-xs font-medium text-zinc-900 backdrop-blur-xs dark:border-zinc-700 dark:bg-zinc-950/85 dark:text-zinc-100">
              Sold out
            </span>
          ) : (
            <span className="absolute top-2.5 left-2.5 rounded-full border border-zinc-200/80 bg-white/85 px-2.5 py-0.5 text-xs font-medium text-zinc-700 opacity-0 backdrop-blur-xs transition-opacity group-hover:opacity-100 dark:border-zinc-700 dark:bg-zinc-900/85 dark:text-zinc-200">
              {product.condition}
            </span>
          )}

          <button
            type="button"
            aria-label={saved ? 'Remove from wishlist' : 'Save to wishlist'}
            onClick={(e) => {
              e.preventDefault();
              handleToggleWishlist();
            }}
            className="absolute top-2.5 right-2.5 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/85 text-zinc-700 backdrop-blur-xs transition-transform hover:scale-110 dark:bg-zinc-900/85 dark:text-zinc-200"
          >
            <Heart
              className={cn(
                'h-4 w-4 transition-colors',
                saved ? 'fill-rose-500 text-rose-500' : 'fill-none',
              )}
            />
          </button>
        </div>

        {/* Lower Studio Plinth Area */}
        <div className="flex flex-1 flex-col justify-between bg-zinc-100/90 p-3.5 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
            <span className="inline-flex items-center gap-1 truncate">
              <MapPin className="h-3 w-3 shrink-0" />
              {product.campusHall}
            </span>
            <span className="shrink-0">{product.sellerName}</span>
          </div>

          <div className="flex items-center justify-between pt-2">
            <Link
              to={`/products?item=${product.showcaseId}`}
              className="inline-flex items-center gap-1.5 rounded-md bg-zinc-900 px-2.5 py-1 text-xs font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              <Box className="h-3 w-3" />
              Inspect in 3D
            </Link>
            <span className="text-xs font-medium uppercase tracking-wider text-zinc-400 dark:text-zinc-500">
              {product.category}
            </span>
          </div>
        </div>
      </div>

      {/* Product Meta Below Card (matches image-1.png!) */}
      <div className="flex flex-col gap-1">
        <div className="flex items-baseline justify-between gap-3">
          <h3 className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            <Link
              to={`/products?item=${product.showcaseId}`}
              className="hover:underline focus-visible:outline-none"
            >
              {product.name}
            </Link>
          </h3>
          <span className="shrink-0 text-sm font-semibold tabular-nums text-zinc-900 dark:text-zinc-100">
            ${product.price}
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
