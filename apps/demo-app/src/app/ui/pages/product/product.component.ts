import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { PageEvent } from '@angular/material/paginator';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, JsonPipe } from '@angular/common';
import { ColumnDefinition, MatDynamicTableComponent, Pagination } from '@acontplus-ui-components';
import { ProductManagementUseCase } from '../../../application';
import { Product } from '../../../domain/product';
import { PaginationParams, FilterParams, PaginatedResult } from '@acontplus-core';

// Extended filter interface for products
interface ProductFilters extends FilterParams {
  category?: string;
  minPrice?: number;
  maxPrice?: number;
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatSelectModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDynamicTableComponent,
    MatIcon,
    MatIconButton,
    JsonPipe,
    DatePipe,
  ],
  template: `
    <div class="product-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Product Management</mat-card-title>
          <mat-card-subtitle>Manage your product catalog</mat-card-subtitle>
        </mat-card-header>

        <mat-card-content>
          <!-- Statistics Section -->
          @if (!isLoading) {
            <div class="stats-section">
              <div class="stat-card">
                <h3>Total Products</h3>
                <p class="stat-number">{{ totalProducts }}</p>
              </div>
              <div class="stat-card">
                <h3>Active Products</h3>
                <p class="stat-number">{{ activeProducts }}</p>
              </div>
              <div class="stat-card">
                <h3>Total Value</h3>
                <p class="stat-number">{{ totalValue | currency: 'USD' }}</p>
              </div>
            </div>
          }

          <!-- Search and Filters -->
          <div class="filters-section">
            <mat-form-field appearance="outline" class="search-field">
              <mat-label>Search Products</mat-label>
              <input
                matInput
                [(ngModel)]="searchQuery"
                placeholder="Search by name, category, or description"
                (keyup.enter)="onSearch()"
              />
              <button mat-icon-button matSuffix (click)="onSearch()">
                <mat-icon>search</mat-icon>
              </button>
            </mat-form-field>

            <mat-form-field appearance="outline" class="category-filter">
              <mat-label>Category</mat-label>
              <mat-select [(ngModel)]="selectedCategory" (selectionChange)="onFilterChange()">
                <mat-option value="">All Categories</mat-option>
                @for (category of categories; track category) {
                  <mat-option [value]="category">
                    {{ category }}
                  </mat-option>
                }
              </mat-select>
            </mat-form-field>

            <mat-form-field appearance="outline" class="price-filter">
              <mat-label>Min Price</mat-label>
              <input
                matInput
                type="number"
                [(ngModel)]="minPrice"
                placeholder="0"
                (input)="onFilterChange()"
              />
            </mat-form-field>

            <mat-form-field appearance="outline" class="price-filter">
              <mat-label>Max Price</mat-label>
              <input
                matInput
                type="number"
                [(ngModel)]="maxPrice"
                placeholder="1000"
                (input)="onFilterChange()"
              />
            </mat-form-field>

            <button mat-raised-button color="primary" (click)="onSearch()">
              <mat-icon>search</mat-icon>
              Search
            </button>
            <button mat-button (click)="clearFilters()">
              <mat-icon>clear</mat-icon>
              Clear
            </button>
          </div>

          <!-- Create Product Form -->
          <div class="create-section">
            <h3>Add New Product</h3>
            <div class="form-row">
              <mat-form-field appearance="outline">
                <mat-label>Product Name</mat-label>
                <input
                  matInput
                  [(ngModel)]="newProduct.name"
                  placeholder="Enter product name"
                  required
                />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Category</mat-label>
                <mat-select [(ngModel)]="newProduct.category" required>
                  @for (category of categories; track category) {
                    <mat-option [value]="category">
                      {{ category }}
                    </mat-option>
                  }
                </mat-select>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Price</mat-label>
                <input
                  matInput
                  type="number"
                  [(ngModel)]="newProduct.price"
                  placeholder="0.00"
                  step="0.01"
                  required
                />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Stock</mat-label>
                <input
                  matInput
                  type="number"
                  [(ngModel)]="newProduct.stock"
                  placeholder="0"
                  required
                />
              </mat-form-field>
            </div>

            <div class="form-row">
              <mat-form-field appearance="outline" class="description-field">
                <mat-label>Description</mat-label>
                <textarea
                  matInput
                  [(ngModel)]="newProduct.description"
                  placeholder="Enter product description"
                  rows="3"
                ></textarea>
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Image URL</mat-label>
                <input
                  matInput
                  [(ngModel)]="newProduct.imageUrl"
                  placeholder="https://example.com/image.jpg"
                />
              </mat-form-field>

              <mat-form-field appearance="outline">
                <mat-label>Available Date</mat-label>
                <input
                  matInput
                  type="date"
                  [ngModel]="getDateString(newProduct.availableDate)"
                  (ngModelChange)="setDateFromString($event, 'newProduct')"
                  required
                />
              </mat-form-field>
            </div>

            <button
              mat-raised-button
              color="primary"
              (click)="createProduct()"
              [disabled]="isCreating"
            >
              <mat-icon>add</mat-icon>
              {{ isCreating ? 'Creating...' : 'Create Product' }}
            </button>
          </div>

          <!-- Bulk Operations -->
          @if (selectedProducts.length > 0) {
            <div class="bulk-operations">
              <h3>Bulk Operations ({{ selectedProducts.length }} selected)</h3>
              <div class="bulk-buttons">
                <button mat-raised-button color="accent" (click)="bulkActivateProducts()">
                  <mat-icon>check_circle</mat-icon>
                  Activate
                </button>
                <button mat-raised-button color="warn" (click)="bulkDeactivateProducts()">
                  <mat-icon>cancel</mat-icon>
                  Deactivate
                </button>
                <button mat-raised-button color="warn" (click)="bulkDeleteProducts()">
                  <mat-icon>delete_forever</mat-icon>
                  Delete
                </button>
              </div>
            </div>
          }

          <!-- Products Table -->
          <div class="table-section">
            <acp-mat-dynamic-table
              [tableData]="products"
              [columnDefinitions]="productColumns"
              [showSelectBox]="true"
              [showFooter]="true"
              [enablePagination]="true"
              [paginationConfig]="productPaginationConfig"
              [showExpand]="true"
              [expandedDetail]="expandedProductDetail"
              [rowTemplate]="actionsTemplate"
              (rowSelected)="onRowSelected($event)"
              (pageEvent)="onPageChange($event)"
            >
            </acp-mat-dynamic-table>
          </div>

          <!-- Edit Product Dialog -->
          @if (editProductId !== null) {
            <div class="edit-section">
              <h3>Edit Product</h3>
              <div class="form-row">
                <mat-form-field appearance="outline">
                  <mat-label>Product Name</mat-label>
                  <input
                    matInput
                    [(ngModel)]="editProduct.name"
                    placeholder="Enter product name"
                    required
                  />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Category</mat-label>
                  <mat-select [(ngModel)]="editProduct.category" required>
                    @for (category of categories; track category) {
                      <mat-option [value]="category">
                        {{ category }}
                      </mat-option>
                    }
                  </mat-select>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Price</mat-label>
                  <input
                    matInput
                    type="number"
                    [(ngModel)]="editProduct.price"
                    placeholder="0.00"
                    step="0.01"
                    required
                  />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Stock</mat-label>
                  <input
                    matInput
                    type="number"
                    [(ngModel)]="editProduct.stock"
                    placeholder="0"
                    required
                  />
                </mat-form-field>
              </div>
              <div class="form-row">
                <mat-form-field appearance="outline" class="description-field">
                  <mat-label>Description</mat-label>
                  <textarea
                    matInput
                    [(ngModel)]="editProduct.description"
                    placeholder="Enter product description"
                    rows="3"
                  ></textarea>
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Image URL</mat-label>
                  <input
                    matInput
                    [(ngModel)]="editProduct.imageUrl"
                    placeholder="https://example.com/image.jpg"
                  />
                </mat-form-field>
                <mat-form-field appearance="outline">
                  <mat-label>Available Date</mat-label>
                  <input
                    matInput
                    type="date"
                    [ngModel]="getDateString(editProduct.availableDate)"
                    (ngModelChange)="setDateFromString($event, 'editProduct')"
                    required
                  />
                </mat-form-field>
              </div>
              <div class="edit-buttons">
                <button
                  mat-raised-button
                  color="primary"
                  (click)="updateProduct()"
                  [disabled]="isUpdating"
                >
                  <mat-icon>save</mat-icon>
                  {{ isUpdating ? 'Updating...' : 'Update Product' }}
                </button>
                <button mat-button (click)="cancelEdit()">
                  <mat-icon>cancel</mat-icon>
                  Cancel
                </button>
              </div>
            </div>
          }
        </mat-card-content>
      </mat-card>
    </div>

    <ng-template #actionsTemplate let-element="element" let-i="index">
      <button
        mat-icon-button
        color="primary"
        (click)="startEdit(element)"
        matTooltip="Edit Product"
      >
        <mat-icon>edit</mat-icon>
      </button>
      <button
        mat-icon-button
        color="warn"
        (click)="deleteProduct(element)"
        matTooltip="Delete Product"
      >
        <mat-icon>delete</mat-icon>
      </button>
    </ng-template>

    <ng-template #productImageTemplate let-element="$implicit">
      <img
        [src]="element.imageUrl || 'assets/placeholder.png'"
        alt="Product Image"
        width="40"
        height="40"
        style="border-radius: 4px;"
        onerror="this.src='assets/placeholder.png'"
      />
    </ng-template>

    <ng-template #expandedProductDetail let-element="$implicit" let-index="index">
      <div style="padding: 16px; background-color: #f0f0f0; border-top: 1px solid #ccc;">
        <h3>Details for {{ element.name }}</h3>
        <p>
          <strong>Description:</strong> {{ element.description || 'No description available.' }}
        </p>
        <p><strong>Category:</strong> {{ element.category }}</p>
        <p><strong>Available On:</strong> {{ element.availableDate | date: 'fullDate' }}</p>
        <p>
          <strong>Status:</strong>
          <span [class]="element.isActive ? 'status-active' : 'status-inactive'">
            {{ element.isActive ? 'Active' : 'Inactive' }}
          </span>
        </p>
        <p><strong>Created:</strong> {{ element.createdAt | date: 'medium' }}</p>
        <p><strong>Last Updated:</strong> {{ element.updatedAt | date: 'medium' }}</p>
      </div>
    </ng-template>
  `,
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit, AfterViewInit {
  private productManagement = inject(ProductManagementUseCase);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  productColumns: ColumnDefinition<Product>[] = [];
  selectedProducts: Product[] = [];
  categories: string[] = [];

  // Pagination
  pagination: PaginationParams = {
    page: 1,
    pageSize: 10,
    sortBy: 'name',
    sortDirection: 'asc',
  };

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

  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ViewChild('productImageTemplate') productImageTemplate!: TemplateRef<any>;
  @ViewChild('expandedProductDetail') expandedProductDetail!: TemplateRef<any>;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

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

    this.productManagement.getProducts(this.pagination, this.filters).subscribe({
      next: result => {
        console.log('Products loaded successfully:', result);
        this.products = result.items;
        this.totalProducts = result.totalCount;

        // Update pagination config to match the result
        this.productPaginationConfig.totalRecords = result.totalCount;
        this.productPaginationConfig.pageIndex = result.pageNumber - 1; // Convert to 0-based index
        this.productPaginationConfig.pageSize = result.pageSize;

        console.log('Updated products array:', this.products);
        console.log('Updated pagination config:', this.productPaginationConfig);

        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: error => {
        console.error('Error loading products:', error);
        this.snackBar.open('Error loading products', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  loadCategories(): void {
    this.productManagement.getProductCategories().subscribe(categories => {
      this.categories = categories;
      this.cdr.markForCheck();
    });
  }

  loadStatistics(): void {
    this.productManagement.getProductStats().subscribe(stats => {
      this.totalProducts = stats.total;
      this.activeProducts = stats.active;
      this.totalValue = stats.totalValue;
      this.cdr.markForCheck();
    });
  }

  onPageChange(event: PageEvent): void {
    // Update both pagination objects to keep them in sync
    this.pagination.page = event.pageIndex + 1; // Convert from 0-based to 1-based
    this.pagination.pageSize = event.pageSize;

    this.productPaginationConfig.pageIndex = event.pageIndex;
    this.productPaginationConfig.pageSize = event.pageSize;

    this.loadProducts();
  }

  onFilterChange(): void {
    this.pagination.page = 1; // Reset to first page
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
    this.productManagement
      .execute({
        action: 'create',
        data: productData,
      })
      .subscribe({
        next: response => {
          if (response.success) {
            this.snackBar.open('Product created successfully', 'Close', { duration: 3000 });
            this.initializeNewProduct();
            this.loadProducts();
            this.loadStatistics();
          } else {
            this.snackBar.open(response.message || 'Failed to create product', 'Close', {
              duration: 3000,
            });
          }
          this.isCreating = false;
          this.cdr.detectChanges();
        },
        error: error => {
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
    this.productManagement
      .execute({
        action: 'update',
        data: {
          id: this.editProductId,
          data: productData,
        },
      })
      .subscribe({
        next: response => {
          if (response.success) {
            this.snackBar.open('Product updated successfully', 'Close', { duration: 3000 });
            this.editProductId = null;
            this.editProduct = {};
            this.loadProducts();
            this.loadStatistics();
          } else {
            this.snackBar.open(response.message || 'Failed to update product', 'Close', {
              duration: 3000,
            });
          }
          this.isUpdating = false;
          this.cdr.detectChanges();
        },
        error: error => {
          console.error('Error updating product:', error);
          this.snackBar.open('Error updating product', 'Close', { duration: 3000 });
          this.isUpdating = false;
          this.cdr.detectChanges();
        },
      });
  }

  deleteProduct(product: Product): void {
    if (confirm(`Are you sure you want to delete "${product.name}"?`)) {
      this.productManagement
        .execute({
          action: 'delete',
          data: { id: product.id },
        })
        .subscribe({
          next: response => {
            if (response.success) {
              this.snackBar.open('Product deleted successfully', 'Close', { duration: 3000 });
              this.loadProducts();
              this.loadStatistics();
            } else {
              this.snackBar.open(response.message || 'Failed to delete product', 'Close', {
                duration: 3000,
              });
            }
            this.cdr.detectChanges();
          },
          error: error => {
            console.error('Error deleting product:', error);
            this.snackBar.open('Error deleting product', 'Close', { duration: 3000 });
          },
        });
    }
  }

  onRowSelected(selectedRows: Product[]): void {
    this.selectedProducts = [...selectedRows];
    this.selectedProductIds = selectedRows.map(p => p.id);
    this.cdr.detectChanges();
  }

  bulkActivateProducts(): void {
    if (this.selectedProductIds.length === 0) {
      this.snackBar.open('No products selected', 'Close', { duration: 3000 });
      return;
    }

    this.productManagement
      .execute({
        action: 'bulk-operations',
        data: { activateProducts: this.selectedProductIds },
      })
      .subscribe({
        next: response => {
          this.snackBar.open(response.message || 'Bulk operation completed', 'Close', {
            duration: 3000,
          });
          this.selectedProducts = [];
          this.selectedProductIds = [];
          this.loadProducts();
          this.loadStatistics();
        },
        error: error => {
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

    this.productManagement
      .execute({
        action: 'bulk-operations',
        data: { deactivateProducts: this.selectedProductIds },
      })
      .subscribe({
        next: response => {
          this.snackBar.open(response.message || 'Bulk operation completed', 'Close', {
            duration: 3000,
          });
          this.selectedProducts = [];
          this.selectedProductIds = [];
          this.loadProducts();
          this.loadStatistics();
        },
        error: error => {
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
      this.productManagement
        .execute({
          action: 'bulk-operations',
          data: { deleteProducts: this.selectedProductIds },
        })
        .subscribe({
          next: response => {
            this.snackBar.open(response.message || 'Bulk operation completed', 'Close', {
              duration: 3000,
            });
            this.selectedProducts = [];
            this.selectedProductIds = [];
            this.loadProducts();
            this.loadStatistics();
          },
          error: error => {
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
    if (this.actionsTemplate && this.productImageTemplate) {
      // Update image column with template
      const imageColumn = this.productColumns.find(col => col.key === 'imageUrl');
      if (imageColumn) {
        imageColumn.templateOutlet = this.productImageTemplate;
      }

      // Update actions column with template
      const actionsColumn = this.productColumns.find(col => col.key === 'op');
      if (actionsColumn) {
        actionsColumn.templateOutlet = this.actionsTemplate;
      }

      console.log('Columns updated with templates:', this.productColumns);
    } else {
      console.log('Templates not ready yet:', {
        actionsTemplate: !!this.actionsTemplate,
        productImageTemplate: !!this.productImageTemplate,
      });
    }
  }
}
