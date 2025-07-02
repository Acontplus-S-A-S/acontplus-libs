import { inject, Injectable, InjectionToken } from '@angular/core';
import { IndividualConfig, ToastrService } from 'ngx-toastr';

export type ToastrType = 'success' | 'error' | 'warning' | 'info';

export type ToastrNotificationConfig = Partial<IndividualConfig>;

export const TOASTR_NOTIFICATION_CONFIG =
  new InjectionToken<ToastrNotificationConfig>('toastr-notification-config', {
    providedIn: 'root',
    factory: () => ({
      positionClass: 'toast-bottom-center',
      timeOut: 5000,
      extendedTimeOut: 1500,
      closeButton: true,
      newestOnTop: true,
    }),
  });

export interface ToastrCallProps {
  readonly message: string;
  readonly title?: string;
  readonly options?: Partial<IndividualConfig>;
}

export interface ToastrShowProps extends ToastrCallProps {
  readonly type: ToastrType;
}

@Injectable({
  providedIn: 'root',
})
export class ToastrNotificationService {
  private readonly toastrService = inject(ToastrService);
  private readonly config = inject(TOASTR_NOTIFICATION_CONFIG);

  /**
   * Generic show method for dynamic toast types
   */
  show(props: ToastrShowProps): void {
    const { type, message, title, options: overrideOptions } = props;
    const finalOptions = { ...this.config, ...overrideOptions };

    this.toastrService[type](message, title, finalOptions);
  }

  /**
   * Ergonomic helper methods for specific types
   */
  success(props: ToastrCallProps): void {
    this.show({ type: 'success', ...props });
  }

  error(props: ToastrCallProps): void {
    this.show({ type: 'error', ...props });
  }

  warning(props: ToastrCallProps): void {
    this.show({ type: 'warning', ...props });
  }

  info(props: ToastrCallProps): void {
    this.show({ type: 'info', ...props });
  }
}
