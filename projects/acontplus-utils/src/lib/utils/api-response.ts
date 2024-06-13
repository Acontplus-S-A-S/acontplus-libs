export interface ApiResponse {
  code: '0' | '1';
  message: string;
  payload: any;
}

export function isApiResponse(object: unknown | object): object is ApiResponse {
  if (object !== null && typeof object === 'object') {
    return 'code'! in object;
  }
  return false;
}
