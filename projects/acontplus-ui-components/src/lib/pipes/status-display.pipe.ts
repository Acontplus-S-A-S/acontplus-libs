import { inject, Pipe, PipeTransform } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

type StatusGender = 'male' | 'female' | 'neutral';

interface StatusOptions {
  /**
   * Gender of the record for proper wording in gendered languages
   * @default 'neutral'
   */
  gender?: StatusGender;

  /**
   * Whether to show the status icon
   * @default true
   */
  showIcon?: boolean;

  /**
   * Custom text for active state (overrides translations)
   */
  customActiveText?: string;

  /**
   * Custom text for inactive state (overrides translations)
   */
  customInactiveText?: string;

  /**
   * Additional CSS classes for the status text
   */
  textClass?: string;
}

@Pipe({
  name: 'statusDisplay',
})
export class StatusDisplayPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);
  private translate = inject(TranslateService);

  transform(
    isActive: boolean,
    options: StatusOptions = {},
  ): SafeHtml {
    const {
      gender = 'neutral',
      showIcon = true,
      customActiveText,
      customInactiveText,
      textClass = ''
    } = options;

    const [text, translationKey] = this.getStatusText(
      isActive,
      gender,
      customActiveText,
      customInactiveText
    );

    const icon = isActive ? 'check_circle' : 'cancel';
    const colorClass = isActive ? 'text-green-500' : 'text-red-500';
    const combinedTextClass = `align-middle ${textClass}`.trim();

    let html = '';

    if (showIcon) {
      html += `<mat-icon class="${colorClass} align-middle mr-1" fontIcon="${icon}"></mat-icon>`;
    }

    html += `<span class="${combinedTextClass}">${text}</span>`;

    return this.sanitizer.bypassSecurityTrustHtml(html);
  }

  private getStatusText(
    isActive: boolean,
    gender: StatusGender,
    customActive?: string,
    customInactive?: string
  ): [string, string] {
    // Return custom texts if provided
    if (customActive && isActive) return [customActive, 'custom'];
    if (customInactive && !isActive) return [customInactive, 'custom'];

    const lang = this.translate.currentLang || 'en';
    const isSpanish = lang.startsWith('es');

    if (!isSpanish) {
      return isActive ? ['Active', 'active'] : ['Inactive', 'inactive'];
    }

    // Spanish gendered variants
    if (isActive) {
      return gender === 'female'
        ? ['Activa', 'active.female']
        : ['Activo', 'active.male'];
    } else {
      return gender === 'female'
        ? ['Inactiva', 'inactive.female']
        : ['Inactivo', 'inactive.male'];
    }
  }
}