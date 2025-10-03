import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { NotificationService } from '@acontplus/ng-notifications';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputChipComponent, MatThemeButtonComponent } from '@acontplus/ng-components';
import { MatButtonModule } from '@angular/material/button';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

import { ApplicationRepository } from '../../../data/application.repository';
import { Application } from '../../../domain/application';

@Component({
  selector: 'app-application-add-edit',
  imports: [
    CommonModule,
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatInputChipComponent,
    MatIcon,
    MatThemeButtonComponent,
  ],
  templateUrl: './application-add-edit.component.html',
  styleUrl: './application-add-edit.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplicationAddEditComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<ApplicationAddEditComponent>);
  private readonly applicationRepository = inject(ApplicationRepository);
  private readonly notificationService = inject(NotificationService);

  readonly data = inject<{ application?: Application }>(MAT_DIALOG_DATA);

  btnText = signal('Guardar');
  title = 'Nueva Aplicación';
  loading = false;

  dependencies: string[] = [];
  tags: string[] = [];

  statusOptions: Application['status'][] = ['active', 'inactive', 'maintenance', 'deprecated'];
  environmentOptions: Application['environment'][] = ['development', 'staging', 'production'];

  categoryOptions = [
    'Web Application',
    'API',
    'Mobile Application',
    'Dashboard',
    'Enterprise',
    'DevOps',
    'Testing',
    'Infrastructure',
    'Database',
    'Microservice',
  ];

  applicationForm = new FormGroup({
    name: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl('', [Validators.required, Validators.minLength(10)]),
    version: new FormControl('', [Validators.required, Validators.pattern(/^\d+\.\d+\.\d+$/)]),
    status: new FormControl<Application['status']>('active', [Validators.required]),
    category: new FormControl('', [Validators.required]),
    owner: new FormControl('', [Validators.required]),
    environment: new FormControl<Application['environment']>('development', [Validators.required]),
    isPublic: new FormControl(false),
    repositoryUrl: new FormControl(''),
    documentationUrl: new FormControl(''),
  });

  ngOnInit() {
    if (this.data?.application) {
      this.title = 'Editar Aplicación';
      this.btnText.set('Actualizar');
      this.loadApplicationData();
    }
  }

  private loadApplicationData() {
    const app = this.data.application!;
    this.applicationForm.patchValue({
      name: app.name,
      description: app.description,
      version: app.version,
      status: app.status,
      category: app.category,
      owner: app.owner,
      environment: app.environment,
      isPublic: app.isPublic,
      repositoryUrl: app.repositoryUrl || '',
      documentationUrl: app.documentationUrl || '',
    });

    this.dependencies = [...app.dependencies];
    this.tags = [...app.tags];
  }

  onDependencyChange(dependencies: string[]) {
    this.dependencies = dependencies;
  }

  onTagChange(tags: string[]) {
    this.tags = tags;
  }

  save() {
    if (this.applicationForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading = true;
    const formValue = this.applicationForm.value;

    const applicationData = {
      name: formValue.name!,
      description: formValue.description!,
      version: formValue.version!,
      status: formValue.status!,
      category: formValue.category!,
      owner: formValue.owner!,
      environment: formValue.environment!,
      isPublic: formValue.isPublic!,
      repositoryUrl: formValue.repositoryUrl || undefined,
      documentationUrl: formValue.documentationUrl || undefined,
      dependencies: this.dependencies,
      tags: this.tags,
    };

    if (this.data?.application) {
      // Update existing application
      this.applicationRepository.update(this.data.application.id, applicationData).subscribe({
        next: application => {
          this.notificationService.success({ message: 'Aplicación actualizada exitosamente' });
          this.dialogRef.close(application);
        },
        error: _error => {
          this.notificationService.error({ message: 'Error al actualizar la aplicación' });
          this.loading = false;
        },
      });
    } else {
      // Create new application
      this.applicationRepository.create(applicationData as Omit<Application, 'id'>).subscribe({
        next: application => {
          this.notificationService.success({ message: 'Aplicación creada exitosamente' });
          this.dialogRef.close(application);
        },
        error: _error => {
          this.notificationService.error({ message: 'Error al crear la aplicación' });
          this.loading = false;
        },
      });
    }
  }

  cancel() {
    this.dialogRef.close();
  }

  private markFormGroupTouched() {
    Object.keys(this.applicationForm.controls).forEach(key => {
      const control = this.applicationForm.get(key);
      control?.markAsTouched();
    });
  }

  getFieldError(fieldName: string): string {
    const control = this.applicationForm.get(fieldName);
    if (control?.errors && control.touched) {
      if (control.errors['required']) {
        return 'Este campo es requerido';
      }
      if (control.errors['minlength']) {
        return `Mínimo ${control.errors['minlength'].requiredLength} caracteres`;
      }
      if (control.errors['pattern']) {
        return 'Formato de versión inválido (ej: 1.0.0)';
      }
    }
    return '';
  }
}
