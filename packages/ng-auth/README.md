# @acontplus/ng-auth

Acontplus Angular Authentication Module providing comprehensive authentication and authorization features for Angular applications.

## Installation

```bash
npm install @acontplus/ng-auth
```

## Features

- **Auth Guard**: Route protection with automatic redirect to login page
- **Auth Token Service**: JWT token management and authentication state handling
- **CSRF Protection**: Built-in CSRF token management for secure API requests
- **Token Repository**: Secure token storage and retrieval with local storage support
- **Authentication Use Cases**: Login, register, refresh token, and logout functionality
- **Domain Models**: User domain models and value objects
- **Clean Architecture**: Organized in domain, application, data, and presentation layers
- **Angular Integration**: Seamless integration with Angular Router and HTTP client
- **Type Safety**: Full TypeScript support with comprehensive type definitions

## Usage

### Route Protection with Auth Guard

```typescript
import { authGuard } from '@acontplus/ng-auth';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  {
    path: 'admin',
    component: AdminComponent,
    canActivate: [authGuard]
  }
];
```

### Authentication Service

```typescript
import { AuthTokenService } from '@acontplus/ng-auth';

@Component({...})
export class MyComponent {
  constructor(private authService: AuthTokenService) {}

  isUserAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  getAuthToken(): string | null {
    return this.authService.getToken();
  }
}
```

### CSRF Protection

```typescript
import { CsrfService } from '@acontplus/ng-auth';

@Component({...})
export class LoginComponent {
  constructor(private csrfService: CsrfService) {}

  async login(credentials: LoginCredentials) {
    const csrfToken = await this.csrfService.getCsrfToken();
    
    // Include CSRF token in your login request
    const response = await this.http.post('/api/login', {
      ...credentials,
      csrfToken
    });
  }
}
```

### Using Authentication Use Cases

```typescript
import { LoginUseCase, LogoutUseCase } from '@acontplus/ng-auth';

@Component({...})
export class AuthComponent {
  constructor(
    private loginUseCase: LoginUseCase,
    private logoutUseCase: LogoutUseCase
  ) {}

  async login(credentials: LoginCredentials) {
    try {
      const result = await this.loginUseCase.execute(credentials);
      // Handle successful login
    } catch (error) {
      // Handle login error
    }
  }

  async logout() {
    await this.logoutUseCase.execute();
    // Handle logout
  }
}
```

### Module Setup

```typescript
import { NgModule } from '@angular/core';
import { authProviders } from '@acontplus/ng-auth';

@NgModule({
  providers: [
    ...authProviders
  ]
})
export class AppModule { }
```

## Running unit tests

Run `nx test ng-auth` to execute the unit tests.
