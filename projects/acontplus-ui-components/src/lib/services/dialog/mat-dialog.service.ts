import { inject, Injectable } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatCustomDialogConfig, DialogSize } from './mat-custom-dialog.config';
import { Overlay } from '@angular/cdk/overlay';
import { map, Observable } from 'rxjs';
import { ComponentType } from '@angular/cdk/portal';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

@Injectable({
  providedIn: 'root',
})
export class MatDialogService {
  private readonly dialog = inject(MatDialog);
  private readonly overlay = inject(Overlay);
  private readonly breakpointObserver = inject(BreakpointObserver);

  // Check if device is mobile
  private readonly isMobile$ = this.breakpointObserver
    .observe([Breakpoints.Handset])
    .pipe(map((result) => result.matches));

  /**
   * Opens a dialog with the specified component and configuration
   */
  open<T, D = any, R = any>(
    component: ComponentType<T>,
    config: MatCustomDialogConfig<D> = {},
  ): MatDialogRef<T, R> {
    const dialogConfig = this.buildDialogConfig(config);
    return this.dialog.open(component, dialogConfig);
  }

  /**
   * Opens a dialog and returns only the result observable
   */
  openAndGetResult<T, D = any, R = any>(
    component: ComponentType<T>,
    config: MatCustomDialogConfig<D> = {},
  ): Observable<R | undefined> {
    return this.open(component, config).afterClosed();
  }

  /**
   * Opens a confirmation dialog (helper method)
   */
  openConfirmation<T>(
    component: ComponentType<T>,
    data?: any,
    config: Partial<MatCustomDialogConfig> = {},
  ): Observable<boolean> {
    const confirmConfig: MatCustomDialogConfig = {
      size: 'sm',
      backdropClickClosable: false,
      escapeKeyClosable: false,
      autoFocus: 'dialog',
      role: 'alertdialog',
      ...config,
      data,
    };

    return this.openAndGetResult(component, confirmConfig).pipe(
      map((result) => Boolean(result)),
    );
  }

  /**
   * Closes all open dialogs
   */
  closeAll(): void {
    this.dialog.closeAll();
  }

  /**
   * Gets all open dialogs
   */
  getOpenDialogs(): MatDialogRef<any>[] {
    return this.dialog.openDialogs;
  }

  private buildDialogConfig<D>(
    config: MatCustomDialogConfig<D>,
  ): MatDialogConfig<D> {
    const dialogConfig = new MatDialogConfig<D>();

    // Handle full screen mode
    if (config.size === 'full') {
      this.applyFullScreenConfig(dialogConfig);
    } else {
      this.applyStandardConfig(dialogConfig, config);
    }

    // Apply common configurations
    this.applyCommonConfig(dialogConfig, config);

    return dialogConfig;
  }

  private applyFullScreenConfig(dialogConfig: MatDialogConfig): void {
    dialogConfig.width = '100vw';
    dialogConfig.height = '100vh';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.maxHeight = '100vh';
    dialogConfig.panelClass = ['full-screen-dialog'];
    dialogConfig.position = {
      top: '0',
      left: '0',
    };
  }

  private applyStandardConfig<D>(
    dialogConfig: MatDialogConfig<D>,
    config: MatCustomDialogConfig<D>,
  ): void {
    // Set dimensions
    dialogConfig.width = config.width || this.getDialogWidth(config.size);
    dialogConfig.height = config.height || 'auto';
    dialogConfig.minWidth = config.minWidth;
    dialogConfig.minHeight = config.minHeight;
    dialogConfig.maxWidth = config.maxWidth || '95vw';
    dialogConfig.maxHeight = config.maxHeight || '90vh';

    // Handle mobile full screen option
    if (config.isMobileFullScreen) {
      this.isMobile$.subscribe((isMobile) => {
        if (isMobile) {
          this.applyFullScreenConfig(dialogConfig);
        }
      });
    }

    // Set position
    if (config.position) {
      dialogConfig.position = config.position;
    }
  }

  private applyCommonConfig<D>(
    dialogConfig: MatDialogConfig<D>,
    config: MatCustomDialogConfig<D>,
  ): void {
    // Data
    dialogConfig.data = config.data;

    // Backdrop
    dialogConfig.hasBackdrop = config.hasBackdrop ?? true;
    dialogConfig.backdropClass = config.backdropClass;

    // Panel styling
    const panelClasses = Array.isArray(config.panelClass)
      ? config.panelClass
      : config.panelClass
        ? [config.panelClass]
        : [];

    // Add responsive class based on size
    if (config.size) {
      panelClasses.push(`dialog-${config.size}`);
    }

    dialogConfig.panelClass = panelClasses;

    // Behavior
    dialogConfig.disableClose =
      !(config.backdropClickClosable ?? true) ||
      !(config.escapeKeyClosable ?? true);

    // Focus management
    dialogConfig.autoFocus = config.autoFocus ?? 'first-tabbable';
    dialogConfig.restoreFocus = config.restoreFocus ?? true;

    // Scroll strategy
    dialogConfig.scrollStrategy =
      config.scrollStrategy || this.overlay.scrollStrategies.block();

    // Animation
    dialogConfig.enterAnimationDuration =
      config.enterAnimationDuration ?? '300ms';
    dialogConfig.exitAnimationDuration =
      config.exitAnimationDuration ?? '200ms';

    // Accessibility
    if (config.ariaLabel) {
      dialogConfig.ariaLabel = config.ariaLabel;
    }
    if (config.ariaLabelledBy) {
      dialogConfig.ariaLabelledBy = config.ariaLabelledBy;
    }
    if (config.ariaDescribedBy) {
      dialogConfig.ariaDescribedBy = config.ariaDescribedBy;
    }
    if (config.role) {
      dialogConfig.role = config.role;
    }
  }

  private getDialogWidth(size: DialogSize = 'md'): string {
    const sizeMap: Record<DialogSize, string> = {
      xs: '280px',
      sm: '400px',
      md: '600px',
      lg: '800px',
      xl: '1200px',
      xxl: '1400px',
      full: '100vw',
    };

    return sizeMap[size];
  }
}
