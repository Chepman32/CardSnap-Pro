/**
 * Error Handler Utility
 * Centralized error handling and logging
 */

export interface AppError {
  code: string;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: number;
  context?: any;
}

export class ErrorHandler {
  private static errors: AppError[] = [];
  private static maxErrors = 100;

  /**
   * Log an error
   */
  static logError(
    code: string,
    message: string,
    severity: AppError['severity'] = 'medium',
    context?: any,
  ): void => {
    const error: AppError = {
      code,
      message,
      severity,
      timestamp: Date.now(),
      context,
    };

    this.errors.push(error);

    // Keep only the latest errors
    if (this.errors.length > this.maxErrors) {
      this.errors.shift();
    }

    // Log to console based on severity
    if (severity === 'critical' || severity === 'high') {
      console.error(`[${severity.toUpperCase()}] ${code}: ${message}`, context);
    } else {
      console.warn(`[${severity.toUpperCase()}] ${code}: ${message}`, context);
    }
  }

  /**
   * Get all logged errors
   */
  static getErrors(): AppError[] => {
    return [...this.errors];
  }

  /**
   * Get errors by severity
   */
  static getErrorsBySeverity(severity: AppError['severity']): AppError[] => {
    return this.errors.filter(e => e.severity === severity);
  }

  /**
   * Clear all errors
   */
  static clearErrors(): void => {
    this.errors = [];
  }

  /**
   * Export errors as JSON
   */
  static exportErrors(): string => {
    return JSON.stringify(this.errors, null, 2);
  }

  /**
   * Handle storage errors
   */
  static handleStorageError(error: any, operation: string): void => {
    this.logError(
      'STORAGE_ERROR',
      `Failed to ${operation}`,
      'high',
      {error: error.message},
    );
  }

  /**
   * Handle network errors
   */
  static handleNetworkError(error: any, endpoint: string): void => {
    this.logError(
      'NETWORK_ERROR',
      `Failed to reach ${endpoint}`,
      'medium',
      {error: error.message},
    );
  }

  /**
   * Handle validation errors
   */
  static handleValidationError(field: string, value: any): void => {
    this.logError(
      'VALIDATION_ERROR',
      `Invalid value for ${field}`,
      'low',
      {field, value},
    );
  }

  /**
   * Handle IAP errors
   */
  static handleIAPError(error: any): void => {
    this.logError(
      'IAP_ERROR',
      'In-app purchase failed',
      'medium',
      {error: error.message},
    );
  }

  /**
   * Handle unexpected errors
   */
  static handleUnexpectedError(error: any, context?: any): void => {
    this.logError(
      'UNEXPECTED_ERROR',
      error.message || 'An unexpected error occurred',
      'high',
      {error, context},
    );
  }
}

/**
 * Error codes enum
 */
export enum ErrorCode {
  STORAGE_ERROR = 'STORAGE_ERROR',
  NETWORK_ERROR = 'NETWORK_ERROR',
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  IAP_ERROR = 'IAP_ERROR',
  UNEXPECTED_ERROR = 'UNEXPECTED_ERROR',
  NODE_LIMIT_EXCEEDED = 'NODE_LIMIT_EXCEEDED',
  STORAGE_QUOTA_EXCEEDED = 'STORAGE_QUOTA_EXCEEDED',
  PREMIUM_REQUIRED = 'PREMIUM_REQUIRED',
  EXPORT_FAILED = 'EXPORT_FAILED',
  IMPORT_FAILED = 'IMPORT_FAILED',
}

/**
 * User-friendly error messages
 */
export const getErrorMessage = (code: string): string => {
  const messages: Record<string, string> = {
    STORAGE_ERROR: 'Unable to save your data. Please try again.',
    NETWORK_ERROR: 'Network connection failed. Please check your internet.',
    VALIDATION_ERROR: 'Invalid input. Please check your data.',
    IAP_ERROR: 'Purchase could not be completed. Please try again.',
    UNEXPECTED_ERROR: 'Something went wrong. Please try again.',
    NODE_LIMIT_EXCEEDED:
      'You have reached the maximum number of nodes. Upgrade to premium for unlimited nodes.',
    STORAGE_QUOTA_EXCEEDED:
      'Storage limit reached. Please delete some mind maps or upgrade to premium.',
    PREMIUM_REQUIRED:
      'This feature requires premium. Upgrade to unlock all features.',
    EXPORT_FAILED: 'Failed to export mind map. Please try again.',
    IMPORT_FAILED: 'Failed to import file. Please check the file format.',
  };

  return messages[code] || 'An error occurred';
};
