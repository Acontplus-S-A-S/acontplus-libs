// Tipos para mayor claridad
import Decimal from "decimal.js";

type DecimalInput = string | number | Decimal;
type DecimalOutput = number | Decimal;

// Configuración por defecto
const DEFAULT_CONFIG = {
  precision: 6, // Cambio de 2 a 6 para uso empresarial
  rounding: Decimal.ROUND_HALF_UP,
  returnAsNumber: true
} as const;

// Interfaz para opciones de configuración
interface DecimalOptions {
  precision?: number;
  rounding?: Decimal.Rounding;
  returnAsNumber?: boolean;
}

/**
 * Clase principal para operaciones decimales
 */
class DecimalUtils {
  private static defaultConfig = DEFAULT_CONFIG;

  /**
   * Configura valores por defecto globalmente
   */
  static configure(config: Partial<typeof DEFAULT_CONFIG>): void {
    this.defaultConfig = { ...this.defaultConfig, ...config };
  }

  /**
   * Crea una instancia Decimal normalizada
   */
  private static createDecimal(value: DecimalInput): Decimal {
    if (value instanceof Decimal) return value;
    return new Decimal(value);
  }

  /**
   * Procesa el resultado según las opciones
   */
  private static processResult(
    decimal: Decimal,
    options: DecimalOptions = {}
  ): DecimalOutput {
    const config = { ...this.defaultConfig, ...options };

    let result = decimal;

    // Aplicar precisión si se especifica
    if (config.precision >= 0) {
      result = config.rounding !== undefined
        ? result.toDecimalPlaces(config.precision, config.rounding)
        : result.toDecimalPlaces(config.precision);
    }

    // Retornar como número o Decimal
    return config.returnAsNumber ? result.toNumber() : result;
  }

  /**
   * Suma dos números decimales
   */
  static add(num1: DecimalInput, num2: DecimalInput, options?: DecimalOptions): DecimalOutput {
    const decimal1 = this.createDecimal(num1);
    const decimal2 = this.createDecimal(num2);
    const result = decimal1.plus(decimal2);

    return this.processResult(result, options);
  }

  /**
   * Resta dos números decimales
   */
  static subtract(num1: DecimalInput, num2: DecimalInput, options?: DecimalOptions): DecimalOutput {
    const decimal1 = this.createDecimal(num1);
    const decimal2 = this.createDecimal(num2);
    const result = decimal1.minus(decimal2);

    return this.processResult(result, options);
  }

  /**
   * Multiplica dos números decimales
   */
  static multiply(num1: DecimalInput, num2: DecimalInput, options?: DecimalOptions): DecimalOutput {
    const decimal1 = this.createDecimal(num1);
    const decimal2 = this.createDecimal(num2);
    const result = decimal1.mul(decimal2);

    return this.processResult(result, options);
  }

  /**
   * Divide dos números decimales
   */
  static divide(num1: DecimalInput, num2: DecimalInput, options?: DecimalOptions): DecimalOutput {
    const decimal1 = this.createDecimal(num1);
    const decimal2 = this.createDecimal(num2);

    if (decimal2.isZero()) {
      throw new Error('Division by zero is not allowed');
    }

    const result = decimal1.div(decimal2);
    return this.processResult(result, options);
  }

  /**
   * Calcula el porcentaje
   */
  static percentage(value: DecimalInput, percent: DecimalInput, options?: DecimalOptions): DecimalOutput {
    const decimal1 = this.createDecimal(value);
    const decimal2 = this.createDecimal(percent);
    const result = decimal1.mul(decimal2).div(100);

    return this.processResult(result, options);
  }

  /**
   * Operaciones en cadena (chainable)
   */
  static chain(initialValue: DecimalInput): DecimalChain {
    return new DecimalChain(initialValue);
  }

  /**
   * Métodos que garantizan retorno como número (para compatibilidad)
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
   * Métodos que garantizan retorno como Decimal (para precisión máxima)
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
  static compare(num1: DecimalInput, num2: DecimalInput)  {
    const decimal1 = this.createDecimal(num1);
    const decimal2 = this.createDecimal(num2);
    return decimal1.comparedTo(decimal2);
  }

  /**
   * Verifica si dos números son iguales
   */
  static equals(num1: DecimalInput, num2: DecimalInput): boolean {
    return this.compare(num1, num2) === 0;
  }

  /**
   * Valor absoluto
   */
  static abs(value: DecimalInput, options?: DecimalOptions): DecimalOutput {
    const decimal = this.createDecimal(value);
    const result = decimal.abs();

    return this.processResult(result, options);
  }

  /**
   * Redondea un número
   */
  static round(value: DecimalInput, precision = 0, rounding?: Decimal.Rounding): DecimalOutput {
    const decimal = this.createDecimal(value);
    const result = rounding !== undefined
      ? decimal.toDecimalPlaces(precision, rounding)
      : decimal.toDecimalPlaces(precision);

    return this.processResult(result, { precision, rounding });
  }

  /**
   * Suma un array de números
   */
  static sum(values: DecimalInput[], options?: DecimalOptions): DecimalOutput {
    const result = values.reduce((acc: Decimal, val) => {
      const decimal = this.createDecimal(val);
      return acc.plus(decimal);
    }, new Decimal(0));

    return this.processResult(result, options);
  }

  /**
   * Promedio de un array de números
   */
  static average(values: DecimalInput[], options?: DecimalOptions): DecimalOutput {
    if (values.length === 0) {
      throw new Error('Cannot calculate average of empty array');
    }

    const sum = this.sum(values, { returnAsNumber: false }) as Decimal;
    const result = sum.div(values.length);

    return this.processResult(result, options);
  }
}

/**
 * Clase para operaciones en cadena
 */
class DecimalChain {
  private value: Decimal;

  constructor(initialValue: DecimalInput) {
    this.value = new Decimal(initialValue);
  }

  add(num: DecimalInput): DecimalChain {
    this.value = this.value.plus(num);
    return this;
  }

  subtract(num: DecimalInput): DecimalChain {
    this.value = this.value.minus(num);
    return this;
  }

  multiply(num: DecimalInput): DecimalChain {
    this.value = this.value.mul(num);
    return this;
  }

  divide(num: DecimalInput): DecimalChain {
    if (new Decimal(num).isZero()) {
      throw new Error('Division by zero is not allowed');
    }
    this.value = this.value.div(num);
    return this;
  }

  percentage(percent: DecimalInput): DecimalChain {
    this.value = this.value.mul(percent).div(100);
    return this;
  }

  abs(): DecimalChain {
    this.value = this.value.abs();
    return this;
  }

  round(precision = 0, rounding?: Decimal.Rounding): DecimalChain {
    this.value = rounding !== undefined
      ? this.value.toDecimalPlaces(precision, rounding)
      : this.value.toDecimalPlaces(precision);
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
    return DecimalUtils['processResult'](this.value, options);
  }
}

// Exportar la clase principal
export default DecimalUtils;

// Exportar tipos
export type { DecimalInput, DecimalOutput, DecimalOptions };

/*
EJEMPLOS DE USO:

// Configuración global
DecimalUtils.configure({ precision: 6, returnAsNumber: true });

// Operaciones básicas
const suma = DecimalUtils.add(0.1, 0.2); // 0.3
const resta = DecimalUtils.subtract(1, 0.9, { precision: 1 }); // 0.1
const multiplicacion = DecimalUtils.multiply(0.1, 3); // 0.3
const division = DecimalUtils.divide(1, 3, { precision: 4 }); // 0.3333

// Operaciones avanzadas
const porcentaje = DecimalUtils.percentage(1000, 15); // 150
const suma_array = DecimalUtils.sum([0.1, 0.2, 0.3]); // 0.6
const promedio = DecimalUtils.average([1, 2, 3, 4, 5]); // 3

// Operaciones en cadena
const resultado = DecimalUtils.chain(100)
  .add(50)
  .multiply(0.1)
  .percentage(15)
  .toNumber(); // 2.25

// Comparaciones
const esIgual = DecimalUtils.equals(0.1 + 0.2, 0.3); // true
const comparacion = DecimalUtils.compare(0.1, 0.2); // -1

// Mantener compatibilidad con funciones anteriores
const suma_legacy = plus(0.1, 0.2, 2); // 0.3
*/
