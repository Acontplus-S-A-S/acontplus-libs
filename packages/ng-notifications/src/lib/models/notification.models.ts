import { SnackbarConfig } from '../config/snackbar.config';
import { IndividualConfig } from 'ngx-toastr';
import { NotificationType } from '../types/notification.types';

export interface ToastrCallProps {
  readonly message: string;
  readonly title?: string;
  readonly options?: Partial<IndividualConfig>;
}

export interface SnackbarProps {
  readonly type: NotificationType;
  readonly message: string;
  readonly title?: string;
  readonly action?: string;
  readonly config?: Partial<SnackbarConfig>;
}

export interface SnackbarCallProps {
  readonly message: string;
  readonly title?: string;
  readonly action?: string;
  readonly config?: Partial<SnackbarConfig>;
}
