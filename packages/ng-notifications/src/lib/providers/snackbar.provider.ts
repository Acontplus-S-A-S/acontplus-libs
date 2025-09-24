import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { NotificationProviderBase } from './notification.provider';
import { SNACKBAR_CONFIG } from '../config/snackbar.config';
import { NOTIFICATION_DURATIONS } from '../constants/notification.constants';
import {
  NotificationCallProps,
  NotificationResult,
  SweetAlertConfig,
  NotificationType,
} from '../types/notification.types';
import { SnackbarProps } from '../models/notification.models';

@Injectable({
  providedIn: 'root',
})
export class SnackbarProvider extends NotificationProviderBase {
  private readonly snackBar = inject(MatSnackBar);
  private readonly config = inject(SNACKBAR_CONFIG);

  /**
   * Display a snackbar with specific type and configuration
   */
  show(props: SnackbarProps): void {
    const {
      type,
      message,
      title,
      action = this.config.defaultAction,
      config: userConfig = {},
    } = props;

    const typeClass = `acontplus-snackbar-${type}`;
    const panelClasses = this.buildPanelClasses(typeClass, userConfig.panelClass);

    const finalConfig = {
      ...this.config,
      ...userConfig,
      panelClass: panelClasses,
    };

    const displayMessage = this.buildMessage(message, title);
    this.snackBar.open(displayMessage, action, finalConfig);
  }

  success(props: NotificationCallProps): void {
    this.show({
      type: 'success',
      message: props.message,
      title: props.title,
      config: {
        duration: NOTIFICATION_DURATIONS.MEDIUM,
        ...props.config,
      },
    });
  }

  error(props: NotificationCallProps): void {
    this.show({
      type: 'error',
      message: props.message,
      title: props.title,
      config: {
        duration: NOTIFICATION_DURATIONS.LONG,
        ...props.config,
      },
    });
  }

  warning(props: NotificationCallProps): void {
    this.show({
      type: 'warning',
      message: props.message,
      title: props.title,
      config: {
        duration: NOTIFICATION_DURATIONS.MEDIUM,
        ...props.config,
      },
    });
  }

  info(props: NotificationCallProps): void {
    this.show({
      type: 'info',
      message: props.message,
      title: props.title,
      config: {
        duration: NOTIFICATION_DURATIONS.MEDIUM,
        ...props.config,
      },
    });
  }

  confirm(config: SweetAlertConfig): Observable<NotificationResult> {
    const result = confirm(`${config.title || ''}\n${config.message}`);
    return of({ isConfirmed: result });
  }

  private buildPanelClasses(typeClass: string, userClasses?: string | string[]): string[] {
    const classes = ['acontplus-snackbar', typeClass];

    if (userClasses) {
      const normalizedClasses = Array.isArray(userClasses) ? userClasses : [userClasses];
      classes.push(...normalizedClasses);
    }

    return classes;
  }

  private buildMessage(message: string, title?: string): string {
    if (!this.config.titleEnabled || !title) {
      return message;
    }
    return `${title}: ${message}`;
  }
}
