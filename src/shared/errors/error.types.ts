export type ErrorCode =
  | 'AUTH_UNAUTHORIZED'
  | 'AUTH_INVALID_CREDENTIALS'
  | 'AUTH_EMAIL_IN_USE'
  | 'AUTH_WEAK_PASSWORD'
  | 'AUTH_FORBIDDEN'
  | 'STORAGE_UPLOAD_FAILED'
  | 'STORAGE_INVALID_FILE'
  | 'NETWORK_OFFLINE'
  | 'RESOURCE_NOT_FOUND'
  | 'VALIDATION_FAILED'
  | 'FIREBASE_ERROR'
  | 'UNKNOWN_ERROR';

export type ErrorSeverity = 'info' | 'warning' | 'error' | 'critical';

export interface AppError {
  readonly code: ErrorCode;
  readonly userMessage: string;
  readonly diagnosticMessage: string;
  readonly severity: ErrorSeverity;
  readonly timestamp: string;
}
