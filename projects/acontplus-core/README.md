# AcontplusCore

A comprehensive core library for Angular applications providing utilities, services, interceptors, models, and more.

## Features

- **Environments**: Environment configuration utilities
- **Interceptors**: HTTP interceptors for API requests, error handling, and more
- **Models**: Common data models and interfaces
- **Repositories**: Data access layer components
- **Services**: Angular services for common functionalities
- **Use Cases**: Business logic components
- **Utils**: Utility functions and helpers

## Installation

### Prerequisites

- Angular 16.x or higher
- Node.js 18.x or higher

### NPM Installation

```bash
npm install acontplus-core --save
```

### Yarn Installation

```bash
yarn add acontplus-core
```

## Usage

### Environment Configuration

The library provides environment configuration utilities for managing application settings:

```typescript
import { ENVIRONMENT, Environment } from 'acontplus-core';

// Define your environment configuration
const myEnvironment: Environment = {
  apiBaseUrl: 'https://api.example.com',
  isProduction: false,
  storageKey: 'my_app_storage',
  clientId: 'my_client_id'
};

// Provide the environment configuration in your app config
export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: ENVIRONMENT,
      useValue: myEnvironment
    }
  ]
};
```

### Interceptors

#### API Interceptor

The API interceptor handles API responses and errors, showing toastr notifications:

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { apiInterceptor } from 'acontplus-core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([apiInterceptor])
    )
  ]
};
```

#### Session Interceptor

The session interceptor injects authentication and client information into requests:

```typescript
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { injectSessionInterceptor, customUrl } from 'acontplus-core';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([injectSessionInterceptor])
    )
  ]
};

// In your service, use customUrl() for requests that should use their own URL
this.http.get('https://external-api.com/data', { context: customUrl() });
```

### Models

#### API Response Models

The library provides models for API responses:

```typescript
import { ApiResponse, ApiError } from 'acontplus-core';

// Example of using the ApiResponse interface
interface UserResponse extends ApiResponse<User> {
  // Additional properties specific to user responses
}

// Example of handling API errors
function handleError(error: ApiError) {
  console.error(`Error ${error.code}: ${error.message}`);
}
```

#### Entity Models

Base entity model for your domain entities:

```typescript
import { BaseEntity } from 'acontplus-core';

// Extend the BaseEntity interface for your domain entities
interface User extends BaseEntity {
  username: string;
  email: string;
  role: string;
}
```

#### Pagination Models

Models for paginated data and pagination parameters:

```typescript
import { PaginationParams, PaginatedResult, FilterParams } from 'acontplus-core';

// Create pagination parameters
const pagination: PaginationParams = {
  page: 1,
  pageSize: 10,
  sortBy: 'name',
  sortDirection: 'asc'
};

// Create filter parameters
const filters: FilterParams = {
  search: 'john',
  isActive: true
};

// Example of a paginated result
function displayUsers(result: PaginatedResult<User>) {
  console.log(`Showing ${result.items.length} of ${result.totalCount} users`);
  console.log(`Page ${result.pageNumber} of ${Math.ceil(result.totalCount / result.pageSize)}`);
}
```

### Repositories

The library provides a base repository for data access:

```typescript
import { BaseRepository, PaginationParams, FilterParams, PaginatedResult } from 'acontplus-core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';

// Define your entity interface
interface User extends BaseEntity {
  username: string;
  email: string;
}

// Create a repository for your entity
@Injectable({
  providedIn: 'root'
})
class UserRepository extends BaseRepository<User> {
  constructor() {
    const http = inject(HttpClient);
    super(http, '/users');
  }

  override getAll(
    pagination: PaginationParams,
    filters?: FilterParams
  ): Observable<PaginatedResult<User>> {
    const params = this.buildQueryParams(pagination, filters);
    return this.get<PaginatedResult<User>>(this.buildUrl(''), params);
  }

  override getById(id: number): Observable<User> {
    return this.get<User>(this.buildUrl(`${id}`));
  }

  override create(entity: Omit<User, 'id'>): Observable<User> {
    return this.post<User>(this.buildUrl(''), entity);
  }

  override update(id: number, entity: Partial<User>): Observable<User> {
    return this.put<User>(this.buildUrl(`${id}`), entity);
  }

  override delete(id: number): Observable<boolean> {
    return this.deleteHttp<boolean>(this.buildUrl(`${id}`));
  }

  override search(
    query: string,
    pagination: PaginationParams
  ): Observable<PaginatedResult<User>> {
    const params = this.buildQueryParams(pagination, { search: query });
    return this.get<PaginatedResult<User>>(this.buildUrl('search'), params);
  }
}
```

### Services

#### Toastr Notification Service

Service for displaying toast notifications:

```typescript
import { Component, inject } from '@angular/core';
import { ToastrNotificationService } from 'acontplus-core';

@Component({
  selector: 'app-example',
  template: '<button (click)="showNotification()">Show Notification</button>'
})
export class ExampleComponent {
  private toastr = inject(ToastrNotificationService);

  showNotification() {
    // Success notification
    this.toastr.success({ 
      message: 'Operation completed successfully!',
      title: 'Success'
    });

    // Error notification
    this.toastr.error({ 
      message: 'An error occurred!',
      title: 'Error'
    });

    // Warning notification
    this.toastr.warning({ 
      message: 'This action may have consequences!',
      title: 'Warning'
    });

    // Info notification
    this.toastr.info({ 
      message: 'Here is some information.',
      title: 'Info'
    });
  }
}
```

#### Customizing Toastr Notifications

You can customize the default toastr notification settings:

```typescript
import { TOASTR_NOTIFICATION_CONFIG } from 'acontplus-core';

export const appConfig: ApplicationConfig = {
  providers: [
    {
      provide: TOASTR_NOTIFICATION_CONFIG,
      useValue: {
        positionClass: 'toast-top-right',
        timeOut: 3000,
        closeButton: true
      }
    }
  ]
};
```

#### JWT Token Service

Service for handling JWT authentication tokens:

```typescript
import { Component, inject } from '@angular/core';
import { JwtTokenService } from 'acontplus-core';

@Component({
  selector: 'app-auth-example',
  template: '<div>{{ isAuthenticated ? "Logged In" : "Logged Out" }}</div>'
})
export class AuthExampleComponent {
  private jwtService = inject(JwtTokenService);

  get isAuthenticated(): boolean {
    return this.jwtService.isAuthenticated();
  }

  getToken(): string | null {
    return this.jwtService.getToken();
  }
}
```

### Use Cases

The library provides base classes for implementing the Use Case pattern:

```typescript
import { 
  BaseUseCase, 
  Command, 
  CreateCommand, 
  UpdateCommand, 
  DeleteCommand,
  GetByIdQuery,
  GetAllQuery,
  SearchQuery,
  PaginationParams,
  FilterParams,
  PaginatedResult
} from 'acontplus-core';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';

// Define your entity
interface User extends BaseEntity {
  username: string;
  email: string;
}

// Example of a GetById query
@Injectable({
  providedIn: 'root'
})
class GetUserByIdQuery extends GetByIdQuery<User> {
  private userRepository = inject(UserRepository);

  override execute(request: { id: number }): Observable<User> {
    return this.userRepository.getById(request.id);
  }
}

// Example of a Create command
@Injectable({
  providedIn: 'root'
})
class CreateUserCommand extends CreateCommand<User> {
  private userRepository = inject(UserRepository);

  override execute(request: Omit<User, 'id'>): Observable<User> {
    return this.userRepository.create(request);
  }

  // Override validation if needed
  protected override validate(request: Omit<User, 'id'>): ValidationError[] {
    const errors: ValidationError[] = [];

    if (!request.username) {
      errors.push({
        field: 'username',
        message: 'Username is required',
        code: 'REQUIRED'
      });
    }

    if (!request.email) {
      errors.push({
        field: 'email',
        message: 'Email is required',
        code: 'REQUIRED'
      });
    }

    return errors;
  }
}

// Using the use cases in a component
@Component({
  selector: 'app-user-example',
  template: '<div>User Example</div>'
})
export class UserExampleComponent {
  private getUserByIdQuery = inject(GetUserByIdQuery);
  private createUserCommand = inject(CreateUserCommand);

  getUser(id: number): void {
    this.getUserByIdQuery.execute({ id }).subscribe({
      next: (user) => console.log('User:', user),
      error: (error) => console.error('Error:', error)
    });
  }

  createUser(userData: Omit<User, 'id'>): void {
    this.createUserCommand.execute(userData).subscribe({
      next: (user) => console.log('Created user:', user),
      error: (error) => console.error('Error:', error)
    });
  }
}
```

### Utility Functions

#### Color Utilities

The library provides utility functions for working with colors:

```typescript
import { getRandomColor, getRandomHexColor } from 'acontplus-core';

// Generate a random RGBA color with 50% opacity
const rgbaColor = getRandomColor(0.5);
console.log(rgbaColor); // e.g., "rgba(123, 45, 67, 0.5)"

// Generate a random hex color
const hexColor = getRandomHexColor();
console.log(hexColor); // e.g., "#7b2d43"
```

## Development

### Building the Library

To build the library, run:

```bash
ng build acontplus-core
```

This command will compile the project, and the build artifacts will be placed in the `dist/` directory.

### Running Tests

To execute unit tests with Karma, run:

```bash
ng test acontplus-core
```

### Publishing the Library

Once the project is built, you can publish your library by following these steps:

1. Navigate to the `dist` directory:
   ```bash
   cd dist/acontplus-core
   ```

2. Run the `npm publish` command to publish your library to the npm registry:
   ```bash
   npm publish
   ```

## Additional Resources

For more information on using the Angular CLI, including detailed command references, visit the [Angular CLI Overview and Command Reference](https://angular.dev/tools/cli) page.
