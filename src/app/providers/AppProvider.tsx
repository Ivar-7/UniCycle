import { ErrorBoundary } from '@/shared/errors';
import { AppRouter } from '../router';
import { AuthProvider } from './AuthProvider';
import { ThemeProvider } from './ThemeProvider';

export function AppProvider() {
  return (
    <ErrorBoundary>
      <ThemeProvider>
        <AuthProvider>
          <AppRouter />
        </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}
