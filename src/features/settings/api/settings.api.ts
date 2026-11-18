import { fetchUserDocument, upsertUserDocument } from '@/shared/firebase';
import { readJsonStorage, writeJsonStorage } from '@/shared/utils/storage';
import { studentSettingsSchema } from './settings.schema';
import type { StudentSettings } from './settings.types';

const LOCAL_SETTINGS_KEY = 'unicycle.preferences.v1';

export const CAMPUS_HALL_OPTIONS: readonly string[] = [
  'North Hall Residence · Block B',
  'Oakwood Student Village',
  'Eastgate Courts · Block A',
  'Westgate Student Village',
  'Central Campus Union Hub',
  'Riverside Courts',
];

const DEFAULT_SETTINGS: StudentSettings = {
  defaultCampusHall: 'North Hall Residence · Block B',
  priceDropAlerts: true,
  instantMessageAlerts: true,
  pickupReminders: true,
  showVerifiedBadgePublicly: true,
  ecoImpactPublic: true,
  preferredCurrency: 'USD',
};

export function readLocalPreferences(): StudentSettings {
  return readJsonStorage(LOCAL_SETTINGS_KEY, studentSettingsSchema) ?? DEFAULT_SETTINGS;
}

export function writeLocalPreferences(settings: StudentSettings): void {
  writeJsonStorage(LOCAL_SETTINGS_KEY, settings);
}

export async function fetchStudentSettings(userId: string | null): Promise<StudentSettings> {
  const local = readLocalPreferences();
  if (!userId) {
    return local;
  }

  const remote = await fetchUserDocument('settings', userId, studentSettingsSchema);
  if (remote) {
    writeLocalPreferences(remote);
    return remote;
  }

  return upsertUserDocument('settings', userId, local, studentSettingsSchema);
}

export async function saveStudentSettings(
  settings: StudentSettings,
  userId: string | null,
): Promise<StudentSettings> {
  const validated = studentSettingsSchema.parse(settings);
  writeLocalPreferences(validated);

  if (!userId) {
    return validated;
  }

  return upsertUserDocument('settings', userId, validated, studentSettingsSchema);
}
