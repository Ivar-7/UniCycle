import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-zinc-200 bg-white p-6 shadow-xs transition-colors dark:border-zinc-800 dark:bg-zinc-900',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
