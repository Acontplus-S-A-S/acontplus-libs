import { LineItemCalculation } from '../../types';
import { DecimalConverter, ParameterValidator } from '@acontplus/utils';
import { PricingCalculationError } from './pricing-calculation.error';

/**
 * Calculadora especializada para líneas de productos/servicios en facturas
 */
export class LineItemCalculator {
  constructor(private decimales = 4) {}

  /**
   * Calcula el total de una línea de producto incluyendo descuentos e impuestos
   * @param unitPrice - Precio por unidad del producto
   * @param quantity - Cantidad de productos
   * @param discountAmount - Valor del descuento a aplicar (por defecto 0)
   * @param taxAmount - Valor del impuesto a aplicar (por defecto 0)
   * @returns Objeto con todos los cálculos de la línea
   * @throws {PricingCalculationError} Si ocurre un error en el cálculo
   * @example
   * ```typescript
   * const linea = calculadora.calcularTotalLinea(50, 2, 10, 8.4);
   * // Resultado: subtotal: 100, con descuento: 90, total con impuesto: 98.4
   * ```
   */
  calculateLineItemTotal(
    unitPrice: number,
    quantity: number,
    discountAmount = 0,
    taxAmount = 0,
  ): LineItemCalculation {
    try {
      ParameterValidator.validatePositiveNumber(unitPrice, 'unitPrice');
      ParameterValidator.validatePositiveNumber(quantity, 'quantity');
      ParameterValidator.validatePositiveNumber(discountAmount, 'discountAmount');
      ParameterValidator.validatePositiveNumber(taxAmount, 'taxAmount');

      const subtotal = DecimalConverter.multiplyAsNumber(unitPrice, quantity);
      const subtotalAfterDiscount = DecimalConverter.subtractAsNumber(subtotal, discountAmount);
      const total = DecimalConverter.addAsNumber(subtotalAfterDiscount, taxAmount);

      return {
        unitPrice,
        quantity,
        subtotal,
        discountAmount,
        subtotalAfterDiscount,
        taxAmount,
        total,
      };
    } catch (error) {
      throw new PricingCalculationError('calcularTotalLinea', error as Error);
    }
  }

  /**
   * Calcula el subtotal antes de aplicar descuentos
   * @param unitPrice - Precio por unidad
   * @param quantity - Cantidad de productos
   * @returns Subtotal calculado
   * @example
   * ```typescript
   * const subtotal = calculadora.calculateSubtotal(25, 4); // 100
   * ```
   */
  calculateSubtotal(unitPrice: number, quantity: number): number {
    return DecimalConverter.multiplyAsNumber(unitPrice, quantity) as number;
  }
}
