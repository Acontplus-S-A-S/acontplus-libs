import { Provider, EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideToastr } from 'ngx-toastr';
import { NotificationService } from './services/notification.service';
import { NOTIFICATION_CONFIG, NotificationProviderConfig } from './providers/notification.provider';
import { ToastrProvider } from './providers/toastr.provider';
import { SnackbarProvider } from './providers/snackbar.provider';
import { SweetAlertProvider } from './providers/sweetalert.provider';

export function provideNotifications(
  config?: Partial<NotificationProviderConfig>,
): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideToastr({
      positionClass: 'toast-bottom-center',
      timeOut: 5000,
      extendedTimeOut: 1500,
      closeButton: true,
      newestOnTop: true,
      preventDuplicates: true,
      progressBar: true,
    }),

    // Notification providers
    ToastrProvider,
    SnackbarProvider,
    SweetAlertProvider,

    // Configuration
    {
      provide: NOTIFICATION_CONFIG,
      useValue: {
        defaultProvider: 'sweetalert',
        ...config,
      },
    },

    // Main service
    NotificationService,
  ]);
}
