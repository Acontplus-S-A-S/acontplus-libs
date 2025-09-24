import {
  Component,
  OnInit,
  TemplateRef,
  ViewChild,
  AfterViewInit,
  ChangeDetectorRef,
  inject,
} from '@angular/core';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSortModule, Sort } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ColumnDefinition, MatDynamicTableComponent, Pagination } from '@acontplus/ng-components';
import {
  UserManagementUseCase,
  CachedUsersQuery,
  ConditionalUserUpdateCommand,
} from '../../../application';
import { User } from '../../../domain/user';
import { PaginationParams, FilterParams, PagedResult } from '@acontplus/core';

@Component({
  selector: 'app-user',
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
    MatSortModule,
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDynamicTableComponent,
  ],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent implements OnInit, AfterViewInit {
  private userManagement = inject(UserManagementUseCase);
  private cachedQuery = inject(CachedUsersQuery);
  private conditionalCommand = inject(ConditionalUserUpdateCommand);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  users: User[] = [];
  userColumns: ColumnDefinition<User>[] = [];

  // Pagination
  pagination: { pageIndex: number; pageSize: number; sortBy: string; sortDirection: string } = {
    pageIndex: 1,
    pageSize: 10,
    sortBy: 'name',
    sortDirection: 'asc',
  };

  // Pagination config for dynamic table
  userPaginationConfig: Pagination = new Pagination(0, 10, 5, 0, [5, 10, 25, 50]);

  // Filters
  filters: FilterParams = {};

  // Bulk operations
  selectedUsers: number[] = [];

  // Loading states
  isLoading = false;
  isCreating = false;
  isUpdating = false;

  // Form data
  newUser: Partial<User> = {};
  editUser: Partial<User> = {};
  editUserId: number | null = null;

  // Search
  searchQuery = '';

  // Statistics
  totalUsers = 0;
  activeUsers = 0;
  inactiveUsers = 0;

  // Template references
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ViewChild('roleTemplate') roleTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  /** Inserted by Angular inject() migration for backwards compatibility */
  constructor(...args: unknown[]);

  constructor() {}

  ngOnInit() {
    this.initializeColumns();
    this.loadUsers();
    this.loadStatistics();
  }

  ngAfterViewInit() {
    this.updateColumnsWithTemplates();
  }

  private initializeColumns(): void {
    this.userColumns = [
      new ColumnDefinition<User>({
        key: 'id',
        label: 'ID',
        type: 'number',
        width: '80px',
        order: 1,
      }),
      new ColumnDefinition<User>({
        key: 'name',
        label: 'Name',
        type: 'string',
        isDefaultSearchField: true,
        required: true,
        order: 2,
        width: '200px',
      }),
      new ColumnDefinition<User>({
        key: 'email',
        label: 'Email',
        type: 'string',
        order: 3,
        width: '250px',
      }),
      new ColumnDefinition<User>({
        key: 'role',
        label: 'Role',
        type: 'template',
        order: 4,
        width: '120px',
      }),
      new ColumnDefinition<User>({
        key: 'isActive',
        label: 'Status',
        type: 'template',
        order: 5,
        width: '120px',
      }),
      new ColumnDefinition<User>({
        key: 'op',
        label: 'Actions',
        columnType: 'template',
        order: 6,
        width: '200px',
      }),
    ].sort((a, b) => (a.order || 0) - (b.order || 0));
  }

  private updateColumnsWithTemplates(): void {
    if (this.actionsTemplate && this.roleTemplate && this.statusTemplate) {
      // Update role column with template
      const roleColumn = this.userColumns.find(col => col.key === 'role');
      if (roleColumn) {
        roleColumn.templateOutlet = this.roleTemplate;
      }

      // Update status column with template
      const statusColumn = this.userColumns.find(col => col.key === 'isActive');
      if (statusColumn) {
        statusColumn.templateOutlet = this.statusTemplate;
      }

      // Update actions column with template
      const actionsColumn = this.userColumns.find(col => col.key === 'op');
      if (actionsColumn) {
        actionsColumn.templateOutlet = this.actionsTemplate;
      }
    }
  }

  loadUsers(): void {
    this.isLoading = true;
    this.userManagement.getUsers(this.pagination, this.filters).subscribe({
      next: result => {
        this.users = result.items;
        this.totalUsers = result.totalCount;

        // Update pagination config to match the result
        this.userPaginationConfig.totalRecords = result.totalCount;
        this.userPaginationConfig.pageIndex = result.pageNumber - 1; // Convert to 0-based index
        this.userPaginationConfig.pageSize = result.pageSize;

        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: error => {
        console.error('Error loading users:', error);
        this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  loadStatistics(): void {
    this.userManagement.getUserStats().subscribe(stats => {
      this.totalUsers = stats.total;
      this.activeUsers = stats.active;
      this.inactiveUsers = stats.inactive;
      this.cdr.markForCheck();
    });
  }

  onPageChange(event: PageEvent): void {
    // Update both pagination objects to keep them in sync
    this.pagination.pageIndex = event.pageIndex + 1; // Convert from 0-based to 1-based
    this.pagination.pageSize = event.pageSize;

    this.userPaginationConfig.pageIndex = event.pageIndex;
    this.userPaginationConfig.pageSize = event.pageSize;

    this.loadUsers();
  }

  onSortChange(sort: Sort): void {
    this.pagination.sortBy = sort.active;
    this.pagination.sortDirection = sort.direction === 'asc' ? 'asc' : 'desc';
    this.loadUsers();
  }

  onFilterChange(): void {
    this.pagination.pageIndex = 0; // Reset to first page
    this.userPaginationConfig.pageSize = 1; // Reset to first page (0-based)
    this.loadUsers();
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
    this.onFilterChange();
  }

  createUser(): void {
    if (!this.newUser.name || !this.newUser.email) {
      this.snackBar.open('Name and email are required', 'Close', { duration: 3000 });
      return;
    }

    this.isCreating = true;
    this.userManagement.createUser(this.newUser as Omit<User, 'id'>).subscribe({
      next: user => {
        this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
        this.newUser = {};
        this.loadUsers();
        this.loadStatistics();
        this.isCreating = false;
        this.cdr.markForCheck();
      },
      error: error => {
        console.error('Error creating user:', error);
        this.snackBar.open('Error creating user', 'Close', { duration: 3000 });
        this.isCreating = false;
        this.cdr.markForCheck();
      },
    });
  }

  startEdit(user: User): void {
    this.editUserId = user.id;
    this.editUser = { ...user };
    this.cdr.markForCheck();
  }

  cancelEdit(): void {
    this.editUserId = null;
    this.editUser = {};
    this.cdr.markForCheck();
  }

  updateUser(): void {
    if (!this.editUserId || !this.editUser.name || !this.editUser.email) {
      this.snackBar.open('Valid user data is required', 'Close', { duration: 3000 });
      return;
    }

    this.isUpdating = true;

    // Use conditional command with approval requirement
    const request = {
      id: this.editUserId,
      data: this.editUser,
      conditions: {
        checkActive: true,
        requireApproval: true,
      },
    };

    this.conditionalCommand.execute(request).subscribe({
      next: user => {
        this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
        this.editUserId = null;
        this.editUser = {};
        this.loadUsers();
        this.loadStatistics();
        this.isUpdating = false;
        this.cdr.markForCheck();
      },
      error: error => {
        console.error('Error updating user:', error);
        this.snackBar.open(error.message || 'Error updating user', 'Close', { duration: 3000 });
        this.isUpdating = false;
        this.cdr.markForCheck();
      },
    });
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userManagement.deleteUser(userId).subscribe({
        next: success => {
          if (success) {
            this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
            this.loadUsers();
            this.loadStatistics();
            this.cdr.markForCheck();
          } else {
            this.snackBar.open('Failed to delete user', 'Close', { duration: 3000 });
          }
        },
        error: error => {
          console.error('Error deleting user:', error);
          this.snackBar.open('Error deleting user', 'Close', { duration: 3000 });
        },
      });
    }
  }

  onRowSelected(selectedRows: User[]): void {
    this.selectedUsers = selectedRows.map(user => user.id);
    this.cdr.markForCheck();
  }

  bulkActivateUsers(): void {
    if (this.selectedUsers.length === 0) {
      this.snackBar.open('No users selected', 'Close', { duration: 3000 });
      return;
    }

    this.userManagement
      .execute({
        action: 'bulk-operations',
        data: { activateUsers: this.selectedUsers },
      })
      .subscribe({
        next: response => {
          this.snackBar.open(response.message || 'Bulk operation completed', 'Close', {
            duration: 3000,
          });
          this.selectedUsers = [];
          this.loadUsers();
          this.loadStatistics();
          this.cdr.markForCheck();
        },
        error: error => {
          console.error('Error in bulk operation:', error);
          this.snackBar.open('Error in bulk operation', 'Close', { duration: 3000 });
        },
      });
  }

  bulkDeactivateUsers(): void {
    if (this.selectedUsers.length === 0) {
      this.snackBar.open('No users selected', 'Close', { duration: 3000 });
      return;
    }

    this.userManagement
      .execute({
        action: 'bulk-operations',
        data: { deactivateUsers: this.selectedUsers },
      })
      .subscribe({
        next: response => {
          this.snackBar.open(response.message || 'Bulk operation completed', 'Close', {
            duration: 3000,
          });
          this.selectedUsers = [];
          this.loadUsers();
          this.loadStatistics();
          this.cdr.markForCheck();
        },
        error: error => {
          console.error('Error in bulk operation:', error);
          this.snackBar.open('Error in bulk operation', 'Close', { duration: 3000 });
        },
      });
  }

  bulkDeleteUsers(): void {
    if (this.selectedUsers.length === 0) {
      this.snackBar.open('No users selected', 'Close', { duration: 3000 });
      return;
    }

    if (confirm(`Are you sure you want to delete ${this.selectedUsers.length} users?`)) {
      this.userManagement
        .execute({
          action: 'bulk-operations',
          data: { deleteUsers: this.selectedUsers },
        })
        .subscribe({
          next: response => {
            this.snackBar.open(response.message || 'Bulk operation completed', 'Close', {
              duration: 3000,
            });
            this.selectedUsers = [];
            this.loadUsers();
            this.loadStatistics();
            this.cdr.markForCheck();
          },
          error: error => {
            console.error('Error in bulk operation:', error);
            this.snackBar.open('Error in bulk operation', 'Close', { duration: 3000 });
          },
        });
    }
  }

  clearCache(): void {
    this.cachedQuery.clearCache();
    this.snackBar.open('Cache cleared', 'Close', { duration: 2000 });
    this.cdr.markForCheck();
  }

  // For testing conditional commands
  approveUser(userId: number): void {
    this.conditionalCommand.setApprovalStatus(userId, true);
    this.snackBar.open(`User ${userId} approved`, 'Close', { duration: 2000 });
    this.cdr.markForCheck();
  }

  rejectUser(userId: number): void {
    this.conditionalCommand.setApprovalStatus(userId, false);
    this.snackBar.open(`User ${userId} rejected`, 'Close', { duration: 2000 });
    this.cdr.markForCheck();
  }

  // Helper methods
  getSelectedCount(): number {
    return this.selectedUsers.length;
  }

  getRoleColor(role: string): string {
    switch (role.toLowerCase()) {
      case 'admin':
        return 'accent';
      case 'manager':
        return 'primary';
      case 'user':
        return 'basic';
      default:
        return 'basic';
    }
  }
}
