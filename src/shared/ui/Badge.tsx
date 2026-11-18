import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export type BadgeTone = 'neutral' | 'emerald' | 'amber' | 'sky' | 'rose' | 'slate';

export interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  readonly tone?: BadgeTone;
  readonly children: ReactNode;
}

const toneClasses: Record<BadgeTone, string> = {
  neutral:
    'bg-zinc-100 text-zinc-800 border-zinc-300 dark:bg-zinc-800 dark:text-zinc-200 dark:border-zinc-700',
  emerald:
    'bg-emerald-100 text-emerald-800 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800',
  amber:
    'bg-amber-100 text-amber-800 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800',
  sky: 'bg-sky-50 text-sky-800 border-sky-200 dark:bg-sky-950/60 dark:text-sky-200 dark:border-sky-800/70',
  rose: 'bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800',
  slate:
    'bg-zinc-100 text-zinc-700 border-zinc-200 dark:bg-zinc-800 dark:text-zinc-300 dark:border-zinc-700',
};

export function Badge({ tone = 'slate', className, children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium',
        toneClasses[tone],
        className,
      )}
      {...props}
    >
      {children}
    </span>
  );
}
