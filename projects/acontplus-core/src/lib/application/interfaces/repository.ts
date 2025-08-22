// src/application/interfaces/repository.ts
export interface Repository<T, ID> {
  // Leer un registro por ID
  getById(id: ID): Promise<T | null>;

  // Leer todos los registros
  getAll(): Promise<T[]>;

  // Crear un nuevo registro
  create(entity: T): Promise<void>;

  // Actualizar un registro completo
  update(entity: Partial<T>): Promise<void>;

  // Eliminar un registro por ID
  delete(id: ID): Promise<void>;
}
