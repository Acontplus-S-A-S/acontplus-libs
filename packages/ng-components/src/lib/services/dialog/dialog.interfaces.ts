import { Type } from '@angular/core';
import { ScrollStrategy } from '@angular/cdk/overlay';

export type DialogSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full';

/**
 * @interface MatCustomDialogConfig
 * This is the main configuration object for any dialog opened through the service.
 * It extends the standard MatDialogConfig with custom properties for convenience.
 */
export interface MatCustomDialogConfig<T = unknown> {
  // --- Data ---
  data?: T;

  // --- Sizing & Dimensions ---
  size?: DialogSize;
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;
  position?: { top?: string; bottom?: string; left?: string; right?: string };

  // --- Styling & Classes ---
  panelClass?: string | string[];
  backdropClass?: string | string[];

  // --- Behavior ---
  hasBackdrop?: boolean;
  backdropClickClosable?: boolean;
  escapeKeyClosable?: boolean;
  isMobileFullScreen?: boolean;

  // --- Focus Management ---
  autoFocus?: boolean | 'first-tabbable' | 'dialog' | 'first-heading';
  restoreFocus?: boolean;

  // --- Accessibility ---
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  role?: 'dialog' | 'alertdialog';

  // --- Advanced ---
  scrollStrategy?: ScrollStrategy;
  enterAnimationDuration?: number | string;
  exitAnimationDuration?: number | string;
}

/**
 * Configuration interface for opening a dialog inside the custom `DialogWrapperComponent`.
 * This interface defines the properties needed to configure the dialog wrapper.
 *
 * @interface DialogWrapperConfig
 * @template T The type of data to pass to the content component
 *
 * @example
 * const config: DialogWrapperConfig = {
 *   component: YourDialogContentComponent,
 *   title: 'Dialog Title',
 *   icon: 'info',
 *   data: { message: 'This is some data passed to the dialog content component' },
 *   hideHeader: false
 * };
 */
export interface DialogWrapperConfig<T = unknown> {
  /**
   * The component type to render inside the dialog wrapper.
   * This component will be dynamically created and inserted into the dialog.
   */
  component: Type<unknown>;

  /**
   * The title text to display in the dialog header.
   */
  title: string;

  /**
   * Optional Material icon name to display in the dialog header.
   */
  icon?: string;

  /**
   * Optional data to pass to the content component's instance.
   * This will be accessible via the `data` property on the component instance.
   */
  data?: T;

  /**
   * Whether to hide the dialog header section.
   * If true, the title, icon, and close button will not be displayed.
   * @default false
   */
  hideHeader?: boolean;
}
