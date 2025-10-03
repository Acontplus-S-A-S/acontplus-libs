import { Injectable, InjectionToken } from '@angular/core';
import { Observable } from 'rxjs';
import {
  NotificationCallProps,
  NotificationResult,
  SweetAlertConfig,
  NotificationProvider,
} from '../types/notification.types';

export const NOTIFICATION_CONFIG = new InjectionToken<NotificationProviderConfig>(
  'NOTIFICATION_CONFIG',
);

export interface NotificationProviderConfig {
  defaultProvider: NotificationProvider;
  toastr?: unknown;
  snackbar?: unknown;
  sweetalert?: unknown;
}

@Injectable()
export abstract class NotificationProviderBase {
  abstract success(props: NotificationCallProps): void | Observable<NotificationResult>;
  abstract error(props: NotificationCallProps): void | Observable<NotificationResult>;
  abstract warning(props: NotificationCallProps): void | Observable<NotificationResult>;
  abstract info(props: NotificationCallProps): void | Observable<NotificationResult>;
  abstract confirm(config: SweetAlertConfig): Observable<NotificationResult>;
}
