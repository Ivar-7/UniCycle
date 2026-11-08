import type { HTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export interface CardProps extends HTMLAttributes<HTMLDivElement> {
  readonly children: ReactNode;
}

export function Card({ className, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200 bg-white p-6 shadow-xs transition-colors dark:border-slate-800 dark:bg-slate-900',
        className,
      )}
      {...props}
    >
      {children}
    </div>
  );
}
