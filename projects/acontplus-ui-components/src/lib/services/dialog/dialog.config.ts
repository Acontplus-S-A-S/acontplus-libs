export interface DialogConfig {
  width?: string;
  height?: string;
  maxWidth?: string;
  maxHeight?: string;
  panelClass?: string | string[];
  position?: { top?: string; left?: string; right?: string; bottom?: string };
  data?: any;
  hasBackdrop?: boolean;
  autoFocus?: boolean;
  scrollStrategy?: any; // Replace with actual type if available
  disableClose?: boolean;
  enterAnimationDuration?: number | string;
  exitAnimationDuration?: number | string;
  isFullScreen?: boolean;
  size?: 'default' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl';
}
