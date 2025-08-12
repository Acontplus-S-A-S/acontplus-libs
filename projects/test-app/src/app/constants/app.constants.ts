export const APP_CONSTANTS = {
  APP_NAME: 'Test App',
  VERSION: '1.0.0',
  API_ENDPOINTS: {
    USERS: '/api/users',
    PRODUCTS: '/api/products'
  },
  PAGINATION: {
    DEFAULT_PAGE_SIZE: 10,
    MAX_PAGE_SIZE: 100
  }
} as const;
