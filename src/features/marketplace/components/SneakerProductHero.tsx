import { ArrowUpRight, Check, ChevronLeft, ChevronRight, Heart, Maximize2, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { logDiagnosticError } from '@/shared/errors';
import { usePreferences } from '@/shared/hooks/usePreferences';
import { useSavedItems } from '@/shared/hooks/useSavedItems';
import { StarRating } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';

type VariantId = 'onyx' | 'cloud' | 'cobalt';

interface HeroSneakerAngle {
  readonly id: string;
  readonly label: string;
  readonly src: string;
  readonly mirror?: boolean;
  readonly detailClass?: string;
}

interface HeroSneakerVariant {
  readonly id: VariantId;
  readonly name: string;
  readonly swatchClass: string;
  readonly surfaceClass: string;
  readonly watermarkClass: string;
  readonly angles: readonly HeroSneakerAngle[];
  readonly soldOutSizes: readonly string[];
  readonly lowStockSizes: Readonly<Record<string, number>>;
}

interface HeroSizeOption {
  readonly label: string;
  readonly price: number;
  readonly rating: number;
  readonly reviews: number;
}

const SIZES: readonly HeroSizeOption[] = [
  { label: '36', price: 240, rating: 4.2, reviews: 86 },
  { label: '37', price: 250, rating: 4.6, reviews: 142 },
  { label: '38', price: 255, rating: 4.5, reviews: 94 },
  { label: '39', price: 265, rating: 4.8, reviews: 59 },
];

function buildVariantAngles(sideSrc: string, frontSrc: string): readonly HeroSneakerAngle[] {
  return [
    { id: 'side', label: 'Side', src: sideSrc },
    { id: 'front', label: 'Front three-quarter', src: frontSrc },
    { id: 'inside', label: 'Inside', src: sideSrc, mirror: true },
    { id: 'heel', label: 'Heel', src: sideSrc, detailClass: 'scale-150 origin-right' },
    { id: 'laces', label: 'Laces', src: frontSrc, detailClass: 'scale-150 origin-top' },
  ];
}

const HERO_VARIANTS: readonly HeroSneakerVariant[] = [
  {
    id: 'onyx',
    name: 'ONYX',
    swatchClass: 'bg-zinc-900 border border-zinc-400/60 dark:border-zinc-500/80',
    surfaceClass:
      'border-zinc-200/90 bg-radial from-zinc-200/70 via-stone-100 to-zinc-100 text-zinc-900 dark:border-zinc-800 dark:from-zinc-800/80 dark:via-zinc-900 dark:to-zinc-950 dark:text-zinc-100',
    watermarkClass: 'text-zinc-900/10 dark:text-zinc-400/15',
    angles: buildVariantAngles('/images/hero/onyx-side.webp', '/images/hero/onyx-front.webp'),
    soldOutSizes: ['38'],
    lowStockSizes: { '39': 2 },
  },
  {
    id: 'cloud',
    name: 'CLOUD',
    swatchClass: 'bg-stone-200 border border-zinc-400/60 dark:border-zinc-500/70',
    surfaceClass:
      'border-stone-200/90 bg-radial from-stone-200/75 via-stone-100 to-white text-zinc-900 dark:border-zinc-800 dark:from-stone-800/55 dark:via-zinc-900 dark:to-zinc-950 dark:text-stone-100',
    watermarkClass: 'text-stone-400/40 dark:text-stone-400/15',
    angles: buildVariantAngles('/images/hero/cloud-side.webp', '/images/hero/cloud-front.webp'),
    soldOutSizes: ['38'],
    lowStockSizes: { '37': 3 },
  },
  {
    id: 'cobalt',
    name: 'COBALT',
    swatchClass: 'bg-indigo-700 border border-indigo-400/40 dark:border-indigo-400/50',
    surfaceClass:
      'border-zinc-200/90 bg-radial from-slate-200/75 via-stone-100 to-slate-100 text-zinc-900 dark:border-zinc-800 dark:from-slate-800/60 dark:via-zinc-900 dark:to-zinc-950 dark:text-zinc-100',
    watermarkClass: 'text-slate-400/40 dark:text-slate-400/18',
    angles: buildVariantAngles('/images/hero/cobalt-side.webp', '/images/hero/cobalt-front.webp'),
    soldOutSizes: ['36', '38'],
    lowStockSizes: { '37': 3 },
  },
];

function useAnimatedInteger(target: number): number {
  const [displayed, setDisplayed] = useState<number>(target);
  const currentRef = useRef<number>(target);

  useEffect(() => {
    const startVal = currentRef.current;
    if (startVal === target) {
      return;
    }
    const startTime = performance.now();
    const duration = 260;
    let rafId = 0;

    const tick = (now: number) => {
      const progress = Math.min(1, (now - startTime) / duration);
      const eased = 1 - (1 - progress) ** 3;
      const next = Math.round(startVal + (target - startVal) * eased);
      currentRef.current = next;
      setDisplayed(next);
      if (progress < 1) {
        rafId = requestAnimationFrame(tick);
      }
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, [target]);

  return displayed;
}

export function SneakerProductHero() {
  const { formatPrice } = usePreferences();
  const { isSaved, saveItem, toggleItem } = useSavedItems();

  const [variantIndex, setVariantIndex] = useState<number>(1);
  const [selectedSizeLabel, setSelectedSizeLabel] = useState<string>('36');
  const [activeAngleIndex, setActiveAngleIndex] = useState<number>(0);
  const [tilt, setTilt] = useState<{ readonly rx: number; readonly ry: number }>({
    rx: 0,
    ry: 0,
  });
  const [zoomOrigin, setZoomOrigin] = useState<{ readonly x: number; readonly y: number }>({
    x: 50,
    y: 50,
  });
  const [holdingZoom, setHoldingZoom] = useState<boolean>(false);
  const [galleryOpenIndex, setGalleryOpenIndex] = useState<number | null>(null);
  const [addedState, setAddedState] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const stageRef = useRef<HTMLDivElement | null>(null);
  const addedTimerRef = useRef<number | null>(null);
  const toastTimerRef = useRef<number | null>(null);

  const activeVariant = HERO_VARIANTS[variantIndex] ?? HERO_VARIANTS[1]!;
  const activeSize = SIZES.find((s) => s.label === selectedSizeLabel) ?? SIZES[0]!;
  const activeAngle = activeVariant.angles[activeAngleIndex] ?? activeVariant.angles[0]!;

  const animatedPrice = useAnimatedInteger(activeSize.price);
  const animatedReviews = useAnimatedInteger(activeSize.reviews);
  const liked = isSaved('volt-runners');

  useEffect(() => {
    return () => {
      if (addedTimerRef.current !== null) {
        window.clearTimeout(addedTimerRef.current);
      }
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (galleryOpenIndex === null) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setGalleryOpenIndex(null);
      } else if (e.key === 'ArrowRight') {
        setGalleryOpenIndex((prev) =>
          prev === null ? null : (prev + 1) % activeVariant.angles.length,
        );
      } else if (e.key === 'ArrowLeft') {
        setGalleryOpenIndex((prev) =>
          prev === null
            ? null
            : (prev - 1 + activeVariant.angles.length) % activeVariant.angles.length,
        );
      }
    };
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [galleryOpenIndex, activeVariant.angles.length]);

  const handleSelectVariant = (nextIndex: number) => {
    const nextVariant = HERO_VARIANTS[nextIndex];
    if (!nextVariant) {
      return;
    }
    setVariantIndex(nextIndex);
    setActiveAngleIndex(0);
    if (nextVariant.soldOutSizes.includes(selectedSizeLabel)) {
      const firstAvailable = SIZES.find((s) => !nextVariant.soldOutSizes.includes(s.label));
      if (firstAvailable) {
        setSelectedSizeLabel(firstAvailable.label);
      }
    }
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = stageRef.current?.getBoundingClientRect();
    if (!rect) {
      return;
    }
    const px = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width));
    const py = Math.max(0, Math.min(1, (e.clientY - rect.top) / rect.height));
    setTilt({
      rx: (0.5 - py) * 14,
      ry: (px - 0.5) * 18,
    });
    setZoomOrigin({ x: Math.round(px * 100), y: Math.round(py * 100) });
  };

  const handlePointerLeave = () => {
    setHoldingZoom(false);
    setTilt({ rx: 0, ry: 0 });
  };

  const handleAddToBag = async () => {
    try {
      await saveItem({
        listingId: 'volt-runners',
        title: `Kestrel Vapor Pace 3 (${activeVariant.name} · Size ${activeSize.label})`,
        price: activeSize.price,
        campusLocation: 'Eastgate Courts · Block A',
        sellerName: 'Elena · Postgrad Design',
        inStock: true,
      });
      setAddedState(true);
      setToastMessage(`Saved Bag Updated · ${activeVariant.name} · size ${activeSize.label}`);
      if (addedTimerRef.current !== null) {
        window.clearTimeout(addedTimerRef.current);
      }
      if (toastTimerRef.current !== null) {
        window.clearTimeout(toastTimerRef.current);
      }
      addedTimerRef.current = window.setTimeout(() => setAddedState(false), 1800);
      toastTimerRef.current = window.setTimeout(() => setToastMessage(null), 2600);
    } catch (err: unknown) {
      logDiagnosticError(err, 'SneakerProductHero:handleAddToBag');
    }
  };

  const handleToggleHeart = async () => {
    try {
      await toggleItem({
        listingId: 'volt-runners',
        title: 'Kestrel Vapor Pace 3',
        price: activeSize.price,
        campusLocation: 'Eastgate Courts · Block A',
        sellerName: 'Elena · Postgrad Design',
        inStock: true,
      });
    } catch (err: unknown) {
      logDiagnosticError(err, 'SneakerProductHero:handleToggleHeart');
    }
  };

  const lowStockCount = activeVariant.lowStockSizes[activeSize.label];
  const isSoldOut = activeVariant.soldOutSizes.includes(activeSize.label);

  return (
    <section
      aria-label="Featured Campus Product — Kestrel Vapor Pace 3"
      className={cn(
        'relative overflow-hidden rounded-3xl border px-6 py-8 shadow-sm transition-colors duration-500 sm:px-10 sm:py-12 xl:px-14 xl:py-14',
        activeVariant.surfaceClass,
      )}
    >
      <div className="grid items-center gap-8 lg:grid-cols-12 lg:gap-6 xl:gap-10">
        {/* Left Editorial Column + Cutout Thumbnails */}
        <div className="order-2 flex min-w-0 flex-col justify-between space-y-6 lg:order-1 lg:col-span-3 lg:self-stretch">
          <div className="space-y-3">
            <p className="text-sm font-medium text-zinc-600 dark:text-zinc-400">
              Women&apos;s Racing Shoe
            </p>
            <h1 className="text-3xl leading-tight font-bold tracking-tight text-zinc-900 sm:text-4xl dark:text-zinc-50">
              <span className="block">Kestrel</span>
              <span className="block">Vapor Pace 3</span>
            </h1>
            <p className="text-sm leading-relaxed italic text-zinc-600 dark:text-zinc-300">
              The Vapor Pace 3 pairs a springy foam core with a featherweight knit, so it gives back
              on race day and still feels kind on an easy Tuesday jog.
            </p>
            <Link
              to="/item/volt-runners"
              className="inline-flex items-center gap-1 pt-1 text-xs font-medium text-zinc-700 underline decoration-zinc-400/70 underline-offset-4 hover:text-zinc-900 hover:decoration-zinc-900 dark:text-zinc-300 dark:decoration-zinc-600 dark:hover:text-zinc-100 dark:hover:decoration-zinc-100"
            >
              <span>Eastgate Courts · View Listing &amp; Buy</span>
              <ArrowUpRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* 3 Mini Cutout Angle Previews + "+2" Gallery Button */}
          <div className="flex flex-wrap items-center gap-2 pt-2">
            {activeVariant.angles.slice(0, 3).map((angle, idx) => {
              const isSelected = activeAngleIndex === idx;
              return (
                <button
                  key={angle.id}
                  type="button"
                  aria-label={`Preview ${angle.label} angle`}
                  aria-pressed={isSelected}
                  onClick={() => setActiveAngleIndex(idx)}
                  className={cn(
                    'flex h-11 w-14 items-center justify-center rounded-xl p-1 transition-all',
                    isSelected
                      ? 'bg-white/85 ring-2 ring-zinc-900/60 dark:bg-white/10 dark:ring-zinc-100/60'
                      : 'opacity-70 hover:bg-white/50 hover:opacity-100 dark:hover:bg-white/5',
                  )}
                >
                  <img
                    src={angle.src}
                    alt={angle.label}
                    className={cn('h-full w-full object-contain', angle.mirror && '-scale-x-100')}
                  />
                </button>
              );
            })}
            <button
              type="button"
              aria-label="View all 5 photos"
              onClick={() => setGalleryOpenIndex(0)}
              className="flex h-11 w-11 items-center justify-center rounded-xl border border-zinc-300/80 bg-white/85 text-xs font-bold text-zinc-800 shadow-xs transition-all hover:border-zinc-900 hover:text-zinc-950 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:border-zinc-300 dark:hover:text-white"
            >
              +2
            </button>
          </div>
        </div>

        {/* Center Floating Sneaker Stage with Glossy Reflection & Hold-to-Zoom */}
        <div className="order-1 min-w-0 lg:order-2 lg:col-span-6">
          <div
            ref={stageRef}
            onPointerMove={handlePointerMove}
            onPointerDown={() => setHoldingZoom(true)}
            onPointerUp={() => setHoldingZoom(false)}
            onPointerCancel={() => setHoldingZoom(false)}
            onPointerLeave={handlePointerLeave}
            className="relative flex h-72 cursor-zoom-in flex-col items-center justify-center overflow-hidden rounded-2xl select-none sm:h-88 xl:h-104"
          >
            {/* Large Tinted Variant Watermark */}
            <span
              aria-hidden="true"
              className={cn(
                'pointer-events-none absolute top-4 inset-x-0 text-center text-6xl font-black tracking-tighter uppercase transition-colors duration-500 sm:text-8xl xl:text-9xl',
                activeVariant.watermarkClass,
              )}
            >
              {activeVariant.name}
            </span>

            {/* Floating Interactive 3D-Tilt Shoe + Mirror Reflection */}
            <div
              style={{
                transform: `perspective(1000px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg)`,
                transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
              }}
              className={cn(
                'relative z-10 flex w-full max-w-lg flex-col items-center justify-center px-4 transition-transform ease-out',
                holdingZoom ? 'scale-150 duration-200' : 'scale-100 duration-150',
              )}
            >
              <motion.img
                key={`${activeVariant.id}-${activeAngle.id}`}
                src={activeAngle.src}
                alt={`Kestrel Vapor Pace 3 in ${activeVariant.name} — ${activeAngle.label}`}
                draggable={false}
                animate={{ y: holdingZoom ? 0 : [-4, 4, -4] }}
                transition={{ duration: 4.2, repeat: Infinity, ease: 'easeInOut' }}
                className={cn(
                  'relative z-10 h-44 w-full object-contain drop-shadow-xl sm:h-56 xl:h-64',
                  activeAngle.mirror && '-scale-x-100',
                )}
              />

              {/* Glossy Floor Mirror Reflection */}
              <img
                src={activeAngle.src}
                alt=""
                aria-hidden="true"
                draggable={false}
                style={{
                  maskImage: 'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.45) 100%)',
                  WebkitMaskImage:
                    'linear-gradient(to bottom, transparent 40%, rgba(0,0,0,0.45) 100%)',
                }}
                className={cn(
                  'pointer-events-none -mt-6 h-24 w-full -scale-y-100 object-contain opacity-30 blur-xs transition-opacity duration-200 sm:-mt-8 sm:h-28',
                  activeAngle.mirror && '-scale-x-100',
                  holdingZoom && 'opacity-0',
                )}
              />
            </div>

            {/* Bottom Controls Hint */}
            <div className="pointer-events-none absolute bottom-2 left-2 z-20 flex items-center gap-2 text-xs font-medium tracking-widest uppercase text-zinc-500 dark:text-zinc-400">
              <span>{holdingZoom ? 'Zoomed · Release' : 'Hold to zoom'}</span>
            </div>

            <button
              type="button"
              aria-label="Open photo gallery"
              onPointerDown={(e) => e.stopPropagation()}
              onClick={() => setGalleryOpenIndex(activeAngleIndex)}
              className="absolute right-2 bottom-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/80 text-zinc-700 shadow-xs backdrop-blur-xs transition-transform hover:scale-105 dark:bg-zinc-900/75 dark:text-zinc-300"
            >
              <Maximize2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>

        {/* Right Purchase / Specs Configurator Column */}
        <div className="order-3 min-w-0 space-y-5 lg:col-span-3">
          {/* Size Picker */}
          <div className="space-y-3">
            <span className="block text-xs font-medium tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
              Size
            </span>
            <div role="group" aria-label="Shoe sizes" className="flex flex-wrap gap-2.5">
              {SIZES.map((size) => {
                const isSelected = size.label === activeSize.label;
                const soldOut = activeVariant.soldOutSizes.includes(size.label);
                return (
                  <button
                    key={size.label}
                    type="button"
                    disabled={soldOut}
                    aria-pressed={isSelected}
                    aria-label={soldOut ? `Size ${size.label}, sold out` : `Size ${size.label}`}
                    onClick={() => setSelectedSizeLabel(size.label)}
                    className={cn(
                      'flex h-11 w-11 items-center justify-center rounded-full border text-xs font-semibold transition-all',
                      isSelected
                        ? 'border-zinc-400 bg-zinc-200/80 text-zinc-900 shadow-xs dark:border-zinc-500 dark:bg-zinc-700 dark:text-zinc-100'
                        : 'border-zinc-300 bg-white/70 text-zinc-700 hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-900/50 dark:text-zinc-300 dark:hover:border-zinc-500',
                      soldOut && 'cursor-not-allowed line-through opacity-45',
                    )}
                  >
                    {size.label}
                  </button>
                );
              })}
            </div>

            <p
              aria-live="polite"
              className="flex items-center gap-2 text-xs text-zinc-600 dark:text-zinc-400"
            >
              <span
                className={cn(
                  'h-2 w-2 shrink-0 rounded-full',
                  isSoldOut
                    ? 'bg-zinc-400'
                    : lowStockCount
                      ? 'bg-amber-500'
                      : 'bg-zinc-500 dark:bg-zinc-400',
                )}
              />
              <span>
                {isSoldOut
                  ? 'Sold out in this colour'
                  : lowStockCount
                    ? `Only ${lowStockCount} left in size ${activeSize.label}`
                    : 'In stock · ready for campus pickup'}
              </span>
            </p>
          </div>

          {/* Reviews Row */}
          <div className="flex items-center justify-between border-t border-zinc-300/60 pt-4 dark:border-zinc-800">
            <span className="text-xs font-medium tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
              Reviews
            </span>
            <div className="flex items-center gap-2">
              <StarRating value={activeSize.rating} />
              <span className="text-xs font-medium tabular-nums text-zinc-600 dark:text-zinc-400">
                ({animatedReviews})
              </span>
            </div>
          </div>

          {/* Price Row */}
          <div className="flex items-baseline justify-between border-t border-zinc-300/60 pt-4 dark:border-zinc-800">
            <span className="text-xs font-medium tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
              Price
            </span>
            <span className="text-2xl font-bold tabular-nums text-zinc-900 dark:text-white">
              {formatPrice(animatedPrice)}
            </span>
          </div>

          {/* Colour Swatches */}
          <div className="space-y-3 border-t border-zinc-300/60 pt-4 dark:border-zinc-800">
            <span className="block text-xs font-medium tracking-wider text-zinc-600 uppercase dark:text-zinc-400">
              Colour
            </span>
            <div role="group" aria-label="Colour options" className="flex items-center gap-3">
              {HERO_VARIANTS.map((variant, idx) => {
                const isSelected = idx === variantIndex;
                return (
                  <button
                    key={variant.id}
                    type="button"
                    aria-label={variant.name}
                    aria-pressed={isSelected}
                    onClick={() => handleSelectVariant(idx)}
                    className={cn(
                      'h-8 w-8 rounded-full transition-transform hover:scale-110',
                      variant.swatchClass,
                      isSelected &&
                        'ring-2 ring-zinc-500 ring-offset-2 ring-offset-stone-100 dark:ring-zinc-400 dark:ring-offset-zinc-900',
                    )}
                  />
                );
              })}
            </div>
          </div>

          {/* Add to Bag & Like Burst Button */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              disabled={isSoldOut}
              onClick={() => void handleAddToBag()}
              className={cn(
                'flex h-12 flex-1 items-center justify-center gap-2 rounded-lg border text-xs font-bold tracking-widest uppercase shadow-2xs transition-all disabled:cursor-not-allowed disabled:opacity-40',
                addedState
                  ? 'border-zinc-400 bg-zinc-300 text-zinc-900 dark:border-zinc-500 dark:bg-zinc-700 dark:text-zinc-100'
                  : 'border-zinc-300 bg-zinc-200/85 text-zinc-900 hover:bg-zinc-300/85 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700',
              )}
            >
              {addedState ? (
                <>
                  <Check className="h-4 w-4" />
                  <span>Added</span>
                </>
              ) : (
                <span>Add to Bag</span>
              )}
            </button>

            <motion.button
              type="button"
              whileTap={{ scale: 0.85 }}
              aria-label={liked ? 'Remove from saved' : 'Save to favourites'}
              aria-pressed={liked}
              onClick={() => void handleToggleHeart()}
              className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg border border-zinc-400/60 bg-transparent text-zinc-800 transition-colors hover:border-zinc-900 dark:border-zinc-700 dark:text-zinc-200 dark:hover:border-zinc-400"
            >
              <Heart
                className={cn(
                  'h-4 w-4 transition-colors',
                  liked ? 'fill-rose-500 text-rose-500' : 'fill-none',
                )}
              />
            </motion.button>
          </div>
        </div>
      </div>

      {/* Bottom Floating Notification Toast */}
      {toastMessage ? (
        <div
          role="status"
          className="mt-4 flex items-center justify-center sm:absolute sm:bottom-4 sm:left-1/2 sm:mt-0 sm:-translate-x-1/2"
        >
          <div className="inline-flex items-center gap-3 rounded-full border border-zinc-200 bg-white px-4 py-1.5 text-xs font-medium text-zinc-900 shadow-lg dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
            <span className="h-2 w-2 rounded-full bg-zinc-900 dark:bg-zinc-100" />
            <span>{toastMessage}</span>
            <Link
              to="/wishlist"
              className="font-semibold text-zinc-900 underline-offset-4 hover:underline dark:text-zinc-100"
            >
              View Bag
            </Link>
          </div>
        </div>
      ) : null}

      {/* Full 5-Photo Lightbox Modal (Matching 21st.dev Light & Dark) */}
      {galleryOpenIndex !== null ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Kestrel Vapor Pace 3 photos"
          onClick={() => setGalleryOpenIndex(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-3 backdrop-blur-md sm:p-6 dark:bg-black/75"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex max-h-dvh w-full max-w-4xl flex-col gap-4 overflow-y-auto rounded-2xl border border-zinc-200 bg-white p-4 text-zinc-900 shadow-2xl sm:p-6 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-baseline gap-3">
                <span className="text-sm font-semibold text-zinc-900 dark:text-white">
                  {(activeVariant.angles[galleryOpenIndex] ?? activeVariant.angles[0]!).label}
                </span>
                <span className="text-xs tabular-nums text-zinc-500 dark:text-zinc-400">
                  {galleryOpenIndex + 1} / {activeVariant.angles.length}
                </span>
              </div>
              <button
                type="button"
                aria-label="Close gallery"
                onClick={() => setGalleryOpenIndex(null)}
                className="flex h-9 w-9 items-center justify-center rounded-full border border-zinc-200 bg-zinc-100 text-zinc-700 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="relative flex aspect-4/3 w-full items-center justify-center overflow-hidden rounded-xl bg-stone-100 sm:aspect-16/10 dark:bg-zinc-900">
              {(() => {
                const view = activeVariant.angles[galleryOpenIndex] ?? activeVariant.angles[0]!;
                return (
                  <img
                    src={view.src}
                    alt={`Kestrel Vapor Pace 3 — ${view.label}`}
                    className={cn(
                      'h-4/5 w-4/5 object-contain transition-transform duration-300',
                      view.mirror && '-scale-x-100',
                      view.detailClass,
                    )}
                  />
                );
              })()}

              <button
                type="button"
                aria-label="Previous photo"
                onClick={() =>
                  setGalleryOpenIndex(
                    (galleryOpenIndex - 1 + activeVariant.angles.length) %
                      activeVariant.angles.length,
                  )
                }
                className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-900 shadow-sm hover:bg-white dark:border-zinc-700 dark:bg-zinc-950/90 dark:text-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <button
                type="button"
                aria-label="Next photo"
                onClick={() =>
                  setGalleryOpenIndex((galleryOpenIndex + 1) % activeVariant.angles.length)
                }
                className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-zinc-200 bg-white/90 text-zinc-900 shadow-sm hover:bg-white dark:border-zinc-700 dark:bg-zinc-950/90 dark:text-white"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>

            {/* 5 Angle Thumbnails */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              {activeVariant.angles.map((angle, idx) => {
                const isCurrent = idx === galleryOpenIndex;
                return (
                  <button
                    key={angle.id}
                    type="button"
                    aria-label={angle.label}
                    aria-current={isCurrent}
                    onClick={() => setGalleryOpenIndex(idx)}
                    className={cn(
                      'flex h-14 w-20 items-center justify-center overflow-hidden rounded-xl border bg-stone-100 p-1.5 transition-all dark:bg-zinc-900',
                      isCurrent
                        ? 'border-zinc-900 ring-2 ring-zinc-900/20 dark:border-white dark:ring-white/25'
                        : 'border-zinc-200 opacity-70 hover:opacity-100 dark:border-zinc-800',
                    )}
                  >
                    <img
                      src={angle.src}
                      alt={angle.label}
                      className={cn(
                        'h-full w-full object-contain',
                        angle.mirror && '-scale-x-100',
                        angle.detailClass,
                      )}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
