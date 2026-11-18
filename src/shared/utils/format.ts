export type SupportedCurrency = 'USD' | 'GBP' | 'EUR';

const CURRENCY_LOCALE_MAP: Record<SupportedCurrency, string> = {
  USD: 'en-US',
  GBP: 'en-GB',
  EUR: 'en-IE',
};

export function formatCurrency(amount: number, currency: SupportedCurrency = 'USD'): string {
  return new Intl.NumberFormat(CURRENCY_LOCALE_MAP[currency], {
    style: 'currency',
    currency,
    maximumFractionDigits: amount % 1 === 0 ? 0 : 2,
  }).format(amount);
}

export function formatRelativeDate(isoDate: string): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  }).format(date);
}
