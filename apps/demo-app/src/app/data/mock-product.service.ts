import { Injectable } from '@angular/core';
import { Observable, of, delay } from 'rxjs';
import { Product } from '../domain/product';
import { PagedResult as PaginatedResult, PaginationParams } from '@acontplus/core';

@Injectable({
  providedIn: 'root',
})
export class MockProductService {
  private products: Product[] = [
    {
      id: 1,
      name: 'Laptop Pro',
      category: 'Electronics',
      price: 1299.99,
      stock: 50,
      availableDate: new Date('2024-01-15'),
      description: 'High-performance laptop for professionals',
      imageUrl: 'https://example.com/laptop.jpg',
      isActive: true,
      categoryId: 1,
      supplierId: 1,
      createdAt: '2024-01-15T10:00:00Z',
      updatedAt: '2024-01-15T10:00:00Z',
    },
    {
      id: 2,
      name: 'Wireless Headphones',
      category: 'Electronics',
      price: 199.99,
      stock: 100,
      availableDate: new Date('2024-01-16'),
      description: 'Premium wireless headphones with noise cancellation',
      imageUrl: 'https://example.com/headphones.jpg',
      isActive: true,
      categoryId: 1,
      supplierId: 2,
      createdAt: '2024-01-16T11:00:00Z',
      updatedAt: '2024-01-16T11:00:00Z',
    },
    {
      id: 3,
      name: 'Office Chair',
      category: 'Furniture',
      price: 299.99,
      stock: 25,
      availableDate: new Date('2024-01-17'),
      description: 'Ergonomic office chair with lumbar support',
      imageUrl: 'https://example.com/chair.jpg',
      isActive: true,
      categoryId: 2,
      supplierId: 3,
      createdAt: '2024-01-17T12:00:00Z',
      updatedAt: '2024-01-17T12:00:00Z',
    },
    {
      id: 4,
      name: 'Coffee Maker',
      category: 'Appliances',
      price: 89.99,
      stock: 75,
      availableDate: new Date('2024-01-18'),
      description: 'Programmable coffee maker with thermal carafe',
      imageUrl: 'https://example.com/coffee.jpg',
      isActive: false,
      categoryId: 3,
      supplierId: 4,
      createdAt: '2024-01-18T13:00:00Z',
      updatedAt: '2024-01-18T13:00:00Z',
    },
    {
      id: 5,
      name: 'Running Shoes',
      category: 'Sports',
      price: 129.99,
      stock: 60,
      availableDate: new Date('2024-01-19'),
      description: 'Lightweight running shoes with cushioning',
      imageUrl: 'https://example.com/shoes.jpg',
      isActive: true,
      categoryId: 4,
      supplierId: 5,
      createdAt: '2024-01-19T14:00:00Z',
      updatedAt: '2024-01-19T14:00:00Z',
    },
    {
      id: 6,
      name: 'Desk Lamp',
      category: 'Furniture',
      price: 49.99,
      stock: 40,
      availableDate: new Date('2024-01-20'),
      description: 'LED desk lamp with adjustable brightness',
      imageUrl: 'https://example.com/lamp.jpg',
      isActive: true,
      categoryId: 2,
      supplierId: 6,
      createdAt: '2024-01-20T15:00:00Z',
      updatedAt: '2024-01-20T15:00:00Z',
    },
    {
      id: 7,
      name: 'Smart Watch',
      category: 'Electronics',
      price: 349.99,
      stock: 30,
      availableDate: new Date('2024-01-21'),
      description: 'Fitness tracking smart watch with GPS',
      imageUrl: 'https://example.com/watch.jpg',
      isActive: true,
      categoryId: 1,
      supplierId: 2,
      createdAt: '2024-01-21T16:00:00Z',
      updatedAt: '2024-01-21T16:00:00Z',
    },
    {
      id: 8,
      name: 'Bookshelf',
      category: 'Furniture',
      price: 199.99,
      stock: 15,
      availableDate: new Date('2024-01-22'),
      description: '5-tier wooden bookshelf',
      imageUrl: 'https://example.com/bookshelf.jpg',
      isActive: false,
      categoryId: 2,
      supplierId: 3,
      createdAt: '2024-01-22T17:00:00Z',
      updatedAt: '2024-01-22T17:00:00Z',
    },
    {
      id: 9,
      name: 'Blender',
      category: 'Appliances',
      price: 79.99,
      stock: 55,
      availableDate: new Date('2024-01-23'),
      description: 'High-speed blender for smoothies and soups',
      imageUrl: 'https://example.com/blender.jpg',
      isActive: true,
      categoryId: 3,
      supplierId: 4,
      createdAt: '2024-01-23T18:00:00Z',
      updatedAt: '2024-01-23T18:00:00Z',
    },
    {
      id: 10,
      name: 'Yoga Mat',
      category: 'Sports',
      price: 39.99,
      stock: 80,
      availableDate: new Date('2024-01-24'),
      description: 'Non-slip yoga mat with carrying strap',
      imageUrl: 'https://example.com/yogamat.jpg',
      isActive: true,
      categoryId: 4,
      supplierId: 5,
      createdAt: '2024-01-24T19:00:00Z',
      updatedAt: '2024-01-24T19:00:00Z',
    },
  ];

  private nextId = 11;

  getProducts(pagination: PaginationParams): Observable<PaginatedResult<Product>> {
    const filteredProducts = [...this.products];

    // Apply sorting
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

    // Apply pagination
    const startIndex = (pagination.pageIndex - 1) * pagination.pageSize;
    const endIndex = startIndex + pagination.pageSize;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    const result: PaginatedResult<Product> = {
      items: paginatedProducts,
      totalCount: filteredProducts.length,
      pageIndex: pagination.pageIndex,
      pageSize: pagination.pageSize,
      totalPages: Math.ceil(filteredProducts.length / pagination.pageSize),
      hasPreviousPage: pagination.pageIndex > 1,
      hasNextPage: pagination.pageIndex < Math.ceil(filteredProducts.length / pagination.pageSize),
    };

    return of(result).pipe(delay(300)); // Simulate network delay
  }

  getProductById(id: number): Observable<Product> {
    const product = this.products.find(p => p.id === id);
    if (product) {
      return of(product).pipe(delay(200));
    }
    throw new Error('Product not found');
  }

  createProduct(productData: Omit<Product, 'id'>): Observable<Product> {
    const newProduct: Product = {
      ...productData,
      id: this.nextId++,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    this.products.push(newProduct);
    return of(newProduct).pipe(delay(500));
  }

  updateProduct(id: number, productData: Partial<Product>): Observable<Product> {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      throw new Error('Product not found');
    }

    this.products[productIndex] = {
      ...this.products[productIndex],
      ...productData,
      updatedAt: new Date().toISOString(),
    };

    return of(this.products[productIndex]).pipe(delay(500));
  }

  deleteProduct(id: number): Observable<boolean> {
    const productIndex = this.products.findIndex(p => p.id === id);
    if (productIndex === -1) {
      return of(false);
    }

    this.products.splice(productIndex, 1);
    return of(true).pipe(delay(300));
  }

  searchProducts(
    query: string,
    pagination: PaginationParams,
  ): Observable<PaginatedResult<Product>> {
    return this.getProducts(pagination);
  }

  getActiveProducts(pagination: PaginationParams): Observable<PaginatedResult<Product>> {
    return this.getProducts(pagination);
  }

  getProductsByCategory(
    category: string,
    pagination: PaginationParams,
  ): Observable<PaginatedResult<Product>> {
    return this.getProducts(pagination);
  }

  // Bulk operations
  bulkActivateProducts(productIds: number[]): Observable<boolean[]> {
    const results = productIds.map(id => {
      const product = this.products.find(p => p.id === id);
      if (product) {
        product.isActive = true;
        product.updatedAt = new Date().toISOString();
        return true;
      }
      return false;
    });

    return of(results).pipe(delay(800));
  }

  bulkDeactivateProducts(productIds: number[]): Observable<boolean[]> {
    const results = productIds.map(id => {
      const product = this.products.find(p => p.id === id);
      if (product) {
        product.isActive = false;
        product.updatedAt = new Date().toISOString();
        return true;
      }
      return false;
    });

    return of(results).pipe(delay(800));
  }

  bulkDeleteProducts(productIds: number[]): Observable<boolean> {
    const originalLength = this.products.length;
    this.products = this.products.filter(p => !productIds.includes(p.id));
    const deleted = originalLength - this.products.length;

    return of(deleted > 0).pipe(delay(1000));
  }

  // Additional methods for product-specific functionality
  getProductCategories(): Observable<string[]> {
    const categories = [...new Set(this.products.map(p => p.category))];
    return of(categories).pipe(delay(200));
  }

  getProductStats(): Observable<{ total: number; active: number; totalValue: number }> {
    const total = this.products.length;
    const active = this.products.filter(p => p.isActive).length;
    const totalValue = this.products.reduce((sum, p) => sum + p.price * p.stock, 0);

    return of({ total, active, totalValue }).pipe(delay(200));
  }

  // Helper methods
  getTotalProducts(): number {
    return this.products.length;
  }

  getActiveProductsCount(): number {
    return this.products.filter(p => p.isActive).length;
  }

  getInactiveProductsCount(): number {
    return this.products.filter(p => !p.isActive).length;
  }

  getTotalInventoryValue(): number {
    return this.products.reduce((sum, p) => sum + p.price * p.stock, 0);
  }
}
