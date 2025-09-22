import { InvalidParameterError } from '../models';
import { NumberUtils } from '../utils';

export class ParameterValidator {
  static validateNumber(value: any, paramName: string): number {
    if (!NumberUtils.isNumber(value)) {
      throw new InvalidParameterError(paramName, value);
    }
    return value;
  }

  static validatePositiveNumber(value: any, paramName: string): number {
    const num = this.validateNumber(value, paramName);
    if (!NumberUtils.isPositive(num)) {
      throw new InvalidParameterError(paramName, `${value} (must be positive)`);
    }
    return num;
  }

  static validatePercentage(value: any, paramName: string): number {
    const num = this.validateNumber(value, paramName);
    if (!NumberUtils.isPercentage(num)) {
      throw new InvalidParameterError(paramName, `${value} (must be between 0 and 100)`);
    }
    return num;
  }
}
