import { Injectable, inject } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import {
  NotificationProviderBase,
  NotificationProviderConfig,
  NOTIFICATION_CONFIG,
} from './notification.provider';
import {
  NotificationCallProps,
  NotificationResult,
  NotificationType,
  SweetAlertConfig,
} from '../types/notification.types';
import { ThemeDetectorService } from '../services/theme-detector.service';

@Injectable({
  providedIn: 'root',
})
export class SweetAlertProvider extends NotificationProviderBase {
  private config = inject<NotificationProviderConfig>(NOTIFICATION_CONFIG);
  private themeDetector = inject(ThemeDetectorService);

  private getTheme(): string {
    const configTheme = (this.config.sweetalert as any)?.defaultTheme;

    // Default to 'auto' if no theme specified
    if (!configTheme || configTheme === 'auto') {
      // Auto-detect theme based on CSS classes
      const isDark =
        document?.body?.classList?.contains('dark-theme') ||
        document?.documentElement?.classList?.contains('dark-theme');
      return isDark ? 'material-ui-dark' : 'material-ui-light';
    }

    return configTheme;
  }
  success(props: NotificationCallProps): Observable<NotificationResult> {
    return this.showAlert({ ...props, type: 'success' });
  }

  error(props: NotificationCallProps): Observable<NotificationResult> {
    return this.showAlert({ ...props, type: 'error' });
  }

  warning(props: NotificationCallProps): Observable<NotificationResult> {
    return this.showAlert({ ...props, type: 'warning' });
  }

  info(props: NotificationCallProps): Observable<NotificationResult> {
    return this.showAlert({ ...props, type: 'info' });
  }

  confirm(config: SweetAlertConfig): Observable<NotificationResult> {
    const swalConfig = {
      title: config.title,
      text: config.message,
      html: config.html,
      icon: 'question' as const,
      showCancelButton: config.showCancelButton !== false,
      confirmButtonText: config.confirmButtonText || 'Confirm',
      cancelButtonText: config.cancelButtonText || 'Cancel',
      allowOutsideClick: config.allowOutsideClick !== false,
      customClass: config.customClass ? { container: config.customClass } : undefined,
      theme: this.getTheme(),
    };

    return from(Swal.fire(swalConfig as any)).pipe(
      map(result => ({
        isConfirmed: result.isConfirmed,
        isDenied: result.isDenied,
        isDismissed: result.isDismissed,
        value: result.value,
      })),
    );
  }

  private showAlert(
    props: NotificationCallProps & { type: NotificationType },
  ): Observable<NotificationResult> {
    const configOptions = props.config as Record<string, unknown> | undefined;
    const { duration, ...otherConfig } = configOptions || {};
    const swalConfig = {
      title: props.title,
      text: props.message,
      icon: props.type as 'success' | 'error' | 'warning' | 'info',
      theme: this.getTheme(),
      ...(duration ? { timer: duration as number, timerProgressBar: true } : {}),
      ...otherConfig,
    };

    return from(Swal.fire(swalConfig as any)).pipe(
      map(result => ({
        isConfirmed: result.isConfirmed,
        isDenied: result.isDenied,
        isDismissed: result.isDismissed,
        value: result.value,
      })),
    );
  }
}
