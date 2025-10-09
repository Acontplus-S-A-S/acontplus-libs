import { EnvironmentProviders, makeEnvironmentProviders } from '@angular/core';
import { provideToastr, GlobalConfig } from 'ngx-toastr';
import { NotificationService } from './services/notification.service';
import { NOTIFICATION_CONFIG, NotificationProviderConfig } from './providers/notification.provider';
import { ToastrProvider } from './providers/toastr.provider';
import { SnackbarProvider } from './providers/snackbar.provider';
import { SweetAlertProvider } from './providers/sweetalert.provider';

// Default toastr config (can be overridden)
const DEFAULT_TOASTR_CONFIG: Partial<GlobalConfig> = {
  positionClass: 'toast-bottom-center',
  timeOut: 5000,
  extendedTimeOut: 1500,
  closeButton: true,
  newestOnTop: true,
  preventDuplicates: true,
  progressBar: true,
};

export function provideNotifications(
  config?: Partial<NotificationProviderConfig>,
  toastrConfig?: Partial<GlobalConfig>, // New optional param for dynamic toastr options
): EnvironmentProviders {
  return makeEnvironmentProviders([
    provideToastr({
      ...DEFAULT_TOASTR_CONFIG,
      ...toastrConfig, // Merge with user-provided config for flexibility
    }),

    // Notification providers
    ToastrProvider,
    SnackbarProvider,
    SweetAlertProvider,

    // Configuration
    {
      provide: NOTIFICATION_CONFIG,
      useValue: {
        defaultProvider: 'toastr',
        ...config,
      },
    },

    // Main service
    NotificationService,
  ]);
}
