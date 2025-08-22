export interface Result<T>  {
  success: boolean;
  data?: T;
  error?: string;
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

export interface Repository<
  TEntity,
  ID,
  CreateDTO = TEntity,
  UpdateDTO = Partial<TEntity>,
  GetAllRequest = void
> {
  /**
   * Busca una entidad por ID.
   * - success = true + data: entidad encontrada
   * - success = false + error: no encontrada o fallo
   */
  getById(id: ID): Promise<Result<TEntity>>;

  /**
   * Obtiene todas las entidades, soportando filtros y paginación.
   * Devuelve un arreglo paginado + metadata.
   */
  getAll(request?: GetAllRequest): Promise<Result<PageResult<TEntity>>>;

  /**
   * Crea una nueva entidad y devuelve la entidad creada.
   */
  create(dto: CreateDTO): Promise<Result<TEntity>>;

  /**
   * Actualiza una entidad y devuelve la versión actualizada.
   */
  update(dto: UpdateDTO): Promise<Result<TEntity>>;

  /**
   * Elimina una entidad por ID.
   * success = true si fue eliminada, false si no existía o falló.
   */
  delete(id: ID): Promise<Result<null>>;
}
