import { MotionConfig } from 'motion/react';
import { ErrorBoundary } from '@/shared/errors';
import { AppRouter } from '../router';
import { AuthProvider } from './AuthProvider';
import { PreferencesProvider } from './PreferencesProvider';
import { ThemeProvider } from './ThemeProvider';
import { WishlistProvider } from './WishlistProvider';

export function AppProvider() {
  return (
    <ErrorBoundary>
      <MotionConfig reducedMotion="user">
        <ThemeProvider>
          <AuthProvider>
            <PreferencesProvider>
              <WishlistProvider>
                <AppRouter />
              </WishlistProvider>
            </PreferencesProvider>
          </AuthProvider>
        </ThemeProvider>
      </MotionConfig>
    </ErrorBoundary>
  );
}
