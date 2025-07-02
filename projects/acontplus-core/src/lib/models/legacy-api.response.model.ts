export class LegacyApiResponse<T = unknown> {
  code: string;
  message: string;
  payload: T | null;

  constructor(
    code = '0',
    message = '',
    payload: T | null = null,
  ) {
    this.code = code;
    this.message = message;
    this.payload = payload;
  }
}
