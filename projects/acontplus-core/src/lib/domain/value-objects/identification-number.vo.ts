import { SRI_IDENTIFICATION_CODE } from '../constants';
import { BaseVo } from './base.vo';

export class IdentificationNumberVo extends BaseVo<string> {
  private readonly id: string;
  private readonly type: SRI_IDENTIFICATION_CODE;

  constructor(id: string) {
    super(id);
    this.id = id?.trim() || '';
    this.type = this.determineType();

    if (!this.validate()) {
      throw new Error(`Número de identificación inválido: ${this.id}`);
    }
  }

  private determineType(): SRI_IDENTIFICATION_CODE {
    if (this.id.length === 10) return SRI_IDENTIFICATION_CODE.CEDULA;
    if (this.id.length === 13) return SRI_IDENTIFICATION_CODE.RUC;
    throw new Error('Número de identificación debe tener 10 o 13 dígitos');
  }

  validate(): boolean {
    if (this.type === SRI_IDENTIFICATION_CODE.CEDULA) {
      return this.isValidCedulaAlgorithm();
    }
    if (this.type === SRI_IDENTIFICATION_CODE.RUC) {
      return this.isValidRucAlgorithm();
    }
    return false;
  }

  // Validación completa de cédula ecuatoriana con algoritmo
  private isValidCedulaAlgorithm(): boolean {
    if (!/^\d{10}$/.test(this.id)) return false;

    // Verificar que los primeros 2 dígitos sean una provincia válida (01-24)
    const provincia = parseInt(this.id.substring(0, 2));
    if (provincia < 1 || provincia > 24) return false;

    // Algoritmo de validación del dígito verificador
    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;

    for (let i = 0; i < 9; i++) {
      const valor = parseInt(this.id.charAt(i)) * coeficientes[i];
      suma += valor > 9 ? valor - 9 : valor;
    }

    const digitoVerificador = suma % 10 === 0 ? 0 : 10 - (suma % 10);
    return digitoVerificador === parseInt(this.id.charAt(9));
  }

  // Validación de RUC más flexible
  private isValidRucAlgorithm(): boolean {
    if (!/^\d{13}$/.test(this.id)) return false;

    // Los primeros 10 dígitos deben ser una cédula válida para personas naturales
    // o seguir reglas específicas para sociedades
    const tercerDigito = parseInt(this.id.charAt(2));

    // RUC de persona natural (tercer dígito < 6)
    if (tercerDigito < 6) {
      const cedula = this.id.substring(0, 10);
      const tempCedula = IdentificationNumberVo.validateCedula(cedula);
      return tempCedula && this.id.endsWith('001');
    }

    // RUC de sociedad privada (tercer dígito = 9)
    if (tercerDigito === 9) {
      return this.isValidSociedadRuc();
    }

    // RUC de entidad pública (tercer dígito = 6)
    if (tercerDigito === 6) {
      return this.id.endsWith('0001');
    }

    return false;
  }

  private isValidSociedadRuc(): boolean {
    const coeficientes = [4, 3, 2, 7, 6, 5, 4, 3, 2];
    let suma = 0;

    for (let i = 0; i < 9; i++) {
      suma += parseInt(this.id.charAt(i)) * coeficientes[i];
    }

    const residuo = suma % 11;
    const digitoVerificador = residuo === 0 ? 0 : 11 - residuo;

    return digitoVerificador === parseInt(this.id.charAt(9)) && this.id.endsWith('001');
  }

  // Método auxiliar estático para validar cédula sin crear instancia
  private static validateCedula(cedula: string): boolean {
    if (!/^\d{10}$/.test(cedula)) return false;

    const provincia = parseInt(cedula.substring(0, 2));
    if (provincia < 1 || provincia > 24) return false;

    const coeficientes = [2, 1, 2, 1, 2, 1, 2, 1, 2];
    let suma = 0;

    for (let i = 0; i < 9; i++) {
      const valor = parseInt(cedula.charAt(i)) * coeficientes[i];
      suma += valor > 9 ? valor - 9 : valor;
    }

    const digitoVerificador = suma % 10 === 0 ? 0 : 10 - (suma % 10);
    return digitoVerificador === parseInt(cedula.charAt(9));
  }

  // Métodos públicos mejorados
  public isValidCedula(): boolean {
    return this.type === SRI_IDENTIFICATION_CODE.CEDULA && this.isValidCedulaAlgorithm();
  }

  public isValidRuc(): boolean {
    return this.type === SRI_IDENTIFICATION_CODE.RUC && this.isValidRucAlgorithm();
  }

  public getId(): string {
    return this.id;
  }

  public getType(): SRI_IDENTIFICATION_CODE {
    return this.type;
  }

  // Método estático mejorado
  public static tryCreate(id: string): boolean {
    try {
      new IdentificationNumberVo(id);
      return true;
    } catch {
      return false;
    }
  }

  // Método adicional para obtener información del tipo de RUC
  public getRucType(): string | null {
    if (this.type !== SRI_IDENTIFICATION_CODE.RUC) return null;

    const tercerDigito = parseInt(this.id.charAt(2));
    if (tercerDigito < 6) return 'Persona Natural';
    if (tercerDigito === 6) return 'Entidad Pública';
    if (tercerDigito === 9) return 'Sociedad Privada';
    return 'Desconocido';
  }
}
