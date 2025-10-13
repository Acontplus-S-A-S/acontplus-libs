import { InjectionToken } from '@angular/core';
import { CoreConfig } from '@acontplus/core';
import { DEFAULT_CONFIG } from '../constants';

export const CORE_CONFIG = new InjectionToken<CoreConfig>('CORE_CONFIG', {
  factory: () => DEFAULT_CONFIG,
});
