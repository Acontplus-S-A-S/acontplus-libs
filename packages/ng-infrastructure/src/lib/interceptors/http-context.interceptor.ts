import { inject, InjectionToken } from '@angular/core'; // Import InjectionToken
import { Router } from '@angular/router';
import {
  HttpContextToken,
  HttpContext,
  HttpInterceptorFn,
  HttpErrorResponse,
} from '@angular/common/http';
import { catchError, throwError, switchMap, Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';

// Environment and configuration
import { ENVIRONMENT } from '@acontplus/ng-config';

// Services
import { TenantService } from '../services/tenant.service';
import { CorrelationService } from '../services/correlation.service';
import { LoggingService } from '../services/logging.service';
import { TOKEN_PROVIDER } from '../interfaces/token-provider.interface';

// HTTP Context tokens
const CUSTOM_URL = new HttpContextToken<boolean>(() => false);
const SKIP_CONTEXT_HEADERS = new HttpContextToken<boolean>(() => false);
const CUSTOM_HEADERS = new HttpContextToken<Record<string, string>>(() => ({}));

// Helper functions for HTTP context
export function customUrl() {
  return new HttpContext().set(CUSTOM_URL, true);
}

export function skipContextHeaders() {
  return new HttpContext().set(SKIP_CONTEXT_HEADERS, true);
}

export function withCustomHeaders(headers: Record<string, string>) {
  return new HttpContext().set(CUSTOM_HEADERS, headers);
}

// Configuration interface for library consumers
export interface HttpContextConfig {
  enableCorrelationTracking?: boolean;
  enableRequestLogging?: boolean;
  enableErrorLogging?: boolean;
  customHeaders?: Record<string, string | (() => string)>;
  clientVersion?: string;
  tenantIdHeader?: string;
  correlationIdHeader?: string;
  requestIdHeader?: string;
  timestampHeader?: string;
  excludeUrls?: string[];
  includeAuthToken?: boolean;
  baseUrlInjection?: boolean;
  refreshTokenCallback?: () => Observable<{ token: string; refreshToken?: string }>;
  logoutCallback?: () => void;
}

// Default configuration
const DEFAULT_CONFIG: Required<HttpContextConfig> = {
  enableCorrelationTracking: true,
  enableRequestLogging: false, // This will be overridden by environment.isProduction
  enableErrorLogging: true,
  customHeaders: {},
  clientVersion: '1.0.0',
  tenantIdHeader: 'Tenant-Id',
  correlationIdHeader: 'Correlation-Id',
  requestIdHeader: 'Request-Id',
  timestampHeader: 'Timestamp',
  excludeUrls: [],
  includeAuthToken: true,
  baseUrlInjection: true,
  refreshTokenCallback: undefined as any,
  logoutCallback: undefined as any,
};

// Injection token for configuration - FIXED
export const HTTP_CONTEXT_CONFIG = new InjectionToken<HttpContextConfig>('HTTP_CONTEXT_CONFIG', {
  factory: () => DEFAULT_CONFIG, // Provide a default factory in case it's not provided
});

export const httpContextInterceptor: HttpInterceptorFn = (req, next) => {
  const tokenProvider = inject(TOKEN_PROVIDER, { optional: true });
  const router = inject(Router);
  const tenantService = inject(TenantService);
  const correlationService = inject(CorrelationService);
  const loggingService = inject(LoggingService);
  const environment = inject(ENVIRONMENT);

  // Get configuration (with fallback to default) - FIXED
  const config: Required<HttpContextConfig> = {
    ...DEFAULT_CONFIG,
    // The default enableRequestLogging needs to be set based on environment here,
    // as it's dynamic, and DEFAULT_CONFIG is static.
    enableRequestLogging: !environment.isProduction,
    ...inject(HTTP_CONTEXT_CONFIG, { optional: true }),
  };

  // Check HTTP context tokens
  const isCustomUrl = req.context.get(CUSTOM_URL);
  const skipHeaders = req.context.get(SKIP_CONTEXT_HEADERS);
  const contextHeaders = req.context.get(CUSTOM_HEADERS);

  // Skip processing if headers are disabled for this request
  if (skipHeaders) {
    return next(req);
  }

  // Check if URL should be excluded
  const shouldExclude = config.excludeUrls.some(
    url => req.url.includes(url) || new RegExp(url).test(req.url),
  );

  if (shouldExclude) {
    return next(req);
  }

  // Skip auth for login, register, and refresh endpoints
  const skipAuth = req.url.includes('/login') || req.url.includes('/register') || req.url.includes('/refresh');

  // Handle URL transformation
  const baseUrl = environment.apiBaseUrl;
  const finalUrl = isCustomUrl || !config.baseUrlInjection ? req.url : `${baseUrl}${req.url}`;

  // Generate or get correlation context
  const correlationId = config.enableCorrelationTracking
    ? correlationService.getOrCreateCorrelationId()
    : uuidv4();
  const tenantId = tenantService.getTenantId();
  const requestId = uuidv4();

  // Build dynamic headers
  const headers: Record<string, string> = {};

  // Core context headers
  headers[config.requestIdHeader] = requestId;

  if (config.enableCorrelationTracking) {
    headers[config.correlationIdHeader] = correlationId;
  }

  if (tenantId) {
    headers[config.tenantIdHeader] = tenantId;
  }

  headers[config.timestampHeader] = new Date().toISOString();

  // Client information
  if (config.clientVersion) {
    headers['Client-Version'] = config.clientVersion;
  }

  // Environment client ID
  if (environment.clientId) {
    headers['Client-Id'] = environment.clientId;
  }

  // Add authorization header if configured and available
  if (config.includeAuthToken && !skipAuth) {
    const authToken = tokenProvider?.getToken();
    if (authToken) {
      headers['Authorization'] = `Bearer ${authToken}`;
    }
  }

  // Process custom headers from configuration (can be static values or dynamic functions)
  Object.entries(config.customHeaders).forEach(([key, value]) => {
    headers[key] = typeof value === 'function' ? value() : value;
  });

  // Add headers from HTTP context
  Object.entries(contextHeaders).forEach(([key, value]) => {
    headers[key] = value;
  });

  // Add content-type for data requests if not already set
  if (
    ['POST', 'PUT', 'PATCH'].includes(req.method.toUpperCase()) &&
    !req.headers.has('Content-Type')
  ) {
    headers['Content-Type'] = 'application/json';
  }

  // Clone request with enhanced headers and URL
  const enhancedReq = req.clone({
    url: finalUrl,
    setHeaders: headers,
  });

  // Log outgoing request if enabled
  if (config.enableRequestLogging) {
    loggingService.logHttpRequest({
      method: req.method,
      url: finalUrl,
      originalUrl: req.url,
      requestId,
      correlationId,
      tenantId,
      timestamp: new Date().toISOString(),
      headers: Object.keys(headers),
      isCustomUrl,
    });
  }

  // If request has auth header, handle with refresh logic
  if (headers['Authorization'] && config.refreshTokenCallback) {
    return next(enhancedReq).pipe(
      catchError(error => {
        // If 401 Unauthorized, try to refresh token
        if (error.status === 401) {
          const refreshToken = tokenProvider?.getRefreshToken?.();
          if (refreshToken && refreshToken.trim().length > 0) {
            return config.refreshTokenCallback()!.pipe(
              switchMap(newTokens => {
                // Retry the original request with new token
                const retryReq = req.clone({
                  url: finalUrl,
                  setHeaders: { ...headers, 'Authorization': `Bearer ${newTokens.token}` },
                });
                return next(retryReq);
              }),
              catchError(refreshError => {
                // Refresh failed, logout user
                config.logoutCallback?.();
                return throwError(() => refreshError);
              }),
            );
          }
        }

        // Enhanced error logging with context
        if (config.enableErrorLogging) {
          loggingService.logHttpError({
            method: req.method,
            url: finalUrl,
            originalUrl: req.url,
            requestId,
            correlationId,
            tenantId,
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            timestamp: new Date().toISOString(),
            errorDetails: error.error,
            environment: environment.clientId,
            isCustomUrl,
            headers: [], // Headers are not included in HttpErrorResponse by default, adjust if needed
          });
        }

        // Handle other error scenarios
        switch (error.status) {
          case 403:
            tenantService.handleForbidden();
            break;
          case 0:
            loggingService.logNetworkError(correlationId);
            break;
          case 429:
            loggingService.logRateLimitError(correlationId, finalUrl);
            break;
        }

        return throwError(() => error);
      }),
    );
  } else {
    // No auth header, use standard error handling
    return next(enhancedReq).pipe(
      catchError((error: HttpErrorResponse) => {
        // Enhanced error logging with context
        if (config.enableErrorLogging) {
          loggingService.logHttpError({
            method: req.method,
            url: finalUrl,
            originalUrl: req.url,
            requestId,
            correlationId,
            tenantId,
            status: error.status,
            statusText: error.statusText,
            message: error.message,
            timestamp: new Date().toISOString(),
            errorDetails: error.error,
            environment: environment.clientId,
            isCustomUrl,
            headers: [], // Headers are not included in HttpErrorResponse by default, adjust if needed
          });
        }

        // Handle specific error scenarios
        switch (error.status) {
          case 401:
            console.error('Unauthorized access - token expired or invalid');
            // Note: Token clearing should be handled by the auth service, not infrastructure
            router.navigate(['/login']);
            break;
          case 403:
            tenantService.handleForbidden();
            break;
          case 0:
            loggingService.logNetworkError(correlationId);
            break;
          case 429:
            loggingService.logRateLimitError(correlationId, finalUrl);
            break;
        }

        return throwError(() => error);
      }),
    );
  }
};

// Supporting interfaces for type safety
export interface HttpRequestLog {
  method: string;
  url: string;
  originalUrl: string;
  requestId: string;
  correlationId: string;
  tenantId: string;
  timestamp: string;
  headers: string[];
  isCustomUrl: boolean;
}

export interface HttpErrorLog extends HttpRequestLog {
  status: number;
  statusText: string;
  message: string;
  errorDetails: any;
  environment: string;
}

// Helper function to create configuration
export function createHttpContextConfig(
  overrides: Partial<HttpContextConfig> = {},
): HttpContextConfig {
  return {
    ...DEFAULT_CONFIG,
    ...overrides,
  };
}

// Provider function for easy setup
export function provideHttpContext(config: Partial<HttpContextConfig> = {}) {
  return [
    {
      provide: HTTP_CONTEXT_CONFIG,
      useValue: createHttpContextConfig(config),
    },
  ];
}
