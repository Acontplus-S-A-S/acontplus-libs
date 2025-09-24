// custom-tabulator.component.ts
import {
  AfterViewInit,
  Component,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewEncapsulation,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { PageModule, ReactiveDataModule, TabulatorFull as Tabulator } from 'tabulator-tables';
import { TabulatorTheme } from '../../../types';

Tabulator.registerModule([PageModule, ReactiveDataModule]);

@Component({
  selector: 'acp-tabulator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './custom-tabulator.component.html',
  styleUrls: ['./custom-tabulator.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CustomTabulatorComponent implements OnChanges, AfterViewInit, OnDestroy {
  // Data inputs
  @Input() data: any[] = [];
  @Input() columns: any[] = [];

  // Layout inputs
  @Input() height: string | number | false = '400px';
  @Input() layout: 'fitData' | 'fitColumns' | 'fitDataFill' | 'fitDataStretch' = 'fitData';

  // Tree structure inputs
  @Input() dataTree = false;
  @Input() dataTreeChildField = 'children';
  @Input() dataTreeStartExpanded = false;
  @Input() dataTreeSelectPropagate = false;

  // Behavior inputs
  @Input() selectable = true;
  @Input() reactiveData = true;
  @Input() placeholder = 'No data available';
  @Input() autoResize = true;

  // Theme configuration
  @Input() theme: TabulatorTheme = { name: 'default' };

  // Custom options
  @Input() options: Record<string, any> = {};

  // Events
  @Output() cellEdited = new EventEmitter<any>();
  @Output() rowClick = new EventEmitter<any>();
  @Output() rowSelected = new EventEmitter<any>();
  @Output() tableReady = new EventEmitter<Tabulator>();

  private _tabulator!: Tabulator;

  // Made public for template access
  public containerId = `acp-tabulator-${Math.random().toString(36).substr(2, 9)}`;

  ngAfterViewInit(): void {
    this.initializeTable();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['data'] && !changes['data'].isFirstChange()) {
      this.updateData();
    }

    if (changes['columns'] && !changes['columns'].isFirstChange()) {
      this.updateColumns();
    }

    if (changes['theme'] && !changes['theme'].isFirstChange()) {
      this.applyTheme();
    }
  }

  ngOnDestroy(): void {
    this.destroyTable();
  }

  private initializeTable(): void {
    if (this._tabulator) {
      this.destroyTable();
    }

    const container = document.getElementById(this.containerId);
    if (!container) {
      console.warn('Tabulator container not found');
      return;
    }

    const config: any = {
      data: this.data,
      columns: this.columns,
      height: this.height,
      layout: this.layout,
      dataTree: this.dataTree,
      dataTreeChildField: this.dataTreeChildField,
      dataTreeStartExpanded: this.dataTreeStartExpanded,
      dataTreeSelectPropagate: this.dataTreeSelectPropagate,
      reactiveData: this.reactiveData,
      placeholder: this.placeholder,
      autoResize: this.autoResize,
      selectable: this.selectable,
      renderVertical: 'virtual',
      renderVerticalBuffer: 300,
      ...this.options,
    };

    try {
      this._tabulator = new Tabulator(container, config);
      this.applyTheme();
      this.registerEvents();
      this.tableReady.emit(this._tabulator);
    } catch (error) {
      console.error('Error initializing Tabulator:', error);
    }
  }

  private applyTheme(): void {
    const container = document.getElementById(this.containerId);
    if (container) {
      // Remove existing theme classes
      container.classList.remove(
        'tabulator-default',
        'tabulator-bootstrap5',
        'tabulator-semanticui',
      );

      // Add current theme class
      container.classList.add(`tabulator-${this.theme.name}`);
    }
  }

  private registerEvents(): void {
    this._tabulator.on('cellEdited', cell => {
      this.cellEdited.emit(cell);
    });

    this._tabulator.on('rowClick', (e, row) => {
      this.rowClick.emit(row);
    });

    this._tabulator.on('rowSelected', row => {
      this.rowSelected.emit(row);
    });
  }

  private updateData(): void {
    if (this._tabulator) {
      this._tabulator.replaceData(this.data);
    }
  }

  private updateColumns(): void {
    if (this._tabulator) {
      this._tabulator.setColumns(this.columns);
    }
  }

  private destroyTable(): void {
    if (this._tabulator) {
      this._tabulator.destroy();
    }
  }

  // Public API methods
  public getInstance(): Tabulator {
    return this._tabulator;
  }

  public redraw(): void {
    if (this._tabulator) {
      this._tabulator.redraw();
    }
  }
}
