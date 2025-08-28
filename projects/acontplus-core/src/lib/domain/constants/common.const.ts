export enum SRI_IDENTIFICATION_CODE {
  RUC = '04',
  CEDULA = '05',
  PASSPORT = '06',
}

export enum IDENTIFICATION_CODE {
  RUC = 'R',
  CEDULA = 'C',
  PASSPORT = 'P',
}

export enum SEPARATOR_KEY_CODE {
  SLASH = '|',
  PUNTO_COMA = ';',
  DOS_PUNTOS = ':',
}
export const SEPARADORES_REGEX = new RegExp(`[${Object.values(SEPARATOR_KEY_CODE).join('')}]`);
