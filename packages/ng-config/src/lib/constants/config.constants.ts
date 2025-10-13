import { CoreConfig } from '@acontplus/core';

export const DEFAULT_CONFIG: Required<CoreConfig> = {
  apiBaseUrl: '',
  apiTimeout: 30000,
  retryAttempts: 2,
  retryDelay: 1000,
  enableCorrelationTracking: true,
  enableRequestLogging: false,
  enableErrorLogging: true,
  enableToastNotifications: true,
  includeAuthToken: true,
  authTokenHeader: 'Authorization',
  enableMultiTenancy: true,
  tenantIdHeader: 'Tenant-Id',
  logLevel: 'info',
  enableConsoleLogging: true,
  customHeaders: {},
  excludeUrls: [],
  excludeMethods: [],
};
