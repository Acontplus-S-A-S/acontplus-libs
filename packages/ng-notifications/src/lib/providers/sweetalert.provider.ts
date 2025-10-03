import { Injectable } from '@angular/core';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import Swal from 'sweetalert2';
import { NotificationProviderBase } from './notification.provider';
import {
  NotificationCallProps,
  NotificationResult,
  NotificationType,
  SweetAlertConfig,
} from '../types/notification.types';

@Injectable({
  providedIn: 'root',
})
export class SweetAlertProvider extends NotificationProviderBase {
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
    };

    return from(Swal.fire(swalConfig)).pipe(
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
      timer: (duration as number) || 5000,
      showConfirmButton: true,
      timerProgressBar: true,
      ...otherConfig,
    };

    return from(Swal.fire(swalConfig)).pipe(
      map(result => ({
        isConfirmed: result.isConfirmed,
        isDenied: result.isDenied,
        isDismissed: result.isDismissed,
        value: result.value,
      })),
    );
  }
}
