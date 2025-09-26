import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagedResult as PaginatedResult, PaginationParams } from '@acontplus/core';
import { Product } from '../domain';
import { MockProductService } from './mock-product.service';

@Injectable({
  providedIn: 'root',
})
export class ProductRepository {
  protected entityName = 'products';
  protected baseUrl = '/api/products';

  constructor(private mockService: MockProductService) {}

  getAll(pagination: PaginationParams): Observable<PaginatedResult<Product>> {
    return this.mockService.getProducts(pagination);
  }

  getById(id: number): Observable<Product> {
    return this.mockService.getProductById(id);
  }

  search(query: string, pagination: PaginationParams): Observable<PaginatedResult<Product>> {
    return this.mockService.searchProducts(query, pagination);
  }

  getActiveProducts(pagination: PaginationParams): Observable<PaginatedResult<Product>> {
    return this.mockService.getActiveProducts(pagination);
  }

  getProductsByCategory(category: string, pagination: PaginationParams): Observable<PaginatedResult<Product>> {
    return this.mockService.getProductsByCategory(category, pagination);
  }

  create(entity: Omit<Product, 'id'>): Observable<Product> {
    return this.mockService.createProduct(entity);
  }

  update(id: number, entity: Partial<Product>): Observable<Product> {
    return this.mockService.updateProduct(id, entity);
  }

  delete(id: number): Observable<boolean> {
    return this.mockService.deleteProduct(id);
  }

  bulkCreate(products: Omit<Product, 'id'>[]): Observable<Product[]> {
    return new Observable(observer => {
      const createdProducts: Product[] = [];
      let completed = 0;

      products.forEach(productData => {
        this.mockService.createProduct(productData).subscribe({
          next: product => {
            createdProducts.push(product);
            completed++;
            if (completed === products.length) {
              observer.next(createdProducts);
              observer.complete();
            }
          },
          error: error => observer.error(error),
        });
      });
    });
  }

  bulkUpdate(updates: { id: number; data: Partial<Product> }[]): Observable<Product[]> {
    return new Observable(observer => {
      const updatedProducts: Product[] = [];
      let completed = 0;

      updates.forEach(update => {
        this.mockService.updateProduct(update.id, update.data).subscribe({
          next: product => {
            updatedProducts.push(product);
            completed++;
            if (completed === updates.length) {
              observer.next(updatedProducts);
              observer.complete();
            }
          },
          error: error => observer.error(error),
        });
      });
    });
  }

  bulkDelete(ids: number[]): Observable<boolean> {
    return this.mockService.bulkDeleteProducts(ids);
  }

  activateProduct(id: number): Observable<Product> {
    return this.mockService.updateProduct(id, { isActive: true });
  }

  deactivateProduct(id: number): Observable<Product> {
    return this.mockService.updateProduct(id, { isActive: false });
  }

  // Additional product-specific methods
  getProductCategories(): Observable<string[]> {
    return this.mockService.getProductCategories();
  }

  getProductStats(): Observable<{ total: number; active: number; totalValue: number }> {
    return this.mockService.getProductStats();
  }
}
