export enum SRI_DOCUMENT_TYPE {
  RUC = '04',
  CEDULA = '05',
  PASSPORT = '06',
  CONSUMIDOR_FINAL = '07',
  IDENTIFICACION_EXTERIOR = '08',
}

export enum SRI_DOCUMENT_TYPE_CUSTOM {
  RUC = 'R',
  CEDULA = 'C',
  PASSPORT = 'P',
  CONSUMIDOR_FINAL = 'CF',
  IDENTIFICACION_EXTERIOR = 'IE',
}

export enum SEPARATOR_KEY_CODE {
  SLASH = '|',
  PUNTO_COMA = ';',
  DOS_PUNTOS = ':',
}
export const SEPARADORES_REGEX = new RegExp(`[${Object.values(SEPARATOR_KEY_CODE).join('')}]`);
