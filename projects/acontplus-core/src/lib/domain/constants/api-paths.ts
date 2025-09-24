// 1. Bases principales de la API (solo las raíces)
export const API_BASES = {
  SECURITY: '/Seguridad',
  CUSTOMER: '/Customer',
  RESTAURANT: '/Restaurant',
  CONFIG: '/Config',
  GREEN: 'https://api.green-api.com',
  COMMON: '/Common',
  BILLING: '/FactElect',
  INVENTORY: '/Inventario',
  ACCOUNTING: '/Contabilidad',
  REPORT: '/Reports',
} as const;

// 2. Endpoints organizados por módulo y versión
export const API_ENDPOINTS = {
  SECURITY: {
    V3: `${API_BASES.SECURITY}/v3`,
  },
  CUSTOMER: {
    V1: `${API_BASES.CUSTOMER}`,
  },
  ACCOUNT: {
    V1: `${API_BASES.CUSTOMER}/Account`,
  },
  COMPANY_CUSTOMER: {
    V1: `${API_BASES.BILLING}/CompanyCustomer`,
  },
  ORDER: {
    V1: `${API_BASES.RESTAURANT}/Order`,
  },
  EMAIL_CONFIG: {
    V1: `${API_BASES.CONFIG}/EmailConfig`,
  },
  WHATSAPP_INSTANCE: {
    V1: `${API_BASES.GREEN}/waInstance`,
  },
  NOTIFICATION: {
    V1: `${API_BASES.COMMON}/Notificacion`,
    TAX_V1: `${API_BASES.COMMON}/NotificacionTributaria`,
  },
  PRODUCT: {
    V1: `${API_BASES.INVENTORY}/Articulo`,
    V2: `${API_BASES.INVENTORY}/v2/Articulo`,
  },
  CONFIGURATION: {
    V1: `${API_BASES.CONFIG}/Configuration`,
  },
  ITEM: {
    V1: `${API_BASES.INVENTORY}/Item`,
  },
  COMPROBANTE_INGRESO: {
    V1: `${API_BASES.ACCOUNTING}/ComprobanteIngreso`,
  },
  REPORT: {
    V1: `${API_BASES.REPORT}/Reporte`,
    V2: `${API_BASES.REPORT}/v2/Reporte`,
  },
  PROMOTION: {
    V1: `${API_BASES.RESTAURANT}/Promotion`,
    MENU_V1: `${API_BASES.RESTAURANT}/PromotionMenu`,
  },
  CONSULTAS: {
    V1: `${API_BASES.BILLING}/Consultas`,
  },
  TABLE: {
    V1: `${API_BASES.RESTAURANT}/Table`,
  },
  DOC_ELECT: {
    V1: `${API_BASES.BILLING}/DocumentoElectronico`,
  },
} as const;
