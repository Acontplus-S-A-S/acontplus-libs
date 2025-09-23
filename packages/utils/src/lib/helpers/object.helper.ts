import { ArrayHelper } from './array.helper';

export class ObjectHelper {
  /**
   * check whether value is null.
   * @param value
   * @example ObjectHelper.isNull(null)        = true
   * @example ObjectHelper.isNull(undefinend)  = false
   * @example ObjectHelper.isNull({})          = false
   * @example ObjectHelper.isNull(1)           = false
   */
  public static isNull(value: unknown): value is null {
    return value === null;
  }

  /**
   * check whether value is undefined.
   * @param value
   * @example ObjectHelper.isUndefined(undefinend)  = true
   * @example ObjectHelper.isUndefined(null)        = false
   * @example ObjectHelper.isUndefined({})          = false
   * @example ObjectHelper.isUndefined(1)           = false
   */
  public static isUndefined(value: unknown): value is undefined {
    return typeof value === 'undefined';
  }

  /**
   * check whether value is null or undefined.
   * @param value
   * @example ObjectHelper.isNullOrUndefined(undefinend)  = true
   * @example ObjectHelper.isNullOrUndefined(null)        = true
   * @example ObjectHelper.isNullOrUndefined({})          = false
   * @example ObjectHelper.isNullOrUndefined(1)           = false
   */
  public static isNullOrUndefined(value: unknown): value is null | undefined {
    return this.isNull(value) || this.isUndefined(value);
  }

  /**
   * check whether value is array.
   * @param value
   * @example ObjectHelper.isArray([])           = true
   * @example ObjectHelper.isArray(null)         = false
   * @example ObjectHelper.isArray(undefinend)   = false
   * @example ObjectHelper.isArray(1)            = false
   */
  public static isArray(value: unknown): value is any[] {
    return Array.isArray(value);
  }

  /**
   * check whether value is date.
   * @param value
   * @example ObjectHelper.isDate(new Date())   = true
   * @example ObjectHelper.isDate(null)         = false
   * @example ObjectHelper.isDate(undefinend)   = false
   * @example ObjectHelper.isDate(1)            = false
   */
  public static isDate(value: unknown): value is Date {
    return value instanceof Date;
  }

  /**
   * check whether value is string.
   * @param value
   * @example ObjectHelper.isString("test")       = true
   * @example ObjectHelper.isString(null)         = false
   * @example ObjectHelper.isString(undefinend)   = false
   * @example ObjectHelper.isString(1)            = false
   */
  public static isString(value: unknown): value is string {
    return typeof value === 'string';
  }

  /**
   * check whether value is number.
   * @param value
   * @example ObjectHelper.isNumber(1)            = true
   * @example ObjectHelper.isNumber(null)         = false
   * @example ObjectHelper.isNumber(undefinend)   = false
   * @example ObjectHelper.isNumber("test")       = false
   */
  public static isNumber(value: unknown): value is number {
    return typeof value === 'number';
  }

  /**
   * check whether value is boolean.
   * @param value
   * @example ObjectHelper.isBoolean(false)        = true
   * @example ObjectHelper.isBoolean(null)         = false
   * @example ObjectHelper.isBoolean(undefinend)   = false
   * @example ObjectHelper.isBoolean("test")       = false
   */
  public static isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
  }

  /**
   * Returns a string representation of an object even if value is null or undefined.
   * @param value
   * @param defaultValue
   * @example ObjectHelper.toSafeString(null)            = ""
   * @example ObjectHelper.toSafeString(undefined)       = ""
   * @example ObjectHelper.toSafeString("test")          = "test"
   * @example ObjectHelper.toSafeString(null, "--")      = "--"
   * @example ObjectHelper.toSafeString(undefined, "--") = "--"
   */
  public static toSafeString(value: any, defaultValue = ''): string {
    if (this.isNullOrUndefined(value)) {
      return defaultValue;
    } else {
      return value.toString();
    }
  }

  /**
   * get property value of object by key.
   * @param obj
   * @param key
   * @param defaultValue
   */
  public static getProperty<T, K extends keyof T>(obj: T, key: K, defaultValue?: T[K]) {
    if (ObjectHelper.isNullOrUndefined(obj)) {
      return defaultValue;
    }
    return obj[key]; // Inferred type is T[K]
  }

  /**
   * get property value of object by key1 key2.
   * @param obj
   * @param key1
   * @param key2
   * @param defaultValue
   * @returns
   */
  public static getProperty2<T, K1 extends keyof T, K2 extends keyof T[K1]>(
    obj: T,
    key1: K1,
    key2: K2,
    defaultValue?: T[K1][K2],
  ) {
    const p = this.getProperty(obj, key1);
    if (ObjectHelper.isNullOrUndefined(p)) {
      return defaultValue;
    }
    return p[key2];
  }

  public static getProperty3<
    T,
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2],
  >(obj: T, key1: K1, key2: K2, key3: K3, defaultValue?: T[K1][K2][K3]) {
    const p = this.getProperty2(obj, key1, key2);
    if (ObjectHelper.isNullOrUndefined(p)) {
      return defaultValue;
    }
    return p[key3];
  }

  /**
   * set property to object.
   * @param obj
   * @param key
   * @param value
   */
  public static setProperty<T, K extends keyof T>(obj: T, key: K, value: T[K]): void {
    obj[key] = value;
  }

  /**
   * Create object by type.
   * @param type - constructor function
   */
  public static createObject<T>(type: (new () => T) | null | undefined): T | null {
    if (this.isNullOrUndefined(type)) {
      return null;
    }
    return new type();
  }

  /**
   * get name of property.
   * @param key
   */
  public static getPropertyName<T>(key: keyof T): string {
    return key.toString();
  }

  public static values<T extends object>(obj: T): any[] {
    if (this.isNullOrUndefined(obj)) {
      return [];
    }
    return Object.keys(obj).map(key => (obj as any)[key]);
  }

  /**
   * get matching descendant property.
   * @param obj
   * @param descendantPaths
   * @example ObjectHelper.getDescendantProperty({p1: {p2 : 1}})             = {p1: {p2 : 1}}
   * @example ObjectHelper.getDescendantProperty({p1: {p2 : 1}}, "p1")       = {p2 : 1}
   * @example ObjectHelper.getDescendantProperty({p1: {p2 : 1}}, "p1", "p2") = 1
   * @example ObjectHelper.getDescendantProperty({p1: {p2 : 1}}, "p1", "p3") = undefined
   * @example ObjectHelper.getDescendantProperty(undefined)                  = undefined
   * @example ObjectHelper.getDescendantProperty(null)                       = undefined
   */
  public static getDescendantProperty(
    obj: any,
    ...descendantPaths: string[]
  ): NonNullable<any> | undefined {
    if (this.isNullOrUndefined(obj)) {
      return undefined;
    }

    if (ArrayHelper.isEmpty(descendantPaths)) {
      return obj;
    }

    let descendantProperty = obj;
    for (const descendantPath of descendantPaths) {
      descendantProperty = descendantProperty[descendantPath];
      if (ObjectHelper.isNullOrUndefined(descendantProperty)) {
        return undefined;
      }
    }
    return descendantProperty;
  }

  /**
   * If value is null or undefined, return the first non-null/undefined default value provided.
   * If all are null/undefined, return undefined.
   *
   * @param value1 First value to check
   * @param value2 Second value to check (optional)
   * @param value3 Third value to check (optional)
   * @param defaultValue Value to return if all others are null or undefined (optional)
   *
   * @example ObjectHelper.getOrDefault<number | undefined>(1, 0)         = 1
   * @example ObjectHelper.getOrDefault<number | undefined>(undefined, 0) = 0
   * @example ObjectHelper.getOrDefault<number | null>(1, 0)              = 1
   * @example ObjectHelper.getOrDefault<number | null>(null, 0)           = 0
   * @example ObjectHelper.getOrDefault<number | null>(1, 2, 3)           = 1
   * @example ObjectHelper.getOrDefault<number | null>(null, 2, 3)        = 2
   * @example ObjectHelper.getOrDefault<number | null>(null, null, 3)     = 3
   * @example ObjectHelper.getOrDefault<number | null>(null, null, null)  = undefined
   * @example ObjectHelper.getOrDefault<number | null>(null, null, null, 3)= 3
   */
  public static getOrDefault<T>(
    value1: T,
    value2?: T,
    value3?: T,
    defaultValue?: NonNullable<T>,
  ): NonNullable<T> | undefined {
    if (!ObjectHelper.isNullOrUndefined(value1)) {
      return value1 as NonNullable<T>;
    }
    if (!ObjectHelper.isNullOrUndefined(value2)) {
      return value2 as NonNullable<T>;
    }
    if (!ObjectHelper.isNullOrUndefined(value3)) {
      return value3 as NonNullable<T>;
    }
    return defaultValue;
  }

  /**
   * Indicating whether the current object has a value.
   * @param object
   * @returns true if current object is not null or undefined, else return false.
   * @example ObjectHelper.hasValue(1)           = true
   * @example ObjectHelper.hasValue("str")       = true
   * @example ObjectHelper.hasValue(undefined)   = false
   * @example ObjectHelper.hasValue(null)        = false
   */
  public static hasValue<T>(object: T): object is NonNullable<T> {
    return !this.isNullOrUndefined(object);
  }
}
