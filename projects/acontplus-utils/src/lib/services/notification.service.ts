import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material/snack-bar';

type SnackbarType = 'success' | 'warning' | 'info' | 'error';

interface SnackbarProps {
  type: SnackbarType;
  message: string;
  title?: string;
  action?: string;
  config?: Partial<MatSnackBarConfig>;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  // Default configuration - can be customized per instance
  private readonly defaultConfig: MatSnackBarConfig = {
    duration: 5000,
    horizontalPosition: 'center',
    verticalPosition: 'bottom',
    panelClass: [],
  };

  // Default action text
  private readonly defaultAction = 'x';

  constructor(private snackBar: MatSnackBar) {}

  /**
   * Displays a Material snackbar with a specific type and configurable options.
   * @param props - Configuration object for the snackbar
   */
  show(props: SnackbarProps) {
    const {
      type,
      message,
      title,
      action = this.defaultAction,
      config = {},
    } = props;

    // Create the type-specific CSS class
    const typeClass = `snackbar-${type}`;

    // Build the panel classes array
    const panelClasses: string[] = [typeClass];

    // If user provided additional panelClass, merge them
    if (config.panelClass) {
      if (Array.isArray(config.panelClass)) {
        panelClasses.push(...config.panelClass);
      } else {
        panelClasses.push(config.panelClass);
      }
    }

    // Merge default config with user-provided config
    const finalConfig: MatSnackBarConfig = {
      ...this.defaultConfig,
      ...config,
      panelClass: panelClasses, // Always override to include our type class
    };

    // Build the final message
    const fullMessage = title ? `${title}: ${message}` : message;

    return this.snackBar.open(fullMessage, action, finalConfig);
  }

  /**
   * Quick methods for common notification types with sensible defaults
   */
  showSuccess(
    message: string,
    title?: string,
    config?: Partial<MatSnackBarConfig>
  ) {
    return this.show({ type: 'success', message, title, config });
  }

  showWarning(
    message: string,
    title?: string,
    config?: Partial<MatSnackBarConfig>
  ) {
    return this.show({ type: 'warning', message, title, config });
  }

  showInfo(
    message: string,
    title?: string,
    config?: Partial<MatSnackBarConfig>
  ) {
    return this.show({ type: 'info', message, title, config });
  }

  showError(
    message: string,
    title?: string,
    config?: Partial<MatSnackBarConfig>
  ) {
    // Errors typically should have longer duration
    const errorConfig: Partial<MatSnackBarConfig> = {
      duration: 8000,
      ...config,
    };

    return this.show({ type: 'error', message, title, config: errorConfig });
  }

  /**
   * Update default configuration for all future notifications
   * @param newDefaults - Partial configuration to merge with existing defaults
   */
  updateDefaults(newDefaults: Partial<MatSnackBarConfig>) {
    Object.assign(this.defaultConfig, newDefaults);
  }

  /**
   * Show notification without automatic styling (uses default Material styling)
   * @param message - The message to display
   * @param action - Action button text
   * @param config - Full MatSnackBarConfig
   */
  showRaw(message: string, action?: string, config?: MatSnackBarConfig) {
    const finalConfig = config || this.defaultConfig;
    return this.snackBar.open(message, action, finalConfig);
  }
}
