import type { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/shared/utils/cn';

export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type ButtonSize = 'sm' | 'md' | 'lg';

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  readonly variant?: ButtonVariant;
  readonly size?: ButtonSize;
  readonly children: ReactNode;
}

const variantClasses: Record<ButtonVariant, string> = {
  primary:
    'bg-sky-700 text-white hover:bg-sky-800 active:bg-sky-900 dark:bg-sky-700 dark:text-sky-50 dark:hover:bg-sky-600',
  secondary:
    'border border-sky-200 bg-sky-50 text-sky-900 hover:bg-sky-100 dark:border-sky-800/70 dark:bg-sky-950/60 dark:text-sky-200 dark:hover:bg-sky-900/60',
  outline:
    'border border-zinc-300 bg-transparent text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800',
  ghost: 'bg-transparent text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-800',
  danger:
    'bg-rose-600 text-white hover:bg-rose-500 dark:bg-rose-500 dark:text-white dark:hover:bg-rose-400',
};

const sizeClasses: Record<ButtonSize, string> = {
  sm: 'px-3 py-1.5 text-xs rounded-lg',
  md: 'px-4 py-2 text-sm rounded-xl',
  lg: 'px-5 py-2.5 text-base rounded-xl',
};

export function Button({
  variant = 'primary',
  size = 'md',
  className,
  children,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center gap-2 font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-700 disabled:pointer-events-none disabled:opacity-50 dark:focus-visible:outline-sky-400',
        variantClasses[variant],
        sizeClasses[size],
        className,
      )}
      {...props}
    >
      {children}
    </button>
  );
}
