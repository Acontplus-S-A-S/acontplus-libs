# @acontplus/ng-infrastructure

Angular infrastructure library providing HTTP interceptors, repositories,
adapters, and core services following clean architecture patterns for robust
enterprise applications.

## Installation

```bash
# Using npm
npm install @acontplus/ng-infrastructure

# Using pnpm
pnpm add @acontplus/ng-infrastructure
```

## Features

- **HTTP Interceptors**: API request/response handling, HTTP context management,
  and loading indicators
- **Repository Pattern**: Base HTTP repository, generic repository, and
  repository factory
- **HTTP Adapters**: Angular HTTP client adapter for external service
  integration
- **Core Services**: Configuration, correlation tracking, logging, and tenant
  management
- **Use Cases**: Base use case patterns with command and query separation (CQRS)
- **Clean Architecture**: Separation of concerns with infrastructure layer
  abstractions
- **TypeScript Support**: Full type safety with comprehensive interfaces

## Quick Start

### Configure Interceptors

```typescript
import {
  apiInterceptor,
  httpContextInterceptor,
  spinnerInterceptor,
} from '@acontplus/ng-infrastructure';

// In app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        apiInterceptor,
        spinnerInterceptor,
        httpContextInterceptor,
      ]),
    ),
  ],
};
```

## HTTP Interceptors

### API Interceptor

Handles API request/response transformation and error handling.

```typescript
import { apiInterceptor } from '@acontplus/ng-infrastructure';

// Automatically handles:
// - Request/response transformation
// - Error standardization
// - API base URL configuration
// - Response format normalization
```

### HTTP Context Interceptor

Manages HTTP context and correlation IDs for request tracing.

```typescript
import { httpContextInterceptor } from '@acontplus/ng-infrastructure';

// Automatically adds:
// - Correlation IDs to requests
// - Request context information
// - Tenant information
// - Request metadata
```

### Spinner Interceptor

Manages loading indicators during HTTP operations.

```typescript
import { spinnerInterceptor } from '@acontplus/ng-infrastructure';

// Automatically handles:
// - Loading state management
// - Spinner show/hide logic
// - Multiple concurrent request handling
// - Error state cleanup
```

## Repository Pattern

### Base HTTP Repository

Abstract base class for HTTP-based data access.

```typescript
import { BaseHttpRepository } from '@acontplus/ng-infrastructure';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

interface User {
  id: number;
  name: string;
  email: string;
}

@Injectable({ providedIn: 'root' })
export class UserRepository extends BaseHttpRepository<User> {
  constructor(http: HttpClient) {
    super(http, '/api/users');
  }

  // Inherits common CRUD operations:
  // - getById(id: number)
  // - getAll()
  // - create(entity: User)
  // - update(id: number, entity: Partial<User>)
  // - delete(id: number)
}
```

### Generic Repository

Generic repository implementation with type safety.

```typescript
import { GenericRepository } from '@acontplus/ng-infrastructure';

@Injectable({ providedIn: 'root' })
export class CustomerRepository extends GenericRepository<Customer, number> {
  constructor(http: HttpClient) {
    super(http, '/api/customers');
  }

  // Custom business methods
  async findByEmail(email: string): Promise<Customer[]> {
    return (
      this.http
        .get<Customer[]>(`${this.baseUrl}/search?email=${email}`)
        .toPromise() || []
    );
  }
}
```

### Repository Factory

Factory pattern for creating repository instances.

```typescript
import { RepositoryFactory } from '@acontplus/ng-infrastructure';

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private repositoryFactory: RepositoryFactory) {}

  getUserRepository() {
    return this.repositoryFactory.create<User>('users');
  }

  getCustomerRepository() {
    return this.repositoryFactory.create<Customer>('customers');
  }
}
```

## HTTP Adapters

### Angular HTTP Adapter

Adapter for Angular HTTP client integration.

```typescript
import { AngularHttpAdapter } from '@acontplus/ng-infrastructure';

@Injectable({ providedIn: 'root' })
export class ExternalApiService {
  constructor(private httpAdapter: AngularHttpAdapter) {}

  async fetchExternalData(url: string): Promise<any> {
    return this.httpAdapter.get(url);
  }

  async postData(url: string, data: any): Promise<any> {
    return this.httpAdapter.post(url, data);
  }
}
```

## Core Services

### Core Config Service

Manages application configuration and settings.

```typescript
import { CoreConfigService } from '@acontplus/ng-infrastructure';

@Injectable({ providedIn: 'root' })
export class AppService {
  constructor(private configService: CoreConfigService) {}

  getApiBaseUrl(): string {
    return this.configService.getApiBaseUrl();
  }

  getTimeout(): number {
    return this.configService.getTimeout();
  }
}
```

### Correlation Service

Handles correlation IDs for distributed request tracing.

```typescript
import { CorrelationInfo } from '@acontplus/ng-infrastructure';

@Injectable({ providedIn: 'root' })
export class TrackingService {
  constructor(private correlationInfo: CorrelationInfo) {}

  getCurrentCorrelationId(): string {
    return this.correlationInfo.getCorrelationId();
  }

  generateNewCorrelationId(): string {
    return this.correlationInfo.generateCorrelationId();
  }
}
```

### Logging Service

Structured logging with correlation tracking.

```typescript
import { LoggingService } from '@acontplus/ng-infrastructure';

@Injectable({ providedIn: 'root' })
export class BusinessService {
  constructor(private logger: LoggingService) {}

  processOrder(order: Order): void {
    this.logger.info('Processing order', { orderId: order.id });

    try {
      // Business logic
      this.logger.info('Order processed successfully', { orderId: order.id });
    } catch (error) {
      this.logger.error('Order processing failed', error, {
        orderId: order.id,
      });
    }
  }
}
```

### Tenant Service

Multi-tenant application support.

```typescript
import { TenantInfo } from '@acontplus/ng-infrastructure';

@Injectable({ providedIn: 'root' })
export class MultiTenantService {
  constructor(private tenantInfo: TenantInfo) {}

  getCurrentTenant(): string {
    return this.tenantInfo.getTenantId();
  }

  setTenant(tenantId: string): void {
    this.tenantInfo.setTenantId(tenantId);
  }
}
```

## Use Cases (CQRS Pattern)

### Base Use Case

Abstract base class for business logic encapsulation.

```typescript
import { BaseUseCase } from '@acontplus/ng-infrastructure';

export class CreateUserUseCase extends BaseUseCase<CreateUserCommand, User> {
  constructor(
    private userRepository: UserRepository,
    private logger: LoggingService,
  ) {
    super();
  }

  async execute(command: CreateUserCommand): Promise<User> {
    this.logger.info('Creating user', { email: command.email });

    // Validation
    this.validateCommand(command);

    // Business logic
    const user = await this.userRepository.create({
      name: command.name,
      email: command.email,
    });

    this.logger.info('User created successfully', { userId: user.id });
    return user;
  }

  private validateCommand(command: CreateUserCommand): void {
    if (!command.email || !command.name) {
      throw new Error('Email and name are required');
    }
  }
}
```

### Commands and Queries

Separation of read and write operations.

```typescript
import { Commands, Queries } from '@acontplus/ng-infrastructure';

// Command for write operations
export class UpdateUserCommand extends Commands.BaseCommand {
  constructor(
    public readonly userId: number,
    public readonly name: string,
    public readonly email: string,
  ) {
    super();
  }
}

// Query for read operations
export class GetUserQuery extends Queries.BaseQuery<User> {
  constructor(public readonly userId: number) {
    super();
  }
}

// Usage
@Injectable({ providedIn: 'root' })
export class UserService {
  constructor(
    private updateUserUseCase: UpdateUserUseCase,
    private getUserUseCase: GetUserUseCase,
  ) {}

  async updateUser(userId: number, name: string, email: string): Promise<User> {
    const command = new UpdateUserCommand(userId, name, email);
    return this.updateUserUseCase.execute(command);
  }

  async getUser(userId: number): Promise<User> {
    const query = new GetUserQuery(userId);
    return this.getUserUseCase.execute(query);
  }
}
```
