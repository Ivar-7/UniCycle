import {
  ArrowUpRight,
  Eye,
  ImageOff,
  ImagePlus,
  Loader2,
  LogIn,
  MapPin,
  PackagePlus,
  RefreshCw,
  Store,
  Trash2,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState, type ChangeEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { CATEGORIES } from '@/features/marketplace/api/marketplace.api';
import type { ProductCategory } from '@/features/marketplace/api/marketplace.types';
import { usePreferences } from '@/shared/hooks/usePreferences';
import { Badge, Button, Card, EmptyState, ErrorState, LoadingState } from '@/shared/ui';
import { useListings } from '../state/useListings';

export function ListingsView() {
  const navigate = useNavigate();
  const { formatPrice, defaultCampusHall } = usePreferences();
  const {
    user,
    authLoading,
    status,
    listings,
    error,
    isSubmitting,
    actionError,
    setActionError,
    handleCreate,
    handleToggleStatus,
    handleDelete,
    reload,
  } = useListings();

  const [showNewModal, setShowNewModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState<ProductCategory>('furniture');
  const [newPrice, setNewPrice] = useState('45');
  const [newHall, setNewHall] = useState(defaultCampusHall);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] ?? null;
    setSelectedFile(file);
  };

  const onSubmitNewListing = async () => {
    const ok = await handleCreate({
      title: newTitle,
      category: newCategory,
      price: Number(newPrice),
      pickupHall: newHall,
      imageFile: selectedFile,
    });
    if (ok) {
      setNewTitle('');
      setSelectedFile(null);
      setShowNewModal(false);
    }
  };

  return (
    <div className="space-y-8 pb-16">
      <div className="flex flex-col justify-between gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end dark:border-zinc-800">
        <div className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Seller Studio
          </span>
          <h1 className="text-2xl font-semibold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
            My Campus Listings
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Publish pre-owned household essentials and coordinate pickups from your residence hall.
          </p>
        </div>

        {user ? (
          <Button
            variant="secondary"
            size="md"
            onClick={() => {
              setActionError(null);
              setShowNewModal(true);
            }}
            className="w-full sm:w-auto"
          >
            <PackagePlus className="h-4 w-4" />
            New Listing
          </Button>
        ) : null}
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

      {showNewModal && user ? (
        <Card className="space-y-5 border-zinc-900 dark:border-zinc-100">
          <div className="flex items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Publish Pre-Owned Listing
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Your item appears immediately in the campus marketplace once published.
              </p>
            </div>
            <button
              type="button"
              aria-label="Close form"
              onClick={() => setShowNewModal(false)}
              className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <form
            className="space-y-5"
            onSubmit={(e) => {
              e.preventDefault();
              void onSubmitNewListing();
            }}
          >
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="space-y-1.5">
                <label
                  htmlFor="new-item-title"
                  className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  Item Name
                </label>
                <input
                  id="new-item-title"
                  type="text"
                  required
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="e.g. Fellow Stagg Kettle"
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="new-item-category"
                  className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  Category
                </label>
                <select
                  id="new-item-category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value as ProductCategory)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                      {cat.label}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="new-item-price"
                  className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  Price
                </label>
                <input
                  id="new-item-price"
                  type="number"
                  required
                  min={1}
                  step="any"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="new-item-hall"
                  className="block text-xs font-medium text-zinc-600 dark:text-zinc-400"
                >
                  Pickup Residence Hall
                </label>
                <input
                  id="new-item-hall"
                  type="text"
                  required
                  value={newHall}
                  onChange={(e) => setNewHall(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>
            </div>

            <div className="flex flex-col justify-between gap-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/70 p-4 sm:flex-row sm:items-center dark:border-zinc-700 dark:bg-zinc-950/60">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-zinc-200/80 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                  <ImagePlus className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <p className="truncate text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                    {selectedFile ? selectedFile.name : 'Upload Item Photo'}
                  </p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">
                    Optional · JPEG, PNG, or WebP up to 5 MB
                  </p>
                </div>
              </div>
              <label className="inline-flex shrink-0 cursor-pointer items-center justify-center gap-2 rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
                <span>Choose Photo</span>
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileChange}
                  className="sr-only"
                />
              </label>
            </div>

            <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
              <Button variant="outline" size="sm" onClick={() => setShowNewModal(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="secondary" size="sm" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
                {isSubmitting ? 'Publishing...' : 'Publish Listing'}
              </Button>
            </div>
          </form>
        </Card>
      ) : null}

      {authLoading || (user && status === 'loading') ? (
        <LoadingState label="Loading your campus listings..." />
      ) : null}

      {!authLoading && !user ? (
        <EmptyState
          icon={<LogIn className="h-6 w-6" />}
          title="Sign in to sell on UniCycle"
          description="Verify your university email to publish pre-owned items and manage residence hall pickups."
          actionLabel="Student Sign In"
          onAction={() => void navigate('/auth?redirect=/listings')}
        />
      ) : null}

      {user && status === 'error' && error ? <ErrorState error={error} onRetry={reload} /> : null}

      {user && status === 'empty' ? (
        <EmptyState
          icon={<Store className="h-6 w-6" />}
          title="You haven't listed any items yet"
          description="Moving out of halls soon? Turn your pre-owned kettle, desk lamp, or shelving into cash."
          actionLabel="Create First Listing"
          onAction={() => setShowNewModal(true)}
        />
      ) : null}

      {user && status === 'success' && listings.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
          className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
        >
          {listings.map((listing) => (
            <Card
              key={listing.id}
              className="flex flex-col justify-between gap-4 overflow-hidden p-0"
            >
              <div className="relative aspect-4/3 w-full bg-zinc-100 dark:bg-zinc-800">
                {failedImages[listing.id] ? (
                  <div className="flex h-full w-full items-center justify-center text-zinc-400">
                    <ImageOff className="h-8 w-8" />
                  </div>
                ) : (
                  <img
                    src={listing.imageUrl}
                    alt={listing.title}
                    loading="lazy"
                    onError={() =>
                      setFailedImages((prev) => ({
                        ...prev,
                        [listing.id]: true,
                      }))
                    }
                    className="h-full w-full object-cover"
                  />
                )}
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <Badge
                    tone={
                      listing.status === 'active'
                        ? 'neutral'
                        : listing.status === 'reserved'
                          ? 'amber'
                          : 'slate'
                    }
                  >
                    {listing.status}
                  </Badge>
                </div>
              </div>

              <div className="flex flex-1 flex-col justify-between gap-4 p-5 pt-1">
                <div className="min-w-0 space-y-1">
                  <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                    {listing.category}
                  </span>
                  <h2 className="truncate text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    {listing.title}
                  </h2>
                  <p className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                    <MapPin className="h-3.5 w-3.5 shrink-0" />
                    <span className="truncate">Pickup: {listing.pickupHall}</span>
                  </p>
                </div>

                <div className="space-y-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                      {formatPrice(listing.price)}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      {listing.viewsCount} views
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => void handleToggleStatus(listing)}
                      className="inline-flex items-center gap-1.5 rounded-lg border border-zinc-200 px-2.5 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-300 dark:hover:bg-zinc-800"
                    >
                      <RefreshCw className="h-3 w-3" />
                      Cycle Status
                    </button>

                    <div className="flex items-center gap-2">
                      {listing.status === 'active' ? (
                        <Link
                          to={`/item/${encodeURIComponent(listing.id)}`}
                          className="inline-flex items-center gap-1 rounded-lg border border-zinc-300 bg-zinc-100 px-2.5 py-1.5 text-xs font-medium text-zinc-900 hover:bg-zinc-200 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
                        >
                          <span>View</span>
                          <ArrowUpRight className="h-3 w-3" />
                        </Link>
                      ) : null}
                      <button
                        type="button"
                        aria-label={`Delete ${listing.title}`}
                        onClick={() => void handleDelete(listing.id)}
                        className="rounded-lg p-1.5 text-zinc-400 transition-colors hover:bg-zinc-100 hover:text-rose-600 dark:hover:bg-zinc-800"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </motion.div>
      ) : null}
    </div>
  );
}
