import { DecimalError, DecimalOptions, DecimalUtils } from '@acontplus-core';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatTableModule } from '@angular/material/table';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import {MatTab, MatTabGroup} from "@angular/material/tabs";
import {JsonPipe} from "@angular/common";

@Component({
  selector: 'app-decimaldemo',
  imports: [
    MatCardModule,
    MatTableModule,
    MatExpansionModule,
    MatButtonModule,
    MatIcon,
    MatToolbarModule,
    ReactiveFormsModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatTabGroup,
    MatTab,
    JsonPipe
  ],
  templateUrl: './decimaldemo.component.html',
})
export class DecimaldemoComponent   {

  constructor() {
    DecimalUtils.configure({
      precision: 2,
      rounding: 4, // ROUND_HALF_UP
      returnAsNumber: true,
      throwOnInfinity: true,
      throwOnNaN: true
    });
  }

  // === BÁSICAS ===
  basicA = 0.1;
  basicB = 0.2;
  basicResult: any;

  calculateBasic() {
    const suma = DecimalUtils.add(this.basicA, this.basicB);
    const potencia = DecimalUtils.power(this.basicA, this.basicB);
    const raiz = DecimalUtils.sqrt(this.basicA);
    const multp = DecimalUtils.multiply(this.basicA, this.basicB);
    this.basicResult = { suma, potencia, raiz , multp};
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
    const conDescuento = DecimalUtils.applyDiscount(this.precio, this.descuento);
    const conImpuestos = DecimalUtils.addTax(conDescuento, this.impuesto);
    const interes = DecimalUtils.compoundInterest(
      this.interesPrincipal,
      this.interesTasa,
      this.interesAnios,
      this.interesCompuesto
    );
    this.financialResult = { conDescuento, conImpuestos, interes };
  }

  // === ARRAYS ===
  arrayValores = '0.1,0.2,0.3';
  arrayResult: any;

  calculateArray() {
    const valores = this.arrayValores.split(',').map(v => parseFloat(v.trim()));
    this.arrayResult = {
      suma: DecimalUtils.sum(valores),
      promedio: DecimalUtils.average(valores),
      mediana: DecimalUtils.median(valores),
      minimo: DecimalUtils.min(valores),
      maximo: DecimalUtils.max(valores)
    };
  }

  // === CADENA ===
  chainValue = 1000;
  chainDescuento = 10;
  chainImpuesto = 16;
  chainResult='';

  calculateChain() {
    this.chainResult = DecimalUtils.chain(this.chainValue)
      .applyDiscount(this.chainDescuento)
      .addTax(this.chainImpuesto)
      .round(2)
      .format({ thousandsSeparator: ',', prefix: '$', suffix: ' USD' });
  }

  // === FORMATEO ===
  formatValue = 1234.5678;
  formatPrecision = 2;
  formatResult='';

  calculateFormat() {
    this.formatResult = DecimalUtils.format(this.formatValue, {
      precision: this.formatPrecision,
      thousandsSeparator: '.',
      decimalSeparator: ',',
      prefix: '€ ',
      suffix: ' EUR'
    });
  }

  // === VALIDACIÓN ===
  validationInput = '123.45';
  validationResult: any;

  calculateValidation() {
    this.validationResult = {
      valido: DecimalUtils.isValid(this.validationInput),
      noValido: DecimalUtils.isValid("abc")
    };
  }

  // === ERRORES ===
  errorResult='';

  calculateError() {
    try {
      DecimalUtils.divide(10, 0);
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
  historyResult: string[]=[];

  calculateHistory() {
    const cadena = DecimalUtils.chain(this.historyValue)
      .multiply(this.historyMultiply)
      .subtract(this.historySubtract)
      .round(2);
    this.historyResult = cadena.getOperationHistory();
  }
}
