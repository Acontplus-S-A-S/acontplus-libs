import { Component, ViewChild, TemplateRef, AfterViewInit, signal } from '@angular/core';
import { FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from '@acontplus/ng-auth';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';

@Component({
  selector: 'app-auth-layout',
  imports: [
    LoginComponent,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatOptionModule,
    ReactiveFormsModule,
  ],
  templateUrl: './auth-layout.component.html',
  styleUrl: './auth-layout.component.scss',
})
export class AuthLayoutComponent implements AfterViewInit {
  @ViewChild('signinFields') signinFieldsRef!: TemplateRef<any>;
  @ViewChild('signupFields') signupFieldsRef!: TemplateRef<any>;

  signinFields = signal<TemplateRef<any> | null>(null);
  signupFields = signal<TemplateRef<any> | null>(null);

  companies = [
    { id: 1, name: 'Acontplus Corp' },
    { id: 2, name: 'Demo Company' },
    { id: 3, name: 'Test Organization' },
  ];

  // Additional controls for signin form
  signinExtras = {
    companyId: new FormControl('', Validators.required),
  };

  // Additional controls for signup form
  signupExtras = {
    companyId: new FormControl('', Validators.required),
    role: new FormControl('', Validators.required),
    validationPin: new FormControl('', [Validators.required, Validators.pattern(/^\d{6}$/)]),
  };

  ngAfterViewInit() {
    this.signinFields.set(this.signinFieldsRef);
    this.signupFields.set(this.signupFieldsRef);
  }
}
