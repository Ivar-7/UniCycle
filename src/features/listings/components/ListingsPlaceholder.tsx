import {
  Box,
  Eye,
  ImagePlus,
  Loader2,
  MapPin,
  PackagePlus,
  RefreshCw,
  Store,
  Trash2,
  X,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState, type ChangeEvent } from 'react';
import { Link } from 'react-router-dom';
import { CATEGORIES } from '@/features/marketplace/api/marketplace.api';
import type { ProductCategory } from '@/features/marketplace/api/marketplace.types';
import { Badge, Button, Card, EmptyState, ErrorState, LoadingState } from '@/shared/ui';
import { useListings } from '../state/useListings';

export function ListingsPlaceholder() {
  const {
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
  const [newHall, setNewHall] = useState('North Hall Block B');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

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
            Seller Studio · Firestore & Firebase Storage
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            My Campus Listings
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Upload photos to Firebase Storage and publish pre-owned household essentials to
            Firestore.
          </p>
        </div>
        <Button
          variant="secondary"
          size="md"
          onClick={() => {
            setActionError(null);
            setShowNewModal(true);
          }}
        >
          <PackagePlus className="h-4 w-4" />
          New Student Listing
        </Button>
      </div>

      {actionError ? (
        <div
          role="alert"
          className="flex items-center justify-between rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300"
        >
          <span>{actionError}</span>
          <button
            type="button"
            onClick={() => setActionError(null)}
            className="rounded-md p-1 hover:bg-rose-100 dark:hover:bg-rose-900"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : null}

      {/* Interactive Create Listing Panel with Firebase Storage Photo Upload */}
      {showNewModal ? (
        <Card className="space-y-5 border-zinc-900 dark:border-zinc-100">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                Publish Pre-Owned Campus Listing
              </h2>
              <p className="text-xs text-zinc-500 dark:text-zinc-400">
                Photos are uploaded via Firebase Storage and synced to the live Firestore catalogue.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setShowNewModal(false)}
              className="rounded-lg p-1 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

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
                Student Price ($)
              </label>
              <input
                id="new-item-price"
                type="number"
                min={1}
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
                value={newHall}
                onChange={(e) => setNewHall(e.target.value)}
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              />
            </div>
          </div>

          {/* Firebase Storage Photo Upload Field */}
          <div className="flex flex-col justify-between gap-4 rounded-xl border border-dashed border-zinc-300 bg-zinc-50/70 p-4 sm:flex-row sm:items-center dark:border-zinc-700 dark:bg-zinc-950/60">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-zinc-200/80 text-zinc-700 dark:bg-zinc-800 dark:text-zinc-300">
                <ImagePlus className="h-5 w-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">
                  {selectedFile ? selectedFile.name : 'Upload Item Photo (Firebase Storage)'}
                </p>
                <p className="text-xs text-zinc-500 dark:text-zinc-400">
                  JPEG, PNG, or WebP up to 5 MB · Stored in listings/ bucket
                </p>
              </div>
            </div>
            <label className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-300 bg-white px-3.5 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200">
              <span>Choose Photo</span>
              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={handleFileChange}
                className="sr-only"
              />
            </label>
          </div>

          <div className="flex justify-end gap-2">
            <Button variant="outline" size="sm" onClick={() => setShowNewModal(false)}>
              Cancel
            </Button>
            <Button
              variant="secondary"
              size="sm"
              disabled={isSubmitting}
              onClick={() => void onSubmitNewListing()}
            >
              {isSubmitting ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : null}
              {isSubmitting ? 'Uploading & Saving...' : 'Publish to Firestore'}
            </Button>
          </div>
        </Card>
      ) : null}

      {status === 'loading' ? (
        <LoadingState label="Loading your student listings from Firestore..." />
      ) : null}

      {status === 'error' && error ? <ErrorState error={error} onRetry={reload} /> : null}

      {status === 'empty' ? (
        <EmptyState
          icon={<Store className="h-6 w-6" />}
          title="You haven't listed any items yet"
          description="Moving out of halls soon? Turn your pre-owned kettle, desk lamp, or shelving into cash."
          actionLabel="Load Seeded Listings"
          onAction={() => void reload()}
        />
      ) : null}

      {status === 'success' && listings.length > 0 ? (
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
              <div className="relative h-48 w-full bg-zinc-100 dark:bg-zinc-800">
                <img
                  src={listing.imageUrl}
                  alt={listing.title}
                  loading="lazy"
                  className="h-full w-full object-cover"
                />
                <div className="absolute top-3 right-3 flex items-center gap-2">
                  <Badge
                    tone={
                      listing.status === 'active'
                        ? 'emerald'
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
                <div className="space-y-1">
                  <span className="text-xs font-medium uppercase tracking-wider text-zinc-400">
                    {listing.category}
                  </span>
                  <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
                    {listing.title}
                  </h2>
                  <p className="inline-flex items-center gap-1.5 text-xs text-zinc-500 dark:text-zinc-400">
                    <MapPin className="h-3.5 w-3.5" />
                    Pickup: {listing.pickupHall}
                  </p>
                </div>

                <div className="space-y-3 border-t border-zinc-100 pt-3 dark:border-zinc-800">
                  <div className="flex items-center justify-between text-xs text-zinc-500 dark:text-zinc-400">
                    <span className="text-lg font-bold tabular-nums text-zinc-900 dark:text-zinc-100">
                      ${listing.price}
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
                      <Link
                        to="/products"
                        className="inline-flex items-center gap-1 rounded-lg bg-zinc-900 px-2.5 py-1.5 text-xs font-medium text-white dark:bg-zinc-100 dark:text-zinc-950"
                      >
                        <Box className="h-3 w-3" />
                        3D
                      </Link>
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
