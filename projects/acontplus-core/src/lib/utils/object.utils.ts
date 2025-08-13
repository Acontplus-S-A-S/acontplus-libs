import {ArrayUtils} from "./array.utils";

export class ObjectUtils {
  /**
   * check whether value is null.
   * @param value
   * @example ObjectUtils.isNull(null)        = true
   * @example ObjectUtils.isNull(undefinend)  = false
   * @example ObjectUtils.isNull({})          = false
   * @example ObjectUtils.isNull(1)           = false
   */
  public static isNull(value: unknown): value is null {
    return value === null;
  }

  /**
   * check whether value is undefined.
   * @param value
   * @example ObjectUtils.isUndefined(undefinend)  = true
   * @example ObjectUtils.isUndefined(null)        = false
   * @example ObjectUtils.isUndefined({})          = false
   * @example ObjectUtils.isUndefined(1)           = false
   */
  public static isUndefined(value: unknown): value is undefined {
    return typeof value === 'undefined';
  }

  /**
   * check whether value is null or undefined.
   * @param value
   * @example ObjectUtils.isNullOrUndefined(undefinend)  = true
   * @example ObjectUtils.isNullOrUndefined(null)        = true
   * @example ObjectUtils.isNullOrUndefined({})          = false
   * @example ObjectUtils.isNullOrUndefined(1)           = false
   */
  public static isNullOrUndefined(value: unknown): value is null | undefined {
    return this.isNull(value) || this.isUndefined(value);
  }

  /**
   * check whether value is array.
   * @param value
   * @example ObjectUtils.isArray([])           = true
   * @example ObjectUtils.isArray(null)         = false
   * @example ObjectUtils.isArray(undefinend)   = false
   * @example ObjectUtils.isArray(1)            = false
   */
  public static isArray(value: unknown): value is any[] {
    return Array.isArray(value);
  }

  /**
   * check whether value is date.
   * @param value
   * @example ObjectUtils.isDate(new Date())   = true
   * @example ObjectUtils.isDate(null)         = false
   * @example ObjectUtils.isDate(undefinend)   = false
   * @example ObjectUtils.isDate(1)            = false
   */
  public static isDate(value: unknown): value is Date {
    return value instanceof Date;
  }

  /**
   * check whether value is string.
   * @param value
   * @example ObjectUtils.isString("test")       = true
   * @example ObjectUtils.isString(null)         = false
   * @example ObjectUtils.isString(undefinend)   = false
   * @example ObjectUtils.isString(1)            = false
   */
  public static isString(value: unknown): value is string {
    return typeof value === 'string';
  }

  /**
   * check whether value is number.
   * @param value
   * @example ObjectUtils.isNumber(1)            = true
   * @example ObjectUtils.isNumber(null)         = false
   * @example ObjectUtils.isNumber(undefinend)   = false
   * @example ObjectUtils.isNumber("test")       = false
   */
  public static isNumber(value: unknown): value is number {
    return typeof value === 'number';
  }

  /**
   * check whether value is boolean.
   * @param value
   * @example ObjectUtils.isBoolean(false)        = true
   * @example ObjectUtils.isBoolean(null)         = false
   * @example ObjectUtils.isBoolean(undefinend)   = false
   * @example ObjectUtils.isBoolean("test")       = false
   */
  public static isBoolean(value: unknown): value is boolean {
    return typeof value === 'boolean';
  }

  /**
   * Returns a string representation of an object even if value is null or undefined.
   * @param value
   * @param defaultValue
   * @example ObjectUtils.toSafeString(null)            = ""
   * @example ObjectUtils.toSafeString(undefined)       = ""
   * @example ObjectUtils.toSafeString("test")          = "test"
   * @example ObjectUtils.toSafeString(null, "--")      = "--"
   * @example ObjectUtils.toSafeString(undefined, "--") = "--"
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
  public static getProperty<T, K extends keyof T>(
    obj: T,
    key: K,
    defaultValue?: T[K]
  ) {
    if (ObjectUtils.isNullOrUndefined(obj)) {
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
    defaultValue?: T[K1][K2]
  ) {
    const p = this.getProperty(obj, key1);
    if (ObjectUtils.isNullOrUndefined(p)) {
      return defaultValue;
    }
    return p[key2];
  }

  public static getProperty3<
    T,
    K1 extends keyof T,
    K2 extends keyof T[K1],
    K3 extends keyof T[K1][K2]
  >(obj: T, key1: K1, key2: K2, key3: K3, defaultValue?: T[K1][K2][K3]) {
    const p = this.getProperty2(obj, key1, key2);
    if (ObjectUtils.isNullOrUndefined(p)) {
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
    return Object.keys(obj).map((key) => (obj as any)[key]);
  }


  /**
   * get matching descendant property.
   * @param obj
   * @param descendantPaths
   * @example ObjectUtils.getDescendantProperty({p1: {p2 : 1}})             = {p1: {p2 : 1}}
   * @example ObjectUtils.getDescendantProperty({p1: {p2 : 1}}, "p1")       = {p2 : 1}
   * @example ObjectUtils.getDescendantProperty({p1: {p2 : 1}}, "p1", "p2") = 1
   * @example ObjectUtils.getDescendantProperty({p1: {p2 : 1}}, "p1", "p3") = undefined
   * @example ObjectUtils.getDescendantProperty(undefined)                  = undefined
   * @example ObjectUtils.getDescendantProperty(null)                       = undefined
   */
  public static getDescendantProperty(obj: any, ...descendantPaths: string[]): NonNullable<any> | undefined {
    if (this.isNullOrUndefined(obj)) {
      return undefined;
    }

    if (ArrayUtils.isEmpty(descendantPaths)) {
      return obj;
    }

    let descendantProperty = obj;
    for (const descendantPath of descendantPaths) {
      descendantProperty = descendantProperty[descendantPath];
      if (ObjectUtils.isNullOrUndefined(descendantProperty)) {
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
   * @example ObjectUtils.getOrDefault<number | undefined>(1, 0)         = 1
   * @example ObjectUtils.getOrDefault<number | undefined>(undefined, 0) = 0
   * @example ObjectUtils.getOrDefault<number | null>(1, 0)              = 1
   * @example ObjectUtils.getOrDefault<number | null>(null, 0)           = 0
   * @example ObjectUtils.getOrDefault<number | null>(1, 2, 3)           = 1
   * @example ObjectUtils.getOrDefault<number | null>(null, 2, 3)        = 2
   * @example ObjectUtils.getOrDefault<number | null>(null, null, 3)     = 3
   * @example ObjectUtils.getOrDefault<number | null>(null, null, null)  = undefined
   * @example ObjectUtils.getOrDefault<number | null>(null, null, null, 3)= 3
   */
  public static getOrDefault<T>(
    value1: T,
    value2?: T,
    value3?: T,
    defaultValue?: NonNullable<T>
  ): NonNullable<T> | undefined {
    if (!ObjectUtils.isNullOrUndefined(value1)) {
      return value1 as NonNullable<T>;
    }
    if (!ObjectUtils.isNullOrUndefined(value2)) {
      return value2 as NonNullable<T>;
    }
    if (!ObjectUtils.isNullOrUndefined(value3)) {
      return value3 as NonNullable<T>;
    }
    return defaultValue;
  }

  /**
   * Indicating whether the current object has a value.
   * @param object
   * @returns true if current object is not null or undefined, else return false.
   * @example ObjectUtils.hasValue(1)           = true
   * @example ObjectUtils.hasValue("str")       = true
   * @example ObjectUtils.hasValue(undefined)   = false
   * @example ObjectUtils.hasValue(null)        = false
   */
  public static hasValue<T>(object: T): object is NonNullable<T> {
    return !this.isNullOrUndefined(object);
  }
}
