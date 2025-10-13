import {
  Component,
  OnInit,
  TemplateRef,
  AfterViewInit,
  ChangeDetectorRef,
  inject,
  viewChild,
} from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ColumnDefinition, DynamicTable, Pagination, Button } from '@acontplus/ng-components';
import { ProductRepository } from '../../data';
import { Product } from '../../domain';
import { PaginationParams, PagedResult } from '@acontplus/core';
import { CurrencyPipe, DatePipe } from '@angular/common';

// Extended filter interface for products
interface ProductFilters {
  search?: string;
  role?: string;
  isActive?: boolean;
  dateFrom?: string;
  dateTo?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatTableModule,
    MatPaginatorModule,
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    DynamicTable,
    CurrencyPipe,
    DatePipe,
    Button,
  ],
  templateUrl: './product.component.html',
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit, AfterViewInit {
  private productRepository = inject(ProductRepository);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  productColumns: ColumnDefinition<Product>[] = [];
  selectedProducts: Product[] = [];
  categories: string[] = [];

  // Pagination
  pagination = new PaginationParams({
    pageIndex: 1,
    pageSize: 10,
    sortBy: 'name',
    sortDirection: 'asc',
  });

  // Filters
  filters: ProductFilters = {};
  searchQuery = '';
  selectedCategory = '';
  minPrice: number | null = null;
  maxPrice: number | null = null;

  // Bulk operations
  selectedProductIds: number[] = [];

  // Loading states
  isLoading = false;
  isCreating = false;
  isUpdating = false;

  // Form data
  newProduct: Partial<Product> = {};
  editProduct: Partial<Product> = {};
  editProductId: number | null = null;

  // Statistics
  totalProducts = 0;
  activeProducts = 0;
  totalValue = 0;

  productPaginationConfig: Pagination = new Pagination(0, 10, 5, 0, [5, 10, 25, 50]);

  readonly actionsTemplate = viewChild.required<TemplateRef<any>>('actionsTemplate');
  readonly productImageTemplate = viewChild.required<TemplateRef<any>>('productImageTemplate');
  readonly expandedProductDetail = viewChild.required<TemplateRef<any>>('expandedProductDetail');

  ngOnInit(): void {
    // Initialize form data first
    this.initializeNewProduct();

    // Initialize columns immediately
    this.initializeColumns();

    // Defer async operations to next tick to avoid change detection issues
    setTimeout(() => {
      this.loadProducts();
      this.loadCategories();
      this.loadStatistics();
    });
  }

  ngAfterViewInit() {
    // Update columns with template references after ViewChild is available
    this.updateColumnsWithTemplates();
  }

  private initializeNewProduct(): void {
    this.newProduct = {
      name: '',
      category: '',
      price: 0,
      stock: 0,
      availableDate: new Date(),
      description: '',
      imageUrl: '',
      isActive: true,
      categoryId: 1,
    };
  }

  // Helper methods for date handling
  getDateString(date: any): string {
    if (!date) return '';
    if (date instanceof Date) {
      return date.toISOString().split('T')[0];
    }
    if (typeof date === 'string') {
      return date.split('T')[0];
    }
    return '';
  }

  setDateFromString(dateString: string, formType: 'newProduct' | 'editProduct'): void {
    const date = new Date(dateString);
    if (formType === 'newProduct') {
      this.newProduct.availableDate = date;
    } else {
      this.editProduct.availableDate = date;
    }
  }

  loadProducts(): void {
    this.isLoading = true;
    console.log('Loading products with pagination:', this.pagination, 'and filters:', this.filters);

    // Apply filters
    if (this.selectedCategory) {
      this.filters.category = this.selectedCategory;
    }
    if (this.minPrice !== null) {
      this.filters.minPrice = this.minPrice;
    }
    if (this.maxPrice !== null) {
      this.filters.maxPrice = this.maxPrice;
    }

    this.productRepository.getAll(this.pagination).subscribe({
      next: (result: PagedResult<Product>) => {
        console.log('Products loaded successfully:', result);
        this.products = result.items;
        this.totalProducts = result.totalCount;

        // Update pagination config to match the result
        this.productPaginationConfig.totalRecords = result.totalCount;
        this.productPaginationConfig.pageIndex = result.pageIndex - 1; // Convert to 0-based index
        this.productPaginationConfig.pageSize = result.pageSize;

        console.log('Updated products array:', this.products);
        console.log('Updated pagination config:', this.productPaginationConfig);

        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error('Error loading products:', error);
        this.snackBar.open('Error loading products', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  loadCategories(): void {
    this.productRepository.getProductCategories().subscribe((categories: string[]) => {
      this.categories = categories;
      this.cdr.markForCheck();
    });
  }

  loadStatistics(): void {
    this.productRepository
      .getProductStats()
      .subscribe((stats: { total: number; active: number; totalValue: number }) => {
        this.totalProducts = stats.total;
        this.activeProducts = stats.active;
        this.totalValue = stats.totalValue;
        this.cdr.markForCheck();
      });
  }

  onPageChange(event: PageEvent): void {
    // Update both pagination objects to keep them in sync
    this.pagination.pageIndex = event.pageIndex + 1; // Convert from 0-based to 1-based
    this.pagination.pageSize = event.pageSize;

    this.productPaginationConfig.pageIndex = event.pageIndex;
    this.productPaginationConfig.pageSize = event.pageSize;

    this.loadProducts();
  }

  onFilterChange(): void {
    this.pagination.pageIndex = 1; // Reset to first page
    this.productPaginationConfig.pageIndex = 0; // Reset to first page (0-based)
    this.loadProducts();
  }

  onSearch(): void {
    if (this.searchQuery.trim()) {
      this.filters.search = this.searchQuery.trim();
    } else {
      delete this.filters.search;
    }
    this.onFilterChange();
  }

  clearFilters(): void {
    this.filters = {};
    this.searchQuery = '';
    this.selectedCategory = '';
    this.minPrice = null;
    this.maxPrice = null;
    this.onFilterChange();
  }

  createProduct(): void {
    if (
      !this.newProduct.name ||
      !this.newProduct.category ||
      this.newProduct.price === undefined ||
      this.newProduct.stock === undefined
    ) {
      this.snackBar.open('Name, category, price, and stock are required', 'Close', {
        duration: 3000,
      });
      return;
    }

    // Convert date string to Date object if needed
    const productData = {
      ...this.newProduct,
      availableDate:
        this.newProduct.availableDate instanceof Date
          ? this.newProduct.availableDate
          : this.newProduct.availableDate
            ? new Date(this.newProduct.availableDate as string)
            : new Date(),
    };

    this.isCreating = true;
    this.productRepository.create(productData as Omit<Product, 'id'>).subscribe({
      next: (_product: Product) => {
        this.snackBar.open('Product created successfully', 'Close', { duration: 3000 });
        this.initializeNewProduct();
        this.loadProducts();
        this.loadStatistics();
        this.isCreating = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error creating product:', error);
        this.snackBar.open('Error creating product', 'Close', { duration: 3000 });
        this.isCreating = false;
        this.cdr.detectChanges();
      },
    });
  }

  startEdit(product: Product): void {
    this.editProductId = product.id;
    this.editProduct = { ...product };
    this.cdr.detectChanges();
  }

  cancelEdit(): void {
    this.editProductId = null;
    this.editProduct = {};
    this.cdr.detectChanges();
  }

  updateProduct(): void {
    if (
      !this.editProductId ||
      !this.editProduct.name ||
      !this.editProduct.category ||
      this.editProduct.price === undefined ||
      this.editProduct.stock === undefined
    ) {
      this.snackBar.open('Valid product data is required', 'Close', { duration: 3000 });
      return;
    }

    // Convert date string to Date object if needed
    const productData = {
      ...this.editProduct,
      availableDate:
        this.editProduct.availableDate instanceof Date
          ? this.editProduct.availableDate
          : this.editProduct.availableDate
            ? new Date(this.editProduct.availableDate as string)
            : new Date(),
    };

    this.isUpdating = true;
    this.productRepository.update(this.editProductId, productData).subscribe({
      next: (_product: Product) => {
        this.snackBar.open('Product updated successfully', 'Close', { duration: 3000 });
        this.editProductId = null;
        this.editProduct = {};
        this.loadProducts();
        this.loadStatistics();
        this.isUpdating = false;
        this.cdr.detectChanges();
      },
      error: (error: any) => {
        console.error('Error updating product:', error);
        this.snackBar.open('Error updating product', 'Close', { duration: 3000 });
        this.isUpdating = false;
        this.cdr.detectChanges();
      },
    });
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.productRepository.delete(product.id).subscribe({
        next: (success: boolean) => {
          if (success) {
            this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
            this.loadProducts();
            this.loadStatistics();
          } else {
            this.snackBar.open('Failed to delete product', 'Close', { duration: 3000 });
          }
          this.cdr.detectChanges();
        },
        error: (error: any) => {
          console.error('Error deleting product:', error);
          this.snackBar.open('Error deleting product', 'Close', { duration: 3000 });
        },
      });
    }
  }

  onRowSelected(selectedRows: Product[]): void {
    this.selectedProductIds = selectedRows.map(product => product.id);
    this.cdr.markForCheck();
  }

  bulkActivateProducts(): void {
    if (this.selectedProductIds.length === 0) {
      this.snackBar.open('No products selected', 'Close', { duration: 3000 });
      return;
    }

    this.productRepository
      .bulkUpdate(this.selectedProductIds.map(id => ({ id, data: { isActive: true } })))
      .subscribe({
        next: (products: Product[]) => {
          this.snackBar.open(`${products.length} products activated successfully`, 'Close', {
            duration: 3000,
          });
          this.selectedProductIds = [];
          this.loadProducts();
          this.loadStatistics();
        },
        error: (error: any) => {
          console.error('Error in bulk operation:', error);
          this.snackBar.open('Error in bulk operation', 'Close', { duration: 3000 });
        },
      });
  }

  bulkDeactivateProducts(): void {
    if (this.selectedProductIds.length === 0) {
      this.snackBar.open('No products selected', 'Close', { duration: 3000 });
      return;
    }

    this.productRepository
      .bulkUpdate(this.selectedProductIds.map(id => ({ id, data: { isActive: false } })))
      .subscribe({
        next: (products: Product[]) => {
          this.snackBar.open(`${products.length} products deactivated successfully`, 'Close', {
            duration: 3000,
          });
          this.selectedProductIds = [];
          this.loadProducts();
          this.loadStatistics();
        },
        error: (error: any) => {
          console.error('Error in bulk operation:', error);
          this.snackBar.open('Error in bulk operation', 'Close', { duration: 3000 });
        },
      });
  }

  bulkDeleteProducts(): void {
    if (this.selectedProductIds.length === 0) {
      this.snackBar.open('No products selected', 'Close', { duration: 3000 });
      return;
    }

    if (confirm(`Are you sure you want to delete ${this.selectedProductIds.length} products?`)) {
      this.productRepository.bulkDelete(this.selectedProductIds).subscribe({
        next: (success: boolean) => {
          if (success) {
            this.snackBar.open('Products deleted successfully', 'Close', { duration: 3000 });
            this.selectedProductIds = [];
            this.loadProducts();
            this.loadStatistics();
          } else {
            this.snackBar.open('Failed to delete products', 'Close', { duration: 3000 });
          }
        },
        error: (error: any) => {
          console.error('Error in bulk operation:', error);
          this.snackBar.open('Error in bulk operation', 'Close', { duration: 3000 });
        },
      });
    }
  }

  private initializeColumns(): void {
    // Create basic column definitions without template references
    this.productColumns = [
      new ColumnDefinition<Product>({
        key: 'id',
        label: 'ID',
        type: 'number',
        width: '80px',
        order: 1,
      }),
      new ColumnDefinition<Product>({
        key: 'imageUrl',
        label: 'Image',
        type: 'template',
        width: '60px',
        order: 2,
      }),
      new ColumnDefinition<Product>({
        key: 'name',
        label: 'Product Name',
        type: 'string',
        isDefaultSearchField: true,
        required: true,
        order: 3,
        width: '200px',
      }),
      new ColumnDefinition<Product>({
        key: 'category',
        label: 'Category',
        type: 'string',
        order: 4,
      }),
      new ColumnDefinition<Product>({
        key: 'price',
        label: 'Price',
        type: 'number',
        format: { style: 'currency', currency: 'USD' },
        hasFooter: true,
        order: 5,
      }),
      new ColumnDefinition<Product>({
        key: 'stock',
        label: 'Stock',
        type: 'number',
        hasFooter: true,
        order: 6,
      }),
      new ColumnDefinition<Product>({
        key: 'availableDate',
        label: 'Available On',
        type: 'date',
        order: 7,
      }),
      new ColumnDefinition<Product>({
        key: 'isActive',
        label: 'Status',
        type: 'string',
        order: 8,
        width: '100px',
      }),
      new ColumnDefinition<Product>({
        key: 'op',
        label: 'Actions',
        columnType: 'template',
        order: 9,
        width: '120px',
      }),
    ].sort((a, b) => (a.order || 0) - (b.order || 0));

    console.log('Column definitions initialized:', this.productColumns);
  }

  private updateColumnsWithTemplates(): void {
    // Update columns with template references after ViewChild is available
    const actionsTemplate = this.actionsTemplate();
    const productImageTemplate = this.productImageTemplate();
    if (actionsTemplate && productImageTemplate) {
      // Update image column with template
      const imageColumn = this.productColumns.find(col => col.key === 'imageUrl');
      if (imageColumn) {
        imageColumn.templateOutlet = productImageTemplate;
      }

      // Update actions column with template
      const actionsColumn = this.productColumns.find(col => col.key === 'op');
      if (actionsColumn) {
        actionsColumn.templateOutlet = actionsTemplate;
      }

      console.log('Columns updated with templates:', this.productColumns);
    } else {
      console.log('Templates not ready yet:', {
        actionsTemplate: !!actionsTemplate,
        productImageTemplate: !!productImageTemplate,
      });
    }
  }

  getSelectedCount(): number {
    return this.selectedProductIds.length;
  }

  getStatusColor(isActive: boolean): string {
    return isActive ? 'primary' : 'warn';
  }
}
