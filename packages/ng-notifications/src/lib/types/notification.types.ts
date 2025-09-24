import { IndividualConfig } from 'ngx-toastr';
import { MatSnackBarConfig } from '@angular/material/snack-bar';

export type NotificationType = 'success' | 'error' | 'warning' | 'info';
export type NotificationPosition =
  | 'top-right'
  | 'top-left'
  | 'bottom-right'
  | 'bottom-left'
  | 'top-center'
  | 'bottom-center';
export type NotificationProvider = 'toastr' | 'snackbar' | 'sweetalert';

export interface BaseNotificationConfig {
  readonly message: string;
  readonly title?: string;
  readonly type?: NotificationType;
}

export interface NotificationCallProps extends BaseNotificationConfig {
  readonly config?: any;
}

export interface SweetAlertConfig extends BaseNotificationConfig {
  readonly confirmButtonText?: string;
  readonly cancelButtonText?: string;
  readonly showCancelButton?: boolean;
  readonly allowOutsideClick?: boolean;
  readonly customClass?: string;
  readonly html?: string;
}

export interface NotificationResult {
  isConfirmed?: boolean;
  isDenied?: boolean;
  isDismissed?: boolean;
  value?: any;
}
