import { createContext } from 'react';
import type { StudentSettings } from '@/features/settings/api/settings.types';
import type { SupportedCurrency } from '@/shared/utils/format';

export interface PreferencesContextValue {
  readonly currency: SupportedCurrency;
  readonly defaultCampusHall: string;
  readonly formatPrice: (amount: number) => string;
  readonly syncFromSettings: (settings: StudentSettings) => void;
}

export const PreferencesContext = createContext<PreferencesContextValue | null>(null);
