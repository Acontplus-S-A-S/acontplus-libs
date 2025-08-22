// Domain exports
import {HttpCustomerRepository} from "./infrastructure/repositoriess/http-customer.repository";
import {CustomerUseCase} from "./application/use-cases/customer.use-case";

// Opcional: exportar repo por si necesitas llamadas directas
const customerRepo = new HttpCustomerRepository();

// 2️⃣ Casos de uso listos
export const customerUseCase = new CustomerUseCase(customerRepo);

