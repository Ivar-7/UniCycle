import type { z } from 'zod';
import { logDiagnosticError } from '@/shared/errors';

export function readJsonStorage<T>(key: string, schema: z.ZodType<T>): T | null {
  if (typeof window === 'undefined') {
    return null;
  }
  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return null;
    }
    const parsed: unknown = JSON.parse(raw);
    const result = schema.safeParse(parsed);
    return result.success ? result.data : null;
  } catch (err: unknown) {
    logDiagnosticError(err, `readJsonStorage(${key})`);
    return null;
  }
}

export function writeJsonStorage(key: string, value: unknown): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(key, JSON.stringify(value));
  } catch (err: unknown) {
    logDiagnosticError(err, `writeJsonStorage(${key})`);
  }
}
