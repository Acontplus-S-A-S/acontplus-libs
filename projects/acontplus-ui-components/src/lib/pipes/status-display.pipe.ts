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

type LanguageCode = 'en' | 'es';

interface StatusTranslations {
  active: string;
  inactive: string;
  'active.male': string;
  'active.female': string;
  'inactive.male': string;
  'inactive.female': string;
}

@Pipe({
  name: 'statusDisplay',
  standalone: true,
})
export class StatusDisplayPipe implements PipeTransform {
  private sanitizer = inject(DomSanitizer);
  private translate = inject(TranslateService);

  private readonly defaultTranslations: Record<
    LanguageCode,
    StatusTranslations
  > = {
    en: {
      active: 'Active',
      inactive: 'Inactive',
      'active.male': 'Active',
      'active.female': 'Active',
      'inactive.male': 'Inactive',
      'inactive.female': 'Inactive',
    },
    es: {
      active: 'Activo',
      inactive: 'Inactivo',
      'active.male': 'Activo',
      'active.female': 'Activa',
      'inactive.male': 'Inactivo',
      'inactive.female': 'Inactiva',
    },
  };

  transform(isActive: boolean, options: StatusOptions = {}): SafeHtml {
    const {
      gender = 'neutral',
      showIcon = true,
      customActiveText,
      customInactiveText,
      textClass = '',
    } = options;

    const [text] = this.getStatusText(
      isActive,
      gender,
      customActiveText,
      customInactiveText,
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
    customInactive?: string,
  ): [string, string] {
    // Return custom texts if provided
    if (customActive && isActive) return [customActive, 'custom'];
    if (customInactive && !isActive) return [customInactive, 'custom'];

    const key = isActive ? 'active' : 'inactive';
    const genderKey = gender !== 'neutral' ? `${key}.${gender}` : key;

    // First try app-specific translation
    const translation = this.translate.instant(`status.${genderKey}`);
    if (translation !== `status.${genderKey}`) {
      return [translation, genderKey];
    }

    // Fallback to library defaults
    return [this.getDefaultTranslation(isActive, gender), genderKey];
  }

  private getDefaultTranslation(
    isActive: boolean,
    gender: StatusGender,
  ): string {
    const lang = this.translate.currentLang || 'en';
    const baseLang = lang.split('-')[0] as LanguageCode;
    const translations =
      this.defaultTranslations[baseLang] || this.defaultTranslations.en;

    const key = (
      gender !== 'neutral'
        ? `${isActive ? 'active' : 'inactive'}.${gender}`
        : isActive
          ? 'active'
          : 'inactive'
    ) as keyof StatusTranslations;

    return translations[key] || (isActive ? 'Active' : 'Inactive');
  }
}
