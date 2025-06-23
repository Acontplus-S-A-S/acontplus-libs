import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { DatePipe, JsonPipe } from '@angular/common';
import { ColumnDefinition, MatDynamicTableComponent, Pagination } from '@acontplus-ui-components';
interface Product {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  availableDate: Date;
  description?: string;
  imageUrl?: string;
  colorRow?: string; // For highlighting rows
}

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [
    MatDynamicTableComponent,
    MatIcon,
    MatIconButton,
    JsonPipe,
    DatePipe,
  ], // Import your table component
  template: `
    <h2>Product List</h2>

    <ng-template #actionsTemplate let-element="element" let-i="index">
      <button mat-icon-button color="primary" (click)="editProduct(element)">
        <mat-icon>edit</mat-icon>
      </button>
      <button mat-icon-button color="warn" (click)="deleteProduct(element)">
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
      />
    </ng-template>

    <ng-template
      #expandedProductDetail
      let-element="$implicit"
      let-index="index"
    >
      <div
        style="padding: 16px; background-color: #f0f0f0; border-top: 1px solid #ccc;"
      >
        <h3>Details for {{ element.name }} (Index: {{ index }})</h3>
        <p>
          <strong>Description:</strong>
          {{ element.description || 'No description available.' }}
        </p>
        <p><strong>Category:</strong> {{ element.category }}</p>
        <p>
          <strong>Available On:</strong>
          {{ element.availableDate | date : 'fullDate' }}
        </p>
        <p>Additional details can go here.</p>
      </div>
    </ng-template>

    <acp-mat-dynamic-table
      [tableData]="products"
      [columnDefinitions]="productColumns"
      [showSelectBox]="true"
      [showFooter]="true"
      [enablePagination]="true"
      [paginationConfig]="productPaginationConfig"
      [showExpand]="true"
      [expandedDetail]="expandedProductDetail"
      (rowSelected)="onRowSelected($event)"
      (pageEvent)="onPageChange($event)"
    >
    </acp-mat-dynamic-table>

    <h3>Selected Products:</h3>
    <pre>{{ selectedProducts | json }}</pre>
  `,
  styleUrl: './product.component.scss',
})
export class ProductComponent implements OnInit {
  products: Product[] = [];
  productColumns: ColumnDefinition<Product>[] = [];
  selectedProducts: Product[] = [];
  productPaginationConfig: Pagination = {
    totalRecords: 0,
    pageSize: 5,
    pageIndex: 0,
    pageSizeOptions: [5, 10, 25, 50],
    maxSize: 0,
    getTotalPages: function (): number {
      throw new Error('Function not implemented.');
    },
    updatePageSize: function (newPageSize: number): void {
      throw new Error('Function not implemented.');
    },
    updateFromPaginatorEvent: function (event: any): void {
      throw new Error('Function not implemented.');
    },
  };

  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ViewChild('productImageTemplate') productImageTemplate!: TemplateRef<any>;
  @ViewChild('expandedProductDetail') expandedProductDetail!: TemplateRef<any>;

  ngOnInit(): void {
    this.generateMockProducts(15); // Generate some mock data
    this.productPaginationConfig.totalRecords = this.products.length;
    this.defineColumns();
  }

  // Ensure templates are available before defining columns
  ngAfterViewInit() {
    this.defineColumns();
  }

  private defineColumns(): void {
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
        type: 'template', // Use template for image display
        templateOutlet: this.productImageTemplate,
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
        hasFooter: true, // Show sum in footer
        order: 5,
      }),
      new ColumnDefinition<Product>({
        key: 'stock',
        label: 'Stock',
        type: 'number',
        hasFooter: true, // Show sum in footer
        order: 6,
      }),
      new ColumnDefinition<Product>({
        key: 'availableDate',
        label: 'Available On',
        type: 'date',
        order: 7,
      }),
      new ColumnDefinition<Product>({
        key: 'op', // Key for operations column
        label: 'Actions',
        columnType: 'template', // This tells the table to look for a template
        templateOutlet: this.actionsTemplate, // Pass the template reference
        order: 8,
        width: '120px',
      }),
    ].sort((a, b) => (a.order || 0) - (b.order || 0)); // Sort by order
  }

  onRowSelected(selectedRows: Product[]): void {
    this.selectedProducts = selectedRows;
    // console.log('Selected Rows:', selectedRows);
  }

  editProduct(product: Product): void {
    // console.log('Edit product:', product);
    // Implement your edit logic here (e.g., open a dialog)
  }

  deleteProduct(product: Product): void {
    // console.log('Delete product:', product);
    // Implement your delete logic here (e.g., show confirmation dialog)
    this.products = this.products.filter((p) => p.id !== product.id);
    this.productPaginationConfig.totalRecords = this.products.length;
    // Re-assign dataSource data to refresh the table if needed
    // this.matTableComponent.dataSource.data = this.products; // Access via @ViewChild if you have it
  }

  onPageChange(event: PageEvent): void {
    // console.log('Page Event:', event);
    this.productPaginationConfig.pageIndex = event.pageIndex;
    this.productPaginationConfig.pageSize = event.pageSize;
    // In a real application, you would fetch data from an API based on pageIndex and pageSize
  }

  private generateMockProducts(count: number): void {
    const categories = [
      'Electronics',
      'Books',
      'Home & Kitchen',
      'Apparel',
      'Sports',
    ];
    for (let i = 1; i <= count; i++) {
      this.products.push({
        id: i,
        name: `Product ${i}`,
        category: categories[Math.floor(Math.random() * categories.length)],
        price: parseFloat((Math.random() * 100 + 10).toFixed(2)),
        stock: Math.floor(Math.random() * 200) + 1,
        availableDate: new Date(
          2023,
          Math.floor(Math.random() * 12),
          Math.floor(Math.random() * 28) + 1
        ),
        description: `This is a detailed description for Product ${i}. It is a fantastic item.`,
        imageUrl: `https://picsum.photos/id/${100 + i}/50/50`,
        colorRow: i % 3 === 0 ? '#e0ffe0' : undefined, // Example for row highlighting
      });
    }
  }
}
