import {
  ArrowLeft,
  CalendarClock,
  Check,
  Heart,
  ImageOff,
  Loader2,
  MapPin,
  Maximize2,
  MessageSquare,
  ShieldCheck,
  ShoppingBag,
  UserCheck,
  X,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { usePreferences } from '@/shared/hooks/usePreferences';
import { Badge, Card, EmptyState, ErrorState, LoadingState, StarRating } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';
import { formatRelativeDate } from '@/shared/utils/format';
import { buildMessageSellerUrl, CATEGORIES, COLOURS } from '../api/marketplace.api';
import { useMarketplaceItem } from '../state/useMarketplaceItem';
import { ProductGridCard } from './ProductGridCard';

export interface ItemDetailViewProps {
  readonly itemId: string | undefined;
}

/**
 * Full product inspection and campus pickup reservation view for a marketplace item.
 */
export function ItemDetailView({ itemId }: ItemDetailViewProps) {
  const navigate = useNavigate();
  const { formatPrice } = usePreferences();
  const {
    user,
    status,
    error,
    product,
    related,
    saved,
    isReserving,
    actionError,
    clearActionError,
    bagNotice,
    handleToggleBag,
    handleBuyNow,
    reload,
  } = useMarketplaceItem(itemId);

  const [imageError, setImageError] = useState(false);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!lightboxOpen) {
      return;
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setLightboxOpen(false);
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [lightboxOpen]);

  if (status === 'loading') {
    return <LoadingState label="Loading item details..." />;
  }

  if (status === 'error' && error) {
    return <ErrorState error={error} onRetry={reload} />;
  }

  if (status === 'empty' || !product) {
    return (
      <EmptyState
        title="Item not found"
        description="This campus listing may have been sold or removed."
        actionLabel="Back to Shop"
        onAction={() => void navigate('/')}
      />
    );
  }

  const categoryLabel =
    CATEGORIES.find((c) => c.value === product.category)?.label ?? product.category;
  const colourMeta = COLOURS.find((c) => c.value === product.colour);
  const isStudioCutout = product.image.endsWith('.webp');
  const messageUrl = buildMessageSellerUrl(product);

  return (
    <div className="space-y-12 pb-16">
      <div className="flex items-center justify-between gap-4">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Shop</span>
        </Link>

        <Link
          to="/wishlist"
          className="text-xs font-medium text-sky-700 hover:underline dark:text-sky-400"
        >
          View Saved Bag
        </Link>
      </div>

      {actionError ? (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
        >
          <span>{actionError}</span>
          <button
            type="button"
            aria-label="Dismiss error"
            onClick={clearActionError}
            className="shrink-0 rounded-md p-1 hover:bg-rose-100 dark:hover:bg-rose-900"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      <div className="grid gap-8 lg:grid-cols-12 lg:items-start lg:gap-10">
        {/* Product Photo */}
        <div className="lg:col-span-7">
          <div className="relative aspect-4/3 w-full overflow-hidden rounded-2xl border border-zinc-200 bg-stone-100 shadow-xs dark:border-zinc-800 dark:bg-zinc-900">
            {imageError ? (
              <div className="flex h-full w-full items-center justify-center text-zinc-400 dark:text-zinc-600">
                <ImageOff className="h-12 w-12" />
              </div>
            ) : (
              <img
                src={product.image}
                alt={product.name}
                onError={() => setImageError(true)}
                onClick={() => setLightboxOpen(true)}
                className={cn(
                  'h-full w-full cursor-zoom-in transition-transform duration-300 hover:scale-105',
                  isStudioCutout
                    ? 'object-contain p-8'
                    : 'object-cover dark:brightness-90 dark:contrast-105',
                  !product.inStock && 'opacity-70 grayscale-25',
                )}
              />
            )}

            <div className="absolute top-3 left-3 flex items-center gap-2">
              <Badge tone={product.inStock ? 'sky' : 'slate'}>
                {product.inStock ? product.condition : 'Sold out'}
              </Badge>
            </div>

            {!imageError ? (
              <button
                type="button"
                aria-label="Enlarge photo"
                onClick={() => setLightboxOpen(true)}
                className="absolute right-3 bottom-3 inline-flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200/80 bg-white/90 text-zinc-700 shadow-xs backdrop-blur-xs transition-transform hover:scale-105 dark:border-zinc-700 dark:bg-zinc-900/90 dark:text-zinc-200"
              >
                <Maximize2 className="h-4 w-4" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Purchase & Pickup Panel */}
        <Card className="space-y-6 lg:col-span-5">
          <div className="space-y-2 border-b border-zinc-100 pb-5 dark:border-zinc-800">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="text-xs font-medium tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                {categoryLabel}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                <StarRating value={product.rating} size="xs" />
                <span className="tabular-nums">{product.rating.toFixed(1)}</span>
                <span className="tabular-nums">({product.reviews.toLocaleString('en-US')})</span>
              </span>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-50">
              {product.name}
            </h1>

            <div className="flex items-baseline justify-between gap-4 pt-1">
              <span className="text-3xl font-bold tabular-nums text-zinc-900 dark:text-white">
                {formatPrice(product.price)}
              </span>
              <span className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300">
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    product.inStock ? 'bg-sky-600 dark:bg-sky-400' : 'bg-zinc-400',
                  )}
                />
                {product.inStock ? 'Available for campus pickup' : 'Currently unavailable'}
              </span>
            </div>
          </div>

          <dl className="grid grid-cols-2 gap-4 text-xs">
            <div className="space-y-1">
              <dt className="font-medium tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                Condition
              </dt>
              <dd className="font-semibold text-zinc-900 dark:text-zinc-100">
                {product.condition}
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="font-medium tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                Colour
              </dt>
              <dd className="inline-flex items-center gap-2 font-semibold text-zinc-900 dark:text-zinc-100">
                {colourMeta ? (
                  <span
                    aria-hidden="true"
                    className={cn(
                      'h-3.5 w-3.5 rounded-full border border-zinc-300 dark:border-zinc-700',
                      colourMeta.bgClass,
                    )}
                  />
                ) : null}
                <span>{colourMeta?.label ?? product.colour}</span>
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="font-medium tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                Seller
              </dt>
              <dd className="inline-flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                <UserCheck className="h-3.5 w-3.5 text-sky-700 dark:text-sky-400" />
                <span>{product.sellerName}</span>
              </dd>
            </div>
            <div className="space-y-1">
              <dt className="font-medium tracking-wider text-zinc-500 uppercase dark:text-zinc-400">
                Listed
              </dt>
              <dd className="inline-flex items-center gap-1.5 font-semibold text-zinc-900 dark:text-zinc-100">
                <CalendarClock className="h-3.5 w-3.5 text-zinc-400" />
                <span>{formatRelativeDate(product.added)}</span>
              </dd>
            </div>
          </dl>

          <div className="rounded-xl border border-zinc-200 bg-zinc-50/80 p-3.5 text-xs dark:border-zinc-800 dark:bg-zinc-950/60">
            <div className="flex items-start gap-2.5">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-sky-700 dark:text-sky-400" />
              <div className="space-y-0.5">
                <p className="font-semibold text-zinc-900 dark:text-zinc-100">
                  Pickup at {product.campusHall}
                </p>
                <p className="text-zinc-500 dark:text-zinc-400">
                  Zero shipping fee · Inspect in person and confirm handover code at meetup.
                </p>
              </div>
            </div>
          </div>

          <div className="relative space-y-2.5">
            <button
              type="button"
              disabled={!product.inStock || isReserving}
              onClick={() => void handleBuyNow()}
              className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-sky-700 px-5 text-xs font-semibold tracking-wider text-white uppercase transition-colors hover:bg-sky-800 disabled:cursor-not-allowed disabled:opacity-45 dark:bg-sky-700 dark:text-sky-50 dark:hover:bg-sky-600"
            >
              {isReserving ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <ShoppingBag className="h-4 w-4" />
                  <span>
                    {!product.inStock
                      ? 'Sold Out'
                      : user
                        ? 'Reserve for Campus Pickup'
                        : 'Sign In & Buy Pickup'}
                  </span>
                </>
              )}
            </button>

            <div className="grid grid-cols-2 gap-2.5">
              <button
                type="button"
                aria-pressed={saved}
                onClick={() => void handleToggleBag()}
                className={cn(
                  'inline-flex h-11 items-center justify-center gap-2 rounded-xl border px-4 text-xs font-semibold transition-colors',
                  saved
                    ? 'border-zinc-900 bg-zinc-100 text-zinc-900 dark:border-zinc-100 dark:bg-zinc-800 dark:text-zinc-100'
                    : 'border-zinc-300 bg-white text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800',
                )}
              >
                {saved ? (
                  <>
                    <Check className="h-4 w-4" />
                    <span>In Bag</span>
                  </>
                ) : (
                  <>
                    <Heart className="h-4 w-4" />
                    <span>Add to Bag</span>
                  </>
                )}
              </button>

              <Link
                to={messageUrl}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 text-xs font-semibold text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                <MessageSquare className="h-4 w-4" />
                <span>Message Seller</span>
              </Link>
            </div>

            <AnimatePresence>
              {bagNotice ? (
                <motion.p
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -4 }}
                  role="status"
                  className="text-center text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  {bagNotice}
                </motion.p>
              ) : null}
            </AnimatePresence>
          </div>

          <div className="flex items-center gap-2 border-t border-zinc-100 pt-4 text-xs text-zinc-500 dark:border-zinc-800 dark:text-zinc-400">
            <ShieldCheck className="h-4 w-4 shrink-0 text-zinc-700 dark:text-zinc-300" />
            <span>Safe campus handover protection</span>
          </div>
        </Card>
      </div>

      {/* Related Campus Items */}
      {related.length > 0 ? (
        <section aria-label="More in this category" className="space-y-5">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            More in {categoryLabel}
          </h2>
          <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2 lg:grid-cols-4">
            {related.map((item, idx) => (
              <ProductGridCard key={item.id} product={item} index={idx} />
            ))}
          </div>
        </section>
      ) : null}

      {/* Fullscreen Photo Lightbox */}
      {lightboxOpen && !imageError ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${product.name} photo`}
          onClick={() => setLightboxOpen(false)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 p-4 backdrop-blur-sm"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="relative flex max-h-dvh w-full max-w-4xl flex-col gap-3 rounded-2xl border border-zinc-200 bg-white p-4 shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="truncate text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                {product.name}
              </span>
              <button
                type="button"
                aria-label="Close photo"
                onClick={() => setLightboxOpen(false)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-xl bg-stone-100 dark:bg-zinc-900">
              <img
                src={product.image}
                alt={product.name}
                className="h-full w-full object-contain"
              />
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
