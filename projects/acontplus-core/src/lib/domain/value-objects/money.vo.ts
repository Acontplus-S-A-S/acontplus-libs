// src/domain/value-objects/money.vo.ts
import {BaseVo} from "./base.vo";

export class MoneyVo extends BaseVo<{ amount: number; currency: string }> {
  constructor(amount: number, currency = 'USD') {
    super({ amount, currency });
  }

  protected validate(value: { amount: number; currency: string }) {
    if (value.amount < 0) throw new Error('Amount cannot be negative');
    if (!value.currency || value.currency.length !== 3) {
      throw new Error('Invalid currency code');
    }
  }

  add(other: MoneyVo): MoneyVo {
    if (this.value.currency !== other.value.currency) {
      throw new Error('Cannot add different currencies');
    }
    return new MoneyVo(this.value.amount + other.value.amount, this.value.currency);
  }
}
