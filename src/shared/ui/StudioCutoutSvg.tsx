import { useId } from 'react';
import { cn } from '@/shared/utils/cn';

export type CutoutModelType =
  | 'sneaker'
  | 'headphones'
  | 'lamp'
  | 'kettle'
  | 'chair'
  | 'camera'
  | 'backpack'
  | 'watch'
  | 'bottle'
  | 'sunglasses'
  | 'cookware'
  | 'cap';

export type CutoutPalette = 'cloud' | 'onyx' | 'cobalt' | 'olive' | 'sand';

export interface StudioCutoutSvgProps {
  readonly model: CutoutModelType;
  readonly palette: CutoutPalette;
  readonly className?: string;
}

interface PaletteColors {
  readonly upperStart: string;
  readonly upperEnd: string;
  readonly knitAccent: string;
  readonly stripeStart: string;
  readonly stripeMid: string;
  readonly stripeEnd: string;
  readonly soleMain: string;
  readonly soleShadow: string;
  readonly trim: string;
}

const PALETTES: Record<CutoutPalette, PaletteColors> = {
  cloud: {
    upperStart: '#ffffff',
    upperEnd: '#e6e4e0',
    knitAccent: '#d4d1cb',
    stripeStart: '#f97316',
    stripeMid: '#fb7185',
    stripeEnd: '#c026d3',
    soleMain: '#fafaf9',
    soleShadow: '#d6d3d1',
    trim: '#18181b',
  },
  onyx: {
    upperStart: '#3f3f46',
    upperEnd: '#18181b',
    knitAccent: '#52525b',
    stripeStart: '#f59e0b',
    stripeMid: '#ef4444',
    stripeEnd: '#ec4899',
    soleMain: '#27272a',
    soleShadow: '#09090b',
    trim: '#fafafa',
  },
  cobalt: {
    upperStart: '#6366f1',
    upperEnd: '#312e81',
    knitAccent: '#818cf8',
    stripeStart: '#38bdf8',
    stripeMid: '#818cf8',
    stripeEnd: '#e879f9',
    soleMain: '#f8fafc',
    soleShadow: '#cbd5e1',
    trim: '#0f172a',
  },
  olive: {
    upperStart: '#849161',
    upperEnd: '#4b5536',
    knitAccent: '#a3b18a',
    stripeStart: '#eab308',
    stripeMid: '#84cc16',
    stripeEnd: '#14b8a6',
    soleMain: '#f5f5f4',
    soleShadow: '#d6d3d1',
    trim: '#1c1917',
  },
  sand: {
    upperStart: '#e7dcc8',
    upperEnd: '#bfa98a',
    knitAccent: '#d5c4a8',
    stripeStart: '#ea580c',
    stripeMid: '#f59e0b',
    stripeEnd: '#be123c',
    soleMain: '#fafaf9',
    soleShadow: '#e7e5e4',
    trim: '#292524',
  },
};

export function StudioCutoutSvg({ model, palette, className }: StudioCutoutSvgProps) {
  const uid = useId();
  const colors = PALETTES[palette];

  if (model === 'headphones') {
    return (
      <svg
        viewBox="0 0 640 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('h-full w-full select-none', className)}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={`${uid}-hb`}
            x1="160"
            y1="40"
            x2="480"
            y2="340"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={colors.upperStart} />
            <stop offset="100%" stopColor={colors.upperEnd} />
          </linearGradient>
          <linearGradient
            id={`${uid}-acc`}
            x1="200"
            y1="160"
            x2="440"
            y2="300"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={colors.stripeStart} />
            <stop offset="50%" stopColor={colors.stripeMid} />
            <stop offset="100%" stopColor={colors.stripeEnd} />
          </linearGradient>
        </defs>
        <path
          d="M195 215C195 110 250 52 320 52C390 52 445 110 445 215"
          stroke={`url(#${uid}-hb)`}
          strokeWidth="26"
          strokeLinecap="round"
        />
        <path
          d="M210 195C210 118 258 68 320 68C382 68 430 118 430 195"
          stroke={`url(#${uid}-acc)`}
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.85"
        />
        <rect x="155" y="185" width="66" height="128" rx="33" fill={`url(#${uid}-hb)`} />
        <rect x="178" y="198" width="32" height="102" rx="16" fill={colors.trim} opacity="0.85" />
        <rect x="419" y="185" width="66" height="128" rx="33" fill={`url(#${uid}-hb)`} />
        <rect x="430" y="198" width="32" height="102" rx="16" fill={colors.trim} opacity="0.85" />
        <circle cx="188" cy="249" r="14" fill={`url(#${uid}-acc)`} />
        <circle cx="452" cy="249" r="14" fill={`url(#${uid}-acc)`} />
      </svg>
    );
  }

  if (model === 'lamp') {
    return (
      <svg
        viewBox="0 0 640 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('h-full w-full select-none', className)}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={`${uid}-lmp`}
            x1="160"
            y1="40"
            x2="480"
            y2="340"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={colors.upperStart} />
            <stop offset="100%" stopColor={colors.upperEnd} />
          </linearGradient>
          <radialGradient id={`${uid}-glow`} cx="0.5" cy="0.5" r="0.5">
            <stop offset="0%" stopColor={colors.stripeStart} stopOpacity="0.65" />
            <stop offset="100%" stopColor={colors.stripeEnd} stopOpacity="0" />
          </radialGradient>
        </defs>
        <ellipse cx="265" cy="195" rx="95" ry="70" fill={`url(#${uid}-glow)`} />
        <rect x="290" y="310" width="160" height="24" rx="12" fill={`url(#${uid}-lmp)`} />
        <path
          d="M395 312L435 160L335 88"
          stroke={colors.knitAccent}
          strokeWidth="14"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="435" cy="160" r="11" fill={colors.stripeStart} />
        <circle cx="335" cy="88" r="11" fill={colors.stripeMid} />
        <path d="M215 155C225 100 280 75 335 88L295 178L215 155Z" fill={`url(#${uid}-lmp)`} />
        <ellipse
          cx="255"
          cy="166"
          rx="42"
          ry="12"
          transform="rotate(16 255 166)"
          fill={colors.stripeStart}
        />
      </svg>
    );
  }

  if (model === 'kettle') {
    return (
      <svg
        viewBox="0 0 640 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('h-full w-full select-none', className)}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={`${uid}-ktl`}
            x1="200"
            y1="80"
            x2="440"
            y2="330"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={colors.upperStart} />
            <stop offset="100%" stopColor={colors.upperEnd} />
          </linearGradient>
          <linearGradient
            id={`${uid}-kband`}
            x1="220"
            y1="260"
            x2="420"
            y2="290"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={colors.stripeStart} />
            <stop offset="100%" stopColor={colors.stripeEnd} />
          </linearGradient>
        </defs>
        <path
          d="M250 265C195 265 185 160 150 135C135 124 122 126 112 132"
          stroke={`url(#${uid}-ktl)`}
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M415 155H468C485 155 495 170 490 192L476 255C472 272 456 280 438 280H415"
          stroke={colors.trim}
          strokeWidth="16"
          strokeLinecap="round"
        />
        <path
          d="M252 125H398L422 298C424 310 414 320 402 320H248C236 320 226 310 228 298L252 125Z"
          fill={`url(#${uid}-ktl)`}
        />
        <rect x="230" y="278" width="190" height="14" rx="7" fill={`url(#${uid}-kband)`} />
        <rect x="262" y="106" width="126" height="18" rx="9" fill={colors.soleShadow} />
        <circle cx="325" cy="94" r="14" fill={colors.stripeStart} />
      </svg>
    );
  }

  if (model === 'backpack') {
    return (
      <svg
        viewBox="0 0 640 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('h-full w-full select-none', className)}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={`${uid}-bag`}
            x1="200"
            y1="50"
            x2="440"
            y2="340"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={colors.upperStart} />
            <stop offset="100%" stopColor={colors.upperEnd} />
          </linearGradient>
        </defs>
        <path
          d="M285 68C285 48 355 48 355 68"
          stroke={colors.trim}
          strokeWidth="12"
          strokeLinecap="round"
        />
        <rect x="215" y="68" width="210" height="264" rx="46" fill={`url(#${uid}-bag)`} />
        <rect
          x="242"
          y="182"
          width="156"
          height="118"
          rx="24"
          fill={colors.soleMain}
          opacity="0.22"
        />
        <line
          x1="252"
          y1="206"
          x2="388"
          y2="206"
          stroke={colors.stripeStart}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <rect x="306" y="255" width="28" height="22" rx="5" fill={colors.stripeStart} />
      </svg>
    );
  }

  if (model === 'watch') {
    return (
      <svg
        viewBox="0 0 640 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('h-full w-full select-none', className)}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={`${uid}-wtc`}
            x1="220"
            y1="40"
            x2="420"
            y2="340"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={colors.upperStart} />
            <stop offset="100%" stopColor={colors.upperEnd} />
          </linearGradient>
        </defs>
        <rect x="282" y="34" width="76" height="312" rx="18" fill={`url(#${uid}-wtc)`} />
        <circle
          cx="320"
          cy="190"
          r="78"
          fill={colors.soleMain}
          stroke={colors.knitAccent}
          strokeWidth="10"
        />
        <circle cx="320" cy="190" r="64" fill={colors.upperEnd} />
        <line
          x1="320"
          y1="190"
          x2="320"
          y2="146"
          stroke={colors.stripeStart}
          strokeWidth="6"
          strokeLinecap="round"
        />
        <line
          x1="320"
          y1="190"
          x2="354"
          y2="206"
          stroke="#ffffff"
          strokeWidth="5"
          strokeLinecap="round"
        />
        <circle cx="320" cy="190" r="6" fill={colors.stripeMid} />
      </svg>
    );
  }

  if (model === 'camera') {
    return (
      <svg
        viewBox="0 0 640 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('h-full w-full select-none', className)}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={`${uid}-cam`}
            x1="180"
            y1="70"
            x2="460"
            y2="320"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={colors.upperStart} />
            <stop offset="100%" stopColor={colors.upperEnd} />
          </linearGradient>
        </defs>
        <rect x="190" y="78" width="260" height="224" rx="34" fill={`url(#${uid}-cam)`} />
        <rect x="210" y="252" width="220" height="26" rx="8" fill={colors.trim} />
        <rect x="312" y="160" width="16" height="92" fill={colors.stripeStart} />
        <rect x="328" y="160" width="16" height="92" fill={colors.stripeMid} />
        <rect x="300" y="160" width="12" height="92" fill={colors.stripeEnd} />
        <circle
          cx="320"
          cy="168"
          r="54"
          fill={colors.trim}
          stroke={colors.knitAccent}
          strokeWidth="10"
        />
        <circle cx="320" cy="168" r="24" fill="#1e293b" />
        <circle cx="312" cy="160" r="7" fill="#38bdf8" opacity="0.8" />
        <rect x="382" y="102" width="38" height="26" rx="6" fill={colors.soleMain} />
        <circle cx="234" cy="118" r="12" fill="#ef4444" />
      </svg>
    );
  }

  if (model === 'chair') {
    return (
      <svg
        viewBox="0 0 640 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('h-full w-full select-none', className)}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={`${uid}-chr`}
            x1="220"
            y1="40"
            x2="420"
            y2="330"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={colors.upperStart} />
            <stop offset="100%" stopColor={colors.upperEnd} />
          </linearGradient>
        </defs>
        <rect
          x="255"
          y="48"
          width="130"
          height="155"
          rx="32"
          fill={`url(#${uid}-chr)`}
          stroke={colors.knitAccent}
          strokeWidth="8"
        />
        <rect x="235" y="210" width="170" height="28" rx="14" fill={colors.trim} />
        <line
          x1="320"
          y1="238"
          x2="320"
          y2="312"
          stroke={colors.knitAccent}
          strokeWidth="14"
          strokeLinecap="round"
        />
        <path
          d="M235 328L320 308L405 328"
          stroke={colors.knitAccent}
          strokeWidth="10"
          strokeLinecap="round"
        />
        <circle cx="235" cy="334" r="8" fill={colors.stripeStart} />
        <circle cx="320" cy="334" r="8" fill={colors.stripeMid} />
        <circle cx="405" cy="334" r="8" fill={colors.stripeEnd} />
      </svg>
    );
  }

  if (model === 'bottle') {
    return (
      <svg
        viewBox="0 0 640 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('h-full w-full select-none', className)}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={`${uid}-btl`}
            x1="260"
            y1="40"
            x2="380"
            y2="340"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={colors.upperStart} />
            <stop offset="100%" stopColor={colors.upperEnd} />
          </linearGradient>
        </defs>
        <rect x="292" y="38" width="56" height="32" rx="10" fill={colors.trim} />
        <path
          d="M282 70H358L376 118V316C376 330 364 342 350 342H290C276 342 264 330 264 316V118L282 70Z"
          fill={`url(#${uid}-btl)`}
        />
        <rect x="264" y="275" width="112" height="14" fill={colors.stripeStart} />
      </svg>
    );
  }

  if (model === 'sunglasses') {
    return (
      <svg
        viewBox="0 0 640 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('h-full w-full select-none', className)}
        aria-hidden="true"
      >
        <path d="M115 162H525" stroke={colors.upperEnd} strokeWidth="14" strokeLinecap="round" />
        <rect
          x="140"
          y="152"
          width="150"
          height="98"
          rx="28"
          fill={colors.trim}
          stroke={colors.upperStart}
          strokeWidth="10"
        />
        <rect
          x="350"
          y="152"
          width="150"
          height="98"
          rx="28"
          fill={colors.trim}
          stroke={colors.upperStart}
          strokeWidth="10"
        />
        <line
          x1="168"
          y1="175"
          x2="215"
          y2="225"
          stroke={colors.stripeStart}
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.7"
        />
        <line
          x1="378"
          y1="175"
          x2="425"
          y2="225"
          stroke={colors.stripeStart}
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.7"
        />
      </svg>
    );
  }

  if (model === 'cookware') {
    return (
      <svg
        viewBox="0 0 640 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('h-full w-full select-none', className)}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={`${uid}-pot`}
            x1="180"
            y1="120"
            x2="460"
            y2="310"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={colors.upperStart} />
            <stop offset="100%" stopColor={colors.upperEnd} />
          </linearGradient>
        </defs>
        <path d="M145 182H495" stroke={colors.trim} strokeWidth="16" strokeLinecap="round" />
        <path
          d="M185 162H455L435 288C432 306 416 318 398 318H242C224 318 208 306 205 288L185 162Z"
          fill={`url(#${uid}-pot)`}
        />
        <path d="M200 162C220 124 420 124 440 162" fill={colors.upperStart} />
        <rect x="296" y="112" width="48" height="14" rx="7" fill={colors.stripeStart} />
      </svg>
    );
  }

  if (model === 'cap') {
    return (
      <svg
        viewBox="0 0 640 380"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={cn('h-full w-full select-none', className)}
        aria-hidden="true"
      >
        <defs>
          <linearGradient
            id={`${uid}-cap`}
            x1="180"
            y1="90"
            x2="480"
            y2="280"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor={colors.upperStart} />
            <stop offset="100%" stopColor={colors.upperEnd} />
          </linearGradient>
        </defs>
        <path
          d="M210 238C210 132 275 88 355 88C435 88 490 140 490 238H210Z"
          fill={`url(#${uid}-cap)`}
        />
        <path
          d="M115 246C155 224 225 224 275 238H490C490 250 480 258 465 258H125C112 258 106 251 115 246Z"
          fill={colors.upperEnd}
        />
        <circle cx="355" cy="84" r="10" fill={colors.stripeStart} />
      </svg>
    );
  }

  // Default & flagship: Kestrel Vapor Pace 3 Studio Sneaker Cutout (matches image.png!)
  return (
    <svg
      viewBox="0 0 760 390"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={cn('h-full w-full select-none', className)}
      aria-hidden="true"
    >
      <defs>
        <linearGradient
          id={`${uid}-upper`}
          x1="140"
          y1="80"
          x2="620"
          y2="290"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={colors.upperStart} />
          <stop offset="68%" stopColor={colors.upperStart} />
          <stop offset="100%" stopColor={colors.upperEnd} />
        </linearGradient>
        <linearGradient
          id={`${uid}-stripe`}
          x1="95"
          y1="265"
          x2="635"
          y2="245"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={colors.stripeStart} />
          <stop offset="55%" stopColor={colors.stripeMid} />
          <stop offset="100%" stopColor={colors.stripeEnd} />
        </linearGradient>
        <linearGradient
          id={`${uid}-sole`}
          x1="90"
          y1="245"
          x2="655"
          y2="335"
          gradientUnits="userSpaceOnUse"
        >
          <stop offset="0%" stopColor={colors.soleMain} />
          <stop offset="100%" stopColor={colors.soleShadow} />
        </linearGradient>
      </defs>

      {/* Heel Pull Loop */}
      <path
        d="M616 122C636 104 654 118 644 146C637 165 621 176 610 180"
        stroke={colors.upperEnd}
        strokeWidth="9"
        strokeLinecap="round"
      />

      {/* Engineered Knit Upper Body */}
      <path
        d="M114 252C112 232 132 216 172 208C236 195 304 164 368 118C388 103 406 88 424 90C440 92 448 115 462 132C485 160 532 168 572 150C594 140 608 118 618 122C630 128 628 176 624 218C621 240 612 254 590 258L136 266C120 266 115 260 114 252Z"
        fill={`url(#${uid}-upper)`}
      />

      {/* Subtle Engineered Mesh Knit Texture Lines */}
      <path
        d="M185 232C265 224 355 198 445 165"
        stroke={colors.knitAccent}
        strokeWidth="3"
        strokeLinecap="round"
        strokeDasharray="6 8"
        opacity="0.7"
      />
      <path
        d="M210 245C295 238 390 212 495 178"
        stroke={colors.knitAccent}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="4 7"
        opacity="0.65"
      />
      <path
        d="M250 212C315 196 375 170 432 138"
        stroke={colors.knitAccent}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeDasharray="5 7"
        opacity="0.55"
      />

      {/* Laces along the instep */}
      <path
        d="M312 155L336 168M338 138L364 152M365 121L392 135M390 105L416 118"
        stroke={colors.upperStart}
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Swooping Gradient Midsole Ribbon (Orange -> Coral -> Magenta like image.png) */}
      <path
        d="M104 255C148 278 228 286 326 276C422 266 496 244 566 244C602 244 626 250 638 236C642 248 644 262 636 272C598 282 522 272 426 284C320 296 218 304 142 282C116 274 104 264 104 255Z"
        fill={`url(#${uid}-stripe)`}
      />

      {/* Sculpted Foam Midsole */}
      <path
        d="M102 262C138 286 226 296 336 284C438 273 518 258 588 262C622 264 642 260 652 274C662 288 654 312 628 320C584 333 508 332 436 322C374 313 318 328 246 328C182 328 128 308 104 282C96 273 97 265 102 262Z"
        fill={`url(#${uid}-sole)`}
      />

      {/* Midsole Sculpt Groove */}
      <path
        d="M168 302C258 314 358 296 472 292C536 290 590 298 632 292"
        stroke={colors.soleShadow}
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Outsole Rubber Tread Pods */}
      <path
        d="M138 306C174 322 232 329 298 327L292 334C228 336 170 328 134 311L138 306Z"
        fill={colors.trim}
      />
      <path
        d="M466 324C522 331 584 330 626 319L620 327C578 337 520 337 462 330L466 324Z"
        fill={colors.trim}
      />
    </svg>
  );
}
