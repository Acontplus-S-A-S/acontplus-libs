import { v4 as uuidv4 } from 'uuid';
import { BaseVo } from './base.vo';

export class EntityIdVo extends BaseVo<string> {
  constructor(value: string) {
    super(value);
  }

  static generate(): EntityIdVo {
    return new EntityIdVo(uuidv4());
  }

  protected validate(value: string): void {
    if (!value || value.trim().length === 0) {
      throw new Error('EntityIdVo cannot be empty');
    }
  }
}
