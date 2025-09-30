// src/lib/application/use-cases/register.use-case.ts
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { AuthRepository } from '../../domain/repositories/auth.repository';
import { RegisterRequest, User } from '../../domain/models/user';

@Injectable({
  providedIn: 'root',
})
export class RegisterUseCase {
  private readonly authRepository = inject(AuthRepository);
  private readonly router = inject(Router);

  execute(request: RegisterRequest): Observable<User> {
    return this.authRepository.register(request).pipe(
      tap(() => {
        this.router.navigate(['/', 'auth']);
      }),
    );
  }
}
