import { cn } from '@/shared/utils/cn';

export interface UniCycleLogoProps {
  readonly className?: string;
}

/**
 * Geometric UC monogram representing UniCycle's student-to-student circular
 * campus marketplace.
 */
export function UniCycleLogo({ className }: UniCycleLogoProps) {
  return (
    <svg viewBox="0 0 32 32" fill="none" aria-hidden="true" className={cn('shrink-0', className)}>
      <path
        d="M23.4 8.6a10.5 10.5 0 1 0 0 14.8"
        className="stroke-sky-700 dark:stroke-sky-400"
        strokeWidth="3.1"
        strokeLinecap="round"
      />
      <path
        d="M12.5 12v4.5a4 4 0 0 0 8 0V12"
        stroke="currentColor"
        strokeWidth="3.1"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
