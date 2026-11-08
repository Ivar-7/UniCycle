import { AnimatePresence, motion, useMotionValue, useSpring } from 'motion/react';
import type { PointerEvent } from 'react';
import { StudioCutoutSvg, type CutoutModelType } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';
import type { ShowcaseVariant } from '../api/showcase.types';

export interface StudioStage3DProps {
  readonly model: CutoutModelType;
  readonly variant: ShowcaseVariant;
  readonly holdingZoom: boolean;
  readonly onHoldChange: (holding: boolean) => void;
}

export function StudioStage3D({ model, variant, holdingZoom, onHoldChange }: StudioStage3DProps) {
  const rawRotateX = useMotionValue(0);
  const rawRotateY = useMotionValue(0);
  const rawShadowX = useMotionValue(0);

  const rotateX = useSpring(rawRotateX, { stiffness: 150, damping: 20 });
  const rotateY = useSpring(rawRotateY, { stiffness: 150, damping: 20 });
  const shadowX = useSpring(rawShadowX, { stiffness: 120, damping: 22 });

  const handlePointerMove = (e: PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;
    const ny = ((e.clientY - rect.top) / rect.height) * 2 - 1;
    rawRotateY.set(nx * 14);
    rawRotateX.set(-ny * 9);
    rawShadowX.set(-nx * 18);
  };

  const handlePointerLeave = () => {
    rawRotateX.set(0);
    rawRotateY.set(0);
    rawShadowX.set(0);
    onHoldChange(false);
  };

  return (
    <div
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      onPointerDown={() => onHoldChange(true)}
      onPointerUp={() => onHoldChange(false)}
      onPointerCancel={() => onHoldChange(false)}
      className="relative flex min-h-80 w-full cursor-zoom-in flex-col items-center justify-center select-none sm:min-h-96"
    >
      {/* Giant Background Watermark Typography (CLOUD / ONYX / COBALT like image.png) */}
      <div className="pointer-events-none absolute inset-x-0 top-2 flex justify-center overflow-hidden sm:top-0">
        <AnimatePresence mode="wait">
          <motion.span
            key={variant.id}
            initial={{ y: 48, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -48, opacity: 0 }}
            transition={{ duration: 0.45, ease: 'easeOut' }}
            className={cn(
              'text-7xl leading-none font-black tracking-tighter uppercase sm:text-8xl xl:text-9xl',
              variant.watermarkClass,
            )}
          >
            {variant.name}
          </motion.span>
        </AnimatePresence>
      </div>

      {/* 3D Tilt & Floating Cutout Container */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`${model}-${variant.id}`}
          initial={{ y: 70, opacity: 0, rotate: 6 }}
          animate={{
            y: 0,
            opacity: 1,
            rotate: 0,
            scale: holdingZoom ? 1.28 : 1,
          }}
          exit={{ y: -70, opacity: 0, rotate: -6 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          style={{
            rotateX,
            rotateY,
            transformPerspective: 1100,
          }}
          className="relative z-10 flex w-full max-w-xl flex-col items-center"
        >
          {/* Floating Main Cutout */}
          <motion.div
            animate={{ y: [-6, 6, -6] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
            className="w-full px-2 drop-shadow-2xl"
          >
            <StudioCutoutSvg model={model} palette={variant.palette} />
          </motion.div>

          {/* Dynamic Floor Shadow Oval */}
          <motion.div
            style={{ x: shadowX }}
            animate={{ scaleX: [0.92, 1.04, 0.92], opacity: [0.35, 0.5, 0.35] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
            className=" -mt-3 h-5 w-3/4 rounded-full bg-black/35 blur-md dark:bg-black/60"
          />

          {/* Inverted Glossy Floor Reflection (matches image.png!) */}
          <motion.div
            animate={{ y: [4, -4, 4] }}
            transition={{ duration: 3.6, repeat: Infinity, ease: 'easeInOut' }}
            aria-hidden="true"
            className="pointer-events-none -mt-6 h-24 w-full -scale-y-100 overflow-hidden opacity-20 blur-xs"
          >
            <StudioCutoutSvg model={model} palette={variant.palette} />
          </motion.div>
        </motion.div>
      </AnimatePresence>

      {/* Bottom-left HOLD TO ZOOM hint (matches image.png!) */}
      <div className="pointer-events-none absolute bottom-1 left-2 flex items-center gap-2 text-xs tracking-widest text-stone-500 uppercase dark:text-stone-400">
        <span>{holdingZoom ? 'ZOOMED 1.3X · MOVE TO TILT' : 'HOLD TO ZOOM'}</span>
      </div>
    </div>
  );
}
