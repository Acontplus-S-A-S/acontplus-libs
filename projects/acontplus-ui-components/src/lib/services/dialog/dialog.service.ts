import { inject, Injectable } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { DialogConfig } from './dialog.config';
import { Overlay } from '@angular/cdk/overlay';

@Injectable({
  providedIn: 'root',
})
export class DialogService {
  private readonly _dialog = inject(MatDialog);
  private readonly _overlay = inject(Overlay);

  open(component: any, config: DialogConfig) {
    const dialogConfig = new MatDialogConfig();

    if (config.isFullScreen) {
      dialogConfig.width = '100%';
      dialogConfig.height = '100%';
      dialogConfig.maxWidth = '100vw';
      dialogConfig.maxHeight = '100vh';
      dialogConfig.panelClass = ['full-screen-dialog'];
      dialogConfig.position = {
        top: '0',
        left: '0',
      };
    } else {
      dialogConfig.width = this.getDialogWidth(config.size);
      dialogConfig.maxWidth = '90vw';
      dialogConfig.height = 'auto';
    }

    dialogConfig.data = config.data;
    dialogConfig.hasBackdrop = true;
    dialogConfig.autoFocus = false;
    dialogConfig.scrollStrategy = this._overlay.scrollStrategies.noop();
    dialogConfig.disableClose = config.disableClose ?? true;
    dialogConfig.enterAnimationDuration = config.enterAnimationDuration ?? 500;
    dialogConfig.exitAnimationDuration = config.exitAnimationDuration ?? 700;

    const dialogRef = this._dialog.open(component, dialogConfig);

    return dialogRef.afterClosed();
  }

  private getDialogWidth(
    size?: 'default' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl',
  ): string {
    switch (size) {
      case 'sm':
        return '300px';
      case 'md':
        return '600px';
      case 'lg':
        return '800px';
      case 'xl':
        return '1200px';

      case 'xxl':
        return '1400px';
      default:
        return '600px';
    }
  }
}
