import type { AppError, ErrorCode, ErrorSeverity } from './error.types';

const USER_MESSAGES: Record<ErrorCode, string> = {
  AUTH_UNAUTHORIZED: 'Please sign in with your verified university account to continue.',
  AUTH_INVALID_CREDENTIALS:
    'The university email or password entered is incorrect. Please check and try again.',
  AUTH_EMAIL_IN_USE:
    'An account with this university email already exists. Please sign in instead.',
  AUTH_WEAK_PASSWORD: 'Please choose a stronger password with at least 8 characters.',
  AUTH_FORBIDDEN: 'You do not have permission to modify this campus resource.',
  STORAGE_UPLOAD_FAILED:
    'Unable to upload your image to Firebase Storage. Please check your connection or try a smaller image.',
  STORAGE_INVALID_FILE: 'Please select a valid JPEG, PNG, or WebP image under 5 MB.',
  NETWORK_OFFLINE:
    'Unable to reach Firebase. Please check your campus Wi-Fi or network connection.',
  RESOURCE_NOT_FOUND: 'The requested marketplace listing or document could not be found.',
  VALIDATION_FAILED: 'Some of the information provided is invalid. Please review and try again.',
  FIREBASE_ERROR:
    'A service error occurred while syncing with UniCycle Firebase. Please try again.',
  UNKNOWN_ERROR: 'Something went wrong on our end. Please refresh or try again in a moment.',
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null;
}

export function resolveErrorCode(error: unknown): ErrorCode {
  if (isRecord(error) && typeof error.code === 'string') {
    const rawCode = error.code.toLowerCase();
    if (
      rawCode.includes('auth/invalid-credential') ||
      rawCode.includes('auth/wrong-password') ||
      rawCode.includes('auth/user-not-found') ||
      rawCode.includes('auth/invalid-email')
    ) {
      return 'AUTH_INVALID_CREDENTIALS';
    }
    if (rawCode.includes('auth/email-already-in-use')) {
      return 'AUTH_EMAIL_IN_USE';
    }
    if (rawCode.includes('auth/weak-password')) {
      return 'AUTH_WEAK_PASSWORD';
    }
    if (rawCode.includes('unauthenticated') || rawCode.includes('auth/')) {
      return 'AUTH_UNAUTHORIZED';
    }
    if (rawCode.includes('permission-denied') || rawCode.includes('storage/unauthorized')) {
      return 'AUTH_FORBIDDEN';
    }
    if (rawCode.includes('storage/')) {
      return 'STORAGE_UPLOAD_FAILED';
    }
    if (rawCode.includes('not-found')) {
      return 'RESOURCE_NOT_FOUND';
    }
    if (rawCode.includes('network') || rawCode.includes('unavailable')) {
      return 'NETWORK_OFFLINE';
    }
    if (
      rawCode.includes('firestore') ||
      rawCode.includes('firebase') ||
      rawCode.includes('failed-precondition')
    ) {
      return 'FIREBASE_ERROR';
    }
  }

  if (error instanceof Error) {
    if (error.name === 'ZodError') {
      return 'VALIDATION_FAILED';
    }
    const lowerMsg = error.message.toLowerCase();
    if (lowerMsg.includes('academic') || lowerMsg.includes('validation')) {
      return 'VALIDATION_FAILED';
    }
    if (lowerMsg.includes('file') && lowerMsg.includes('5mb')) {
      return 'STORAGE_INVALID_FILE';
    }
  }

  return 'UNKNOWN_ERROR';
}

export function normalizeError(
  error: unknown,
  fallbackCode: ErrorCode = 'UNKNOWN_ERROR',
  severity: ErrorSeverity = 'error',
): AppError {
  if (
    isRecord(error) &&
    typeof error.code === 'string' &&
    typeof error.userMessage === 'string' &&
    typeof error.diagnosticMessage === 'string'
  ) {
    return {
      code: error.code as ErrorCode,
      userMessage: error.userMessage,
      diagnosticMessage: error.diagnosticMessage,
      severity: (error.severity as ErrorSeverity) ?? severity,
      timestamp: typeof error.timestamp === 'string' ? error.timestamp : new Date().toISOString(),
    };
  }

  const resolvedCode = resolveErrorCode(error);
  const code = resolvedCode === 'UNKNOWN_ERROR' ? fallbackCode : resolvedCode;
  const diagnosticMessage =
    error instanceof Error
      ? `${error.name}: ${error.message}`
      : typeof error === 'string'
        ? error
        : 'Unknown non-Error exception';

  return {
    code,
    userMessage: USER_MESSAGES[code],
    diagnosticMessage,
    severity,
    timestamp: new Date().toISOString(),
  };
}

export function getUserErrorMessage(error: unknown): string {
  return normalizeError(error).userMessage;
}

export function logDiagnosticError(
  error: unknown,
  context?: string,
  fallbackCode: ErrorCode = 'UNKNOWN_ERROR',
): AppError {
  const normalized = normalizeError(error, fallbackCode);
  if (import.meta.env.DEV) {
    console.warn(`[UniCycle Diagnostic${context ? ` · ${context}` : ''}]`, {
      code: normalized.code,
      severity: normalized.severity,
      diagnostic: normalized.diagnosticMessage,
      timestamp: normalized.timestamp,
    });
  }
  return normalized;
}
