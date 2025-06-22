import { Type } from '@angular/core';
import { ScrollStrategy } from '@angular/cdk/overlay';

export type DialogSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full';

/**
 * @interface MatCustomDialogConfig
 * This is the main configuration object for any dialog opened through the service.
 * It extends the standard MatDialogConfig with custom properties for convenience.
 */
export interface MatCustomDialogConfig<T = any> {
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
 * @interface DialogWrapperConfig
 * Configuration specific to opening a dialog inside our custom `DialogWrapperComponent`.
 */
export interface DialogWrapperConfig<T = any> {
  component: Type<any>; // The actual content component to render inside the wrapper.
  title: string; // The title to display in the wrapper's header.
  icon?: string; // An optional icon for the header.
  data?: T; // Data to be passed to the content component's instance.
  hideHeader?: boolean; // Whether to show the header section.
}
