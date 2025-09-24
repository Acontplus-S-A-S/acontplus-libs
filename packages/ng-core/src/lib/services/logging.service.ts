import { Injectable, inject } from '@angular/core';
import { ENVIRONMENT } from '../environments';
import { HttpRequestLog, HttpErrorLog } from '../interceptors';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  private environment = inject(ENVIRONMENT);

  log(level: 'info' | 'warn' | 'error', message: string, context?: any): void {
    if (this.environment.isProduction) {
      // Production logging (e.g., to external service)
      this.logToExternalService(level, message, context);
    } else {
      // Development logging
      console[level](`[${level.toUpperCase()}] ${message}`, context);
    }
  }

  info(message: string, context?: any): void {
    this.log('info', message, context);
  }

  warn(message: string, context?: any): void {
    this.log('warn', message, context);
  }

  error(message: string, context?: any): void {
    this.log('error', message, context);
  }

  // HTTP Request Logging
  logHttpRequest(log: HttpRequestLog): void {
    this.info(`HTTP Request - ${log.method} ${log.url}`, {
      requestId: log.requestId,
      correlationId: log.correlationId,
      tenantId: log.tenantId,
      headers: log.headers,
      isCustomUrl: log.isCustomUrl,
      timestamp: log.timestamp,
    });
  }

  // HTTP Error Logging
  logHttpError(error: HttpErrorLog): void {
    this.error(`HTTP Error - ${error.method} ${error.url}`, {
      status: error.status,
      statusText: error.statusText,
      requestId: error.requestId,
      correlationId: error.correlationId,
      tenantId: error.tenantId,
      errorDetails: error.errorDetails,
      environment: error.environment,
      timestamp: error.timestamp,
    });
  }

  // Network Error Logging
  logNetworkError(correlationId: string): void {
    this.error('Network connection failed', {
      type: 'network-error',
      correlationId,
      userAgent: navigator.userAgent,
      online: navigator.onLine,
    });
  }

  // Rate Limit Error Logging
  logRateLimitError(correlationId: string, url: string): void {
    this.warn('Rate limit exceeded', {
      type: 'rate-limit-error',
      correlationId,
      url,
    });
  }

  private logToExternalService(level: string, message: string, context?: any): void {
    // Implement external logging service integration
    // e.g., Sentry, LogRocket, etc.
    // This is a placeholder for production logging implementation
  }
}
