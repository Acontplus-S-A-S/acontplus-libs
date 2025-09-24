import { Injectable, inject } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';
import { Observable, of } from 'rxjs';
import { NotificationProviderBase } from './notification.provider';
import { TOASTR_NOTIFICATION_CONFIG } from '../config/toastr.config';
import {
  NotificationCallProps,
  NotificationResult,
  SweetAlertConfig,
} from '../types/notification.types';

export type ToastrType = 'success' | 'error' | 'warning' | 'info';

export interface ToastrShowProps {
  readonly type: ToastrType;
  readonly message: string;
  readonly title?: string;
  readonly options?: Partial<IndividualConfig>;
}

@Injectable({
  providedIn: 'root',
})
export class ToastrProvider extends NotificationProviderBase {
  private readonly toastrService = inject(ToastrService);
  private readonly config = inject(TOASTR_NOTIFICATION_CONFIG);

  /**
   * Generic show method for dynamic toast types
   */
  show(props: ToastrShowProps): void {
    const { type, message, title, options: overrideOptions } = props;
    const finalOptions = { ...this.config, ...overrideOptions };

    this.toastrService[type](message, title, finalOptions);
  }

  success(props: NotificationCallProps): void {
    this.show({
      type: 'success',
      message: props.message,
      title: props.title,
      options: props.config,
    });
  }

  error(props: NotificationCallProps): void {
    this.show({
      type: 'error',
      message: props.message,
      title: props.title,
      options: props.config,
    });
  }

  warning(props: NotificationCallProps): void {
    this.show({
      type: 'warning',
      message: props.message,
      title: props.title,
      options: props.config,
    });
  }

  info(props: NotificationCallProps): void {
    this.show({
      type: 'info',
      message: props.message,
      title: props.title,
      options: props.config,
    });
  }

  confirm(config: SweetAlertConfig): Observable<NotificationResult> {
    const result = confirm(`${config.title || ''}\n${config.message}`);
    return of({ isConfirmed: result });
  }
}
