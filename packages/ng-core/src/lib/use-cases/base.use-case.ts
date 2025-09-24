import { Observable } from 'rxjs';

export interface UseCase<TRequest = void, TResponse = void> {
  execute(request: TRequest): Observable<TResponse>;
}

export abstract class BaseUseCase<TRequest = void, TResponse = void>
  implements UseCase<TRequest, TResponse>
{
  abstract execute(request: TRequest): Observable<TResponse>;
}
