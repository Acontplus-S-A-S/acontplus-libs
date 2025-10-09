export interface UseCase<TRequest = void, TResponse = void> {
  execute(request: TRequest): TResponse | Promise<TResponse>;
}
