import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
// Remove ArrayUtils import since it doesn't exist in core
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';

@Component({
  selector: 'app-array-utils-demo',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatDividerModule,
    MatTableModule,
  ],
  templateUrl: './array-utils-demo.component.html',
  styleUrl: './array-utils-demo.component.scss',
})
export class ArrayUtilsDemoComponent {
  testArray: any[] = [1, 2, 3, 4, 5];
  newItem = '';
  insertIndex = 0;
  candidates = [1, 2];
  takeN = 2;
  result: any = '';

  // Mock ArrayUtils methods
  checkIsEmpty() {
    this.result = this.testArray.length === 0;
  }

  checkIsNotEmpty() {
    this.result = this.testArray.length > 0;
  }

  checkContains() {
    this.result = this.testArray.includes(this.newItem);
  }

  checkContainsAny() {
    this.result = this.candidates.some(item => this.testArray.includes(item));
  }

  checkContainsAll() {
    this.result = this.candidates.every(item => this.testArray.includes(item));
  }

  insertItem() {
    const success = this.insertIndex >= 0 && this.insertIndex <= this.testArray.length;
    if (success) {
      this.testArray.splice(this.insertIndex, 0, this.newItem);
    }
    this.result = success ? 'Inserted successfully' : 'Insert failed';
  }

  removeItem() {
    const success = this.testArray.includes(this.newItem);
    if (success) {
      const index = this.testArray.indexOf(this.newItem);
      this.testArray.splice(index, 1);
    }
    this.result = success ? 'Removed successfully' : 'Item not found';
  }

  maxItem() {
    if (this.testArray.length === 0) {
      this.result = 'Array is empty';
      return;
    }
    const max = Math.max(...this.testArray);
    this.result = `Max: ${max}`;
  }

  minItem() {
    if (this.testArray.length === 0) {
      this.result = 'Array is empty';
      return;
    }
    const min = Math.min(...this.testArray);
    this.result = `Min: ${min}`;
  }

  takeItems() {
    const items = this.testArray.slice(0, this.takeN);
    this.result = `First ${this.takeN} items: [${items.join(', ')}]`;
  }

  takeRightItems() {
    const items = this.testArray.slice(-this.takeN);
    this.result = `Last ${this.takeN} items: [${items.join(', ')}]`;
  }
}