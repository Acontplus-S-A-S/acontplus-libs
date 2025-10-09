import { DecimalPipe } from '@angular/common';
// Remove PricingCalculator import since it doesn't exist in core
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { ButtonComponent } from '@acontplus/ng-components';

@Component({
  selector: 'app-pricing-demo',
  imports: [
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    FormsModule,
    DecimalPipe,
    MatButtonModule,
    ButtonComponent,
  ],
  templateUrl: './pricing-demo.component.html',
  styleUrl: './pricing-demo.component.scss',
})
export class PricingDemoComponent {
  calculadora = {
    defaultDecimals: 2,
    tax: {
      getTaxCalculationDetails: (base: number, rate: number) => ({
        base,
        rate,
        total: base * (1 + rate / 100),
      }),
    },
    discount: {
      getDiscountCalculationDetails: (base: number, rate: number) => ({
        base,
        rate,
        total: base * (1 - rate / 100),
      }),
    },
    profit: {
      getProfitCalculationDetails: (base: number, rate: number) => ({
        base,
        rate,
        total: base * (1 + rate / 100),
      }),
    },
    lineItem: {
      calculateLineItemTotal: (price: number, quantity: number) => price * quantity,
    },
  };

  // Escenario 1
  precioBase = 500;
  ivaRate = 21;
  detallesIva: any;

  // Escenario 2
  descuentoPromo = 15;
  detallesDescuento: any;

  // Escenario 3
  costoProducto = 300;
  precioVentaFinal = 514.25;
  detallesGanancia: any;

  // Escenario 4
  linea1: any;
  linea2: any;
  totalFactura = 0;

  calcularEscenario1() {
    this.detallesIva = this.calculadora.tax.getTaxCalculationDetails(this.precioBase, this.ivaRate);
    console.log(this.detallesIva);
  }

  calcularEscenario2() {
    this.detallesDescuento = this.calculadora.discount.getDiscountCalculationDetails(
      605,
      this.descuentoPromo,
    );
    console.log(this.detallesDescuento);
  }

  calcularEscenario3() {
    this.detallesGanancia = this.calculadora.profit.getProfitCalculationDetails(
      this.precioVentaFinal,
      this.costoProducto,
    );
    console.log(this.detallesGanancia);
  }

  calcularEscenario4() {
    this.linea1 = this.calculadora.lineItem.calculateLineItemTotal(500, 2);
    this.linea2 = this.calculadora.lineItem.calculateLineItemTotal(25, 5);
    console.log(this.linea1);
    console.log(this.linea2);
    this.totalFactura = this.linea1.total + this.linea2.total;
  }
}
