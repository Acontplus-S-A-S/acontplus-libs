// Remove DateUtils import since it doesn't exist in core
import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-date-utils-demo',
  imports: [
    MatDatepickerModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatButtonModule,
  ],
  templateUrl: './date-utils-demo.component.html',
  styleUrl: './date-utils-demo.component.scss',
})
export class DateUtilsDemoComponent {
  selectedDate = new Date();
  secondDate = new Date();
  yearsToAdd = 1;
  monthsToAdd = 1;
  daysToAdd = 1;
  hoursToAdd = 1;
  minutesToAdd = 1;
  secondsToAdd = 1;
  format = 'yyyy-MM-dd';
  formatString = 'yyyy-MM-dd';
  result = '';

  // Mock DateUtils methods
  addYears() {
    this.selectedDate = new Date(this.selectedDate.getFullYear() + this.yearsToAdd, this.selectedDate.getMonth(), this.selectedDate.getDate());
    this.result = `Nueva fecha: ${this.selectedDate.toISOString()}`;
  }

  addMonths() {
    this.selectedDate = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + this.monthsToAdd, this.selectedDate.getDate());
    this.result = `Nueva fecha: ${this.selectedDate.toISOString()}`;
  }

  addDays() {
    this.selectedDate = new Date(this.selectedDate.getTime() + this.daysToAdd * 24 * 60 * 60 * 1000);
    this.result = `Nueva fecha: ${this.selectedDate.toISOString()}`;
  }

  addHours() {
    this.selectedDate = new Date(this.selectedDate.getTime() + this.hoursToAdd * 60 * 60 * 1000);
    this.result = `Nueva fecha: ${this.selectedDate.toISOString()}`;
  }

  addMinutes() {
    this.selectedDate = new Date(this.selectedDate.getTime() + this.minutesToAdd * 60 * 1000);
    this.result = `Nueva fecha: ${this.selectedDate.toISOString()}`;
  }

  addSeconds() {
    this.selectedDate = new Date(this.selectedDate.getTime() + this.secondsToAdd * 1000);
    this.result = `Nueva fecha: ${this.selectedDate.toISOString()}`;
  }

  compareDates() {
    const cmp = this.selectedDate.getTime() - this.secondDate.getTime();
    this.result = cmp > 0 ? 'First date is later' : cmp < 0 ? 'Second date is later' : 'Dates are equal';
  }

  formatDate() {
    this.result = this.selectedDate.toISOString();
  }

  formatUTCDate() {
    this.result = this.selectedDate.toUTCString();
  }

  isValidDate() {
    this.result = this.selectedDate instanceof Date && !isNaN(this.selectedDate.getTime()) ? 'Fecha válida' : 'Fecha inválida';
  }

  getToday() {
    this.selectedDate = new Date();
    this.result = `Hoy: ${this.selectedDate.toISOString()}`;
  }

  isSame(unit?: string) {
    this.result = this.selectedDate.getTime() === this.secondDate.getTime() ? 'Las fechas son iguales' : 'Las fechas son diferentes';
  }

  getDayOfWeek() {
    const day = this.selectedDate.getDay();
    const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
    this.result = `Día de la semana: ${days[day]}`;
  }

  getDaysInMonth() {
    const days = new Date(this.selectedDate.getFullYear(), this.selectedDate.getMonth() + 1, 0).getDate();
    this.result = `Días en el mes: ${days}`;
  }

  dateToTimestamp() {
    const timestamp = this.selectedDate.getTime();
    this.result = `Timestamp: ${timestamp}`;
  }

  timestampToDate(timestamp: number) {
    this.selectedDate = new Date(timestamp);
    this.result = `Fecha: ${this.selectedDate.toISOString()}`;
  }

  isInTimeRange(start: any, end: any) {
    this.result = 'Time range check not implemented';
  }
}