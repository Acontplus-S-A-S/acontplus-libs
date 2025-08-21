// src/lib/use-cases/base.use-case.ts
export abstract class BaseUseCase<Request, Response> {
  abstract execute(request: Request): Promise<Response> | Response;
}
