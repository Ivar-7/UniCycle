import {
  clearLocalSeedCache,
  fetchDocumentWithSeed,
  firebaseAuth,
  upsertSingleDocument,
} from '@/shared/firebase';
import { studentSettingsSchema } from './settings.schema';
import type { StudentSettings } from './settings.types';

export const CAMPUS_HALL_OPTIONS: readonly string[] = [
  'North Hall Residence · Block B',
  'Oakwood Student Village',
  'Eastgate Courts · Block A',
  'Westgate Student Village',
  'Central Campus Union Hub',
  'Riverside Courts',
];

export const DEFAULT_SETTINGS: StudentSettings = {
  defaultCampusHall: 'North Hall Residence · Block B',
  priceDropAlerts: true,
  instantMessageAlerts: true,
  pickupReminders: true,
  showVerifiedBadgePublicly: true,
  ecoImpactPublic: true,
  preferredCurrency: 'USD',
};

function getSettingsDocId(): string {
  return firebaseAuth.currentUser?.uid ?? 'default';
}

export async function fetchStudentSettings(): Promise<StudentSettings> {
  return fetchDocumentWithSeed(
    'settings',
    getSettingsDocId(),
    studentSettingsSchema,
    DEFAULT_SETTINGS,
  );
}

export async function saveStudentSettings(settings: StudentSettings): Promise<StudentSettings> {
  return upsertSingleDocument('settings', getSettingsDocId(), settings, studentSettingsSchema);
}

export function resetAllCampusSeedCache(): void {
  clearLocalSeedCache();
}
