import { CalendarClock, CheckCircle2, QrCode, ShoppingBag } from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Badge, Card, EmptyState, ErrorState, LoadingState } from '@/shared/ui';
import { formatRelativeDate } from '@/shared/utils/format';
import { useOrders } from '../state/useOrders';

export function OrdersPlaceholder() {
  const { status, orders, error, changeOrderStatus, reload } = useOrders();
  const [activePassOrderId, setActivePassOrderId] = useState<string | null>(null);

  return (
    <div className="space-y-8 pb-16">
      <div className="border-b border-zinc-200 pb-6 dark:border-zinc-800">
        <span className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
          Exchanges & Handovers · Firestore Synced
        </span>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
          Campus Pickups & Orders
        </h1>
        <p className="mt-1 text-sm text-zinc-600 dark:text-zinc-400">
          Present your pickup pass code when meeting student sellers at residence hall lobbies.
        </p>
      </div>

      {status === 'loading' ? <LoadingState label="Loading your campus orders..." /> : null}

      {status === 'error' && error ? <ErrorState error={error} onRetry={reload} /> : null}

      {status === 'empty' ? (
        <EmptyState
          icon={<ShoppingBag className="h-6 w-6" />}
          title="No orders or scheduled pickups yet"
          description="Reserve pre-owned items on the UniCycle marketplace to schedule a campus exchange."
          actionLabel="Load Sample Orders"
          onAction={() => void reload()}
        />
      ) : null}

      {status === 'success' && orders.length > 0 ? (
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
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-xs text-zinc-400">#{order.id}</span>
                      <Badge tone={order.status === 'completed' ? 'emerald' : 'amber'}>
                        {order.status === 'completed' ? (
                          <span className="inline-flex items-center gap-1">
                            <CheckCircle2 className="h-3 w-3" />
                            Completed
                          </span>
                        ) : (
                          'Scheduled Pickup'
                        )}
                      </Badge>
                    </div>
                    <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
                      {order.itemTitle}
                    </h2>
                    <p className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                      <CalendarClock className="h-3.5 w-3.5" />
                      Meetup: {order.meetupSpot} with {order.sellerName} (
                      {formatRelativeDate(order.orderedAt)})
                    </p>
                  </div>

                  <div className="flex flex-wrap items-center gap-3">
                    <span className="text-xl font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                      ${order.totalAmount}
                    </span>
                    {order.status !== 'completed' ? (
                      <button
                        type="button"
                        onClick={() => void changeOrderStatus(order, 'completed')}
                        className="inline-flex items-center gap-1.5 rounded-xl bg-emerald-600 px-3.5 py-2 text-xs font-semibold text-white transition-colors hover:bg-emerald-500"
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
                      {showPass ? 'Hide Pass' : 'Pickup Code'}
                    </button>
                  </div>
                </div>

                {showPass ? (
                  <div className="flex flex-col items-center justify-between gap-4 rounded-xl border border-zinc-200 bg-zinc-50 p-4 sm:flex-row dark:border-zinc-800 dark:bg-zinc-950">
                    <div className="space-y-1">
                      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                        Campus Handover Verification Code
                      </p>
                      <p className="text-xs text-zinc-600 dark:text-zinc-400">
                        Share this code with {order.sellerName} once you inspect the item in person.
                      </p>
                    </div>
                    <div className="rounded-xl bg-zinc-900 px-5 py-2.5 font-mono text-lg font-bold tracking-widest text-white dark:bg-zinc-100 dark:text-zinc-950">
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
