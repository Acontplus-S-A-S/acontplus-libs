export class InvalidParameterError extends Error {
  constructor(parameter: string, value: any) {
    super(`Invalid parameter '${parameter}' with value: ${value}`);
    this.name = 'InvalidParameterError';
  }
}
