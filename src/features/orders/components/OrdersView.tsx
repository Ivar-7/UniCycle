import { CalendarClock, CheckCircle2, LogIn, QrCode, ShoppingBag, X } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { usePreferences } from '@/shared/hooks/usePreferences';
import { Badge, Card, EmptyState, ErrorState, LoadingState } from '@/shared/ui';
import { formatRelativeDate } from '@/shared/utils/format';
import { useOrders } from '../state/useOrders';

export function OrdersView() {
  const navigate = useNavigate();
  const { formatPrice } = usePreferences();
  const {
    user,
    authLoading,
    status,
    orders,
    error,
    actionError,
    setActionError,
    changeOrderStatus,
    reload,
  } = useOrders();
  const [activePassOrderId, setActivePassOrderId] = useState<string | null>(null);

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <span className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Exchanges & Handovers
        </span>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
          Campus Pickups & Orders
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Present your pickup pass code when meeting student sellers at residence hall lobbies.
        </p>
      </div>

      {actionError ? (
        <div
          role="alert"
          className="flex items-center justify-between gap-3 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
        >
          <span>{actionError}</span>
          <button
            type="button"
            aria-label="Dismiss error"
            onClick={() => setActionError(null)}
            className="shrink-0 rounded-md p-1 hover:bg-rose-100 dark:hover:bg-rose-900"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      {authLoading || (user && status === 'loading') ? (
        <LoadingState label="Loading your campus pickups..." />
      ) : null}

      {!authLoading && !user ? (
        <EmptyState
          icon={<LogIn className="h-6 w-6" />}
          title="Sign in to view scheduled pickups"
          description="Sign in with your university email to track reserved items and handover verification codes."
          actionLabel="Student Sign In"
          onAction={() => void navigate('/auth?redirect=/orders')}
        />
      ) : null}

      {user && status === 'error' && error ? <ErrorState error={error} onRetry={reload} /> : null}

      {user && status === 'empty' ? (
        <EmptyState
          icon={<ShoppingBag className="h-6 w-6" />}
          title="No scheduled pickups yet"
          description="Save items to your bag and reserve them for campus residence hall collection."
          actionLabel="Browse Shop"
          onAction={() => void navigate('/')}
        />
      ) : null}

      {user && status === 'success' && orders.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="space-y-4"
        >
          {orders.map((order) => {
            const showPass = activePassOrderId === order.id;
            return (
              <Card key={order.id} className="space-y-4">
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                  <div className="min-w-0 space-y-1.5">
                    <div className="flex flex-wrap items-center gap-2.5">
                      <span className="font-mono text-xs text-zinc-400">#{order.id}</span>
                      <Badge
                        tone={
                          order.status === 'completed'
                            ? 'neutral'
                            : order.status === 'cancelled'
                              ? 'slate'
                              : 'amber'
                        }
                      >
                        {order.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                          </span>
                        ) : order.status === 'cancelled' ? (
                          'Cancelled'
                        ) : (
                          'Scheduled Pickup'
                        )}
                      </Badge>
                    </div>
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {order.itemTitle}
                    </h2>
                    <p className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <CalendarClock className="h-3.5 w-3.5 shrink-0" />
                      <span>
                        Meetup: {order.meetupSpot} with {order.sellerName} (
                        {formatRelativeDate(order.orderedAt)})
                      </span>
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-2.5 sm:shrink-0">
                    <span className="mr-1 text-xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                      {formatPrice(order.totalAmount)}
                    </span>
                    {order.status === 'scheduled-pickup' ? (
                      <button
                        type="button"
                        onClick={() => void changeOrderStatus(order, 'completed')}
                        className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-zinc-200/80 px-3.5 py-2 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-300/80 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5" />
                        Confirm Handover
                      </button>
                    ) : null}
                    <button
                      type="button"
                      onClick={() => setActivePassOrderId(showPass ? null : order.id)}
                      className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100"
                    >
                      <QrCode className="h-3.5 w-3.5" />
                      {showPass ? 'Hide Code' : 'Pickup Code'}
                    </button>
                  </div>
                </div>

                {showPass ? (
                  <div className="flex flex-col items-start justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:flex-row sm:items-center dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Campus Handover Verification Code
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        Share this code with {order.sellerName} once you inspect the item in person.
                      </p>
                    </div>
                    <div className="rounded-xl border border-zinc-300 bg-white px-5 py-2.5 font-mono text-lg font-bold tracking-widest text-zinc-900 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-100">
                      {order.pickupCode}
                    </div>
                  </div>
                ) : null}
              </Card>
            );
          })}
        </motion.div>
      ) : null}
    </div>
  );
}
