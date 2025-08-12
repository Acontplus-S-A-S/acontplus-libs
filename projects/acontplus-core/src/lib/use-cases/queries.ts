import { FilterParams, PaginatedResult, PaginationParams } from '../models';
import { BaseUseCase } from './base.use-case';

export abstract class Queries<TRequest, TResponse> extends BaseUseCase<TRequest, TResponse> {}

export abstract class GetByIdQuery<TEntity> extends Queries<{ id: number }, TEntity> {}

export abstract class GetAllQuery<TEntity> extends Queries<
  { pagination: PaginationParams; filters?: FilterParams },
  PaginatedResult<TEntity>
> {}

export abstract class SearchQuery<TEntity> extends Queries<
  { query: string; pagination: PaginationParams },
  PaginatedResult<TEntity>
> {}
