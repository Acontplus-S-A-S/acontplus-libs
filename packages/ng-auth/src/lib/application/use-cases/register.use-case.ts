// src/lib/application/use-cases/register.use-case.ts
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { BaseUseCase } from '@acontplus/ng-infrastructure';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { RegisterRequest } from '../../domain/models/auth';
import { AuthTokens } from '@acontplus/core';
import { AuthStore } from '../../ui/stores/auth.store';

@Injectable({
  providedIn: 'root',
})
export class RegisterUseCase extends BaseUseCase<RegisterRequest, AuthTokens> {
  private readonly authRepository = inject(AuthRepository);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);

  execute(request: RegisterRequest): Observable<AuthTokens> {
    return this.authRepository.register(request).pipe(
      tap(tokens => {
        // Set authentication state
        this.authStore.setAuthenticated(tokens);

        // Navigate to main page
        this.router.navigate(['/']);
      }),
    );
  }
}
