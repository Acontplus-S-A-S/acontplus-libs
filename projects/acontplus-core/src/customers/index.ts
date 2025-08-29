// Domain exports
import { CustomerExternalHttpRepository } from './infrastructure/repositories/customer-external-http.repository';

export * from './application';
import { ClientHttpRepository } from './infrastructure/repositories/client-http.repository';
import { ClientUseCase } from './application/use-cases/client.use-case';
import { CustomerExternalUseCase } from './application/use-cases/customer-external.use-case';

// Opcional: exportar repo por si necesitas llamadas directas
const clientRepo = new ClientHttpRepository();
const customerExernalRepo = new CustomerExternalHttpRepository();

// 2️⃣ Casos de uso listos
export const clientUseCase = new ClientUseCase(clientRepo);
export const customerExternalUseCase = new CustomerExternalUseCase(customerExernalRepo);
