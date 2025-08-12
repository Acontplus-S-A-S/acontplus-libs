import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BaseRepository, FilterParams, PaginatedResult, PaginationParams } from '@acontplus-core';
import { Product } from '../domain/product';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class ProductHttpRepository extends BaseRepository<Product> {
  constructor(private http: HttpClient) {
    super(http, '/api/products');
  }

  // Base CRUD Operations
  getAll(
    pagination: PaginationParams,
    filters?: FilterParams,
  ): Observable<PaginatedResult<Product>> {
    const params = this.buildParams(pagination, filters);
    return this.get<PaginatedResult<Product>>(this.buildUrl(''), params);
  }

  getById(id: number): Observable<Product> {
    return this.get<Product>(this.buildUrl(id.toString()));
  }

  create(product: Product): Observable<Product> {
    return this.post<Product>(this.buildUrl(''), product);
  }

  update(id: number, product: Product): Observable<Product> {
    return this.put<Product>(this.buildUrl(id.toString()), product);
  }

  delete(id: number): Observable<void> {
    return this.delete<void>(this.buildUrl(id.toString()));
  }

  // Custom business logic methods
  findByCategory(category: string): Observable<Product[]> {
    return this.get<Product[]>(this.buildUrl(''), { category });
  }

  findByPriceRange(minPrice: number, maxPrice: number): Observable<Product[]> {
    return this.get<Product[]>(this.buildUrl(''), {
      minPrice: minPrice.toString(),
      maxPrice: maxPrice.toString(),
    });
  }

  // Search functionality
  search(query: string): Observable<Product[]> {
    return this.get<Product[]>(this.buildUrl('search'), { q: query });
  }

  // Pagination helpers
  private buildParams(pagination: PaginationParams, filters?: FilterParams): any {
    const params: any = {
      page: pagination.page,
      size: pagination.size,
      sort: pagination.sort,
    };

    if (filters) {
      Object.assign(params, filters);
    }

    return params;
  }
}
