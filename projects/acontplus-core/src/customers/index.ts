// Domain exports
import { CustomerExternalHttpRepository } from './infrastructure/repositories/customer-external-http.repository';

export * from './application/dtos/customer.dto';
import { CustomerHttpRepository } from './infrastructure/repositories/customer-http.repository';
import { CustomerUseCase } from './application/use-cases/customer.use-case';
import { CustomerExternalUseCase } from './application/use-cases/customer-external.use-case';

// Opcional: exportar repo por si necesitas llamadas directas
const customerRepo = new CustomerHttpRepository();
const customerExernalRepo = new CustomerExternalHttpRepository();

// 2️⃣ Casos de uso listos
export const customerUseCase = new CustomerUseCase(customerRepo);
export const customerExternalUseCase = new CustomerExternalUseCase(customerExernalRepo);
