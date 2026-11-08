import {
  Award,
  Box,
  Camera,
  Check,
  Edit3,
  GraduationCap,
  Leaf,
  MapPin,
  Package,
  Settings,
  ShieldCheck,
  UserCircle,
} from 'lucide-react';
import { motion } from 'motion/react';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Badge,
  Button,
  Card,
  EmptyState,
  ErrorState,
  LoadingState,
  StarRating,
  StudioCutoutSvg,
} from '@/shared/ui';
import { useProfile } from '../state/useProfile';

const STUDENT_REVIEWS = [
  {
    id: 'rev-1',
    reviewer: 'Noah · 3rd Year Economics',
    item: 'Nordic Architect Desk Lamp',
    rating: 5,
    comment: 'Super easy handover outside North Hall Block B. Lamp looks brand new!',
    date: '2 days ago',
  },
  {
    id: 'rev-2',
    reviewer: 'Maya · 2nd Year CS',
    item: 'Stagg Pour-Over Kettle',
    rating: 5,
    comment: 'Spotless condition, heats up in 90 seconds. Saved me $60 compared to retail.',
    date: '1 week ago',
  },
] as const;

export function ProfilePlaceholder() {
  const { status, profile, error, isSaving, saveError, saveSuccess, saveProfile, reload } =
    useProfile();
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [fullNameDraft, setFullNameDraft] = useState<string>('');
  const [hallDraft, setHallDraft] = useState<string>('');
  const [avatarFile, setAvatarFile] = useState<File | null>(null);

  if (status === 'loading') {
    return <LoadingState label="Loading your student profile..." />;
  }

  if (status === 'error' && error) {
    return <ErrorState error={error} onRetry={reload} />;
  }

  if (status === 'empty' || !profile) {
    return (
      <EmptyState
        icon={<UserCircle className="h-6 w-6" />}
        title="No student profile configured"
        description="Verify your university email to build trust on campus and track your reuse impact."
        actionLabel="Load Student Profile"
        onAction={() => void reload()}
      />
    );
  }

  const initials = profile.fullName
    .split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const openEditor = () => {
    setFullNameDraft(profile.fullName);
    setHallDraft(profile.residenceHall);
    setAvatarFile(null);
    setIsEditing(true);
  };

  return (
    <div className="space-y-10 pb-16">
      {/* Top Editorial Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="overflow-hidden rounded-3xl border border-zinc-200 bg-stone-100/80 p-6 sm:p-10 dark:border-zinc-800 dark:bg-zinc-900/80"
      >
        <div className="flex flex-col justify-between gap-6 lg:flex-row lg:items-center">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            {profile.avatarUrl ? (
              <img
                src={profile.avatarUrl}
                alt={profile.fullName}
                className="h-20 w-20 shrink-0 rounded-2xl object-cover ring-2 ring-zinc-900/10 dark:ring-white/15"
              />
            ) : (
              <div className="flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl bg-zinc-900 text-2xl font-bold text-white dark:bg-zinc-100 dark:text-zinc-950">
                {initials}
              </div>
            )}
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2.5">
                <h1 className="text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl dark:text-zinc-100">
                  {profile.fullName}
                </h1>
                {profile.isVerifiedStudent ? (
                  <Badge tone="emerald">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Verified .ac.uk Student
                  </Badge>
                ) : null}
                {saveSuccess ? (
                  <Badge tone="emerald">
                    <Check className="h-3.5 w-3.5" />
                    Synced to Firestore
                  </Badge>
                ) : null}
              </div>
              <p className="text-sm text-zinc-500 dark:text-zinc-400">{profile.universityEmail}</p>
              <div className="flex flex-wrap items-center gap-4 pt-1 text-xs text-zinc-600 dark:text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <GraduationCap className="h-4 w-4 text-zinc-500" />
                  {profile.universityName}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-zinc-500" />
                  {profile.residenceHall}
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={openEditor}
              className="inline-flex cursor-pointer items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <Edit3 className="h-4 w-4" />
              Edit Profile & Photo
            </button>
            <Link
              to="/settings"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-800 transition-colors hover:bg-zinc-100 dark:border-zinc-700 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <Settings className="h-4 w-4" />
              Preferences
            </Link>
            <Link
              to="/listings"
              className="inline-flex items-center gap-2 rounded-xl bg-zinc-900 px-4 py-2.5 text-xs font-semibold text-white transition-colors hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-950 dark:hover:bg-zinc-200"
            >
              <Package className="h-4 w-4" />
              Manage Listings
            </Link>
          </div>
        </div>

        {/* Inline Firestore + Firebase Storage Profile Editor */}
        {isEditing ? (
          <form
            className="mt-6 space-y-4 border-t border-zinc-200/80 pt-6 dark:border-zinc-800"
            onSubmit={(e) => {
              e.preventDefault();
              void (async () => {
                const ok = await saveProfile(
                  {
                    fullName: fullNameDraft,
                    residenceHall: hallDraft,
                  },
                  avatarFile,
                );
                if (ok) {
                  setIsEditing(false);
                }
              })();
            }}
          >
            {saveError ? (
              <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-2.5 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
                {saveError}
              </div>
            ) : null}

            <div className="grid gap-4 sm:grid-cols-3">
              <div className="space-y-1.5">
                <label
                  htmlFor="profile-fullname"
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Full Name
                </label>
                <input
                  id="profile-fullname"
                  type="text"
                  required
                  value={fullNameDraft}
                  onChange={(e) => setFullNameDraft(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="profile-hall"
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Residence Hall Pickup Point
                </label>
                <input
                  id="profile-hall"
                  type="text"
                  required
                  value={hallDraft}
                  onChange={(e) => setHallDraft(e.target.value)}
                  className="w-full rounded-xl border border-zinc-200 bg-white px-3.5 py-2 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
                />
              </div>

              <div className="space-y-1.5">
                <label
                  htmlFor="profile-avatar"
                  className="block text-xs font-medium text-zinc-700 dark:text-zinc-300"
                >
                  Avatar Photo (Firebase Storage)
                </label>
                <label
                  htmlFor="profile-avatar"
                  className="flex cursor-pointer items-center gap-2 rounded-xl border border-dashed border-zinc-300 bg-white px-3.5 py-2 text-xs text-zinc-600 hover:border-zinc-500 dark:border-zinc-700 dark:bg-zinc-950 dark:text-zinc-400"
                >
                  <Camera className="h-4 w-4 shrink-0" />
                  <span className="truncate">
                    {avatarFile ? avatarFile.name : 'Choose JPEG/PNG/WebP...'}
                  </span>
                  <input
                    id="profile-avatar"
                    type="file"
                    accept="image/jpeg,image/png,image/webp,image/gif"
                    onChange={(e) => setAvatarFile(e.target.files?.[0] ?? null)}
                    className="sr-only"
                  />
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="ghost" onClick={() => setIsEditing(false)}>
                Cancel
              </Button>
              <Button type="submit" variant="secondary" disabled={isSaving}>
                {isSaving ? 'Saving to Firebase...' : 'Save Profile'}
              </Button>
            </div>
          </form>
        ) : null}
      </motion.div>

      {/* 3-Column Metrics & Studio Highlight */}
      <div className="grid gap-6 md:grid-cols-3">
        <Card className="space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-emerald-700 uppercase dark:text-emerald-400">
            <Leaf className="h-4 w-4" />
            Circular Impact
          </div>
          <p className="text-4xl font-extrabold tabular-nums text-zinc-900 dark:text-zinc-100">
            {profile.wasteDivertedKg} kg
          </p>
          <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            Total dorm furniture, kitchenware, and tech diverted from landfill across{' '}
            {profile.itemsReusedCount} campus handovers.
          </p>
        </Card>

        <Card className="space-y-3">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold tracking-wider text-amber-600 uppercase dark:text-amber-400">
            <Award className="h-4 w-4" />
            Campus Reputation
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-4xl font-extrabold tabular-nums text-zinc-900 dark:text-zinc-100">
              {profile.rating.toFixed(1)}
            </p>
            <StarRating value={profile.rating} size="sm" />
          </div>
          <p className="text-xs leading-relaxed text-zinc-500 dark:text-zinc-400">
            100% punctual hall-to-hall pickups · Verified student seller since Autumn 2025.
          </p>
        </Card>

        <Card className="flex flex-col justify-between bg-stone-900 text-stone-100 dark:bg-zinc-900">
          <div className="flex items-center justify-between text-xs text-stone-400">
            <span>Featured 3D Listing</span>
            <Link to="/products?item=nordic-desk-lamp" className="text-amber-400 hover:underline">
              Open 3D →
            </Link>
          </div>
          <div className="my-2 h-24 w-full">
            <StudioCutoutSvg model="lamp" palette="sand" />
          </div>
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-white">Nordic Architect Desk Lamp</span>
            <span className="font-bold text-amber-300">$48</span>
          </div>
        </Card>
      </div>

      {/* Student Feedback Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100">
            Recent Campus Buyer Reviews
          </h2>
          <Link
            to="/products"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-zinc-100"
          >
            <Box className="h-3.5 w-3.5" />
            View 3D Showcase
          </Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {STUDENT_REVIEWS.map((rev) => (
            <Card key={rev.id} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                  {rev.reviewer}
                </span>
                <span className="text-xs text-zinc-400">{rev.date}</span>
              </div>
              <div className="flex items-center gap-2">
                <StarRating value={rev.rating} size="xs" />
                <span className="text-xs text-zinc-500 dark:text-zinc-400">{rev.item}</span>
              </div>
              <p className="text-sm text-zinc-600 dark:text-zinc-300">{rev.comment}</p>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}
