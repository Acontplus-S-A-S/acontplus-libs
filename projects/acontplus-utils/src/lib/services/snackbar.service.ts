import { inject, Injectable, InjectionToken } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef, SimpleSnackBar } from '@angular/material/snack-bar';

export type SnackbarType = 'success' | 'warning' | 'info' | 'error';

export interface SnackbarProps {
  readonly type: SnackbarType;
  readonly message: string;
  readonly title?: string;
  readonly action?: string;
  readonly config?: Partial<MatSnackBarConfig>;
}

export interface NotificationCallProps {
  readonly message: string;
  readonly title?: string;
  readonly config?: Partial<MatSnackBarConfig>;
}

// Configuration token for dependency injection
export const SNACKBAR_CONFIG = new InjectionToken<MatSnackBarConfig>('snackbar-config', {
  providedIn: 'root',
  factory: () => ({
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    panelClass: [],
  }),
});

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  private readonly snackBar = inject(MatSnackBar);
  private readonly defaultConfig = inject(SNACKBAR_CONFIG);
  private readonly defaultAction = 'Close';

  /**
   * Displays a Material snackbar with a specific type and configurable options.
   */
  show(props: SnackbarProps): MatSnackBarRef<SimpleSnackBar> {
    const {
      type,
      message,
      title,
      action = this.defaultAction,
      config = {},
    } = props;

    const typeClass = `snackbar-${type}`;
    const panelClasses = this.buildPanelClasses(typeClass, config.panelClass);

    const finalConfig: MatSnackBarConfig = {
      ...this.defaultConfig,
      ...config,
      panelClass: panelClasses,
    };

    const fullMessage = title ? `${title}: ${message}` : message;
    return this.snackBar.open(fullMessage, action, finalConfig);
  }

  /**
   * Quick methods for common notification types
   */
  success(props: NotificationCallProps): void {
    this.show({ type: 'success', ...props });
  }

  warning(props: NotificationCallProps): void {
    this.show({ type: 'warning', ...props });
  }

  info(props: NotificationCallProps): void {
    this.show({ type: 'info', ...props });
  }

  error(props: NotificationCallProps): void {
    const errorConfig: Partial<MatSnackBarConfig> = {
      duration: 8000,
      ...props.config,
    };
    this.show({
      type: 'error',
      ...props,
      config: errorConfig
    });
  }

  /**
   * Show notification without automatic styling
   */
  showRaw(
    message: string,
    action?: string,
    config?: MatSnackBarConfig
  ): MatSnackBarRef<SimpleSnackBar> {
    const finalConfig = config ?? this.defaultConfig;
    return this.snackBar.open(message, action, finalConfig);
  }

  private buildPanelClasses(
    typeClass: string,
    userClasses?: string | string[]
  ): string[] {
    const classes = [typeClass];

    if (userClasses) {
      const normalizedClasses = Array.isArray(userClasses) ? userClasses : [userClasses];
      classes.push(...normalizedClasses);
    }

    return classes;
  }
}
