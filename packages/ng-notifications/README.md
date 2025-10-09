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
- **SweetAlert2 Integration**: Modal alerts and confirmations with Material UI
  theme support
- **Material Snackbar**: Angular Material snackbar components
- **Auto Theme Detection**: Automatically detects light/dark theme for
  SweetAlert2
- **Unified Service**: Single service for managing different notification
  providers
- **Flexible Configuration**: Customizable configurations for all providers
- **TypeScript Support**: Full type safety with comprehensive TypeScript
  definitions
- **SSR Compatible**: Server-side rendering support
- **Lifecycle Callbacks**: Support for SweetAlert2 lifecycle hooks (didOpen,
  willClose, etc.)

## Configuration Options

### NotificationProviderConfig

```typescript
interface NotificationProviderConfig {
  defaultProvider: 'sweetalert' | 'toastr' | 'snackbar';
  sweetalert?: {
    defaultTheme?:
      | 'auto'
      | 'material-ui'
      | 'material-ui-light'
      | 'material-ui-dark';
  };
  toastr?: ToastrConfig;
  snackbar?: SnackbarConfig;
}
```

### SweetAlert2 Theme Options

- `'auto'` - Auto-detects based on `.dark-theme` CSS class (default)
- `'material-ui'` - Follows system preference
- `'material-ui-light'` - Always light theme
- `'material-ui-dark'` - Always dark theme

## Quick Start

### 1. Install Dependencies

```bash
npm install @acontplus/ng-notifications ngx-toastr sweetalert2
```

### 2. Import CSS (in styles.scss)

```scss
@import 'ngx-toastr/toastr';
@import 'sweetalert2/themes/material-ui.css';
```

### 3. Configure Providers

```typescript
import { provideNotifications } from '@acontplus/ng-notifications';

// In app.config.ts
export const appConfig: ApplicationConfig = {
  providers: [
    // Basic configuration
    provideNotifications({
      defaultProvider: 'sweetalert', // or 'toastr' | 'snackbar'
    }),

    // Advanced configuration
    provideNotifications({
      defaultProvider: 'sweetalert',
      sweetalert: {
        defaultTheme: 'auto', // auto-detects light/dark theme
      },
    }),
  ],
};
```

### 4. Use in Components

```typescript
import { NotificationService } from '@acontplus/ng-notifications';

@Component({...})
export class MyComponent {
  constructor(private notificationService: NotificationService) {}

  // Basic notifications
  showSuccess() {
    this.notificationService.success({
      title: 'Success!',
      message: 'Operation completed successfully'
    });
  }

  showError() {
    this.notificationService.error({
      title: 'Error',
      message: 'Something went wrong'
    });
  }

  // Confirmation dialog
  confirmAction() {
    this.notificationService.confirm({
      title: 'Are you sure?',
      message: 'This action cannot be undone'
    }).subscribe(result => {
      if (result.isConfirmed) {
        console.log('User confirmed');
      }
    });
  }

  // Custom configuration
  showCustom() {
    this.notificationService.info({
      title: 'Info',
      message: 'Custom notification',
      config: {
        duration: 3000, // Auto-close after 3 seconds
        theme: 'material-ui-dark', // Force dark theme
        didOpen: (popup) => {
          console.log('Notification opened', popup);
        }
      }
    });
  }
}
```

## Provider Behaviors

### SweetAlert2 (Default)

- **Theme**: Auto-detects light/dark theme by default
- **Duration**: Stays open until user interaction (Material Design approach)
- **Customization**: Full SweetAlert2 API support via config object

```typescript
// Auto-detects theme, stays open
this.notificationService.success({ title: 'Success', message: 'Saved!' });

// Custom theme and auto-close
this.notificationService.info({
  title: 'Info',
  message: 'Processing...',
  config: {
    theme: 'material-ui-dark',
    timer: 3000,
    timerProgressBar: true,
  },
});
```

### Material Snackbar

- **Duration**: Auto-dismisses after 5 seconds (Material Design default)
- **Position**: Bottom center
- **Customization**: Full MatSnackBarConfig support

```typescript
// Uses default 5-second duration
this.notificationService.snackbar.success({ message: 'Success!' });

// Custom duration and position
this.notificationService.snackbar.info({
  message: 'Info message',
  config: {
    duration: 2000,
    verticalPosition: 'top',
    horizontalPosition: 'right',
  },
});
```

### Toastr

- **Duration**: Auto-dismisses based on type (success: 5s, error: 10s)
- **Position**: Top right
- **Customization**: Full ngx-toastr configuration support

## Theme Configuration

### Auto Theme Detection (Default)

```typescript
provideNotifications({
  defaultProvider: 'sweetalert',
  // No theme config needed - auto-detects light/dark
});
```

### Manual Theme Control

```typescript
provideNotifications({
  defaultProvider: 'sweetalert',
  sweetalert: {
    defaultTheme: 'material-ui-dark', // Always dark
    // defaultTheme: 'material-ui-light' // Always light
    // defaultTheme: 'material-ui' // System preference
  },
});
```

### Per-Notification Theme Override

```typescript
this.notificationService.success({
  title: 'Success',
  message: 'Completed',
  config: {
    theme: 'material-ui-light', // Override default theme
  },
});
```

## Advanced Usage

### Lifecycle Callbacks

```typescript
this.notificationService.success({
  title: 'Success',
  message: 'Data saved',
  config: {
    didOpen: popup => {
      console.log('Notification opened');
      popup.querySelector('.swal2-confirm')?.focus();
    },
    willClose: () => {
      console.log('Notification closing');
    },
    didClose: () => {
      console.log('Notification closed');
    },
  },
});
```

### Provider-Specific Access

```typescript
// Direct provider access
this.notificationService.sweetAlert.success({
  title: 'Success',
  message: 'Done!',
});
this.notificationService.toastr.error({ message: 'Error occurred' });
this.notificationService.snackbar.info({ message: 'Information' });
```

### Quick Methods

```typescript
// Predefined messages
this.notificationService.quickSave(); // "Data saved successfully"
this.notificationService.quickDelete(); // "Item deleted"
this.notificationService.networkError(); // "Network connection error"
```

## Running unit tests

Run `nx test ng-notifications` to execute the unit tests.
