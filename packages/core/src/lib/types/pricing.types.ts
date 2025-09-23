export interface PricingConfig {
  defaultDecimals?: number;
  roundingMode?: 'round' | 'ceil' | 'floor';
  errorHandling?: 'throw' | 'return-null' | 'return-default';
}

export interface TaxCalculation {
  baseAmount: number;
  taxRate: number;
  taxAmount: number;
  totalAmount: number;
}

export interface DiscountCalculation {
  originalPrice: number;
  discountRate: number;
  discountAmount: number;
  finalPrice: number;
}

export interface ProfitMarginCalculation {
  salePrice: number;
  cost: number;
  profitAmount: number;
  profitMargin: number;
}

export interface LineItemCalculation {
  unitPrice: number;
  quantity: number;
  subtotal: number;
  discountAmount: number;
  subtotalAfterDiscount: number;
  taxAmount: number;
  total: number;
}
