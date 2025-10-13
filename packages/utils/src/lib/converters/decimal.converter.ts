import { Decimal } from 'decimal.js';
import { DecimalOptions } from '../models';
import { DecimalError } from '../errors';

type DecimalInput = string | number | Decimal;
type DecimalOutput = number | Decimal;
type ComparisonResult = -1 | 0 | 1;

const DEFAULT_CONFIG: Required<DecimalOptions> = {
  precision: 6,
  rounding: Decimal.ROUND_HALF_UP,
  returnAsNumber: true,
  throwOnInfinity: true,
  throwOnNaN: true,
};

export class DecimalConverter {
  private static defaultConfig = DEFAULT_CONFIG;

  static configure(config: Partial<typeof DEFAULT_CONFIG>): void {
    if (config.precision !== undefined && (config.precision < 0 || config.precision > 100)) {
      throw new DecimalError('Precision must be between 0 and 100');
    }
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  static getConfig(): typeof DEFAULT_CONFIG {
    return { ...this.defaultConfig };
  }

  private static createDecimal(value: DecimalInput, operation = 'unknown'): Decimal {
    if (value instanceof Decimal) return value;

    try {
      const decimal = new Decimal(value);

      if (this.defaultConfig.throwOnNaN && decimal.isNaN()) {
        throw new DecimalError(`Invalid number: NaN detected in ${operation}`, operation);
      }

      if (this.defaultConfig.throwOnInfinity && !decimal.isFinite()) {
        throw new DecimalError(`Invalid number: Infinity detected in ${operation}`, operation);
      }

      return decimal;
    } catch (error) {
      throw new DecimalError(
        `Failed to create decimal from value: ${value} in ${operation}`,
        operation,
      );
    }
  }

  private static processResult(
    decimal: Decimal,
    options: DecimalOptions = {},
    operation = 'unknown',
  ): DecimalOutput {
    const config = { ...this.defaultConfig, ...options };

    if (config.throwOnNaN && decimal.isNaN()) {
      throw new DecimalError(`Operation ${operation} resulted in NaN`, operation);
    }

    if (config.throwOnInfinity && !decimal.isFinite()) {
      throw new DecimalError(`Operation ${operation} resulted in Infinity`, operation);
    }

    let result = decimal;

    if (config.precision >= 0) {
      result =
        config.rounding !== undefined
          ? result.toDecimalPlaces(config.precision, config.rounding)
          : result.toDecimalPlaces(config.precision);
    }

    return config.returnAsNumber ? result.toNumber() : result;
  }

  static add(num1: DecimalInput, num2: DecimalInput, options?: DecimalOptions): DecimalOutput {
    const decimal1 = this.createDecimal(num1, 'addition');
    const decimal2 = this.createDecimal(num2, 'addition');
    const result = decimal1.plus(decimal2);
    return this.processResult(result, options, 'addition');
  }

  static subtract(num1: DecimalInput, num2: DecimalInput, options?: DecimalOptions): DecimalOutput {
    const decimal1 = this.createDecimal(num1, 'subtraction');
    const decimal2 = this.createDecimal(num2, 'subtraction');
    const result = decimal1.minus(decimal2);
    return this.processResult(result, options, 'subtraction');
  }

  static multiply(num1: DecimalInput, num2: DecimalInput, options?: DecimalOptions): DecimalOutput {
    const decimal1 = this.createDecimal(num1, 'multiplication');
    const decimal2 = this.createDecimal(num2, 'multiplication');
    const result = decimal1.mul(decimal2);
    return this.processResult(result, options, 'multiplication');
  }

  static divide(num1: DecimalInput, num2: DecimalInput, options?: DecimalOptions): DecimalOutput {
    const decimal1 = this.createDecimal(num1, 'division');
    const decimal2 = this.createDecimal(num2, 'division');

    if (decimal2.isZero()) {
      throw new DecimalError('Division by zero is not allowed', 'division');
    }

    const result = decimal1.div(decimal2);
    return this.processResult(result, options, 'division');
  }

  static power(
    base: DecimalInput,
    exponent: DecimalInput,
    options?: DecimalOptions,
  ): DecimalOutput {
    const decimal1 = this.createDecimal(base, 'power');
    const decimal2 = this.createDecimal(exponent, 'power');
    const result = decimal1.pow(decimal2);
    return this.processResult(result, options, 'power');
  }

  static sqrt(value: DecimalInput, options?: DecimalOptions): DecimalOutput {
    const decimal = this.createDecimal(value, 'sqrt');

    if (decimal.isNegative()) {
      throw new DecimalError('Square root of negative number is not supported', 'sqrt');
    }

    const result = decimal.sqrt();
    return this.processResult(result, options, 'sqrt');
  }

  static mod(num1: DecimalInput, num2: DecimalInput, options?: DecimalOptions): DecimalOutput {
    const decimal1 = this.createDecimal(num1, 'modulo');
    const decimal2 = this.createDecimal(num2, 'modulo');

    if (decimal2.isZero()) {
      throw new DecimalError('Modulo by zero is not allowed', 'modulo');
    }

    const result = decimal1.mod(decimal2);
    return this.processResult(result, options, 'modulo');
  }

  static percentage(
    value: DecimalInput,
    percent: DecimalInput,
    options?: DecimalOptions,
  ): DecimalOutput {
    const decimal1 = this.createDecimal(value, 'percentage');
    const decimal2 = this.createDecimal(percent, 'percentage');
    const result = decimal1.mul(decimal2).div(100);
    return this.processResult(result, options, 'percentage');
  }

  static applyDiscount(
    value: DecimalInput,
    discountPercent: DecimalInput,
    options?: DecimalOptions,
  ): DecimalOutput {
    const originalValue = this.createDecimal(value, 'discount');
    const discount = this.percentage(value, discountPercent, { returnAsNumber: false }) as Decimal;
    const result = originalValue.minus(discount);
    return this.processResult(result, options, 'discount');
  }

  static addTax(
    value: DecimalInput,
    taxPercent: DecimalInput,
    options?: DecimalOptions,
  ): DecimalOutput {
    const originalValue = this.createDecimal(value, 'tax');
    const tax = this.percentage(value, taxPercent, { returnAsNumber: false }) as Decimal;
    const result = originalValue.plus(tax);
    return this.processResult(result, options, 'tax');
  }

  static simpleInterest(
    principal: DecimalInput,
    rate: DecimalInput,
    time: DecimalInput,
    options?: DecimalOptions,
  ): DecimalOutput {
    const p = this.createDecimal(principal, 'simple_interest');
    const r = this.createDecimal(rate, 'simple_interest');
    const t = this.createDecimal(time, 'simple_interest');
    const result = p.mul(r).mul(t).div(100);
    return this.processResult(result, options, 'simple_interest');
  }

  static compoundInterest(
    principal: DecimalInput,
    rate: DecimalInput,
    time: DecimalInput,
    frequency: DecimalInput = 1,
    options?: DecimalOptions,
  ): DecimalOutput {
    const p = this.createDecimal(principal, 'compound_interest');
    const r = this.createDecimal(rate, 'compound_interest').div(100);
    const t = this.createDecimal(time, 'compound_interest');
    const n = this.createDecimal(frequency, 'compound_interest');

    const base = r.div(n).plus(1);
    const exponent = n.mul(t);
    const amount = p.mul(base.pow(exponent));
    const result = amount.minus(p);
    return this.processResult(result, options, 'compound_interest');
  }

  static compare(num1: DecimalInput, num2: DecimalInput): ComparisonResult {
    const decimal1 = this.createDecimal(num1, 'comparison');
    const decimal2 = this.createDecimal(num2, 'comparison');
    return decimal1.comparedTo(decimal2) as ComparisonResult;
  }

  static equals(num1: DecimalInput, num2: DecimalInput): boolean {
    return this.compare(num1, num2) === 0;
  }

  static greaterThan(num1: DecimalInput, num2: DecimalInput): boolean {
    return this.compare(num1, num2) === 1;
  }

  static lessThan(num1: DecimalInput, num2: DecimalInput): boolean {
    return this.compare(num1, num2) === -1;
  }

  static greaterThanOrEqual(num1: DecimalInput, num2: DecimalInput): boolean {
    const comparison = this.compare(num1, num2);
    return comparison === 1 || comparison === 0;
  }

  static lessThanOrEqual(num1: DecimalInput, num2: DecimalInput): boolean {
    const comparison = this.compare(num1, num2);
    return comparison === -1 || comparison === 0;
  }

  static abs(value: DecimalInput, options?: DecimalOptions): DecimalOutput {
    const decimal = this.createDecimal(value, 'absolute');
    const result = decimal.abs();
    return this.processResult(result, options, 'absolute');
  }

  static min(values: DecimalInput[], options?: DecimalOptions): DecimalOutput {
    if (values.length === 0) {
      throw new DecimalError('Cannot find minimum of empty array', 'minimum');
    }

    let min = this.createDecimal(values[0], 'minimum');
    for (let i = 1; i < values.length; i++) {
      const current = this.createDecimal(values[i], 'minimum');
      if (current.lessThan(min)) {
        min = current;
      }
    }
    return this.processResult(min, options, 'minimum');
  }

  static max(values: DecimalInput[], options?: DecimalOptions): DecimalOutput {
    if (values.length === 0) {
      throw new DecimalError('Cannot find maximum of empty array', 'maximum');
    }

    let max = this.createDecimal(values[0], 'maximum');
    for (let i = 1; i < values.length; i++) {
      const current = this.createDecimal(values[i], 'maximum');
      if (current.greaterThan(max)) {
        max = current;
      }
    }
    return this.processResult(max, options, 'maximum');
  }

  static round(
    value: DecimalInput,
    precision = 0,
    rounding?: Decimal.Rounding,
    options?: DecimalOptions,
  ): DecimalOutput {
    const decimal = this.createDecimal(value, 'rounding');
    const result =
      rounding !== undefined
        ? decimal.toDecimalPlaces(precision, rounding)
        : decimal.toDecimalPlaces(precision);
    return this.processResult(result, { ...options, precision, rounding }, 'rounding');
  }

  static ceil(value: DecimalInput, precision = 0, options?: DecimalOptions): DecimalOutput {
    return this.round(value, precision, Decimal.ROUND_UP, options);
  }

  static floor(value: DecimalInput, precision = 0, options?: DecimalOptions): DecimalOutput {
    return this.round(value, precision, Decimal.ROUND_DOWN, options);
  }

  static sum(values: DecimalInput[], options?: DecimalOptions): DecimalOutput {
    if (values.length === 0) {
      return this.processResult(new Decimal(0), options, 'sum');
    }

    const result = values.reduce<Decimal>((acc, val) => {
      const decimal = this.createDecimal(val, 'sum');
      return acc.plus(decimal);
    }, new Decimal(0));

    return this.processResult(result, options, 'sum');
  }

  static average(values: DecimalInput[], options?: DecimalOptions): DecimalOutput {
    if (values.length === 0) {
      throw new DecimalError('Cannot calculate average of empty array', 'average');
    }

    const sum = this.sum(values, { returnAsNumber: false }) as Decimal;
    const result = sum.div(values.length);
    return this.processResult(result, options, 'average');
  }

  static median(values: DecimalInput[], options?: DecimalOptions): DecimalOutput {
    if (values.length === 0) {
      throw new DecimalError('Cannot calculate median of empty array', 'median');
    }

    const decimals = values
      .map(v => this.createDecimal(v, 'median'))
      .sort((a, b) => a.comparedTo(b));
    const middle = Math.floor(decimals.length / 2);

    let result: Decimal;
    if (decimals.length % 2 === 0) {
      result = decimals[middle - 1].plus(decimals[middle]).div(2);
    } else {
      result = decimals[middle];
    }

    return this.processResult(result, options, 'median');
  }

  static chain(initialValue: DecimalInput): DecimalChain {
    return new DecimalChain(initialValue);
  }

  static addAsNumber(num1: DecimalInput, num2: DecimalInput, precision?: number): number {
    return this.add(num1, num2, { precision, returnAsNumber: true }) as number;
  }

  static subtractAsNumber(num1: DecimalInput, num2: DecimalInput, precision?: number): number {
    return this.subtract(num1, num2, { precision, returnAsNumber: true }) as number;
  }

  static multiplyAsNumber(num1: DecimalInput, num2: DecimalInput, precision?: number): number {
    return this.multiply(num1, num2, { precision, returnAsNumber: true }) as number;
  }

  static divideAsNumber(num1: DecimalInput, num2: DecimalInput, precision?: number): number {
    return this.divide(num1, num2, { precision, returnAsNumber: true }) as number;
  }

  static addAsDecimal(num1: DecimalInput, num2: DecimalInput, precision?: number): Decimal {
    return this.add(num1, num2, { precision, returnAsNumber: false }) as Decimal;
  }

  static subtractAsDecimal(num1: DecimalInput, num2: DecimalInput, precision?: number): Decimal {
    return this.subtract(num1, num2, { precision, returnAsNumber: false }) as Decimal;
  }

  static multiplyAsDecimal(num1: DecimalInput, num2: DecimalInput, precision?: number): Decimal {
    return this.multiply(num1, num2, { precision, returnAsNumber: false }) as Decimal;
  }

  static divideAsDecimal(num1: DecimalInput, num2: DecimalInput, precision?: number): Decimal {
    return this.divide(num1, num2, { precision, returnAsNumber: false }) as Decimal;
  }

  static isValid(value: any): boolean {
    try {
      const decimal = new Decimal(value);
      return decimal.isFinite() && !decimal.isNaN();
    } catch {
      return false;
    }
  }

  static format(
    value: DecimalInput,
    options: {
      precision?: number;
      thousandsSeparator?: string;
      decimalSeparator?: string;
      prefix?: string;
      suffix?: string;
    } = {},
  ): string {
    const {
      precision = 2,
      thousandsSeparator = ',',
      decimalSeparator = '.',
      prefix = '',
      suffix = '',
    } = options;

    const decimal = this.createDecimal(value, 'format');
    let formatted = decimal.toFixed(precision);

    if (decimalSeparator !== '.') {
      formatted = formatted.replace('.', decimalSeparator);
    }

    if (thousandsSeparator) {
      const parts = formatted.split(decimalSeparator);
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
      formatted = parts.join(decimalSeparator);
    }

    return `${prefix}${formatted}${suffix}`;
  }
}

class DecimalChain {
  private value: Decimal;
  private operations: string[] = [];

  constructor(initialValue: DecimalInput) {
    this.value = new Decimal(initialValue);
    this.operations.push(`Started with: ${initialValue}`);
  }

  add(num: DecimalInput): DecimalChain {
    this.value = this.value.plus(num);
    this.operations.push(`Added: ${num}`);
    return this;
  }

  subtract(num: DecimalInput): DecimalChain {
    this.value = this.value.minus(num);
    this.operations.push(`Subtracted: ${num}`);
    return this;
  }

  multiply(num: DecimalInput): DecimalChain {
    this.value = this.value.mul(num);
    this.operations.push(`Multiplied by: ${num}`);
    return this;
  }

  divide(num: DecimalInput): DecimalChain {
    if (new Decimal(num).isZero()) {
      throw new DecimalError('Division by zero is not allowed', 'chain_division');
    }
    this.value = this.value.div(num);
    this.operations.push(`Divided by: ${num}`);
    return this;
  }

  power(exponent: DecimalInput): DecimalChain {
    this.value = this.value.pow(exponent);
    this.operations.push(`Raised to power: ${exponent}`);
    return this;
  }

  sqrt(): DecimalChain {
    if (this.value.isNegative()) {
      throw new DecimalError('Square root of negative number is not supported', 'chain_sqrt');
    }
    this.value = this.value.sqrt();
    this.operations.push('Square root applied');
    return this;
  }

  percentage(percent: DecimalInput): DecimalChain {
    this.value = this.value.mul(percent).div(100);
    this.operations.push(`Applied percentage: ${percent}%`);
    return this;
  }

  applyDiscount(discountPercent: DecimalInput): DecimalChain {
    const discount = this.value.mul(discountPercent).div(100);
    this.value = this.value.minus(discount);
    this.operations.push(`Applied discount: ${discountPercent}%`);
    return this;
  }

  addTax(taxPercent: DecimalInput): DecimalChain {
    const tax = this.value.mul(taxPercent).div(100);
    this.value = this.value.plus(tax);
    this.operations.push(`Added tax: ${taxPercent}%`);
    return this;
  }

  abs(): DecimalChain {
    this.value = this.value.abs();
    this.operations.push('Absolute value applied');
    return this;
  }

  round(precision = 0, rounding?: Decimal.Rounding): DecimalChain {
    this.value =
      rounding !== undefined
        ? this.value.toDecimalPlaces(precision, rounding)
        : this.value.toDecimalPlaces(precision);
    this.operations.push(`Rounded to ${precision} decimal places`);
    return this;
  }

  ceil(precision = 0): DecimalChain {
    this.value = this.value.toDecimalPlaces(precision, Decimal.ROUND_UP);
    this.operations.push(`Ceiling applied with ${precision} decimal places`);
    return this;
  }

  floor(precision = 0): DecimalChain {
    this.value = this.value.toDecimalPlaces(precision, Decimal.ROUND_DOWN);
    this.operations.push(`Floor applied with ${precision} decimal places`);
    return this;
  }

  toNumber(): number {
    return this.value.toNumber();
  }

  toDecimal(): Decimal {
    return this.value;
  }

  toString(): string {
    return this.value.toString();
  }

  valueOf(options?: DecimalOptions): DecimalOutput {
    return DecimalConverter['processResult'](this.value, options);
  }

  getOperationHistory(): string[] {
    return [...this.operations];
  }

  getCurrentValue(): Decimal {
    return this.value;
  }

  format(options?: Parameters<typeof DecimalConverter.format>[1]): string {
    return DecimalConverter.format(this.value, options);
  }
}

export const plus = DecimalConverter.add;
export const minus = DecimalConverter.subtract;
export const times = DecimalConverter.multiply;
export const dividedBy = DecimalConverter.divide;

export { DecimalChain, DecimalError };
export type { DecimalInput, DecimalOutput, DecimalOptions, ComparisonResult };
