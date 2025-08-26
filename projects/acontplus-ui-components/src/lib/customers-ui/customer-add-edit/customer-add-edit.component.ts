import { ChangeDetectionStrategy, Component, inject, signal, OnInit } from '@angular/core';
import { forkJoin, from, Observable } from 'rxjs';
import {
  customerUseCase,
  ToastrNotificationService,
  SRI_IDENTIFICATION_CODE,
  SEPARATOR_KEY_CODE,
  customerExternalUseCase,
  SEPARADORES_REGEX,
} from '@acontplus-core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogContent,
  MatDialogRef
} from '@angular/material/dialog';
import {
  MatDynamicCardComponent,
  MatInputChipComponent,
  MatThemeButtonComponent,
} from '../../components';
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
import { ToUpperCaseDirective } from '../../directives';
import { MatCheckbox } from '@angular/material/checkbox';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { provideNativeDateAdapter } from '@angular/material/core';

@Component({
  selector: 'acp-customer-add-edit',
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
  templateUrl: './customer-add-edit.component.html',
  styleUrl: './customer-add-edit.component.scss',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CustomerAddEditComponent implements OnInit {
  private readonly dialogRef = inject(MatDialogRef<CustomerAddEditComponent>);
  btnText = signal('Guardar');

  readonly paramsOptions = inject<{
    id: number;
    descripcion: null | string;
    dataOfSri?: boolean;
    numeroIdentificacion?: string;
    codigoSri?: string;
    data: any
  }>(MAT_DIALOG_DATA);

  readonly params = this.paramsOptions.data


  private tS = inject(ToastrNotificationService);

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
    idTipoIdentificacion: new FormControl(0, Validators.required),
    idSubContribuyente: new FormControl(0),
    idTiempoCredito: new FormControl(0),
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
    from(customerUseCase.checkExistence(id)).subscribe((response) => {
      if (response.success && response.data) {
        alert('El cliente ya se encuentra registrado en su empresa');
        this.tS.show({
          type: 'warning',
          message: 'El cliente ya se encuentra registrado en su empresa',
        });
        this.customerForm.patchValue({ numeroIdentificacion: null });
        return;
      }

      if (codigo === SRI_IDENTIFICATION_CODE.PASSPORT) {
        this.customerForm.patchValue({
          validationSri: true,
        });
        return;
      }
      from(customerExternalUseCase.getById(id)).subscribe(secondResponse => {
        if (!secondResponse.success || !secondResponse.data) {
          this.tS.show({
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
        } = secondResponse.data;

        if (phone) {
          this.telephones = phone.split(SEPARADORES_REGEX) || [];
        }
        if (email) {
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
        from(customerUseCase.getFormData()),
        from(customerUseCase.getById(this.params.id)),
      ]);
    }
    return from(customerUseCase.getFormData());
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
            this.customerForm.patchValue({
              idTipoIdentificacion: dataIdentificacion.idTipoIdentificacion,
              numeroIdentificacion,
            });

            this.customerForm.patchValue({
              idTiempoCredito:
                this.tiemposCredito().length > 0 ? this.tiemposCredito()[0].idTiempoCredito : 0,
            });
            this.updateFormControlNumeroIdentificacion(dataIdentificacion.codigoSri);

            this.onKeyDownGovernmentId();
          }

          return;
        }

        if (this.isCreate()) {
          const dataIdentificacion = this.tiposIdentificacion().find(
            (ti: any) => ti.codigoSri === SRI_IDENTIFICATION_CODE.RUC,
          );

          if (dataIdentificacion) {
            this.customerForm.patchValue({
              idTipoIdentificacion: dataIdentificacion.idTipoIdentificacion,
            });
            this.setIdentificationTypeChange(dataIdentificacion.codigoSri);
          }

          this.customerForm.patchValue({
            idTiempoCredito:
              this.tiemposCredito().length > 0 ? this.tiemposCredito()[0].idTiempoCredito : 0,
          });
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
      console.log(error);
    }
  }

  identificationTypeChange(event: MatSelectChange) {
    const dt = this.tiposIdentificacion().find(
      item => item.idTipoIdentificacion === Number(event.value),
    );
    this.setIdentificationTypeChange(dt.codigoSri);
  }

  updateFormControlNumeroIdentificacion(
    codigoSri: SRI_IDENTIFICATION_CODE.RUC | SRI_IDENTIFICATION_CODE.CEDULA,
  ): void {
    const idNumberControl = this.customerForm.get('numeroIdentificacion');

    this.showRefresh.set(false);

    if ([SRI_IDENTIFICATION_CODE.RUC, SRI_IDENTIFICATION_CODE.CEDULA].includes(codigoSri)) {
      let lengthValidator;
      this.showRefresh.set(true);

      if (codigoSri === SRI_IDENTIFICATION_CODE.CEDULA) {
        lengthValidator = [Validators.minLength(10), Validators.maxLength(10)];
      } else if (codigoSri === SRI_IDENTIFICATION_CODE.RUC) {
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

  setIdentificationTypeChange(
    codigoSri: SRI_IDENTIFICATION_CODE.RUC | SRI_IDENTIFICATION_CODE.CEDULA,
  ) {
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

    const { idTipoIdentificacion, numeroIdentificacion } = this.customerForm.value;

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
      this.tS.show({
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
      from(customerUseCase.update(sendParams)).subscribe((response) => {
        this.tS.show({
          type: response.success ? 'success' : 'warning',
          message: `${response.message}`,
        });
        if (response.success) {
          this.dialogRef.close({
            id: this.params.id,
          });
        }
      });
    }

    if (this.isCreate()) {
      from(customerUseCase.create(dataForm)).subscribe((response) => {
        this.tS.show({
          type: response.success ? 'success' : 'warning',
          message: `${response.message}`,
        });
        if (response.success) {
           this.dialogRef.close(response.data);
        }
      });
    }
  }

  close() {
    this.dialogRef.close();
  }
}
