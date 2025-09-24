import { DiscountCalculator } from './discount.calculator';
import { LineItemCalculator } from './line-item.calculator';
import { ProfitCalculator } from './profit.calculator';
import { TaxCalculator } from './tax.calculator';
import { PricingConfig } from '../../types';

export class PricingCalculator {
  private config: Required<PricingConfig>;
  public readonly tax: TaxCalculator;
  public readonly discount: DiscountCalculator;
  public readonly profit: ProfitCalculator;
  public readonly lineItem: LineItemCalculator;

  constructor(config: PricingConfig = {}) {
    this.config = {
      defaultDecimals: config.defaultDecimals ?? 4,
      roundingMode: config.roundingMode ?? 'round',
      errorHandling: config.errorHandling ?? 'throw',
    };

    this.tax = new TaxCalculator(this.config.defaultDecimals);
    this.discount = new DiscountCalculator(this.config.defaultDecimals);
    this.profit = new ProfitCalculator(this.config.defaultDecimals);
    this.lineItem = new LineItemCalculator(this.config.defaultDecimals);
  }

  updateConfig(newConfig: Partial<PricingConfig>): void {
    this.config = { ...this.config, ...newConfig };
  }

  getConfig(): PricingConfig {
    return { ...this.config };
  }
}
