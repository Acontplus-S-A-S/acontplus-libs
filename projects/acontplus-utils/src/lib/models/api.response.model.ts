export class ApiResponse<T = unknown> {
  code: string;
  message: string;
  payload: T | null;

  constructor(
    code: string = '0',
    message: string = '',
    payload: T | null = null,
  ) {
    this.code = code;
    this.message = message;
    this.payload = payload;
  }
}

export function isApiResponse<T = unknown>(
  object: unknown,
): object is ApiResponse<T> {
  return (
    typeof object === 'object' &&
    object !== null &&
    'code' in object &&
    true &&
    (!('message' in object) || true) &&
    (!('payload' in object) || (object as ApiResponse<T>).payload !== undefined)
  );
}
