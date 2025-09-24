import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { forkJoin, from, Observable } from 'rxjs';
<<<<<<<< HEAD:projects/acontplus-ui-components/src/lib/customers-ui/client/client-add-edit/client-add-edit.component.ts
import {
  clientUseCase,
  customerExternalUseCase,
  ToastrNotificationService,
  SRI_IDENTIFICATION_CODE,
  SEPARATOR_KEY_CODE,
  SEPARADORES_REGEX,
} from 'acontplus-core';
========
import { NotificationService } from '@acontplus/ng-notifications';
>>>>>>>> e8b4dd251833a4e8d200bdc036806a3191730767:packages/ng-customer/src/lib/ui/components/customer-add-edit/customer-add-edit.component.ts
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
} from '@angular/material/dialog';
import {
  MatDynamicCardComponent,
  MatInputChipComponent,
  MatThemeButtonComponent,
<<<<<<<< HEAD:projects/acontplus-ui-components/src/lib/customers-ui/client/client-add-edit/client-add-edit.component.ts
} from '../../../components';
========
} from '@acontplus/ng-components';
>>>>>>>> e8b4dd251833a4e8d200bdc036806a3191730767:packages/ng-customer/src/lib/ui/components/customer-add-edit/customer-add-edit.component.ts
import { MatButtonModule } from '@angular/material/button';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectChange, MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
<<<<<<<< HEAD:projects/acontplus-ui-components/src/lib/customers-ui/client/client-add-edit/client-add-edit.component.ts
import { ToUpperCaseDirective } from '../../../directives';
========
>>>>>>>> e8b4dd251833a4e8d200bdc036806a3191730767:packages/ng-customer/src/lib/ui/components/customer-add-edit/customer-add-edit.component.ts
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';
import {
  SEPARADORES_REGEX,
  SEPARATOR_KEY_CODE,
  SRI_DOCUMENT_TYPE,
  isSuccessResponse,
} from '@acontplus/core';
import { ToUpperCaseDirective } from '@acontplus/ng-components';
import { CustomerUseCase } from '../../../application/use-cases/customer.use-case';
import { CustomerExternalUseCase } from '../../../application/use-cases/customer-external.use-case';
import { CustomerHttpRepository } from '../../../infrastructure/repositories/customer-http.repository';
import { CustomerExternalHttpRepository } from '../../../infrastructure/repositories/customer-external-http.repository';

@Component({
  selector: 'acp-client-add-edit',
  imports: [
    MatDialogContent,
    MatDialogActions,
    MatButtonModule,
    ReactiveFormsModule,
    MatTabsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatInputChipComponent,
    ToUpperCaseDirective,
    MatCheckbox,
    MatIcon,
    MatTooltip,
    MatDatepickerModule,
    MatThemeButtonComponent,
    MatDynamicCardComponent,
  ],
<<<<<<<< HEAD:projects/acontplus-ui-components/src/lib/customers-ui/client/client-add-edit/client-add-edit.component.ts
  templateUrl: './client-add-edit.component.html',
  styleUrl: './client-add-edit.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ClientAddEditComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<ClientAddEditComponent>);
========
  templateUrl: './customer-add-edit.component.html',
  styleUrl: './customer-add-edit.component.scss',
  providers: [
    provideNativeDateAdapter(),
    {
      provide: CustomerUseCase,
      useFactory: () => new CustomerUseCase(new CustomerHttpRepository()),
    },
    {
      provide: CustomerExternalUseCase,
      useFactory: () => new CustomerExternalUseCase(new CustomerExternalHttpRepository()),
    },
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerAddEditComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<CustomerAddEditComponent>);
  private readonly customerUseCase = inject(CustomerUseCase);
  private readonly customerExternalUseCase = inject(CustomerExternalUseCase);
>>>>>>>> e8b4dd251833a4e8d200bdc036806a3191730767:packages/ng-customer/src/lib/ui/components/customer-add-edit/customer-add-edit.component.ts
  btnText = signal('Guardar');

  readonly paramsOptions = inject<{
    id: number;
    descripcion: null | string;
    dataOfSri?: boolean;
    numeroIdentificacion?: string;
    codigoSri?: string;
    data: any;
  }>(MAT_DIALOG_DATA);

  readonly params = this.paramsOptions.data;

  private notificationService = inject(NotificationService);

  title = 'Nuevo Cliente';

  loading = false;

  emails: string[] = [];

  telephones: string[] = [];
  tiemposCredito = signal<any[]>([]);
  tipoContribuyentes = signal<any[]>([]);
  tiposCliente = signal<any[]>([]);
  tiposIdentificacion = signal<any[]>([]);
  formasPagoSri = signal<any[]>([]);
  placas = signal<any[]>([]);
  ciudades = signal<any[]>([]);
  cargos = signal<any[]>([]);
  empresas = signal<any[]>([]);
  employees = signal<any[]>([]);

  maritalStatuses = signal<any[]>([]);
  housingTypes = signal<any[]>([]);

  showRefresh = signal(true);

  endsWith001Validator(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (value && value.length >= 3) {
      if (!value.endsWith('001')) {
        return { endsWith001: true };
      }
    }
    return null;
  }
  customerForm = new FormGroup({
    direccion: new FormControl('', Validators.required),
    idCargo: new FormControl(0),
    idCliente: new FormControl(0),
    idEmpresa: new FormControl(0),
    idFormaPagoSri: new FormControl<number>(0),
    idTipoClienteProveedor: new FormControl(0),
    idTipoEntidad: new FormControl(0),
    idCiudad: new FormControl(0),
    idEmpleado: new FormControl<number | undefined>(0),
    nombreFiscal: new FormControl('', Validators.required),
    nombreComercial: new FormControl(''),
    numeroIdentificacion: new FormControl({ value: '', disabled: false }, [
      Validators.required,
      Validators.minLength(13),
      Validators.maxLength(13),
      this.endsWith001Validator,
    ]),
    correo: new FormControl(''),
    telefono: new FormControl(''),
    placa: new FormControl(''),
    nota: new FormControl(''),
    estado: new FormControl(false),
    birthDate: new FormControl<Date | null>(null),
    validationSri: new FormControl(false),
    configValorBruto: new FormControl(false),
    dataInfoCred: new FormGroup({
      maritalStatusId: new FormControl<number | null>(null),
      conyugeNombre: new FormControl<string | null>(null),
      conyugeTel: new FormControl<string | null>(null),
      refFamNombre: new FormControl<string | null>(null),
      refFamTel: new FormControl<string | null>(null),
      housingTypeId: new FormControl<number | null>(null),
      dirVivienda: new FormControl<string | null>(null),
      refDomicilio: new FormControl<string | null>(null),
      sector: new FormControl<string | null>(null),
      barrio: new FormControl<string | null>(null),
      calle: new FormControl<string | null>(null),
    }),
  });

  getCustomer(codigo: string, id: string) {
    this.customerForm.patchValue({
      validationSri: false,
    });
<<<<<<<< HEAD:projects/acontplus-ui-components/src/lib/customers-ui/client/client-add-edit/client-add-edit.component.ts
    from(clientUseCase.checkExistence(id)).subscribe(response => {
      if (response.success && response.data) {
========
    from(this.customerUseCase.checkExistence(id)).subscribe(response => {
      if (isSuccessResponse(response) && response.data) {
>>>>>>>> e8b4dd251833a4e8d200bdc036806a3191730767:packages/ng-customer/src/lib/ui/components/customer-add-edit/customer-add-edit.component.ts
        alert('El cliente ya se encuentra registrado en su empresa');
        this.notificationService.toastr.show({
          type: 'warning',
          message: 'El cliente ya se encuentra registrado en su empresa',
        });
        this.customerForm.patchValue({ numeroIdentificacion: null });
        return;
      }

      if (codigo === SRI_DOCUMENT_TYPE.PASSPORT) {
        this.customerForm.patchValue({
          validationSri: true,
        });
        return;
      }
      from(this.customerExternalUseCase.getById(id)).subscribe(secondResponse => {
        if (!isSuccessResponse(secondResponse) || !secondResponse.data) {
          this.notificationService.toastr.show({
            type: 'info',
            message: '  No se encontró información en el SRI',
          });
          return;
        }
        const {
          phone,
          email,
          idCard, // numeroRuc
          businessName, // razonSocial
          address, // direccion
        } = secondResponse.data as any;

        if (phone && typeof phone === 'string') {
          this.telephones = phone.split(SEPARADORES_REGEX) || [];
        }
        if (email && typeof email === 'string') {
          this.emails = email.split(SEPARADORES_REGEX) || [];
        }
        if (idCard) {
          this.customerForm.patchValue({
            numeroIdentificacion: idCard,
            nombreFiscal: businessName,
            validationSri: true,
            direccion: address,
            nombreComercial: businessName,
          });
        }
      });
    });
  }

  getLoadData(): Observable<any> {
    if (this.isUpdate()) {
      return forkJoin([
<<<<<<<< HEAD:projects/acontplus-ui-components/src/lib/customers-ui/client/client-add-edit/client-add-edit.component.ts
        from(clientUseCase.getFormData()),
        from(clientUseCase.getById(this.params.id)),
      ]);
    }
    return from(clientUseCase.getFormData());
========
        from(this.customerUseCase.getFormData()),
        from(this.customerUseCase.getById(this.params.id)),
      ]);
    }
    return from(this.customerUseCase.getFormData());
>>>>>>>> e8b4dd251833a4e8d200bdc036806a3191730767:packages/ng-customer/src/lib/ui/components/customer-add-edit/customer-add-edit.component.ts
  }

  ngOnInit(): void {
    try {
      this.getLoadData().subscribe(response => {
        let mainDataForm = {} as any;
        let dataCompanyCustomer = {} as any;
        if (Array.isArray(response)) {
          mainDataForm = response[0].data;
          dataCompanyCustomer = response[1];
        } else {
          mainDataForm = response.data;
        }

        this.tiposIdentificacion.set(mainDataForm.tipoIdentificacion);
        this.tiemposCredito.set(mainDataForm.tiempoCreditos);
        this.tipoContribuyentes.set(mainDataForm.tipoContribuyentes);
        this.formasPagoSri.set(mainDataForm.formasPagoSri);
        this.tiposCliente.set(mainDataForm.tiposCliente);
        this.ciudades.set(mainDataForm.ciudades);
        this.cargos.set(mainDataForm.cargos);
        this.empresas.set(mainDataForm.empresas);
        this.employees.set(mainDataForm.employees);
        this.maritalStatuses.set(mainDataForm.maritalStatuses);
        this.housingTypes.set(mainDataForm.housingTypes);

        if (this.isDataOfSri()) {
          const { codigoSri, numeroIdentificacion } = this.params;

          const dataIdentificacion = this.tiposIdentificacion().find(
            (ti: any) => ti.codigoSri === codigoSri,
          );

          if (dataIdentificacion) {
            const idTipoIdentificacionCtrl = this.customerForm.get(
              'idTipoIdentificacion',
            ) as FormControl<number> | null;
            idTipoIdentificacionCtrl?.setValue(dataIdentificacion.idTipoIdentificacion as number);

            const numeroIdentificacionCtrl = this.customerForm.get(
              'numeroIdentificacion',
            ) as FormControl<string> | null;
            numeroIdentificacionCtrl?.setValue(numeroIdentificacion as string);

            const idTiempoCreditoCtrl = this.customerForm.get(
              'idTiempoCredito',
            ) as FormControl<number> | null;
            idTiempoCreditoCtrl?.setValue(
              this.tiemposCredito().length > 0
                ? (this.tiemposCredito()[0].idTiempoCredito as number)
                : 0,
            );
            this.updateFormControlNumeroIdentificacion(dataIdentificacion.codigoSri);

            this.onKeyDownGovernmentId();
          }

          return;
        }

        if (this.isCreate()) {
          const dataIdentificacion = this.tiposIdentificacion().find(
            (ti: any) => ti.codigoSri === SRI_DOCUMENT_TYPE.RUC,
          );

          if (dataIdentificacion) {
            const idTipoIdentificacionCtrl = this.customerForm.get(
              'idTipoIdentificacion',
            ) as FormControl<number> | null;
            idTipoIdentificacionCtrl?.setValue(dataIdentificacion.idTipoIdentificacion as number);
            this.setIdentificationTypeChange(dataIdentificacion.codigoSri);
          }

          const idTiempoCreditoCtrl = this.customerForm.get(
            'idTiempoCredito',
          ) as FormControl<number> | null;
          idTiempoCreditoCtrl?.setValue(
            this.tiemposCredito().length > 0
              ? (this.tiemposCredito()[0].idTiempoCredito as number)
              : 0,
          );
        } else {
          this.title = 'Editar Cliente';
          this.btnText.set('Actualizar');
          this.emails = dataCompanyCustomer.correos;
          this.telephones = dataCompanyCustomer.telefonos;
          this.placas.set(dataCompanyCustomer.placas);
          const { dataInfoCred, ...rest } = dataCompanyCustomer;
          this.customerForm.patchValue(rest);
          if (dataInfoCred) {
            this.customerForm.get('dataInfoCred')?.patchValue(dataInfoCred);
          }
          this.updateFormControlNumeroIdentificacion(rest.codigoSri);
        }
      });
    } catch (error) {
      // Handle error appropriately
    }
  }

  identificationTypeChange(event: MatSelectChange) {
    const dt = this.tiposIdentificacion().find(
      item => item.idTipoIdentificacion === Number(event.value),
    );
    this.setIdentificationTypeChange(dt.codigoSri);
  }

  updateFormControlNumeroIdentificacion(
    codigoSri: SRI_DOCUMENT_TYPE.RUC | SRI_DOCUMENT_TYPE.CEDULA,
  ): void {
    const idNumberControl = this.customerForm.get('numeroIdentificacion');

    this.showRefresh.set(false);

    if ([SRI_DOCUMENT_TYPE.RUC, SRI_DOCUMENT_TYPE.CEDULA].includes(codigoSri)) {
      let lengthValidator;
      this.showRefresh.set(true);

      if (codigoSri === SRI_DOCUMENT_TYPE.CEDULA) {
        lengthValidator = [Validators.minLength(10), Validators.maxLength(10)];
      } else if (codigoSri === SRI_DOCUMENT_TYPE.RUC) {
        lengthValidator = [
          Validators.minLength(13),
          Validators.maxLength(13),
          this.endsWith001Validator,
        ];
      }
      if (lengthValidator) {
        idNumberControl?.setValidators([
          Validators.required,
          Validators.pattern(/^\d+$/), // Solo números
          ...lengthValidator,
        ]);
      }
    } else {
      idNumberControl?.setValidators([Validators.required]);
    }

    idNumberControl?.updateValueAndValidity();
  }

  setIdentificationTypeChange(codigoSri: SRI_DOCUMENT_TYPE.RUC | SRI_DOCUMENT_TYPE.CEDULA) {
    const idNumberControl = this.customerForm.get('numeroIdentificacion');
    idNumberControl?.reset();
    idNumberControl?.clearValidators();
    this.updateFormControlNumeroIdentificacion(codigoSri);
  }

  get numeroIdentificacionControl() {
    return this.customerForm.get('numeroIdentificacion');
  }

  get birthDateCtrl() {
    return this.customerForm.get('birthDate');
  }

  onKeyDownGovernmentId($event?: Event) {
    if ($event) {
      $event.preventDefault();
    }
    if (this.numeroIdentificacionControl?.invalid) return;

    const idTipoIdentificacion = (
      this.customerForm.get('idTipoIdentificacion') as FormControl<number> | null
    )?.value as number;
    const numeroIdentificacion = (
      this.customerForm.get('numeroIdentificacion') as FormControl<string> | null
    )?.value as string;

    const codigoSri = this.tiposIdentificacion().find(
      (x: any) => x.idTipoIdentificacion == idTipoIdentificacion,
    ).codigoSri;

    if (numeroIdentificacion) {
      this.getCustomer(codigoSri, numeroIdentificacion);
    }
  }

  private isDataOfSri = () => this.params.dataOfSri;
  private isCreate = () => !(this.params.id > 0);
  isUpdate = () => this.params.id > 0;

  onSave() {
    this.customerForm.patchValue({
      telefono: this.telephones.length > 0 ? this.telephones.join(SEPARATOR_KEY_CODE.SLASH) : null,
    });

    this.customerForm.patchValue({
      correo: this.emails.length > 0 ? this.emails.join(SEPARATOR_KEY_CODE.SLASH) : null,
    });
    this.customerForm.patchValue({
      placa: this.placas().length > 0 ? this.placas().join(SEPARATOR_KEY_CODE.SLASH) : null,
    });
    const dataForm = {
      ...this.customerForm.value,
    };

    if (this.customerForm.invalid) {
      this.notificationService.toastr.show({
        type: 'warning',
        message: 'Ingrese todos datos requeridos',
      });
      return;
    }

    if (this.isUpdate()) {
      const sendParams = {
        id: this.params.id,
        data: dataForm,
      };
<<<<<<<< HEAD:projects/acontplus-ui-components/src/lib/customers-ui/client/client-add-edit/client-add-edit.component.ts
      from(clientUseCase.update(sendParams)).subscribe(response => {
        this.tS.show({
          type: response.success ? 'success' : 'warning',
========
      from(this.customerUseCase.update(sendParams)).subscribe(response => {
        this.notificationService.toastr.show({
          type: isSuccessResponse(response) ? 'success' : 'warning',
>>>>>>>> e8b4dd251833a4e8d200bdc036806a3191730767:packages/ng-customer/src/lib/ui/components/customer-add-edit/customer-add-edit.component.ts
          message: `${response.message}`,
        });
        if (isSuccessResponse(response)) {
          this.dialogRef.close({
            id: this.params.id,
          });
        }
      });
    }

    if (this.isCreate()) {
<<<<<<<< HEAD:projects/acontplus-ui-components/src/lib/customers-ui/client/client-add-edit/client-add-edit.component.ts
      from(clientUseCase.create(dataForm)).subscribe(response => {
        this.tS.show({
          type: response.success ? 'success' : 'warning',
========
      from(this.customerUseCase.create(dataForm)).subscribe(response => {
        this.notificationService.toastr.show({
          type: isSuccessResponse(response) ? 'success' : 'warning',
>>>>>>>> e8b4dd251833a4e8d200bdc036806a3191730767:packages/ng-customer/src/lib/ui/components/customer-add-edit/customer-add-edit.component.ts
          message: `${response.message}`,
        });
        if (isSuccessResponse(response)) {
          this.dialogRef.close(response.data);
        }
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
