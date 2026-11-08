import {
  ArrowLeft,
  Check,
  Heart,
  Loader2,
  MapPin,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  StarRating,
  StudioCutoutSvg,
} from '@/shared/ui';
import { cn } from '@/shared/utils/cn';
import { useShowcase } from '../state/useShowcase';
import { ShowcaseGalleryModal } from './ShowcaseGalleryModal';
import { StudioStage3D } from './StudioStage3D';

export function ProductShowcaseView() {
  const {
    status,
    error,
    products,
    activeProduct,
    activeVariant,
    activeVariantIndex,
    activeSizeOption,
    selectedSizeLabel,
    setSelectedSizeLabel,
    selectProduct,
    selectVariant,
    checkSizeSoldOut,
    cartState,
    toastNote,
    liked,
    likePillText,
    handleAddToCart,
    handleToggleLike,
    viewerIndex,
    setViewerIndex,
    viewerZoomed,
    setViewerZoomed,
    stepViewer,
    holdingZoom,
    setHoldingZoom,
    reload,
  } = useShowcase();

  if (status === 'loading') {
    return <LoadingState label="Initializing 3D Product Studio..." />;
  }

  if (status === 'error' && error) {
    return <ErrorState error={error} onRetry={reload} />;
  }

  if (status === 'empty' || !activeProduct || !activeVariant || !activeSizeOption) {
    return (
      <EmptyState
        title="No showcase product selected"
        description="Choose a product from the marketplace to inspect it in 3D."
        actionLabel="Reload Studio"
        onAction={() => void reload()}
      />
    );
  }

  const isCurrentSoldOut = checkSizeSoldOut(activeSizeOption);
  const isLowStock = !isCurrentSoldOut && activeSizeOption.stock <= 3;
  const stockLabel = isCurrentSoldOut
    ? 'Sold out in this colour'
    : isLowStock
      ? `Only ${activeSizeOption.stock} left in size ${activeSizeOption.label}`
      : 'In stock · ships in 2 days';

  const visibleThumbAngles = activeProduct.angles.slice(0, 3);
  const extraAnglesCount = Math.max(0, activeProduct.angles.length - 3);

  return (
    <div className="space-y-8 pb-16">
      {/* Top Bar: Back Link & Flagship 3D Product Switcher */}
      <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <Link
          to="/"
          className="inline-flex items-center gap-2 text-xs font-medium text-zinc-600 transition-colors hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Everyday Carry & Essentials
        </Link>

        <div className="flex flex-wrap items-center gap-2">
          <span className="mr-1 inline-flex items-center gap-1 text-xs font-medium text-zinc-500 dark:text-zinc-400">
            <Sparkles className="h-3.5 w-3.5 text-amber-500" />
            3D Studio Item:
          </span>
          {products.map((prod) => {
            const isSelected = prod.id === activeProduct.id;
            return (
              <button
                key={prod.id}
                type="button"
                onClick={() => selectProduct(prod.id)}
                className={cn(
                  'rounded-xl px-3 py-1.5 text-xs font-medium transition-colors',
                  isSelected
                    ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950'
                    : 'border border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800',
                )}
              >
                {prod.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* Main 3-Column Studio Product Hero Stage (Matches image.png!) */}
      <section
        aria-label={activeProduct.title}
        className={cn(
          'relative overflow-hidden rounded-3xl border border-stone-300/80 bg-radial px-6 py-10 shadow-xl transition-colors duration-700 sm:px-10 sm:py-14 lg:px-14 lg:py-16 dark:border-stone-800',
          activeVariant.stageRadialLightClass,
          `dark:${activeVariant.stageRadialDarkClass}`,
        )}
      >
        <div className="grid items-center gap-10 lg:grid-cols-12 lg:gap-8">
          {/* Left Column: Eyebrow, Title, Italic Description & Angle Thumbnails */}
          <div className="flex flex-col justify-between space-y-8 lg:col-span-3">
            <div className="space-y-4">
              <p className="text-sm font-normal text-stone-600 dark:text-stone-400">
                {activeProduct.eyebrow}
              </p>
              <h1 className="text-3xl leading-tight font-semibold tracking-tight text-stone-900 sm:text-4xl dark:text-stone-100">
                {activeProduct.title}
              </h1>
              <p className="text-sm leading-relaxed text-stone-600 italic dark:text-stone-400">
                {activeProduct.description}
              </p>
            </div>

            {/* Bottom-Left Angle Thumbnails + "+2" Gallery Trigger (matches image.png!) */}
            <div className="flex items-center gap-3 pt-4">
              {visibleThumbAngles.map((angle, idx) => (
                <button
                  key={angle.id}
                  type="button"
                  aria-label={`View ${angle.label}`}
                  onClick={() => setViewerIndex(idx)}
                  className="flex h-11 w-16 items-center justify-center rounded-md border border-stone-300/70 bg-white/50 p-1.5 backdrop-blur-xs transition-transform hover:-translate-y-0.5 dark:border-stone-700/70 dark:bg-stone-900/50"
                >
                  <div className={cn('w-full', angle.mirror && '-scale-x-100')}>
                    <StudioCutoutSvg model={activeProduct.model} palette={activeVariant.palette} />
                  </div>
                </button>
              ))}
              {extraAnglesCount > 0 ? (
                <button
                  type="button"
                  aria-label={`View all ${activeProduct.angles.length} photos`}
                  onClick={() => setViewerIndex(3)}
                  className="flex h-10 w-10 items-center justify-center rounded-sm bg-stone-900 text-xs font-semibold text-white transition-transform hover:scale-105 dark:bg-white dark:text-stone-950"
                >
                  +{extraAnglesCount}
                </button>
              ) : null}
            </div>
          </div>

          {/* Center Column: Interactive 3D Floating Stage */}
          <div className="lg:col-span-6">
            <StudioStage3D
              model={activeProduct.model}
              variant={activeVariant}
              holdingZoom={holdingZoom}
              onHoldChange={setHoldingZoom}
            />
          </div>

          {/* Right Column: Size, Stock, Reviews, Price, Colour Swatches, Add to Cart (matches image.png!) */}
          <div className="space-y-6 lg:col-span-3">
            {/* Size Selector */}
            <div>
              <span className="block text-xs font-medium tracking-wider text-stone-500 uppercase dark:text-stone-400">
                {activeProduct.sizeLabelHeader}
              </span>
              <div
                role="group"
                aria-label={activeProduct.sizeLabelHeader}
                className="mt-3 flex flex-wrap gap-3"
              >
                {activeProduct.sizes.map((sizeObj) => {
                  const isSelected = sizeObj.label === selectedSizeLabel;
                  const soldOut = checkSizeSoldOut(sizeObj);
                  return (
                    <button
                      key={sizeObj.label}
                      type="button"
                      disabled={soldOut}
                      aria-pressed={isSelected}
                      aria-label={
                        soldOut ? `Size ${sizeObj.label}, sold out` : `Size ${sizeObj.label}`
                      }
                      onClick={() => setSelectedSizeLabel(sizeObj.label)}
                      className={cn(
                        'flex h-11 w-11 items-center justify-center rounded-full border text-xs font-semibold transition-all',
                        isSelected
                          ? 'border-stone-900 bg-stone-900 text-white dark:border-white dark:bg-white dark:text-stone-950'
                          : 'border-stone-800 text-stone-900 hover:scale-105 dark:border-stone-300 dark:text-stone-100',
                        soldOut &&
                          'cursor-not-allowed border-stone-400 opacity-35 dark:border-stone-600',
                      )}
                    >
                      {sizeObj.label}
                    </button>
                  );
                })}
              </div>

              {/* Stock Status Line */}
              <div
                aria-live="polite"
                className="mt-3 flex items-center gap-2 text-xs text-stone-600 dark:text-stone-400"
              >
                <span
                  className={cn(
                    'h-2 w-2 rounded-full',
                    isCurrentSoldOut
                      ? 'bg-stone-400'
                      : isLowStock
                        ? 'bg-amber-500'
                        : 'bg-emerald-500',
                  )}
                />
                <span className={cn(isLowStock && 'text-amber-700 dark:text-amber-400')}>
                  {stockLabel}
                </span>
              </div>
            </div>

            {/* Reviews Row */}
            <div className="flex items-center justify-between border-t border-stone-300/60 pt-4 dark:border-stone-800">
              <span className="text-xs font-medium tracking-wider text-stone-500 uppercase dark:text-stone-400">
                REVIEWS
              </span>
              <span className="inline-flex items-center gap-1.5">
                <StarRating value={activeSizeOption.rating} size="xs" />
                <span className="text-xs tabular-nums text-stone-500 dark:text-stone-400">
                  ({activeSizeOption.reviews})
                </span>
              </span>
            </div>

            {/* Price Row */}
            <div
              aria-live="polite"
              className="flex items-center justify-between border-t border-stone-300/60 pt-4 dark:border-stone-800"
            >
              <span className="text-xs font-medium tracking-wider text-stone-500 uppercase dark:text-stone-400">
                PRICE
              </span>
              <motion.span
                key={activeSizeOption.price}
                initial={{ y: -6, opacity: 0.4 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-lg font-bold tabular-nums text-stone-900 dark:text-white"
              >
                ${activeSizeOption.price}
              </motion.span>
            </div>

            {/* Colour Swatches */}
            <div className="border-t border-stone-300/60 pt-4 dark:border-stone-800">
              <span className="block text-xs font-medium tracking-wider text-stone-500 uppercase dark:text-stone-400">
                COLOUR
              </span>
              <div role="group" aria-label="Colour" className="mt-3 flex items-center gap-4">
                {activeProduct.variants.map((variant, idx) => {
                  const isActive = idx === activeVariantIndex;
                  return (
                    <button
                      key={variant.id}
                      type="button"
                      aria-label={variant.name}
                      aria-pressed={isActive}
                      onClick={() => selectVariant(idx)}
                      className={cn(
                        'h-8 w-8 rounded-full border border-stone-400 transition-transform hover:scale-110 dark:border-stone-600',
                        variant.swatchClass,
                        isActive &&
                          'ring-2 ring-stone-900 ring-offset-2 ring-offset-stone-100 dark:ring-white dark:ring-offset-stone-950',
                      )}
                    />
                  );
                })}
              </div>
            </div>

            {/* CTA Action Row: ADD TO CART + Heart Like Button (matches image.png!) */}
            <div className="relative flex items-center gap-5 pt-2">
              <button
                type="button"
                disabled={isCurrentSoldOut}
                onClick={handleAddToCart}
                aria-live="polite"
                className={cn(
                  'relative flex h-12 min-w-44 items-center justify-center px-6 text-xs font-semibold tracking-wider uppercase transition-all active:scale-96 disabled:cursor-not-allowed disabled:opacity-45',
                  cartState === 'done'
                    ? 'bg-emerald-700 text-white'
                    : 'bg-stone-900 text-white hover:bg-stone-800 dark:bg-white dark:text-stone-950 dark:hover:bg-stone-200',
                )}
              >
                {cartState === 'idle' ? (
                  <span>{isCurrentSoldOut ? 'SOLD OUT' : 'ADD TO CART'}</span>
                ) : null}
                {cartState === 'busy' ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {cartState === 'done' ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Check className="h-4 w-4" />
                    ADDED
                  </span>
                ) : null}
              </button>

              <button
                type="button"
                aria-pressed={liked}
                aria-label="Save to favourites"
                onClick={handleToggleLike}
                className="relative flex h-10 w-10 items-center justify-center rounded-full text-stone-800 transition-transform hover:scale-110 dark:text-stone-200"
              >
                <Heart
                  className={cn(
                    'h-5 w-5 transition-colors',
                    liked ? 'fill-rose-500 text-rose-500' : 'fill-none',
                  )}
                />
              </button>

              <AnimatePresence>
                {likePillText ? (
                  <motion.span
                    initial={{ opacity: 0, y: 6, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6 }}
                    role="status"
                    className="pointer-events-none absolute -top-9 right-0 rounded-full bg-stone-900 px-3 py-1 text-xs font-medium text-white shadow-md dark:bg-white dark:text-stone-950"
                  >
                    {liked ? <b className="text-rose-500">♥ </b> : null}
                    {likePillText}
                  </motion.span>
                ) : null}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Bottom Center Toast Pill (matches sneaker-product-hero!) */}
        <AnimatePresence>
          {toastNote ? (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              role="status"
              aria-live="polite"
              className="absolute bottom-4 left-1/2 z-20 flex -translate-x-1/2 items-center gap-2.5 rounded-full border border-stone-200 bg-white px-4 py-2 text-xs font-medium text-stone-900 shadow-lg dark:border-stone-800 dark:bg-stone-900 dark:text-stone-100"
            >
              <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
              <span>Shopping Cart Updated</span>
              <span className="text-stone-500 dark:text-stone-400">· {toastNote}</span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </section>

      {/* Campus Seller & Handover Info Strip */}
      <Card className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="emerald">
              <ShieldCheck className="h-3.5 w-3.5" />
              Verified Campus Listing
            </Badge>
            <span className="text-xs font-medium text-zinc-600 dark:text-zinc-400">
              Listed by {activeProduct.sellerName}
            </span>
          </div>
          <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
            {activeProduct.conditionNote}
          </p>
          <p className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
            <MapPin className="h-3.5 w-3.5" />
            Campus Pickup Location: {activeProduct.campusHall}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <Link
            to="/messages"
            className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2 text-xs font-semibold text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
          >
            <MessageSquare className="h-4 w-4" />
            Message Student Seller
          </Link>
          <Link
            to="/orders"
            className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
          >
            Schedule Hall Pickup
          </Link>
        </div>
      </Card>

      {/* Fullscreen Lightbox Gallery Modal */}
      {viewerIndex !== null ? (
        <ShowcaseGalleryModal
          title={activeProduct.title}
          model={activeProduct.model}
          variant={activeVariant}
          angles={activeProduct.angles}
          activeIndex={viewerIndex}
          zoomed={viewerZoomed}
          onToggleZoom={() => setViewerZoomed((z) => !z)}
          onSelectIndex={(idx) => {
            setViewerZoomed(false);
            setViewerIndex(idx);
          }}
          onStep={stepViewer}
          onClose={() => {
            setViewerIndex(null);
            setViewerZoomed(false);
          }}
        />
      ) : null}
    </div>
  );
}
