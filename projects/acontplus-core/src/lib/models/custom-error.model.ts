export class PricingCalculationError extends Error {
  constructor(operation: string, originalError?: Error) {
    super(
      `Pricing calculation failed for operation: ${operation}. ${originalError?.message || ''}`,
    );
    this.name = 'PricingCalculationError';
  }
}

export class InvalidParameterError extends Error {
  constructor(parameter: string, value: any) {
    super(`Invalid parameter '${parameter}' with value: ${value}`);
    this.name = 'InvalidParameterError';
  }
}
