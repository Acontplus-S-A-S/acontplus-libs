export interface DateRangeConfig<T = any> {
  startDate: FieldDefinition<T>;
  endDate: FieldDefinition<T>;
}

export declare type ControlType =
  | 'textbox'
  | 'ktextbox'
  | 'combobox'
  | 'textboxNum'
  | 'dropdown'
  | 'dropdownlist'
  | 'multiselect'
  | 'autocomplete'
  | 'checkbox'
  | 'radiobutton'
  | 'inquiryInDialog'
  | 'timepicker'
  | 'datepicker'
  | 'daterange'
  | 'textarea'
  | 'slideToggle'
  | 'slider'
  | 'switch'
  | 'buttonToggleGroup';

export declare type FieldType =
  | 'number'
  | 'string'
  | 'boolean'
  | 'date'
  | 'month'
  | 'email'
  | 'password'
  | 'tel'
  | 'hidden'
  | 'image'
  | 'url'
  | 'week'
  | 'search'
  | 'reset'
  | 'template'
  | 'custom';

export declare type ColumnType = 'text' | 'component' | 'html' | 'template';

export class FieldDefinition<T = any> {
  value?: T;
  valueLabel?: string;
  defaultValue?: T;
  defaultValueLabel?: string;
  key: string;
  label: string;
  dateRangeConfig?: DateRangeConfig<T>;
  isDefaultSearchField?: boolean;
  required?: boolean;
  disabled?: boolean;
  order?: number;
  icon?: string;
  controlType?: ControlType = 'textbox';
  type?: FieldType = 'string';
  editor?: 'numeric' | 'boolean' | ''; // this attribut is for Kendo-Grid
  options?: { label: string; value: T }[];
  valueOptions?: string[];
  valuePrimitive?: boolean; // for kendo dropdown
  textField?: string; // for kendo dropdown
  valueField?: string; // for kendo dropdown
  errorMessage?: string;
  width?: string;
  valueChangeCallback?: (value: T) => void;
  columnType?: ColumnType;
  body?: any;

  constructor(options: Partial<FieldDefinition<T>> = {}) {
    this.value = options.value;
    this.valueLabel = options.valueLabel;
    this.defaultValue = options.defaultValue;
    this.defaultValueLabel = options.defaultValueLabel;
    this.key = options.key || '';
    this.label = options.label || '';
    this.dateRangeConfig = options.dateRangeConfig;
    this.isDefaultSearchField = options.isDefaultSearchField;
    this.required = !!options.required;
    this.disabled = options.disabled;
    this.order = options.order === undefined ? 1 : options.order;
    this.icon = options.icon;
    this.controlType = options.controlType || 'textbox';
    this.type = options.type || 'string';
    this.editor = options.editor || '';
    this.options = options.options || [];
    this.valueOptions = options.valueOptions || [];
    this.valuePrimitive = options.valuePrimitive;
    this.textField = options.textField;
    this.valueField = options.valueField;
    this.errorMessage = options.errorMessage || '';
    this.width = options.width;
    this.valueChangeCallback = options.valueChangeCallback;
    this.columnType = options.columnType;
    this.body = options.body;
  }
}
