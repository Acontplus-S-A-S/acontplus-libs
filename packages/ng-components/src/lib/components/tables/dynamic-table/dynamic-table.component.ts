import {
  AfterContentInit,
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  SimpleChanges,
  TemplateRef,
  ViewContainerRef,
  ComponentRef,
  EmbeddedViewRef,
  input,
  output,
  contentChildren,
  viewChild,
  ViewEncapsulation,
} from '@angular/core';
import {
  MatColumnDef,
  MatFooterRowDef,
  MatHeaderRowDef,
  MatRowDef,
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';

import { DatePipe, DecimalPipe, NgClass, NgStyle, NgTemplateOutlet } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { GetTotalPipe } from '../../../pipes';
import { ColumnDefinition, Pagination, TableContext, TableRow } from '../../../models';

@Component({
  selector: 'acp-dynamic-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    NgClass,
    NgStyle,
    GetTotalPipe,
    DatePipe,
    DecimalPipe,
    NgTemplateOutlet,
  ],
  templateUrl: './dynamic-table.component.html',
  styleUrl: './dynamic-table.component.scss',

  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None,
})
export class DynamicTableComponent<T extends TableRow>
  implements AfterContentInit, OnChanges, OnInit, OnDestroy
{
  private componentRefs: ComponentRef<unknown>[] = [];
  private embeddedViews: EmbeddedViewRef<unknown>[] = [];
  private cdr = inject(ChangeDetectorRef);

  readonly showExpand = input(false);
  readonly showFooter = input(false);
  readonly locale = input('en-US');
  readonly highlightRowIndex = input(0);
  @Input() visibleColumns: string[] = [];
  @Input() columnDefinitions: ColumnDefinition<T>[] = [];
  readonly showSelectBox = input(false);
  readonly tableData = input<T[]>([]);
  readonly rowTemplate = input<TemplateRef<TableContext<T>> | null>(null);
  @Input() expandedDetail: TemplateRef<TableContext<T>> | null = null;
  readonly enablePagination = input(false);
  @Input() paginationConfig: Pagination | null = null;
  readonly isLoadingData = input(false);

  readonly rowSelected = output<T[]>();
  readonly copyRow = output<T>();
  readonly showExpanded = output<T>();
  readonly hideExpanded = output<T>();
  readonly pageEvent = output<PageEvent>();

  isNormalRow = (_: number, row: T) => this.expandedElement !== row;
  isExpandedRow = (_: number, row: T) => this.expandedElement === row;

  dataSource = new MatTableDataSource<T>([]);
  selection = new SelectionModel<T>(true, []);
  expandedElement: T | null = null;
  columnsToDisplayWithExpand: string[] = [];

  readonly headerRowDefs = contentChildren(MatHeaderRowDef);
  readonly rowDefs = contentChildren(MatRowDef);
  readonly footerRowDefs = contentChildren(MatFooterRowDef);
  readonly columnDefs = contentChildren(MatColumnDef);

  readonly table = viewChild.required(MatTable);
  readonly rows = contentChildren(ViewContainerRef);

  ngOnInit(): void {
    this.updateColumnsToDisplay();
    this.initializeSelection();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData']) {
      this.updateTableData();
    }

    if (changes['showExpand'] || changes['visibleColumns'] || changes['columnDefinitions']) {
      this.updateColumnsToDisplay();
    }

    // Trigger change detection for OnPush strategy
    this.cdr.markForCheck();
  }

  ngAfterContentInit(): void {
    this.registerTableContent();
    this.initializeTable();
    this.cdr.markForCheck();
  }

  ngOnDestroy(): void {
    this.cleanupDynamicComponents();
  }

  private updateTableData(): void {
    // Clear selection when new data arrives
    this.selection.clear();

    // Update data source
    this.dataSource.data = this.tableData() || [];

    // Reset expanded element if it's no longer in the new data
    if (this.expandedElement && !this.dataSource.data.includes(this.expandedElement)) {
      this.expandedElement = null;
    }

    // Trigger change detection
    this.cdr.markForCheck();
  }

  private updateColumnsToDisplay(): void {
    if (!this.visibleColumns.length && this.columnDefinitions) {
      this.visibleColumns = this.columnDefinitions.map(col => col.key);
      this.columnDefinitions.forEach((col, index) => (col.index = index));
    }

    const newColumns: string[] = [...this.visibleColumns];

    if (this.showSelectBox() && !newColumns.includes('select')) {
      newColumns.unshift('select');
    }

    if (this.showExpand() && this.expandedDetail) {
      if (!this.columnDefinitions?.some(col => col.key === 'expand')) {
        this.columnDefinitions = [
          ...(this.columnDefinitions || []),
          {
            key: 'expand',
            label: '',
            type: 'expand',
            index: this.columnDefinitions?.length || 0,
          },
        ];
      }

      if (!newColumns.includes('expand')) {
        newColumns.push('expand');
      }
    }

    this.columnsToDisplayWithExpand = newColumns;
  }

  private initializeSelection(): void {
    this.selection = new SelectionModel<T>(true, []);
  }

  private registerTableContent(): void {
    this.columnDefs().forEach(columnDef => this.table().addColumnDef(columnDef));
    this.rowDefs().forEach(rowDef => this.table().addRowDef(rowDef));
    this.headerRowDefs().forEach(headerRowDef => this.table().addHeaderRowDef(headerRowDef));

    if (this.showFooter()) {
      this.footerRowDefs().forEach(footerRowDef => this.table().addFooterRowDef(footerRowDef));
    } else {
      this.footerRowDefs().forEach(footerRowDef => this.table().removeFooterRowDef(footerRowDef));
    }
  }

  private initializeTable(): void {
    this.dataSource = new MatTableDataSource<T>(this.tableData() || []);
  }

  private cleanupDynamicComponents(): void {
    this.componentRefs.forEach(ref => ref.destroy());
    this.embeddedViews.forEach(view => view.destroy());
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows && numRows > 0;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selection.clear();
    } else {
      this.dataSource.data.forEach(row => this.selection.select(row));
    }
    this.rowSelected.emit(this.selection.selected);
    this.cdr.markForCheck();
  }

  checkboxLabel(row?: T): string {
    if (!row) {
      return `${this.isAllSelected() ? 'deselect' : 'select'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`;
  }

  selectRow(row: T): void {
    this.selection.toggle(row);
    this.rowSelected.emit(this.selection.selected);
    this.cdr.markForCheck();
  }

  onExpand(event: Event, element: T): void {
    event.stopPropagation();
    this.expandedElement = this.expandedElement === element ? null : element;
    if (this.expandedElement) {
      this.showExpanded.emit(element);
    } else {
      this.hideExpanded.emit(element);
    }
    this.cdr.markForCheck();
  }

  getRowColor(element: T): Record<string, string> {
    return element.colorRow ? { 'background-color': element.colorRow } : {};
  }

  handlePageEvent(e: PageEvent): void {
    this.pageEvent.emit(e);
  }
}
