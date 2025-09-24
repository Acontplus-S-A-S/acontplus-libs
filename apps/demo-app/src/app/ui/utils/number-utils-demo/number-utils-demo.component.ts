import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
// Remove NumberUtils import since it doesn't exist in core
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-number-utils-demo',
  imports: [MatCardModule, MatInputModule, MatFormFieldModule, FormsModule, MatButtonModule],
  templateUrl: './number-utils-demo.component.html',
  styleUrl: './number-utils-demo.component.scss',
})
export class NumberUtilsDemoComponent {
  value = 123.456;
  decimals = 2;
  fractionDigits = 2;
  num1 = 10;
  num2 = 20;
  result = '';

  // Mock NumberUtils methods
  checkIsInteger() {
    this.result = Number.isInteger(this.value) ? 'Es entero' : 'No es entero';
  }

  checkIsSafeInteger() {
    this.result = Number.isSafeInteger(this.value) ? 'Es entero seguro' : 'No es entero seguro';
  }

  formatToFixed() {
    this.result = `Resultado: ${this.value.toFixed(this.fractionDigits)}`;
  }

  compareNumbers() {
    const cmp = this.num1 - this.num2;
    this.result =
      cmp > 0
        ? 'Primer número es mayor'
        : cmp < 0
          ? 'Segundo número es mayor'
          : 'Los números son iguales';
  }
}
