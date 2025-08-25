// src/domain/value-objects/base.vo.ts
export abstract class BaseVo<T> {
  protected constructor(protected readonly value: T) {
    this.validate(value);
  }

  protected abstract validate(value: T): void;

  getValue(): T {
    return this.value;
  }

  equals(other: BaseVo<T>): boolean {
    return JSON.stringify(this.value) === JSON.stringify(other.value);
  }
}

