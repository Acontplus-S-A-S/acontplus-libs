# @acontplus/ng-auth

Acontplus Angular Authentication Module providing comprehensive authentication and authorization features for Angular applications.

## Installation

```bash
npm install @acontplus/ng-auth
```

## Features

- **Auth Guard**: Route protection with automatic redirect to login page
- **Auth Token Service**: JWT token management and authentication state handling
- **URL Redirection Strategy**: Automatically redirects users back to their intended destination after login
- **Session Expiry Handling**: Manages session expiry during HTTP requests with automatic redirection
- **CSRF Protection**: Built-in CSRF token management for secure API requests
- **Token Repository**: Secure token storage and retrieval with local storage support
- **Authentication Use Cases**: Login, register, refresh token, and logout functionality
- **Domain Models**: User domain models and value objects
- **Clean Architecture**: Organized in domain, application, data, and presentation layers
- **Angular Integration**: Seamless integration with Angular Router and HTTP client
- **Type Safety**: Full TypeScript support with comprehensive type definitions

## URL Redirection Strategy

The module includes a comprehensive URL redirection strategy that ensures users are returned to their intended destination after authentication, even when sessions expire.

### Components

1. **UrlRedirectService** - Manages URL storage and redirection logic
2. **Enhanced Auth Guard** - Captures URLs before redirecting to login
3. **Enhanced Login Use Case** - Redirects to stored URLs after successful authentication
4. **Auth Redirect Interceptor** - Handles session expiry during HTTP requests (optional)

### Basic Setup

```typescript
// app.config.ts
import { authGuard } from '@acontplus/ng-auth';

const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard] // Automatically captures URL if not authenticated
  }
];
```

### Complete Setup (with session expiry handling)

```typescript
// app.config.ts
import { authRedirectInterceptor } from '@acontplus/ng-auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withInterceptors([
        authRedirectInterceptor, // Handles session expiry during API calls
      ])
    ),
  ],
};
```

### How It Works

**Scenario 1 - Route Protection:**
```
User → /dashboard → Auth Guard → Store URL → Login → Success → Redirect to /dashboard
```

**Scenario 2 - Session Expiry (with interceptor):**
```
User on /reports → API Call → 401 Error → Store URL → Login → Success → Redirect to /reports
```

### Manual Usage

```typescript
import { UrlRedirectService } from '@acontplus/ng-auth';

@Component({...})
export class MyComponent {
  constructor(private urlRedirectService: UrlRedirectService) {}

  navigateToForm() {
    // Store current URL before potentially losing session
    this.urlRedirectService.storeCurrentUrlIfAllowed();
  }
}
```

## Usage

## Usage

### Authentication Service

```typescript
import { AuthTokenService } from '@acontplus/ng-auth';

@Component({...})
export class MyComponent {
  constructor(private authService: AuthTokenService) {}

  isUserAuthenticated(): boolean {
    return this.authService.isAuthenticated();
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
      // The LoginUseCase automatically handles URL redirection after success
      const result = await this.loginUseCase.execute(credentials);
    } catch (error) {
      // Handle login error
    }
  }
}
```

## Login UI Component

The library includes a comprehensive login UI component with Material Design styling.

### Basic Usage

```html
<acp-login
  title="Welcome Back"
  [showRegisterButton]="true">
</acp-login>
```

### Component Features

- **Dual Mode Support**: Toggle between login and signup modes
- **Material Design**: Built with Angular Material components  
- **Responsive Layout**: Works on desktop and mobile devices
- **Theme Integration**: Automatically inherits your app's theme colors
- **Validation**: Built-in form validation with error messaging
- **Customizable**: Support for additional form fields and custom footer content

## API Reference

### Core Services

- **AuthTokenService**: JWT token management and authentication state
- **UrlRedirectService**: URL storage and redirection management  
- **CsrfService**: CSRF token management for secure API requests
- **TokenRepository**: Secure token storage and retrieval

### Guards and Interceptors

- **authGuard**: Route protection with automatic URL capture
- **authRedirectInterceptor**: Session expiry handling during HTTP requests (optional)

### Use Cases

- **LoginUseCase**: Handles user login with automatic redirection
- **RegisterUseCase**: Handles user registration
- **LogoutUseCase**: Handles user logout
- **RefreshTokenUseCase**: Handles token refresh

## Architecture

This library follows Clean Architecture principles with clear separation of concerns organized in domain, application, data, and presentation layers.

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

## Login Component

The `LoginComponent` provides a flexible, themeable authentication UI component with support for custom fields and dynamic content.

### Basic Usage

```typescript
import { LoginComponent } from '@acontplus/ng-auth/ui/login';

@Component({
  template: `
    <acp-login 
      title="Welcome Back"
      [showRegisterButton]="true">
    </acp-login>
  `,
  imports: [LoginComponent]
})
export class AuthPageComponent {}
```

### Flexible Form Fields

The component supports additional form fields through two approaches:

#### 1. Additional Form Controls via Inputs

Pass additional form controls programmatically:

```typescript
import { FormControl, Validators } from '@angular/forms';

@Component({...})
export class AuthPageComponent {
  signinExtras = {
    companyId: new FormControl('', Validators.required),
    rememberMe: new FormControl(false)
  };

  signupExtras = {
    companyId: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    validationPin: new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)])
  };
}
```

```html
<acp-login
  [additionalSigninControls]="signinExtras"
  [additionalSignupControls]="signupExtras">
</acp-login>
```

#### 2. Content Projection for Custom Templates

Use content projection slots for custom field templates:

```html
<acp-login>
  <!-- Additional fields for signin form -->
  <div signin-fields>
    <mat-form-field class="w-100">
      <mat-label>Company</mat-label>
      <mat-select formControlName="companyId">
        @for (company of companies; track company.id) {
        <mat-option [value]="company.id">
          {{ company.name }}
        </mat-option>
        }
      </mat-select>
    </mat-form-field>
  </div>

  <!-- Additional fields for signup form -->
  <div signup-fields>
    <mat-form-field class="w-100">
      <mat-label>Company</mat-label>
      <mat-select formControlName="companyId" required>
        @for (company of companies; track company.id) {
        <mat-option [value]="company.id">
          {{ company.name }}
        </mat-option>
        }
      </mat-select>
    </mat-form-field>

    <mat-form-field class="w-100">
      <mat-label>Role</mat-label>
      <mat-select formControlName="role" required>
        <mat-option value="admin">Administrator</mat-option>
        <mat-option value="user">User</mat-option>
        <mat-option value="manager">Manager</mat-option>
      </mat-select>
    </mat-form-field>

    <mat-form-field class="w-100">
      <mat-label>Validation PIN</mat-label>
      <input matInput type="text" placeholder="Enter PIN" formControlName="validationPin" required />
    </mat-form-field>
  </div>
</acp-login>
```

### Dynamic Footer Content

Customize the footer with dynamic content:

```html
<ng-template #customFooter>
  <div class="row mt-3">
    <div class="col-12 text-center">
      <a mat-button color="primary" href="/terms">Terms of Service</a>
      <a mat-button color="primary" href="/privacy">Privacy Policy</a>
    </div>
  </div>
</ng-template>

<acp-login [footerContent]="customFooter">
  <!-- form content -->
</acp-login>
```

### Theme Color Inheritance

The component uses CSS custom properties to inherit colors from the parent app's theme:

- Background gradient: Uses `--mdc-theme-primary` and `--mdc-theme-secondary`
- Title color: Uses `--mdc-theme-on-surface`
- Error alerts: Uses `--mdc-theme-error`, `--mdc-theme-error-container`, `--mdc-theme-on-error-container`

Fallback colors use Angular Material's Material Design 3 (M3) neutral color tokens:
- Primary: #5c5f5c (M3 neutral primary)
- Secondary: #79747e (M3 neutral secondary)
- On surface: #1c1b1f (M3 on-surface)
- Error: #ba1a1a (M3 error)
- Error container: #ffdad6 (M3 error-container)
- On error container: #410002 (M3 on-error-container)

To customize colors, define these CSS variables in your app's global styles:

```css
:root {
  --mdc-theme-primary: #your-primary-color;
  --mdc-theme-secondary: #your-secondary-color;
  --mdc-theme-on-surface: #your-text-color;
  --mdc-theme-error: #your-error-color;
  --mdc-theme-error-container: #your-error-bg;
  --mdc-theme-on-error-container: #your-error-text;
}
```

### Component Inputs

- `title: string` - The title displayed in the card header (default: 'Login')
- `showRegisterButton: boolean` - Whether to show the register button (default: true)
- `additionalSigninControls: Record<string, AbstractControl>` - Additional controls for signin form
- `additionalSignupControls: Record<string, AbstractControl>` - Additional controls for signup form
- `footerContent: TemplateRef<any> | null` - Custom footer template
