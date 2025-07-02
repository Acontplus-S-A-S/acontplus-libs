import {Component, signal} from '@angular/core';

@Component({
  selector: 'app-user',
  imports: [],
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  users = signal<PaginatedResult<User> | null>(null);
  loading = signal(false);
  error = signal<string | null>(null);

  private pagination: PaginationParams = {
    page: 1,
    pageSize: 10,
    sortBy: 'name',
    sortDirection: 'asc',
  };

  constructor(private userUseCases: UserUseCases) {}

  ngOnInit() {
    this.loadUsers();
  }

  private loadUsers() {
    this.loading.set(true);
    this.error.set(null);

    this.userUseCases.getUsers(this.pagination).subscribe({
      next: (users) => {
        this.users.set(users);
        this.loading.set(false);
      },
      error: (useCaseResult: UseCaseResult<any>) => {
        // Handle the structured error response
        const errorMessage = useCaseResult.message || 'Failed to load users';
        this.error.set(errorMessage);
        this.loading.set(false);

        // Log detailed error information for debugging
        console.error('Use Case Error:', {
          code: useCaseResult.code,
          message: useCaseResult.message,
          errors: useCaseResult.errors,
          correlationId: useCaseResult.correlationId,
        });
      },
    });
  }

  createUser() {
    const userData: Omit<User, 'id'> = {
      name: 'New User',
      email: 'newuser@example.com',
      role: 'user',
    };

    this.userUseCases.createUser(userData).subscribe({
      next: (user) => {
        console.log('User created successfully:', user);
        this.loadUsers();
      },
      error: (useCaseResult: UseCaseResult<any>) => {
        this.handleCreateUserError(useCaseResult);
      },
    });
  }

  private handleCreateUserError(useCaseResult: UseCaseResult<any>) {
    // Handle specific error codes from your .NET backend
    switch (useCaseResult.code) {
      case 'USER_EMAIL_DUPLICATE':
        this.error.set('This email address is already in use');
        break;
      case 'USER_EMAIL_INVALID':
        this.error.set('Please enter a valid email address');
        break;
      case 'VALIDATION_FAILED':
        const validationMessages =
          useCaseResult.errors?.map((e) => e.message).join(', ') ||
          'Validation failed';
        this.error.set(validationMessages);
        break;
      default:
        this.error.set(useCaseResult.message || 'Failed to create user');
    }
  }

  editUser(id: number) {
    const updateData: Partial<User> = {
      name: 'Updated Name',
    };

    this.userUseCases.updateUser(id, updateData).subscribe({
      next: () => this.loadUsers(),
      error: (useCaseResult: UseCaseResult<any>) => {
        this.error.set(useCaseResult.message || 'Failed to update user');
      },
    });
  }

  deleteUser(id: number) {
    this.userUseCases.deleteUser(id).subscribe({
      next: () => this.loadUsers(),
      error: (useCaseResult: UseCaseResult<any>) => {
        this.error.set(useCaseResult.message || 'Failed to delete user');
      },
    });
  }
}
