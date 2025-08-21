import { Injectable } from '@angular/core';
import { Observable, map } from 'rxjs';
import { CompositeUseCase } from '@acontplus-core';
import { Product } from '../domain/product';
import { PaginationParams, FilterParams, PaginatedResult } from '@acontplus-core';

export interface ProductManagementRequest {
  action: 'create' | 'update' | 'delete' | 'bulk-operations' | 'search';
  data?: any;
  pagination?: PaginationParams;
  filters?: FilterParams;
}

export interface ProductManagementResponse {
  success: boolean;
  data?: any;
  message?: string;
  affectedProducts?: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProductManagementUseCase extends CompositeUseCase<ProductManagementRequest, ProductManagementResponse> {
  // Mock products for demo purposes
  private products: Product[] = [
    {
      id: 1,
      name: 'Laptop Pro',
      category: 'Electronics',
      price: 1299.99,
      stock: 50,
      availableDate: new Date('2024-01-15'),
      description: 'High-performance laptop for professionals',
      imageUrl: 'https://picsum.photos/id/1/200/200',
      isActive: true,
      categoryId: 1,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z'
    },
    {
      id: 2,
      name: 'Wireless Headphones',
      category: 'Electronics',
      price: 199.99,
      stock: 100,
      availableDate: new Date('2024-01-16'),
      description: 'Premium wireless headphones with noise cancellation',
      imageUrl: 'https://picsum.photos/id/2/200/200',
      isActive: true,
      categoryId: 1,
      createdAt: '2024-01-16T11:00:00Z',
      updatedAt: '2024-01-16T11:00:00Z'
    },
    {
      id: 3,
      name: 'Smart Watch',
      category: 'Electronics',
      price: 299.99,
      stock: 75,
      availableDate: new Date('2024-01-17'),
      description: 'Feature-rich smartwatch with health tracking',
      imageUrl: 'https://picsum.photos/id/3/200/200',
      isActive: true,
      categoryId: 1,
      createdAt: '2024-01-17T12:00:00Z',
      updatedAt: '2024-01-17T12:00:00Z'
    }
  ];

  private nextId = 4;

  protected executeInternal(request: ProductManagementRequest): Observable<ProductManagementResponse> {
    switch (request.action) {
      case 'create':
        return this.handleCreate(request.data);
      case 'update':
        return this.handleUpdate(request.data);
      case 'delete':
        return this.handleDelete(request.data);
      case 'bulk-operations':
        return this.handleBulkOperations(request.data);
      case 'search':
        return this.handleSearch(request.data);
      default:
        throw new Error(`Unknown action: ${request.action}`);
    }
  }

  private handleCreate(productData: Omit<Product, 'id'>): Observable<ProductManagementResponse> {
    const newProduct: Product = {
      ...productData,
      id: this.nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    this.products.push(newProduct);

    return new Observable(observer => {
      observer.next({
        success: true,
        data: newProduct,
        message: 'Product created successfully',
        affectedProducts: 1
      });
      observer.complete();
    });
  }

  private handleUpdate(updateData: { id: number; data: Partial<Product> }): Observable<ProductManagementResponse> {
    const productIndex = this.products.findIndex(p => p.id === updateData.id);

    if (productIndex === -1) {
      return new Observable(observer => {
        observer.next({
          success: false,
          message: 'Product not found',
          affectedProducts: 0
        });
        observer.complete();
      });
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...updateData.data,
      updatedAt: new Date().toISOString()
    };

    return new Observable(observer => {
      observer.next({
        success: true,
        data: this.products[productIndex],
        message: 'Product updated successfully',
        affectedProducts: 1
      });
      observer.complete();
    });
  }

  private handleDelete(deleteData: { id: number }): Observable<ProductManagementResponse> {
    const productIndex = this.products.findIndex(p => p.id === deleteData.id);

    if (productIndex === -1) {
      return new Observable(observer => {
        observer.next({
          success: false,
          message: 'Product not found',
          affectedProducts: 0
        });
        observer.complete();
      });
    }

    this.products.splice(productIndex, 1);

    return new Observable(observer => {
      observer.next({
        success: true,
        message: 'Product deleted successfully',
        affectedProducts: 1
      });
      observer.complete();
    });
  }

  private handleBulkOperations(bulkData: any): Observable<ProductManagementResponse> {
    let affectedCount = 0;

    if (bulkData.activateProducts?.length) {
      bulkData.activateProducts.forEach((id: number) => {
        const product = this.products.find(p => p.id === id);
        if (product) {
          product.isActive = true;
          product.updatedAt = new Date().toISOString();
          affectedCount++;
        }
      });
    }

    if (bulkData.deactivateProducts?.length) {
      bulkData.deactivateProducts.forEach((id: number) => {
        const product = this.products.find(p => p.id === id);
        if (product) {
          product.isActive = false;
          product.updatedAt = new Date().toISOString();
          affectedCount++;
        }
      });
    }

    if (bulkData.deleteProducts?.length) {
      const originalLength = this.products.length;
      this.products = this.products.filter(p => !bulkData.deleteProducts.includes(p.id));
      affectedCount += originalLength - this.products.length;
    }

    return new Observable(observer => {
      observer.next({
        success: affectedCount > 0,
        message: `Bulk operations completed. ${affectedCount} products affected.`,
        affectedProducts: affectedCount
      });
      observer.complete();
    });
  }

  private handleSearch(searchData: { query: string; pagination: PaginationParams }): Observable<ProductManagementResponse> {
    const query = searchData.query.toLowerCase();
    const filteredProducts = this.products.filter(product =>
      product.name.toLowerCase().includes(query) ||
      product.category.toLowerCase().includes(query) ||
      product.description?.toLowerCase().includes(query)
    );

    const startIndex = (searchData.pagination.page - 1) * searchData.pagination.pageSize;
    const endIndex = startIndex + searchData.pagination.pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const result: PaginatedResult<Product> = {
      items: paginatedProducts,
      totalCount: filteredProducts.length,
      pageNumber: searchData.pagination.page,
      pageSize: searchData.pagination.pageSize,
      hasNextPage: searchData.pagination.page < Math.ceil(filteredProducts.length / searchData.pagination.pageSize),
      hasPreviousPage: searchData.pagination.page > 1
    };

    return new Observable(observer => {
      observer.next({
        success: true,
        data: result,
        message: `Found ${filteredProducts.length} products`,
        affectedProducts: filteredProducts.length
      });
      observer.complete();
    });
  }

  // Public methods for external use
  public getProducts(pagination: PaginationParams, filters?: FilterParams & { category?: string; minPrice?: number; maxPrice?: number }): Observable<PaginatedResult<Product>> {
    let filteredProducts = [...this.products];

    if (filters) {
      if (filters.category) {
        filteredProducts = filteredProducts.filter(p => p.category === filters.category);
      }
      if (filters.isActive !== undefined) {
        filteredProducts = filteredProducts.filter(p => p.isActive === filters.isActive);
      }
      if (filters.minPrice !== undefined && filters.minPrice !== null) {
        filteredProducts = filteredProducts.filter(p => p.price >= filters.minPrice!);
      }
      if (filters.maxPrice !== undefined && filters.maxPrice !== null) {
        filteredProducts = filteredProducts.filter(p => p.price <= filters.maxPrice!);
      }
    }

    if (pagination.sortBy) {
      filteredProducts.sort((a, b) => {
        const aValue = (a as any)[pagination.sortBy!];
        const bValue = (b as any)[pagination.sortBy!];

        if (typeof aValue === 'string') {
          return pagination.sortDirection === 'asc'
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);
        }

        return pagination.sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
      });
    }

    const startIndex = (pagination.page - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const result: PaginatedResult<Product> = {
      items: paginatedProducts,
      totalCount: filteredProducts.length,
      pageNumber: pagination.page,
      pageSize: pagination.pageSize,
      hasNextPage: pagination.page < Math.ceil(filteredProducts.length / pagination.pageSize),
      hasPreviousPage: pagination.page > 1
    };

    return new Observable(observer => {
      observer.next(result);
      observer.complete();
    });
  }

  public getProductById(id: number): Observable<Product> {
    const product = this.products.find(p => p.id === id);
    if (product) {
      return new Observable(observer => {
        observer.next(product);
        observer.complete();
      });
    }
    throw new Error('Product not found');
  }

  public getProductCategories(): Observable<string[]> {
    const categories = [...new Set(this.products.map(p => p.category))];
    return new Observable(observer => {
      observer.next(categories);
      observer.complete();
    });
  }

  public getProductStats(): Observable<{ total: number; active: number; inactive: number; totalValue: number }> {
    const total = this.products.length;
    const active = this.products.filter(p => p.isActive).length;
    const inactive = total - active;
    const totalValue = this.products.reduce((sum, p) => sum + (p.price * p.stock), 0);

    return new Observable(observer => {
      observer.next({ total, active, inactive, totalValue });
      observer.complete();
    });
  }
}
