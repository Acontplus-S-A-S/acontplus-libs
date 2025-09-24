export class PricingCalculationError extends Error {
  constructor(operation: string, originalError?: Error) {
    super(
      `Pricing calculation failed for operation: ${operation}. ${originalError?.message || ''}`,
    );
    this.name = 'PricingCalculationError';
  }
}
