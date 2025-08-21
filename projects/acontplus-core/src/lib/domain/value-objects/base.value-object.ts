// src/domain/value-objects/base.value-object.ts
export abstract class BaseValueObject<T> {
  protected constructor(protected readonly value: T) {
    this.validate(value);
  }

  protected abstract validate(value: T): void;

  getValue(): T {
    return this.value;
  }

  equals(other: BaseValueObject<T>): boolean {
    return JSON.stringify(this.value) === JSON.stringify(other.value);
  }
}

