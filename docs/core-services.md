# Core Library Services Documentation

This document provides comprehensive documentation for all services available in
the `acontplus-core` library, including configuration, authentication, logging,
and utility services.

## Table of Contents

- [Core Configuration Service](#core-configuration-service)
- [Repository Factory Service](#repository-factory-service)
- [Response Handler Service](#response-handler-service)
- [JWT Token Service](#jwt-token-service)
- [Correlation Service](#correlation-service)
- [Tenant Service](#tenant-service)
- [Logging Service](#logging-service)
- [Toastr Notification Service](#toastr-notification-service)

## Core Configuration Service

The `CoreConfigService` provides centralized configuration management for the
core library, allowing runtime updates and environment-specific settings.

### Basic Usage

```typescript
import { CoreConfigService, CoreConfig } from 'acontplus/core';

@Injectable()
export class YourService {
  constructor(private coreConfig: CoreConfigService) {}

  getApiUrl(): string {
    return this.coreConfig.get('apiBaseUrl');
  }

  updateApiUrl(newUrl: string): void {
    this.coreConfig.updateConfig({ apiBaseUrl: newUrl });
  }

  isFeatureEnabled(feature: keyof CoreConfig): boolean {
    return this.coreConfig.isFeatureEnabled(feature);
  }
}
```

### Configuration Interface

```typescript
interface CoreConfig {
  apiBaseUrl: string;
  enableCorrelationTracking: boolean;
  enableRequestLogging: boolean;
  enableErrorLogging: boolean;
  logLevel: 'debug' | 'info' | 'warn' | 'error';
  customHeaders: Record<string, string>;
  excludeUrls: string[];
  maxRetryAttempts: number;
  retryDelay: number;
  timeout: number;
  enableCaching: boolean;
  cacheTTL: number;
}
```

### Methods

| Name              | Parameters                   | Return Type   | Description                              |
| ----------------- | ---------------------------- | ------------- | ---------------------------------------- |
| get               | key: K                       | CoreConfig[K] | Gets a configuration value by key        |
| updateConfig      | updates: Partial<CoreConfig> | void          | Updates configuration values             |
| isFeatureEnabled  | feature: keyof CoreConfig    | boolean       | Checks if a feature is enabled           |
| getApiUrl         | entityName?: string          | string        | Gets the API URL for an entity           |
| resetConfig       | none                         | void          | Resets configuration to default values   |
| getConfigSnapshot | none                         | CoreConfig    | Gets a snapshot of current configuration |

## Repository Factory Service

The `RepositoryFactory` provides centralized repository management, allowing
dynamic registration and retrieval of repositories by key or entity name.

### Basic Usage

```typescript
import { RepositoryFactory, BaseRepository } from 'acontplus/core';

@Injectable()
export class YourService {
  constructor(private repositoryFactory: RepositoryFactory) {}

  getUsers(): Observable<User[]> {
    const userRepo = this.repositoryFactory.getRequired<User>('user');
    return userRepo.getAll(pagination, filters);
  }

  getRepositoryByEntity(entityName: string): BaseRepository<any> | undefined {
    return this.repositoryFactory.getByEntityName(entityName);
  }
}
```

### Methods

| Name            | Parameters                                                                             | Return Type                    | Description                                    |
| --------------- | -------------------------------------------------------------------------------------- | ------------------------------ | ---------------------------------------------- |
| register        | key: string, repository: Type<BaseRepository<T>>, entityName: string, baseUrl?: string | void                           | Registers a repository with the factory        |
| get             | key: string                                                                            | BaseRepository<T> \| undefined | Gets a repository by key                       |
| getRequired     | key: string                                                                            | BaseRepository<T>              | Gets a repository by key (throws if not found) |
| getByEntityName | entityName: string                                                                     | BaseRepository<T> \| undefined | Gets a repository by entity name               |
| getAll          | none                                                                                   | BaseRepository<any>[]          | Gets all registered repositories               |
| unregister      | key: string                                                                            | boolean                        | Unregisters a repository                       |
| clear           | none                                                                                   | void                           | Clears all registered repositories             |

### Registration Example

```typescript
// In your app module
@NgModule({
  providers: [
    provideRepositoryRegistrations([
      createRepositoryRegistration(
        'user',
        UserRepository,
        'users',
        '/api/users',
      ),
      createRepositoryRegistration(
        'product',
        ProductRepository,
        'products',
        '/api/products',
      ),
      createRepositoryRegistration(
        'order',
        OrderRepository,
        'orders',
        '/api/orders',
      ),
    ]),
  ],
})
export class AppModule {}
```

## Response Handler Service

The `ResponseHandlerService` provides utilities for handling API responses that
have been processed by the API interceptor, extracting data and messages
consistently.

### Basic Usage

```typescript
import { ResponseHandlerService } from 'acontplus/core';

@Injectable()
export class YourService {
  constructor(private responseHandler: ResponseHandlerService) {}

  handleUserResponse(response: any): void {
    if (this.responseHandler.hasData(response)) {
      const user = this.responseHandler.extractData<User>(response);
      console.log('User data:', user);
    }

    if (this.responseHandler.hasMessage(response)) {
      const message = this.responseHandler.extractMessage(response);
      console.log('Success message:', message);
    }

    const result = this.responseHandler.handleResponse<User>(response);
    console.log('Full result:', result);
  }
}
```

### Methods

| Name           | Parameters    | Return Type         | Description                                     |
| -------------- | ------------- | ------------------- | ----------------------------------------------- |
| handleResponse | response: any | ResponseResult<T>   | Handles API responses and extracts data/message |
| extractData    | response: any | T                   | Extracts only the data from a response          |
| extractMessage | response: any | string \| undefined | Extracts only the message from a response       |
| hasData        | response: any | boolean             | Checks if the response contains data            |
| hasMessage     | response: any | boolean             | Checks if the response contains a message       |

### Response Result Interface

```typescript
interface ResponseResult<T> {
  data?: T;
  message?: string;
  metadata?: Record<string, any>;
  correlationId?: string;
  traceId?: string;
}
```

## JWT Token Service

The `JwtTokenService` provides JWT token management, including storage,
validation, and decoding.

### Basic Usage

```typescript
import { JwtTokenService } from 'acontplus/core';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtTokenService) {}

  login(credentials: LoginCredentials): void {
    // After successful login
    this.jwtService.setToken(token);
  }

  logout(): void {
    this.jwtService.clearToken();
  }

  isAuthenticated(): boolean {
    return this.jwtService.isAuthenticated();
  }

  getTokenPayload(): any {
    return this.jwtService.getTokenPayload();
  }
}
```

### Methods

| Name               | Parameters    | Return Type        | Description                                   |
| ------------------ | ------------- | ------------------ | --------------------------------------------- |
| setToken           | token: string | void               | Sets the JWT token                            |
| getToken           | none          | string \| null     | Gets the current JWT token                    |
| clearToken         | none          | void               | Clears the stored JWT token                   |
| isAuthenticated    | none          | boolean            | Checks if a valid token exists                |
| getTokenPayload    | none          | any                | Gets the decoded token payload                |
| isTokenExpired     | none          | boolean            | Checks if the token is expired                |
| getTokenExpiration | none          | Date \| null       | Gets the token expiration date                |
| refreshToken       | none          | Observable<string> | Refreshes the token (if refresh logic exists) |

## Correlation Service

The `CorrelationService` provides correlation ID management for request tracing
and debugging across distributed systems.

### Basic Usage

```typescript
import { CorrelationService } from 'acontplus/core';

@Injectable()
export class YourService {
  constructor(private correlationService: CorrelationService) {}

  makeRequest(): void {
    const correlationId = this.correlationService.getOrCreateCorrelationId();
    console.log('Request correlation ID:', correlationId);

    // The correlation ID is automatically included in HTTP requests
    this.http.get('/api/data').subscribe();
  }

  createNewCorrelation(): void {
    this.correlationService.createNewCorrelationId();
  }
}
```

### Methods

| Name                     | Parameters | Return Type    | Description                                     |
| ------------------------ | ---------- | -------------- | ----------------------------------------------- |
| getOrCreateCorrelationId | none       | string         | Gets existing correlation ID or creates new one |
| createNewCorrelationId   | none       | void           | Creates a new correlation ID                    |
| getCurrentCorrelationId  | none       | string \| null | Gets the current correlation ID                 |
| clearCorrelationId       | none       | void           | Clears the current correlation ID               |
| setCorrelationId         | id: string | void           | Sets a specific correlation ID                  |

## Tenant Service

The `TenantService` provides multi-tenancy support for applications that need to
handle multiple tenants or organizations.

### Basic Usage

```typescript
import { TenantService } from 'acontplus/core';

@Injectable()
export class YourService {
  constructor(private tenantService: TenantService) {}

  switchTenant(tenantId: string): void {
    this.tenantService.setTenantId(tenantId);
    console.log('Switched to tenant:', this.tenantService.getTenantId());
  }

  getTenantHeaders(): Record<string, string> {
    return this.tenantService.getTenantHeaders();
  }
}
```

### Methods

| Name             | Parameters       | Return Type            | Description                            |
| ---------------- | ---------------- | ---------------------- | -------------------------------------- |
| setTenantId      | tenantId: string | void                   | Sets the current tenant ID             |
| getTenantId      | none             | string \| null         | Gets the current tenant ID             |
| clearTenantId    | none             | void                   | Clears the current tenant ID           |
| getTenantHeaders | none             | Record<string, string> | Gets headers for tenant identification |
| isMultiTenant    | none             | boolean                | Checks if multi-tenancy is enabled     |
| validateTenantId | tenantId: string | boolean                | Validates a tenant ID format           |

## Logging Service

The `LoggingService` provides structured logging capabilities with different log
levels and context information.

### Basic Usage

```typescript
import { LoggingService } from 'acontplus/core';

@Injectable()
export class YourService {
  constructor(private loggingService: LoggingService) {}

  performOperation(): void {
    this.loggingService.info('Starting operation', {
      operation: 'dataProcessing',
    });

    try {
      // Perform operation
      this.loggingService.info('Operation completed successfully');
    } catch (error) {
      this.loggingService.error('Operation failed', { error: error.message });
    }
  }

  logHttpRequest(request: HttpRequestLog): void {
    this.loggingService.logHttpRequest(request);
  }
}
```

### Methods

| Name           | Parameters                     | Return Type | Description                   |
| -------------- | ------------------------------ | ----------- | ----------------------------- |
| debug          | message: string, context?: any | void        | Logs a debug message          |
| info           | message: string, context?: any | void        | Logs an info message          |
| warn           | message: string, context?: any | void        | Logs a warning message        |
| error          | message: string, context?: any | void        | Logs an error message         |
| logHttpRequest | request: HttpRequestLog        | void        | Logs HTTP request information |
| setLogLevel    | level: LogLevel                | void        | Sets the minimum log level    |
| getLogLevel    | none                           | LogLevel    | Gets the current log level    |

### Log Levels

```typescript
enum LogLevel {
  DEBUG = 'debug',
  INFO = 'info',
  WARN = 'warn',
  ERROR = 'error',
}
```

### HTTP Request Log Interface

```typescript
interface HttpRequestLog {
  method: string;
  url: string;
  requestId: string;
  correlationId: string;
  tenantId?: string;
  timestamp: string;
  headers: string[];
  isCustomUrl: boolean;
  userId?: string;
  userAgent?: string;
  ipAddress?: string;
}
```

## Toastr Notification Service

The `ToastrNotificationService` provides toast notification capabilities with
different types and customization options.

### Basic Usage

```typescript
import { ToastrNotificationService } from 'acontplus/core';

@Injectable()
export class YourService {
  constructor(private toastr: ToastrNotificationService) {}

  showSuccess(): void {
    this.toastr.success({
      message: 'Operation completed successfully!',
      title: 'Success',
    });
  }

  showError(): void {
    this.toastr.error({
      message: 'An error occurred!',
      title: 'Error',
      timeOut: 5000,
    });
  }
}
```

### Methods

| Name    | Parameters             | Return Type | Description                     |
| ------- | ---------------------- | ----------- | ------------------------------- |
| success | options: ToastrOptions | void        | Shows a success notification    |
| error   | options: ToastrOptions | void        | Shows an error notification     |
| warning | options: ToastrOptions | void        | Shows a warning notification    |
| info    | options: ToastrOptions | void        | Shows an info notification      |
| clear   | none                   | void        | Clears all notifications        |
| remove  | toastId: number        | void        | Removes a specific notification |

### Toastr Options Interface

```typescript
interface ToastrOptions {
  message: string;
  title?: string;
  timeOut?: number;
  extendedTimeOut?: number;
  enableHtml?: boolean;
  closeButton?: boolean;
  progressBar?: boolean;
  progressAnimation?: 'decreasing' | 'increasing';
  positionClass?: string;
  toastClass?: string;
  onActivateTick?: boolean;
  disableTimeOut?: boolean;
}
```

## Service Configuration

### Provider Configuration

```typescript
import {
  provideCoreConfig,
  createCoreConfig,
  provideRepositoryRegistrations,
  createRepositoryRegistration,
} from 'acontplus/core';

export const appConfig: ApplicationConfig = {
  providers: [
    // Core configuration
    provideCoreConfig(
      createCoreConfig({
        apiBaseUrl: environment.apiBaseUrl,
        enableCorrelationTracking: true,
        enableRequestLogging: true,
        enableErrorLogging: true,
        logLevel: environment.logLevel,
        customHeaders: {
          'Client-Version': '1.0.0',
          'Client-Id': 'web-app',
        },
        excludeUrls: ['/health', '/metrics'],
        maxRetryAttempts: 3,
        retryDelay: 1000,
        timeout: 30000,
        enableCaching: true,
        cacheTTL: 300000,
      }),
    ),

    // Repository registrations
    provideRepositoryRegistrations([
      createRepositoryRegistration(
        'user',
        UserRepository,
        'users',
        '/api/users',
      ),
      createRepositoryRegistration(
        'product',
        ProductRepository,
        'products',
        '/api/products',
      ),
    ]),
  ],
};
```

### Environment-Specific Configuration

```typescript
// environment.development.ts
export const environment = {
  production: false,
  apiBaseUrl: 'http://localhost:3000/api',
  logLevel: 'debug',
  enableRequestLogging: true,
};

// environment.production.ts
export const environment = {
  production: true,
  apiBaseUrl: 'https://api.production.com',
  logLevel: 'error',
  enableRequestLogging: false,
};
```

## Best Practices

### 1. Service Injection

- Use the `inject()` function for modern Angular applications
- Prefer constructor injection for complex dependencies
- Use `providedIn: 'root'` for singleton services

### 2. Configuration Management

- Use environment-specific configurations
- Provide sensible defaults for all configuration options
- Validate configuration values at startup

### 3. Error Handling

- Always handle errors from service methods
- Use appropriate error types and categories
- Log errors with sufficient context

### 4. Performance

- Use observables for async operations
- Implement proper cleanup in components
- Cache frequently accessed data when appropriate

### 5. Testing

- Mock services in unit tests
- Test service configurations
- Verify error handling scenarios

## Examples

### Complete Service Example

```typescript
@Injectable({
  providedIn: 'root',
})
export class UserManagementService {
  constructor(
    private coreConfig: CoreConfigService,
    private repositoryFactory: RepositoryFactory,
    private correlationService: CorrelationService,
    private loggingService: LoggingService,
    private toastr: ToastrNotificationService,
  ) {}

  async createUser(userData: CreateUserRequest): Promise<User> {
    const correlationId = this.correlationService.getOrCreateCorrelationId();

    this.loggingService.info('Creating user', {
      correlationId,
      userData: { email: userData.email },
    });

    try {
      const userRepo = this.repositoryFactory.getRequired<User>('user');
      const user = await userRepo.create(userData).toPromise();

      this.loggingService.info('User created successfully', {
        correlationId,
        userId: user.id,
      });

      this.toastr.success({
        message: 'User created successfully!',
        title: 'Success',
      });

      return user;
    } catch (error) {
      this.loggingService.error('Failed to create user', {
        correlationId,
        error: error.message,
      });

      this.toastr.error({
        message: 'Failed to create user',
        title: 'Error',
      });

      throw error;
    }
  }
}
```

---

For more information about specific services and their usage, refer to the
individual service documentation or the
[API Response Handling](api-response-handling.md) guide.
