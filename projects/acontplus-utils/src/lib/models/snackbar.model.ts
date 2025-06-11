export type SnackbarType = 'success' | 'warning' | 'info' | 'error';

export interface SnackbarProps {
  readonly type: SnackbarType;
  readonly message: string;
  readonly title?: string;
  readonly action?: string;
  readonly config?: Partial<
    import('@angular/material/snack-bar').MatSnackBarConfig
  >;
}

export interface NotificationCallProps {
  readonly message: string;
  readonly title?: string;
  readonly config?: Partial<
    import('@angular/material/snack-bar').MatSnackBarConfig
  >;
}

export interface NotificationDemo {
  type: SnackbarType;
  message: string;
  title?: string;
  duration?: number;
}
