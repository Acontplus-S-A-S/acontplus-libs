// src/lib/presentation/components/login/login.component.ts
import { ChangeDetectionStrategy, Component, inject, input, signal } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatCard, MatCardContent, MatCardFooter, MatCardHeader, MatCardTitle } from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatAnchor, MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';

@Component({
  selector: 'app-login',
  imports: [
    ReactiveFormsModule,
    MatCard,
    MatCardHeader,
    MatLabel,
    MatCardTitle,
    MatCardContent,
    MatFormField,
    MatInput,
    MatIcon,
    MatButton,
    MatCardFooter,
    MatTooltip,
    MatAnchor,
  ],
  template: `
    <section id="wrapper" class="d-flex justify-content-center align-items-center">
      <mat-card class="mat-elevation-z8 p-4 rounded">
        <mat-card-header>
          <mat-card-title class="text-center">{{ title() }}</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          @if (isLoginMode()) {
            <form [formGroup]="signinForm" (ngSubmit)="signIn()" class="d-flex flex-column gap-3">
              <mat-form-field class="w-100">
                <mat-label>Usuario</mat-label>
                <input matInput type="text" placeholder="Ingrese su usuario" formControlName="email" />
              </mat-form-field>

              <mat-form-field class="w-100">
                <mat-label>Contraseña</mat-label>
                <input matInput type="password" placeholder="Ingrese su contraseña" formControlName="password" />
              </mat-form-field>

              <div class="d-flex justify-content-center mt-3">
                <button
                  mat-raised-button
                  color="primary"
                  [disabled]="!signinForm.valid || isLoading()"
                  type="submit"
                  class="w-100"
                >
                  @if (isLoading()) {
                    Ingresando...
                  } @else {
                    <ng-container>Ingresar <mat-icon>login</mat-icon></ng-container>
                  }
                </button>
              </div>

              <!-- <div class="text-center mt-2">
                <button
                  mat-button
                  type="button"
                  (click)="toggleMode()"
                >
                  ¿No tienes cuenta? Regístrate
                </button>
              </div> -->
            </form>
          } @else {
            <form [formGroup]="signupForm" (ngSubmit)="registerUser()" class="d-flex flex-column gap-3">
              <mat-form-field class="w-100">
                <mat-label>Nombre</mat-label>
                <input matInput type="text" placeholder="Ingrese su nombre" formControlName="displayName" />
              </mat-form-field>

              <mat-form-field class="w-100">
                <mat-label>Email</mat-label>
                <input matInput type="email" placeholder="Ingrese su email" formControlName="email" />
              </mat-form-field>

              <mat-form-field class="w-100">
                <mat-label>Contraseña</mat-label>
                <input matInput type="password" placeholder="Ingrese su contraseña" formControlName="password" />
              </mat-form-field>

              <div class="d-flex justify-content-center mt-3">
                <button
                  mat-raised-button
                  color="primary"
                  [disabled]="!signupForm.valid || isLoading()"
                  type="submit"
                  class="w-100"
                >
                  @if (isLoading()) {
                    Registrando...
                  } @else {
                    <ng-container>Registrarse <mat-icon>person_add</mat-icon></ng-container>
                  }
                </button>
              </div>

              <div class="text-center mt-2">
                <button mat-button type="button" (click)="toggleMode()">¿Ya tienes cuenta? Inicia sesión</button>
              </div>
            </form>
          }
          @if (errorMessage()) {
            <div class="alert alert-danger mt-3" role="alert">
              {{ errorMessage() }}
            </div>
          }
        </mat-card-content>
        <mat-card-footer>
          <div class="row mt-3">
            <div class="col-xs-12 col-sm-12 col-md-12 m-t-10 text-center">
              <div class="social">
                <a
                  mat-button
                  color="primary"
                  matTooltip="Ir a Acontplus Web"
                  aria-label="Acontplus"
                  href="https://app.acontplus.com"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <mat-icon>arrow_outward</mat-icon>
                  Acontplus Web
                </a>
              </div>
            </div>
          </div>
        </mat-card-footer>
      </mat-card>
    </section>
  `,
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent {
  title = input<string>('Login');

  private readonly fb = inject(FormBuilder);
  private readonly loginUseCase = inject(LoginUseCase);
  private readonly registerUseCase = inject(RegisterUseCase);

  // Angular 20+ signals
  isLoginMode = signal(true);
  isLoading = signal(false);
  errorMessage = signal<string | null>(null);

  signinForm: FormGroup;
  signupForm: FormGroup;

  constructor() {
    this.signinForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required],
    });

    this.signupForm = this.fb.group({
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  toggleMode(): void {
    this.isLoginMode.set(!this.isLoginMode());
    this.errorMessage.set(null);
  }

  signIn(): void {
    if (this.signinForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      this.loginUseCase.execute(this.signinForm.value).subscribe({
        next: () => {
          this.isLoading.set(false);
        },
        error: error => {
          this.isLoading.set(false);
          this.errorMessage.set('Error al iniciar sesión. Verifique sus credenciales.');
          console.error('Login error:', error);
        },
      });
    }
  }

  registerUser(): void {
    if (this.signupForm.valid) {
      this.isLoading.set(true);
      this.errorMessage.set(null);

      this.registerUseCase.execute(this.signupForm.value).subscribe({
        next: () => {
          this.isLoading.set(false);
          this.signupForm.reset();
          this.isLoginMode.set(true);
        },
        error: error => {
          this.isLoading.set(false);
          this.errorMessage.set('Error al registrar usuario. Intente nuevamente.');
          console.error('Register error:', error);
        },
      });
    }
  }
}
