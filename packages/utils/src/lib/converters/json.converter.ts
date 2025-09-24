export function isValidJSON(value: unknown): boolean {
  if (typeof value !== 'string') return false;
  try {
    JSON.parse(value);
    return true;
  } catch {
    return false;
  }
}

export function parseJSONSafe<T>(value: unknown, fallback: T): T {
  if (typeof value !== 'string') return fallback;
  try {
    return JSON.parse(value) as T;
  } catch {
    return fallback;
  }
}
