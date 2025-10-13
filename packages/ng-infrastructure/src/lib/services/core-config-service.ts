import { Injectable, inject } from '@angular/core';
import { CORE_CONFIG, DEFAULT_CONFIG, ENVIRONMENT } from '@acontplus/ng-config';
import { CoreConfig } from '@acontplus/core';

@Injectable({
  providedIn: 'root',
})
export class CoreConfigService {
  private config: Required<CoreConfig>;
  private environment = inject(ENVIRONMENT);

  constructor() {
    this.config = this.initializeConfig();
  }

  /**
   * Initialize configuration with defaults and environment overrides
   */
  private initializeConfig(): Required<CoreConfig> {
    const injectedConfig = inject(CORE_CONFIG, { optional: true });

    return {
      ...DEFAULT_CONFIG,
      // Environment overrides
      apiBaseUrl: this.environment.apiBaseUrl || DEFAULT_CONFIG.apiBaseUrl,
      enableRequestLogging: !this.environment.isProduction,
      // Injected config overrides
      ...injectedConfig,
    };
  }

  /**
   * Get the current configuration
   */
  getConfig(): Required<CoreConfig> {
    return { ...this.config };
  }

  /**
   * Update configuration at runtime
   */
  updateConfig(updates: Partial<CoreConfig>): void {
    this.config = { ...this.config, ...updates };
  }

  /**
   * Get a specific configuration value
   */
  get<K extends keyof CoreConfig>(key: K): CoreConfig[K] {
    return this.config[key];
  }

  /**
   * Check if a feature is enabled
   */
  isFeatureEnabled(feature: keyof CoreConfig): boolean {
    const value = this.config[feature];
    return typeof value === 'boolean' ? value : false;
  }

  /**
   * Get API URL for a specific entity
   */
  getApiUrl(entityName?: string): string {
    const baseUrl = this.config.apiBaseUrl;
    if (!entityName) return baseUrl;
    return `${baseUrl}/${entityName}`.replace(/\/+/g, '/');
  }

  /**
   * Check if a URL should be excluded from processing
   */
  shouldExcludeUrl(url: string): boolean {
    return this.config.excludeUrls.some(
      excludePattern => url.includes(excludePattern) || new RegExp(excludePattern).test(url),
    );
  }

  /**
   * Check if a method should be excluded from processing
   */
  shouldExcludeMethod(method: string): boolean {
    return this.config.excludeMethods.some(
      excludeMethod => excludeMethod.toLowerCase() === method.toLowerCase(),
    );
  }

  /**
   * Get custom headers with dynamic values resolved
   */
  getCustomHeaders(): Record<string, string> {
    const headers: Record<string, string> = {};

    Object.entries(this.config.customHeaders).forEach(([key, value]) => {
      headers[key] = typeof value === 'function' ? value() : value;
    });

    return headers;
  }

  /**
   * Reset configuration to defaults
   */
  resetConfig(): void {
    this.config = this.initializeConfig();
  }
}

// Provider function for easy setup
export function provideCoreConfig(config: Partial<CoreConfig> = {}) {
  return [
    {
      provide: CORE_CONFIG,
      useValue: config,
    },
  ];
}

// Helper function to create configuration
export function createCoreConfig(overrides: Partial<CoreConfig> = {}): CoreConfig {
  return {
    ...DEFAULT_CONFIG,
    ...overrides,
  };
}
