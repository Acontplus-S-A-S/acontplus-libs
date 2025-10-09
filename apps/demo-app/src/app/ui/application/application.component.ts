import {
  Component,
  OnInit,
  AfterViewInit,
  TemplateRef,
  ChangeDetectorRef,
  inject,
  viewChild,
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
import {
  ColumnDefinition,
  DynamicTableComponent,
  Pagination,
  AdvancedDialogService,
  TableContext,
  ButtonComponent,
} from '@acontplus/ng-components';
import { NotificationService } from '@acontplus/ng-notifications';
import { ApplicationRepository } from '../../data';
import { Application } from '../../domain/application';
import { PaginationParams, PagedResult } from '@acontplus/core';
import { ApplicationAddEditComponent } from './application-add-edit/application-add-edit.component';

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
    DynamicTableComponent,
    ButtonComponent,
  ],
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss'],
})
export class ApplicationComponent implements OnInit, AfterViewInit {
  private applicationRepository = inject(ApplicationRepository);
  private notificationService = inject(NotificationService);
  private cdr = inject(ChangeDetectorRef);
  private dialogService = inject(AdvancedDialogService);

  // Data
  applications: Application[] = [];
  selectedApplications: number[] = [];

  // UI state
  isLoading = false;

  // Pagination
  pagination = new PaginationParams({
    pageIndex: 1,
    pageSize: 10,
  });
  applicationPaginationConfig: Pagination = new Pagination(0, 10, 5, 0, [5, 10, 25, 50]);

  // Filters
  filters: Record<string, unknown> = {};
  searchQuery = '';

  // Template references
  readonly actionsTemplate =
    viewChild.required<TemplateRef<TableContext<Application>>>('actionsTemplate');
  readonly statusTemplate =
    viewChild.required<TemplateRef<TableContext<Application>>>('statusTemplate');
  readonly environmentTemplate =
    viewChild.required<TemplateRef<TableContext<Application>>>('environmentTemplate');

  // Column definitions
  applicationColumns: ColumnDefinition<Application>[] = [];

  // Status options
  statusOptions: Application['status'][] = [
    'pending',
    'processing',
    'completed',
    'failed',
    'active',
    'inactive',
    'maintenance',
    'deprecated',
  ];
  environmentOptions: Application['environment'][] = ['development', 'staging', 'production'];

  ngOnInit() {
    this.initializeColumns();
    this.loadApplications();
    // this.notificationService.toastr.show({
    //   type: 'info',
    //   message: 'Bulk operations not yet implemented',
    //   title: 'Info',
    // });
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
        type: 'template',
        order: 8,
        width: '200px',
      }),
    ].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  private updateColumnsWithTemplates(): void {
    const actionsTemplate = this.actionsTemplate();
    const statusTemplate = this.statusTemplate();
    const environmentTemplate = this.environmentTemplate();
    if (actionsTemplate && statusTemplate && environmentTemplate) {
      // Update status column with template
      const statusColumn = this.applicationColumns.find(col => col.key === 'status');
      if (statusColumn) {
        statusColumn.templateOutlet = statusTemplate;
      }

      // Update environment column with template
      const environmentColumn = this.applicationColumns.find(col => col.key === 'environment');
      if (environmentColumn) {
        environmentColumn.templateOutlet = environmentTemplate;
      }

      // Update actions column with template
      const actionsColumn = this.applicationColumns.find(col => col.key === 'op');
      if (actionsColumn) {
        actionsColumn.templateOutlet = actionsTemplate;
      }
    }
  }

  loadApplications(): void {
    this.isLoading = true;
    this.applicationRepository.getAll(this.pagination).subscribe({
      next: (result: PagedResult<Application>) => {
        this.applications = result.items.map(app => ({
          ...app,
          rowStyle: this.getRowStyleForStatus(app.status),
          disableSelection: app.status === 'processing' || app.status === 'maintenance',
        }));
        this.applicationPaginationConfig.totalRecords = result.totalCount;
        this.applicationPaginationConfig.pageIndex = result.pageIndex - 1;
        this.applicationPaginationConfig.pageSize = result.pageSize;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: _error => {
        this.notificationService.error({ message: 'Error loading applications' });
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  private getRowStyleForStatus(status: Application['status']): Record<string, string> {
    const isDark = document.documentElement.classList.contains('dark-theme');

    switch (status) {
      case 'pending':
        return isDark
          ? { backgroundColor: '#3d2914', color: '#ffb74d' }
          : { backgroundColor: '#fff3e0', color: '#e65100' };
      case 'processing':
        return isDark
          ? { backgroundColor: '#1a237e', color: '#90caf9' }
          : { backgroundColor: '#e3f2fd', color: '#1565c0' };
      case 'completed':
        return isDark
          ? { backgroundColor: '#1b5e20', color: '#81c784' }
          : { backgroundColor: '#e8f5e8', color: '#2e7d32' };
      case 'failed':
        return isDark
          ? { backgroundColor: '#b71c1c', color: '#ffcdd2' }
          : { backgroundColor: '#ffebee', color: '#c62828' };
      case 'maintenance':
        return isDark
          ? { backgroundColor: '#4a148c', color: '#ce93d8' }
          : { backgroundColor: '#fce4ec', color: '#ad1457' };
      case 'deprecated':
        return isDark
          ? { backgroundColor: '#424242', color: '#bdbdbd' }
          : { backgroundColor: '#f3e5f5', color: '#6a1b9a' };
      default:
        return {};
    }
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
      this.filters['search'] = query;
    } else {
      delete this.filters['search'];
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
    this.dialogService
      .openInWrapper(
        {
          component: ApplicationAddEditComponent,
          title: 'Nueva Aplicación',
          icon: 'add',
          data: {},
        },
        {
          size: 'lg',
        },
      )
      .then(dialogRef => {
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loadApplications();
          }
        });
      });
  }

  startEdit(application: Application): void {
    this.dialogService
      .openInWrapper(
        {
          component: ApplicationAddEditComponent,
          title: 'Editar Aplicación',
          icon: 'edit',
          data: { application },
        },
        {
          size: 'lg',
        },
      )
      .then(dialogRef => {
        dialogRef.afterClosed().subscribe(result => {
          if (result) {
            this.loadApplications();
          }
        });
      });
  }

  deleteApplication(applicationId: number): void {
    if (confirm('Are you sure you want to delete this application?')) {
      this.applicationRepository.delete(applicationId).subscribe({
        next: (success: boolean) => {
          if (success) {
            this.notificationService.success({ message: 'Application deleted successfully' });
            this.loadApplications();
            this.cdr.markForCheck();
          } else {
            this.notificationService.error({ message: 'Failed to delete application' });
          }
        },
        error: _error => {
          this.notificationService.error({ message: 'Error deleting application' });
        },
      });
    }
  }

  onRowSelected(selectedRows: Application[]): void {
    this.selectedApplications = selectedRows.map(application => application.id);
    console.info('Selected Applications:', selectedRows);
    console.info('Selected Application IDs:', this.selectedApplications);
    this.cdr.markForCheck();
  }

  bulkActivateApplications(): void {
    if (this.selectedApplications.length === 0) {
      this.notificationService.warning({ message: 'No applications selected' });
      return;
    }

    // For bulk operations, we'll need to implement bulk update in repository
    // For now, show a message
    this.notificationService.info({ message: 'Bulk operations not yet implemented' });
  }

  bulkDeactivateApplications(): void {
    if (this.selectedApplications.length === 0) {
      this.notificationService.warning({ message: 'No applications selected' });
      return;
    }

    this.notificationService.info({ message: 'Bulk operations not yet implemented' });
  }

  bulkDeleteApplications(): void {
    if (this.selectedApplications.length === 0) {
      this.notificationService.warning({ message: 'No applications selected' });
      return;
    }

    if (
      confirm(`Are you sure you want to delete ${this.selectedApplications.length} applications?`)
    ) {
      // For bulk delete, we'll need to implement it in repository
      this.notificationService.info({ message: 'Bulk delete not yet implemented' });
    }
  }

  getSelectedCount(): number {
    return this.selectedApplications.length;
  }

  getStatusColor(status: Application['status']): string {
    switch (status) {
      case 'pending':
        return 'accent';
      case 'processing':
        return 'primary';
      case 'completed':
        return 'primary';
      case 'failed':
        return 'warn';
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
