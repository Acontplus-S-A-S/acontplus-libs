import { Component, input, output, ViewEncapsulation } from '@angular/core';
import { MatButton, MatFabButton, MatIconButton, MatMiniFabButton } from '@angular/material/button';
import { NgClass, NgTemplateOutlet } from '@angular/common';
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
  | 'text'
  | 'elevated'
  | 'outlined'
  | 'filled'
  | 'tonal'
  | 'icon'
  | 'fab'
  | 'mini-fab'
  | 'extended-fab';

@Component({
  selector: 'acp-button',
  imports: [
    MatButton,
    NgClass,
    MatIcon,
    MatMiniFabButton,
    MatIconButton,
    MatFabButton,
    NgTemplateOutlet,
  ],
  templateUrl: './button.component.html',
  styleUrl: './button.component.scss',
  encapsulation: ViewEncapsulation.None,
})
export class ButtonComponent {
  variant = input<ButtonVariant>('primary');
  text = input<string>('');
  icon = input<string>('');
  disabled = input<boolean>(false);
  type = input<ButtonType>('button');
  matStyle = input<MaterialButtonStyle>('elevated');
  customClass = input<string | undefined>();

  extended = input<boolean>(false); // For extended FAB
  title = input<string>('');
  ariaLabel = input<string>('');
  name = input<string>('');
  id = input<string>('');
  form = input<string>('');
  tabIndex = input<number>(0);
  testId = input<string>('');

  handleClick = output<unknown>();

  getButtonClasses(): Record<string, boolean> {
    const classes: Record<string, boolean> = {
      [`mat-btn-${this.variant()}`]: true,
    };
    const customClass = this.customClass();
    if (customClass) {
      classes[customClass] = true;
    }
    return classes;
  }

  getDisplayText(): string {
    const style = this.matStyle();
    if (style === 'icon' || style === 'fab' || style === 'mini-fab') {
      return '';
    }
    return this.text();
  }
}
