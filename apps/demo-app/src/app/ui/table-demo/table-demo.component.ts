import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import {
  DynamicTableComponent,
  TabulatorTableComponent,
  ColumnDefinition,
} from '@acontplus/ng-components';

interface DemoData {
  id: number;
  name: string;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  rowStyle?: { backgroundColor?: string; color?: string; [key: string]: any };
  disableSelection?: boolean;
}

@Component({
  selector: 'app-table-demo',
  standalone: true,
  imports: [CommonModule, MatCardModule, DynamicTableComponent, TabulatorTableComponent],
  template: `
    <div class="demo-container">
      <mat-card>
        <mat-card-header>
          <mat-card-title>Dynamic Table with Row Styling</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <acp-dynamic-table
            [tableData]="demoData"
            [columnDefinitions]="columns"
            [showSelectBox]="true"
            [multipleSelection]="true"
            (rowSelected)="onRowSelected($event)"
          />
        </mat-card-content>
      </mat-card>

      <mat-card>
        <mat-card-header>
          <mat-card-title>Tabulator Table with Row Styling</mat-card-title>
        </mat-card-header>
        <mat-card-content>
          <acp-tabulator-table [data]="demoData" [columns]="tabulatorColumns" [height]="300" />
        </mat-card-content>
      </mat-card>
    </div>
  `,
  styles: [
    `
      .demo-container {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        padding: 1rem;
      }
    `,
  ],
})
export class TableDemoComponent {
  demoData: DemoData[] = [
    {
      id: 1,
      name: 'Task Alpha',
      status: 'pending',
      rowStyle: this.getRowStyleForStatus('pending'),
    },
    {
      id: 2,
      name: 'Task Beta',
      status: 'processing',
      rowStyle: this.getRowStyleForStatus('processing'),
      disableSelection: true,
    },
    {
      id: 3,
      name: 'Task Gamma',
      status: 'completed',
      rowStyle: this.getRowStyleForStatus('completed'),
    },
    {
      id: 4,
      name: 'Task Delta',
      status: 'failed',
      rowStyle: this.getRowStyleForStatus('failed'),
    },
  ];

  columns: ColumnDefinition<DemoData>[] = [
    { key: 'id', label: 'ID', type: 'number' },
    { key: 'name', label: 'Name', type: 'string' },
    { key: 'status', label: 'Status', type: 'string' },
  ];

  tabulatorColumns = [
    { title: 'ID', field: 'id', width: 80 },
    { title: 'Name', field: 'name', width: 200 },
    { title: 'Status', field: 'status', width: 120 },
  ];

  private getRowStyleForStatus(status: DemoData['status']): Record<string, string> {
    const isDark = document.documentElement.classList.contains('dark-theme');

    switch (status) {
      case 'pending':
        return isDark
          ? { backgroundColor: '#3d2914', color: '#ffb74d' }
          : { backgroundColor: '#fff3e0', color: '#e65100' };
      case 'processing':
        return isDark
          ? { backgroundColor: '#1a237e', color: '#90caf9' }
          : { backgroundColor: '#e3f2fd', color: '#1565c0' };
      case 'completed':
        return isDark
          ? { backgroundColor: '#1b5e20', color: '#81c784' }
          : { backgroundColor: '#e8f5e8', color: '#2e7d32' };
      case 'failed':
        return isDark
          ? { backgroundColor: '#b71c1c', color: '#ffcdd2' }
          : { backgroundColor: '#ffebee', color: '#c62828' };
      default:
        return {};
    }
  }

  onRowSelected(rows: DemoData[]): void {
    console.info('Selected rows:', rows);
  }
}
