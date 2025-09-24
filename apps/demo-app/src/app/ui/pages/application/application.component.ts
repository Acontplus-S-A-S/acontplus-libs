import {
  Component,
  OnInit,
  AfterViewInit,
  TemplateRef,
  ViewChild,
  ChangeDetectorRef,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
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
import { ColumnDefinition, MatDynamicTableComponent, Pagination } from '@acontplus/ng-components';
import { ApplicationRepository } from '../../../data';
import { Application } from '../../../domain/application';
import { PaginationParams, FilterParams, PagedResult } from '@acontplus/core';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [
    CommonModule,
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
    MatDynamicTableComponent,
  ],
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
})
export class ApplicationComponent implements OnInit, AfterViewInit {
  private applicationRepository = inject(ApplicationRepository);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  // Data
  applications: Application[] = [];
  selectedApplications: number[] = [];

  // UI state
  isLoading = false;
  isCreating = false;
  isUpdating = false;

  // Pagination
  pagination = new PaginationParams({
    pageIndex: 1,
    pageSize: 10,
  });
  applicationPaginationConfig: Pagination = new Pagination(0, 10, 5, 0, [5, 10, 25, 50]);

  // Filters
  filters: FilterParams = {};
  searchQuery = '';

  // Form data
  newApplication: Partial<Application> = {};
  editApplicationId: number | null = null;
  editApplication: Partial<Application> = {};

  // Template references
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;
  @ViewChild('environmentTemplate') environmentTemplate!: TemplateRef<any>;

  // Column definitions
  applicationColumns: ColumnDefinition<Application>[] = [];

  // Status options
  statusOptions: Application['status'][] = ['active', 'inactive', 'maintenance', 'deprecated'];
  environmentOptions: Application['environment'][] = ['development', 'staging', 'production'];

  ngOnInit() {
    this.initializeColumns();
    this.loadApplications();
  }

  ngAfterViewInit() {
    this.updateColumnsWithTemplates();
  }

  private initializeColumns(): void {
    this.applicationColumns = [
      new ColumnDefinition<Application>({
        key: 'id',
        label: 'ID',
        type: 'number',
        width: '80px',
        order: 1,
      }),
      new ColumnDefinition<Application>({
        key: 'name',
        label: 'Name',
        type: 'string',
        isDefaultSearchField: true,
        required: true,
        order: 2,
        width: '200px',
      }),
      new ColumnDefinition<Application>({
        key: 'version',
        label: 'Version',
        type: 'string',
        order: 3,
        width: '120px',
      }),
      new ColumnDefinition<Application>({
        key: 'status',
        label: 'Status',
        type: 'template',
        order: 4,
        width: '120px',
      }),
      new ColumnDefinition<Application>({
        key: 'environment',
        label: 'Environment',
        type: 'template',
        order: 5,
        width: '140px',
      }),
      new ColumnDefinition<Application>({
        key: 'category',
        label: 'Category',
        type: 'string',
        order: 6,
        width: '150px',
      }),
      new ColumnDefinition<Application>({
        key: 'owner',
        label: 'Owner',
        type: 'string',
        order: 7,
        width: '150px',
      }),
      new ColumnDefinition<Application>({
        key: 'op',
        label: 'Actions',
        columnType: 'template',
        order: 8,
        width: '200px',
      }),
    ].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  private updateColumnsWithTemplates(): void {
    if (this.actionsTemplate && this.statusTemplate && this.environmentTemplate) {
      // Update status column with template
      const statusColumn = this.applicationColumns.find(col => col.key === 'status');
      if (statusColumn) {
        statusColumn.templateOutlet = this.statusTemplate;
      }

      // Update environment column with template
      const environmentColumn = this.applicationColumns.find(col => col.key === 'environment');
      if (environmentColumn) {
        environmentColumn.templateOutlet = this.environmentTemplate;
      }

      // Update actions column with template
      const actionsColumn = this.applicationColumns.find(col => col.key === 'op');
      if (actionsColumn) {
        actionsColumn.templateOutlet = this.actionsTemplate;
      }
    }
  }

  loadApplications(): void {
    this.isLoading = true;
    this.applicationRepository.getAll(this.pagination, this.filters).subscribe({
      next: (result: PagedResult<Application>) => {
        this.applications = result.items;
        this.applicationPaginationConfig.totalRecords = result.totalCount;
        this.applicationPaginationConfig.pageIndex = result.pageIndex - 1;
        this.applicationPaginationConfig.pageSize = result.pageSize;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error('Error loading applications:', error);
        this.snackBar.open('Error loading applications', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pagination.pageIndex = event.pageIndex + 1;
    this.pagination.pageSize = event.pageSize;
    this.applicationPaginationConfig.pageIndex = event.pageIndex;
    this.applicationPaginationConfig.pageSize = event.pageSize;
    this.loadApplications();
  }

  onSearch(): void {
    const query = this.searchQuery.trim();
    if (query) {
      this.filters.search = query;
    } else {
      delete this.filters.search;
    }
    this.pagination.pageIndex = 1;
    this.loadApplications();
  }

  clearFilters(): void {
    this.filters = {};
    this.searchQuery = '';
    this.pagination.pageIndex = 1;
    this.loadApplications();
  }

  createApplication(): void {
    if (!this.newApplication.name || !this.newApplication.version) {
      this.snackBar.open('Name and version are required', 'Close', { duration: 3000 });
      return;
    }

    this.isCreating = true;
    this.applicationRepository.create(this.newApplication as Omit<Application, 'id'>).subscribe({
      next: (application: Application) => {
        this.snackBar.open('Application created successfully', 'Close', { duration: 3000 });
        this.newApplication = {};
        this.loadApplications();
        this.isCreating = false;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error('Error creating application:', error);
        this.snackBar.open('Error creating application', 'Close', { duration: 3000 });
        this.isCreating = false;
        this.cdr.markForCheck();
      },
    });
  }

  startEdit(application: Application): void {
    this.editApplicationId = application.id;
    this.editApplication = { ...application };
    this.cdr.markForCheck();
  }

  cancelEdit(): void {
    this.editApplicationId = null;
    this.editApplication = {};
    this.cdr.markForCheck();
  }

  updateApplication(): void {
    if (!this.editApplicationId || !this.editApplication.name || !this.editApplication.version) {
      this.snackBar.open('Valid application data is required', 'Close', { duration: 3000 });
      return;
    }

    this.isUpdating = true;
    this.applicationRepository.update(this.editApplicationId, this.editApplication).subscribe({
      next: (application: Application) => {
        this.snackBar.open('Application updated successfully', 'Close', { duration: 3000 });
        this.editApplicationId = null;
        this.editApplication = {};
        this.loadApplications();
        this.isUpdating = false;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error('Error updating application:', error);
        this.snackBar.open(error.message || 'Error updating application', 'Close', { duration: 3000 });
        this.isUpdating = false;
        this.cdr.markForCheck();
      },
    });
  }

  deleteApplication(applicationId: number): void {
    if (confirm('Are you sure you want to delete this application?')) {
      this.applicationRepository.delete(applicationId).subscribe({
        next: (success: boolean) => {
          if (success) {
            this.snackBar.open('Application deleted successfully', 'Close', { duration: 3000 });
            this.loadApplications();
            this.cdr.markForCheck();
          } else {
            this.snackBar.open('Failed to delete application', 'Close', { duration: 3000 });
          }
        },
        error: (error: any) => {
          console.error('Error deleting application:', error);
          this.snackBar.open('Error deleting application', 'Close', { duration: 3000 });
        },
      });
    }
  }

  onRowSelected(selectedRows: Application[]): void {
    this.selectedApplications = selectedRows.map(application => application.id);
    this.cdr.markForCheck();
  }

  bulkActivateApplications(): void {
    if (this.selectedApplications.length === 0) {
      this.snackBar.open('No applications selected', 'Close', { duration: 3000 });
      return;
    }

    // For bulk operations, we'll need to implement bulk update in repository
    // For now, show a message
    this.snackBar.open('Bulk operations not yet implemented', 'Close', { duration: 3000 });
  }

  bulkDeactivateApplications(): void {
    if (this.selectedApplications.length === 0) {
      this.snackBar.open('No applications selected', 'Close', { duration: 3000 });
      return;
    }

    this.snackBar.open('Bulk operations not yet implemented', 'Close', { duration: 3000 });
  }

  bulkDeleteApplications(): void {
    if (this.selectedApplications.length === 0) {
      this.snackBar.open('No applications selected', 'Close', { duration: 3000 });
      return;
    }

    if (confirm(`Are you sure you want to delete ${this.selectedApplications.length} applications?`)) {
      // For bulk delete, we'll need to implement it in repository
      this.snackBar.open('Bulk delete not yet implemented', 'Close', { duration: 3000 });
    }
  }

  getSelectedCount(): number {
    return this.selectedApplications.length;
  }

  getStatusColor(status: Application['status']): string {
    switch (status) {
      case 'active':
        return 'primary';
      case 'inactive':
        return 'warn';
      case 'maintenance':
        return 'accent';
      case 'deprecated':
        return 'warn';
      default:
        return 'basic';
    }
  }

  getEnvironmentColor(environment: Application['environment']): string {
    switch (environment) {
      case 'development':
        return 'accent';
      case 'staging':
        return 'warn';
      case 'production':
        return 'primary';
      default:
        return 'basic';
    }
  }
}
