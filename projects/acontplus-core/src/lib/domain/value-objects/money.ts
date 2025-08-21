// src/domain/value-objects/money.ts
import {BaseValueObject} from "./base.value-object";

export class Money extends BaseValueObject<{ amount: number; currency: string }> {
  constructor(amount: number, currency = 'USD') {
    super({ amount, currency });
  }

  protected validate(value: { amount: number; currency: string }): void {
    if (value.amount < 0) throw new Error('Amount cannot be negative');
    if (!value.currency || value.currency.length !== 3) {
      throw new Error('Invalid currency code');
    }
  }

  add(other: Money): Money {
    if (this.value.currency !== other.value.currency) {
      throw new Error('Cannot add different currencies');
    }
    return new Money(this.value.amount + other.value.amount, this.value.currency);
  }
}
