import { DateUtils, TIME_OF_DAY } from '@acontplus-core';
import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-date-utils-demo',
  imports: [
    MatDatepickerModule,
    MatCardModule,
    MatInputModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
  ],
  templateUrl: './date-utils-demo.component.html',
  styleUrl: './date-utils-demo.component.scss',
})
export class DateUtilsDemoComponent {
  selectedDate: Date = new Date();
  secondDate: Date = new Date();
  result = '';

  yearsToAdd = 0;
  monthsToAdd = 0;
  daysToAdd = 0;
  hoursToAdd = 0;
  minutesToAdd = 0;
  secondsToAdd = 0;

  formatString = 'yyyy-MM-dd HH:mm:ss';

  // -----------------------
  // Métodos DateUtils
  // -----------------------
  addYears() {
    this.selectedDate = DateUtils.addYears(this.selectedDate, this.yearsToAdd);
    this.result = `Nueva fecha: ${DateUtils.toString(this.selectedDate, this.formatString)}`;
  }

  addMonths() {
    this.selectedDate = DateUtils.addMonths(this.selectedDate, this.monthsToAdd);
    this.result = `Nueva fecha: ${DateUtils.toString(this.selectedDate, this.formatString)}`;
  }

  addDays() {
    this.selectedDate = DateUtils.addDays(this.selectedDate, this.daysToAdd);
    this.result = `Nueva fecha: ${DateUtils.toString(this.selectedDate, this.formatString)}`;
  }

  addHours() {
    this.selectedDate = DateUtils.addHours(this.selectedDate, this.hoursToAdd);
    this.result = `Nueva fecha: ${DateUtils.toString(this.selectedDate, this.formatString)}`;
  }

  addMinutes() {
    this.selectedDate = DateUtils.addMinutes(this.selectedDate, this.minutesToAdd);
    this.result = `Nueva fecha: ${DateUtils.toString(this.selectedDate, this.formatString)}`;
  }

  addSeconds() {
    this.selectedDate = DateUtils.addSeconds(this.selectedDate, this.secondsToAdd);
    this.result = `Nueva fecha: ${DateUtils.toString(this.selectedDate, this.formatString)}`;
  }

  compareDates() {
    const cmp = DateUtils.compare(this.selectedDate, this.secondDate);
    this.result =
      cmp === 0 ? 'Fechas iguales' : cmp < 0 ? 'La primera es menor' : 'La primera es mayor';
  }

  formatDate() {
    this.result = DateUtils.toString(this.selectedDate, this.formatString);
  }

  formatUTCDate() {
    this.result = DateUtils.toUTCString(this.selectedDate, this.formatString);
  }

  getToday() {
    this.selectedDate = DateUtils.getToday();
    this.result = `Hoy: ${DateUtils.toString(this.selectedDate, this.formatString)}`;
  }

  isValidDate() {
    this.result = DateUtils.isValid(this.selectedDate) ? 'Fecha válida' : 'Fecha inválida';
  }

  isSame(unit: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond') {
    this.result = DateUtils.isSame(this.selectedDate, this.secondDate, unit)
      ? 'Fechas iguales'
      : 'Fechas diferentes';
  }

  getDayOfWeek() {
    const day = DateUtils.getDayOfWeek(this.selectedDate);
    this.result = `Día de la semana: ${day}`;
  }

  getDaysInMonth() {
    const days = DateUtils.getDaysInMonth(this.selectedDate);
    this.result = `Días en el mes: ${days}`;
  }

  dateToTimestamp() {
    this.result = `Timestamp: ${DateUtils.dateToTimestamp(this.selectedDate)}`;
  }

  timestampToDate(timestamp: number) {
    this.selectedDate = DateUtils.timestampToDate(timestamp);
    this.result = `Fecha: ${DateUtils.toString(this.selectedDate, this.formatString)}`;
  }

  isInTimeRange(start: TIME_OF_DAY, end: TIME_OF_DAY) {
    this.result = DateUtils.isInTimeRange(this.selectedDate, start, end)
      ? 'Dentro del rango'
      : 'Fuera del rango';
  }
}
