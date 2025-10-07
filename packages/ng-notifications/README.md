# @acontplus/ng-notifications

Angular notifications library for AcontPlus applications, providing toast
notifications, alerts, and snackbars using popular libraries like ngx-toastr and
SweetAlert2.

## Installation

```bash
npm install @acontplus/ng-notifications
```

## Features

- **Toast Notifications**: Using ngx-toastr for non-blocking notifications
- **SweetAlert2 Integration**: Modal alerts and confirmations
- **Material Snackbar**: Angular Material snackbar components
- **Notification Service**: Unified service for managing different notification
  types
- **Configuration**: Customizable configurations for toastr and snackbar
- **TypeScript Support**: Full type safety with comprehensive TypeScript
  definitions
- **Angular Material Integration**: Consistent styling with Material Design

## Providers

### Notification Provider

Main provider for notification management.

### Toastr Provider

Provider for ngx-toastr integration.

### Snackbar Provider

Provider for Angular Material snackbar.

### SweetAlert Provider

Provider for SweetAlert2 modals.

## Services

### Notification Service

Service for showing various types of notifications.

## Configuration

### Toastr Config

Configuration for toast notifications.

### Snackbar Config

Configuration for snackbar notifications.

## Usage

Import the providers and services:

```typescript
import { NotificationService, provideNotifications } from '@acontplus/ng-notifications';

// In app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    provideNotifications(),
  ],
};

// In component
@Component({...})
export class MyComponent {
  constructor(private notificationService: NotificationService) {}

  showSuccess() {
    this.notificationService.showSuccess('Operation completed!');
  }

  showError() {
    this.notificationService.showError('Something went wrong!');
  }
}
```

Install these in your application when using this library:

```bash
npm install ngx-toastr sweetalert2
```

## Running unit tests

Run `nx test ng-notifications` to execute the unit tests.
