import { lazy } from 'react';
import { createBrowserRouter, Navigate, RouterProvider } from 'react-router-dom';
import { RootLayout } from './layouts/RootLayout';

const MarketplacePage = lazy(() => import('@/features/marketplace/pages/MarketplacePage'));
const ProductShowcasePage = lazy(() => import('@/features/showcase/pages/ProductShowcasePage'));
const ListingsPage = lazy(() => import('@/features/listings/pages/ListingsPage'));
const WishlistPage = lazy(() => import('@/features/wishlist/pages/WishlistPage'));
const MessagesPage = lazy(() => import('@/features/messages/pages/MessagesPage'));
const OrdersPage = lazy(() => import('@/features/orders/pages/OrdersPage'));
const ProfilePage = lazy(() => import('@/features/profile/pages/ProfilePage'));
const SettingsPage = lazy(() => import('@/features/settings/pages/SettingsPage'));
const AboutPage = lazy(() => import('@/features/about/pages/AboutPage'));
const AuthPage = lazy(() => import('@/features/auth/pages/AuthPage'));

const browserRouter = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <MarketplacePage />,
      },
      {
        path: 'products',
        element: <ProductShowcasePage />,
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
