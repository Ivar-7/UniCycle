import {
  Box,
  Heart,
  Info,
  LogIn,
  MessageSquare,
  Moon,
  Package,
  Recycle,
  Settings,
  ShoppingBag,
  Store,
  Sun,
  User,
} from 'lucide-react';
import { Suspense } from 'react';
import { Link, NavLink, Outlet } from 'react-router-dom';
import { firebaseConfig } from '@/shared/firebase';
import { useAuth } from '@/shared/hooks/useAuth';
import { useTheme } from '@/shared/hooks/useTheme';
import { LoadingState } from '@/shared/ui';
import { cn } from '@/shared/utils/cn';

interface NavItem {
  readonly to: string;
  readonly label: string;
  readonly icon: typeof Store;
}

const NAV_ITEMS: readonly NavItem[] = [
  { to: '/', label: 'Shop', icon: Store },
  { to: '/products', label: '3D Studio', icon: Box },
  { to: '/listings', label: 'Sell', icon: Package },
  { to: '/wishlist', label: 'Saved', icon: Heart },
  { to: '/messages', label: 'Inbox', icon: MessageSquare },
  { to: '/orders', label: 'Pickups', icon: ShoppingBag },
  { to: '/profile', label: 'Profile', icon: User },
  { to: '/settings', label: 'Settings', icon: Settings },
  { to: '/about', label: 'About', icon: Info },
];

export function RootLayout() {
  const { theme, toggleTheme } = useTheme();
  const { user } = useAuth();

  return (
    <div className="flex min-h-screen flex-col bg-white text-zinc-900 transition-colors dark:bg-zinc-950 dark:text-zinc-100">
      {/* Top Editorial Header */}
      <header className="sticky top-0 z-40 border-b border-zinc-200/80 bg-white/90 backdrop-blur-md dark:border-zinc-800/80 dark:bg-zinc-950/90">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-4 px-4 py-3.5 sm:px-6 lg:px-8">
          <NavLink to="/" className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950">
              <Recycle className="h-5 w-5" />
            </div>
            <div>
              <span className="text-base font-bold tracking-tight text-zinc-900 dark:text-zinc-100">
                UniCycle
              </span>
              <span className="block text-xs text-zinc-500 dark:text-zinc-400">
                Student Pre-Owned Essentials
              </span>
            </div>
          </NavLink>

          <nav aria-label="Main navigation" className="flex flex-wrap items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/'}
                  className={({ isActive }) =>
                    cn(
                      'inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-medium transition-colors',
                      isActive
                        ? 'bg-zinc-900 text-white dark:bg-zinc-100 dark:text-zinc-950'
                        : 'text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900 dark:text-zinc-400 dark:hover:bg-zinc-900 dark:hover:text-zinc-100',
                    )
                  }
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>

          <div className="flex items-center gap-2">
            <Link
              to="/auth"
              className="inline-flex items-center gap-1.5 rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-300 dark:hover:bg-zinc-800"
            >
              <LogIn className="h-3.5 w-3.5" />
              <span>{user?.email ?? 'Student Sign In'}</span>
            </Link>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
              title={`Current theme: ${theme}. Click to toggle.`}
              className="inline-flex h-9 w-9 items-center justify-center rounded-xl border border-zinc-200 bg-white text-zinc-700 transition-colors hover:bg-zinc-100 dark:border-zinc-800 dark:bg-zinc-900 dark:text-zinc-200 dark:hover:bg-zinc-800"
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-8 sm:px-6 lg:px-8">
        <Suspense fallback={<LoadingState label="Loading UniCycle module..." />}>
          <Outlet />
        </Suspense>
      </main>

      {/* Editorial Footer */}
      <footer className="border-t border-zinc-200 bg-zinc-50/60 py-10 text-xs text-zinc-500 dark:border-zinc-800 dark:bg-zinc-950 dark:text-zinc-400">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-6 px-4 sm:flex-row sm:items-center sm:px-6 lg:px-8">
          <div className="space-y-1">
            <p className="font-semibold text-zinc-900 dark:text-zinc-100">
              UniCycle — A Student-Centred Digital Marketplace for Pre-Owned Household Essentials
            </p>
            <p>
              Promoting campus reuse, student affordability, and zero-waste hall-to-hall handovers.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Link to="/" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Shop
            </Link>
            <Link to="/products" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              3D Studio
            </Link>
            <Link to="/about" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              About
            </Link>
            <Link to="/settings" className="hover:text-zinc-900 dark:hover:text-zinc-100">
              Settings
            </Link>
            <span className="text-zinc-400 dark:text-zinc-600">
              Firebase: {firebaseConfig.projectId}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
