import { BaseUseCase } from './base.use-case';

export abstract class Command<TRequest, TResponse = void> extends BaseUseCase<
  TRequest,
  TResponse
> {}

export abstract class CreateCommand<
  TEntity,
  TResponse = TEntity,
> extends Command<Omit<TEntity, 'id'>, TResponse> {}

export abstract class UpdateCommand<
  TEntity,
  TResponse = TEntity,
> extends Command<{ id: number; data: Partial<TEntity> }, TResponse> {}

export abstract class DeleteCommand extends Command<{ id: number }, boolean> {}
