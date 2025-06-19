import {
  AfterContentInit,
  ChangeDetectionStrategy,
  Component,
  ContentChild,
  ContentChildren,
  EmbeddedViewRef,
  EventEmitter,
  inject,
  Injector,
  input,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  output,
  Output,
  QueryList,
  SimpleChanges,
  TemplateRef,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
} from '@angular/core';
import { ColumnDefinition, Pagination, TableCellIndex } from '../../../models';
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
import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import {
  DatePipe,
  DecimalPipe,
  NgClass,
  NgComponentOutlet,
  NgTemplateOutlet,
} from '@angular/common';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { GetTotalPipe } from '../../../pipes';
import { DYNAMIC_INPUT } from '../../../inputs';

@Component({
  selector: 'acp-mat-dynamic-table',
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
    NgComponentOutlet,
  ],
  templateUrl: './mat-dynamic-table.component.html',
  styleUrl: './mat-dynamic-table.component.css',
  animations: [
    trigger('detailExpand', [
      state('collapsed,void', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition(
        'expanded <=> collapsed',
        animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)'),
      ),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class MatDynamicTableComponent<T>
  implements AfterContentInit, OnChanges, OnInit, OnDestroy
{
  private viewContainerRef = inject(ViewContainerRef);
  private injector = inject(Injector);
  private embeddedViews: EmbeddedViewRef<any>[] = [];

  @Input() showExpand = false;
  @Input() showFooter: boolean = false;
  @Input() locale: string = '';
  @Input() highlightRowIndex: number = 0;

  @Input() visibleColumns: string[] = [];
  @Input() columnDefinitions: ColumnDefinition[] = [];

  columnsToDisplayWithExpand = this.showExpand
    ? [...this.visibleColumns, 'expand']
    : this.visibleColumns;

  @Input() showSelectBox: boolean = false;
  @Input() tableData: T[] = [];
  @Output() rowSelected = new EventEmitter<T[]>();
  @Output() copyRow = new EventEmitter<T>();
  showExpanded = output<T>();
  hideExpanded = output<T>();

  dataSource = new MatTableDataSource<T>([]);
  selection: SelectionModel<T> = new SelectionModel<T>(true, []);

  @ContentChildren(MatHeaderRowDef) headerRowDefs!: QueryList<MatHeaderRowDef>;
  @ContentChildren(MatRowDef) rowDefs!: QueryList<MatRowDef<T>>;
  @ContentChildren(MatFooterRowDef) footerRowDefs!: QueryList<MatFooterRowDef>;
  @ContentChildren(MatColumnDef) columnDefs!: QueryList<MatColumnDef>;
  @ContentChild(MatNoDataRow) noDataRow!: MatNoDataRow;

  @ViewChild(MatTable, { static: true }) table!: MatTable<T>;

  // @ViewChildren('matrow', { read: ViewContainerRef })
  @ContentChildren(ViewContainerRef)
  rows!: QueryList<ViewContainerRef>;
  // Query for ViewContainerRefs

  @Input() templateOp!: any | null;
  @Input() expandedDetail!: any | null;

  expandedElement!: T | null;

  enablePagination = input(false);
  pageEvent = output<PageEvent>();
  paginationConfig = input<Pagination>();

  handlePageEvent(e: PageEvent) {
    this.pageEvent.emit(e);
  }

  isLoadingData = input<boolean>(false);

  ngAfterContentInit(): void {
    this.columnDefs.forEach((columnDef) => this.table.addColumnDef(columnDef));
    this.rowDefs.forEach((rowDef) => this.table.addRowDef(rowDef));
    this.headerRowDefs.forEach((headerRowDef) =>
      this.table.addHeaderRowDef(headerRowDef),
    );

    if (this.showFooter) {
      this.footerRowDefs.forEach((footerRowDef) =>
        this.table.addFooterRowDef(footerRowDef),
      );
    } else {
      this.footerRowDefs.forEach((footerRowDef) =>
        this.table.removeFooterRowDef(footerRowDef),
      );
    }
    // init grid state
    this.selection = new SelectionModel<T>(true, []);
    this.table.setNoDataRow(this.noDataRow);
  }

  ngOnInit(): void {
    if (!this.visibleColumns) {
      this.visibleColumns = this.columnDefinitions.map((col) => col.key);
      this.columnDefinitions.forEach((col, index) => (col.index = index));
    }

    if (this.showSelectBox && this.visibleColumns.indexOf('select') < 0) {
      this.visibleColumns = ['select', ...this.visibleColumns];
    }
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['tableData']?.currentValue && changes['tableData']) {
      this.dataSource = new MatTableDataSource<T>(this.tableData);
    }
  }

  public createInjector = (element: any): Injector =>
    Injector.create({
      providers: [
        {
          //please note that the STATUS_INPUT is a token that we define in the status-input.ts file
          provide: DYNAMIC_INPUT,
          // here we pass the element that we want to use
          useValue: element,
        },
      ],
      parent: this.injector,
    });

  createEmbeddedView(column: any, element: any): void {
    console.log(column);
    const templateRef = column.body as TemplateRef<any>;

    // Create context for the template
    const context = {
      $implicit: element,
      ...column.body,
    };

    // Create the embedded view
    const viewRef = templateRef.createEmbeddedView(context);
    this.embeddedViews.push(viewRef);

    // Attach to the view container
    this.viewContainerRef.insert(viewRef);
  }

  moveNextRow(cell: TableCellIndex): void {
    console.log('moveNextRow(): ' + JSON.stringify(cell));
  }

  selectRow(row: T): void {
    // this.rowSelected.emit(row);
    this.rowSelected.emit(this.selection.selected);
  }

  // ----START CHECKBOX LOGIC

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  /** The label for the checkbox on the passed row */
  checkboxLabel(row?: T): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.selection.isSelected(row) ? 'deselect' : 'select'} row`; //  ${row.id + 1}
  }

  // ----END CHECKBOX LOGIC

  showElement(index: number, height: number): void {
    const row = this.rows.toArray()[index]; // .find(row => row.element.nativeElement.getAttribute('position') === indexstr);
    if (row != null) {
      const rect = row.element.nativeElement.getBoundingClientRect();
      if (rect.y <= 0 || rect.y + rect.height > height) {
        row.element.nativeElement.scrollIntoView(false, {
          behavior: 'instant',
        });
      }
      return;
    }
    console.log('not found');
  }

  onHighlightedRowChange(event: KeyboardEvent): void {
    // let rect     = event.target.getBoundingClientRect();
    let focused = this.dataSource.data[this.highlightRowIndex];
    const x: number = this.dataSource.data.indexOf(focused);
    const l: number = this.dataSource.data.length;
    if (event.keyCode === 38) {
      // Up
      if (x > 0) {
        focused = this.dataSource.data[x - 1];
      }
    } else if (event.keyCode === 40) {
      // Down
      if (x < l - 1) {
        focused = this.dataSource.data[x + 1];
      }
    }
    if (focused != null) {
      this.showElement(this.highlightRowIndex, 35); // $table-row-height = 35px // rect.height
    }
  }

  getRowColor(element: any): string {
    return element.colorRow ? element.colorRow : ''; // Return empty string if no color is defined
  }

  onExpand($event: any, element: T) {
    $event.stopPropagation();
    this.expandedElement = this.expandedElement === element ? null : element;
    if (this.expandedElement) {
      this.showExpanded.emit(element);
    } else {
      this.hideExpanded.emit(element);
    }
  }

  ngOnDestroy(): void {
    // Clean up components and views to prevent memory leaks
    this.embeddedViews.forEach((view) => view.destroy());
  }
}
