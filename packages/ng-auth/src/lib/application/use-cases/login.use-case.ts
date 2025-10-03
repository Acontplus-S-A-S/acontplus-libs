// src/lib/application/use-cases/login.use-case.ts
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { BaseUseCase } from '@acontplus/ng-infrastructure';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { LoginRequest } from '../../domain/models/auth';
import { AuthTokens } from '@acontplus/core';
import { AuthStore } from '../../ui/stores/auth.store';
import { UrlRedirectService } from '../../services/url-redirect.service';

@Injectable({
  providedIn: 'root',
})
export class LoginUseCase extends BaseUseCase<LoginRequest, AuthTokens> {
  private readonly authRepository = inject(AuthRepository);
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly urlRedirectService = inject(UrlRedirectService);

  execute(request: LoginRequest): Observable<AuthTokens> {
    return this.authRepository.login(request).pipe(
      tap(tokens => {
        // Set authentication state with rememberMe preference
        this.authStore.setAuthenticated(tokens, request.rememberMe ?? false);

        // Redirect to intended URL or default route
        this.urlRedirectService.redirectToIntendedUrl('/');
      }),
    );
  }
}
