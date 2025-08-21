import { v4 as uuidv4 } from 'uuid';
import { BaseValueObject } from './base.value-object';

export class EntityId extends BaseValueObject<string> {
  constructor(value: string) {
    super(value);
  }

  static generate(): EntityId {
    return new EntityId(uuidv4());
  }

  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('EntityId cannot be empty');
    }
  }
}
