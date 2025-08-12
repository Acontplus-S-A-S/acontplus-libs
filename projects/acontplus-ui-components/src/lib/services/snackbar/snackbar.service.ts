import { inject, Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SNACKBAR_CONFIG } from './snackbar.config';
import { SNACKBAR_DURATIONS } from '../../constants';
import { NotificationCallProps, SnackbarProps } from '../../models';
@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
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

  /**
   * Quick success notification
   */
  success(props: NotificationCallProps): void {
    this.show({
      type: 'success',
      ...props,
      config: {
        duration: SNACKBAR_DURATIONS.MEDIUM,
        ...props.config,
      },
    });
  }

  /**
   * Quick error notification with longer duration
   */
  error(props: NotificationCallProps): void {
    this.show({
      type: 'error',
      ...props,
      config: {
        duration: SNACKBAR_DURATIONS.LONG,
        ...props.config,
      },
    });
  }

  /**
   * Quick warning notification
   */
  warning(props: NotificationCallProps): void {
    this.show({
      type: 'warning',
      ...props,
      config: {
        duration: SNACKBAR_DURATIONS.MEDIUM,
        ...props.config,
      },
    });
  }

  /**
   * Quick info notification
   */
  info(props: NotificationCallProps): void {
    this.show({
      type: 'info',
      ...props,
      config: {
        duration: SNACKBAR_DURATIONS.MEDIUM,
        ...props.config,
      },
    });
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
