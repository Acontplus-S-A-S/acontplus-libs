import { Component } from '@angular/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { DateFormatter, TIME_OF_DAY } from '@acontplus/utils';

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
  // Métodos DateFormatter
  // -----------------------
  addYears() {
    this.selectedDate = DateFormatter.addYears(this.selectedDate, this.yearsToAdd);
    this.result = `Nueva fecha: ${DateFormatter.toString(this.selectedDate, this.formatString)}`;
  }

  addMonths() {
    this.selectedDate = DateFormatter.addMonths(this.selectedDate, this.monthsToAdd);
    this.result = `Nueva fecha: ${DateFormatter.toString(this.selectedDate, this.formatString)}`;
  }

  addDays() {
    this.selectedDate = DateFormatter.addDays(this.selectedDate, this.daysToAdd);
    this.result = `Nueva fecha: ${DateFormatter.toString(this.selectedDate, this.formatString)}`;
  }

  addHours() {
    this.selectedDate = DateFormatter.addHours(this.selectedDate, this.hoursToAdd);
    this.result = `Nueva fecha: ${DateFormatter.toString(this.selectedDate, this.formatString)}`;
  }

  addMinutes() {
    this.selectedDate = DateFormatter.addMinutes(this.selectedDate, this.minutesToAdd);
    this.result = `Nueva fecha: ${DateFormatter.toString(this.selectedDate, this.formatString)}`;
  }

  addSeconds() {
    this.selectedDate = DateFormatter.addSeconds(this.selectedDate, this.secondsToAdd);
    this.result = `Nueva fecha: ${DateFormatter.toString(this.selectedDate, this.formatString)}`;
  }

  compareDates() {
    const cmp = DateFormatter.compare(this.selectedDate, this.secondDate);
    this.result =
      cmp === 0 ? 'Fechas iguales' : cmp < 0 ? 'La primera es menor' : 'La primera es mayor';
  }

  formatDate() {
    this.result = DateFormatter.toString(this.selectedDate, this.formatString);
  }

  formatUTCDate() {
    this.result = DateFormatter.toUTCString(this.selectedDate, this.formatString);
  }

  getToday() {
    this.selectedDate = DateFormatter.getToday();
    this.result = `Hoy: ${DateFormatter.toString(this.selectedDate, this.formatString)}`;
  }

  isValidDate() {
    this.result = DateFormatter.isValid(this.selectedDate) ? 'Fecha válida' : 'Fecha inválida';
  }

  isSame(unit: 'year' | 'month' | 'day' | 'hour' | 'minute' | 'second' | 'millisecond') {
    this.result = DateFormatter.isSame(this.selectedDate, this.secondDate, unit)
      ? 'Fechas iguales'
      : 'Fechas diferentes';
  }

  getDayOfWeek() {
    const day = DateFormatter.getDayOfWeek(this.selectedDate);
    this.result = `Día de la semana: ${day}`;
  }

  getDaysInMonth() {
    const days = DateFormatter.getDaysInMonth(this.selectedDate);
    this.result = `Días en el mes: ${days}`;
  }

  dateToTimestamp() {
    this.result = `Timestamp: ${DateFormatter.dateToTimestamp(this.selectedDate)}`;
  }

  timestampToDate(timestamp: number) {
    this.selectedDate = DateFormatter.timestampToDate(timestamp);
    this.result = `Fecha: ${DateFormatter.toString(this.selectedDate, this.formatString)}`;
  }

  isInTimeRange(start: TIME_OF_DAY, end: TIME_OF_DAY) {
    this.result = DateFormatter.isInTimeRange(this.selectedDate, start, end)
      ? 'Dentro del rango'
      : 'Fuera del rango';
  }
}
