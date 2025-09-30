# 🏗️ Arquitectura Frontend Acontplus - Documento para el Equipo

## 📋 Visión General
Este documento establece la arquitectura frontend para el ecosistema Acontplus, diseñada para maximizar la reutilización, mantenibilidad y escalabilidad across múltiples aplicaciones y librerías.

## 🎯 Estrategia de Arquitectura Dual

### Para Librerías (acontplus-*)
**Flutter Architecture** - Simple, eficiente y enfocada en reutilización

### Para Aplicaciones Monolíticas Grandes  
**DDD + Clean Architecture** - Robustez, mantenibilidad y escalabilidad para negocio complejo

## 📋 Tabla de Contenidos
- [Estrategia de Arquitectura](#estrategia-de-arquitectura-dual)
- [Arquitectura para Librerías](#arquitectura-para-librerías-acontplus)
- [Arquitectura para Aplicaciones](#arquitectura-para-aplicaciones-monolíticas)
- [Core Services](#core-services)
- [Shared Utilities](#shared-utilities)
- [Relación entre Librerías y Apps](#relación-entre-librerías-y-aplicaciones)
- [Guía de Implementación](#guía-de-implementación-paso-a-paso)
- [Configuración y Uso](#configuración-y-uso)
- [Mejores Prácticas](#convenciones-y-mejores-prácticas)

## 📦 Arquitectura para Librerías (acontplus-*)

### Estructura Recomendada para el Ecosistema
```
packages/
├── core/           # Servicios base (HTTP, Config, Storage)
├── ng-components/  # Componentes UI reutilizables
├── ng-customer/    # Feature: Gestión de clientes
├── ng-notifications/ # Feature: Gestión de notificaciones
└── utils/          # Utilidades compartidas
```

### Flutter Architecture para Librerías
```
src/lib/
├── data/                 # Capa de datos
│   ├── datasources/     # HTTP, LocalStorage
│   ├── repositories/    # Implementaciones
│   └── models/          # DTOs
├── domain/              # Contratos
│   ├── repositories/    # Interfaces
│   └── models/          # Modelos
└── presentation/        # UI
    ├── services/        # Servicios con Signals
    └── components/      # Componentes
```

### Principios Fundamentales para Librerías 📋

#### 1. Separación Clara de Responsabilidades
- **Core**: Funcionalidades base compartidas (HTTP, Config, Storage)
- **Shared**: Utilidades, validadores y modelos comunes
- **Features**: Módulos de negocio específicos (implementados por las aplicaciones)

#### 2. Arquitectura por Capas Simplificada
```
Aplicación Consumer 
    ↓
Core Library (HTTP, Config, Utils)
    ↓
External APIs / Storage
```

#### 3. Inspiración en Flutter Architecture
- **Core Layer**: Servicios fundamentales y configuración
- **Shared Layer**: Utilidades y herramientas comunes
- **Clean Abstractions**: Interfaces claras y reutilizables

### Ejemplo de Implementación (Flutter Architecture)
```typescript
// customer.service.ts (Flutter Architecture)
@Injectable()
export class CustomerService {
  private _state = signal<CustomerState>(initialState);
  
  readonly customers = computed(() => this._state().customers);
  readonly loading = computed(() => this._state().loading);

  constructor(private repository: CustomerRepository) {}

  async loadCustomers(): Promise<void> {
    this.updateState({ loading: true });
    try {
      const customers = await this.repository.findAll();
      this.updateState({ customers, loading: false });
    } catch (error) {
      this.updateState({ loading: false, error: 'Failed to load' });
    }
  }
  
  private updateState(partialState: Partial<CustomerState>): void {
    this._state.update(state => ({ ...state, ...partialState }));
  }
}
```

## 🏢 Arquitectura para Aplicaciones Monolíticas

### Estructura Recomendada (DDD + Clean Architecture)
```
src/
├── app/
│   ├── core/                 # Servicios singleton
│   ├── shared/               # Recursos compartidos
│   └── features/             # Módulos de negocio
│       ├── customers/        # Bounded Context
│       │   ├── domain/       # Entidades, value objects
│       │   ├── application/  # Casos de uso, servicios
│       │   ├── infrastructure/ # Implementaciones
│       │   └── presentation/ # Components, páginas
│       └── orders/           # Otro bounded context
└── environments/             # Configuraciones
```

### DDD + Clean Architecture para Apps Complejas
```typescript
// features/orders/domain/order.entity.ts
export class Order implements AggregateRoot {
  constructor(
    public readonly id: OrderId,
    private items: OrderItem[],
    private status: OrderStatus
  ) {}

  addItem(productId: ProductId, quantity: number): void {
    // Lógica de negocio compleja
    if (this.status !== OrderStatus.PENDING) {
      throw new DomainError('Cannot add items to completed order');
    }
    // ... más validaciones de negocio
  }
}

// features/orders/application/usecases/create-order.usecase.ts
@Injectable()
export class CreateOrderUseCase {
  constructor(
    private orderRepository: OrderRepository,
    private customerRepository: CustomerRepository
  ) {}

  async execute(command: CreateOrderCommand): Promise<OrderId> {
    // Validaciones de negocio
    const customer = await this.customerRepository.findById(command.customerId);
    if (!customer) {
      throw new DomainError('Customer not found');
    }
    
    // Crear orden con lógica de dominio
    const order = Order.create(command.customerId, command.items);
    
    // Persistir
    await this.orderRepository.save(order);
    
    return order.id;
  }
}
```

### 📊 Cuándo Usar Cada Arquitectura

| Criterio | Flutter Architecture | DDD + Clean Architecture |
|----------|---------------------|--------------------------|
| **Tipo de Proyecto** | Librerías reutilizables | Apps empresariales complejas |
| **Lógica de Negocio** | Simple (CRUD) | Compleja con reglas de negocio |
| **Equipo** | 1-5 desarrolladores | 5+ desarrolladores |
| **Tiempo de Desarrollo** | Rápido | Medio (mayor inversión) |
| **Mantenibilidad** | Bueno | Excelente |
| **Testing** | Simple | Completo (mejor coverage) |

### Estructura Detallada de Acontplus-Core

```typescript
packages/core/src/lib/
├── core/                       // 🔧 Servicios fundamentales
│   ├── http/
│   │   ├── api.service.ts     // Cliente HTTP base
│   │   ├── interceptors/      // HTTP interceptors
│   │   │   ├── auth.interceptor.ts
│   │   │   ├── error.interceptor.ts
│   │   │   └── logging.interceptor.ts
│   │   └── adapters/          // Adaptadores HTTP
│   │       ├── angular-http.adapter.ts
│   │       ├── axios.adapter.ts
│   │       └── fetch.adapter.ts
│   ├── config/
│   │   ├── config.service.ts  // Configuración global
│   │   └── environment.service.ts
│   ├── storage/
│   │   ├── storage.service.ts // LocalStorage/SessionStorage
│   │   └── cache.service.ts   // Cache en memoria
│   ├── auth/
│   │   ├── jwt.service.ts     // Manejo de JWT
│   │   └── token.service.ts   // Gestión de tokens
│   └── types/                 // Tipos base
│       ├── api.types.ts
│       ├── config.types.ts
│       └── common.types.ts
│
└── shared/                     // 🤝 Utilidades compartidas
    ├── models/                // Interfaces/tipos comunes
    │   ├── base.models.ts
    │   ├── pagination.models.ts
    │   └── response.models.ts
    ├── utils/                 // Utilidades generales
    │   ├── date.formatter.ts
    │   ├── string.formatter.ts
    │   ├── number.formatter.ts
    │   └── validation.utils.ts
    ├── validators/            // Validadores compartidos
    │   ├── email.validator.ts
    │   ├── phone.validator.ts
    │   └── id.validator.ts
    ├── guards/                // Guards reutilizables
    │   ├── auth.guard.ts
    │   └── role.guard.ts
    └── pipes/                 // Pipes personalizados
        ├── date.pipe.ts
        ├── currency.pipe.ts
        └── truncate.pipe.ts
```

## Core Services 💻

### 1. HTTP Service (Cliente Base)

```typescript
// core/http/api.service.ts
@Injectable({ providedIn: 'root' })
export class ApiService {
  private http = inject(HttpClient);
  private config = inject(ConfigService);
  
  private baseUrl = signal(this.config.getApiUrl());
  
  get<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    return this.http.get<T>(`${this.baseUrl()}${endpoint}`, {
      ...this.getDefaultOptions(),
      ...options
    });
  }
  
  post<T>(endpoint: string, body: any, options?: HttpOptions): Observable<T> {
    return this.http.post<T>(`${this.baseUrl()}${endpoint}`, body, {
      ...this.getDefaultOptions(),
      ...options
    });
  }
  
  put<T>(endpoint: string, body: any, options?: HttpOptions): Observable<T> {
    return this.http.put<T>(`${this.baseUrl()}${endpoint}`, body, {
      ...this.getDefaultOptions(),
      ...options
    });
  }
  
  delete<T>(endpoint: string, options?: HttpOptions): Observable<T> {
    return this.http.delete<T>(`${this.baseUrl()}${endpoint}`, {
      ...this.getDefaultOptions(),
      ...options
    });
  }
  
  private getDefaultOptions(): any {
    return {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this.config.getToken()}`
      }
    };
  }
}

// core/http/adapters/http-adapter.interface.ts
export interface HttpAdapter {
  get<T>(url: string, options?: HttpOptions): Promise<T>;
  post<T>(url: string, body: any, options?: HttpOptions): Promise<T>;
  put<T>(url: string, body: any, options?: HttpOptions): Promise<T>;
  delete<T>(url: string, options?: HttpOptions): Promise<T>;
}

// core/http/adapters/angular-http.adapter.ts
export class AngularHttpAdapter implements HttpAdapter {
  constructor(
    private readonly http: HttpClient,
    private readonly baseURL?: string
  ) {}

  async get<T>(url: string, options?: HttpOptions): Promise<T> {
    const fullUrl = this.mergeUrl(this.baseURL, url);
    return firstValueFrom(this.http.get<T>(fullUrl, this.buildOptions(options)));
  }

  async post<T>(url: string, body: any, options?: HttpOptions): Promise<T> {
    const fullUrl = this.mergeUrl(this.baseURL, url);
    return firstValueFrom(this.http.post<T>(fullUrl, body, this.buildOptions(options)));
  }

  private buildOptions(options?: HttpOptions) {
    return {
      headers: options?.headers ?? {},
      params: options?.params ?? {}
    };
  }

  private mergeUrl(baseURL: string | undefined, endpoint: string): string {
    if (!baseURL) return endpoint;
    return `${baseURL.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`;
  }
}
```

### 2. Configuration Service

```typescript
// core/config/config.service.ts
@Injectable({ providedIn: 'root' })
export class ConfigService {
  private config = signal<AppConfig | null>(null);
  
  initialize(config: AppConfig): void {
    this.config.set(config);
    console.log('Acontplus Core initialized with config:', config);
  }
  
  getApiUrl(): string {
    return this.config()?.apiUrl ?? '';
  }
  
  getToken(): string {
    const token = this.config()?.authToken ?? localStorage.getItem('auth_token');
    return token ?? '';
  }
  
  getFeature(featureName: string): boolean {
    return this.config()?.features?.[featureName] ?? false;
  }
  
  getTheme(): string {
    return this.config()?.theme ?? 'default';
  }
  
  isProduction(): boolean {
    return this.config()?.environment === 'production';
  }
  
  isDevelopment(): boolean {
    return this.config()?.environment === 'development';
  }
}

// core/config/environment.service.ts
@Injectable({ providedIn: 'root' })
export class EnvironmentService {
  private environment = signal<Environment>('development');
  
  setEnvironment(env: Environment): void {
    this.environment.set(env);
  }
  
  isProduction(): boolean {
    return this.environment() === 'production';
  }
  
  isDevelopment(): boolean {
    return this.environment() === 'development';
  }
  
  isTesting(): boolean {
    return this.environment() === 'testing';
  }
}
```

### 3. Storage Service

```typescript
// core/storage/storage.service.ts
@Injectable({ providedIn: 'root' })
export class StorageService {
  
  // LocalStorage methods
  setItem(key: string, value: any): void {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to localStorage:', error);
    }
  }
  
  getItem<T>(key: string): T | null {
    try {
      const item = localStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from localStorage:', error);
      return null;
    }
  }
  
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }
  
  clear(): void {
    localStorage.clear();
  }
  
  // SessionStorage methods
  setSessionItem(key: string, value: any): void {
    try {
      sessionStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.error('Error saving to sessionStorage:', error);
    }
  }
  
  getSessionItem<T>(key: string): T | null {
    try {
      const item = sessionStorage.getItem(key);
      return item ? JSON.parse(item) : null;
    } catch (error) {
      console.error('Error reading from sessionStorage:', error);
      return null;
    }
  }
  
  removeSessionItem(key: string): void {
    sessionStorage.removeItem(key);
  }
  
  clearSession(): void {
    sessionStorage.clear();
  }
}

// core/storage/cache.service.ts
@Injectable({ providedIn: 'root' })
export class CacheService {
  private cache = new Map<string, CacheItem>();
  private defaultTTL = 5 * 60 * 1000; // 5 minutos

  set<T>(key: string, value: T, ttl?: number): void {
    const expiresAt = Date.now() + (ttl ?? this.defaultTTL);
    this.cache.set(key, { value, expiresAt });
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);
    
    if (!item) {
      return null;
    }
    
    if (Date.now() > item.expiresAt) {
      this.cache.delete(key);
      return null;
    }
    
    return item.value as T;
  }

  has(key: string): boolean {
    return this.get(key) !== null;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expiresAt) {
        this.cache.delete(key);
      }
    }
  }
}

interface CacheItem {
  value: any;
  expiresAt: number;
}
```

### 4. Authentication Services

```typescript
// core/auth/jwt.service.ts
@Injectable({ providedIn: 'root' })
export class JwtService {
  private storageService = inject(StorageService);
  
  private tokenKey = 'auth_token';
  private refreshTokenKey = 'refresh_token';
  
  setToken(token: string): void {
    this.storageService.setItem(this.tokenKey, token);
  }
  
  getToken(): string | null {
    return this.storageService.getItem<string>(this.tokenKey);
  }
  
  setRefreshToken(token: string): void {
    this.storageService.setItem(this.refreshTokenKey, token);
  }
  
  getRefreshToken(): string | null {
    return this.storageService.getItem<string>(this.refreshTokenKey);
  }
  
  removeTokens(): void {
    this.storageService.removeItem(this.tokenKey);
    this.storageService.removeItem(this.refreshTokenKey);
  }
  
  isTokenExpired(token?: string): boolean {
    const actualToken = token || this.getToken();
    
    if (!actualToken) {
      return true;
    }
    
    try {
      const payload = this.decodeToken(actualToken);
      const currentTime = Date.now() / 1000;
      return payload.exp < currentTime;
    } catch {
      return true;
    }
  }
  
  decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      return JSON.parse(atob(payload));
    } catch {
      throw new Error('Invalid token format');
    }
  }
  
  getTokenExpiration(token?: string): Date | null {
    const actualToken = token || this.getToken();
    
    if (!actualToken) {
      return null;
    }
    
    try {
      const payload = this.decodeToken(actualToken);
      return new Date(payload.exp * 1000);
    } catch {
      return null;
    }
  }
}

// core/auth/token.service.ts
@Injectable({ providedIn: 'root' })
export class TokenService {
  private jwtService = inject(JwtService);
  private currentToken = signal<string | null>(null);
  
  readonly hasValidToken = computed(() => {
    const token = this.currentToken();
    return token !== null && !this.jwtService.isTokenExpired(token);
  });
  
  readonly isAuthenticated = computed(() => this.hasValidToken());
  
  constructor() {
    // Initialize with stored token
    const storedToken = this.jwtService.getToken();
    if (storedToken && !this.jwtService.isTokenExpired(storedToken)) {
      this.currentToken.set(storedToken);
    }
  }
  
  setToken(token: string): void {
    this.jwtService.setToken(token);
    this.currentToken.set(token);
  }
  
  getToken(): string | null {
    return this.currentToken();
  }
  
  removeToken(): void {
    this.jwtService.removeTokens();
    this.currentToken.set(null);
  }
  
  refreshToken(): Observable<string> {
    const refreshToken = this.jwtService.getRefreshToken();
    
    if (!refreshToken) {
      return throwError(() => new Error('No refresh token available'));
    }
    
    // Implementación específica depende de tu API
    // Este es un ejemplo genérico
    return inject(HttpClient).post<{ access_token: string }>('/auth/refresh', {
      refresh_token: refreshToken
    }).pipe(
      tap(response => this.setToken(response.access_token)),
      map(response => response.access_token)
    );
  }
}
```

### 5. Core Types

```typescript
// core/types/config.types.ts
export interface AppConfig {
  apiUrl: string;
  environment: Environment;
  theme?: string;
  authToken?: string;
  features?: Record<string, boolean>;
  interceptors?: InterceptorConfig;
  cache?: CacheConfig;
}

export type Environment = 'development' | 'production' | 'testing';

export interface InterceptorConfig {
  enableAuth?: boolean;
  enableLogging?: boolean;
  enableErrorHandling?: boolean;
  enableCaching?: boolean;
}

export interface CacheConfig {
  defaultTTL?: number;
  maxSize?: number;
  enableCleanup?: boolean;
}

// core/types/api.types.ts
export interface HttpOptions {
  headers?: Record<string, string>;
  params?: Record<string, any>;
  timeout?: number;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ApiError[];
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

export interface ResponseMeta {
  timestamp: string;
  requestId?: string;
  version?: string;
  pagination?: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

// core/types/common.types.ts
export interface ValidationResult {
  isValid: boolean;
  message?: string;
  errors?: ValidationError[];
}

export interface ValidationError {
  field: string;
  message: string;
  code?: string;
}

export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}
```

## Shared Utilities 🛠️

### 1. Validation Utilities

```typescript
// shared/validators/email.validator.ts
export class EmailValidator {
  static validate(email: string): ValidationResult {
    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    return {
      isValid,
      message: isValid ? '' : 'Email no válido',
      errors: isValid ? [] : [{ field: 'email', message: 'Formato de email inválido', code: 'INVALID_EMAIL' }]
    };
  }
  
  static isValidDomain(email: string, allowedDomains: string[]): boolean {
    const domain = email.split('@')[1];
    return allowedDomains.includes(domain);
  }
}

// shared/validators/phone.validator.ts
export class PhoneValidator {
  static validate(phone: string, country: 'EC' | 'US' | 'ES' = 'EC'): ValidationResult {
    const patterns = {
      EC: /^(\+593|0)[0-9]{9}$/,
      US: /^(\+1)?[0-9]{10}$/,
      ES: /^(\+34)?[0-9]{9}$/
    };
    
    const isValid = patterns[country].test(phone);
    return {
      isValid,
      message: isValid ? '' : `Número de teléfono no válido para ${country}`,
      errors: isValid ? [] : [{ field: 'phone', message: 'Formato de teléfono inválido', code: 'INVALID_PHONE' }]
    };
  }
}

// shared/validators/id.validator.ts
export class IdValidator {
  static validateEcuadorianId(id: string): ValidationResult {
    if (!id || id.length !== 10) {
      return {
        isValid: false,
        message: 'La cédula debe tener 10 dígitos',
        errors: [{ field: 'id', message: 'Longitud inválida', code: 'INVALID_LENGTH' }]
      };
    }
    
    const digits = id.split('').map(Number);
    const province = digits[0] * 10 + digits[1];
    
    if (province < 1 || province > 24) {
      return {
        isValid: false,
        message: 'Código de provincia inválido',
        errors: [{ field: 'id', message: 'Provincia inválida', code: 'INVALID_PROVINCE' }]
      };
    }
    
    // Algoritmo del módulo 10
    let sum = 0;
    for (let i = 0; i < 9; i++) {
      let digit = digits[i];
      if (i % 2 === 0) {
        digit *= 2;
        if (digit > 9) digit -= 9;
      }
      sum += digit;
    }
    
    const checkDigit = (10 - (sum % 10)) % 10;
    const isValid = checkDigit === digits[9];
    
    return {
      isValid,
      message: isValid ? '' : 'Número de cédula inválido',
      errors: isValid ? [] : [{ field: 'id', message: 'Dígito verificador incorrecto', code: 'INVALID_CHECK_DIGIT' }]
    };
  }
  
  static validateRuc(ruc: string): ValidationResult {
    if (!ruc || (ruc.length !== 13 && ruc.length !== 10)) {
      return {
        isValid: false,
        message: 'RUC debe tener 10 o 13 dígitos',
        errors: [{ field: 'ruc', message: 'Longitud inválida', code: 'INVALID_LENGTH' }]
      };
    }
    
    // Para personas naturales (10 dígitos)
    if (ruc.length === 10) {
      return this.validateEcuadorianId(ruc);
    }
    
    // Para empresas (13 dígitos)
    const baseId = ruc.substring(0, 10);
    const suffix = ruc.substring(10);
    
    const baseValidation = this.validateEcuadorianId(baseId);
    if (!baseValidation.isValid) {
      return baseValidation;
    }
    
    const isValid = suffix === '001';
    return {
      isValid,
      message: isValid ? '' : 'RUC empresarial debe terminar en 001',
      errors: isValid ? [] : [{ field: 'ruc', message: 'Sufijo inválido', code: 'INVALID_SUFFIX' }]
    };
  }
}
```

### 2. Utility Functions

```typescript
// shared/utils/date.formatter.ts
export class DateFormatter {
  static formatDate(date: Date | string, format: 'short' | 'long' | 'iso' = 'short'): string {
    const d = typeof date === 'string' ? new Date(date) : date;
    
    switch (format) {
      case 'short':
        return d.toLocaleDateString('es-EC');
      case 'long':
        return d.toLocaleDateString('es-EC', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        });
      case 'iso':
        return d.toISOString().split('T')[0];
      default:
        return d.toLocaleDateString();
    }
  }
  
  static addDays(date: Date, days: number): Date {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
  }
  
  static diffInDays(date1: Date, date2: Date): number {
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  }
  
  static isWeekend(date: Date): boolean {
    const day = date.getDay();
    return day === 0 || day === 6; // 0 = Sunday, 6 = Saturday
  }
  
  static getAge(birthDate: Date): number {
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }
}

// shared/utils/string.formatter.ts
export class StringFormatter {
  static capitalize(str: string): string {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  }
  
  static capitalizeWords(str: string): string {
    return str.split(' ').map(word => this.capitalize(word)).join(' ');
  }
  
  static slugify(str: string): string {
    return str
      .toLowerCase()
      .trim()
      .replace(/[^\w\s-]/g, '')
      .replace(/[\s_-]+/g, '-')
      .replace(/^-+|-+$/g, '');
  }
  
  static truncate(str: string, length: number, suffix: string = '...'): string {
    if (str.length <= length) return str;
    return str.substring(0, length - suffix.length) + suffix;
  }
  
  static removeAccents(str: string): string {
    return str.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }
  
  static generateRandomString(length: number): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }
  
  static isNullOrWhitespace(str: string | null | undefined): boolean {
    return !str || str.trim().length === 0;
  }
}

// shared/utils/number.formatter.ts
export class NumberFormatter {
  static formatCurrency(amount: number, currency: 'USD' | 'EUR' = 'USD'): string {
    return new Intl.NumberFormat('es-EC', {
      style: 'currency',
      currency: currency
    }).format(amount);
  }
  
  static formatPercentage(value: number, decimals: number = 2): string {
    return `${(value * 100).toFixed(decimals)}%`;
  }
  
  static roundToDecimals(num: number, decimals: number): number {
    return Math.round(num * Math.pow(10, decimals)) / Math.pow(10, decimals);
  }
  
  static isInteger(value: any): boolean {
    return Number.isInteger(Number(value));
  }
  
  static isSafeInteger(value: any): boolean {
    return Number.isSafeInteger(Number(value));
  }
  
  static toFixed(num: number, decimals: number, fallback: string = 'N/A'): string {
    const numValue = Number(num);
    return isNaN(numValue) ? fallback : numValue.toFixed(decimals);
  }
  
  static compare(a: number, b: number, tolerance: number = 0.0001): number {
    const diff = a - b;
    if (Math.abs(diff) < tolerance) return 0;
    return diff > 0 ? 1 : -1;
  }
  
  static clamp(value: number, min: number, max: number): number {
    return Math.min(Math.max(value, min), max);
  }
}

// shared/utils/validation.utils.ts
export class ValidationUtils {
  static combineValidations(...validations: ValidationResult[]): ValidationResult {
    const allErrors = validations.flatMap(v => v.errors || []);
    const isValid = validations.every(v => v.isValid);
    
    return {
      isValid,
      message: isValid ? '' : 'Uno o más campos contienen errores',
      errors: allErrors
    };
  }
  
  static validateRequired(value: any, fieldName: string): ValidationResult {
    const isValid = value !== null && value !== undefined && 
                   (typeof value !== 'string' || value.trim() !== '');
    
    return {
      isValid,
      message: isValid ? '' : `${fieldName} es requerido`,
      errors: isValid ? [] : [{ 
        field: fieldName.toLowerCase(), 
        message: 'Campo requerido', 
        code: 'REQUIRED' 
      }]
    };
  }
  
  static validateMinLength(value: string, minLength: number, fieldName: string): ValidationResult {
    const isValid = value && value.length >= minLength;
    
    return {
      isValid,
      message: isValid ? '' : `${fieldName} debe tener al menos ${minLength} caracteres`,
      errors: isValid ? [] : [{ 
        field: fieldName.toLowerCase(), 
        message: `Mínimo ${minLength} caracteres`, 
        code: 'MIN_LENGTH' 
      }]
    };
  }
  
  static validateMaxLength(value: string, maxLength: number, fieldName: string): ValidationResult {
    const isValid = !value || value.length <= maxLength;
    
    return {
      isValid,
      message: isValid ? '' : `${fieldName} no puede tener más de ${maxLength} caracteres`,
      errors: isValid ? [] : [{ 
        field: fieldName.toLowerCase(), 
        message: `Máximo ${maxLength} caracteres`, 
        code: 'MAX_LENGTH' 
      }]
    };
  }
  
  static validatePattern(value: string, pattern: RegExp, fieldName: string, errorMessage: string): ValidationResult {
    const isValid = !value || pattern.test(value);
    
    return {
      isValid,
      message: isValid ? '' : errorMessage,
      errors: isValid ? [] : [{ 
        field: fieldName.toLowerCase(), 
        message: errorMessage, 
        code: 'PATTERN' 
      }]
    };
  }
}
```

### 3. Guards and Pipes

```typescript
// shared/guards/auth.guard.ts
@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
  private tokenService = inject(TokenService);
  private router = inject(Router);
  
  canActivate(): boolean {
    if (this.tokenService.isAuthenticated()) {
      return true;
    }
    
    this.router.navigate(['/login']);
    return false;
  }
}

// shared/guards/role.guard.ts
@Injectable({ providedIn: 'root' })
export class RoleGuard implements CanActivate {
  private tokenService = inject(TokenService);
  private router = inject(Router);
  
  canActivate(route: ActivatedRouteSnapshot): boolean {
    const requiredRoles = route.data['roles'] as string[];
    
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    
    const token = this.tokenService.getToken();
    if (!token) {
      this.router.navigate(['/login']);
      return false;
    }
    
    try {
      const payload = inject(JwtService).decodeToken(token);
      const userRoles = payload.roles || [];
      
      const hasRole = requiredRoles.some(role => userRoles.includes(role));
      
      if (!hasRole) {
        this.router.navigate(['/unauthorized']);
        return false;
      }
      
      return true;
    } catch {
      this.router.navigate(['/login']);
      return false;
    }
  }
}

// shared/pipes/date.pipe.ts
@Pipe({ name: 'acpDate', standalone: true })
export class AcpDatePipe implements PipeTransform {
  transform(value: Date | string | null, format: 'short' | 'long' | 'iso' = 'short'): string {
    if (!value) return '';
    return DateFormatter.formatDate(value, format);
  }
}

// shared/pipes/currency.pipe.ts
@Pipe({ name: 'acpCurrency', standalone: true })
export class AcpCurrencyPipe implements PipeTransform {
  transform(value: number | null, currency: 'USD' | 'EUR' = 'USD'): string {
    if (value === null || value === undefined) return '';
    return NumberFormatter.formatCurrency(value, currency);
  }
}

// shared/pipes/truncate.pipe.ts
@Pipe({ name: 'acpTruncate', standalone: true })
export class AcpTruncatePipe implements PipeTransform {
  transform(value: string | null, length: number = 50, suffix: string = '...'): string {
    if (!value) return '';
    return StringFormatter.truncate(value, length, suffix);
  }
}
```

### 4. Shared Models

```typescript
// shared/models/base.models.ts
export interface BaseEntity {
  id: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuditableEntity extends BaseEntity {
  createdBy?: string;
  updatedBy?: string;
  version: number;
}

// shared/models/pagination.models.ts
export interface PaginatedResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface PaginationMeta {
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

// shared/models/response.models.ts
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: ApiError[];
  meta?: ResponseMeta;
}

export interface ApiError {
  code: string;
  message: string;
  field?: string;
  details?: any;
}

export interface ResponseMeta {
  timestamp: string;
  requestId?: string;
  version?: string;
  pagination?: PaginationMeta;
}
```

## Flutter Architecture vs DDD 🤔

### Por qué DDD NO es adecuado aquí:

#### 1. DDD está diseñado para:
- **Lógica de negocio compleja** → Tu librería es principalmente para acceso a datos
- **Múltiples bounded contexts** → Tienes features simples, no dominios complejos
- **Reglas de negocio invariantes** → Tu lógica es principalmente CRUD y presentación
- **Eventos de dominio** → No necesitas rastrear cambios de estado complejos

#### 2. Overhead innecesario:
```typescript
// ❌ DDD: Excesivamente complejo para una librería frontend
class Customer extends AggregateRoot<CustomerId> {
  private constructor(id: CustomerId, businessInfo: BusinessInfo) {
    super(id);
    // ¿Para qué? Solo necesitas mostrar/enviar datos
  }
  
  public updateContact(newContact: ContactInfo): void {
    // Validaciones complejas
    // Domain events
    // Aggregate invariants
    // ¿Realmente necesario para mostrar una lista?
  }
}

// ✅ Tu caso real: Mucho más simple y directo
interface Customer {
  id: string;
  businessName: string;
  email: string;
  // Datos simples, sin lógica compleja
}
```

### Flutter Architecture: Mucho Más Apropiada ✅

La arquitectura de Flutter es **perfecta** para tu caso porque:

#### 1. Separación de Capas Clara y Práctica
- **Data Layer**: Manejo de APIs y transformación de datos
- **Domain Layer**: Modelos y casos de uso simples
- **Presentation Layer**: Estado reactivo para UI

#### 2. Más Simple y Directo
- ✅ **Menos boilerplate** - No necesitas aggregates, value objects complejos
- ✅ **Más rápido de implementar** - Menos abstracciones innecesarias
- ✅ **Más fácil de entender** - Flujo de datos claro

#### 3. Mejor para Frontend
- ✅ **Enfocado en presentación** - Perfecto para librerías de UI/data
- ✅ **Estado reactivo** - Se integra natural con Angular Signals
- ✅ **Testing más simple** - Menos complejidad = tests más fáciles

#### 4. Escalable sin Overhead
- ✅ **Fácil agregar features** - Cada feature es independiente
- ✅ **Reutilización real** - Use cases pueden compartirse
- ✅ **Separación clara** - Data, Domain, Presentation bien definidas

## Configuración y Uso 📦

### 1. Public API (Exportaciones)

```typescript
// packages/core/src/public-api.ts

// Core
export * from './lib/core/http/api.service';
export * from './lib/core/config/config.service';
export * from './lib/core/types/common.types';

// Shared
export * from './lib/shared/models/base.models';
export * from './lib/shared/validators/customer.validator';
export * from './lib/shared/utils/error.handler';

// Features - Customers
export * from './lib/features/customers/domain/models/customer.model';
export * from './lib/features/customers/domain/usecases/get-customers.usecase';
export * from './lib/features/customers/domain/usecases/create-customer.usecase';
export * from './lib/features/customers/presentation/services/customer.service';

// Core exports (no module needed for library)
export * from './lib/adapters';
export * from './lib/constants';
export * from './lib/environments';
export * from './lib/models';
export * from './lib/ports';
export * from './lib/pricing';
export * from './lib/types';
export * from './lib/value-objects';
```

### 2. Módulo Principal

```typescript
// packages/core/src/lib/core.module.ts
@NgModule({
  imports: [
    CommonModule,
    HttpClientModule
  ],
  providers: [
    // Core services
    ApiService,
    ConfigService,
    
    // Customer feature
    CustomerHttpDataSource,
    CustomerMapper,
    {
      provide: CustomerRepository,
      useClass: CustomerHttpRepository
    },
    GetCustomersUseCase,
    CreateCustomerUseCase,
    UpdateCustomerUseCase,
    DeleteCustomerUseCase,
    CustomerService
  ]
})
export class AcontplusCoreModule {
  static forRoot(config: AppConfig): ModuleWithProviders<AcontplusCoreModule> {
    return {
      ngModule: AcontplusCoreModule,
      providers: [
        { provide: 'APP_CONFIG', useValue: config }
      ]
    };
  }
}
```

### 3. Uso en Aplicaciones

```typescript
// En la app que consume la librería
// main.ts
import { bootstrapApplication } from '@angular/platform-browser';
import { provideHttpClient } from '@angular/common/http';
import { ConfigService } from 'acontplus-core';

bootstrapApplication(AppComponent, {
  providers: [
    provideHttpClient(),
    // Otros providers
  ]
}).then(() => {
  // Configurar la librería
  const configService = inject(ConfigService);
  configService.initialize({
    apiUrl: 'https://api.miapp.com',
    theme: 'default'
  });
});

// En un componente standalone
@Component({
  selector: 'app-customer-list',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatButtonModule],
  template: `
    <div class="customer-list">
      @if (customerService.loading()) {
        <div>Cargando...</div>
      }
      
      @if (customerService.error()) {
        <div class="error">{{ customerService.error() }}</div>
      }
      
      @if (customerService.hasCustomers()) {
        <table mat-table [dataSource]="customerService.customers()">
          <ng-container matColumnDef="businessName">
            <th mat-header-cell *matHeaderCellDef>Nombre</th>
            <td mat-cell *matCellDef="let customer">{{ customer.businessName }}</td>
          </ng-container>
          
          <ng-container matColumnDef="email">
            <th mat-header-cell *matHeaderCellDef>Email</th>
            <td mat-cell *matCellDef="let customer">{{ customer.email }}</td>
          </ng-container>
          
          <ng-container matColumnDef="actions">
            <th mat-header-cell *matHeaderCellDef>Acciones</th>
            <td mat-cell *matCellDef="let customer">
              <button mat-button (click)="editCustomer(customer)">Editar</button>
              <button mat-button color="warn" (click)="deleteCustomer(customer)">Eliminar</button>
            </td>
          </ng-container>
          
          <tr mat-header-row *matHeaderRowDef="displayedColumns"></tr>
          <tr mat-row *matRowDef="let row; columns: displayedColumns;"></tr>
        </table>
      } @else {
        <div>No hay clientes</div>
      }
      
      <button mat-raised-button color="primary" (click)="createCustomer()">
        Nuevo Cliente
      </button>
      
      <div class="summary">
        Total: {{ customerService.customersCount() }} | 
        Activos: {{ customerService.activeCustomers().length }}
      </div>
    </div>
  `
})
export class CustomerListComponent implements OnInit {
  customerService = inject(CustomerService);
  
  displayedColumns = ['businessName', 'email', 'actions'];
  
  ngOnInit(): void {
    this.customerService.loadCustomers();
  }
  
  async createCustomer(): Promise<void> {
    try {
      await this.customerService.createCustomer({
        identificationNumber: '1234567890',
        businessName: 'Nuevo Cliente',
        tradeName: 'Cliente',
        email: 'nuevo@cliente.com',
        phone: '123456789',
        address: {
          street: 'Calle 123',
          city: 'Ciudad',
          state: 'Estado',
          zipCode: '12345',
          country: 'País'
        }
      });
    } catch (error) {
      console.error('Error creating customer:', error);
    }
  }
  
  editCustomer(customer: Customer): void {
    this.customerService.selectCustomer(customer);
    // Navegar a formulario de edición
  }
  
  async deleteCustomer(customer: Customer): Promise<void> {
    if (confirm(`¿Eliminar cliente ${customer.businessName}?`)) {
      try {
        await this.customerService.deleteCustomer(customer.id);
      } catch (error) {
        console.error('Error deleting customer:', error);
      }
    }
  }
}
```

## 🔄 Relación entre Librerías y Aplicaciones

### Consumo de Librerías en Aplicaciones
```typescript
// app.module.ts
@NgModule({
  imports: [
    // Librerías base
    AcontplusCoreModule.forRoot(config),
    AcontplusUiComponentsModule,
    
    // Librerías feature
    CustomerDataModule,
    CustomerPresentationModule,
    InventoryDataModule
  ]
})
export class AppModule { }
```

### Dependencias entre Paquetes
```json
{
  "dependencies": {
    "acontplus-core": "^1.0.0",
    "acontplus-ui-components": "^1.0.0",
    "acontplus-customers": "^1.0.0"
  }
}
```

### Estructura del Workspace Completo
```
acontplus-libs/
├── packages/
│   ├── core/                       # Base library
│   ├── ng-components/              # UI components
│   ├── ng-customer/                # Customer feature
│   ├── ng-notifications/           # Notifications feature
│   ├── ng-core/                    # Angular core services
│   ├── ui-kit/                     # Additional UI components
│   └── utils/                      # Shared utilities
├── apps/
│   ├── demo-app/                   # Demo application
│   ├── demo-app-e2e/               # E2E tests
│   └── erp-app/                    # Main ERP application (future)
└── dist/                           # Built libraries
```

## 🚀 Guía de Implementación Paso a Paso

### Fase 1: Setup Inicial (Semana 1)

#### 1. Configurar Monorepo
```bash
npx create-nx-workspace@latest acontplus-libs --preset=angular-monorepo
cd acontplus-libs
npx nx g @nx/angular:library core --directory=packages
npx nx g @nx/angular:library ng-components --directory=packages
npx nx g @nx/angular:application demo-app --directory=apps
```

#### 2. Implementar core
- ✅ Servicio HTTP base
- ✅ Gestión de configuración  
- ✅ Servicios de almacenamiento
- ✅ Autenticación y autorización

#### 3. Crear Componentes UI Base
- ✅ Botones, inputs, tablas
- ✅ Modals, cards, forms
- ✅ Layout components

### Fase 2: Primera Feature (Semana 2-3)

#### 1. Crear Librería Feature
```bash
ng generate library acontplus-customers
```

#### 2. Implementar Arquitectura
```typescript
// Estructura Flutter Architecture
packages/ng-customer/
└── src/lib/
    ├── data/
    ├── domain/
    └── presentation/
```

#### 3. Crear Demo App
```bash
ng generate application demo-app
```

### Fase 3: Expansión (Semana 4+)

#### 1. Nuevas Features
```bash
ng generate library acontplus-inventory
ng generate library acontplus-orders
```

#### 2. Aplicación Monolítica
- ✅ Implementar DDD + Clean Architecture
- ✅ Crear bounded contexts
- ✅ Desarrollar casos de uso complejos

## 🔧 Convenciones y Mejores Prácticas

### Estructura de Código
- **Prefijos**: Usar `acp-` para componentes (`acp-table`, `acp-button`)
- **Signals**: Preferir sobre Observables para estado local
- **Inyección**: Usar `inject()` en componentes standalone

### Testing
```typescript
// Ejemplo de test para servicio
describe('CustomerService', () => {
  let service: CustomerService;
  let mockRepository: jest.Mocked<CustomerRepository>;
  
  beforeEach(() => {
    mockRepository = {
      findAll: jest.fn(),
      findById: jest.fn()
    } as any;
    
    service = new CustomerService(mockRepository);
  });
  
  it('should load customers', async () => {
    const mockCustomers = [{ id: '1', name: 'Test' }];
    mockRepository.findAll.mockResolvedValue(mockCustomers);
    
    await service.loadCustomers();
    
    expect(service.customers()).toEqual(mockCustomers);
    expect(service.loading()).toBe(false);
  });
});
```

### Versionamiento Semántico
```json
{
  "acontplus-core": "1.2.0",
  "acontplus-ui-components": "1.1.5", 
  "acontplus-customers": "2.0.1"
}
```

### Naming Conventions
- **Services**: `CustomerService`, `OrderService`
- **Components**: `AcpTableComponent`, `AcpButtonComponent`
- **Models**: `Customer`, `CustomerDto`, `CreateCustomerRequest`
- **Repositories**: `CustomerRepository`, `CustomerHttpRepository`
- **Use Cases**: `GetCustomersUseCase`, `CreateCustomerUseCase`

### Code Organization
```typescript
// ✅ Correcto - Imports organizados
import { Injectable, computed, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';

import { Customer, CustomerFilters } from '../models';
import { CustomerRepository } from '../repositories';

// ✅ Correcto - Service con Signals
@Injectable({ providedIn: 'root' })
export class CustomerService {
  private _state = signal<CustomerState>(initialState);
  
  // Readonly computed properties
  readonly customers = computed(() => this._state().customers);
  readonly loading = computed(() => this._state().loading);
  readonly error = computed(() => this._state().error);
}
```

### Error Handling
```typescript
// shared/utils/error-handler.utils.ts
export class ErrorHandler {
  static handleApiError(error: any): string {
    if (error.status === 400) {
      return 'Datos inválidos. Por favor verifique la información.';
    }
    
    if (error.status === 401) {
      return 'No autorizado. Por favor inicie sesión.';
    }
    
    if (error.status === 403) {
      return 'No tiene permisos para realizar esta acción.';
    }
    
    if (error.status === 404) {
      return 'Recurso no encontrado.';
    }
    
    if (error.status === 409) {
      return 'El recurso ya existe o hay un conflicto.';
    }
    
    if (error.status >= 500) {
      return 'Error del servidor. Por favor intente más tarde.';
    }
    
    return error.message || 'Error desconocido';
  }
}
```

### Configuration Management
```typescript
// Configuración por ambiente
export interface AcontplusConfig {
  apiUrl: string;
  apiVersion: string;
  enableLogging: boolean;
  features: {
    customers: boolean;
    inventory: boolean;
    orders: boolean;
  };
}

// Usar en app.module.ts
AcontplusCoreModule.forRoot({
  apiUrl: environment.apiUrl,
  apiVersion: 'v1',
  enableLogging: !environment.production,
  features: {
    customers: true,
    inventory: true,
    orders: false
  }
})
```

## Beneficios 💡

### 1. Escalabilidad
- ✅ **Fácil agregar nuevos features** sin afectar existentes
- ✅ **Arquitectura modular** cada feature es independiente
- ✅ **Reutilización de código** entre diferentes aplicaciones

### 2. Mantenibilidad
- ✅ **Separación clara de responsabilidades** cada capa tiene su propósito
- ✅ **Código organizado y predecible** estructura consistente
- ✅ **Testing más fácil** por la separación y dependencias claras

### 3. Desarrollo
- ✅ **Developer experience mejorada** flujo de desarrollo claro
- ✅ **Autocompletado y tipos fuertes** TypeScript en toda la librería
- ✅ **Patrones Angular modernos** Signals, standalone components

### 4. Performance
- ✅ **Bundle size optimizado** sin código innecesario de DDD
- ✅ **Reactive updates** automáticos con Signals
- ✅ **Lazy loading** de features cuando sea necesario

### 5. Reutilización
- ✅ **Una librería, múltiples aplicaciones** configuración flexible
- ✅ **API consistente** mismos patrones en todos los features
- ✅ **Configuración por aplicación** adaptable a diferentes necesidades

## Conclusión ✨

Esta arquitectura inspirada en Flutter te permitirá crear una librería robusta, escalable y fácil de mantener sin la complejidad innecesaria de DDD. Es perfecta para librerías frontend que necesitan:

- **Gestión de estado reactivo** con Angular Signals
- **Acceso a datos** mediante APIs REST
- **Separación clara** entre capas sin over-engineering
- **Reutilización** en múltiples aplicaciones Angular

La clave está en mantener la simplicidad mientras se respetan los principios de arquitectura limpia adaptados al contexto frontend.
