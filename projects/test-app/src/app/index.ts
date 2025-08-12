// Main application exports following Domain-Driven Design (DDD) principles

// Domain Layer - Core business logic and entities
export * from './domain';

// Application Layer - Use cases, commands, queries
export * from './application';

// Data Layer - Repositories and data access
export * from './data';

// Providers Layer - Services, interceptors, and providers
export * from './providers';

// UI Layer - Components and pages
export * from './ui';

// Constants Layer - Application constants
export * from './constants';

// Shared Layer - Cross-cutting concerns
export * from './shared';
