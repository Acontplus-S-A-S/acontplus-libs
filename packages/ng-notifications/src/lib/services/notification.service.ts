import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import {
  NotificationProviderBase,
  NOTIFICATION_CONFIG,
  NotificationProviderConfig,
} from '../providers/notification.provider';
import { ToastrProvider } from '../providers/toastr.provider';
import { SnackbarProvider } from '../providers/snackbar.provider';
import { SweetAlertProvider } from '../providers/sweetalert.provider';
import {
  NotificationCallProps,
  NotificationResult,
  SweetAlertConfig,
  NotificationProvider,
  NotificationType,
} from '../types/notification.types';
import { NOTIFICATION_MESSAGES } from '../constants/notification.constants';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private config = inject<NotificationProviderConfig>(NOTIFICATION_CONFIG);
  private toastrProvider = inject(ToastrProvider);
  private snackbarProvider = inject(SnackbarProvider);
  private sweetAlertProvider = inject(SweetAlertProvider);

  private providers = new Map<NotificationProvider, NotificationProviderBase>();
  private currentProvider: NotificationProviderBase;

  // Expose predefined messages
  readonly messages = NOTIFICATION_MESSAGES;

  constructor() {
    this.providers.set('toastr', this.toastrProvider);
    this.providers.set('snackbar', this.snackbarProvider);
    this.providers.set('sweetalert', this.sweetAlertProvider);

    this.currentProvider =
      this.providers.get(this.config.defaultProvider) || this.sweetAlertProvider;
  }

  setProvider(provider: NotificationProvider): void {
    const providerInstance = this.providers.get(provider);
    if (providerInstance) {
      this.currentProvider = providerInstance;
    }
  }

  success(props: NotificationCallProps): void | Observable<NotificationResult> {
    return this.currentProvider.success(props);
  }

  error(props: NotificationCallProps): void | Observable<NotificationResult> {
    return this.currentProvider.error(props);
  }

  warning(props: NotificationCallProps): void | Observable<NotificationResult> {
    return this.currentProvider.warning(props);
  }

  info(props: NotificationCallProps): void | Observable<NotificationResult> {
    return this.currentProvider.info(props);
  }

  confirm(config: SweetAlertConfig): Observable<NotificationResult> {
    return this.currentProvider.confirm(config);
  }

  show(
    props: { type: NotificationType } & NotificationCallProps,
  ): void | Observable<NotificationResult> {
    return this.currentProvider[props.type]({
      message: props.message,
      title: props.title,
      config: props.config,
    });
  }

  // Provider-specific methods maintaining your current API
  get toastr(): ToastrProvider {
    return this.providers.get('toastr') as ToastrProvider;
  }

  get snackbar(): SnackbarProvider {
    return this.providers.get('snackbar') as SnackbarProvider;
  }

  get sweetAlert(): SweetAlertProvider {
    return this.providers.get('sweetalert') as SweetAlertProvider;
  }

  // Quick methods using predefined messages
  quickSave(type: 'success' | 'error' = 'success'): void {
    const message = type === 'success' ? this.messages.SUCCESS.SAVE : this.messages.ERROR.SAVE;
    this.currentProvider[type]({ message });
  }

  quickDelete(type: 'success' | 'error' = 'success'): void {
    const message = type === 'success' ? this.messages.SUCCESS.DELETE : this.messages.ERROR.DELETE;
    this.currentProvider[type]({ message });
  }

  quickUpdate(type: 'success' | 'error' = 'success'): void {
    const message = type === 'success' ? this.messages.SUCCESS.UPDATE : this.messages.ERROR.UPDATE;
    this.currentProvider[type]({ message });
  }

  networkError(): void {
    this.currentProvider.error({
      message: this.messages.ERROR.NETWORK,
      title: 'Connection Error',
    });
  }

  sessionWarning(): void {
    this.currentProvider.warning({
      message: this.messages.WARNING.SESSION_EXPIRING,
      title: 'Session Alert',
    });
  }
}
