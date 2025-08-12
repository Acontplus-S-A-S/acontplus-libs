import { BaseRepository, UpdateCommand, UseCaseResult, ValidationError } from '@acontplus-core';
import { Injectable } from '@angular/core';
import { User } from '../user';
import { Observable, switchMap, tap, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class UpdateUserCommand extends UpdateCommand<User> {
  constructor(
    private userRepository: BaseRepository<User>,
    // private userValidator: UserValidator,
    // private authService: AuthService,
    // private auditService: AuditService,
  ) {
    super();
  }

  execute(request: { id: number; data: Partial<User> }): Observable<User> {
    return this.userRepository.getById(request.id).pipe(
      switchMap(existingUser => {
        // Apply business rules for updates
        const updatedData = this.applyBusinessRules(existingUser, request.data);

        return this.userRepository.update(request.id, updatedData).pipe(
          tap(updatedUser => {
            // Log the update for audit purposes
            // this.auditService.logUserUpdate(
            //   existingUser,
            //   updatedUser,
            //   this.authService.getCurrentUserId(),
            // );

            // Handle role change notifications
            if (existingUser.role !== updatedUser.role) {
              this.handleRoleChange(updatedUser, existingUser.role);
            }
          }),
        );
      }),
      catchError(error => throwError(() => this.mapRepositoryError(error, request.id))),
    );
  }

  // protected validate(request: {
  //   id: number;
  //   data: Partial<User>;
  // }): ValidationError[] {
  //   return this.userValidator.validateForUpdate(request.data);
  // }

  // protected async checkAuthorization(request: {
  //   id: number;
  //   data: Partial<User>;
  // }): Promise<boolean> {
  //   // const hasPermission = await this.authService.hasPermission('users.update');
  //   // if (!hasPermission) return false;
  //   //
  //   // // Users can update their own profile (limited fields)
  //   // const currentUserId = this.authService.getCurrentUserId();
  //   // if (currentUserId === request.id) {
  //   //   return this.canUpdateOwnProfile(request.data);
  //   // }
  //   //
  //   // // Admin can update any user
  //   // const currentUserRole = this.authService.getCurrentUserRole();
  //   // return currentUserRole === 'admin';
  // }

  private canUpdateOwnProfile(data: Partial<User>): boolean {
    // Users can only update certain fields of their own profile
    const allowedFields = ['name', 'email'];
    const updatedFields = Object.keys(data);

    return updatedFields.every(field => allowedFields.includes(field));
  }

  private applyBusinessRules(existingUser: User, updateData: Partial<User>): Partial<User> {
    const result = { ...updateData };

    // Business rule: Email changes require verification
    if (updateData.email && updateData.email !== existingUser.email) {
      // In a real implementation, you might set a flag for email verification
      // result.metadata = {
      //   ...result.metadata,
      //   emailVerificationRequired: true,
      // };
    }

    // Business rule: Role changes have additional constraints
    if (updateData.role && updateData.role !== existingUser.role) {
      // const currentUserRole = this.authService.getCurrentUserRole();
      //
      // // Only admin can change roles
      // if (currentUserRole !== 'admin') {
      //   delete result.role;
      // }
    }

    return result;
  }

  private handleRoleChange(user: User, previousRole: string): void {
    // Handle side effects of role changes
    // e.g., send notification, update permissions cache, etc.
    console.log(`User ${user.name} role changed from ${previousRole} to ${user.role}`);
  }

  private mapRepositoryError(error: any, userId: number): UseCaseResult<User> {
    switch (error?.code) {
      case 'USER_NOT_FOUND':
        return this.createErrorResult('USER_NOT_FOUND', 'The user to update was not found', [
          {
            code: 'USER_NOT_FOUND',
            message: `User with ID ${userId} does not exist`,
            target: 'id',
            severity: 'error',
            category: 'business',
          },
        ]);

      case 'EMAIL_ALREADY_EXISTS':
        return this.createErrorResult('USER_EMAIL_DUPLICATE', 'Email address is already in use', [
          {
            code: 'USER_EMAIL_DUPLICATE',
            message: 'Another user is already using this email address',
            target: 'email',
            severity: 'error',
            category: 'business',
          },
        ]);

      default:
        return this.createErrorResult(
          'USER_UPDATE_FAILED',
          'Failed to update user',
          error?.errors || [
            {
              code: 'USER_UPDATE_FAILED',
              message: error?.message || 'Unknown error during user update',
              severity: 'error',
              category: 'infrastructure',
            },
          ],
        );
    }
  }
}
