import {
  Heart,
  Info,
  LogIn,
  Menu,
  MessageSquare,
  Moon,
  Package,
  Settings,
  ShoppingBag,
  Store,
  Sun,
  User,
  X,
} from 'lucide-react';
import { Suspense, useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { useAuth } from '@/shared/hooks/useAuth';
import { useSavedItems } from '@/shared/hooks/useSavedItems';
import { useTheme } from '@/shared/hooks/useTheme';
import { LoadingState, UniCycleLogo } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';
import { resolveDisplayName } from '@/shared/utils/user';

interface NavItem {
  readonly to: string;
  readonly label: string;
  readonly icon: typeof Store;
}

const PRIMARY_NAV_ITEMS: readonly NavItem[] = [
  { to: '/', label: 'Shop', icon: Store },
  { to: '/listings', label: 'Sell', icon: Package },
  { to: '/messages', label: 'Inbox', icon: MessageSquare },
  { to: '/orders', label: 'Pickups', icon: ShoppingBag },
  { to: '/about', label: 'About', icon: Info },
];

const MOBILE_NAV_ITEMS: readonly NavItem[] = [
  ...PRIMARY_NAV_ITEMS,
  { to: '/wishlist', label: 'Saved Bag', icon: Heart },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
];

export function RootLayout() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();
  const { entries } = useSavedItems();
  const location = useLocation();
  const currentRouteKey = `${location.pathname}${location.search}`;
  const [openMenuRouteKey, setOpenMenuRouteKey] = useState<string | null>(null);
  const mobileMenuOpen = openMenuRouteKey === currentRouteKey;

  const savedCount = entries.length;
  const accountLabel = user ? resolveDisplayName(user, 'Account') : 'Account';
  const signInTarget =
    location.pathname === '/auth'
      ? '/auth'
      : `/auth?redirect=${encodeURIComponent(currentRouteKey)}`;

  useEffect(() => {
    if (!mobileMenuOpen) {
      return;
    }
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setOpenMenuRouteKey(null);
      }
    };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [mobileMenuOpen]);

  return (
    <div className="flex min-h-dvh flex-col overflow-x-clip bg-white text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-xl focus:bg-sky-700 focus:px-4 focus:py-2 focus:text-xs focus:font-semibold focus:text-white dark:focus:bg-sky-700 dark:focus:text-sky-50"
      >
        Skip to content
      </a>

      {/* Sticky Single-Row Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90">
        <div className="flex h-16 w-full items-center justify-between gap-3 px-4 sm:px-6 lg:px-10 xl:px-12">
          <NavLink to="/" className="flex min-w-0 shrink-0 items-center gap-2.5">
            <UniCycleLogo className="h-7 w-7 text-zinc-800 dark:text-zinc-200" />
            <div className="min-w-0">
              <span className="block text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                UniCycle
              </span>
              <span className="hidden text-xs text-zinc-500 sm:block dark:text-zinc-400">
                Campus Pre-Owned Essentials
              </span>
            </div>
          </NavLink>

          {/* Desktop Primary Navigation */}
          <nav aria-label="Main navigation" className="hidden items-center gap-1 lg:flex">
            {PRIMARY_NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors',
                      isActive
                        ? 'border border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-800/70 dark:bg-sky-950/60 dark:text-sky-200'
                        : 'border border-transparent text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100',
                    )
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          {/* Right Utility Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <NavLink
              to="/wishlist"
              aria-label={`Saved bag (${savedCount} items)`}
              className={({ isActive }) =>
                cn(
                  'relative inline-flex h-9 items-center gap-1.5 rounded-xl border px-2.5 text-xs font-medium transition-colors',
                  isActive
                    ? 'border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-800/70 dark:bg-sky-950/60 dark:text-sky-200'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800',
                )
              }
            >
              <Heart className="h-4 w-4" />
              <span className="hidden sm:inline">Saved</span>
              {savedCount > 0 ? (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-sky-700 px-1 text-xs font-semibold tabular-nums text-white dark:bg-sky-700 dark:text-sky-50">
                  {savedCount}
                </span>
              ) : null}
            </NavLink>

            <Link
              to="/settings"
              aria-label="Preferences and settings"
              className="hidden h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-100 lg:inline-flex dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              <Settings className="h-4 w-4" />
            </Link>

            {user ? (
              <Link
                to="/profile"
                className="hidden max-w-40 items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 sm:inline-flex dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                <User className="h-3.5 w-3.5 shrink-0" />
                <span className="truncate">{accountLabel}</span>
              </Link>
            ) : (
              <Link
                to={signInTarget}
                className="hidden h-9 items-center gap-1.5 rounded-xl border border-zinc-200 bg-white px-3 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 sm:inline-flex dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
              >
                <LogIn className="h-3.5 w-3.5 shrink-0" />
                <span>Sign In</span>
              </Link>
            )}

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              type="button"
              onClick={() =>
                setOpenMenuRouteKey((prev) => (prev === currentRouteKey ? null : currentRouteKey))
              }
              aria-label={mobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={mobileMenuOpen}
              aria-controls="mobile-nav-drawer"
              className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-100 lg:hidden dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {mobileMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile & Tablet Navigation Drawer */}
      {mobileMenuOpen ? (
        <div
          id="mobile-nav-drawer"
          role="dialog"
          aria-modal="true"
          aria-label="Site navigation"
          className="fixed inset-0 z-50 flex justify-end bg-black/50 backdrop-blur-xs lg:hidden"
          onClick={() => setOpenMenuRouteKey(null)}
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="flex h-dvh w-full max-w-xs flex-col border-l border-zinc-200 bg-white shadow-2xl dark:border-zinc-800 dark:bg-zinc-950"
          >
            <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-4 dark:border-zinc-800">
              <div className="flex items-center gap-2">
                <UniCycleLogo className="h-6 w-6 text-zinc-800 dark:text-zinc-200" />
                <span className="text-sm font-bold text-zinc-900 dark:text-zinc-100">UniCycle</span>
              </div>
              <button
                type="button"
                aria-label="Close navigation menu"
                onClick={() => setOpenMenuRouteKey(null)}
                className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-100 dark:hover:bg-zinc-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <nav aria-label="Mobile navigation" className="flex-1 space-y-1 overflow-y-auto p-4">
              {MOBILE_NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/'}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-colors',
                        isActive
                          ? 'border border-sky-200 bg-sky-50 text-sky-900 dark:border-sky-800/70 dark:bg-sky-950/60 dark:text-sky-200'
                          : 'text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900',
                      )
                    }
                  >
                    <span className="flex items-center gap-3">
                      <Icon className="h-4 w-4" />
                      {item.label}
                    </span>
                    {item.to === '/wishlist' && savedCount > 0 ? (
                      <span className="rounded-full bg-sky-700 px-2 py-0.5 text-xs font-semibold text-white dark:bg-sky-700 dark:text-sky-50">
                        {savedCount}
                      </span>
                    ) : null}
                  </NavLink>
                );
              })}
            </nav>

            <div className="border-t border-zinc-200 p-4 dark:border-zinc-800">
              {user ? (
                <Link
                  to="/profile"
                  className="flex items-center justify-between rounded-xl border border-zinc-200 bg-zinc-50 px-3.5 py-2.5 text-xs font-medium text-zinc-700 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200"
                >
                  <span className="truncate">{user.email}</span>
                  <span className="ml-2 shrink-0 font-semibold text-zinc-900 dark:text-zinc-100">
                    Profile
                  </span>
                </Link>
              ) : (
                <Link
                  to={signInTarget}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-zinc-200 bg-white px-4 py-2.5 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-100 dark:hover:bg-zinc-800"
                >
                  <LogIn className="h-4 w-4" />
                  Sign In
                </Link>
              )}
            </div>
          </div>
        </div>
      ) : null}

      {/* Main Content */}
      <main id="main-content" className="w-full flex-1 px-4 pt-6 sm:px-6 sm:pt-8 lg:px-10 xl:px-12">
        <Suspense fallback={<LoadingState label="Loading page..." />}>
          <Outlet />
        </Suspense>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-200 bg-zinc-50/70 py-10 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        <div className="flex w-full flex-col justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-10 xl:px-12">
          <div className="space-y-1">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
              UniCycle — Student Marketplace for Pre-Owned Household Essentials
            </p>
            <p>
              Promoting campus reuse, student affordability, and zero-waste on-campus handovers.
            </p>
          </div>

          <nav aria-label="Footer links" className="flex flex-wrap items-center gap-x-5 gap-y-2">
            <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Shop
            </Link>
            <Link to="/listings" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Sell
            </Link>
            <Link to="/about" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              About
            </Link>
            <Link to="/settings" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Settings
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
