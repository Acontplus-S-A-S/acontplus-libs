export const isValidField = <T>(field: T): T | null => {
  let value: any = field;
  if (typeof field === 'string') value = field.trim();

  const invalidValues: readonly (T | null | undefined | "" | 0)[] = ["", null, undefined, 0];
  return invalidValues.includes(value) ? null : value;
};

export function getValidId(id?: number): number | null | undefined {
  if (id === undefined) return undefined;
  return id > 0 ? id : null;
}
