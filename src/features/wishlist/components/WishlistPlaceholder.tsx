import { ArrowRight, Box, Heart, Loader2, MapPin, Trash2 } from 'lucide-react';
import { motion } from 'motion/react';
import { Link, useNavigate } from 'react-router-dom';
import { Badge, Card, EmptyState, ErrorState, LoadingState } from '@/shared/ui';
import { useWishlist } from '../state/useWishlist';

export function WishlistPlaceholder() {
  const navigate = useNavigate();
  const { status, entries, error, isCheckingOut, handleRemoveEntry, handleCheckoutAll, reload } =
    useWishlist();

  const totalAmount = entries.reduce((sum, item) => sum + item.price, 0);

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col justify-between gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end dark:border-zinc-800">
        <div className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Favourites & Bag · Firestore Synced
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Saved Campus Essentials
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Items you have saved in Firestore for residence hall pickup or 3D studio comparison.
          </p>
        </div>
        <Link
          to="/products"
          className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
        >
          <Box className="h-4 w-4" />
          Open 3D Studio
        </Link>
      </div>

      {status === 'loading' ? <LoadingState label="Loading saved items from Firestore..." /> : null}

      {status === 'error' && error ? <ErrorState error={error} onRetry={reload} /> : null}

      {status === 'empty' || (status === 'success' && entries.length === 0) ? (
        <EmptyState
          icon={<Heart className="h-6 w-6" />}
          title="Your student wishlist is empty"
          description="Save furniture, kitchenware, and study electronics while browsing the marketplace or 3D Studio."
          actionLabel="Browse Marketplace"
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
              <Card key={entry.id} className="flex items-center justify-between gap-4">
                <div className="space-y-1.5">
                  <div className="flex items-center gap-2.5">
                    <Link
                      to={`/products?item=${entry.listingId}`}
                      className="text-base font-semibold text-zinc-900 hover:underline dark:text-zinc-100"
                    >
                      {entry.title}
                    </Link>
                    <Badge tone={entry.inStock ? 'emerald' : 'slate'}>
                      {entry.inStock ? 'In Stock' : 'Sold'}
                    </Badge>
                  </div>
                  <p className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                    <MapPin className="h-3.5 w-3.5" />
                    {entry.campusLocation}
                  </p>
                </div>

                <div className="flex items-center gap-4">
                  <span className="text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                    ${entry.price}
                  </span>
                  <button
                    type="button"
                    aria-label={`Remove ${entry.title}`}
                    onClick={() => void handleRemoveEntry(entry.id)}
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
              <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Pickup Summary
              </h3>
              <div className="space-y-2 border-b border-zinc-100 pb-4 text-sm dark:border-zinc-800">
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Saved items ({entries.length})</span>
                  <span className="tabular-nums">${totalAmount}</span>
                </div>
                <div className="flex justify-between text-zinc-600 dark:text-zinc-400">
                  <span>Campus Hall Handover</span>
                  <span className="font-medium text-emerald-600 dark:text-emerald-400">Free</span>
                </div>
              </div>
              <div className="flex justify-between text-base font-bold text-zinc-900 dark:text-zinc-100">
                <span>Estimated Total</span>
                <span className="tabular-nums">${totalAmount}</span>
              </div>
            </div>

            <button
              type="button"
              disabled={isCheckingOut}
              onClick={async () => {
                const ok = await handleCheckoutAll();
                if (ok) {
                  void navigate('/orders');
                }
              }}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-zinc-900 px-4 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-zinc-800 disabled:opacity-50 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              {isCheckingOut ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  Reserve for Campus Pickup
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
