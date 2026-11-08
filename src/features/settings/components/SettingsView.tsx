import { Bell, Check, Database, Globe, MapPin, Moon, RotateCcw, Shield, Sun } from 'lucide-react';
import { motion } from 'motion/react';
import { useTheme } from '@/shared/hooks/useTheme';
import { Badge, Button, Card, EmptyState, ErrorState, LoadingState } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';
import { CAMPUS_HALL_OPTIONS } from '../api/settings.api';
import { useSettings } from '../state/useSettings';

export function SettingsView() {
  const { theme, setTheme } = useTheme();
  const {
    status,
    settings,
    error,
    actionError,
    savedBanner,
    updateSetting,
    resetSeedData,
    reload,
  } = useSettings();

  if (status === 'loading') {
    return <LoadingState label="Loading account settings..." />;
  }

  if (status === 'error' && error) {
    return <ErrorState error={error} onRetry={reload} />;
  }

  if (!settings) {
    return (
      <EmptyState
        title="Settings unavailable"
        description="Unable to load your student preferences."
        actionLabel="Reload"
        onAction={() => void reload()}
      />
    );
  }

  return (
    <div className="mx-auto max-w-4xl space-y-10 pb-16">
      {/* Header */}
      <div className="flex flex-col justify-between gap-4 border-b border-zinc-200 pb-6 sm:flex-row sm:items-end dark:border-zinc-800">
        <div className="space-y-2">
          <span className="text-xs font-medium uppercase tracking-widest text-zinc-500 dark:text-zinc-400">
            Preferences
          </span>
          <h1 className="text-3xl font-semibold tracking-tight text-zinc-900 dark:text-zinc-100">
            Account & Studio Settings
          </h1>
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Configure your appearance theme, default residence hall pickup location, and campus
            notifications.
          </p>
        </div>
        {savedBanner ? (
          <Badge tone="emerald">
            <Check className="h-3.5 w-3.5" />
            Synced with Firebase
          </Badge>
        ) : null}
      </div>

      {actionError ? (
        <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-xs font-medium text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/40 dark:text-rose-300">
          {actionError}
        </div>
      ) : null}

      {/* Appearance Section: Light (Default) vs Dark Studio */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4"
      >
        <div className="space-y-1">
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Appearance & Theme
          </h2>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Light theme is the default editorial view. Switch between Light and Dark studio modes at
            any time.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => setTheme('light')}
            className={cn(
              'flex flex-col gap-4 rounded-2xl border p-5 text-left transition-all',
              theme === 'light'
                ? 'border-zinc-900 bg-white ring-2 ring-zinc-900 dark:border-zinc-100 dark:bg-zinc-900 dark:ring-zinc-100'
                : 'border-zinc-200 bg-white/60 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/50',
            )}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                <Sun className="h-4 w-4 text-amber-500" />
                Light Gallery (Default)
              </span>
              {theme === 'light' ? <Badge tone="emerald">Active</Badge> : null}
            </div>
            <div className="h-20 rounded-xl border border-stone-200 bg-stone-100 p-3">
              <div className="h-3 w-24 rounded-sm bg-zinc-800" />
              <div className="mt-2 h-2 w-36 rounded-sm bg-zinc-400" />
              <div className="mt-3 flex gap-2">
                <span className="h-4 w-12 rounded-sm bg-zinc-900" />
                <span className="h-4 w-4 rounded-full bg-amber-300" />
              </div>
            </div>
          </button>

          <button
            type="button"
            onClick={() => setTheme('dark')}
            className={cn(
              'flex flex-col gap-4 rounded-2xl border p-5 text-left transition-all',
              theme === 'dark'
                ? 'border-zinc-900 bg-white ring-2 ring-zinc-900 dark:border-zinc-100 dark:bg-zinc-900 dark:ring-zinc-100'
                : 'border-zinc-200 bg-white/60 hover:border-zinc-400 dark:border-zinc-800 dark:bg-zinc-900/50',
            )}
          >
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
                <Moon className="h-4 w-4 text-indigo-400" />
                Dark Studio Spotlight
              </span>
              {theme === 'dark' ? <Badge tone="emerald">Active</Badge> : null}
            </div>
            <div className="h-20 rounded-xl border border-zinc-800 bg-zinc-950 p-3">
              <div className="h-3 w-24 rounded-sm bg-zinc-100" />
              <div className="mt-2 h-2 w-36 rounded-sm bg-zinc-600" />
              <div className="mt-3 flex gap-2">
                <span className="h-4 w-12 rounded-sm bg-white" />
                <span className="h-4 w-4 rounded-full bg-indigo-500" />
              </div>
            </div>
          </button>
        </div>
      </motion.section>

      {/* Campus Pickup Location & Currency */}
      <Card className="space-y-6">
        <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-4 dark:border-zinc-800">
          <MapPin className="h-4 w-4 text-zinc-500" />
          <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
            Campus Logistics & Currency
          </h2>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <div className="space-y-2">
            <label
              htmlFor="campus-hall-select"
              className="block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
            >
              Default Residence Hall Pickup Point
            </label>
            <select
              id="campus-hall-select"
              value={settings.defaultCampusHall}
              onChange={(e) => void updateSetting('defaultCampusHall', e.target.value)}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
            >
              {CAMPUS_HALL_OPTIONS.map((hall) => (
                <option key={hall} value={hall}>
                  {hall}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="currency-select"
              className="block text-xs font-medium uppercase tracking-wider text-zinc-500 dark:text-zinc-400"
            >
              Display Currency
            </label>
            <div className="relative">
              <Globe className="pointer-events-none absolute top-3 left-3.5 h-4 w-4 text-zinc-400" />
              <select
                id="currency-select"
                value={settings.preferredCurrency}
                onChange={(e) =>
                  void updateSetting('preferredCurrency', e.target.value as 'USD' | 'GBP' | 'EUR')
                }
                className="w-full rounded-xl border border-zinc-200 bg-zinc-50 py-2.5 pr-3.5 pl-10 text-sm text-zinc-900 focus:border-zinc-500 focus:outline-none dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-100"
              >
                <option value="USD">USD ($) — US Dollar</option>
                <option value="GBP">GBP (£) — British Pound</option>
                <option value="EUR">EUR (€) — Euro</option>
              </select>
            </div>
          </div>
        </div>
      </Card>

      {/* Notifications & Privacy */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="space-y-5">
          <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <Bell className="h-4 w-4 text-zinc-500" />
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Notifications
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                key: 'priceDropAlerts' as const,
                title: 'Wishlist Price Drops',
                desc: 'Alert when saved student items drop in price.',
              },
              {
                key: 'instantMessageAlerts' as const,
                title: 'Buyer & Seller Messages',
                desc: 'Real-time notifications for campus pickup chats.',
              },
              {
                key: 'pickupReminders' as const,
                title: 'Handover Reminders',
                desc: 'Remind 30 minutes before scheduled hall meetups.',
              },
            ].map((item) => {
              const enabled = settings[item.key];
              return (
                <div key={item.key} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {item.title}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={enabled}
                    aria-label={item.title}
                    onClick={() => void updateSetting(item.key, !enabled)}
                    className={cn(
                      'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors',
                      enabled ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-300 dark:bg-zinc-800',
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-3.5 w-3.5 rounded-full transition-transform',
                        enabled
                          ? 'translate-x-4 bg-white dark:bg-zinc-950'
                          : 'translate-x-0.5 bg-white dark:bg-zinc-400',
                      )}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>

        <Card className="space-y-5">
          <div className="flex items-center gap-2.5 border-b border-zinc-100 pb-3 dark:border-zinc-800">
            <Shield className="h-4 w-4 text-zinc-500" />
            <h2 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">
              Campus Trust & Privacy
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                key: 'showVerifiedBadgePublicly' as const,
                title: 'Public Academic Verification Badge',
                desc: 'Show your verified university status on listings.',
              },
              {
                key: 'ecoImpactPublic' as const,
                title: 'Share Circular Reuse Impact',
                desc: 'Display total kilograms of waste diverted on profile.',
              },
            ].map((item) => {
              const enabled = settings[item.key];
              return (
                <div key={item.key} className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-zinc-900 dark:text-zinc-100">
                      {item.title}
                    </p>
                    <p className="text-xs text-zinc-500 dark:text-zinc-400">{item.desc}</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={enabled}
                    aria-label={item.title}
                    onClick={() => void updateSetting(item.key, !enabled)}
                    className={cn(
                      'relative inline-flex h-5 w-9 shrink-0 cursor-pointer items-center rounded-full transition-colors',
                      enabled ? 'bg-zinc-900 dark:bg-zinc-100' : 'bg-zinc-300 dark:bg-zinc-800',
                    )}
                  >
                    <span
                      className={cn(
                        'inline-block h-3.5 w-3.5 rounded-full transition-transform',
                        enabled
                          ? 'translate-x-4 bg-white dark:bg-zinc-950'
                          : 'translate-x-0.5 bg-white dark:bg-zinc-400',
                      )}
                    />
                  </button>
                </div>
              );
            })}
          </div>
        </Card>
      </div>

      {/* Firebase Seed Data Management */}
      <Card className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-900 dark:text-zinc-100">
            <Database className="h-4 w-4 text-zinc-500" />
            Firebase & Seed Data Synchronization
          </div>
          <p className="text-xs text-zinc-500 dark:text-zinc-400">
            Reset local seed cache and re-synchronize initial campus marketplace data with Cloud
            Firestore.
          </p>
        </div>
        <Button type="button" variant="secondary" onClick={() => void resetSeedData()}>
          <RotateCcw className="h-3.5 w-3.5" />
          Reset & Re-seed Data
        </Button>
      </Card>
    </div>
  );
}
