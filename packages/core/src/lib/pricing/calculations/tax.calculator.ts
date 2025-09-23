import { DecimalConverter, ParameterValidator } from '@acontplus/utils';
import { PricingCalculationError } from './pricing-calculation.error';
import { TaxCalculation } from '../../types';

/**
 * Calculadora especializada para impuestos (IVA, IGV, etc.)
 */
export class TaxCalculator {
  constructor(private decimales = 4) {}

  /**
   * Calcula el valor del impuesto basado en el precio base y la tasa
   * @param basePrice - Precio sin impuestos
   * @param taxRate - Porcentaje del impuesto (ej: 21 para 21%)
   * @returns Valor del impuesto calculado
   * @throws {PricingCalculationError} Si ocurre un error en el cálculo
   * @example
   * ```typescript
   * const calculadora = new TaxCalculator();
   * const valorIva = calculadora.calculateTaxAmount(100, 21); // 21
   * ```
   */
  calculateTaxAmount(basePrice: number, taxRate: number): number {
    try {
      ParameterValidator.validatePositiveNumber(basePrice, 'basePrice');
      ParameterValidator.validatePositiveNumber(taxRate, 'taxRate');

      const multiplicador = DecimalConverter.multiplyAsNumber(basePrice, taxRate);
      return DecimalConverter.divideAsNumber(multiplicador, 100);
    } catch (error) {
      throw new PricingCalculationError('calculateTaxAmount', error as Error);
    }
  }

  /**
   * Calcula el precio incluyendo impuestos
   * @param basePrice - Precio sin impuestos
   * @param taxRate - Porcentaje del impuesto
   * @returns Precio total con impuestos incluidos
   * @throws {PricingCalculationError} Si ocurre un error en el cálculo
   * @example
   * ```typescript
   * const precioConIva = calculadora.calculatePriceWithTax(100, 21); // 121
   * ```
   */
  calculatePriceWithTax(basePrice: number, taxRate: number): number {
    try {
      const taxAmount = this.calculateTaxAmount(basePrice, taxRate);
      return DecimalConverter.addAsNumber(basePrice, taxAmount);
    } catch (error) {
      throw new PricingCalculationError('calculatePriceWithTax', error as Error);
    }
  }

  /**
   * Calcula el precio base a partir de un precio que ya incluye impuestos
   * @param priceWithTax - Precio que incluye impuestos
   * @param taxRate - Porcentaje del impuesto aplicado
   * @returns Precio base sin impuestos
   * @throws {PricingCalculationError} Si ocurre un error en el cálculo
   * @example
   * ```typescript
   * const precioBase = calculadora.calculateBasePriceFromTaxIncluded(121, 21); // 100
   * ```
   */
  calculateBasePriceFromTaxIncluded(priceWithTax: number, taxRate: number): number {
    try {
      ParameterValidator.validatePositiveNumber(priceWithTax, 'priceWithTax');
      ParameterValidator.validatePositiveNumber(taxRate, 'taxRate');

      const taxMultiplier = DecimalConverter.divideAsNumber(taxRate, 100);
      const divisor = DecimalConverter.addAsNumber(1, taxMultiplier);
      return DecimalConverter.divideAsNumber(priceWithTax, divisor);
    } catch (error) {
      throw new PricingCalculationError('calculateBasePriceFromTaxIncluded', error as Error);
    }
  }

  /**
   * Obtiene los detalles completos del cálculo de impuestos
   * @param basePrice - Precio sin impuestos
   * @param taxRate - Porcentaje del impuesto
   * @returns Objeto con todos los detalles del cálculo
   * @example
   * ```typescript
   * const detalles = calculadora.getTaxCalculationDetails(100, 21);
   * // { montoBase: 100, taxRate: 21, valorImpuesto: 21, montoTotal: 121 }
   * ```
   */
  getTaxCalculationDetails(basePrice: number, taxRate: number): TaxCalculation {
    const taxAmount = this.calculateTaxAmount(basePrice, taxRate);
    const totalAmount = this.calculatePriceWithTax(basePrice, taxRate);

    return {
      baseAmount: basePrice,
      taxRate,
      taxAmount,
      totalAmount,
    };
  }
}
