// src/lib/presentation/components/login/login.component.ts
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  input,
  signal,
  effect,
  computed,
  OnInit,
  TemplateRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormBuilder,
  Validators,
  ReactiveFormsModule,
  AbstractControl,
} from '@angular/forms';
import {
  MatCard,
  MatCardContent,
  MatCardFooter,
  MatCardHeader,
  MatCardTitle,
} from '@angular/material/card';
import { MatFormField, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatIcon } from '@angular/material/icon';
import { MatAnchor, MatButton } from '@angular/material/button';
import { LoginUseCase } from '../../application/use-cases/login.use-case';
import { RegisterUseCase } from '../../application/use-cases/register.use-case';

@Component({
  selector: 'acp-login',
  imports: [
    CommonModule,
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
    MatAnchor,
  ],
  templateUrl: `./login.component.html`,
  styleUrls: ['./login.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LoginComponent implements OnInit {
  title = input<string>('Login');
  showRegisterButton = input<boolean>(true);

  // Additional form controls that can be passed from parent components
  additionalSigninControls = input<Record<string, AbstractControl>>({});
  additionalSignupControls = input<Record<string, AbstractControl>>({});

  // Additional field templates
  additionalSigninFields = input<TemplateRef<any> | null>(null);
  additionalSignupFields = input<TemplateRef<any> | null>(null);

  // Footer content template
  footerContent = input<TemplateRef<any> | null>(null);

  // Computed signal to check if footer content exists
  hasFooterContent = computed(() => this.footerContent() !== null);

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

  ngOnInit(): void {
    // Add additional controls to signin form
    Object.entries(this.additionalSigninControls()).forEach(([key, control]) => {
      this.signinForm.addControl(key, control);
    });

    // Add additional controls to signup form
    Object.entries(this.additionalSignupControls()).forEach(([key, control]) => {
      this.signupForm.addControl(key, control);
    });
  }

  switchMode(): void {
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
