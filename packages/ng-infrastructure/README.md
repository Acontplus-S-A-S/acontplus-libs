# @acontplus/ng-infrastructure

Angular infrastructure library for AcontPlus applications, providing HTTP
interceptors, repositories, adapters, and core services for robust application
architecture.

## Installation

```bash
npm install @acontplus/ng-infrastructure
```

## Features

- **HTTP Interceptors**: API handling, HTTP context management, and
  spinner/loading indicators
- **Repositories**: Generic and specific data access repositories (base HTTP,
  user repository)
- **Adapters**: External integration adapters (Angular HTTP adapter)
- **Services**: Core configuration, correlation ID management, logging, and
  tenant services
- **Use Cases**: Base use case patterns with commands and queries
- **Interfaces**: Token provider interfaces for authentication
- **TypeScript Support**: Full type safety with comprehensive TypeScript
  definitions

## Interceptors

### API Interceptor

Handles API requests and responses.

### HTTP Context Interceptor

Manages HTTP context for requests.

### Spinner Interceptor

Manages loading spinners during HTTP operations.

## Repositories

### Base HTTP Repository

Base class for HTTP-based data access.

### Generic Repository

Generic repository implementation.

### User Repository

Specific repository for user data.

### Repository Factory

Factory for creating repository instances.

## Services

### Core Config Service

Manages core application configuration.

### Correlation Service

Handles correlation IDs for request tracing.

### Logging Service

Provides logging functionality.

### Tenant Service

Manages multi-tenant configurations.

## Usage

Import the desired modules and services in your Angular application.

```typescript
import {
  apiInterceptor,
  spinnerInterceptor,
} from '@acontplus/ng-infrastructure';

// In app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(withInterceptors([apiInterceptor, spinnerInterceptor])),
  ],
};
```

## Running unit tests

Run `nx test ng-infrastructure` to execute the unit tests.
