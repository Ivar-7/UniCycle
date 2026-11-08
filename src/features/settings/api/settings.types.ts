export interface StudentSettings {
  readonly defaultCampusHall: string;
  readonly priceDropAlerts: boolean;
  readonly instantMessageAlerts: boolean;
  readonly pickupReminders: boolean;
  readonly showVerifiedBadgePublicly: boolean;
  readonly ecoImpactPublic: boolean;
  readonly preferredCurrency: 'USD' | 'GBP' | 'EUR';
}
