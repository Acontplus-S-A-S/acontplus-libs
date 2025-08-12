import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  EventEmitter,
  inject,
  Injector,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewContainerRef,
  ComponentRef,
  EmbeddedViewRef,
} from '@angular/core';
import {
  MatColumnDef,
  MatFooterRowDef,
  MatHeaderRowDef,
  MatNoDataRow,
  MatRowDef,
  MatTable,
  MatTableDataSource,
  MatTableModule,
} from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { DatePipe, DecimalPipe, NgClass, NgTemplateOutlet } from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { GetTotalPipe } from '../../../pipes';
import { ColumnDefinition, Pagination, TableContext } from '../../../models';

@Component({
  selector: 'acp-mat-dynamic-table',
  standalone: true,
  imports: [
    MatTableModule,
    MatCheckboxModule,
    MatSortModule,
    MatIconModule,
    MatButtonModule,
    MatPaginatorModule,
    NgClass,
    GetTotalPipe,
    DatePipe,
    DecimalPipe,
    NgTemplateOutlet,
  ],
  templateUrl: './mat-dynamic-table.component.html',
  styleUrl: './mat-dynamic-table.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatDynamicTableComponent<T extends Record<string, any>>
  implements AfterContentInit, OnChanges, OnInit, OnDestroy
{
  private componentRefs: ComponentRef<any>[] = [];
  private embeddedViews: EmbeddedViewRef<any>[] = [];

  @Input() showExpand = false;
  @Input() showFooter = false;
  @Input() locale = 'en-US';
  @Input() highlightRowIndex = 0;
  @Input() visibleColumns: string[] = [];
  @Input() columnDefinitions: ColumnDefinition<T>[] = [];
  @Input() showSelectBox = false;
  @Input() tableData: T[] = [];
  @Input() rowTemplate: TemplateRef<TableContext<T>> | null = null;
  @Input() expandedDetail: TemplateRef<TableContext<T>> | null = null;
  @Input() enablePagination = false;
  @Input() paginationConfig: Pagination | null = null;
  @Input() isLoadingData = false;

  @Output() rowSelected = new EventEmitter<T[]>();
  @Output() copyRow = new EventEmitter<T>();
  @Output() showExpanded = new EventEmitter<T>();
  @Output() hideExpanded = new EventEmitter<T>();
  @Output() pageEvent = new EventEmitter<PageEvent>();

  isNormalRow = (_: number, row: T) => this.expandedElement !== row;
  isExpandedRow = (_: number, row: T) => this.expandedElement === row;

  dataSource = new MatTableDataSource<T>([]);
  selection = new SelectionModel<T>(true, []);
  expandedElement: T | null = null;
  columnsToDisplayWithExpand: string[] = [];

  @ContentChildren(MatHeaderRowDef) headerRowDefs!: QueryList<MatHeaderRowDef>;
  @ContentChildren(MatRowDef) rowDefs!: QueryList<MatRowDef<T>>;
  @ContentChildren(MatFooterRowDef) footerRowDefs!: QueryList<MatFooterRowDef>;
  @ContentChildren(MatColumnDef) columnDefs!: QueryList<MatColumnDef>;
  @ContentChild(MatNoDataRow) noDataRow!: MatNoDataRow;

  @ViewChild(MatTable, { static: true }) table!: MatTable<T>;
  @ContentChildren(ViewContainerRef) rows!: QueryList<ViewContainerRef>;

  ngOnInit(): void {
    this.updateColumnsToDisplay();
    this.initializeSelection();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData']) {
      this.dataSource.data = this.tableData || [];
    }

    if (changes['showExpand'] || changes['visibleColumns'] || changes['columnDefinitions']) {
      this.updateColumnsToDisplay();
    }
  }

  ngAfterContentInit(): void {
    this.registerTableContent();
    this.initializeTable();
  }

  ngOnDestroy(): void {
    this.cleanupDynamicComponents();
  }

  private updateColumnsToDisplay(): void {
    if (!this.visibleColumns.length && this.columnDefinitions) {
      this.visibleColumns = this.columnDefinitions.map(col => col.key);
      this.columnDefinitions.forEach((col, index) => (col.index = index));
    }

    const newColumns: string[] = [...this.visibleColumns];

    if (this.showSelectBox && !newColumns.includes('select')) {
      newColumns.unshift('select');
    }

    if (this.showExpand && this.expandedDetail) {
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
    this.columnDefs.forEach(columnDef => this.table.addColumnDef(columnDef));
    this.rowDefs.forEach(rowDef => this.table.addRowDef(rowDef));
    this.headerRowDefs.forEach(headerRowDef => this.table.addHeaderRowDef(headerRowDef));

    if (this.showFooter) {
      this.footerRowDefs.forEach(footerRowDef => this.table.addFooterRowDef(footerRowDef));
    } else {
      this.footerRowDefs.forEach(footerRowDef => this.table.removeFooterRowDef(footerRowDef));
    }

    if (this.noDataRow) {
      this.table.setNoDataRow(this.noDataRow);
    }
  }

  private initializeTable(): void {
    this.dataSource = new MatTableDataSource<T>(this.tableData || []);
  }

  private cleanupDynamicComponents(): void {
    this.componentRefs.forEach(ref => ref.destroy());
    this.embeddedViews.forEach(view => view.destroy());
  }

  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach(row => this.selection.select(row));
    this.rowSelected.emit(this.selection.selected);
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
  }

  onExpand(event: Event, element: T): void {
    event.stopPropagation();
    this.expandedElement = this.expandedElement === element ? null : element;
    this.expandedElement ? this.showExpanded.emit(element) : this.hideExpanded.emit(element);
  }

  getRowColor(element: T): Record<string, string> {
    return element['colorRow'] ? { 'background-color': element['colorRow '] } : {};
  }

  handlePageEvent(e: PageEvent): void {
    this.pageEvent.emit(e);
  }
}
