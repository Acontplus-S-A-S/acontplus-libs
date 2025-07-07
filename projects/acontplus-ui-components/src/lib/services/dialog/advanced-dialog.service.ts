import { inject, Injectable, Type } from '@angular/core';
import {
  MatDialog,
  MatDialogConfig,
  MatDialogRef,
} from '@angular/material/dialog';
import { Overlay } from '@angular/cdk/overlay';
import { firstValueFrom, map, Observable } from 'rxjs';
import { ComponentType } from '@angular/cdk/portal';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';

import {
  MatCustomDialogConfig,
  DialogSize,
  DialogWrapperConfig,
} from './dialog.interfaces';
import { DialogWrapperComponent } from '../../components';

@Injectable({
  providedIn: 'root',
})
export class AdvancedDialogService {
  private readonly dialog = inject(MatDialog);
  private readonly overlay = inject(Overlay);
  private readonly breakpointObserver = inject(BreakpointObserver);

  // An observable that emits true if the viewport matches mobile dimensions.
  private readonly isMobile$ = this.breakpointObserver
    .observe([Breakpoints.HandsetPortrait, Breakpoints.HandsetLandscape])
    .pipe(map((result) => result.matches));

  /**
   * Main method to open any component in a dialog.
   * This provides maximum flexibility.
   * @param component The component to render.
   * @param config The detailed configuration for the dialog.
   * @returns A MatDialogRef instance.
   */
  async open<T, D = any, R = any>(
    component: ComponentType<T>,
    config: MatCustomDialogConfig<D> = {},
  ): Promise<MatDialogRef<T, R>> {
    const dialogConfig = await this.buildDialogConfig(config);
    return this.dialog.open<T, D, R>(component, dialogConfig);
  }

  /**
   * A powerful helper to open a component inside our standard, branded "wrapper".
   * This provides maximum consistency.
   * @param wrapperConfig Configuration for the title, icon, and the content component.
   * @param matDialogConfig Standard MatDialog configuration (size, position, etc.).
   * @returns A MatDialogRef instance pointing to the wrapper.
   */
  async openInWrapper<T, R = any>(
    wrapperConfig: DialogWrapperConfig<T>,
    matDialogConfig: MatCustomDialogConfig<T> = {},
  ): Promise<MatDialogRef<DialogWrapperComponent, R>> {
    // Package the wrapper config into the `data` property for the DialogWrapperComponent to consume.
    const configWithWrapperData: MatCustomDialogConfig<DialogWrapperConfig<T>> =
      {
        ...matDialogConfig,
        data: wrapperConfig,
      };
    const dialogConfig = await this.buildDialogConfig(configWithWrapperData);
    return this.dialog.open<DialogWrapperComponent, DialogWrapperConfig<T>, R>(
      DialogWrapperComponent,
      dialogConfig,
    );
  }

  /**
   * Helper to open a dialog and only get an observable of the result.
   */
  async openAndGetResult<T, D = any, R = any>(
    component: ComponentType<T>,
    config: MatCustomDialogConfig<D> = {},
  ): Promise<R | undefined> {
    const dialogRef = await this.open(component, config);
    return firstValueFrom(dialogRef.afterClosed());
  }

  /**
   * Closes all currently open dialogs.
   */
  closeAll(): void {
    this.dialog.closeAll();
  }

  // --- Private Configuration Builder ---

  private async buildDialogConfig<D>(
    config: MatCustomDialogConfig<D>,
  ): Promise<MatDialogConfig<D>> {
    const dialogConfig = new MatDialogConfig<D>();

    // Asynchronously check for mobile state to prevent memory leaks from dangling subscriptions.
    const isMobile = await firstValueFrom(this.isMobile$);

    // Apply fullscreen if 'full' size is set OR if mobile fullscreen is enabled on a mobile device.
    if (config.size === 'full' || (config.isMobileFullScreen && isMobile)) {
      this.applyFullScreenConfig(dialogConfig);
    } else {
      this.applyStandardConfig(dialogConfig, config);
    }

    // Apply all other common configurations.
    this.applyCommonConfig(dialogConfig, config);

    return dialogConfig;
  }

  private applyFullScreenConfig(dialogConfig: MatDialogConfig): void {
    dialogConfig.width = '100vw';
    dialogConfig.height = '100vh';
    dialogConfig.maxWidth = '100vw';
    dialogConfig.panelClass = ['full-screen-dialog'];
  }

  private applyStandardConfig<D>(
    dialogConfig: MatDialogConfig<D>,
    config: MatCustomDialogConfig<D>,
  ): void {
    dialogConfig.width = config.width ?? this.getDialogWidth(config.size);
    dialogConfig.height = config.height;
    dialogConfig.minWidth = config.minWidth;
    dialogConfig.maxWidth = config.maxWidth ?? '95vw';
    dialogConfig.maxHeight = config.maxHeight ?? 'auto';
    dialogConfig.position = config.position;
  }

  private applyCommonConfig<D>(
    dialogConfig: MatDialogConfig<D>,
    config: MatCustomDialogConfig<D>,
  ): void {
    dialogConfig.data = config.data;
    dialogConfig.hasBackdrop = config.hasBackdrop ?? true;
    dialogConfig.backdropClass = config.backdropClass;

    const panelClasses = Array.isArray(config.panelClass)
      ? [...config.panelClass]
      : config.panelClass
        ? [config.panelClass]
        : [];
    if (config.size) {
      panelClasses.push(`dialog-${config.size}`);
    }
    dialogConfig.panelClass = panelClasses;

    dialogConfig.disableClose = !(config.backdropClickClosable ?? true);
    // Note: escapeKeyClosable is handled by MatDialog separately and doesn't affect disableClose directly.
    dialogConfig.autoFocus = config.autoFocus ?? 'first-tabbable';
    dialogConfig.scrollStrategy =
      config.scrollStrategy ?? this.overlay.scrollStrategies.block();
    dialogConfig.enterAnimationDuration =
      config.enterAnimationDuration ?? '300ms';
    dialogConfig.exitAnimationDuration =
      config.exitAnimationDuration ?? '200ms';
    dialogConfig.ariaLabel = config.ariaLabel;
    dialogConfig.ariaLabelledBy = config.ariaLabelledBy;
    dialogConfig.ariaDescribedBy = config.ariaDescribedBy;
    dialogConfig.role = config.role;
  }

  private getDialogWidth(size: DialogSize = 'md'): string {
    const sizeMap: Record<DialogSize, string> = {
      xs: '320px',
      sm: '450px',
      md: '600px',
      lg: '800px',
      xl: '1000px',
      xxl: '1280px',
      full: '100vw',
    };
    return sizeMap[size];
  }
}
