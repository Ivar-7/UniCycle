export type SupportedCurrency = 'KES' | 'GBP' | 'EUR';

const CURRENCY_LOCALE_MAP: Record<SupportedCurrency, string> = {
  KES: 'en-KE',
  GBP: 'en-GB',
  EUR: 'en-IE',
};

export function formatCurrency(amount: number, currency: SupportedCurrency = 'KES'): string {
  const fractionDigits = amount % 1 === 0 ? 0 : 2;
  if (currency === 'KES') {
    const formattedNumber = new Intl.NumberFormat('en-KE', {
      maximumFractionDigits: fractionDigits,
      minimumFractionDigits: fractionDigits,
    }).format(amount);
    return `Ksh ${formattedNumber}`;
  }
  return new Intl.NumberFormat(CURRENCY_LOCALE_MAP[currency], {
    style: 'currency',
    currency,
    maximumFractionDigits: fractionDigits,
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
