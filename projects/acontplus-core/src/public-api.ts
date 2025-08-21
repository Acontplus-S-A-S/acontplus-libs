export * from './lib/environments';
export * from './lib/interceptors';
export * from './lib/models';
export * from './lib/repositories';
export * from './lib/services';
export * from './lib/use-cases';
export * from './lib/utils';

// Domain exports
//export * from './lib/domain/entities/BaseEntity';
export * from './lib/domain/value-objects/base.value-object';
export * from './lib/domain/value-objects/entity-id';

// Application exports
export * from './lib/application/interfaces/repository';
export * from './lib/application/interfaces/http.port';
//export * from './lib/application/use-cases/BaseUseCase';

// Infrastructure exports
export * from './lib/infrastructure/adapters/fetch.adapter';
export * from './lib/infrastructure/adapters/angular-http.adapter';
//export * from './lib/infrastructure/persistence/InMemoryRepository';

// Domain exports
export * from './customers/domain/repositories/CustomerRepository';

// Application exports
export * from './customers/application/use-cases/get-all-customer.use-case';

// Infrastructure exports
export * from './customers/infrastructure/repositoriess/http-customer.repository';

// Module export
export * from './customers/CustomerModule';
