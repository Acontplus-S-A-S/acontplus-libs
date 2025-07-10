import { Injectable } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class CorrelationService {
  private correlationId: string | null = null;
  private readonly CORRELATION_KEY = 'correlation-id';

  getOrCreateCorrelationId(): string {
    if (!this.correlationId) {
      // Try to get from sessionStorage first (for page refreshes)
      // @ts-ignore
      this.correlationId =
        sessionStorage.getItem(this.CORRELATION_KEY) || uuidv4();
      sessionStorage.setItem(this.CORRELATION_KEY, this.correlationId);
    }
    return this.correlationId;
  }

  setCorrelationId(correlationId: string): void {
    this.correlationId = correlationId;
    sessionStorage.setItem(this.CORRELATION_KEY, correlationId);
  }

  resetCorrelationId(): void {
    this.correlationId = null;
    sessionStorage.removeItem(this.CORRELATION_KEY);
  }

  getId(): string {
    return this.getOrCreateCorrelationId();
  }
}
