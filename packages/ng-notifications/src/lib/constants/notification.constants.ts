export const NOTIFICATION_MESSAGES = {
  SUCCESS: {
    SAVE: 'Data saved successfully',
    DELETE: 'Item deleted successfully',
    UPDATE: 'Data updated successfully',
    UPLOAD: 'File uploaded successfully',
    CREATE: 'Item created successfully',
    SYNC: 'Data synchronized successfully',
  },
  ERROR: {
    SAVE: 'Failed to save data',
    DELETE: 'Failed to delete item',
    UPDATE: 'Failed to update data',
    UPLOAD: 'Failed to upload file',
    NETWORK: 'Network error occurred',
    UNKNOWN: 'An unexpected error occurred',
    VALIDATION: 'Validation error',
    UNAUTHORIZED: 'Unauthorized access',
    SERVER: 'Server error occurred',
  },
  WARNING: {
    UNSAVED_CHANGES: 'You have unsaved changes',
    SESSION_EXPIRING: 'Your session is about to expire',
    STORAGE_FULL: 'Storage is running low',
    DEPRECATED: 'This feature is deprecated',
    LIMIT_REACHED: 'Limit reached',
  },
  INFO: {
    LOADING: 'Loading data...',
    PROCESSING: 'Processing request...',
    MAINTENANCE: 'System maintenance scheduled',
    UPDATE_AVAILABLE: 'Update available',
    BACKUP_COMPLETE: 'Backup completed',
  },
} as const;

export const NOTIFICATION_DURATIONS = {
  SHORT: 3000,
  MEDIUM: 5000,
  LONG: 8000,
  PERSISTENT: 0,
} as const;

export const NOTIFICATION_ICONS = {
  success: 'check_circle',
  error: 'error',
  warning: 'warning',
  info: 'info',
} as const;
