export type SortDirection = 'asc' | 'desc';

export interface PaginationFilters {
  [key: string]: any;
}

export class PaginationParams {
  private _pageIndex: number = 1;
  private _pageSize: number = 10;

  public sortBy?: string;
  public sortDirection: SortDirection = 'asc';
  public searchTerm?: string;
  public filters?: PaginationFilters;

  constructor(params?: Partial<PaginationParams>) {
    if (params) {
      this.pageIndex = params.pageIndex ?? 1;
      this.pageSize = params.pageSize ?? 10;
      this.sortBy = params.sortBy;
      this.sortDirection = params.sortDirection ?? 'asc';
      this.searchTerm = params.searchTerm;
      this.filters = params.filters;
    }
  }

  get pageIndex(): number {
    return this._pageIndex;
  }
  set pageIndex(value: number) {
    this._pageIndex = value < 1 ? 1 : value;
  }

  get pageSize(): number {
    return this._pageSize;
  }
  set pageSize(value: number) {
    this._pageSize = value < 1 ? 10 : value > 1000 ? 1000 : value;
  }

  get skip(): number {
    return (this.pageIndex - 1) * this.pageSize;
  }

  get take(): number {
    return this.pageSize;
  }

  get isEmpty(): boolean {
    return (
      (!this.searchTerm || this.searchTerm.trim() === '') &&
      (!this.filters || Object.keys(this.filters).length === 0)
    );
  }

  buildFilters(): PaginationFilters | null {
    if (!this.filters || Object.keys(this.filters).length === 0) return null;
    return { ...this.filters };
  }

  buildFiltersWithPrefix(prefix: string): PaginationFilters | null {
    if (!this.filters || Object.keys(this.filters).length === 0) return null;
    const result: PaginationFilters = {};
    for (const key in this.filters) {
      result[prefix + key] = this.filters[key];
    }
    return result;
  }

  buildSqlParameters(): PaginationFilters | null {
    return this.buildFiltersWithPrefix('@');
  }
}
