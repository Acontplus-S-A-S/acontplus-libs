import { Injectable } from '@angular/core';
import { HttpErrorLog, HttpRequestLog } from '../interceptors';

@Injectable({
  providedIn: 'root',
})
export class LoggingService {
  logHttpRequest(log: HttpRequestLog): void {
    console.group(`🌐 HTTP Request - ${log.method} ${log.url}`);
    console.log('Request ID:', log.requestId);
    console.log('Correlation ID:', log.correlationId);
    console.log('Tenant ID:', log.tenantId);
    console.log('Headers:', log.headers);
    console.log('Custom URL:', log.isCustomUrl);
    console.log('Timestamp:', log.timestamp);
    console.groupEnd();

    // Send to external logging service in production
    this.sendToExternalLogger('http-request', log);
  }

  logHttpError(error: HttpErrorLog): void {
    console.group(`🚨 HTTP Error - ${error.method} ${error.url}`);
    console.error('Status:', error.status, error.statusText);
    console.error('Request ID:', error.requestId);
    console.error('Correlation ID:', error.correlationId);
    console.error('Tenant ID:', error.tenantId);
    console.error('Error Details:', error.errorDetails);
    console.error('Environment:', error.environment);
    console.error('Timestamp:', error.timestamp);
    console.groupEnd();

    // Send to external logging service
    this.sendToExternalLogger('http-error', error);
  }

  logNetworkError(correlationId: string): void {
    const networkError = {
      type: 'network-error',
      correlationId,
      message: 'Network connection failed',
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      online: navigator.onLine,
    };

    console.error('🔌 Network Error:', networkError);
    this.sendToExternalLogger('network-error', networkError);
  }

  logRateLimitError(correlationId: string, url: string): void {
    const rateLimitError = {
      type: 'rate-limit-error',
      correlationId,
      url,
      message: 'Rate limit exceeded',
      timestamp: new Date().toISOString(),
    };

    console.warn('⏳ Rate Limit Error:', rateLimitError);
    this.sendToExternalLogger('rate-limit-error', rateLimitError);
  }

  private sendToExternalLogger(type: string, data: any): void {
    // Implementation for external logging service
    // Examples: Application Insights, Sentry, LogRocket, etc.
    /*
    if (environment.production) {
      // Send to your logging service
      this.analyticsService.track(type, data);
    }
    */
  }
}
