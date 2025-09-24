import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatTableModule } from '@angular/material/table';
import { ArrayHelper } from '@acontplus/utils';

@Component({
  selector: 'app-array-utils-demo',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatTableModule,
  ],
  templateUrl: './array-utils-demo.component.html',
  styleUrl: './array-utils-demo.component.scss',
})
export class ArrayHelperDemoComponent {
  testArray: any[] = [1, 2, 3, 4, 5];
  newItem: any = '';
  insertIndex = 0;
  takeN: number | null = null;

  result = '';

  // -----------------------
  // Métodos de ArrayHelper
  // -----------------------
  checkIsEmpty() {
    this.result = ArrayHelper.isEmpty(this.testArray)
      ? 'El array está vacío'
      : 'El array tiene elementos';
  }

  checkIsNotEmpty() {
    this.result = ArrayHelper.isNotEmpty(this.testArray)
      ? 'El array tiene elementos'
      : 'El array está vacío';
  }

  checkContains() {
    this.result = ArrayHelper.contains(this.testArray, this.newItem)
      ? `El array contiene ${this.newItem}`
      : `El array NO contiene ${this.newItem}`;
  }

  checkContainsAny() {
    const candidates = this.newItem
      .toString()
      .split(',')
      .map((x: any) => x.trim());
    this.result = ArrayHelper.containsAny(this.testArray, candidates)
      ? `El array contiene alguno de [${candidates}]`
      : `El array NO contiene ninguno de [${candidates}]`;
  }

  checkContainsAll() {
    const candidates = this.newItem
      .toString()
      .split(',')
      .map((x: any) => x.trim());
    this.result = ArrayHelper.containsAll(this.testArray, candidates)
      ? `El array contiene todos [${candidates}]`
      : `El array NO contiene todos [${candidates}]`;
  }

  insertItem() {
    const success = ArrayHelper.insert(this.testArray, this.insertIndex, this.newItem);
    this.result = success
      ? `Insertado ${this.newItem} en posición ${this.insertIndex}`
      : `No se pudo insertar ${this.newItem}`;
  }

  removeItem() {
    const success = ArrayHelper.remove(this.testArray, this.newItem);
    this.result = success ? `Elemento ${this.newItem} eliminado` : `${this.newItem} no encontrado`;
  }

  maxItem() {
    if (!this.testArray.length) {
      this.result = 'Array vacío';
      return;
    }
    this.result = `Max: ${ArrayHelper.max(this.testArray as number[])}`;
  }

  minItem() {
    if (!this.testArray.length) {
      this.result = 'Array vacío';
      return;
    }
    this.result = `Min: ${ArrayHelper.min(this.testArray as number[])}`;
  }

  takeItems() {
    const n = this.takeN ?? undefined;
    const items = ArrayHelper.take(this.testArray, n);
    this.result = `Take ${n ?? 1}: [${items.join(', ')}]`;
  }

  takeRightItems() {
    const n = this.takeN ?? undefined;
    const items = ArrayHelper.takeRight(this.testArray, n);
    this.result = `TakeRight ${n ?? 1}: [${items.join(', ')}]`;
  }
}
