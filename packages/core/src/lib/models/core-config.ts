export interface CoreConfig {
  // API Configuration
  apiBaseUrl?: string;
  apiTimeout?: number;
  retryAttempts?: number;
  retryDelay?: number;

  // Feature Flags
  enableCorrelationTracking?: boolean;
  enableRequestLogging?: boolean;
  enableErrorLogging?: boolean;
  enableToastNotifications?: boolean;

  // Security
  includeAuthToken?: boolean;
  authTokenHeader?: string;

  // Multi-tenancy
  enableMultiTenancy?: boolean;
  tenantIdHeader?: string;

  // Logging
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
  enableConsoleLogging?: boolean;

  // Custom Headers
  customHeaders?: Record<string, string | (() => string)>;

  // Exclusions
  excludeUrls?: string[];
  excludeMethods?: string[];
}
