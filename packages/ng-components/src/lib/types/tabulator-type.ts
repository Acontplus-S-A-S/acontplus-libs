export interface TabulatorColumn {
  title: string;
  field: string;
  width?: number | string;
  minWidth?: number;
  maxWidth?: number;
  resizable?: boolean;
  sortable?: boolean;
  headerSort?: boolean;
  editor?: string | boolean;
  formatter?: string;
  formatterParams?: Record<string, any>;
  validator?: string | string[];
  headerFilter?: string | boolean;
  headerFilterParams?: Record<string, any>;
  frozen?: boolean;
  responsive?: number;
  tooltip?: string | boolean;
  cssClass?: string;
  headerCssClass?: string;
  mutator?: string;
  accessor?: string;
  download?: boolean;
  titleDownload?: string;
  visible?: boolean;
  clipboard?: boolean;
}

export interface TabulatorTheme {
  name: 'default' | 'modern' | 'midnight' | 'simple' | 'site' | 'site-dark';
  cssPath?: string;
}

export interface TabulatorConfig {
  data?: any[];
  columns?: TabulatorColumn[];
  height?: string | number | false;
  minHeight?: number;
  maxHeight?: number;
  layout?: 'fitData' | 'fitColumns' | 'fitDataFill' | 'fitDataStretch';
  layoutColumnsOnNewData?: boolean;
  responsiveLayout?: boolean | 'hide' | 'collapse';
  responsiveLayoutCollapseStartOpen?: boolean;
  columnMinWidth?: number;
  resizableColumns?: boolean;
  movableColumns?: boolean;
  columnHeaderVertAlign?: 'top' | 'middle' | 'bottom';
  placeholder?: string;
  footerElement?: string;
  tooltips?: boolean | ((cell: any) => string);
  tooltipGenerationMode?: 'load' | 'hover';
  history?: boolean;
  keybindings?: Record<string, string>;
  reactiveData?: boolean;
  autoResize?: boolean;
  tableBuilding?: () => void;
  tableBuilt?: () => void;
  renderStarted?: () => void;
  renderComplete?: () => void;
  htmlImporting?: () => void;
  htmlImported?: () => void;
  dataLoading?: (data: any[]) => void;
  dataLoaded?: (data: any[]) => void;
  dataChanged?: (data: any[]) => void;
  pageLoaded?: (pageno: number) => void;
  dataSorting?: (sorters: any[]) => void;
  dataSorted?: (sorters: any[], rows: any[]) => void;
  dataFiltering?: (filters: any[]) => void;
  dataFiltered?: (filters: any[], rows: any[]) => void;
  validationFailed?: (cell: any, value: any, validators: any[]) => void;
  clipboardCopyStyled?: (clipboard: string) => string;
  clipboardCopyConfig?: Record<string, any>;
  clipboardPasteParser?: string | ((clipboard: string) => any[][]);
  clipboardPasteAction?: 'insert' | 'update' | 'replace';
  printAsHtml?: boolean;
  printFormatter?: (tableHtml: string, table: any) => string;
  printHeader?: string;
  printFooter?: string;
  tabEndNewRow?: boolean | ((row: any) => any);
}

export interface TabulatorEventHandlers {
  onCellEdited?: (cell: any) => void;
  onRowClick?: (e: Event, row: any) => void;
  onRowSelected?: (row: any) => void;
  onRowDeselected?: (row: any) => void;
  onDataChanged?: (data: any[]) => void;
  onTableReady?: (tabulator: any) => void;
}
