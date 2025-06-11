import { Component, inject, signal } from '@angular/core';
import { SNACKBAR_MESSAGES } from '../../../utils';
import { SnackbarService } from '../../../services';
import { NotificationDemo, SnackbarType } from '../../../models';
import { MatCardModule } from '@angular/material/card';
import { MatIcon } from '@angular/material/icon';
import { MatButton } from '@angular/material/button';
import { MatFormField, MatInput, MatLabel } from '@angular/material/input';
import { FormsModule } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatSelect } from '@angular/material/select';

@Component({
  selector: 'apm-snackbar-notification',
  imports: [
    MatCardModule,
    MatButton,
    MatFormField,
    MatInput,
    MatLabel,
    FormsModule,
    MatOption,
    MatSelect,
    MatIcon,
  ],
  templateUrl: './snackbar-notification.component.html',
  styleUrl: './snackbar-notification.component.css',
})
export class SnackbarNotificationComponent {
  private readonly snackbarService = inject(SnackbarService);

  protected readonly customNotification = signal<NotificationDemo>({
    type: 'info',
    message: '',
    title: '',
    duration: 5000,
  });

  protected readonly quickMessages = {
    success: SNACKBAR_MESSAGES.SUCCESS.SAVE,
    info: SNACKBAR_MESSAGES.INFO.LOADING,
    warning: SNACKBAR_MESSAGES.WARNING.UNSAVED_CHANGES,
    error: SNACKBAR_MESSAGES.ERROR.NETWORK,
  } as const;

  protected showQuickNotification(type: SnackbarType): void {
    this.snackbarService[type]({
      message: this.quickMessages[type],
      title: type.charAt(0).toUpperCase() + type.slice(1),
    });
  }

  protected showCustomNotification(): void {
    if (!this.isFormValid()) return;

    const notification = this.customNotification();
    this.snackbarService.show({
      type: notification.type,
      message: notification.message,
      title: notification.title || undefined,
      config: { duration: notification.duration || 5000 },
    });
  }

  protected isFormValid(): boolean {
    return !!this.customNotification().message.trim();
  }

  protected resetForm(): void {
    this.customNotification.set({
      type: 'info',
      message: '',
      title: '',
      duration: 5000,
    });
  }
}
