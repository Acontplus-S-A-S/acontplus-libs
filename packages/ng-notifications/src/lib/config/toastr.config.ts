import { InjectionToken } from '@angular/core';
import { IndividualConfig } from 'ngx-toastr';

export type ToastrNotificationConfig = Partial<IndividualConfig>;

export const TOASTR_NOTIFICATION_CONFIG = new InjectionToken<ToastrNotificationConfig>(
  'toastr-notification-config',
  {
    providedIn: 'root',
    factory: () => ({
      positionClass: 'toast-bottom-center',
      timeOut: 5000,
      extendedTimeOut: 1500,
      closeButton: true,
      newestOnTop: true,
    }),
  },
);
