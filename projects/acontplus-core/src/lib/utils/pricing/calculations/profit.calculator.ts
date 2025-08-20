import { ParameterValidator } from '../../../validators/parameter.validator';
import { ProfitMarginCalculation } from '../../../models/pricing.types';
import { DecimalUtils } from '../../decimal.utils';
import { InvalidParameterError, PricingCalculationError } from '../../../models/custom-error.model';

/**
 * Calculadora especializada para márgenes de ganancia y utilidades
 */
export class ProfitCalculator {
  constructor(private decimals = 4) {}

  /**
   * Calcula el precio de venta a partir del costo y el margen de ganancia
   * @param cost - Costo del producto o servicio
   * @param profitMarginPercentage - Porcentaje de margen de ganancia deseado
   * @returns Precio de venta calculado
   * @throws {PricingCalculationError} Si ocurre un error en el cálculo
   * @example
   * ```typescript
   * const precioVenta = calculadora.calculateSalePriceFromMargin(80, 25); // 100
   * ```
   */
  calculateSalePriceFromMargin(cost: number, profitMarginPercentage: number): number {
    try {
      ParameterValidator.validatePositiveNumber(cost, 'cost');
      ParameterValidator.validatePositiveNumber(profitMarginPercentage, 'profitMarginPercentage');

      const marginMultiplier = DecimalUtils.divideAsNumber(profitMarginPercentage, 100);
      const profitAmount = DecimalUtils.multiplyAsNumber(cost, marginMultiplier);
      return DecimalUtils.addAsNumber(cost, profitAmount);
    } catch (error) {
      throw new PricingCalculationError('calculateSalePriceFromMargin', error as Error);
    }
  }

  /**
   * Calcula el porcentaje de margen de ganancia a partir del precio de venta y costo
   * @param salePrice - Precio de venta del producto
   * @param cost - Costo del producto
   * @returns Porcentaje de margen de ganancia
   * @throws {PricingCalculationError} Si ocurre un error en el cálculo
   * @example
   * ```typescript
   * const margen = calculadora.calculateProfitMarginPercentage(100, 80); // 25
   * ```
   */
  calculateProfitMarginPercentage(salePrice: number, cost: number): number {
    try {
      ParameterValidator.validatePositiveNumber(salePrice, 'salePrice');
      ParameterValidator.validatePositiveNumber(cost, 'cost');

      if (salePrice < cost) {
        throw new InvalidParameterError(
          'salePrice',
          'El precio de venta no puede ser menor que el costo',
        );
      }

      const profitAmount = DecimalUtils.subtractAsNumber(salePrice, cost);
      const profitRatio = DecimalUtils.divideAsNumber(profitAmount, cost);
      return DecimalUtils.multiplyAsNumber(profitRatio, 100);
    } catch (error) {
      throw new PricingCalculationError('calculateProfitMarginPercentage', error as Error);
    }
  }

  /**
   * Calcula el valor de la ganancia
   * @param salePrice - Precio de venta
   * @param cost - Costo del producto
   * @returns Valor de la ganancia obtenida
   * @throws {PricingCalculationError} Si ocurre un error en el cálculo
   * @example
   * ```typescript
   * const ganancia = calculadora.calculateProfitAmount(100, 80); // 20
   * ```
   */
  calculateProfitAmount(salePrice: number, cost: number): number {
    try {
      ParameterValidator.validatePositiveNumber(salePrice, 'salePrice');
      ParameterValidator.validatePositiveNumber(cost, 'cost');

      return DecimalUtils.subtractAsNumber(salePrice, cost) as number;
    } catch (error) {
      throw new PricingCalculationError('calculateProfitAmount', error as Error);
    }
  }

  /**
   * Obtiene los detalles completos del cálculo de ganancia
   * @param salePrice - Precio de venta
   * @param cost - Costo del producto
   * @returns Objeto con todos los detalles del cálculo
   * @example
   * ```typescript
   * const detalles = calculadora.obtenerDetallesCalculoGanancia(100, 80);
   * // { salePrice: 100, cost: 80, profitAmount: 20, profitMargin: 25 }
   * ```
   */
  getProfitCalculationDetails(salePrice: number, cost: number): ProfitMarginCalculation {
    const profitAmount = this.calculateProfitAmount(salePrice, cost);
    const profitMargin = this.calculateProfitMarginPercentage(salePrice, cost);

    return {
      salePrice,
      cost,
      profitAmount,
      profitMargin,
    };
  }
}
