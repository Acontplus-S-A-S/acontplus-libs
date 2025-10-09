import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, of } from 'rxjs';
import { NotificationProviderBase } from './notification.provider';
import { SNACKBAR_CONFIG, SnackbarConfig } from '../config/snackbar.config';
import {
  NotificationCallProps,
  NotificationResult,
  SweetAlertConfig,
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
      config: props.config as Partial<SnackbarConfig>,
    });
  }

  error(props: NotificationCallProps): void {
    this.show({
      type: 'error',
      message: props.message,
      title: props.title,
      config: props.config as Partial<SnackbarConfig>,
    });
  }

  warning(props: NotificationCallProps): void {
    this.show({
      type: 'warning',
      message: props.message,
      title: props.title,
      config: props.config as Partial<SnackbarConfig>,
    });
  }

  info(props: NotificationCallProps): void {
    this.show({
      type: 'info',
      message: props.message,
      title: props.title,
      config: props.config as Partial<SnackbarConfig>,
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
