import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { NumberFormatter } from '@acontplus/utils';
import { ButtonComponent } from '@acontplus/ng-components';

@Component({
  selector: 'app-number-utils-demo',
  imports: [
    MatCardModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    MatButtonModule,
    ButtonComponent,
  ],
  templateUrl: './number-utils-demo.component.html',
  styleUrl: './number-utils-demo.component.scss',
})
export class NumberUtilsDemoComponent {
  value: any = '';
  num1 = 0;
  num2 = 0;
  fractionDigits = 2;

  result = '';

  checkIsInteger() {
    this.result = NumberFormatter.isInteger(this.value)
      ? `${this.value} es un entero`
      : `${this.value} NO es un entero`;
  }

  checkIsSafeInteger() {
    this.result = NumberFormatter.isSafeInteger(this.value)
      ? `${this.value} es un entero seguro`
      : `${this.value} NO es un entero seguro`;
  }

  formatToFixed() {
    this.result = `Resultado: ${NumberFormatter.toFixed(this.value, this.fractionDigits, 'N/A')}`;
  }

  compareNumbers() {
    const cmp = NumberFormatter.compare(this.num1, this.num2);
    this.result =
      cmp === 0
        ? `${this.num1} es igual a ${this.num2}`
        : cmp < 0
          ? `${this.num1} es menor que ${this.num2}`
          : `${this.num1} es mayor que ${this.num2}`;
  }
}
