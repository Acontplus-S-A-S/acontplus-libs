import { Injectable, signal, computed } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';

@Injectable({
  providedIn: 'root',
})
export class CorrelationInfo {
  private correlationId = signal<string | null>(null);
  private readonly CORRELATION_KEY = 'correlation-id';

  // Signal-based getter for reactive updates
  readonly currentCorrelationId = computed(() => this.correlationId());

  getOrCreateCorrelationId(): string {
    if (!this.correlationId()) {
      // Try to get from sessionStorage first (for page refreshes)
      const id = sessionStorage.getItem(this.CORRELATION_KEY) || uuidv4();
      this.correlationId.set(id);
      sessionStorage.setItem(this.CORRELATION_KEY, id);
    }
    return this.correlationId()!;
  }

  setCorrelationId(correlationId: string): void {
    this.correlationId.set(correlationId);
    sessionStorage.setItem(this.CORRELATION_KEY, correlationId);
  }

  resetCorrelationId(): void {
    this.correlationId.set(null);
    sessionStorage.removeItem(this.CORRELATION_KEY);
  }

  getId(): string {
    return this.getOrCreateCorrelationId();
  }
}
