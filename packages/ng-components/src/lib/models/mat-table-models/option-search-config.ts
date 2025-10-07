import { ColumnDefinition } from './column-definition';

export interface OptionSearchConfig {
  displayedColumns?: string[];
  displayColumnDefs?: ColumnDefinition[];
  close?: boolean;
}
