import { RotateCcw } from 'lucide-react';
import { lazy } from 'react';
import { createBrowserRouter, Link, Navigate, RouterProvider } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';

const MarketplacePage = lazy(() => import('@/features/marketplace/pages/MarketplacePage'));
const ItemDetailPage = lazy(() => import('@/features/marketplace/pages/ItemDetailPage'));
const ListingsPage = lazy(() => import('@/features/listings/pages/ListingsPage'));
const WishlistPage = lazy(() => import('@/features/wishlist/pages/WishlistPage'));
const MessagesPage = lazy(() => import('@/features/messages/pages/MessagesPage'));
const OrdersPage = lazy(() => import('@/features/orders/pages/OrdersPage'));
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'));
const AboutPage = lazy(() => import('@/features/about/pages/AboutPage'));
const AuthPage = lazy(() => import('@/features/auth/pages/AuthPage'));

function RouteErrorFallback() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center justify-center py-20 text-center">
      <h1 className="text-xl font-semibold text-zinc-900 dark:text-zinc-100">
        Unable to load this page
      </h1>
      <p className="mt-2 text-sm text-zinc-600 dark:text-zinc-400">
        A network hiccup or updated build prevented this view from loading.
      </p>
      <div className="mt-6 flex flex-wrap justify-center gap-3">
        <button
          type="button"
          onClick={() => window.location.reload()}
          className="inline-flex items-center gap-2 rounded-xl border border-zinc-300 bg-zinc-200/80 px-4 py-2 text-xs font-semibold text-zinc-900 hover:bg-zinc-300/80 dark:border-zinc-600 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reload Page
        </button>
        <Link
          to="/"
          className="inline-flex items-center rounded-xl border border-zinc-300 px-4 py-2 text-xs font-semibold text-zinc-800 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 dark:hover:bg-zinc-800"
        >
          Return to Shop
        </Link>
      </div>
    </div>
  );
}

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorFallback />,
    children: [
      {
        index: true,
        element: <MarketplacePage />,
      },
      {
        path: 'item/:id',
        element: <ItemDetailPage />,
      },
      {
        path: 'listings',
        element: <ListingsPage />,
      },
      {
        path: 'wishlist',
        element: <WishlistPage />,
      },
      {
        path: 'messages',
        element: <MessagesPage />,
      },
      {
        path: 'orders',
        element: <OrdersPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
      {
        path: 'about',
        element: <AboutPage />,
      },
      {
        path: 'auth',
        element: <AuthPage />,
      },
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
]);

export function AppRouter() {
  return <RouterProvider router={browserRouter} />;
}
