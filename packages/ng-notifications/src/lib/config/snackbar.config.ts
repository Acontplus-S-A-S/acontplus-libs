import { InjectionToken } from '@angular/core';
import { MatSnackBarConfig } from '@angular/material/snack-bar';

export interface SnackbarConfig extends MatSnackBarConfig {
  readonly defaultAction?: string;
  readonly iconEnabled?: boolean;
  readonly titleEnabled?: boolean;
}

export const DEFAULT_SNACKBAR_CONFIG: SnackbarConfig = {
  duration: 5000,
  horizontalPosition: 'center',
  verticalPosition: 'bottom',
  panelClass: [],
  defaultAction: 'Close',
  iconEnabled: true,
  titleEnabled: true,
};

export const SNACKBAR_CONFIG = new InjectionToken<SnackbarConfig>('acontplus-snackbar-config', {
  providedIn: 'root',
  factory: () => DEFAULT_SNACKBAR_CONFIG,
});
