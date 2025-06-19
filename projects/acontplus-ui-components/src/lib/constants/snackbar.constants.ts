import { SnackbarType } from '../models';

export const SNACKBAR_MESSAGES = {
  SUCCESS: {
    SAVE: 'Data saved successfully',
    DELETE: 'Item deleted successfully',
    UPDATE: 'Data updated successfully',
    UPLOAD: 'File uploaded successfully',
  },
  ERROR: {
    SAVE: 'Failed to save data',
    DELETE: 'Failed to delete item',
    UPDATE: 'Failed to update data',
    UPLOAD: 'Failed to upload file',
    NETWORK: 'Network error occurred',
    UNKNOWN: 'An unexpected error occurred',
  },
  WARNING: {
    UNSAVED_CHANGES: 'You have unsaved changes',
    SESSION_EXPIRING: 'Your session is about to expire',
    STORAGE_FULL: 'Storage is running low',
  },
  INFO: {
    LOADING: 'Loading data...',
    PROCESSING: 'Processing request...',
    MAINTENANCE: 'System maintenance scheduled',
  },
} as const;

export const SNACKBAR_DURATIONS = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000,
  PERSISTENT: 0,
} as const;

export const SNACKBAR_ICONS: Record<SnackbarType, string> = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
} as const;
