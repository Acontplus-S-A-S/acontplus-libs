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
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ColumnDefinition, MatDynamicTableComponent, Pagination } from '@acontplus/ng-components';
import { UserRepository } from '../../data';
import { User } from '../../domain';
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
    MatCheckboxModule,
    MatSelectModule,
    MatIconModule,
    MatChipsModule,
    MatTooltipModule,
    MatProgressSpinnerModule,
    MatDynamicTableComponent,
  ],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss'],
})
export class UserComponent implements OnInit, AfterViewInit {
  private userRepository = inject(UserRepository);
  private snackBar = inject(MatSnackBar);
  private cdr = inject(ChangeDetectorRef);

  // Data
  users: User[] = [];
  selectedUsers: number[] = [];

  // UI state
  isLoading = false;
  isCreating = false;
  isUpdating = false;

  // Pagination
  pagination = new PaginationParams({
    pageIndex: 1,
    pageSize: 10,
  });
  userPaginationConfig: Pagination = new Pagination(0, 10, 5, 0, [5, 10, 25, 50]);

  // Filters
  filters: FilterParams = {};
  searchQuery = '';

  // Form data
  newUser: Partial<User> = {};
  editUserId: number | null = null;
  editUser: Partial<User> = {};

  // Template references
  @ViewChild('actionsTemplate') actionsTemplate!: TemplateRef<any>;
  @ViewChild('roleTemplate') roleTemplate!: TemplateRef<any>;
  @ViewChild('statusTemplate') statusTemplate!: TemplateRef<any>;

  // Column definitions
  userColumns: ColumnDefinition<User>[] = [];

  ngOnInit() {
    this.initializeColumns();
    this.loadUsers();
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
    this.userRepository.getAll(this.pagination, this.filters).subscribe({
      next: (result: PagedResult<User>) => {
        this.users = result.items;
        this.userPaginationConfig.totalRecords = result.totalCount;
        this.userPaginationConfig.pageIndex = result.pageIndex - 1;
        this.userPaginationConfig.pageSize = result.pageSize;
        this.isLoading = false;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error('Error loading users:', error);
        this.snackBar.open('Error loading users', 'Close', { duration: 3000 });
        this.isLoading = false;
        this.cdr.markForCheck();
      },
    });
  }

  onPageChange(event: PageEvent): void {
    this.pagination.pageIndex = event.pageIndex + 1;
    this.pagination.pageSize = event.pageSize;
    this.userPaginationConfig.pageIndex = event.pageIndex;
    this.userPaginationConfig.pageSize = event.pageSize;
    this.loadUsers();
  }

  onSearch(): void {
    this.pagination.pageIndex = 1;
    const query = this.searchQuery.trim();
    if (query) {
      this.filters.search = query;
    } else {
      delete this.filters.search;
    }
    this.loadUsers();
  }

  clearFilters(): void {
    this.filters = {};
    this.searchQuery = '';
    this.pagination.pageIndex = 1;
    this.loadUsers();
  }

  createUser(): void {
    if (!this.newUser.name || !this.newUser.email) {
      this.snackBar.open('Name and email are required', 'Close', { duration: 3000 });
      return;
    }

    this.isCreating = true;
    this.userRepository.create(this.newUser as Omit<User, 'id'>).subscribe({
      next: (user: User) => {
        this.snackBar.open('User created successfully', 'Close', { duration: 3000 });
        this.newUser = {};
        this.loadUsers();
        this.isCreating = false;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
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
    this.userRepository.update(this.editUserId, this.editUser).subscribe({
      next: (user: User) => {
        this.snackBar.open('User updated successfully', 'Close', { duration: 3000 });
        this.editUserId = null;
        this.editUser = {};
        this.loadUsers();
        this.isUpdating = false;
        this.cdr.markForCheck();
      },
      error: (error: any) => {
        console.error('Error updating user:', error);
        this.snackBar.open(error.message || 'Error updating user', 'Close', { duration: 3000 });
        this.isUpdating = false;
        this.cdr.markForCheck();
      },
    });
  }

  deleteUser(userId: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.userRepository.delete(userId).subscribe({
        next: (success: boolean) => {
          if (success) {
            this.snackBar.open('User deleted successfully', 'Close', { duration: 3000 });
            this.loadUsers();
            this.cdr.markForCheck();
          } else {
            this.snackBar.open('Failed to delete user', 'Close', { duration: 3000 });
          }
        },
        error: (error: any) => {
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

    this.userRepository
      .bulkUpdate(this.selectedUsers.map(id => ({ id, data: { isActive: true } })))
      .subscribe({
        next: (users: User[]) => {
          this.snackBar.open(`${users.length} users activated successfully`, 'Close', {
            duration: 3000,
          });
          this.selectedUsers = [];
          this.loadUsers();
          this.cdr.markForCheck();
        },
        error: (error: any) => {
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

    this.userRepository
      .bulkUpdate(this.selectedUsers.map(id => ({ id, data: { isActive: false } })))
      .subscribe({
        next: (users: User[]) => {
          this.snackBar.open(`${users.length} users deactivated successfully`, 'Close', {
            duration: 3000,
          });
          this.selectedUsers = [];
          this.loadUsers();
          this.cdr.markForCheck();
        },
        error: (error: any) => {
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
      this.userRepository.bulkDelete(this.selectedUsers).subscribe({
        next: (success: boolean) => {
          if (success) {
            this.snackBar.open('Users deleted successfully', 'Close', { duration: 3000 });
            this.selectedUsers = [];
            this.loadUsers();
            this.cdr.markForCheck();
          } else {
            this.snackBar.open('Failed to delete users', 'Close', { duration: 3000 });
          }
        },
        error: (error: any) => {
          console.error('Error in bulk operation:', error);
          this.snackBar.open('Error in bulk operation', 'Close', { duration: 3000 });
        },
      });
    }
  }

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
