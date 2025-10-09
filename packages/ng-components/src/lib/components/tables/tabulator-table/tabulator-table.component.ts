// tabulator-table.component.ts
import {
  AfterViewInit,
  Component,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewEncapsulation,
  input,
  output,
} from '@angular/core';

import { Tabulator, PageModule, ReactiveDataModule } from 'tabulator-tables';
import { TabulatorTheme } from '../../../types';

Tabulator.registerModule([PageModule, ReactiveDataModule]);

@Component({
  selector: 'acp-tabulator',
  standalone: true,
  imports: [],
  templateUrl: './tabulator-table.component.html',
  styleUrls: ['./tabulator-table.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class TabulatorTableComponent implements OnChanges, AfterViewInit, OnDestroy {
  // Data inputs
  readonly data = input<any[]>([]);
  readonly columns = input<any[]>([]);

  // Layout inputs
  readonly height = input<string | number | false>('400px');
  readonly layout = input<'fitData' | 'fitColumns' | 'fitDataFill' | 'fitDataStretch'>('fitData');

  // Tree structure inputs
  readonly dataTree = input(false);
  readonly dataTreeChildField = input('children');
  readonly dataTreeStartExpanded = input(false);
  readonly dataTreeSelectPropagate = input(false);

  // Behavior inputs
  readonly selectable = input(true);
  readonly reactiveData = input(true);
  readonly placeholder = input('No data available');
  readonly autoResize = input(true);

  // Theme configuration
  readonly theme = input<TabulatorTheme>({ name: 'default' });

  // Custom styling
  readonly customClass = input('');

  // Custom options
  readonly options = input<Record<string, any>>({});

  // Events
  readonly cellEdited = output<any>();
  readonly rowClick = output<any>();
  readonly rowSelected = output<any>();
  readonly tableReady = output<Tabulator>();

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

    if (changes['customClass'] && !changes['customClass'].isFirstChange()) {
      this.applyCustomClass(changes['customClass'].previousValue, this.customClass());
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
      data: this.data(),
      columns: this.columns(),
      height: this.height(),
      layout: this.layout(),
      dataTree: this.dataTree(),
      dataTreeChildField: this.dataTreeChildField(),
      dataTreeStartExpanded: this.dataTreeStartExpanded(),
      dataTreeSelectPropagate: this.dataTreeSelectPropagate(),
      reactiveData: this.reactiveData(),
      placeholder: this.placeholder(),
      autoResize: this.autoResize(),
      selectable: this.selectable(),
      renderVertical: 'virtual',
      renderVerticalBuffer: 300,
      ...this.options(),
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
    if (this._tabulator) {
      // Tabulator themes are applied via CSS classes on the table element
      const tableElement = this._tabulator.element as HTMLElement;

      // Remove existing theme classes
      tableElement.classList.remove(
        'tabulator-modern',
        'tabulator-midnight',
        'tabulator-simple',
        'tabulator-site',
        'tabulator-site-dark',
      );

      // Add current theme class (skip 'default' as it uses base styles)
      const theme = this.theme();
      if (theme.name !== 'default') {
        tableElement.classList.add(`tabulator-${theme.name}`);
      }

      // Apply custom classes
      this.applyCustomClass('', this.customClass());
    }
  }

  private applyCustomClass(previousClass: string, newClass: string): void {
    if (this._tabulator) {
      const tableElement = this._tabulator.element as HTMLElement;

      // Remove previous custom classes
      if (previousClass) {
        const prevClasses = previousClass.split(' ').filter(cls => cls.trim());
        prevClasses.forEach(cls => tableElement.classList.remove(cls));
      }

      // Add new custom classes
      if (newClass) {
        const newClasses = newClass.split(' ').filter(cls => cls.trim());
        newClasses.forEach(cls => tableElement.classList.add(cls));
      }
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
      this._tabulator.replaceData(this.data());
    }
  }

  private updateColumns(): void {
    if (this._tabulator) {
      this._tabulator.setColumns(this.columns());
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
