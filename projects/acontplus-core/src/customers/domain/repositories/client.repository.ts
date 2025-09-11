import { Repository, Result } from '../../../lib/application';
import { ClientListDTO } from '../../application';
import { Client } from '../entities/client.entity';

// Define las opciones del repositorio
interface ClientRepositoryOptions {
  entity: Client;
  id: number;
  createDto: any;
  updateDto: any;
  getDto: Client;
  getListDto: ClientListDTO;
  getAllRequest: any;
}

export interface ClientRepository
  extends Pick<Repository<ClientRepositoryOptions>, 'getAll' | 'getById' | 'create' | 'update'> {
  getFormData(): Promise<Result<any>>;
  checkExistence(identificationNumber: string): Promise<Result<any>>;
  updateState(id: number): Promise<Result<any>>;
  search(params: any): Promise<Result<any>>;
}
