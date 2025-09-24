import Decimal from 'decimal.js';

// Tipos más específicos y flexibles
type DecimalInput = string | number | Decimal;
type DecimalOutput = number | Decimal;
type ComparisonResult = -1 | 0 | 1;

// Interfaz expandida para opciones
interface DecimalOptions {
  precision?: number;
  rounding?: Decimal.Rounding;
  returnAsNumber?: boolean;
  throwOnInfinity?: boolean;
  throwOnNaN?: boolean;
}

// Configuración con validaciones más robustas
const DEFAULT_CONFIG: Required<DecimalOptions> = {
  precision: 6,
  rounding: Decimal.ROUND_HALF_UP,
  returnAsNumber: true,
  throwOnInfinity: true,
  throwOnNaN: true,
};

// Errores personalizados
class DecimalError extends Error {
  constructor(
    message: string,
    public readonly operation?: string,
  ) {
    super(message);
    this.name = 'DecimalError';
  }
}

/**
 * Utilidades avanzadas para operaciones decimales de alta precisión
 * Diseñado para aplicaciones empresariales que requieren cálculos exactos
 */
export class DecimalConverter {
  private static defaultConfig = DEFAULT_CONFIG;

  /**
   * Configura valores por defecto globalmente con validación
   */
  static configure(config: Partial<typeof DEFAULT_CONFIG>): void {
    if (config.precision !== undefined && (config.precision < 0 || config.precision > 100)) {
      throw new DecimalError('Precision must be between 0 and 100');
    }
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  /**
   * Obtiene la configuración actual
   */
  static getConfig(): typeof DEFAULT_CONFIG {
    return { ...this.defaultConfig };
  }

  /**
   * Crea una instancia Decimal con validación mejorada
   */
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

  /**
   * Procesa el resultado con validaciones adicionales
   */
  private static processResult(
    decimal: Decimal,
    options: DecimalOptions = {},
    operation = 'unknown',
  ): DecimalOutput {
    const config = { ...this.defaultConfig, ...options };

    // Validar el resultado antes de procesarlo
    if (config.throwOnNaN && decimal.isNaN()) {
      throw new DecimalError(`Operation ${operation} resulted in NaN`, operation);
    }

    if (config.throwOnInfinity && !decimal.isFinite()) {
      throw new DecimalError(`Operation ${operation} resulted in Infinity`, operation);
    }

    let result = decimal;

    // Aplicar precisión si se especifica
    if (config.precision >= 0) {
      result =
        config.rounding !== undefined
          ? result.toDecimalPlaces(config.precision, config.rounding)
          : result.toDecimalPlaces(config.precision);
    }

    // Retornar como número o Decimal
    return config.returnAsNumber ? result.toNumber() : result;
  }

  // === OPERACIONES BÁSICAS ===

  /**
   * Suma dos o más números decimales
   */
  static add(num1: DecimalInput, num2: DecimalInput, options?: DecimalOptions): DecimalOutput {
    const decimal1 = this.createDecimal(num1, 'addition');
    const decimal2 = this.createDecimal(num2, 'addition');
    const result = decimal1.plus(decimal2);

    return this.processResult(result, options, 'addition');
  }

  /**
   * Resta dos números decimales
   */
  static subtract(num1: DecimalInput, num2: DecimalInput, options?: DecimalOptions): DecimalOutput {
    const decimal1 = this.createDecimal(num1, 'subtraction');
    const decimal2 = this.createDecimal(num2, 'subtraction');
    const result = decimal1.minus(decimal2);

    return this.processResult(result, options, 'subtraction');
  }

  /**
   * Multiplica dos números decimales
   */
  static multiply(num1: DecimalInput, num2: DecimalInput, options?: DecimalOptions): DecimalOutput {
    const decimal1 = this.createDecimal(num1, 'multiplication');
    const decimal2 = this.createDecimal(num2, 'multiplication');
    const result = decimal1.mul(decimal2);

    return this.processResult(result, options, 'multiplication');
  }

  /**
   * Divide dos números decimales con protección contra división por cero
   */
  static divide(num1: DecimalInput, num2: DecimalInput, options?: DecimalOptions): DecimalOutput {
    const decimal1 = this.createDecimal(num1, 'division');
    const decimal2 = this.createDecimal(num2, 'division');

    if (decimal2.isZero()) {
      throw new DecimalError('Division by zero is not allowed', 'division');
    }

    const result = decimal1.div(decimal2);
    return this.processResult(result, options, 'division');
  }

  /**
   * Potencia de un número
   */
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

  /**
   * Raíz cuadrada
   */
  static sqrt(value: DecimalInput, options?: DecimalOptions): DecimalOutput {
    const decimal = this.createDecimal(value, 'sqrt');

    if (decimal.isNegative()) {
      throw new DecimalError('Square root of negative number is not supported', 'sqrt');
    }

    const result = decimal.sqrt();
    return this.processResult(result, options, 'sqrt');
  }

  /**
   * Módulo (resto de la división)
   */
  static mod(num1: DecimalInput, num2: DecimalInput, options?: DecimalOptions): DecimalOutput {
    const decimal1 = this.createDecimal(num1, 'modulo');
    const decimal2 = this.createDecimal(num2, 'modulo');

    if (decimal2.isZero()) {
      throw new DecimalError('Modulo by zero is not allowed', 'modulo');
    }

    const result = decimal1.mod(decimal2);
    return this.processResult(result, options, 'modulo');
  }

  // === OPERACIONES FINANCIERAS ===

  /**
   * Calcula el porcentaje
   */
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

  /**
   * Aplica un descuento porcentual
   */
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

  /**
   * Calcula impuestos sobre un valor
   */
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

  /**
   * Interés simple
   */
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

  /**
   * Interés compuesto
   */
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

    // A = P(1 + r/n)^(nt) - P
    const base = r.div(n).plus(1);
    const exponent = n.mul(t);
    const amount = p.mul(base.pow(exponent));
    const result = amount.minus(p);

    return this.processResult(result, options, 'compound_interest');
  }

  // === OPERACIONES DE COMPARACIÓN ===

  /**
   * Compara dos números decimales
   */
  static compare(num1: DecimalInput, num2: DecimalInput): ComparisonResult {
    const decimal1 = this.createDecimal(num1, 'comparison');
    const decimal2 = this.createDecimal(num2, 'comparison');
    return decimal1.comparedTo(decimal2) as ComparisonResult;
  }

  /**
   * Verifica si dos números son iguales
   */
  static equals(num1: DecimalInput, num2: DecimalInput): boolean {
    return this.compare(num1, num2) === 0;
  }

  /**
   * Verifica si el primer número es mayor que el segundo
   */
  static greaterThan(num1: DecimalInput, num2: DecimalInput): boolean {
    return this.compare(num1, num2) === 1;
  }

  /**
   * Verifica si el primer número es menor que el segundo
   */
  static lessThan(num1: DecimalInput, num2: DecimalInput): boolean {
    return this.compare(num1, num2) === -1;
  }

  /**
   * Verifica si el primer número es mayor o igual que el segundo
   */
  static greaterThanOrEqual(num1: DecimalInput, num2: DecimalInput): boolean {
    const comparison = this.compare(num1, num2);
    return comparison === 1 || comparison === 0;
  }

  /**
   * Verifica si el primer número es menor o igual que el segundo
   */
  static lessThanOrEqual(num1: DecimalInput, num2: DecimalInput): boolean {
    const comparison = this.compare(num1, num2);
    return comparison === -1 || comparison === 0;
  }

  // === OPERACIONES MATEMÁTICAS ===

  /**
   * Valor absoluto
   */
  static abs(value: DecimalInput, options?: DecimalOptions): DecimalOutput {
    const decimal = this.createDecimal(value, 'absolute');
    const result = decimal.abs();

    return this.processResult(result, options, 'absolute');
  }

  /**
   * Valor mínimo de un conjunto de números
   */
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

  /**
   * Valor máximo de un conjunto de números
   */
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

  /**
   * Redondea un número con diferentes métodos
   */
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

  /**
   * Redondea hacia arriba (ceil)
   */
  static ceil(value: DecimalInput, precision = 0, options?: DecimalOptions): DecimalOutput {
    return this.round(value, precision, Decimal.ROUND_UP, options);
  }

  /**
   * Redondea hacia abajo (floor)
   */
  static floor(value: DecimalInput, precision = 0, options?: DecimalOptions): DecimalOutput {
    return this.round(value, precision, Decimal.ROUND_DOWN, options);
  }

  // === OPERACIONES CON ARRAYS ===

  /**
   * Suma un array de números
   */
  static sum(values: DecimalInput[], options?: DecimalOptions): DecimalOutput {
    if (values.length === 0) {
      return this.processResult(new Decimal(0), options, 'sum');
    }

    const result = values.reduce((acc: Decimal, val) => {
      const decimal = this.createDecimal(val, 'sum');
      return acc.plus(decimal);
    }, new Decimal(0));

    return this.processResult(result, options, 'sum');
  }

  /**
   * Promedio de un array de números
   */
  static average(values: DecimalInput[], options?: DecimalOptions): DecimalOutput {
    if (values.length === 0) {
      throw new DecimalError('Cannot calculate average of empty array', 'average');
    }

    const sum = this.sum(values, { returnAsNumber: false }) as Decimal;
    const result = sum.div(values.length);

    return this.processResult(result, options, 'average');
  }

  /**
   * Mediana de un array de números
   */
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

  // === OPERACIONES EN CADENA ===

  /**
   * Inicia operaciones en cadena
   */
  static chain(initialValue: DecimalInput): DecimalChain {
    return new DecimalChain(initialValue);
  }

  // === MÉTODOS DE COMPATIBILIDAD ===

  /**
   * Métodos que garantizan retorno como número
   */
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

  /**
   * Métodos que garantizan retorno como Decimal
   */
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

  // === UTILIDADES ===

  /**
   * Verifica si un valor es un número válido
   */
  static isValid(value: any): boolean {
    try {
      const decimal = new Decimal(value);
      return decimal.isFinite() && !decimal.isNaN();
    } catch {
      return false;
    }
  }

  /**
   * Convierte a string con formato específico
   */
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

    // Reemplazar el punto decimal si es necesario
    if (decimalSeparator !== '.') {
      formatted = formatted.replace('.', decimalSeparator);
    }

    // Agregar separador de miles
    if (thousandsSeparator) {
      const parts = formatted.split(decimalSeparator);
      parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, thousandsSeparator);
      formatted = parts.join(decimalSeparator);
    }

    return `${prefix}${formatted}${suffix}`;
  }
}

/**
 * Clase mejorada para operaciones en cadena
 */
class DecimalChain {
  private value: Decimal;
  private operations: string[] = [];

  constructor(initialValue: DecimalInput) {
    this.value = new Decimal(initialValue);
    this.operations.push(`Started with: ${initialValue}`);
  }

  // Operaciones básicas
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

  // Operaciones financieras
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

  // Operaciones matemáticas
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

  // Métodos de salida
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

  // Utilidades
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

// Funciones de conveniencia para compatibilidad
export const plus = DecimalConverter.add;
export const minus = DecimalConverter.subtract;
export const times = DecimalConverter.multiply;
export const dividedBy = DecimalConverter.divide;

// Exportar la clase principal y tipos
export { DecimalChain, DecimalError };
export type { DecimalInput, DecimalOutput, DecimalOptions, ComparisonResult };

/*
EJEMPLOS DE USO MEJORADOS:

// === CONFIGURACIÓN ===
DecimalConverter.configure({
  precision: 6,
  returnAsNumber: true,
  throwOnInfinity: false
});

// === OPERACIONES BÁSICAS ===
const suma = DecimalConverter.add(0.1, 0.2); // 0.3
const potencia = DecimalConverter.power(2, 3); // 8
const raiz = DecimalConverter.sqrt(16); // 4

// === OPERACIONES FINANCIERAS ===
const precio = 1000;
const conDescuento = DecimalConverter.applyDiscount(precio, 15); // 850
const conImpuestos = DecimalConverter.addTax(conDescuento, 16); // 986
const interes = DecimalConverter.compoundInterest(1000, 5, 2, 12); // Interés compuesto

// === COMPARACIONES ===
const esIgual = DecimalConverter.equals(0.1 + 0.2, 0.3); // true
const esMayor = DecimalConverter.greaterThan(0.3, 0.2); // true

// === OPERACIONES CON ARRAYS ===
const valores = [0.1, 0.2, 0.3, 0.4, 0.5];
const suma_array = DecimalConverter.sum(valores); // 1.5
const promedio = DecimalConverter.average(valores); // 0.3
const mediana = DecimalConverter.median(valores); // 0.3
const minimo = DecimalConverter.min(valores); // 0.1
const maximo = DecimalConverter.max(valores); // 0.5

// === OPERACIONES EN CADENA AVANZADAS ===
const resultado = DecimalConverter.chain(1000)
  .applyDiscount(10)      // 900
  .addTax(16)             // 1044
  .round(2)               // 1044.00
  .format({
    thousandsSeparator: ',',
    prefix: '$',
    suffix: ' USD'
  }); // "$1,044.00 USD"

// === FORMATEO ===
const formatted = DecimalConverter.format(1234.5678, {
  precision: 2,
  thousandsSeparator: '.',
  decimalSeparator: ',',
  prefix: '€ ',
  suffix: ' EUR'
}); // "€ 1.234,57 EUR"

// === VALIDACIÓN ===
const esValido = DecimalConverter.isValid("123.45"); // true
const noEsValido = DecimalConverter.isValid("abc"); // false

// === MANEJO DE ERRORES ===
try {
  const division = DecimalConverter.divide(10, 0);
} catch (error) {
  if (error instanceof DecimalError) {
    console.log(`Error en operación ${error.operation}: ${error.message}`);
  }
}

// === HISTORIAL DE OPERACIONES ===
const cadena = DecimalConverter.chain(100)
  .multiply(1.16)
  .subtract(50)
  .round(2);

console.log(cadena.getOperationHistory());
// ["Started with: 100", "Multiplied by: 1.16", "Subtracted: 50", "Rounded to 2 decimal places"]
*/
