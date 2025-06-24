import { FieldDefinition } from './field-definition.model';
import { TemplateRef } from '@angular/core';

// column-definition.model.ts
export interface TableContext<T = any> {
  $implicit: T;
  index?: number;
}


export class ColumnDefinition<T = any> extends FieldDefinition<T> {
  index?: number; // if the list of columns will be displayed in material edit-grid (angular material grid), index must be given
  format?: any; // it could be: { style: 'currency', currency: 'EUR' }, { date: 'short' }
  hasFooter?: boolean;
  hideInOverlay?: boolean;

  // optionsAttribut is used in stock-receipt maintenance: StockReceiptItem.Unit has options for StockReceiptItem.Birimi
  optionsAttribut?: string; // name of the attribut that has the options list for dropdown
  templateOutlet?: TemplateRef<TableContext<T>>;
  constructor(options: Partial<ColumnDefinition<T>> = {}) {
    super(options);
    this.index = options.index;
    this.format = options.format;
    this.hasFooter = options.hasFooter;
    this.hideInOverlay = options.hideInOverlay;
    this.optionsAttribut = options.optionsAttribut;
    this.templateOutlet = options.templateOutlet;
  }
}
