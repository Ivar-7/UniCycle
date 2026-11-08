import { ChevronLeft, ChevronRight, X, ZoomIn, ZoomOut } from 'lucide-react';
import { motion } from 'motion/react';
import { useEffect } from 'react';
import { StudioCutoutSvg, type CutoutModelType } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';
import type { ShowcaseAngleView, ShowcaseVariant } from '../api/showcase.types';

export interface ShowcaseGalleryModalProps {
  readonly title: string;
  readonly model: CutoutModelType;
  readonly variant: ShowcaseVariant;
  readonly angles: readonly ShowcaseAngleView[];
  readonly activeIndex: number;
  readonly zoomed: boolean;
  readonly onToggleZoom: () => void;
  readonly onSelectIndex: (index: number) => void;
  readonly onStep: (delta: number) => void;
  readonly onClose: () => void;
}

export function ShowcaseGalleryModal({
  title,
  model,
  variant,
  angles,
  activeIndex,
  zoomed,
  onToggleZoom,
  onSelectIndex,
  onStep,
  onClose,
}: ShowcaseGalleryModalProps) {
  const currentAngle = angles[activeIndex] ?? angles[0]!;

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight') {
        onStep(1);
      } else if (e.key === 'ArrowLeft') {
        onStep(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose, onStep]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${title} angle gallery`}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 p-4 backdrop-blur-md sm:p-8"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="flex w-full max-w-4xl flex-col gap-4 rounded-2xl border border-stone-700 bg-stone-950 p-5 text-stone-100 shadow-2xl"
      >
        {/* Top Bar */}
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-3">
            <strong className="font-semibold text-white">{currentAngle.label}</strong>
            <span className="tabular-nums text-stone-400">
              {activeIndex + 1} / {angles.length}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onToggleZoom}
              aria-label={zoomed ? 'Zoom out' : 'Zoom in'}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-700 bg-stone-900 text-stone-200 transition-transform hover:scale-105"
            >
              {zoomed ? <ZoomOut className="h-4 w-4" /> : <ZoomIn className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={onClose}
              aria-label="Close photos"
              className="flex h-9 w-9 items-center justify-center rounded-full border border-stone-700 bg-stone-900 text-stone-200 transition-transform hover:scale-105"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Main Viewport */}
        <div
          onClick={onToggleZoom}
          className={cn(
            'relative flex h-80 w-full cursor-zoom-in items-center justify-center overflow-hidden rounded-xl bg-radial p-8 sm:h-96',
            variant.stageRadialDarkClass,
          )}
        >
          <div
            className={cn(
              'w-full max-w-lg transition-transform duration-300',
              currentAngle.mirror && '-scale-x-100',
              zoomed ? 'scale-150' : currentAngle.scaleClass,
            )}
          >
            <StudioCutoutSvg model={model} palette={variant.palette} />
          </div>

          <button
            type="button"
            aria-label="Previous photo"
            onClick={(e) => {
              e.stopPropagation();
              onStep(-1);
            }}
            className="absolute top-1/2 left-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone-700 bg-stone-900/90 text-white transition-transform hover:scale-105"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <button
            type="button"
            aria-label="Next photo"
            onClick={(e) => {
              e.stopPropagation();
              onStep(1);
            }}
            className="absolute top-1/2 right-3 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-stone-700 bg-stone-900/90 text-white transition-transform hover:scale-105"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>

        {/* Bottom Angle Rail */}
        <div className="flex items-center gap-2.5 overflow-x-auto py-1">
          {angles.map((angle, idx) => {
            const isCurrent = idx === activeIndex;
            return (
              <button
                key={angle.id}
                type="button"
                aria-label={`Show ${angle.label}`}
                aria-current={isCurrent}
                onClick={() => onSelectIndex(idx)}
                className={cn(
                  'flex h-14 w-24 shrink-0 items-center justify-center rounded-lg border p-2 transition-opacity',
                  isCurrent
                    ? 'border-white bg-stone-800 opacity-100'
                    : 'border-stone-800 bg-stone-900 opacity-55 hover:opacity-85',
                )}
              >
                <div className={cn('w-full', angle.mirror && '-scale-x-100')}>
                  <StudioCutoutSvg model={model} palette={variant.palette} />
                </div>
              </button>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
}
