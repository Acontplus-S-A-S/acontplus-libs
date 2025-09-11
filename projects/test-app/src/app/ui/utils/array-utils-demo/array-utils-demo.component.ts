import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ArrayUtils } from '@acontplus-core';
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
    ReactiveFormsModule,
    FormsModule,
    MatButtonModule,
    MatDividerModule,
    MatTableModule,
  ],
  templateUrl: './array-utils-demo.component.html',
  styleUrl: './array-utils-demo.component.scss',
})
export class ArrayUtilsDemoComponent {
  testArray: any[] = [1, 2, 3, 4, 5];
  newItem: any = '';
  insertIndex = 0;
  takeN: number | null = null;

  result = '';

  // -----------------------
  // Métodos de ArrayUtils
  // -----------------------
  checkIsEmpty() {
    this.result = ArrayUtils.isEmpty(this.testArray)
      ? 'El array está vacío'
      : 'El array tiene elementos';
  }

  checkIsNotEmpty() {
    this.result = ArrayUtils.isNotEmpty(this.testArray)
      ? 'El array tiene elementos'
      : 'El array está vacío';
  }

  checkContains() {
    this.result = ArrayUtils.contains(this.testArray, this.newItem)
      ? `El array contiene ${this.newItem}`
      : `El array NO contiene ${this.newItem}`;
  }

  checkContainsAny() {
    const candidates = this.newItem
      .toString()
      .split(',')
      .map((x: any) => x.trim());
    this.result = ArrayUtils.containsAny(this.testArray, candidates)
      ? `El array contiene alguno de [${candidates}]`
      : `El array NO contiene ninguno de [${candidates}]`;
  }

  checkContainsAll() {
    const candidates = this.newItem
      .toString()
      .split(',')
      .map((x: any) => x.trim());
    this.result = ArrayUtils.containsAll(this.testArray, candidates)
      ? `El array contiene todos [${candidates}]`
      : `El array NO contiene todos [${candidates}]`;
  }

  insertItem() {
    const success = ArrayUtils.insert(this.testArray, this.insertIndex, this.newItem);
    this.result = success
      ? `Insertado ${this.newItem} en posición ${this.insertIndex}`
      : `No se pudo insertar ${this.newItem}`;
  }

  removeItem() {
    const success = ArrayUtils.remove(this.testArray, this.newItem);
    this.result = success ? `Elemento ${this.newItem} eliminado` : `${this.newItem} no encontrado`;
  }

  maxItem() {
    if (!this.testArray.length) {
      this.result = 'Array vacío';
      return;
    }
    this.result = `Max: ${ArrayUtils.max(this.testArray as number[])}`;
  }

  minItem() {
    if (!this.testArray.length) {
      this.result = 'Array vacío';
      return;
    }
    this.result = `Min: ${ArrayUtils.min(this.testArray as number[])}`;
  }

  takeItems() {
    const n = this.takeN ?? undefined;
    const items = ArrayUtils.take(this.testArray, n);
    this.result = `Take ${n ?? 1}: [${items.join(', ')}]`;
  }

  takeRightItems() {
    const n = this.takeN ?? undefined;
    const items = ArrayUtils.takeRight(this.testArray, n);
    this.result = `TakeRight ${n ?? 1}: [${items.join(', ')}]`;
  }
}
