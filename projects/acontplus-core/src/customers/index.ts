// Domain exports
import {HttpCustomerRepository} from "./infrastructure/repositoriess/http-customer.repository";
import {GetAllCustomerUseCase} from "./application/use-cases/get-all-customer.use-case";

export * from './domain/repositories/customer.repository';

// Application exports
export * from './application/use-cases/get-all-customer.use-case';

// Infrastructure exports
export * from './infrastructure/repositoriess/http-customer.repository';


// Opcional: exportar repo por si necesitas llamadas directas
const customerRepo = new HttpCustomerRepository();

// 2️⃣ Casos de uso listos
export const getAllCustomerUseCase = new GetAllCustomerUseCase(customerRepo);

