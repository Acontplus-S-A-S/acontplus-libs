
import { Repository } from '../../../lib/application/interfaces/repository';
import { EntityId } from '../../../lib/domain/value-objects/entity-id';

export interface CustomerRepository extends Repository<any, EntityId> {}


