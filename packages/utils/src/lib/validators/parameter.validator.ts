import { InvalidParameterError } from '../errors';
import { NumberFormatter } from '../formatters';

export class ParameterValidator {
  static validateNumber(value: any, paramName: string): number {
    if (!NumberFormatter.isNumber(value)) {
      throw new InvalidParameterError(paramName, value);
    }
    return value;
  }

  static validatePositiveNumber(value: any, paramName: string): number {
    const num = this.validateNumber(value, paramName);
    if (!NumberFormatter.isPositive(num)) {
      throw new InvalidParameterError(paramName, `${value} (must be positive)`);
    }
    return num;
  }

  static validatePercentage(value: any, paramName: string): number {
    const num = this.validateNumber(value, paramName);
    if (!NumberFormatter.isPercentage(num)) {
      throw new InvalidParameterError(paramName, `${value} (must be between 0 and 100)`);
    }
    return num;
  }
}
