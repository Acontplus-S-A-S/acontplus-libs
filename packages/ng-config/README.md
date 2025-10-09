# @acontplus/ng-config

Angular configuration library for AcontPlus applications, providing environment
configuration, authentication constants, and app configuration services.

## Installation

```bash
npm install @acontplus/ng-config
```

## Features

- **Environment Token**: Type-safe environment injection token
- **App Configuration Service**: Centralized application configuration
  management
- **Authentication Constants**: Predefined API endpoint constants
- **Angular Integration**: Seamless dependency injection integration
- **TypeScript Support**: Full type safety with comprehensive definitions

## Quick Start

### 1. Provide Environment Configuration

```typescript
// main.ts or app.config.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { ENVIRONMENT } from '@acontplus/ng-config';
import { Environment } from '@acontplus/core';

const environment: Environment = {
  isProduction: false,
  apiBaseUrl: 'http://localhost:3000/api/',
  tokenKey: 'access_token',
  refreshTokenKey: 'refresh_token',
  clientId: 'my-app',
  loginRoute: 'login',
};

bootstrapApplication(AppComponent, {
  providers: [
    { provide: ENVIRONMENT, useValue: environment },
    // other providers
  ],
});
```

### 2. Use App Configuration Service

```typescript
import { AppConfigService } from '@acontplus/ng-config';

@Component({
  selector: 'app-dashboard',
  template: `
    <div>API URL: {{ config.apiUrl }}</div>
    <div>Production: {{ config.production }}</div>
    <div>Logging: {{ config.enableLogging }}</div>
  `,
})
export class DashboardComponent {
  config = inject(AppConfigService);
}
```

## API Reference

### ENVIRONMENT Token

Injection token for environment configuration:

```typescript
import { ENVIRONMENT } from '@acontplus/ng-config';
import { Environment } from '@acontplus/core';

@Injectable()
export class ApiService {
  private environment = inject(ENVIRONMENT);

  getApiUrl(): string {
    return this.environment.apiBaseUrl;
  }

  isProduction(): boolean {
    return this.environment.isProduction;
  }
}
```

### AppConfigService

Centralized configuration service:

```typescript
interface IAppConfig {
  apiUrl: string;
  apiTimeout: number;
  enableLogging: boolean;
  production: boolean;
}

@Injectable({ providedIn: 'root' })
export class AppConfigService implements IAppConfig {
  get apiUrl(): string;
  get apiTimeout(): number;
  get enableLogging(): boolean;
  get production(): boolean;
}
```

**Usage Examples:**

```typescript
// HTTP Service Configuration
@Injectable()
export class HttpService {
  private config = inject(AppConfigService);

  private httpOptions = {
    timeout: this.config.apiTimeout,
    baseURL: this.config.apiUrl
  };
}

// Conditional Logging
@Injectable()
export class LoggerService {
  private config = inject(AppConfigService);

  log(message: string): void {
    if (this.config.enableLogging) {
      console.log(message);
    }
  }
}

// Environment-based Features
@Component({...})
export class DebugPanelComponent {
  private config = inject(AppConfigService);

  showDebugInfo = !this.config.production;
}
```

### AUTH_API Constants

Predefined authentication API endpoints:

```typescript
import { AUTH_API } from '@acontplus/ng-config';

@Injectable()
export class AuthService {
  private baseUrl = inject(AppConfigService).apiUrl;

  login(credentials: LoginCredentials): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.baseUrl}${AUTH_API.AUTH}login`,
      credentials,
    );
  }

  logout(): Observable<void> {
    return this.http.post<void>(`${this.baseUrl}${AUTH_API.AUTH}logout`, {});
  }
}
```

## Configuration Patterns

### Multi-Environment Setup

```typescript
// environments/environment.ts
export const environment: Environment = {
  isProduction: false,
  apiBaseUrl: 'http://localhost:3000/api/',
  tokenKey: 'dev_token',
  refreshTokenKey: 'dev_refresh_token',
  clientId: 'dev-app',
  loginRoute: 'auth',
};

// environments/environment.prod.ts
export const environment: Environment = {
  isProduction: true,
  apiBaseUrl: 'https://api.myapp.com/',
  tokenKey: 'prod_token',
  refreshTokenKey: 'prod_refresh_token',
  clientId: 'prod-app',
  loginRoute: 'login',
};
```

### Runtime Configuration

```typescript
// app.config.ts
export function createAppConfig(): ApplicationConfig {
  return {
    providers: [
      {
        provide: ENVIRONMENT,
        useFactory: () => {
          // Load from external config or detect environment
          const isDev = window.location.hostname === 'localhost';
          return isDev ? devEnvironment : prodEnvironment;
        },
      },
    ],
  };
}
```

### Feature Flags Integration

```typescript
@Injectable()
export class FeatureService {
  private config = inject(AppConfigService);

  isFeatureEnabled(feature: string): boolean {
    // Use configuration to enable/disable features
    return !this.config.production || this.isFeatureInProd(feature);
  }

  private isFeatureInProd(feature: string): boolean {
    // Production feature logic
    return ['core-features', 'stable-features'].includes(feature);
  }
}
```
