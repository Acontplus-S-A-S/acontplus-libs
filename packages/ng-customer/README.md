# @acontplus/ng-customer

Angular customer management library following clean architecture principles. Provides comprehensive customer CRUD operations with Angular Material UI components, domain-driven design patterns, and external SRI integration.

## Installation

```bash
npm install @acontplus/ng-customer
```

## Features

- **Clean Architecture**: Domain, Application, Infrastructure, and UI layers
- **Customer Components**: Card display and add/edit form components
- **SRI Integration**: External customer data validation and retrieval
- **Use Cases**: Business logic for customer operations (CRUD)
- **BaseRepository Pattern**: Data access abstractions with HTTP implementations
- **DTOs and Mappers**: Data transformation and mapping utilities
- **Form Validation**: Comprehensive validation including Ecuadorian ID/RUC
- **Angular Material**: Consistent Material Design components

## Quick Start

### 1. Import Components

```typescript
import { CustomerCard, CustomerAddEditComponent } from '@acontplus/ng-customer';

@Component({
  selector: 'app-customers',
  imports: [CustomerCard],
  template: `
    <acp-customer-card
      [customer]="customer"
      (editCustomer)="onEdit($event)"
      (deleteCustomer)="onDelete($event)"
    >
    </acp-customer-card>
  `,
})
export class CustomersComponent {
  customer: CustomerListItemDto = {
    idCliente: 1,
    businessName: 'Acme Corp',
    email: 'contact@acme.com',
    phone: '123-456-7890',
  };

  onEdit(customer: CustomerListItemDto) {
    // Handle edit action
  }

  onDelete(customer: CustomerListItemDto) {
    // Handle delete action
  }
}
```

### 2. Customer Add/Edit Dialog

```typescript
import { MatDialog } from '@angular/material/dialog';
import { CustomerAddEditComponent } from '@acontplus/ng-customer';

@Component({...})
export class CustomerListComponent {
  constructor(private dialog: MatDialog) {}

  openCustomerDialog(customer?: any) {
    const dialogRef = this.dialog.open(CustomerAddEditComponent, {
      width: '800px',
      data: {
        id: customer?.id || 0,
        descripcion: customer ? 'Editar Cliente' : 'Nuevo Cliente',
        data: customer || {}
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // Handle successful save
        console.log('Customer saved:', result);
      }
    });
  }
}
```

## Architecture Layers

### Domain Layer

**Entities:**

```typescript
// Customer entity with business logic
export class Customer {
  constructor(
    public readonly id: number,
    public readonly businessName: string,
    public readonly identificationNumber: string,
    public readonly email?: string,
  ) {}

  isValidForCredit(): boolean {
    // Business logic for credit validation
    return this.identificationNumber.length >= 10;
  }
}

// External customer entity for SRI integration
export class CustomerExternal {
  constructor(
    public readonly idCard: string,
    public readonly businessName: string,
    public readonly address: string,
  ) {}
}
```

**BaseRepository Interfaces:**

```typescript
export interface CustomerRepository {
  getById(id: number): Promise<Customer>;
  create(customer: CreateCustomerDto): Promise<Customer>;
  update(id: number, customer: UpdateCustomerDto): Promise<Customer>;
  delete(id: number): Promise<void>;
  checkExistence(identificationNumber: string): Promise<boolean>;
}

export interface CustomerExternalRepository {
  getById(identificationNumber: string): Promise<CustomerExternal>;
}
```

### Application Layer

**Use Cases:**

```typescript
// Customer business operations
export class CustomerUseCase {
  constructor(private repository: CustomerRepository) {}

  async create(dto: CreateCustomerDto): Promise<ApiResponse<Customer>> {
    // Business validation
    if (!this.isValidIdentification(dto.numeroIdentificacion)) {
      throw new Error('Invalid identification number');
    }

    return await this.repository.create(dto);
  }

  async getFormData(): Promise<ApiResponse<FormData>> {
    // Load form dropdown data
    return await this.repository.getFormData();
  }

  private isValidIdentification(id: string): boolean {
    // Ecuadorian ID/RUC validation logic
    return id.length >= 10;
  }
}

// External SRI integration
export class CustomerExternalUseCase {
  constructor(private repository: CustomerExternalRepository) {}

  async getById(identificationNumber: string): Promise<ApiResponse<CustomerExternal>> {
    return await this.repository.getById(identificationNumber);
  }
}
```

### Infrastructure Layer

**DTOs:**

```typescript
export interface CustomerListItemDto {
  idCliente: number;
  businessName: string;
  email?: string;
  phone?: string;
  identificationNumber?: string;
}

export interface CreateCustomerDto {
  nombreFiscal: string;
  nombreComercial?: string;
  numeroIdentificacion: string;
  idTipoIdentificacion: number;
  direccion: string;
  correo?: string;
  telefono?: string;
}
```

**HTTP Repositories:**

```typescript
export class CustomerHttpRepository implements CustomerRepository {
  constructor(private http: HttpClient) {}

  async getById(id: number): Promise<Customer> {
    const response = await firstValueFrom(
      this.http.get<ApiResponse<CustomerDto>>(`/api/customers/${id}`),
    );
    return CustomerMapper.toDomain(response.data);
  }

  async create(dto: CreateCustomerDto): Promise<Customer> {
    const response = await firstValueFrom(
      this.http.post<ApiResponse<CustomerDto>>('/api/customers', dto),
    );
    return CustomerMapper.toDomain(response.data);
  }
}
```

**Mappers:**

```typescript
export class CustomerMapper {
  static toDomain(dto: CustomerDto): Customer {
    return new Customer(dto.idCliente, dto.nombreFiscal, dto.numeroIdentificacion, dto.correo);
  }

  static toDto(customer: Customer): CustomerDto {
    return {
      idCliente: customer.id,
      nombreFiscal: customer.businessName,
      numeroIdentificacion: customer.identificationNumber,
      correo: customer.email,
    };
  }
}
```

### UI Layer

**Customer Card Component:**

```typescript
@Component({
  selector: 'acp-customer-card',
  template: `
    <mat-card>
      <mat-card-header>
        <div mat-card-avatar class="customer-avatar">
          {{ getLogoSliceBusinessName() }}
        </div>
        <mat-card-title>{{ customer().businessName }}</mat-card-title>
        <mat-card-subtitle>{{ customer().email }}</mat-card-subtitle>
      </mat-card-header>

      <mat-card-content>
        <p><strong>ID:</strong> {{ customer().identificationNumber }}</p>
        <p><strong>Phone:</strong> {{ customer().phone }}</p>
      </mat-card-content>

      <mat-card-actions>
        <button mat-button (click)="onEditClick()">Edit</button>
        <button mat-button color="warn" (click)="onDeleteClick()">Delete</button>
      </mat-card-actions>
    </mat-card>
  `,
})
export class CustomerCard {
  customer = input.required<CustomerListItemDto>();
  editCustomer = output<CustomerListItemDto>();
  deleteCustomer = output<CustomerListItemDto>();

  getLogoSliceBusinessName = computed(() => {
    return this.customer()?.businessName?.slice(0, 1) || '?';
  });
}
```

## Advanced Features

### SRI Integration

Automatic customer data retrieval from Ecuador's SRI (Tax Service):

```typescript
// Automatic SRI lookup on ID number input
onKeyDownGovernmentId() {
  const identificationNumber = this.customerForm.get('numeroIdentificacion')?.value;
  const identificationType = this.customerForm.get('idTipoIdentificacion')?.value;

  if (identificationNumber && identificationType) {
    this.customerExternalUseCase.getById(identificationNumber)
      .subscribe(response => {
        if (response.success) {
          // Auto-fill form with SRI data
          this.customerForm.patchValue({
            nombreFiscal: response.data.businessName,
            direccion: response.data.address,
            validationSri: true
          });
        }
      });
  }
}
```

### Form Validation

Comprehensive validation including Ecuadorian ID/RUC:

```typescript
// Custom validator for RUC format (must end with 001)
endsWith001Validator(control: AbstractControl): ValidationErrors | null {
  const value = control.value;
  if (value && value.length >= 3 && !value.endsWith('001')) {
    return { endsWith001: true };
  }
  return null;
}

// Dynamic validation based on identification type
updateFormControlNumeroIdentificacion(codigoSri: string): void {
  const idNumberControl = this.customerForm.get('numeroIdentificacion');

  if (codigoSri === SRI_DOCUMENT_TYPE.CEDULA) {
    idNumberControl?.setValidators([
      Validators.required,
      Validators.pattern(/^\d+$/),
      Validators.minLength(10),
      Validators.maxLength(10)
    ]);
  } else if (codigoSri === SRI_DOCUMENT_TYPE.RUC) {
    idNumberControl?.setValidators([
      Validators.required,
      Validators.pattern(/^\d+$/),
      Validators.minLength(13),
      Validators.maxLength(13),
      this.endsWith001Validator
    ]);
  }

  idNumberControl?.updateValueAndValidity();
}
```

### Multi-Contact Support

Handle multiple emails, phones, and license plates:

```typescript
// Arrays for multiple contact methods
emails: string[] = [];
telephones: string[] = [];
placas = signal<string[]>([]);

// Save with concatenated values
onSave() {
  this.customerForm.patchValue({
    telefono: this.telephones.join('|'),
    correo: this.emails.join('|'),
    placa: this.placas().join('|')
  });

  // Submit form...
}
```

## API Reference

### Components

- **CustomerCard**: Display customer information in card format
- **CustomerAddEditComponent**: Form for creating/editing customers

### Use Cases

- **CustomerUseCase**: Main customer business operations
- **CustomerExternalUseCase**: SRI integration operations

### Repositories

- **CustomerHttpRepository**: HTTP-based customer data access
- **CustomerExternalHttpRepository**: External SRI data access

### DTOs

- **CustomerListItemDto**: Customer list display data
- **CreateCustomerDto**: Customer creation data
- **CustomerExternalDto**: External SRI customer data
