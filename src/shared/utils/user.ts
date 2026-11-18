import type { User } from 'firebase/auth';

export function isCampusEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  return normalized.endsWith('.ac.uk') || normalized.endsWith('.edu');
}

export function resolveDisplayName(
  user: Pick<User, 'displayName' | 'email'>,
  fallback: string,
): string {
  return user.displayName?.trim() || user.email?.split('@')[0] || fallback;
}
