export class DecimalError extends Error {
  constructor(
    message: string,
    public readonly operation?: string,
  ) {
    super(message);
    this.name = 'DecimalError';
  }
}
