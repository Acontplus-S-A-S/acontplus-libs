import { ColumnDefinition } from './column-definition';

export interface OptionSearchConfig<T> {
  displayedColumns?: string[];
  displayColumnDefs?: ColumnDefinition[];
  close?: boolean;
}
