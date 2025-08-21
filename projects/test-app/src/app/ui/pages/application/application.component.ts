import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatTabsModule } from '@angular/material/tabs';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatBadgeModule } from '@angular/material/badge';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subject, takeUntil, Observable } from 'rxjs';
import { Application, ApplicationFilterParams } from '../../domain/application';
import { ApplicationManagementUseCase } from '../../application/application-management.use-case';
import { PaginationParams, PaginatedResult } from '@acontplus-core';

@Component({
  selector: 'app-application',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatInputModule,
    MatSelectModule,
    MatChipsModule,
    MatIconModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatDialogModule,
    MatTabsModule,
    MatExpansionModule,
    MatBadgeModule,
    MatProgressSpinnerModule
  ],
  templateUrl: './application.component.html',
  styleUrls: ['./application.component.scss']
})
export class ApplicationComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>();

  // Data
  applications: Application[] = [];
  selectedApplication: Application | null = null;
  totalApplications = 0;
  loading = false;

  // Pagination
  currentPage = 1;
  pageSize = 10;
  pageSizeOptions = [5, 10, 25, 50];

  // Sorting
  currentSort: Sort = { active: 'name', direction: 'asc' };

  // Filters
  filters: ApplicationFilterParams = {};
  searchQuery = '';
  statusFilter: Application['status'] | '' = '';
  environmentFilter: Application['environment'] | '' = '';
  categoryFilter = '';

  // Forms
  applicationForm: FormGroup;
  searchForm: FormGroup;

  // Statistics
  stats$: Observable<{
    total: number;
    byStatus: Record<Application['status'], number>;
    byEnvironment: Record<Application['environment'], number>;
    byCategory: Record<string, number>;
  }>;

  // Table columns
  displayedColumns = ['name', 'version', 'status', 'environment', 'category', 'owner', 'actions'];

  // Status options
  statusOptions: Application['status'][] = ['active', 'inactive', 'maintenance', 'deprecated'];
  environmentOptions: Application['environment'][] = ['development', 'staging', 'production'];

  constructor(
    private applicationUseCase: ApplicationManagementUseCase,
    private formBuilder: FormBuilder,
    private snackBar: MatSnackBar,
    private dialog: MatDialog
  ) {
    this.applicationForm = this.formBuilder.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      version: ['', [Validators.required, Validators.pattern(/^\d+\.\d+\.\d+$/)]],
      status: ['active', Validators.required],
      category: ['', Validators.required],
      owner: ['', Validators.required],
      environment: ['development', Validators.required],
      isPublic: [false],
      repositoryUrl: [''],
      documentationUrl: [''],
      dependencies: [[]],
      tags: [[]]
    });

    this.searchForm = this.formBuilder.group({
      searchQuery: [''],
      status: [''],
      environment: [''],
      category: ['']
    });

    this.stats$ = this.applicationUseCase.getApplicationStatistics();
  }

  ngOnInit(): void {
    this.loadApplications();
    this.setupFormSubscriptions();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private setupFormSubscriptions(): void {
    this.searchForm.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(values => {
        this.filters = {
          search: values.searchQuery || undefined,
          status: values.status || undefined,
          environment: values.environment || undefined,
          category: values.category || undefined
        };
        this.currentPage = 1;
        this.loadApplications();
      });
  }

  private loadApplications(): void {
    this.loading = true;
    const pagination: PaginationParams = {
      page: this.currentPage,
      pageSize: this.pageSize,
      sortBy: this.currentSort.active,
      sortDirection: this.currentSort.direction
    };

    this.applicationUseCase.getApplications(pagination, this.filters)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (result) => {
          this.applications = result.items;
          this.totalApplications = result.totalCount;
          this.loading = false;
        },
        error: (error) => {
          console.error('Error loading applications:', error);
          this.snackBar.open('Error loading applications', 'Close', { duration: 3000 });
          this.loading = false;
        }
      });
  }

  onPageChange(event: PageEvent): void {
    this.currentPage = event.pageIndex + 1;
    this.pageSize = event.pageSize;
    this.loadApplications();
  }

  onSortChange(sort: Sort): void {
    this.currentSort = sort;
    this.loadApplications();
  }

  onCreateApplication(): void {
    if (this.applicationForm.valid) {
      const applicationData = this.applicationForm.value;
      this.loading = true;

      this.applicationUseCase.createApplication(applicationData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (application) => {
            this.snackBar.open('Application created successfully', 'Close', { duration: 3000 });
            this.applicationForm.reset({
              status: 'active',
              environment: 'development',
              isPublic: false,
              dependencies: [],
              tags: []
            });
            this.loadApplications();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error creating application:', error);
            this.snackBar.open('Error creating application', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
    }
  }

  onUpdateApplication(application: Application): void {
    this.selectedApplication = application;
    this.applicationForm.patchValue(application);
  }

  onSaveUpdate(): void {
    if (this.selectedApplication && this.applicationForm.valid) {
      const updateData = this.applicationForm.value;
      this.loading = true;

      this.applicationUseCase.updateApplication(this.selectedApplication.id, updateData)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (application) => {
            this.snackBar.open('Application updated successfully', 'Close', { duration: 3000 });
            this.selectedApplication = null;
            this.applicationForm.reset({
              status: 'active',
              environment: 'development',
              isPublic: false,
              dependencies: [],
              tags: []
            });
            this.loadApplications();
            this.loading = false;
          },
          error: (error) => {
            console.error('Error updating application:', error);
            this.snackBar.open('Error updating application', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
    }
  }

  onDeleteApplication(application: Application): void {
    if (confirm(`Are you sure you want to delete ${application.name}?`)) {
      this.loading = true;

      this.applicationUseCase.deleteApplication(application.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (success) => {
            if (success) {
              this.snackBar.open('Application deleted successfully', 'Close', { duration: 3000 });
              this.loadApplications();
            } else {
              this.snackBar.open('Failed to delete application', 'Close', { duration: 3000 });
            }
            this.loading = false;
          },
          error: (error) => {
            console.error('Error deleting application:', error);
            this.snackBar.open('Error deleting application', 'Close', { duration: 3000 });
            this.loading = false;
          }
        });
    }
  }

  onUpdateStatus(application: Application, status: Application['status']): void {
    this.applicationUseCase.updateApplicationStatus(application.id, status)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedApp) => {
          this.snackBar.open(`Status updated to ${status}`, 'Close', { duration: 3000 });
          this.loadApplications();
        },
        error: (error) => {
          console.error('Error updating status:', error);
          this.snackBar.open('Error updating status', 'Close', { duration: 3000 });
        }
      });
  }

  onDeploy(application: Application, environment: Application['environment']): void {
    this.applicationUseCase.deployApplication(application.id, environment)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (deployedApp) => {
          this.snackBar.open(`Application deployed to ${environment}`, 'Close', { duration: 3000 });
          this.loadApplications();
        },
        error: (error) => {
          console.error('Error deploying application:', error);
          this.snackBar.open('Error deploying application', 'Close', { duration: 3000 });
        }
      });
  }

  onAddDependency(application: Application, dependency: string): void {
    if (dependency.trim()) {
      this.applicationUseCase.addApplicationDependency(application.id, dependency.trim())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedApp) => {
            this.snackBar.open(`Dependency ${dependency} added`, 'Close', { duration: 3000 });
            this.loadApplications();
          },
          error: (error) => {
            console.error('Error adding dependency:', error);
            this.snackBar.open('Error adding dependency', 'Close', { duration: 3000 });
          }
        });
    }
  }

  onRemoveDependency(application: Application, dependency: string): void {
    this.applicationUseCase.removeApplicationDependency(application.id, dependency)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedApp) => {
          this.snackBar.open(`Dependency ${dependency} removed`, 'Close', { duration: 3000 });
          this.loadApplications();
        },
        error: (error) => {
          console.error('Error removing dependency:', error);
          this.snackBar.open('Error removing dependency', 'Close', { duration: 3000 });
        }
      });
  }

  onAddTag(application: Application, tag: string): void {
    if (tag.trim()) {
      this.applicationUseCase.addApplicationTag(application.id, tag.trim())
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: (updatedApp) => {
            this.snackBar.open(`Tag ${tag} added`, 'Close', { duration: 3000 });
            this.loadApplications();
          },
          error: (error) => {
            console.error('Error adding tag:', error);
            this.snackBar.open('Error adding tag', 'Close', { duration: 3000 });
          }
        });
    }
  }

  onRemoveTag(application: Application, tag: string): void {
    this.applicationUseCase.removeApplicationTag(application.id, tag)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (updatedApp) => {
          this.snackBar.open(`Tag ${tag} removed`, 'Close', { duration: 3000 });
          this.loadApplications();
        },
        error: (error) => {
          console.error('Error removing tag:', error);
          this.snackBar.open('Error removing tag', 'Close', { duration: 3000 });
        }
      });
  }

  onCancelEdit(): void {
    this.selectedApplication = null;
    this.applicationForm.reset({
      status: 'active',
      environment: 'development',
      isPublic: false,
      dependencies: [],
      tags: []
    });
  }

  getStatusColor(status: Application['status']): string {
    switch (status) {
      case 'active': return 'primary';
      case 'inactive': return 'warn';
      case 'maintenance': return 'accent';
      case 'deprecated': return 'warn';
      default: return 'primary';
    }
  }

  getEnvironmentColor(environment: Application['environment']): string {
    switch (environment) {
      case 'development': return 'accent';
      case 'staging': return 'warn';
      case 'production': return 'primary';
      default: return 'primary';
    }
  }
}
