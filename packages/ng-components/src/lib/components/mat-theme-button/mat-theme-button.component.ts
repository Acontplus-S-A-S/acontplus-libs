import { Component, input, output } from '@angular/core';
import { ThemePalette } from '@angular/material/core';
import { MatButton, MatFabButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { NgClass } from '@angular/common';
import { MatIcon } from '@angular/material/icon';

export type ButtonVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

export type ButtonType = 'button' | 'submit' | 'reset';

export type MaterialButtonStyle =
  | 'basic' // mat-button
  | 'raised' // mat-raised-button
  | 'flat' // mat-flat-button
  | 'stroked' // mat-stroked-button
  | 'icon' // mat-icon-button
  | 'fab' // mat-fab
  | 'mini-fab'; // mat-mini-fab

@Component({
  selector: 'acp-mat-theme-button',
  imports: [MatButton, NgClass, MatIcon, MatMiniFabButton, MatIconButton, MatFabButton],
  templateUrl: './mat-theme-button.component.html',
  styleUrl: './mat-theme-button.component.scss',
})
export class MatThemeButtonComponent {
  variant = input<ButtonVariant>('primary');
  text = input<string>('');
  icon = input<string>('');
  outlined = input<boolean>(false);
  disabled = input<boolean>(false);
  useThemeColor = input<boolean>(false); // Use theme color based on variant
  type = input<ButtonType>('button');
  matStyle = input<MaterialButtonStyle>('raised');

  // Additional common button properties
  title = input<string>(''); // Tooltip text shown on hover
  ariaLabel = input<string>(''); // Accessibility label
  name = input<string>(''); // Name attribute for form submission
  id = input<string>(''); // ID for element reference
  form = input<string>(''); // Associated form ID
  tabIndex = input<number>(0); // Tab order
  testId = input<string>(''); // For testing purposes

  handleClick = output<unknown>();

  getButtonClasses(): Record<string, boolean> {
    return {
      [`btn-${this.variant()}`]: true,
      'btn-outlined': this.outlined() && this.matStyle() !== 'stroked', // Stroked buttons are already outlined
    };
  }

  getThemeColor(): ThemePalette | null {
    if (!this.useThemeColor) return null;

    switch (this.variant()) {
      case 'primary':
        return 'primary';
      case 'secondary':
        return 'accent';
      case 'danger':
        return 'warn';
      default:
        return null;
    }
  }
}
