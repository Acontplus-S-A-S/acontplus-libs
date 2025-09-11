export interface Result<T>  {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginationMeta {
  totalItems: number;
  totalPages: number;
  currentPage?: number;
  perPage?: number;
}

export interface PageResult<T> {
  items: T[];
  meta: PaginationMeta;
}

export interface RepositoryOptions<
  TEntity = any,
  ID = any,
  CreateDTO = TEntity,
  UpdateDTO = Partial<TEntity>,
  GetDTO = TEntity,
  GetAllRequest = any
> {
  entity: TEntity;
  id: ID;
  createDto?: CreateDTO;
  updateDto?: UpdateDTO;
  getDto?: GetDTO;  // Nuevo DTO para respuestas
  getAllRequest?: GetAllRequest;
}

export interface Repository<T extends RepositoryOptions> {
  /**
   * Busca una entidad por ID.
   * Devuelve el GetDTO en lugar de TEntity
   */
  getById(id: T['id']): Promise<Result<T['getDto']>>;

  /**
   * Obtiene todas las entidades, soportando filtros y paginación.
   * Devuelve un arreglo paginado de GetDTO
   */
  getAll(request?: T['getAllRequest']): Promise<Result<PageResult<T['getDto']>>>;

  /**
   * Crea una nueva entidad y devuelve el GetDTO.
   */
  create(dto: T['createDto']): Promise<Result<T['getDto']>>;

  /**
   * Actualiza una entidad y devuelve el GetDTO.
   */
  update(dto: T['updateDto']): Promise<Result<T['getDto']>>;

  /**
   * Elimina una entidad por ID.
   */
  delete(id: T['id']): Promise<Result<null>>;
}
