import { Injectable, inject } from '@angular/core';
import { ENVIRONMENT } from '../environment.token';

export interface IAppConfig {
  apiUrl: string;
  apiTimeout: number;
  enableLogging: boolean;
  production: boolean;
}

@Injectable({ providedIn: 'root' })
export class AppConfigService implements IAppConfig {
  private environment = inject(ENVIRONMENT);

  get apiUrl(): string {
    return this.environment.apiBaseUrl;
  }

  get apiTimeout(): number {
    return 30000; // Default timeout
  }

  get enableLogging(): boolean {
    return !this.environment.isProduction;
  }

  get production(): boolean {
    return this.environment.isProduction;
  }
}
