// dialog-config.interface.ts
import { ScrollStrategy } from '@angular/cdk/overlay';

export type DialogSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | 'full';

export interface DialogPosition {
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
}

export interface DialogConfig<T = any> {
  // Size and dimensions
  size?: DialogSize;
  width?: string;
  height?: string;
  minWidth?: string;
  minHeight?: string;
  maxWidth?: string;
  maxHeight?: string;

  // Positioning
  position?: DialogPosition;

  // Styling
  panelClass?: string | string[];
  backdropClass?: string | string[];

  // Behavior
  hasBackdrop?: boolean;
  backdropClickClosable?: boolean;
  escapeKeyClosable?: boolean;
  autoFocus?: boolean | string;
  restoreFocus?: boolean;

  // Animation
  enterAnimationDuration?: number | string;
  exitAnimationDuration?: number | string;

  // Data and functionality
  data?: T;
  scrollStrategy?: ScrollStrategy;

  // Accessibility
  ariaLabel?: string;
  ariaLabelledBy?: string;
  ariaDescribedBy?: string;
  role?: 'dialog' | 'alertdialog';

  // Mobile optimization
  isMobileFullScreen?: boolean;
}
