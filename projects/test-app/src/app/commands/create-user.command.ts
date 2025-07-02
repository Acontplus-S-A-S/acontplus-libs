import { Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';

@Injectable()
export class CreateUserCommand extends CreateCommand<User> {
  constructor(
    private userRepository: BaseRepository<User>,
    private emailService: EmailService, // Domain service
    private userValidator: UserValidator, // Domain service
    private authService: AuthService,
  ) {
    super();
  }

  execute(request: Omit<User, 'id'>): Observable<User> {
    return this.userRepository.create(request).pipe(
      map((user) => {
        // Send welcome email as side effect
        this.sendWelcomeEmail(user);
        return user;
      }),
      catchError((error) => {
        // Transform repository errors to domain-specific errors
        return throwError(() => this.mapRepositoryError(error));
      }),
    );
  }

  protected validate(request: Omit<User, 'id'>): ValidationError[] {
    return this.userValidator.validateForCreation(request);
  }

  protected async checkAuthorization(
    request: Omit<User, 'id'>,
  ): Promise<boolean> {
    return this.authService.hasPermission('users.create');
  }

  private sendWelcomeEmail(user: User): void {
    try {
      this.emailService.sendWelcomeEmail(user.email, user.name);
    } catch (error) {
      // Log but don't fail the operation
      console.warn('Failed to send welcome email:', error);
    }
  }

  private mapRepositoryError(error: any): UseCaseResult<User> {
    // Map specific .NET backend error codes to domain errors
    switch (error?.code) {
      case 'EMAIL_ALREADY_EXISTS':
      case 'DUPLICATE_EMAIL':
        return this.createErrorResult(
          'USER_EMAIL_DUPLICATE',
          'A user with this email address already exists',
          [
            {
              code: 'USER_EMAIL_DUPLICATE',
              message: 'Email must be unique',
              target: 'email',
              severity: 'error',
              category: 'business',
            },
          ],
        );

      case 'INVALID_EMAIL_FORMAT':
        return this.createErrorResult(
          'USER_EMAIL_INVALID',
          'The provided email address is not valid',
          [
            {
              code: 'USER_EMAIL_INVALID',
              message: 'Email format is invalid',
              target: 'email',
              severity: 'error',
              category: 'validation',
            },
          ],
        );

      default:
        return this.createErrorResult(
          'USER_CREATION_FAILED',
          'Failed to create user',
          error?.errors || [
            {
              code: 'USER_CREATION_FAILED',
              message: error?.message || 'Unknown error during user creation',
              severity: 'error',
              category: 'infrastructure',
            },
          ],
        );
    }
  }
}
