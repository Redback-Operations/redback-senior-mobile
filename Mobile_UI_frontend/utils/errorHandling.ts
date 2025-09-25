// Error handling utilities
export interface AppError {
  code: string;
  message: string;
  details?: any;
  timestamp: Date;
}

export class ErrorHandler {
  static createError(code: string, message: string, details?: any): AppError {
    return {
      code,
      message,
      details,
      timestamp: new Date(),
    };
  }

  static getErrorMessage(error: AppError | Error | unknown): string {
    if (error instanceof Error) {
      return error.message;
    }
    
    if (typeof error === 'object' && error !== null && 'message' in error) {
      return (error as any).message;
    }
    
    return 'An unexpected error occurred';
  }

  static getErrorCode(error: AppError | Error | unknown): string {
    if (typeof error === 'object' && error !== null && 'code' in error) {
      return (error as any).code;
    }
    
    return 'UNKNOWN_ERROR';
  }

  static logError(error: AppError | Error | unknown, context?: string): void {
    const errorMessage = this.getErrorMessage(error);
    const errorCode = this.getErrorCode(error);
    
    console.error(`[${context || 'App'}] Error ${errorCode}: ${errorMessage}`, error);
  }
}

// Common error codes
export const ERROR_CODES = {
  // Form errors
  FORM_VALIDATION_FAILED: 'FORM_VALIDATION_FAILED',
  FORM_SUBMISSION_FAILED: 'FORM_SUBMISSION_FAILED',
  
  // Navigation errors
  NAVIGATION_FAILED: 'NAVIGATION_FAILED',
  ROUTE_NOT_FOUND: 'ROUTE_NOT_FOUND',
  
  // Data errors
  DATA_LOAD_FAILED: 'DATA_LOAD_FAILED',
  DATA_SAVE_FAILED: 'DATA_SAVE_FAILED',
  DATA_CORRUPTED: 'DATA_CORRUPTED',
  
  // Network errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  API_ERROR: 'API_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  
  // Storage errors
  STORAGE_ERROR: 'STORAGE_ERROR',
  STORAGE_FULL: 'STORAGE_FULL',
  
  // General errors
  UNKNOWN_ERROR: 'UNKNOWN_ERROR',
  PERMISSION_DENIED: 'PERMISSION_DENIED',
} as const;

// User-friendly error messages
export const ERROR_MESSAGES = {
  [ERROR_CODES.FORM_VALIDATION_FAILED]: 'Please check your input and try again.',
  [ERROR_CODES.FORM_SUBMISSION_FAILED]: 'Failed to submit form. Please try again.',
  [ERROR_CODES.NAVIGATION_FAILED]: 'Navigation failed. Please try again.',
  [ERROR_CODES.ROUTE_NOT_FOUND]: 'Page not found.',
  [ERROR_CODES.DATA_LOAD_FAILED]: 'Failed to load data. Please refresh and try again.',
  [ERROR_CODES.DATA_SAVE_FAILED]: 'Failed to save data. Please try again.',
  [ERROR_CODES.DATA_CORRUPTED]: 'Data appears to be corrupted. Please reset the app.',
  [ERROR_CODES.NETWORK_ERROR]: 'Network error. Please check your connection.',
  [ERROR_CODES.API_ERROR]: 'Service temporarily unavailable. Please try again later.',
  [ERROR_CODES.TIMEOUT_ERROR]: 'Request timed out. Please try again.',
  [ERROR_CODES.STORAGE_ERROR]: 'Storage error. Some features may not work properly.',
  [ERROR_CODES.STORAGE_FULL]: 'Storage is full. Please free up space.',
  [ERROR_CODES.UNKNOWN_ERROR]: 'An unexpected error occurred. Please try again.',
  [ERROR_CODES.PERMISSION_DENIED]: 'Permission denied. Please check your settings.',
} as const;

// Error boundary component props
export interface ErrorBoundaryProps {
  fallback?: React.ComponentType<{ error: AppError; retry: () => void }>;
  onError?: (error: AppError, errorInfo: any) => void;
  children: React.ReactNode;
}

// Retry configuration
export interface RetryConfig {
  maxAttempts: number;
  delay: number;
  backoffMultiplier: number;
}

export const DEFAULT_RETRY_CONFIG: RetryConfig = {
  maxAttempts: 3,
  delay: 1000,
  backoffMultiplier: 2,
};
