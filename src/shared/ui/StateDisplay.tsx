import { AlertCircle, Inbox, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import type { AppError } from '@/shared/errors';
import { cn } from '@/shared/utils/cn';
import { Button } from './Button';
import { UniCycleLogo } from './UniCycleLogo';

export interface LoadingStateProps {
  readonly label?: string;
  readonly className?: string;
}

export function LoadingState({
  label = 'Loading student marketplace data...',
  className,
}: LoadingStateProps) {
  return (
    <motion.div
      role="status"
      aria-live="polite"
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      className={cn(
        'flex min-h-80 w-full flex-col items-center justify-center px-6 py-16 text-center sm:min-h-96',
        className,
      )}
    >
      <div className="relative flex h-14 w-14 items-center justify-center">
        <span
          aria-hidden="true"
          className="absolute -inset-2 rounded-full bg-sky-500/10 blur-md dark:bg-sky-400/10"
        />
        <span
          aria-hidden="true"
          className="absolute inset-0 animate-spin rounded-full border-2 border-zinc-200 border-t-sky-700 dark:border-zinc-800 dark:border-t-sky-400"
        />
        <UniCycleLogo className="relative h-6 w-6 text-zinc-900 dark:text-zinc-100" />
      </div>
      <p className="mt-5 text-sm font-medium tracking-tight text-zinc-900 dark:text-zinc-100">
        {label}
      </p>
    </motion.div>
  );
}

export interface EmptyStateProps {
  readonly title: string;
  readonly description: string;
  readonly actionLabel?: string;
  readonly onAction?: () => void;
  readonly icon?: ReactNode;
}

export function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className="flex min-h-80 w-full flex-col items-center justify-center px-6 py-16 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-sky-200 bg-sky-50 text-sky-700 dark:border-sky-800/70 dark:bg-sky-950/60 dark:text-sky-300">
        {icon ?? <Inbox className="h-6 w-6" />}
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        {title}
      </h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {description}
      </p>
      {actionLabel && onAction ? (
        <div className="mt-6">
          <Button variant="primary" size="md" onClick={onAction}>
            {actionLabel}
          </Button>
        </div>
      ) : null}
    </motion.div>
  );
}

export interface ErrorStateProps {
  readonly error: AppError;
  readonly onRetry?: () => void;
}

export function ErrorState({ error, onRetry }: ErrorStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.98 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="flex min-h-80 w-full flex-col items-center justify-center px-6 py-16 text-center"
    >
      <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-rose-200 bg-rose-50 text-rose-600 dark:border-rose-900/60 dark:bg-rose-950/60 dark:text-rose-400">
        <AlertCircle className="h-6 w-6" />
      </div>
      <h3 className="mt-4 text-lg font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
        Unable to load section
      </h3>
      <p className="mt-1.5 max-w-md text-sm leading-relaxed text-zinc-600 dark:text-zinc-400">
        {error.userMessage}
      </p>
      {onRetry ? (
        <div className="mt-6">
          <Button variant="outline" size="md" onClick={onRetry}>
            <RefreshCw className="h-4 w-4" />
            Retry
          </Button>
        </div>
      ) : null}
    </motion.div>
  );
}
