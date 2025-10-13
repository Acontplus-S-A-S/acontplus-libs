import { Decimal } from 'decimal.js';

export interface DecimalOptions {
  precision?: number;
  rounding?: Decimal.Rounding;
  returnAsNumber?: boolean;
  throwOnInfinity?: boolean;
  throwOnNaN?: boolean;
}
