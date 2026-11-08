import { AlertCircle, Inbox, Loader2, RefreshCw } from 'lucide-react';
import { motion } from 'motion/react';
import type { ReactNode } from 'react';
import type { AppError } from '@/shared/errors';
import type { AsyncStatus } from '@/shared/hooks/useAsyncState';
import { Button } from './Button';
import { Card } from './Card';

export interface LoadingStateProps {
  readonly label?: string;
}

export function LoadingState({ label = 'Loading student marketplace data...' }: LoadingStateProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="flex flex-col items-center justify-center py-16 text-center">
        <Loader2 className="h-8 w-8 animate-spin text-emerald-600 dark:text-emerald-400" />
        <p className="mt-3 text-sm font-medium text-slate-600 dark:text-slate-400">{label}</p>
      </Card>
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
    >
      <Card className="flex flex-col items-center justify-center py-16 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
          {icon ?? <Inbox className="h-6 w-6" />}
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">{title}</h3>
        <p className="mt-1 max-w-md text-sm text-slate-600 dark:text-slate-400">{description}</p>
        {actionLabel && onAction ? (
          <div className="mt-5">
            <Button variant="primary" size="sm" onClick={onAction}>
              {actionLabel}
            </Button>
          </div>
        ) : null}
      </Card>
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
    >
      <Card className="flex flex-col items-center justify-center border-rose-200 bg-rose-50/50 py-14 text-center dark:border-rose-900/60 dark:bg-rose-950/20">
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-100 text-rose-600 dark:bg-rose-950 dark:text-rose-400">
          <AlertCircle className="h-6 w-6" />
        </div>
        <h3 className="mt-4 text-base font-semibold text-slate-900 dark:text-slate-100">
          Unable to load section
        </h3>
        <p className="mt-1 max-w-md text-sm text-slate-600 dark:text-slate-400">
          {error.userMessage}
        </p>
        {onRetry ? (
          <div className="mt-5">
            <Button variant="outline" size="sm" onClick={onRetry}>
              <RefreshCw className="h-3.5 w-3.5" />
              Retry
            </Button>
          </div>
        ) : null}
      </Card>
    </motion.div>
  );
}

export interface StateSimulatorBarProps {
  readonly currentStatus: AsyncStatus;
  readonly onSelectStatus: (status: AsyncStatus) => void;
}

const SIMULATOR_OPTIONS: readonly AsyncStatus[] = ['success', 'loading', 'empty', 'error'];

export function StateSimulatorBar({ currentStatus, onSelectStatus }: StateSimulatorBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-100/80 px-3 py-1.5 text-xs dark:border-slate-800 dark:bg-slate-900/80">
      <span className="font-medium text-slate-500 dark:text-slate-400">Preview State:</span>
      {SIMULATOR_OPTIONS.map((status) => {
        const isActive = currentStatus === status;
        return (
          <button
            key={status}
            type="button"
            onClick={() => onSelectStatus(status)}
            className={
              isActive
                ? 'rounded-lg bg-emerald-600 px-2.5 py-1 font-medium capitalize text-white shadow-2xs'
                : 'rounded-lg px-2.5 py-1 font-medium capitalize text-slate-600 hover:bg-slate-200/70 dark:text-slate-300 dark:hover:bg-slate-800'
            }
          >
            {status}
          </button>
        );
      })}
    </div>
  );
}
