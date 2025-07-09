import { Observable } from "rxjs";

export interface AutocompleteWrapperItem {
  id?: string | number;
  name?: string;
  value?: string;
  description?: string; // Para mostrar en el template por defecto
  [key: string]: any;
}

export interface AutocompleteWrapperSearchResult {
  items: AutocompleteWrapperItem[];
  totalCount: number;
  hasMore?: boolean;
}

export type AutocompleteWrapperSearchFunction = (
  query: string,
  filters: AutocompleteWrapperFilters,
  page?: number,
  pageSize?: number
) => Observable<AutocompleteWrapperSearchResult>;

export interface AutocompleteWrapperConfig {
  placeholder?: string;
  clearInput?: boolean;
  disabled?: boolean;
  debounceTime?: number;
  minSearchLength?: number;
  maxHistoryItems?: number;
  itemsPerPage?: number;
  enableStockFilter?: boolean;
  stockProperty?: string;
  enablePagination?: boolean;
  enableFilters?: boolean;
  enableFooterActions?: boolean;
  searchFields?: AutocompleteWrapperSearchField[];
  stockOptions?: AutocompleteWrapperStockOption[];

  // Configuración del overlay
  overlayWidth?: string | number;
  overlayMaxHeight?: string | number;

  // Función de búsqueda personalizada
  searchFunction?: AutocompleteWrapperSearchFunction;

  // Modo de búsqueda
  searchMode?: 'local' | 'remote' | 'hybrid';

  // Configuración de datos locales (para searchMode 'local' o 'hybrid')
  localData?: AutocompleteWrapperItem[];

  // Texto personalizable
  noResultsText?: string;
  sectionTitle?: string;
}

export interface AutocompleteWrapperSearchField {
  value: string;
  label: string;
  property: string;
}

export interface AutocompleteWrapperStockOption {
  value: string;
  label: string;
}

export interface AutocompleteWrapperFilters {
  searchBy: string;
  stockFilter: string;
}

// Eventos que emite el componente
export interface AutocompleteWrapperEvents {
  itemSelected: AutocompleteWrapperItem;
  searchChanged: string;
  pageChanged: number;
  filterChanged: AutocompleteWrapperFilters;
  advancedSearchClicked: void;
  allResultsClicked: string;
  createNewClicked: string; // Alineado con onCreateNew del HTML
  historyCleared: void;
  historyItemRemoved: { item: AutocompleteWrapperItem; index: number };
}

export interface AutocompleteWrapperPaginationInfo {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  startItem: number;
  endItem: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Estado interno del componente (para usar con signals)
export interface AutocompleteWrapperState {
  query: string;
  isLoading: boolean;
  overlayOpen: boolean;
  selectedIndex: number;
  pagination: AutocompleteWrapperPaginationInfo;
  hasResults: boolean;
  isHistoryVisible: boolean;
  historyCount: number;
  filters: AutocompleteWrapperFilters;

  // Estados adicionales que aparecen en el HTML
  // totalItems: number;
  // currentPageItems: AutocompleteWrapperItem[];
  // historyList: AutocompleteWrapperItem[];
  // noResults: boolean;
}

// Para métodos del componente que aparecen en el HTML
export interface AutocompleteWrapperActions {
  // Input actions
  onInput(event: Event): void;
  showOverlay(): void;
  hideOverlay(): void;
  clearSearch(): void;
  onKeyDown(event: KeyboardEvent): void;

  // Item actions
  selectItem(item: AutocompleteWrapperItem): void;
  getItemDisplayText(item: AutocompleteWrapperItem): string;

  // History actions
  clearHistory(): void;
  removeHistoryItem(index: number, event: Event): void;

  // Pagination actions
  goToFirstPage(): void;
  goToPreviousPage(): void;
  goToNextPage(): void;
  goToLastPage(): void;
  goToPage(event: Event): void;

  // Filter actions
  onFilterChange(): void;

  // Footer actions
  onCreateNew(event: Event): void;
  onAdvancedSearch(): void;
  onShowAllResults(): void;

  // State getters (para usar con signals)
  overlayOpen(): boolean;
  isLoading(): boolean;
  isHistoryVisible(): boolean;
  historyList(): AutocompleteWrapperItem[];
  selectedIndex(): number;
  currentPageItems(): AutocompleteWrapperItem[];
  totalItems(): number;
  totalPages(): number;
  currentPage(): number;
  totalCount(): number;
  startItem(): number;
  endItem(): number;
  sectionTitle(): string;
  noResultsText(): string;
  isNoResults(): boolean;
  overlayWidth(): string | number;
  overlayMaxHeight(): string | number;
}

// Configuraciones predefinidas mejoradas
export const AUTOCOMPLETE_WRAPPER_DEFAULT_CONFIG: AutocompleteWrapperConfig = {
  placeholder: 'Buscar...',
  disabled: false,
  debounceTime: 300,
  minSearchLength: 2,
  maxHistoryItems: 10,
  itemsPerPage: 10,
  enableStockFilter: true,
  stockProperty: 'stock',
  enablePagination: true,
  enableFilters: true,
  enableFooterActions: true,
  overlayWidth: '100%',
  overlayMaxHeight: '500px',
  noResultsText: 'No se encontraron resultados',
  sectionTitle: 'Resultados',
  searchMode: 'remote',
  searchFields: [
    { value: 'description', label: 'Descripción', property: 'description' },
    { value: 'code', label: 'Código', property: 'code' },
    { value: 'barcode', label: 'Código de Barras', property: 'barcode' },
    { value: 'auxCode', label: 'Código Auxiliar', property: 'auxCode' }
  ],
  stockOptions: [
    { value: 'all', label: 'Todos' },
    { value: 'with-stock', label: 'Con Stock' },
    { value: 'without-stock', label: 'Sin Stock' }
  ]
};

export const AUTOCOMPLETE_WRAPPER_PRODUCT_CONFIG: AutocompleteWrapperConfig = {
  ...AUTOCOMPLETE_WRAPPER_DEFAULT_CONFIG,
  placeholder: 'Buscar productos...',
  enableStockFilter: true,
  enableFooterActions: true,
  sectionTitle: 'Productos',
  noResultsText: 'No se encontraron productos'
};

export const AUTOCOMPLETE_WRAPPER_CUSTOMER_CONFIG: AutocompleteWrapperConfig = {
  ...AUTOCOMPLETE_WRAPPER_DEFAULT_CONFIG,
  placeholder: 'Buscar clientes...',
  enableStockFilter: false,
  enableFooterActions: false,
  sectionTitle: 'Clientes',
  noResultsText: 'No se encontraron clientes',
  searchFields: [
    { value: 'name', label: 'Nombre', property: 'name' },
    { value: 'email', label: 'Email', property: 'email' },
    { value: 'phone', label: 'Teléfono', property: 'phone' },
    { value: 'document', label: 'Documento', property: 'document' }
  ]
};

export const AUTOCOMPLETE_WRAPPER_SIMPLE_CONFIG: AutocompleteWrapperConfig = {
  ...AUTOCOMPLETE_WRAPPER_DEFAULT_CONFIG,
  placeholder: 'Buscar...',
  enableStockFilter: false,
  enableFilters: false,
  enableFooterActions: false,
  enablePagination: false,
  itemsPerPage: 50,
  sectionTitle: 'Resultados',
  overlayMaxHeight: '300px'
};

// Configuración para búsqueda local
export const AUTOCOMPLETE_WRAPPER_LOCAL_CONFIG: AutocompleteWrapperConfig = {
  ...AUTOCOMPLETE_WRAPPER_SIMPLE_CONFIG,
  searchMode: 'local',
  debounceTime: 150, // Menos tiempo para búsqueda local
  minSearchLength: 1
};

// Configuración para listas grandes con paginación
export const AUTOCOMPLETE_WRAPPER_PAGINATED_CONFIG: AutocompleteWrapperConfig = {
  ...AUTOCOMPLETE_WRAPPER_DEFAULT_CONFIG,
  itemsPerPage: 20,
  enablePagination: true,
  overlayMaxHeight: '400px'
};

// Helper para crear configuración personalizada
export function createAutocompleteWrapperConfig(
  overrides: Partial<AutocompleteWrapperConfig>
): AutocompleteWrapperConfig {
  return {
    ...AUTOCOMPLETE_WRAPPER_DEFAULT_CONFIG,
    ...overrides
  };
}

// Tipos para el componente Angular
export interface ReusableAutocompleteWrapperComponent extends AutocompleteWrapperActions {
  config: AutocompleteWrapperConfig;
  filters: AutocompleteWrapperFilters;
  query: string;
}

// Tipos de utilidad específicos del wrapper
export type AutocompleteWrapperSearchMode = 'local' | 'remote' | 'hybrid';

export type AutocompleteWrapperItemProperty = keyof AutocompleteWrapperItem;

export type AutocompleteWrapperEventHandler<T = any> = (event: T) => void;
