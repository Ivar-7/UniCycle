import { ArrowRight, Heart, Loader2, MapPin, Trash2, X } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { usePreferences } from '@/shared/hooks/usePreferences';
import { Badge, Card, EmptyState, ErrorState, LoadingState } from '@/shared/ui';
import { useWishlist } from '../state/useWishlist';

export function WishlistView() {
  const navigate = useNavigate();
  const { formatPrice } = usePreferences();
  const {
    user,
    status,
    entries,
    error,
    actionError,
    setActionError,
    isCheckingOut,
    handleRemoveEntry,
    handleCheckoutAll,
    reload,
  } = useWishlist();

  const totalAmount = entries.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col justify-between gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end dark:border-zinc-800">
        <div className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Favourites & Bag
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
            Saved Campus Essentials
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Items saved for residence hall pickup or side-by-side comparison.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-zinc-200/80 px-4 py-2.5 text-xs font-semibold text-zinc-900 transition-colors hover:bg-zinc-300/80 sm:w-auto dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
        >
          <span>Browse Shop</span>
          <ArrowRight className="h-4 w-4" />
        </Link>
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

      {status === 'loading' ? <LoadingState label="Loading saved items..." /> : null}

      {status === 'error' && error ? <ErrorState error={error} onRetry={reload} /> : null}

      {status === 'empty' || (status === 'success' && entries.length === 0) ? (
        <EmptyState
          icon={<Heart className="h-6 w-6" />}
          title="Your saved bag is empty"
          description="Save furniture, kitchenware, and study electronics while browsing the shop."
          actionLabel="Browse Shop"
          onAction={() => {
            void navigate('/');
          }}
        />
      ) : null}

      {status === 'success' && entries.length > 0 ? (
        <div className="grid gap-8 lg:grid-cols-3">
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
            className="space-y-4 lg:col-span-2"
          >
            {entries.map((entry) => (
              <Card
                key={entry.id}
                className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center"
              >
                <div className="min-w-0 space-y-1.5">
                  <div className="flex flex-wrap items-center gap-2.5">
                    <Link
                      to={`/item/${encodeURIComponent(entry.listingId)}`}
                      className="text-base font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
                    >
                      {entry.title}
                    </Link>
                    <Badge tone={entry.inStock ? 'neutral' : 'slate'}>
                      {entry.inStock ? 'Available' : 'Sold'}
                    </Badge>
                  </div>
                  <p className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">{entry.campusLocation}</span>
                  </p>
                </div>

                <div className="flex items-center justify-between gap-4 sm:justify-end">
                  <span className="text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                    {formatPrice(entry.price)}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${entry.title}`}
                    onClick={() => void handleRemoveEntry(entry.id, entry.listingId)}
                    className="rounded-lg p-2 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-rose-600 dark:hover:bg-zinc-800"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </Card>
            ))}
          </motion.div>

          {/* Summary Box */}
          <Card className="flex flex-col justify-between gap-6 self-start">
            <div className="space-y-4">
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Pickup Summary
              </h2>
              <div className="space-y-2 border-b border-zinc-100 pb-4 text-sm dark:border-zinc-800">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Saved items ({entries.length})</span>
                  <span className="tabular-nums">{formatPrice(totalAmount)}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Campus Hall Handover</span>
                  <span className="font-medium text-zinc-900 dark:text-zinc-100">Free</span>
                </div>
              </div>
              <div className="flex justify-between text-base font-bold text-zinc-900 dark:text-zinc-100">
                <span>Estimated Total</span>
                <span className="tabular-nums">{formatPrice(totalAmount)}</span>
              </div>
              {!user ? (
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  Sign in with your university email at checkout to generate hall pickup codes.
                </p>
              ) : null}
            </div>

            <button
              type="button"
              disabled={isCheckingOut}
              onClick={async () => {
                const res = await handleCheckoutAll();
                if (res === 'ok') {
                  void navigate('/orders');
                } else if (res === 'auth-required') {
                  void navigate('/auth?redirect=/wishlist');
                }
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-zinc-200/80 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-zinc-900 transition-colors hover:bg-zinc-300/80 disabled:opacity-50 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              {isCheckingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <span>{user ? 'Reserve for Campus Pickup' : 'Sign In & Reserve Pickup'}</span>
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </Card>
        </div>
      ) : null}
    </div>
  );
}
