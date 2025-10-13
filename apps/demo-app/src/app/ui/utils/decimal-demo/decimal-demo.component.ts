import { Component } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatTab, MatTabGroup } from '@angular/material/tabs';
import { JsonPipe } from '@angular/common';
import { DecimalConverter, DecimalError } from '@acontplus/utils';
import { Button } from '@acontplus/ng-components';

@Component({
  selector: 'app-decimal-demo',
  imports: [
    MatCardModule,
    MatTableModule,
    MatExpansionModule,
    MatButtonModule,
    MatToolbarModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabGroup,
    MatTab,
    JsonPipe,
    Button,
  ],
  templateUrl: './decimal-demo.component.html',
})
export class DecimalDemoComponent {
  constructor() {
    DecimalConverter.configure({
      precision: 2,
      rounding: 4, // ROUND_HALF_UP
      returnAsNumber: true,
      throwOnInfinity: true,
      throwOnNaN: true,
    });
  }

  // === BÁSICAS ===
  basicA = 0.1;
  basicB = 0.2;
  basicResult: any;

  calculateBasic() {
    const suma = DecimalConverter.add(this.basicA, this.basicB);
    const potencia = DecimalConverter.power(this.basicA, this.basicB);
    const raiz = DecimalConverter.sqrt(this.basicA);
    const multp = DecimalConverter.multiply(this.basicA, this.basicB);
    this.basicResult = { suma, potencia, raiz, multp };
  }

  // === FINANCIERAS ===
  precio = 1000;
  descuento = 15;
  impuesto = 16;
  interesPrincipal = 1000;
  interesTasa = 5;
  interesAnios = 2;
  interesCompuesto = 12;
  financialResult: any;

  calculateFinancial() {
    const conDescuento = DecimalConverter.applyDiscount(this.precio, this.descuento);
    const conImpuestos = DecimalConverter.addTax(conDescuento, this.impuesto);
    const interes = DecimalConverter.compoundInterest(
      this.interesPrincipal,
      this.interesTasa,
      this.interesAnios,
      this.interesCompuesto,
    );
    this.financialResult = { conDescuento, conImpuestos, interes };
  }

  // === ARRAYS ===
  arrayValores = '0.1,0.2,0.3';
  arrayResult: any;

  calculateArray() {
    const valores = this.arrayValores.split(',').map(v => parseFloat(v.trim()));
    this.arrayResult = {
      suma: DecimalConverter.sum(valores),
      promedio: DecimalConverter.average(valores),
      mediana: DecimalConverter.median(valores),
      minimo: DecimalConverter.min(valores),
      maximo: DecimalConverter.max(valores),
    };
  }

  // === CADENA ===
  chainValue = 1000;
  chainDescuento = 10;
  chainImpuesto = 16;
  chainResult = '';

  calculateChain() {
    this.chainResult = DecimalConverter.chain(this.chainValue)
      .applyDiscount(this.chainDescuento)
      .addTax(this.chainImpuesto)
      .round(2)
      .format({ thousandsSeparator: ',', prefix: '$', suffix: ' USD' });
  }

  // === FORMATEO ===
  formatValue = 1234.5678;
  formatPrecision = 2;
  formatResult = '';

  calculateFormat() {
    this.formatResult = DecimalConverter.format(this.formatValue, {
      precision: this.formatPrecision,
      thousandsSeparator: '.',
      decimalSeparator: ',',
      prefix: '€ ',
      suffix: ' EUR',
    });
  }

  // === VALIDACIÓN ===
  validationInput = '123.45';
  validationResult: any;

  calculateValidation() {
    this.validationResult = {
      valido: DecimalConverter.isValid(this.validationInput),
      noValido: DecimalConverter.isValid('abc'),
    };
  }

  // === ERRORES ===
  errorResult = '';

  calculateError() {
    try {
      DecimalConverter.divide(10, 0);
    } catch (error) {
      if (error instanceof DecimalError) {
        this.errorResult = `Error en operación ${error.operation}: ${error.message}`;
      }
    }
  }

  // === HISTORIAL ===
  historyValue = 100;
  historyMultiply = 1.16;
  historySubtract = 50;
  historyResult: string[] = [];

  calculateHistory() {
    const cadena = DecimalConverter.chain(this.historyValue)
      .multiply(this.historyMultiply)
      .subtract(this.historySubtract)
      .round(2);
    this.historyResult = cadena.getOperationHistory();
  }
}
