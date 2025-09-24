import { DecimalConverter, InvalidParameterError, ParameterValidator } from '@acontplus/utils';
import { PricingCalculationError } from './pricing-calculation.error';
import { DiscountCalculation } from '../../types';

/**
 * Calculadora especializada para descuentos
 */
export class DiscountCalculator {
  constructor(private decimales = 4) {}

  /**
   * Calcula el valor del descuento a partir del porcentaje
   * @param originalPrice - Precio antes del descuento
   * @param discountPercentage - Porcentaje de descuento a aplicar (0-100)
   * @returns Valor del descuento en moneda
   * @throws {PricingCalculationError} Si ocurre un error en el cálculo
   * @example
   * ```typescript
   * const valorDescuento = calculadora.calculateDiscountAmount(100, 10); // 10
   * ```
   */
  calculateDiscountAmount(originalPrice: number, discountPercentage: number): number {
    try {
      ParameterValidator.validatePositiveNumber(originalPrice, 'originalPrice');
      ParameterValidator.validatePercentage(discountPercentage, 'discountPercentage');

      const percentage = DecimalConverter.divideAsNumber(discountPercentage, 100);
      return DecimalConverter.multiplyAsNumber(originalPrice, percentage);
    } catch (error) {
      throw new PricingCalculationError('calculateDiscountAmount', error as Error);
    }
  }

  /**
   * Aplica un descuento al precio original
   * @param originalPrice - Precio antes del descuento
   * @param discountPercentage - Porcentaje de descuento a aplicar
   * @returns Precio final después del descuento
   * @throws {PricingCalculationError} Si ocurre un error en el cálculo
   * @example
   * ```typescript
   * const precioConDescuento = calculadora.applyDiscount(100, 10); // 90
   * ```
   */
  applyDiscount(originalPrice: number, discountPercentage: number): number {
    try {
      const discountAmount = this.calculateDiscountAmount(originalPrice, discountPercentage);
      return DecimalConverter.subtractAsNumber(originalPrice, discountAmount);
    } catch (error) {
      throw new PricingCalculationError('applyDiscount', error as Error);
    }
  }

  /**
   * Calcula el porcentaje de descuento a partir de los valores
   * @param originalPrice - Precio antes del descuento
   * @param discountAmount - Valor del descuento aplicado
   * @returns Porcentaje de descuento
   * @throws {PricingCalculationError} Si ocurre un error en el cálculo
   * @example
   * ```typescript
   * const porcentaje = calculadora.calculateDiscountPercentage(100, 10); // 10
   * ```
   */
  calculateDiscountPercentage(originalPrice: number, discountAmount: number): number {
    try {
      ParameterValidator.validatePositiveNumber(originalPrice, 'originalPrice');
      ParameterValidator.validatePositiveNumber(discountAmount, 'discountAmount');

      if (discountAmount > originalPrice) {
        throw new InvalidParameterError(
          'discountAmount',
          'No puede ser mayor que el precio original',
        );
      }

      const percentage = DecimalConverter.divideAsNumber(discountAmount, originalPrice);
      return DecimalConverter.multiplyAsNumber(percentage, 100);
    } catch (error) {
      throw new PricingCalculationError('calculateDiscountPercentage', error as Error);
    }
  }

  /**
   * Obtiene los detalles completos del cálculo de descuento
   * @param originalPrice - Precio antes del descuento
   * @param discountPercentage - Porcentaje de descuento a aplicar
   * @returns Objeto con todos los detalles del cálculo
   * @example
   * ```typescript
   * const detalles = calculadora.getDiscountCalculationDetails(100, 10);
   * // { originalPrice: 100, discountRate: 10, discountAmount: 10, finalPrice: 90 }
   * ```
   */
  getDiscountCalculationDetails(
    originalPrice: number,
    discountPercentage: number,
  ): DiscountCalculation {
    const discountAmount = this.calculateDiscountAmount(originalPrice, discountPercentage);
    const finalPrice = this.applyDiscount(originalPrice, discountPercentage);

    return {
      originalPrice,
      discountRate: discountPercentage,
      discountAmount,
      finalPrice,
    };
  }
}
